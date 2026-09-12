const http = require("http");
const { spawn } = require("child_process");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4173";
const userDataDir = `${process.env.TEMP || process.cwd()}\\hourai-mobile-commerce-${Date.now()}`;
const port = 9700 + Math.floor(Math.random() * 500);
const viewports = [
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

(async () => {
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    "--window-size=390,844",
    `--user-data-dir=${userDataDir}`,
    `${origin}/index.html`,
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

    for (const viewport of viewports) {
      await send(ws, "Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.scale,
        mobile: viewport.mobile,
      });
      await navigate(ws, `${origin}/index.html?skipWelcome=1`);
      await send(ws, "Runtime.evaluate", {
        expression: `localStorage.setItem("hourAiLanguage", "zh"); localStorage.removeItem("hourAiLanguageManual");`,
      });
      await navigate(ws, `${origin}/index.html?skipWelcome=1`);
      const home = await send(ws, "Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const nav = document.querySelector(".site-header .nav-links");
          const navRect = nav.getBoundingClientRect();
          const navItems = Array.from(nav.querySelectorAll("a")).map((el) => el.getBoundingClientRect()).filter((rect) => rect.width > 0 && rect.height > 0);
          const menuRect = document.querySelector(".mobile-menu-toggle")?.getBoundingClientRect();
          const orders = document.querySelector(".orders-grid");
          const orderItems = Array.from(document.querySelectorAll(".order-card")).slice(0, 3).map((el) => el.getBoundingClientRect());
          return {
            lang: document.documentElement.lang,
            firstNav: document.querySelector(".site-header .nav-links a")?.textContent.trim(),
            navDisplay: getComputedStyle(nav).display,
            navHeight: Math.max(navRect.height, ...navItems.map((rect) => rect.height), menuRect?.height || 0),
            navSingleRow: new Set(navItems.map((rect) => Math.round(rect.top))).size === 1,
            menuVisible: Boolean(menuRect && menuRect.width > 0 && menuRect.height > 0),
            ordersDisplay: getComputedStyle(orders).display,
            ordersHorizontal: orderItems.length >= 2 && Math.abs(orderItems[0].top - orderItems[1].top) < 3 && orderItems[1].left > orderItems[0].left,
            bodyOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        })()`,
      });
      const homeValue = home.result.value;
      if (homeValue.lang !== "en" || homeValue.firstNav !== "Commission") failures.push({ viewport: viewport.name, page: "home", reason: "default-language", homeValue });
      if (!homeValue.navSingleRow || !homeValue.menuVisible || homeValue.navHeight > 54) failures.push({ viewport: viewport.name, page: "home", reason: "nav-not-single-row", homeValue });
      if (!homeValue.ordersHorizontal) failures.push({ viewport: viewport.name, page: "home", reason: "orders-not-horizontal", homeValue });
      if (homeValue.bodyOverflow > 2) failures.push({ viewport: viewport.name, page: "home", reason: "horizontal-overflow", homeValue });

      await navigate(ws, `${origin}/marketplace.html`);
      const store = await send(ws, "Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const filter = document.querySelector('[data-category="mobile"]');
          filter?.click();
          const grid = document.querySelector(".store-grid");
          const cards = Array.from(document.querySelectorAll(".store-card")).slice(0, 4).map((el) => el.getBoundingClientRect());
          const filters = Array.from(document.querySelectorAll(".store-filter")).map((el) => el.getBoundingClientRect());
          const menuRect = document.querySelector(".mobile-menu-toggle")?.getBoundingClientRect();
          const productImageButton = document.querySelector(".store-card-image-button");
          productImageButton?.click();
          const detailDialog = document.querySelector(".store-detail-dialog");
          const mainImages = Array.from(document.querySelectorAll(".store-main-image img")).map((el) => el.getBoundingClientRect());
          const thumbs = Array.from(document.querySelectorAll(".store-thumb-grid")).filter((el) => getComputedStyle(el).display !== "none");
          return {
            lang: document.documentElement.lang,
            firstNav: document.querySelector(".site-header .nav-links a")?.textContent.trim(),
            menuVisible: Boolean(menuRect && menuRect.width > 0 && menuRect.height > 0),
            gridColumns: getComputedStyle(grid).gridTemplateColumns,
            twoColumns: cards.length >= 2 && Math.abs(cards[0].top - cards[1].top) < 3 && cards[1].left > cards[0].left,
            secondRow: cards.length >= 4 && Math.abs(cards[2].top - cards[3].top) < 3,
            filterColumns: getComputedStyle(document.querySelector(".store-filter-bar")).gridTemplateColumns,
            filtersTwoColumns: filters.length >= 4 && Math.abs(filters[0].top - filters[1].top) < 3 && filters[1].left > filters[0].left && filters[2].top > filters[0].top,
            filtersNotScrollable: document.querySelector(".store-filter-bar").scrollWidth - document.querySelector(".store-filter-bar").clientWidth <= 2,
            detailOpenedByImage: !document.getElementById("storeDetailOverlay").hidden,
            detailWidth: detailDialog ? Math.round(detailDialog.getBoundingClientRect().width) : 0,
            detailOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            mainImageCount: mainImages.length,
            visibleThumbCount: thumbs.length,
            bodyOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        })()`,
      });
      const storeValue = store.result.value;
      if (storeValue.lang !== "en" || storeValue.firstNav !== "Commission" || !storeValue.menuVisible) failures.push({ viewport: viewport.name, page: "store", reason: "default-language", storeValue });
      if (!storeValue.twoColumns || !storeValue.secondRow) failures.push({ viewport: viewport.name, page: "store", reason: "store-not-two-columns", storeValue });
      if (!storeValue.filtersTwoColumns || !storeValue.filtersNotScrollable) failures.push({ viewport: viewport.name, page: "store", reason: "filters-not-expanded-two-columns", storeValue });
      if (!storeValue.detailOpenedByImage || storeValue.visibleThumbCount !== 0 || storeValue.mainImageCount !== 1) failures.push({ viewport: viewport.name, page: "store", reason: "detail-image-entry-or-gallery", storeValue });
      if (storeValue.detailOverflow > 2 || storeValue.detailWidth > viewport.width + 2) failures.push({ viewport: viewport.name, page: "store", reason: "detail-horizontal-overflow", storeValue });
      if (storeValue.bodyOverflow > 2) failures.push({ viewport: viewport.name, page: "store", reason: "horizontal-overflow", storeValue });
    }
  } finally {
    child.kill();
  }

  console.log(JSON.stringify({ checked: viewports.length * 2, failureCount: failures.length, failures }, null, 2));
  if (failures.length) process.exit(1);
})();
