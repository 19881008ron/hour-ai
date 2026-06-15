const { readJson, sendJson } = require("../_lib/http");
const { requireAdmin, supabaseFetch } = require("../_lib/supabase");

const LEVELS = new Set([null, "C", "B", "A"]);

module.exports = async function handler(req, res) {
  if (req.method !== "PATCH") return sendJson(res, 405, { error: "Method not allowed." });
  try {
    const admin = await requireAdmin(req);
    const body = await readJson(req);
    const userId = String(body.userId || "");
    const level = body.level === "" ? null : body.level;
    if (!/^[0-9a-f-]{36}$/i.test(userId) || !LEVELS.has(level)) throw new Error("Invalid customer or level.");

    const existing = await supabaseFetch(
      `/rest/v1/profiles?user_id=eq.${encodeURIComponent(userId)}&select=level,role`,
      { method: "GET" }
    );
    if (!existing[0] || existing[0].role !== "customer") throw new Error("Customer not found.");

    await supabaseFetch(`/rest/v1/profiles?user_id=eq.${encodeURIComponent(userId)}`, {
      method: "PATCH",
      body: JSON.stringify({ level, level_updated_at: new Date().toISOString() })
    });
    await supabaseFetch("/rest/v1/level_history", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        previous_level: existing[0].level,
        new_level: level,
        changed_by: admin.user.id
      })
    });
    sendJson(res, 200, { ok: true, level });
  } catch (error) {
    sendJson(res, error.status || 400, { error: error.message });
  }
};
