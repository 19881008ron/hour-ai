const { clearSessionCookies, sendJson } = require("./_lib/http");
const { authenticatedProfile } = require("./_lib/supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  try {
    const auth = await authenticatedProfile(req);
    if (!auth) return sendJson(res, 401, { error: "Not signed in." });
    const { user_id, ...profile } = auth.profile;
    sendJson(res, 200, { profile });
  } catch (error) {
    clearSessionCookies(res);
    sendJson(res, error.message === "Account database is not configured." ? 503 : 401, { error: error.message });
  }
};
