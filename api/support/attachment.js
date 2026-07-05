const { parseCookies, sendJson } = require("../_lib/http");
const { authenticatedProfile, config, supabaseFetch } = require("../_lib/supabase");

const SUPPORT_ROLES = new Set(["admin", "agent"]);

function isSupportAgent(profile) {
  return SUPPORT_ROLES.has(profile?.role);
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}

function guestIdFromRequest(req) {
  const value = parseCookies(req).hour_ai_guest;
  return /^[0-9a-f-]{36}$/i.test(String(value || "")) ? value : "";
}

async function optionalAuth(req) {
  try {
    return await authenticatedProfile(req);
  } catch (error) {
    if (error.message === "Account database is not configured.") throw error;
    return null;
  }
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

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  try {
    const auth = await optionalAuth(req);
    const guestId = guestIdFromRequest(req);
    if (!auth && !guestId) return sendJson(res, 401, { error: "Please start a support conversation first." });

    const urlInfo = new URL(req.url, `https://${req.headers.host || "hour-ai.com"}`);
    const attachment = await requireAttachmentAccess(auth, guestId, urlInfo.searchParams.get("id"));
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
  } catch (error) {
    return sendJson(res, error.status || 400, { error: error.message });
  }
};
