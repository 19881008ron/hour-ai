const { sendJson } = require("../_lib/http");
const { requireAdmin, supabaseFetch } = require("../_lib/supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  try {
    await requireAdmin(req);
    const users = await supabaseFetch(
      "/rest/v1/profiles?select=user_id,username,email,nationality,occupation,age,gender,level,created_at&role=eq.customer&order=created_at.desc",
      { method: "GET" }
    );
    sendJson(res, 200, { users });
  } catch (error) {
    sendJson(res, error.status || 400, { error: error.message });
  }
};
