const origin = (process.env.QA_ORIGIN || "https://www.hour-ai.com").replace(/\/+$/, "");
const adminEmail = process.env.ADMIN_EMAIL || "";
const adminPassword = process.env.ADMIN_PASSWORD || "";

const tinyPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function cookieHeaderFrom(response) {
  const raw = response.headers.get("set-cookie") || "";
  return raw
    .split(/,(?=\s*hour_ai_)/)
    .map((cookie) => cookie.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");
}

async function request(path, options = {}) {
  const response = await fetch(`${origin}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof data === "object" ? data.error || JSON.stringify(data) : data;
    const error = new Error(message || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return { response, data };
}

async function createGuestConversation(runId) {
  const guestId = crypto.randomUUID();
  const topic = `Launch support E2E ${runId}`;
  const { data } = await request("/api/support?resource=conversations", {
    method: "POST",
    body: JSON.stringify({
      topic,
      guestId,
      guestName: `E2E Visitor ${runId.slice(-6)}`,
      guestEmail: `support-e2e-${runId}@example.com`
    })
  });
  assert(data?.conversation?.id, "Guest conversation was not created.");
  return { guestId, topic, conversation: data.conversation };
}

async function sendMessage({ conversationId, guestId, cookie, body, attachment }) {
  const { data } = await request("/api/support?resource=messages", {
    method: "POST",
    headers: cookie ? { cookie } : {},
    body: JSON.stringify({ conversationId, guestId, body, attachment })
  });
  assert(data?.message?.id, "Message was not created.");
  return data.message;
}

async function listMessages({ conversationId, guestId, cookie }) {
  const query = new URLSearchParams({ conversationId });
  if (guestId) query.set("guestId", guestId);
  const { data } = await request(`/api/support?resource=messages&${query.toString()}`, {
    method: "GET",
    headers: cookie ? { cookie } : {}
  });
  return data?.messages || [];
}

async function loginAdmin() {
  assert(adminEmail && adminPassword, "ADMIN_EMAIL and ADMIN_PASSWORD are required for the admin reply check.");
  const { response } = await request("/api/login", {
    method: "POST",
    body: JSON.stringify({ email: adminEmail, password: adminPassword })
  });
  const cookie = cookieHeaderFrom(response);
  assert(cookie.includes("hour_ai_access="), "Admin login did not return an access cookie.");
  return cookie;
}

async function listAdminConversations(cookie) {
  const { data } = await request("/api/support?resource=conversations", {
    method: "GET",
    headers: { cookie }
  });
  return data?.conversations || [];
}

(async () => {
  const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`.replace(/[^a-z0-9-]/gi, "");
  const checks = [];
  const failures = [];

  try {
    const { guestId, topic, conversation } = await createGuestConversation(runId);
    checks.push("guest conversation created");

    const guestText = `Visitor text E2E ${runId}`;
    await sendMessage({ conversationId: conversation.id, guestId, body: guestText });
    checks.push("guest text message sent");

    await sendMessage({
      conversationId: conversation.id,
      guestId,
      body: `Visitor image E2E ${runId}`,
      attachment: { name: `visitor-${runId}.png`, dataUrl: tinyPng }
    });
    checks.push("guest image message sent");

    const guestMessages = await listMessages({ conversationId: conversation.id, guestId });
    assert(guestMessages.some((message) => message.body === guestText), "Guest text message was not readable by the visitor.");
    assert(guestMessages.some((message) => (message.attachments || []).length), "Guest image attachment was not readable by the visitor.");
    checks.push("guest can read text and image messages");

    if (!adminEmail || !adminPassword) {
      console.log(JSON.stringify({
        origin,
        conversationId: conversation.id,
        topic,
        checks,
        adminSkipped: true,
        reason: "Set ADMIN_EMAIL and ADMIN_PASSWORD to run admin inbox and reply checks.",
        failureCount: 0,
        failures
      }, null, 2));
      return;
    }

    const adminCookie = await loginAdmin();
    checks.push("admin login accepted");

    const conversations = await listAdminConversations(adminCookie);
    assert(conversations.some((item) => item.id === conversation.id), "Admin inbox did not include the guest conversation.");
    checks.push("admin inbox contains guest conversation");

    const adminView = await listMessages({ conversationId: conversation.id, cookie: adminCookie });
    assert(adminView.some((message) => message.body === guestText), "Admin could not read the guest text message.");
    assert(adminView.some((message) => (message.attachments || []).length), "Admin could not read the guest image attachment.");
    checks.push("admin can read guest text and image");

    const replyText = `Admin reply text E2E ${runId}`;
    await sendMessage({ conversationId: conversation.id, cookie: adminCookie, body: replyText });
    checks.push("admin text reply sent");

    await sendMessage({
      conversationId: conversation.id,
      cookie: adminCookie,
      body: `Admin image reply E2E ${runId}`,
      attachment: { name: `admin-${runId}.png`, dataUrl: tinyPng }
    });
    checks.push("admin image reply sent");

    const finalGuestMessages = await listMessages({ conversationId: conversation.id, guestId });
    assert(finalGuestMessages.some((message) => message.body === replyText && ["admin", "agent"].includes(message.sender_role)), "Visitor could not read the admin text reply.");
    assert(finalGuestMessages.some((message) => ["admin", "agent"].includes(message.sender_role) && (message.attachments || []).length), "Visitor could not read the admin image reply.");
    checks.push("visitor can read admin text and image replies");

    console.log(JSON.stringify({ origin, conversationId: conversation.id, topic, checks, failureCount: 0, failures }, null, 2));
  } catch (error) {
    failures.push(error.message);
    console.log(JSON.stringify({ origin, checks, failureCount: failures.length, failures }, null, 2));
    process.exit(1);
  }
})();
