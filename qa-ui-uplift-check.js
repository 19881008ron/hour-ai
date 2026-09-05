const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4173";
const port = 9700 + Math.floor(Math.random() * 400);
const userDataDir = path.join(process.env.TEMP || process.cwd(), `hourai-ui-uplift-${Date.now()}`);
const outDir = path.join(process.cwd(), "qa_screenshots_latest");

const viewports = [
  { name: "desktop-1440", width: 1440, height: 960, mobile: false, scale: 1 },
  { name: "phone-390", width: 390, height: 844, mobile: true, scale: 3 },
  { name: "ipad-820", width: 820, height: 1180, mobile: true, scale: 2 },
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

async function capture(ws, viewportName, pageName) {
  const png = await send(ws, "Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  fs.writeFileSync(path.join(outDir, `ui-uplift-${viewportName}-${pageName}.png`), Buffer.from(png.data, "base64"));
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    "--window-size=1440,960",
    `--user-data-dir=${userDataDir}`,
    `${origin}/index.html?skipWelcome=1`,
  ], { stdio: "ignore" });

  const failures = [];
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
        mobile: viewport.mobile,
      });

      for (const page of ["index.html", "marketplace.html"]) {
        await navigate(ws, `${origin}/${page}?skipWelcome=1&ui=${Date.now()}`);
        await send(ws, "Runtime.evaluate", {
          expression: `localStorage.setItem("hourAiLanguage", "en"); localStorage.setItem("hourAiLanguageManual", "true");`,
        });
        await navigate(ws, `${origin}/${page}?skipWelcome=1&ui=${Date.now()}`);

        if (page === "marketplace.html") {
          await send(ws, "Runtime.evaluate", { expression: `document.querySelector('[data-category="mobile"]')?.click();` });
          await sleep(300);
        }

        const result = await send(ws, "Runtime.evaluate", {
          returnByValue: true,
          expression: `(() => {
            const visible = (selector) => Array.from(document.querySelectorAll(selector)).filter((el) => {
              const rect = el.getBoundingClientRect();
              const style = getComputedStyle(el);
              return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
            });
            const metric = (el) => {
              const rect = el.getBoundingClientRect();
              const style = getComputedStyle(el);
              return {
                text: (el.innerText || el.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 80),
                font: parseFloat(style.fontSize),
                lineHeight: parseFloat(style.lineHeight),
                color: style.color,
                top: Math.round(rect.top),
                left: Math.round(rect.left),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              };
            };
            const header = document.querySelector(".site-header .header-inner");
            const hero = document.querySelector(".hero-section, .store-hero");
            const headings = visible("h1,h2").map(metric);
            const subtitles = visible(".hero-lede, .store-hero-copy p, .section-heading > p, .section-heading > div + p, .path-intro > p:not(.eyebrow), .store-section-head p").map(metric);
            const buttons = visible("a.button, button.button, .mobile-menu-toggle, .store-filter").map((el) => ({ ...metric(el), clipped: el.scrollWidth > el.clientWidth + 3 || el.scrollHeight > el.clientHeight + 5 }));
            const sections = visible(".hero-section,.signal-strip,.orders-section,.path-section,.courses-section,.reviews-section,.support-section,.store-hero,.store-section").map((el) => {
              const style = getComputedStyle(el);
              return { selector: el.className || el.tagName, paddingTop: parseFloat(style.paddingTop), paddingBottom: parseFloat(style.paddingBottom) };
            });
            return {
              overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
              headerHeight: header ? Math.round(header.getBoundingClientRect().height) : 0,
              heroTop: hero ? Math.round(hero.getBoundingClientRect().top) : 0,
              headings,
              subtitles,
              buttons,
              sections
            };
          })()`,
        });

        const value = result.result.value;
        summaries.push({ viewport: viewport.name, page, ...value });
        const h1 = value.headings.filter((item) => item.text).find((item) => item.font >= Math.max(...value.headings.map((heading) => heading.font)));
        const h2s = value.headings.filter((item) => item !== h1);
        const maxH2 = Math.max(0, ...h2s.map((item) => item.font));
        const minH2 = Math.min(...h2s.map((item) => item.font).filter(Boolean));

        if (value.overflow > 2) failures.push({ viewport: viewport.name, page, reason: "horizontal-overflow", value: value.overflow });
        if (value.buttons.some((button) => button.clipped)) failures.push({ viewport: viewport.name, page, reason: "button-or-filter-clipped", items: value.buttons.filter((button) => button.clipped) });

        if (viewport.name === "desktop-1440") {
          if (h1 && (h1.font < 48 || h1.font > 70)) failures.push({ viewport: viewport.name, page, reason: "desktop-h1-scale", h1 });
          if (maxH2 > 50 || minH2 < 30) failures.push({ viewport: viewport.name, page, reason: "desktop-h2-scale", h2s });
        } else if (viewport.name === "phone-390") {
          if (h1 && (h1.font < 24 || h1.font > 26)) failures.push({ viewport: viewport.name, page, reason: "phone-h1-scale", h1 });
          if (maxH2 > 23 || minH2 < 21) failures.push({ viewport: viewport.name, page, reason: "phone-h2-scale", h2s });
        } else {
          if (h1 && (h1.font < 31 || h1.font > 33)) failures.push({ viewport: viewport.name, page, reason: "ipad-h1-scale", h1 });
          if (maxH2 > 30 || minH2 < 27) failures.push({ viewport: viewport.name, page, reason: "ipad-h2-scale", h2s });
        }

        if (viewport.name !== "desktop-1440" && value.sections.some((section) => section.paddingTop > 26 || section.paddingBottom > 30)) {
          failures.push({ viewport: viewport.name, page, reason: "mobile-section-padding", sections: value.sections });
        }

        await capture(ws, viewport.name, page.replace(".html", ""));
      }
    }

    ws.close();
  } finally {
    child.kill();
  }

  console.log(JSON.stringify({
    origin,
    checked: summaries.map((item) => `${item.viewport}:${item.page}`),
    failureCount: failures.length,
    failures,
    summary: summaries.map((item) => ({
      viewport: item.viewport,
      page: item.page,
      overflow: item.overflow,
      headerHeight: item.headerHeight,
      headings: item.headings,
      subtitleFonts: [...new Set(item.subtitles.map((subtitle) => subtitle.font))],
      sectionPadding: item.sections,
    })),
  }, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
