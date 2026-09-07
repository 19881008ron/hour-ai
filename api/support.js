const crypto = require("crypto");
const { parseCookies, readJson, sendJson } = require("../lib/http");
const { authenticatedProfile, config, supabaseFetch } = require("../lib/supabase");

const SUPPORT_ROLES = new Set(["admin", "agent"]);
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

function isSupportAgent(profile) {
  return SUPPORT_ROLES.has(profile?.role);
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function cleanTopic(value) {
  const topic = String(value || "course").trim().slice(0, 80);
  return topic || "course";
}

function cleanName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 80);
}

function cleanEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 120);
}

function cleanBody(value) {
  return String(value || "").trim().slice(0, 2000);
}

function cleanLimit(value, fallback = 60, max = 100) {
  const parsed = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function cleanFileName(value, fallbackExt = "png") {
  const name = String(value || `support-image.${fallbackExt}`).replace(/[^\w.\- ]+/g, "_").trim();
  return (name || `support-image.${fallbackExt}`).slice(0, 120);
}

function parseAttachment(attachment) {
  if (!attachment) return null;
  const dataUrl = String(attachment.dataUrl || "");
  const match = dataUrl.match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([a-z0-9+/=]+)$/i);
  if (!match) {
    const error = new Error("Only PNG, JPG, WEBP, or GIF image attachments are supported.");
    error.status = 400;
    throw error;
  }
  const mimeType = match[1].toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    const error = new Error("This image type is not supported.");
    error.status = 400;
    throw error;
  }
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > MAX_ATTACHMENT_BYTES) {
    const error = new Error("Images must be smaller than 4 MB.");
    error.status = 400;
    throw error;
  }
  const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
  return {
    buffer,
    mimeType,
    fileName: cleanFileName(attachment.name, extension)
  };
}

function guestIdFromRequest(req) {
  const value = parseCookies(req).hour_ai_guest;
  return /^[0-9a-f-]{36}$/i.test(String(value || "")) ? value : "";
}

function cleanGuestId(value) {
  const guestId = String(value || "").trim();
  return /^[0-9a-f-]{36}$/i.test(guestId) ? guestId : "";
}

function setGuestCookie(req, res, guestId) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const common = `; Path=/; HttpOnly; SameSite=Lax; Max-Age=15552000${secure}`;
  const existing = res.getHeader("Set-Cookie");
  const cookies = Array.isArray(existing) ? existing : existing ? [existing] : [];
  res.setHeader("Set-Cookie", [...cookies, `hour_ai_guest=${encodeURIComponent(guestId)}${common}`]);
}

async function optionalAuth(req) {
  try {
    return await authenticatedProfile(req);
  } catch (error) {
    if (error.message === "Account database is not configured.") throw error;
    return null;
  }
}

async function loadProfiles(userIds) {
  const ids = [...new Set(userIds.filter(isUuid))];
  if (!ids.length) return new Map();
  const rows = await supabaseFetch(
    `/rest/v1/profiles?user_id=in.(${ids.join(",")})&select=user_id,username,email,nationality,occupation,level,role`,
    { method: "GET" }
  );
  return new Map(rows.map((row) => [row.user_id, row]));
}

async function loadLatestMessages(conversationIds) {
  const ids = [...new Set(conversationIds.filter(isUuid))];
  if (!ids.length) return new Map();
  const messageLimit = Math.min(Math.max(ids.length * 3, 30), 240);
  const rows = await supabaseFetch(
    `/rest/v1/support_messages?conversation_id=in.(${ids.join(",")})&select=id,conversation_id,sender_role,body,created_at&order=created_at.desc&limit=${messageLimit}`,
    { method: "GET" }
  );
  const latest = new Map();
  rows.forEach((row) => {
    if (!latest.has(row.conversation_id)) latest.set(row.conversation_id, row);
  });
  return latest;
}

