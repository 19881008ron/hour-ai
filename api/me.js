const { clearSessionCookies, sendJson } = require("../lib/http");
const { authenticatedProfile } = require("../lib/supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  try {
    const auth = await authenticatedProfile(req);
    if (!auth) return sendJson(res, 401, { error: "Not signed in." });
    sendJson(res, 200, { profile: auth.profile });
  } catch (error) {
    clearSessionCookies(res);
    sendJson(res, error.message === "Account database is not configured." ? 503 : 401, { error: error.message });
  }
};
