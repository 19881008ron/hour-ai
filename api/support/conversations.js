const crypto = require("crypto");
const { parseCookies, readJson, sendJson } = require("../_lib/http");
const { authenticatedProfile, supabaseFetch } = require("../_lib/supabase");

const SUPPORT_ROLES = new Set(["admin", "agent"]);

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

function guestIdFromRequest(req) {
  const value = parseCookies(req).hour_ai_guest;
  return /^[0-9a-f-]{36}$/i.test(String(value || "")) ? value : "";
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
  const rows = await supabaseFetch(
    `/rest/v1/support_messages?conversation_id=in.(${ids.join(",")})&select=id,conversation_id,sender_role,body,created_at&order=created_at.desc`,
    { method: "GET" }
  );
  const latest = new Map();
  rows.forEach((row) => {
    if (!latest.has(row.conversation_id)) latest.set(row.conversation_id, row);
  });
  return latest;
}

async function listConversations(auth, guestId) {
  const agent = isSupportAgent(auth?.profile);
  let filter = "";
  if (!agent && auth?.profile) filter = `&user_id=eq.${encodeURIComponent(auth.profile.user_id)}`;
  if (!agent && !auth?.profile) filter = `&guest_id=eq.${encodeURIComponent(guestId)}`;
  const conversations = await supabaseFetch(
    `/rest/v1/support_conversations?select=*&order=last_message_at.desc${filter}`,
    { method: "GET" }
  );
  const profiles = await loadProfiles(conversations.map((item) => item.user_id).concat(conversations.map((item) => item.assigned_to)));
  const latestMessages = await loadLatestMessages(conversations.map((item) => item.id));

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
  const guestId = auth?.profile ? "" : guestIdFromRequest(req) || crypto.randomUUID();
  const guestName = cleanName(body.guestName);
  const guestEmail = cleanEmail(body.guestEmail);
  if (!auth?.profile && !guestName) {
    const error = new Error("Please enter your name before starting support chat.");
    error.status = 400;
    throw error;
  }

  if (!auth?.profile) setGuestCookie(req, res, guestId);

  const identityFilter = auth?.profile
    ? `user_id=eq.${encodeURIComponent(auth.profile.user_id)}`
    : `guest_id=eq.${encodeURIComponent(guestId)}`;
  const existing = await supabaseFetch(
    `/rest/v1/support_conversations?${identityFilter}&status=neq.closed&topic=eq.${encodeURIComponent(topic)}&select=*&order=last_message_at.desc&limit=1`,
    { method: "GET" }
  );
  if (existing[0]) return existing[0];

  const created = await supabaseFetch("/rest/v1/support_conversations", {
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
  });
  return created[0];
}

module.exports = async function handler(req, res) {
  try {
    const auth = await optionalAuth(req);
    const guestId = guestIdFromRequest(req);
    if (!auth && req.method === "GET" && !guestId) return sendJson(res, 200, { conversations: [] });

    if (req.method === "GET") {
      const conversations = await listConversations(auth, guestId);
      return sendJson(res, 200, { conversations });
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      const conversation = await createConversation(auth, body, req, res);
      return sendJson(res, 200, { conversation });
    }

    return sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    return sendJson(res, error.status || 400, { error: error.message });
  }
};