async function listConversations(auth, guestId, options = {}) {
  const agent = isSupportAgent(auth?.profile);
  const limit = cleanLimit(options.limit, agent ? 60 : 20, agent ? 100 : 40);
  const includeLatest = options.latest !== "0";
  let filter = "";
  if (!agent && auth?.profile) filter = `&user_id=eq.${encodeURIComponent(auth.profile.user_id)}`;
  if (!agent && !auth?.profile) filter = `&guest_id=eq.${encodeURIComponent(guestId)}`;
  const conversations = (await supabaseFetch(
    `/rest/v1/support_conversations?select=*&order=last_message_at.desc&limit=${limit}${filter}`,
    { method: "GET" }
  )) || [];
  const profiles = await loadProfiles(conversations.map((item) => item.user_id).concat(conversations.map((item) => item.assigned_to)));
  const latestMessages = includeLatest ? await loadLatestMessages(conversations.map((item) => item.id)) : new Map();

  return conversations.map((conversation) => ({
    ...conversation,
    customer: profiles.get(conversation.user_id) || {
      user_id: null,
      username: conversation.guest_name || "Guest visitor",
      email: conversation.guest_email || "",
      role: "guest"
    },
    assignedAgent: profiles.get(conversation.assigned_to) || null,
    latestMessage: latestMessages.get(conversation.id) || null
  }));
}

async function createConversation(auth, body, req, res) {
  const topic = cleanTopic(body.topic);
  const guestId = auth?.profile ? "" : guestIdFromRequest(req) || cleanGuestId(body.guestId) || crypto.randomUUID();
  const guestName = auth?.profile
    ? ""
    : cleanName(body.guestName) || `Website visitor ${guestId.slice(0, 6).toUpperCase()}`;
  const guestEmail = cleanEmail(body.guestEmail);

  if (!auth?.profile) setGuestCookie(req, res, guestId);

  const identityFilter = auth?.profile
    ? `user_id=eq.${encodeURIComponent(auth.profile.user_id)}`
    : `guest_id=eq.${encodeURIComponent(guestId)}`;
  const existing = (await supabaseFetch(
    `/rest/v1/support_conversations?${identityFilter}&status=neq.closed&topic=eq.${encodeURIComponent(topic)}&select=*&order=last_message_at.desc&limit=1`,
    { method: "GET" }
  )) || [];
  if (existing[0]) return existing[0];

  const created = (await supabaseFetch("/rest/v1/support_conversations", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      user_id: auth?.profile?.user_id || null,
      guest_id: auth?.profile ? null : guestId,
      guest_name: auth?.profile ? null : guestName,
      guest_email: auth?.profile ? null : guestEmail,
      topic,
      status: "open",
      last_message_at: new Date().toISOString()
    })
  })) || [];
  return created[0];
}

async function requireConversationAccess(auth, guestId, conversationId) {
  if (!isUuid(conversationId)) {
    const error = new Error("Invalid conversation.");
    error.status = 400;
    throw error;
  }
  const rows = await supabaseFetch(
    `/rest/v1/support_conversations?id=eq.${encodeURIComponent(conversationId)}&select=*`,
    { method: "GET" }
  );
  const conversation = rows[0];
  if (!conversation) {
    const error = new Error("Conversation not found.");
    error.status = 404;
    throw error;
  }
  const agent = isSupportAgent(auth?.profile);
  const registeredOwner = auth?.profile && conversation.user_id === auth.profile.user_id;
  const guestOwner = !auth?.profile && guestId && conversation.guest_id === guestId;
  if (!agent && !registeredOwner && !guestOwner) {
    const error = new Error("You do not have access to this conversation.");
    error.status = 403;
    throw error;
  }
  return conversation;
}

