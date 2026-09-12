const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = process.env.QA_ORIGIN || "https://www.hour-ai.com";
const port = 9900 + Math.floor(Math.random() * 400);
const userDataDir = path.join(process.env.TEMP || process.cwd(), `hourai-prelaunch-copy-${Date.now()}`);

const viewports = [
  { name: "desktop-1440", width: 1440, height: 960, mobile: false, scale: 1 },
  { name: "phone-390", width: 390, height: 844, mobile: true, scale: 3 },
  { name: "ipad-820", width: 820, height: 1180, mobile: true, scale: 2 }
];

const typoPatterns = [
  [/\bcommision\b/i, "commission"],
  [/\bcomission\b/i, "commission"],
  [/\badress\b/i, "address"],
  [/\brecieve\b/i, "receive"],
  [/\bseperate\b/i, "separate"],
  [/\bsucess\b/i, "success"],
  [/\bfaild\b/i, "failed"],
  [/\bqualifed\b/i, "qualified"],
  [/\bavailab\b/i, "available"],
  [/\bcryptocurreny\b/i, "cryptocurrency"],
  [/\bAl Editor\b/, "AI Editor"],
  [/\bAl creation\b/, "AI creation"],
  [/\bAl editing\b/, "AI editing"],
  [/\bC-LevelAl\b/, "C-Level AI"],
  [/\bB-LevelAl\b/, "B-Level AI"],
  [/\bA-LevelAl\b/, "A-Level AI"]
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJson(requestPath) {
  return new Promise((resolve, reject) => {
    http.get({ host: "127.0.0.1", port, path: requestPath }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(JSON.parse(body)));
    }).on("error", reject);
  });
}

function send(ws, method, params = {}) {
  const id = send.nextId++;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.id !== id) return;
      ws.removeEventListener("message", onMessage);
      if (payload.error) reject(new Error(JSON.stringify(payload.error)));
      else resolve(payload.result);
    };
    ws.addEventListener("message", onMessage);
  });
}
send.nextId = 1;

