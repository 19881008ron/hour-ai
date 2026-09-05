const http = require("http");
const { spawn } = require("child_process");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4173";
const userDataDir = `${process.env.TEMP || process.cwd()}\\hourai-mobile-support-${Date.now()}`;
const port = 9800 + Math.floor(Math.random() * 500);

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
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-crash-reporter",
    "--disable-crashpad",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    "--window-size=390,844",
    `--user-data-dir=${userDataDir}`,
    `${origin}/index.html?skipWelcome=1`,
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
    await send(ws, "Page.navigate", { url: `${origin}/index.html?skipWelcome=1&support=1` });
    await waitLoaded(ws);
    await sleep(900);
    const audit = await send(ws, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        document.getElementById("supportFab")?.click();
        const textarea = document.getElementById("supportMessage");
        textarea?.focus();
        if (textarea) textarea.value = "Hello";
        const panel = document.querySelector("#supportModal .support-modal-panel");
        const panelRect = panel?.getBoundingClientRect();
        const inputRect = textarea?.getBoundingClientRect();
        return {
          open: document.getElementById("supportModal")?.classList.contains("is-open"),
          fontSize: textarea ? parseFloat(getComputedStyle(textarea).fontSize) : 0,
          panelWidth: panelRect ? Math.round(panelRect.width) : 0,
          inputWidth: inputRect ? Math.round(inputRect.width) : 0,
          viewportWidth: document.documentElement.clientWidth,
          visualScale: window.visualViewport?.scale || 1,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      })()`,
    });
    const value = audit.result.value;
    console.log(JSON.stringify(value, null, 2));
    if (!value.open || value.fontSize < 16 || value.panelWidth > value.viewportWidth + 2 || value.overflow > 2) process.exit(1);
    ws.close();
  } finally {
    child.kill();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