async function markConversationRead(auth, conversation) {
  const patch = isSupportAgent(auth?.profile) ? { agent_unread: 0 } : { customer_unread: 0 };
  await supabaseFetch(`/rest/v1/support_conversations?id=eq.${encodeURIComponent(conversation.id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

async function loadAttachments(messageIds) {
  const ids = [...new Set(messageIds.filter(isUuid))];
  if (!ids.length) return new Map();
  const rows = await supabaseFetch(
    `/rest/v1/support_attachments?message_id=in.(${ids.join(",")})&select=id,message_id,file_name,mime_type,file_size,created_at`,
    { method: "GET" }
  );
  const grouped = new Map();
  rows.forEach((row) => {
    if (!grouped.has(row.message_id)) grouped.set(row.message_id, []);
    grouped.get(row.message_id).push(row);
  });
  return grouped;
}

async function listMessages(auth, guestId, conversationId) {
  const conversation = await requireConversationAccess(auth, guestId, conversationId);
  const messages = await supabaseFetch(
    `/rest/v1/support_messages?conversation_id=eq.${encodeURIComponent(conversation.id)}&select=*&order=created_at.asc`,
    { method: "GET" }
  );
  const attachments = await loadAttachments(messages.map((message) => message.id));
  await markConversationRead(auth, conversation);
  return messages.map((message) => ({
    ...message,
    attachments: attachments.get(message.id) || []
  }));
}

async function uploadAttachment(conversationId, messageId, attachment) {
  const { url, secretKey } = config();
  const storagePath = `${conversationId}/${messageId}/${Date.now()}-${crypto.randomUUID()}-${attachment.fileName}`;
  const response = await fetch(`${url}/storage/v1/object/support-attachments/${encodeURIComponent(storagePath).replaceAll("%2F", "/")}`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": attachment.mimeType,
      "x-upsert": "false"
    },
    body: attachment.buffer
  });
  if (!response.ok) {
    const text = await response.text();
    const error = new Error(text || "Attachment upload failed.");
    error.status = response.status;
    throw error;
  }

  const created = await supabaseFetch("/rest/v1/support_attachments", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      message_id: messageId,
      conversation_id: conversationId,
      storage_path: storagePath,
      file_name: attachment.fileName,
      mime_type: attachment.mimeType,
      file_size: attachment.buffer.length
    })
  });
  return created[0];
}

async function createMessage(auth, guestId, body) {
  const conversation = await requireConversationAccess(auth, guestId || cleanGuestId(body.guestId), body.conversationId);
  const messageBody = cleanBody(body.body);
  const attachment = parseAttachment(body.attachment);
  if (!messageBody && !attachment) {
    const error = new Error("Please write a message or attach an image.");
    error.status = 400;
    throw error;
  }

  const senderRole = isSupportAgent(auth?.profile) ? auth.profile.role : auth?.profile ? "customer" : "guest";
  const now = new Date().toISOString();
  const messages = await supabaseFetch("/rest/v1/support_messages", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      conversation_id: conversation.id,
      sender_id: auth?.profile?.user_id || null,
      sender_role: senderRole,
      sender_name: auth?.profile?.username || conversation.guest_name || "Guest visitor",
      body: messageBody
    })
  });
  const message = messages[0];
  let savedAttachment = null;
  if (attachment) savedAttachment = await uploadAttachment(conversation.id, message.id, attachment);

  const update = isSupportAgent(auth?.profile)
    ? { last_message_at: now, updated_at: now, customer_unread: Number(conversation.customer_unread || 0) + 1, assigned_to: auth.profile.user_id }
    : { last_message_at: now, updated_at: now, agent_unread: Number(conversation.agent_unread || 0) + 1 };
  await supabaseFetch(`/rest/v1/support_conversations?id=eq.${encodeURIComponent(conversation.id)}`, {
    method: "PATCH",
    body: JSON.stringify(update)
  });

  return {
    ...message,
    attachments: savedAttachment ? [savedAttachment] : []
  };
}

async function requireAttachmentAccess(auth, guestId, attachmentId) {
  if (!isUuid(attachmentId)) {
    const error = new Error("Invalid attachment.");
    error.status = 400;
    throw error;
  }
  const rows = await supabaseFetch(
    `/rest/v1/support_attachments?id=eq.${encodeURIComponent(attachmentId)}&select=*`,
    { method: "GET" }
  );
  const attachment = rows[0];
  if (!attachment) {
    const error = new Error("Attachment not found.");
    error.status = 404;
    throw error;
  }
  const conversations = await supabaseFetch(
    `/rest/v1/support_conversations?id=eq.${encodeURIComponent(attachment.conversation_id)}&select=id,user_id,guest_id`,
    { method: "GET" }
  );
  const conversation = conversations[0];
  const agent = isSupportAgent(auth?.profile);
  const registeredOwner = auth?.profile && conversation?.user_id === auth.profile.user_id;
  const guestOwner = !auth?.profile && guestId && conversation?.guest_id === guestId;
  if (!conversation || (!agent && !registeredOwner && !guestOwner)) {
    const error = new Error("You do not have access to this attachment.");
    error.status = 403;
    throw error;
  }
  return attachment;
}

async function streamAttachment(req, res, auth, guestId, attachmentId) {
  const attachment = await requireAttachmentAccess(auth, guestId, attachmentId);
  const { url, secretKey } = config();
  const storageUrl = `${url}/storage/v1/object/support-attachments/${encodeURIComponent(attachment.storage_path).replaceAll("%2F", "/")}`;
  const response = await fetch(storageUrl, {
    method: "GET",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`
    }
  });
  if (!response.ok) return sendJson(res, response.status, { error: "Attachment could not be loaded." });

  const buffer = Buffer.from(await response.arrayBuffer());
  res.statusCode = 200;
  res.setHeader("Content-Type", attachment.mime_type);
  res.setHeader("Content-Length", String(buffer.length));
  res.setHeader("Cache-Control", "private, max-age=120");
  res.end(buffer);
  return null;
}