async function waitForPage() {
  for (let i = 0; i < 80; i += 1) {
    try {
      const targets = await getJson("/json/list");
      const page = targets.find((target) => target.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error("Chrome target was not available.");
}

async function waitLoaded(ws) {
  for (let i = 0; i < 80; i += 1) {
    const result = await send(ws, "Runtime.evaluate", { returnByValue: true, expression: "document.readyState" });
    if (result.result.value === "complete") return;
    await sleep(100);
  }
}

async function navigate(ws, url) {
  await send(ws, "Page.navigate", { url });
  await waitLoaded(ws);
  await sleep(900);
}

function copyIssues(text, source) {
  const issues = [];
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return issues;
  if (/Select language English العربية 简体中文/.test(clean)) return issues;
  if (/^(https?:\/\/|[\w-]+\.[a-z]{2,})(\b|\/)/i.test(clean)) return issues;
  if (/[\u4e00-\u9fff\u3040-\u30ff\u0600-\u06ff]/.test(clean)) {
    issues.push({ source, reason: "non-english-script-in-english-mode", text: clean });
  }
  if (/\s{2,}/.test(text)) issues.push({ source, reason: "double-space", text: clean });
  if (/\s+[,.!?;:]/.test(clean)) issues.push({ source, reason: "space-before-punctuation", text: clean });
  if (/[A-Za-z][!?][A-Za-z]/.test(clean) || /[A-Za-z]\.[A-Z][a-z]/.test(clean)) {
    issues.push({ source, reason: "missing-space-after-sentence-punctuation", text: clean });
  }
  if (/\bAI\b/.test(clean) === false && /\bAi\b/.test(clean)) issues.push({ source, reason: "ai-capitalization", text: clean });
  typoPatterns.forEach(([pattern, expected]) => {
    if (pattern.test(clean)) issues.push({ source, reason: `possible-typo-use-${expected}`, text: clean });
  });
  return issues;
}

function scanProductCopy() {
  const jsonPath = path.join(process.cwd(), "data", "member-products.json");
  if (!fs.existsSync(jsonPath)) return [];
  const products = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const issues = [];
  const visit = (value, source) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${source}[${index}]`));
      return;
    }
    if (!value || typeof value !== "object") return;
    Object.entries(value).forEach(([key, child]) => {
      if (key === "en" && typeof child === "string" && !/^https?:\/\//i.test(child)) {
        issues.push(...copyIssues(child, `${source}.en`));
      } else {
        visit(child, `${source}.${key}`);
      }
    });
  };
  visit(products, "member-products");
  return issues;
}

(async () => {
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    "--window-size=1440,960",
    `--user-data-dir=${userDataDir}`,
    `${origin}/index.html?skipWelcome=1`
  ], { stdio: "ignore" });

  const failures = scanProductCopy();
  const summaries = [];

  try {
    const ws = new WebSocket(await waitForPage());
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", reject, { once: true });
    });
    await send(ws, "Runtime.enable");
    await send(ws, "Page.enable");

    for (const viewport of viewports) {
      await send(ws, "Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.scale,
        mobile: viewport.mobile
      });

      for (const page of ["index.html", "marketplace.html"]) {
        await navigate(ws, `${origin}/${page}?skipWelcome=1&prelaunch=${Date.now()}`);
        await send(ws, "Runtime.evaluate", {
          expression: `localStorage.setItem("hourAiLanguage", "en"); localStorage.setItem("hourAiLanguageManual", "true");`
        });
        await navigate(ws, `${origin}/${page}?skipWelcome=1&prelaunch=${Date.now()}`);

        if (page === "index.html") {
          await send(ws, "Runtime.evaluate", { expression: `document.querySelector("[data-payment-level='C']")?.click();` });
          await sleep(300);
        } else {
          await send(ws, "Runtime.evaluate", {
            expression: `document.querySelector('[data-category="mobile"]')?.click(); document.querySelector(".store-card-image-button")?.click();`
          });
          await sleep(600);
        }

        const result = await send(ws, "Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const selectors = "h1,h2,h3,h4,p,a,button,label,li,strong,small,span,code,textarea,input,option";
            const visible = Array.from(document.querySelectorAll(selectors)).filter((el) => {
              const rect = el.getBoundingClientRect();
              const style = getComputedStyle(el);
              return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
            });
            const textItems = [];
            const clipped = [];
            visible.forEach((el) => {
              const text = (el.innerText || el.textContent || el.getAttribute("placeholder") || el.value || "").replace(/\\s+/g, " ").trim();
              if (text) textItems.push({ tag: el.tagName.toLowerCase(), text });
              const interactive = ["A", "BUTTON", "TEXTAREA", "INPUT", "SELECT"].includes(el.tagName);
              if (interactive && (el.scrollWidth > el.clientWidth + 3 || el.scrollHeight > el.clientHeight + 5)) {
                clipped.push({
                  tag: el.tagName.toLowerCase(),
                  text,
                  clientWidth: el.clientWidth,
                  scrollWidth: el.scrollWidth,
                  clientHeight: el.clientHeight,
                  scrollHeight: el.scrollHeight
                });
              }
            });
            const headingFonts = Array.from(document.querySelectorAll("h1,h2")).filter((el) => {
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0;
            }).map((el) => ({ text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 80), font: parseFloat(getComputedStyle(el).fontSize), tag: el.tagName.toLowerCase() }));
            return {
              lang: document.documentElement.lang,
              dir: document.documentElement.dir,
              overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
              title: document.title,
              uniqueTextCount: new Set(textItems.map((item) => item.text)).size,
              textItems,
              clipped,
              headingFonts
            };
          })()`
        });
        const value = result.result.value;
        summaries.push({
          viewport: viewport.name,
          page,
          lang: value.lang,
          dir: value.dir,
          overflow: value.overflow,
          uniqueTextCount: value.uniqueTextCount,
          clippedCount: value.clipped.length,
          headingFonts: value.headingFonts
        });
        if (value.lang !== "en" || value.dir !== "ltr") failures.push({ source: `${viewport.name}:${page}`, reason: "not-english-ltr", value: { lang: value.lang, dir: value.dir } });
        if (value.overflow > 2) failures.push({ source: `${viewport.name}:${page}`, reason: "horizontal-overflow", overflow: value.overflow });
        value.clipped.forEach((item) => failures.push({ source: `${viewport.name}:${page}`, reason: "interactive-text-clipped", item }));
        value.textItems.forEach((item) => failures.push(...copyIssues(item.text, `${viewport.name}:${page}:${item.tag}`)));
      }
    }
    ws.close();
  } finally {
    child.kill();
  }

  const dedupedFailures = [];
  const seen = new Set();
  failures.forEach((failure) => {
    const key = JSON.stringify(failure);
    if (!seen.has(key)) {
      seen.add(key);
      dedupedFailures.push(failure);
    }
  });

  console.log(JSON.stringify({
    origin,
    checkedViewports: viewports.map((item) => item.name),
    summaryCount: summaries.length,
    summaries,
    failureCount: dedupedFailures.length,
    failures: dedupedFailures.slice(0, 80)
  }, null, 2));
  if (dedupedFailures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
