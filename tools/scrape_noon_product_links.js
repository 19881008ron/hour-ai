const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const catalogPath = "data/member-products.json";
const manifestPath = "data/noon-link-manifest.csv";
const outPath = "data/noon-scrape-results.json";
const userDataDir = path.join(process.env.TEMP || process.cwd(), `hourai-noon-scrape-${Date.now()}`);
const port = 9300 + Math.floor(Math.random() * 500);

const categoryQueries = {
  mobile: [
    "power bank best seller",
    "wireless earbuds best seller",
    "fast charger phone accessories",
    "mobile accessories"
  ],
  fashion: [
    "abaya best seller",
    "hijab best seller",
    "modest wear",
    "thobe"
  ],
  jewelry: [
    "watch best seller",
    "jewelry set",
    "bracelet necklace",
    "watches jewelry"
  ],
  home: [
    "kitchen appliances best seller",
    "home organizer",
    "cookware set",
    "home kitchen"
  ],
  furniture: [
    "home decor",
    "floor lamp",
    "storage organizer",
    "furniture decor"
  ],
  auto: [
    "car accessories best seller",
    "car phone holder",
    "car vacuum",
    "auto accessories"
  ],
  baby: [
    "baby stroller",
    "baby bottle",
    "diaper bag",
    "mother baby"
  ],
  health: [
    "massage gun",
    "fitness tracker",
    "health wellness",
    "personal care device"
  ],
  sports: [
    "fitness equipment",
    "camping gear",
    "sports outdoor",
    "water bottle"
  ],
  creator: [
    "ring light",
    "wireless microphone",
    "phone tripod",
    "content creator kit"
  ],
  travel: [
    "luggage best seller",
    "travel backpack",
    "travel organizer",
    "travel bags"
  ],
  gaming: [
    "gaming headset",
    "gaming keyboard",
    "gaming mouse",
    "gaming controller"
  ]
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJson(requestPath) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: "127.0.0.1", port, path: requestPath }, (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", reject);
  });
}

function send(ws, method, params = {}) {
  const id = send.nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      ws.removeEventListener("message", onMessage);
      reject(new Error(`CDP timeout: ${method}`));
    }, 20000);
    const onMessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.id !== id) return;
      clearTimeout(timeout);
      ws.removeEventListener("message", onMessage);
      if (payload.error) reject(new Error(JSON.stringify(payload.error)));
      else resolve(payload.result);
    };
    ws.addEventListener("message", onMessage);
  });
}
send.nextId = 1;

async function waitForPage() {
  for (let i = 0; i < 100; i += 1) {
    try {
      const targets = await getJson("/json/list");
      const page = targets.find((target) => target.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome target was not available.");
}

function normalizeProductUrl(href) {
  let url;
  try {
    url = new URL(href, "https://www.noon.com");
  } catch {
    return null;
  }

  if (!url.hostname.endsWith("noon.com")) return null;
  if (!/\/p\/?$/i.test(url.pathname) && !/\/p\//i.test(url.pathname)) return null;
  if (!/[A-Z0-9]{8,}/.test(url.pathname)) return null;

  url.hash = "";
  return url.toString();
}

function makeArabicUrl(enUrl) {
  const url = new URL(enUrl);
  url.pathname = url.pathname.replace("/uae-en/", "/uae-ar/");
  return url.toString();
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

async function extractLinks(ws, query) {
  const searchUrl = `https://www.noon.com/uae-en/search?q=${encodeURIComponent(query)}`;
  console.log(`  search: ${query}`);
  await send(ws, "Page.navigate", { url: searchUrl }).catch(async () => {
    await send(ws, "Runtime.evaluate", { expression: `location.href = ${JSON.stringify(searchUrl)}` });
  });
  await sleep(6000);

  for (let i = 0; i < 7; i += 1) {
    await send(ws, "Runtime.evaluate", {
      expression: "window.scrollBy(0, Math.max(window.innerHeight, 900));"
    });
    await sleep(900);
  }

  const result = await send(ws, "Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      return Array.from(document.querySelectorAll('a[href*="/p/"]'))
        .map((anchor) => ({
          href: anchor.href,
          text: (anchor.innerText || anchor.getAttribute("aria-label") || anchor.title || "").replace(/\\s+/g, " ").trim()
        }))
        .filter((item) => item.href);
    })()`
  });

  return result.result.value
    .map((item) => ({ ...item, href: normalizeProductUrl(item.href) }))
    .filter((item) => item.href);
}

(async () => {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const products = Array.isArray(catalog.products) ? catalog.products : catalog;
  const child = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--disable-extensions",
    "--disable-background-networking",
    `--remote-debugging-port=${port}`,
    "--window-size=1365,900",
    `--user-data-dir=${userDataDir}`,
    "about:blank"
  ], { stdio: "ignore" });

  const collected = {};

  try {
    const ws = new WebSocket(await waitForPage());
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", reject, { once: true });
    });
    await send(ws, "Runtime.enable");
    await send(ws, "Page.enable");

    for (const [category, queries] of Object.entries(categoryQueries)) {
      const byUrl = new Map();
      for (const query of queries) {
        if (byUrl.size >= 50) break;
        const links = await extractLinks(ws, query);
        for (const item of links) {
          if (!byUrl.has(item.href)) {
            byUrl.set(item.href, {
              en: item.href,
              ar: makeArabicUrl(item.href),
              text: item.text,
              query
            });
          }
          if (byUrl.size >= 60) break;
        }
      }
      collected[category] = Array.from(byUrl.values()).slice(0, 50);
      console.log(`${category}: ${collected[category].length}`);
    }

    ws.close();
  } finally {
    child.kill();
  }

  const missing = [];
  for (const [category, links] of Object.entries(collected)) {
    const categoryProducts = products.filter((product) => product.category === category);
    categoryProducts.forEach((product, index) => {
      const link = links[index];
      product.noon = {
        en: link?.en || "",
        ar: link?.ar || ""
      };
      if (!link) missing.push(product.id);
    });
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf8");
  fs.writeFileSync(outPath, JSON.stringify({ collected, missing }, null, 2), "utf8");

  const csv = [
    [
      "id",
      "category",
      "title_en",
      "title_ar",
      "noon_english_url",
      "noon_arabic_url",
      "source_platform",
      "status",
      "notes"
    ].join(","),
    ...products.map((product) =>
      [
        product.id,
        product.category,
        product.title?.en || "",
        product.title?.ar || "",
        product.noon?.en || "",
        product.noon?.ar || "",
        "noon",
        product.noon?.en && product.noon?.ar ? "ready" : "pending",
        product.noon?.en && product.noon?.ar ? "Noon UAE product detail link" : "Needs manual Noon link"
      ].map(csvCell).join(",")
    )
  ];

  fs.writeFileSync(manifestPath, csv.join("\n"), "utf8");
  const ready = products.filter((product) => product.noon?.en && product.noon?.ar).length;
  console.log(JSON.stringify({ products: products.length, ready, missing: missing.length }, null, 2));
  process.exit(missing.length ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
