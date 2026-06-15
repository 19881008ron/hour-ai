const { parseCookies } = require("./http");

function config() {
  const url = process.env.SUPABASE_URL;
  const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !publicKey || !secretKey) throw new Error("Account database is not configured.");
  return { url: url.replace(/\/$/, ""), publicKey, secretKey };
}

async function supabaseFetch(path, options = {}, useServiceKey = true) {
  const { url, publicKey, secretKey } = config();
  const key = useServiceKey ? secretKey : publicKey;
  const authorization = options.accessToken
    ? `Bearer ${options.accessToken}`
    : key.startsWith("eyJ")
      ? `Bearer ${key}`
      : null;
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: key,
      ...(authorization ? { Authorization: authorization } : {}),
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.msg || data?.message || data?.error_description || "Database request failed.");
    error.status = response.status;
    throw error;
  }
  return data;
}

async function authenticatedProfile(req) {
  const accessToken = parseCookies(req).hour_ai_access;
  if (!accessToken) return null;
  const user = await supabaseFetch("/auth/v1/user", { method: "GET", accessToken }, false);
  const rows = await supabaseFetch(
    `/rest/v1/profiles?user_id=eq.${encodeURIComponent(user.id)}&select=*`,
    { method: "GET" }
  );
  return rows?.[0] ? { user, profile: rows[0], accessToken } : null;
}

async function requireAdmin(req) {
  const auth = await authenticatedProfile(req);
  if (!auth || auth.profile.role !== "admin") {
    const error = new Error("Administrator access required.");
    error.status = 403;
    throw error;
  }
  return auth;
}

module.exports = { authenticatedProfile, config, requireAdmin, supabaseFetch };
