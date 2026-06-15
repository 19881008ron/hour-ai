const { sendJson } = require("../_lib/http");
const { requireAdmin, supabaseFetch } = require("../_lib/supabase");

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  try {
    await requireAdmin(req);
    const rows = await supabaseFetch(
      "/rest/v1/profiles?select=username,email,nationality,occupation,age,gender,level,role,created_at,level_updated_at&order=created_at.desc",
      { method: "GET" }
    );
    const columns = ["username", "email", "nationality", "occupation", "age", "gender", "level", "role", "created_at", "level_updated_at"];
    const csv = [columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n");
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="hour-ai-customers-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.end(`\uFEFF${csv}`);
  } catch (error) {
    sendJson(res, error.status || 400, { error: error.message });
  }
};
