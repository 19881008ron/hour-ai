const crypto = require("crypto");
const { readJson, sendJson } = require("../_lib/http");
const { authenticatedProfile, config, supabaseFetch } = require("../_lib/supabase");

const SUPPORT_ROLES = new Set(["admin", "agent"]);
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

function isSupportAgent(profile) {
  return SUPPORT_ROLES.has(profile?.role);
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function cleanBody(value) {
  return String(value || "").trim().slice(0, 2000);
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

async function requireConversationAccess(auth, conversationId) {
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
  if (!isSupportAgent(auth.profile) && conversation.user_id !== auth.profile.user_id) {
    const error = new Error("You do not have access to this conversation.");
    error.status = 403;
    throw error;
  }
  return conversation;
}

async function markConversationRead(auth, conversation) {
  const patch = isSupportAgent(auth.profile) ? { agent_unread: 0 } : { customer_unread: 0 };
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

async function listMessages(auth, conversationId) {
  const conversation = await requireConversationAccess(auth, conversationId);
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

async function createMessage(auth, body) {
  const conversationId = body.conversationId;
  const conversation = await requireConversationAccess(auth, conversationId);
  const messageBody = cleanBody(body.body);
  const attachment = parseAttachment(body.attachment);
  if (!messageBody && !attachment) {
    const error = new Error("Please write a message or attach an image.");
    error.status = 400;
    throw error;
  }

  const senderRole = isSupportAgent(auth.profile) ? auth.profile.role : "customer";
  const now = new Date().toISOString();
  const messages = await supabaseFetch("/rest/v1/support_messages", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      conversation_id: conversation.id,
      sender_id: auth.profile.user_id,
      sender_role: senderRole,
      body: messageBody
    })
  });
  const message = messages[0];
  let savedAttachment = null;
  if (attachment) savedAttachment = await uploadAttachment(conversation.id, message.id, attachment);

  const update = isSupportAgent(auth.profile)
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

module.exports = async function handler(req, res) {
  try {
    const auth = await authenticatedProfile(req);
    if (!auth) return sendJson(res, 401, { error: "Please sign in before using online support." });

    if (req.method === "GET") {
      const url = new URL(req.url, `https://${req.headers.host || "hour-ai.com"}`);
      const messages = await listMessages(auth, url.searchParams.get("conversationId"));
      return sendJson(res, 200, { messages });
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      const message = await createMessage(auth, body);
      return sendJson(res, 200, { message });
    }

    return sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    return sendJson(res, error.status || 400, { error: error.message });
  }
};
