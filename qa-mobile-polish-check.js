const http = require("http");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4173";
const port = 9600 + Math.floor(Math.random() * 500);
const userDataDir = path.join(process.env.TEMP || process.cwd(), `hourai-mobile-polish-${Date.now()}`);
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

async function navigate(ws, url) {
  await send(ws, "Page.navigate", { url });
  await waitLoaded(ws);
  await sleep(700);
}

async function screenshot(ws, name, selector) {
  const position = await send(ws, "Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return { y: 0 };
      const rect = el.getBoundingClientRect();
      return { y: Math.max(0, Math.round(rect.top + window.scrollY - 96)) };
    })()`,
  });
  await send(ws, "Runtime.evaluate", { expression: `window.scrollTo(0, ${position.result.value.y})` });
  await sleep(250);
  const png = await send(ws, "Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  fs.writeFileSync(path.join(outDir, name), Buffer.from(png.data, "base64"));
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    "--window-size=390,844",
    `--user-data-dir=${userDataDir}`,
    `${origin}/index.html?skipWelcome=1`,
  ], { stdio: "ignore" });

  const failures = [];
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

    await navigate(ws, `${origin}/index.html?skipWelcome=1&v=${Date.now()}`);
    const course = await send(ws, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const heading = document.querySelector("#courses .section-heading h2");
        const card = document.querySelector(".price-card");
        const title = card?.querySelector("h3");
        const label = card?.querySelector(".price-rank-label");
        const price = card?.querySelector(".price");
        const buttons = Array.from(card?.querySelectorAll(".price-actions .button") || []);
        const rect = (el) => {
          const r = el.getBoundingClientRect();
          return { left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
        };
        return {
          headingFont: heading ? parseFloat(getComputedStyle(heading).fontSize) : 0,
          titleDisplay: title ? getComputedStyle(title).display : "",
          mobileLabel: label ? getComputedStyle(label, "::after").content : "",
          priceFont: price ? parseFloat(getComputedStyle(price).fontSize) : 0,
          buttonRects: buttons.map(rect),
          sameButtonRow: buttons.length === 2 && Math.abs(buttons[0].getBoundingClientRect().top - buttons[1].getBoundingClientRect().top) < 3,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      })()`,
    });
    const courseValue = course.result.value;
    if (courseValue.headingFont > 33) failures.push({ area: "course", reason: "heading-too-large", courseValue });
    if (courseValue.titleDisplay !== "none") failures.push({ area: "course", reason: "duplicate-title-visible", courseValue });
    if (!courseValue.mobileLabel.includes("C-Level AI Editor")) failures.push({ area: "course", reason: "rank-label-not-merged", courseValue });
    if (courseValue.priceFont > 43) failures.push({ area: "course", reason: "price-too-large", courseValue });
    if (!courseValue.sameButtonRow) failures.push({ area: "course", reason: "buttons-not-one-row", courseValue });
    if (courseValue.overflow > 2) failures.push({ area: "course", reason: "overflow", courseValue });
    await screenshot(ws, "mobile-course-polish-check.png", "#courses");

    await navigate(ws, `${origin}/marketplace.html?v=${Date.now()}`);
    const store = await send(ws, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const h1 = document.querySelector(".store-hero-copy h1");
        const lead = document.querySelector(".store-hero-copy p");
        const empty = document.querySelector(".store-empty-state");
        const custom = document.querySelector(".store-filter-custom");
        const filters = Array.from(document.querySelectorAll(".store-filter")).map((el) => el.getBoundingClientRect());
        const customIcon = custom?.querySelector(".store-filter-icon");
        return {
          h1Font: h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0,
          leadWidth: lead ? Math.round(lead.getBoundingClientRect().width) : 0,
          pageWidth: document.documentElement.clientWidth,
          emptyDisplay: empty ? getComputedStyle(empty).display : "",
          customColor: custom ? getComputedStyle(custom).color : "",
          customIconColor: customIcon ? getComputedStyle(customIcon).color : "",
          filtersTwoColumns: filters.length >= 4 && Math.abs(filters[0].top - filters[1].top) < 3 && filters[2].top > filters[0].top,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      })()`,
    });
    const storeValue = store.result.value;
    if (storeValue.h1Font > 41) failures.push({ area: "store", reason: "h1-too-large", storeValue });
    if (storeValue.leadWidth < storeValue.pageWidth - 32) failures.push({ area: "store", reason: "lead-too-narrow", storeValue });
    if (storeValue.emptyDisplay !== "none") failures.push({ area: "store", reason: "empty-state-visible", storeValue });
    if (!storeValue.filtersTwoColumns) failures.push({ area: "store", reason: "filters-not-two-columns", storeValue });
    if (storeValue.overflow > 2) failures.push({ area: "store", reason: "overflow", storeValue });
    await screenshot(ws, "mobile-store-polish-check.png", ".store-section");

    await navigate(ws, `${origin}/index.html?skipWelcome=1&support=1&v=${Date.now()}`);
    await send(ws, "Runtime.evaluate", { expression: `document.getElementById("supportFab")?.click(); window.scrollTo(0, 180);` });
    await sleep(350);
    const support = await send(ws, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const header = document.querySelector(".site-header");
        const modal = document.getElementById("supportModal");
        return {
          open: modal?.classList.contains("is-open"),
          headerDisplay: header ? getComputedStyle(header).display : "",
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      })()`,
    });
    const supportValue = support.result.value;
    if (!supportValue.open || supportValue.headerDisplay !== "none") failures.push({ area: "support", reason: "header-visible-in-chat", supportValue });
    if (supportValue.overflow > 2) failures.push({ area: "support", reason: "overflow", supportValue });

    ws.close();
  } finally {
    child.kill();
  }

  console.log(JSON.stringify({ failureCount: failures.length, failures }, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
