const http = require("http");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4173";
const port = 9400 + Math.floor(Math.random() * 500);
const userDataDir = path.join(process.env.TEMP || process.cwd(), `hourai-arabic-mobile-${Date.now()}`);
const outDir = path.join(process.cwd(), "qa_screenshots_latest");
const viewports = [
  { name: "phone-360", width: 360, height: 800, scale: 3 },
  { name: "phone-390", width: 390, height: 844, scale: 3 },
  { name: "ipad-820", width: 820, height: 1180, scale: 2 },
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

async function setArabic(ws, page) {
  await navigate(ws, `${origin}/${page}?skipWelcome=1&v=${Date.now()}`);
  await send(ws, "Runtime.evaluate", {
    expression: `localStorage.setItem("hourAiLanguage", "ar"); localStorage.setItem("hourAiLanguageManual", "true");`,
  });
  await navigate(ws, `${origin}/${page}?skipWelcome=1&v=${Date.now()}`);
}

async function screenshot(ws, name) {
  const png = await send(ws, "Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  fs.writeFileSync(path.join(outDir, name), Buffer.from(png.data, "base64"));
}

function compactFailure(item) {
  const data = item.h || item.s || item.support || {};
  return {
    viewport: item.viewport,
    page: item.page,
    reason: item.reason,
    lang: data.lang,
    dir: data.dir,
    overflow: data.overflow,
    header: data.header,
    headerSingleRow: data.headerSingleRow,
    visibleHeaderTexts: data.visibleHeaderTexts,
    headingFonts: data.headingFonts?.map((heading) => ({
      text: heading.text,
      font: heading.font,
      rect: heading.rect,
    })),
    sectionPadding: data.sections?.map((section) => ({
      selector: section.selector,
      paddingTop: section.paddingTop,
      paddingBottom: section.paddingBottom,
    })),
    priceTitleHidden: data.priceTitleHidden,
    priceButtonsOneRow: data.priceButtonsOneRow,
    priceButtonRows: data.priceButtonRows,
    profileThreeColumns: data.profileThreeColumns,
    orderMetaCentered: data.orderMetaCentered,
    commissions: data.commissions,
    h1Font: data.h1Font,
    leadWidth: data.leadWidth,
    filtersTwoColumns: data.filtersTwoColumns,
    filtersNotScrollable: data.filtersNotScrollable,
    filterRowCounts: data.filterRowCounts,
    emptyDisplay: data.emptyDisplay,
    productTwoColumns: data.productTwoColumns,
    detailOpen: data.detailOpen,
    detailWidth: data.detailWidth,
    supportOpen: data.supportOpen,
    supportHeaderHidden: data.supportHeaderHidden,
    supportFontSize: data.supportFontSize,
    supportScale: data.supportScale,
    supportPanelWidth: data.supportPanelWidth,
  };
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

    for (const viewport of viewports) {
      await send(ws, "Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.scale,
        mobile: true,
      });

      await setArabic(ws, "index.html");
      const home = await send(ws, "Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const visible = (selector) => Array.from(document.querySelectorAll(selector)).filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
          });
          const rect = (el) => {
            const r = el.getBoundingClientRect();
            return { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), bottom: Math.round(r.bottom), width: Math.round(r.width), height: Math.round(r.height) };
          };
          const header = document.querySelector(".site-header .header-inner");
          const headerItems = visible(".site-header .brand, .site-header .nav-links a, .mobile-menu-toggle");
          const headings = visible(".hero-copy h1, .orders-section .section-heading h2, .path-intro h2, .courses-section .section-heading h2, .reviews-section .section-heading h2, .support-section h2");
          const headingFonts = headings.map((el) => ({ text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 80), font: parseFloat(getComputedStyle(el).fontSize), rect: rect(el) }));
          const sections = [".orders-section", ".path-section", ".courses-section", ".reviews-section", ".support-section"].map((selector) => {
            const el = document.querySelector(selector);
            return { selector, rect: rect(el), paddingTop: parseFloat(getComputedStyle(el).paddingTop), paddingBottom: parseFloat(getComputedStyle(el).paddingBottom) };
          });
          const priceCard = document.querySelector(".price-card");
          const priceCards = visible(".price-card");
          const profileCards = visible(".profile-layout > .profile-card");
          const commissions = visible(".commission-highlight strong").map((el) => getComputedStyle(el).color);
          const orderMetaCells = visible(".order-card .order-meta span");
          document.querySelector(".mobile-menu-toggle")?.click();
          const menuPanel = document.querySelector(".mobile-menu-panel");
          return {
            lang: document.documentElement.lang,
            dir: document.documentElement.dir,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            header: rect(header),
            headerSingleRow: new Set(headerItems.map((el) => Math.round(el.getBoundingClientRect().top))).size === 1,
            visibleHeaderTexts: headerItems.map((el) => el.textContent.trim().replace(/\\s+/g, " ")),
            menuOpen: menuPanel && !menuPanel.hidden && rect(menuPanel).right <= document.documentElement.clientWidth + 2,
            headingFonts,
            sections,
            priceTitleHidden: priceCard ? getComputedStyle(priceCard.querySelector("h3")).display === "none" : false,
            priceButtonRows: priceCards.map((card) => {
              const buttons = Array.from(card.querySelectorAll(".price-actions .button")).filter((el) => {
                const itemRect = el.getBoundingClientRect();
                return itemRect.width > 0 && itemRect.height > 0;
              }).map(rect);
              return buttons;
            }),
            priceButtonsOneRow: priceCards.every((card) => {
              const buttons = Array.from(card.querySelectorAll(".price-actions .button")).filter((el) => {
                const itemRect = el.getBoundingClientRect();
                return itemRect.width > 0 && itemRect.height > 0;
              });
              return buttons.length === 2 && Math.abs(buttons[0].getBoundingClientRect().top - buttons[1].getBoundingClientRect().top) < 3;
            }),
            profileThreeColumns: profileCards.length >= 3 && Math.abs(profileCards[0].getBoundingClientRect().top - profileCards[1].getBoundingClientRect().top) < 3 && Math.abs(profileCards[1].getBoundingClientRect().top - profileCards[2].getBoundingClientRect().top) < 3,
            commissions,
            orderMetaCentered: orderMetaCells.slice(0, 2).every((el) => getComputedStyle(el).textAlign === "center")
          };
        })()`,
      });
      const h = home.result.value;
      if (h.lang !== "ar" || h.dir !== "rtl") failures.push({ viewport: viewport.name, page: "home", reason: "not-arabic-rtl", h });
      if (h.overflow > 2) failures.push({ viewport: viewport.name, page: "home", reason: "overflow", h });
      if (!h.headerSingleRow || h.header.height > 58 || !h.visibleHeaderTexts.some((text) => text.includes("العمولة"))) failures.push({ viewport: viewport.name, page: "home", reason: "header", h });
      if (!h.menuOpen) failures.push({ viewport: viewport.name, page: "home", reason: "menu", h });
      if (h.headingFonts.some((item) => item.font > (viewport.width >= 800 ? 42 : 32))) failures.push({ viewport: viewport.name, page: "home", reason: "heading-too-large", h });
      if (h.sections.some((item) => item.paddingTop > 32 || item.paddingBottom > 36)) failures.push({ viewport: viewport.name, page: "home", reason: "section-padding-too-large", h });
      if (!h.priceTitleHidden || !h.priceButtonsOneRow) failures.push({ viewport: viewport.name, page: "home", reason: "pricing", h });
      if (!h.profileThreeColumns) failures.push({ viewport: viewport.name, page: "home", reason: "profile-columns", h });
      if (!h.orderMetaCentered) failures.push({ viewport: viewport.name, page: "home", reason: "order-meta", h });
      if (h.commissions.some((color) => color !== h.commissions[0])) failures.push({ viewport: viewport.name, page: "home", reason: "commission-colors", h });
      if (viewport.name === "phone-390") await screenshot(ws, "arabic-mobile-home-check.png");

      await setArabic(ws, "index.html");
      const supportResult = await send(ws, "Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const rect = (el) => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
          };
          document.querySelector(".support-fab")?.click();
          const input = document.querySelector("#supportMessage");
          input?.focus();
          if (input) input.value = "مرحبا";
          input?.dispatchEvent(new Event("input", { bubbles: true }));
          const header = document.querySelector(".site-header");
          const panel = document.querySelector(".support-panel");
          return {
            lang: document.documentElement.lang,
            dir: document.documentElement.dir,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            supportOpen: document.body.classList.contains("support-open") || !document.getElementById("supportWidgetPanel")?.hidden,
            supportHeaderHidden: header ? getComputedStyle(header).display === "none" || rect(header).height === 0 : true,
            supportFontSize: input ? parseFloat(getComputedStyle(input).fontSize) : 0,
            supportScale: window.visualViewport ? window.visualViewport.scale : 1,
            supportPanelWidth: panel ? rect(panel).width : 0,
            header: rect(header)
          };
        })()`,
      });
      const support = supportResult.result.value;
      if (!support.supportOpen || !support.supportHeaderHidden || support.supportFontSize < 16 || support.supportScale !== 1 || support.overflow > 2 || support.supportPanelWidth > viewport.width + 2) {
        failures.push({ viewport: viewport.name, page: "support", reason: "support-mobile-lock", support });
      }

      await setArabic(ws, "marketplace.html");
      const store = await send(ws, "Runtime.evaluate", {
        returnByValue: true,
        expression: `(() => {
          const visible = (selector) => Array.from(document.querySelectorAll(selector)).filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && getComputedStyle(el).visibility !== "hidden";
          });
          const rect = (el) => {
            const r = el.getBoundingClientRect();
            return { left: Math.round(r.left), right: Math.round(r.right), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
          };
          const header = document.querySelector(".site-header .header-inner");
          const headerItems = visible(".site-header .brand, .site-header .nav-links a, .mobile-menu-toggle");
          const filters = visible(".store-filter");
          const h1 = document.querySelector(".store-hero-copy h1");
          const lead = document.querySelector(".store-hero-copy p");
          const empty = document.querySelector(".store-empty-state");
          const filterRowCounts = (() => {
            if (filters.length < 4) return [];
            const rows = new Map();
            filters.forEach((filter) => {
              const top = Math.round(filter.getBoundingClientRect().top);
              rows.set(top, (rows.get(top) || 0) + 1);
            });
            return Array.from(rows.values());
          })();
          const filtersTwoColumns = filterRowCounts.length > 1 && filterRowCounts[0] === 2 && filterRowCounts.every((count) => count <= 2);
          const mobileFilter = document.querySelector('[data-category="mobile"]');
          mobileFilter?.click();
          const cards = visible(".store-card").slice(0, 4);
          const imageButton = document.querySelector(".store-card-image-button");
          imageButton?.click();
          const detail = document.querySelector(".store-detail-dialog");
          return {
            lang: document.documentElement.lang,
            dir: document.documentElement.dir,
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            header: rect(header),
            headerSingleRow: new Set(headerItems.map((el) => Math.round(el.getBoundingClientRect().top))).size === 1,
            visibleHeaderTexts: headerItems.map((el) => el.textContent.trim().replace(/\\s+/g, " ")),
            h1Font: h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0,
            leadWidth: lead ? rect(lead).width : 0,
            filterRowCounts,
            filtersTwoColumns,
            filtersNotScrollable: document.querySelector(".store-filter-bar").scrollWidth - document.querySelector(".store-filter-bar").clientWidth <= 2,
            emptyDisplay: empty ? getComputedStyle(empty).display : "",
            productTwoColumns: cards.length >= 2 && Math.abs(cards[0].getBoundingClientRect().top - cards[1].getBoundingClientRect().top) < 3,
            detailOpen: !document.getElementById("storeDetailOverlay").hidden,
            detailWidth: detail ? rect(detail).width : 0
          };
        })()`,
      });
      const s = store.result.value;
      if (s.lang !== "ar" || s.dir !== "rtl") failures.push({ viewport: viewport.name, page: "store", reason: "not-arabic-rtl", s });
      if (s.overflow > 2) failures.push({ viewport: viewport.name, page: "store", reason: "overflow", s });
      if (!s.headerSingleRow || s.header.height > 58 || !s.visibleHeaderTexts.some((text) => text.includes("العمولة"))) failures.push({ viewport: viewport.name, page: "store", reason: "header", s });
      if (s.h1Font > (viewport.width >= 800 ? 44 : 41)) failures.push({ viewport: viewport.name, page: "store", reason: "h1-too-large", s });
      if (s.leadWidth < viewport.width - 36) failures.push({ viewport: viewport.name, page: "store", reason: "lead-too-narrow", s });
      if (!s.filtersTwoColumns || !s.filtersNotScrollable) failures.push({ viewport: viewport.name, page: "store", reason: "filters", s });
      if (s.emptyDisplay && s.emptyDisplay !== "none") failures.push({ viewport: viewport.name, page: "store", reason: "empty-visible", s });
      if (!s.productTwoColumns || !s.detailOpen || s.detailWidth > viewport.width + 2) failures.push({ viewport: viewport.name, page: "store", reason: "products-or-detail", s });
      if (viewport.name === "phone-390") await screenshot(ws, "arabic-mobile-store-check.png");
    }

    ws.close();
  } finally {
    child.kill();
  }

  console.log(JSON.stringify({
    checkedViewports: viewports.map((item) => item.name),
    origin,
    failureCount: failures.length,
    failures: failures.map(compactFailure)
  }, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
