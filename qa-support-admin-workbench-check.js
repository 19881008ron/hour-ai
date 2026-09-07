const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4173";
const adminEmail = process.env.ADMIN_EMAIL || "";
const adminPassword = process.env.ADMIN_PASSWORD || "";
const userDataDir = `${process.env.TEMP || process.cwd()}\\hourai-admin-workbench-${Date.now()}`;
const port = 10300 + Math.floor(Math.random() * 500);

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

async function waitLoaded(ws) {
  for (let i = 0; i < 100; i += 1) {
    const result = await send(ws, "Runtime.evaluate", { returnByValue: true, expression: "document.readyState" });
    if (result.result.value === "complete") return;
    await sleep(100);
  }
}

async function capture(ws, name) {
  const dir = path.join(process.cwd(), "qa_screenshots_latest");
  fs.mkdirSync(dir, { recursive: true });
  const shot = await send(ws, "Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const file = path.join(dir, name);
  fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
  return file;
}

async function checkDesktop() {
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-crash-reporter",
    "--disable-crashpad",
    `--remote-debugging-port=${port}`,
    "--window-size=1440,920",
    `--user-data-dir=${userDataDir}`,
    `${origin}/index.html?skipWelcome=1`
  ], { stdio: "ignore" });

  try {
    const ws = new WebSocket(await waitForPage());
    await new Promise((resolve, reject) => {
      ws.addEventListener("open", resolve, { once: true });
      ws.addEventListener("error", reject, { once: true });
    });
    await send(ws, "Runtime.enable");
    await send(ws, "Page.enable");
    await waitLoaded(ws);
    await sleep(700);

    const setup = await send(ws, "Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const adminEmail = ${JSON.stringify(adminEmail)};
        const adminPassword = ${JSON.stringify(adminPassword)};
        if (adminEmail && adminPassword) {
          const login = await fetch("/api/login", {
            method: "POST",
            credentials: "same-origin",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: adminEmail, password: adminPassword })
          });
          if (!login.ok) return { mode: "login", ok: false, error: await login.text() };
          if (typeof loadAccount === "function") await loadAccount();
          await new Promise((resolve) => setTimeout(resolve, 1200));
          if (typeof openModal === "function") openModal("profileModal");
          await new Promise((resolve) => setTimeout(resolve, 1200));
          const first = document.querySelector("#supportInbox .support-inbox-item");
          first?.click();
          await new Promise((resolve) => setTimeout(resolve, 1200));
          return { mode: "login", ok: true };
        }

        const modal = document.getElementById("profileModal");
        const panel = modal.querySelector(".account-panel");
        const dashboard = document.getElementById("accountDashboard");
        const supportPanel = document.getElementById("supportAgentPanel");
        modal.classList.add("is-open", "support-agent-mode");
        modal.setAttribute("aria-hidden", "false");
        panel.classList.add("support-agent-workspace-panel");
        document.body.classList.add("modal-open", "support-agent-mode");
        document.getElementById("accountGuest").hidden = true;
        dashboard.hidden = false;
        supportPanel.hidden = false;
        document.getElementById("paymentPanel").hidden = true;
        document.getElementById("supportAgentEmpty").hidden = true;
        document.getElementById("supportAgentThread").hidden = false;
        document.getElementById("supportAgentComposer").hidden = false;
        const inbox = document.getElementById("supportInbox");
        inbox.innerHTML = Array.from({ length: 18 }, (_, index) => (
          '<button class="support-inbox-item' + (index === 0 ? ' is-active' : '') + '" type="button">' +
          '<span class="support-inbox-top"><strong>Website visitor ' + String(index + 1).padStart(2, "0") + '</strong>' +
          (index < 3 ? '<em>' + (index + 1) + '</em>' : '<em></em>') + '</span>' +
          '<span>Visitor · Website live chat</span>' +
          '<small>Customer needs course and payment support details.</small></button>'
        )).join("");
        const thread = document.getElementById("supportAgentThread");
        thread.innerHTML = Array.from({ length: 20 }, (_, index) => (
          '<article class="support-message ' + (index % 2 ? 'is-mine' : 'is-theirs') + '">' +
          '<span>' + (index % 2 ? 'Hour AI advisor' : 'Website visitor') + ' · Today</span>' +
          '<p>Support workbench message ' + (index + 1) + ' with enough text to verify readable line wrapping and message spacing.</p></article>'
        )).join("");
        thread.scrollTop = thread.scrollHeight;
        return { mode: "simulated", ok: true };
      })()`
    });

    const setupValue = setup.result.value;
    if (!setupValue.ok) throw new Error(setupValue.error || "Admin workbench setup failed.");

    const audit = await send(ws, "Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const rect = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return {
            width: Math.round(box.width),
            height: Math.round(box.height),
            top: Math.round(box.top),
            left: Math.round(box.left)
          };
        };
        const inboxBox = document.querySelector(".support-inbox")?.getBoundingClientRect();
        const visibleInboxItems = [...document.querySelectorAll(".support-inbox-item")].filter((item) => {
          const box = item.getBoundingClientRect();
          return inboxBox && box.bottom > inboxBox.top && box.top < inboxBox.bottom;
        }).length;
        return {
          viewportWidth: innerWidth,
          viewportHeight: innerHeight,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          modal: rect("#profileModal .support-agent-workspace-panel"),
          workspace: rect("#supportAgentPanel .support-workspace"),
          inbox: rect("#supportInbox"),
          thread: rect("#supportAgentThread"),
          composer: rect("#supportAgentComposer"),
          visibleInboxItems,
          supportAgentMode: document.getElementById("profileModal")?.classList.contains("support-agent-mode")
        };
      })()`
    });

    const value = audit.result.value;
    const failures = [];
    if (!value.supportAgentMode) failures.push("admin mode class was not applied");
    if (value.overflow > 2) failures.push(`horizontal overflow ${value.overflow}px`);
    if (value.modal.width < 1200) failures.push(`modal too narrow: ${value.modal.width}px`);
    if (value.modal.height < Math.min(760, value.viewportHeight - 40)) failures.push(`modal too short: ${value.modal.height}px`);
    if (value.inbox.height < 500) failures.push(`inbox too short: ${value.inbox.height}px`);
    if (value.thread.height < 420) failures.push(`thread too short: ${value.thread.height}px`);
    if (value.composer.height < 110) failures.push(`composer too short: ${value.composer.height}px`);
    if (value.visibleInboxItems < 7) failures.push(`only ${value.visibleInboxItems} inbox items visible`);
    value.screenshot = await capture(ws, "support-admin-workbench-desktop.png");
    console.log(JSON.stringify({ origin, mode: setupValue.mode, failureCount: failures.length, failures, audit: value }, null, 2));
    if (failures.length) process.exit(1);
    ws.close();
  } finally {
    child.kill();
  }
}

checkDesktop().catch((error) => {
  console.error(error);
  process.exit(1);
});
