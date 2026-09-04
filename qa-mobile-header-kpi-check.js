const http = require("http");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4173";
const port = 9900 + Math.floor(Math.random() * 300);
const userDataDir = path.join(process.env.TEMP || process.cwd(), `hourai-header-kpi-${Date.now()}`);
const outDir = path.join(process.cwd(), "qa_screenshots_latest");

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

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    "--window-size=390,844",
    `--user-data-dir=${userDataDir}`,
    `${origin}/index.html?skipWelcome=1&v=${Date.now()}`,
  ], { stdio: "ignore" });

  try {
    const ws = new WebSocket(await waitForPage());
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", reject, { once: true });
    });
    await send(ws, "Runtime.enable");
    await send(ws, "Page.enable");
    await send(ws, "Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await send(ws, "Network.enable");
    await send(ws, "Network.setCacheDisabled", { cacheDisabled: true });
    await send(ws, "Page.navigate", { url: `${origin}/index.html?skipWelcome=1&v=${Date.now()}` });
    await waitLoaded(ws);
    await sleep(700);

    const audit = await send(ws, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        document.getElementById("welcomeOverlay")?.remove();
        window.scrollTo(0, 0);
        const header = document.querySelector(".site-header .header-inner");
        const brand = document.querySelector(".site-header .brand");
        const nav = document.querySelector(".site-header .nav-links");
        const proof = document.querySelector(".hero-proof");
        const proofItems = Array.from(document.querySelectorAll(".hero-proof > div"));
        const signals = Array.from(document.querySelectorAll(".signal-item"));
        const profiles = Array.from(document.querySelectorAll(".profile-card"));
        const legend = Array.from(document.querySelectorAll(".board-legend > span"));
        const reviewsGrid = document.querySelector(".reviews-grid");
        const reviews = Array.from(document.querySelectorAll(".review-card"));
        const rect = (el) => {
          const r = el.getBoundingClientRect();
          return { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), width: Math.round(r.width), height: Math.round(r.height) };
        };
        const firstProfile = profiles[0];
        const profileChildren = firstProfile ? Array.from(firstProfile.children).map((el) => ({
          tag: el.tagName,
          cls: el.className,
          text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 60),
          rect: rect(el),
          display: getComputedStyle(el).display,
          gridColumn: getComputedStyle(el).gridColumn,
          position: getComputedStyle(el).position,
          width: getComputedStyle(el).width,
          margin: getComputedStyle(el).margin
        })) : [];
        const rowInfo = (items) => items.map((el) => rect(el)).map((r) => ({ left: r.left, top: r.top, width: r.width, height: r.height }));
        return {
          lang: document.documentElement.lang,
          header: rect(header),
          brand: rect(brand),
          brandNameColor: getComputedStyle(document.querySelector(".brand-name")).color,
          nav: rect(nav),
          navItems: Array.from(nav.querySelectorAll("a")).map((el) => ({ text: el.textContent.trim(), ...rect(el) })),
          navTops: Array.from(nav.querySelectorAll("a")).map((el) => Math.round(el.getBoundingClientRect().top)),
          proof: rect(proof),
          proofDisplay: getComputedStyle(proof).display,
          proofColumns: getComputedStyle(proof).gridTemplateColumns,
          proofItems: proofItems.map((el) => ({ rect: rect(el), gridColumn: getComputedStyle(el).gridColumn, text: el.textContent.trim().replace(/\\s+/g, " ") })),
          signalRows: rowInfo(signals),
          profileRows: rowInfo(profiles),
          profileChildren,
          legendRows: rowInfo(legend),
          reviewsGrid: rect(reviewsGrid),
          reviewRows: rowInfo(reviews),
          reviewGap: getComputedStyle(reviewsGrid).gap,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      })()`,
    });

    const png = await send(ws, "Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(outDir, "mobile-header-kpi-check.png"), Buffer.from(png.data, "base64"));
    const sectionShots = [
      { name: "mobile-workflow-row-check.png", y: 930 },
      { name: "mobile-level-row-check.png", y: 2500 },
      { name: "mobile-reviews-merge-check.png", selector: ".reviews-grid" },
    ];
    for (const shot of sectionShots) {
      let captureOptions = { format: "png", captureBeyondViewport: false };
      if (shot.selector) {
        const position = await send(ws, "Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const el = document.querySelector("${shot.selector}");
            if (!el) return null;
            const rect = el.getBoundingClientRect();
            return { y: Math.max(0, Math.round(rect.top + window.scrollY - 110)) };
          })()`,
        });
        captureOptions = {
          format: "png",
          captureBeyondViewport: true,
          clip: { x: 0, y: position.result.value.y, width: 390, height: 844, scale: 1 },
        };
      } else {
        await send(ws, "Runtime.evaluate", { expression: `window.scrollTo(0, ${shot.y})` });
        await sleep(250);
      }
      const sectionPng = await send(ws, "Page.captureScreenshot", captureOptions);
      fs.writeFileSync(path.join(outDir, shot.name), Buffer.from(sectionPng.data, "base64"));
    }

    ws.close();
    console.log(JSON.stringify(audit.result.value, null, 2));
  } finally {
    child.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
