const { readJson, sendJson } = require("../_lib/http");
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

async function listConversations(auth) {
  const agent = isSupportAgent(auth.profile);
  const filter = agent ? "" : `&user_id=eq.${encodeURIComponent(auth.profile.user_id)}`;
  const conversations = await supabaseFetch(
    `/rest/v1/support_conversations?select=*&order=last_message_at.desc${filter}`,
    { method: "GET" }
  );
  const profiles = await loadProfiles(conversations.map((item) => item.user_id).concat(conversations.map((item) => item.assigned_to)));
  const latestMessages = await loadLatestMessages(conversations.map((item) => item.id));

  return conversations.map((conversation) => ({
    ...conversation,
    customer: profiles.get(conversation.user_id) || null,
    assignedAgent: profiles.get(conversation.assigned_to) || null,
    latestMessage: latestMessages.get(conversation.id) || null
  }));
}

async function createConversation(auth, body) {
  const topic = cleanTopic(body.topic);
  const existing = await supabaseFetch(
    `/rest/v1/support_conversations?user_id=eq.${encodeURIComponent(auth.profile.user_id)}&status=neq.closed&topic=eq.${encodeURIComponent(topic)}&select=*&order=last_message_at.desc&limit=1`,
    { method: "GET" }
  );
  if (existing[0]) return existing[0];

  const created = await supabaseFetch("/rest/v1/support_conversations", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      user_id: auth.profile.user_id,
      topic,
      status: "open",
      last_message_at: new Date().toISOString()
    })
  });
  return created[0];
}

module.exports = async function handler(req, res) {
  try {
    const auth = await authenticatedProfile(req);
    if (!auth) return sendJson(res, 401, { error: "Please sign in before starting online support." });

    if (req.method === "GET") {
      const conversations = await listConversations(auth);
      return sendJson(res, 200, { conversations });
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      const conversation = await createConversation(auth, body);
      return sendJson(res, 200, { conversation });
    }

    return sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    return sendJson(res, error.status || 400, { error: error.message });
  }
};
