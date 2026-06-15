const { readJson, sendJson, setSessionCookies } = require("./_lib/http");
const { supabaseFetch } = require("./_lib/supabase");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed." });
  try {
    const body = await readJson(req);
    const session = await supabaseFetch(
      "/auth/v1/token?grant_type=password",
      {
        method: "POST",
        body: JSON.stringify({
          email: String(body.email || "").trim().toLowerCase(),
          password: String(body.password || "")
        })
      },
      false
    );
    setSessionCookies(res, session);
    sendJson(res, 200, { ok: true });
  } catch (error) {
    const unconfigured = error.message === "Account database is not configured.";
    sendJson(res, unconfigured ? 503 : error.status === 400 ? 401 : error.status || 400, {
      error: unconfigured ? error.message : "Incorrect email or password."
    });
  }
};
