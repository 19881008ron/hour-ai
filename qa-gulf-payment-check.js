const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4173";
const port = 9700 + Math.floor(Math.random() * 400);
const userDataDir = path.join(process.env.TEMP || process.cwd(), `hourai-gulf-payment-${Date.now()}`);

const expectedPlatforms = [
  ["Binance UAE", "https://www.binance.com/en-AE"],
  ["OKX Middle East", "https://www.okx.com/buy-crypto"],
  ["BitOasis", "https://bitoasis.net/"],
  ["M2", "https://m2.com/"],
  ["Rain", "https://www.rain.com/"],
  ["CoinMENA", "https://www.coinmena.com/"]
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

async function openPayment(ws, language) {
  await send(ws, "Page.navigate", { url: `${origin}/index.html?skipWelcome=1&v=${Date.now()}` });
  await waitLoaded(ws);
  await sleep(900);
  await send(ws, "Runtime.evaluate", {
    expression: `localStorage.setItem("hourAiLanguage", ${JSON.stringify(language)}); localStorage.setItem("hourAiLanguageManual", "true");`
  });
  await send(ws, "Page.navigate", { url: `${origin}/index.html?skipWelcome=1&v=${Date.now()}` });
  await waitLoaded(ws);
  await sleep(900);
  await send(ws, "Runtime.evaluate", { expression: `document.querySelector("[data-payment-level='C']")?.click();` });
  await sleep(500);
}

(async () => {
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    "--window-size=390,844",
    `--user-data-dir=${userDataDir}`,
    `${origin}/index.html?skipWelcome=1`
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
      mobile: true
    });

    await openPayment(ws, "en");
    const english = await send(ws, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const platforms = Array.from(document.querySelectorAll("#cryptoPlatformList .onramp-row")).map((row) => ({
          name: row.querySelector("strong")?.textContent.trim(),
          href: row.href,
          regions: row.querySelector("span span")?.textContent.trim()
        }));
        const copyButtons = Array.from(document.querySelectorAll("[data-copy-address]"));
        const note = document.querySelector(".onramp-note")?.textContent.trim() || "";
        return {
          isOpen: document.getElementById("paymentModal")?.classList.contains("is-open"),
          title: document.getElementById("paymentModalTitle")?.textContent.trim(),
          note,
          platforms,
          allAddressButtonsDisabled: copyButtons.length === 4 && copyButtons.every((button) => button.disabled),
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      })()`
    });
    const en = english.result.value;
    if (!en.isOpen || en.title !== "Pay with cryptocurrency") failures.push({ page: "payment", reason: "english-modal", en });
    expectedPlatforms.forEach(([name, url]) => {
      const platform = en.platforms.find((item) => item.name === name);
      if (!platform || !platform.href.startsWith(url)) failures.push({ page: "payment", reason: `missing-${name}`, en });
    });
    if (!/Saudi|UAE/.test(en.note)) failures.push({ page: "payment", reason: "missing-gulf-note", en });
    if (!en.allAddressButtonsDisabled) failures.push({ page: "payment", reason: "address-buttons", en });
    if (en.overflow > 2) failures.push({ page: "payment", reason: "english-overflow", en });

    await openPayment(ws, "ar");
    const arabic = await send(ws, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => ({
        lang: document.documentElement.lang,
        dir: document.documentElement.dir,
        title: document.getElementById("paymentModalTitle")?.textContent.trim(),
        badge: document.querySelector(".onramp-card .fee-pill")?.textContent.trim(),
        note: document.querySelector(".onramp-note")?.textContent.trim() || "",
        platformCount: document.querySelectorAll("#cryptoPlatformList .onramp-row").length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
      }))()`
    });
    const ar = arabic.result.value;
    if (ar.lang !== "ar" || ar.dir !== "rtl" || ar.platformCount !== expectedPlatforms.length) failures.push({ page: "payment", reason: "arabic-modal", ar });
    if (!ar.badge.includes("السعودية") || !ar.badge.includes("الإمارات")) failures.push({ page: "payment", reason: "arabic-gulf-badge", ar });
    if (ar.overflow > 2) failures.push({ page: "payment", reason: "arabic-overflow", ar });
    ws.close();
  } finally {
    child.kill();
  }

  console.log(JSON.stringify({ origin, failureCount: failures.length, failures }, null, 2));
  if (failures.length) process.exit(1);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