module.exports = async function handler(req, res) {
  try {
    const urlInfo = new URL(req.url, `https://${req.headers.host || "hour-ai.com"}`);
    const resource = urlInfo.searchParams.get("resource") || "conversations";
    const auth = await optionalAuth(req);
    const guestId = guestIdFromRequest(req) || cleanGuestId(urlInfo.searchParams.get("guestId"));

    if (resource === "attachment") {
      if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
      if (!auth && !guestId) return sendJson(res, 401, { error: "Please start a support conversation first." });
      return streamAttachment(req, res, auth, guestId, urlInfo.searchParams.get("id"));
    }

    if (resource === "messages") {
      if (req.method === "GET") {
        if (!auth && !guestId) return sendJson(res, 401, { error: "Please start a support conversation first." });
        const messages = await listMessages(auth, guestId, urlInfo.searchParams.get("conversationId"));
        return sendJson(res, 200, { messages });
      }
      if (req.method === "POST") {
        const body = await readJson(req);
        const messageGuestId = guestId || cleanGuestId(body.guestId);
        if (!auth && !messageGuestId) return sendJson(res, 401, { error: "Please start a support conversation first." });
        const message = await createMessage(auth, messageGuestId, body);
        return sendJson(res, 200, { message });
      }
      return sendJson(res, 405, { error: "Method not allowed." });
    }

    if (resource === "conversations") {
      if (!auth && req.method === "GET" && !guestId) return sendJson(res, 200, { conversations: [] });
      if (req.method === "GET") {
        const conversations = await listConversations(auth, guestId, {
          limit: urlInfo.searchParams.get("limit"),
          latest: urlInfo.searchParams.get("latest")
        });
        return sendJson(res, 200, { conversations });
      }
      if (req.method === "POST") {
        const body = await readJson(req);
        const conversation = await createConversation(auth, body, req, res);
        return sendJson(res, 200, { conversation });
      }
      return sendJson(res, 405, { error: "Method not allowed." });
    }

    return sendJson(res, 404, { error: "Support route not found." });
  } catch (error) {
    return sendJson(res, error.status || 400, { error: error.message });
  }
};
