const { parseCookies } = require("./http");

function normalizeSupabaseUrl(value) {
  const raw = String(value || "").trim().replace(/^["']|["']$/g, "");
  if (!raw) return "";

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("SUPABASE_URL must be the Project URL, such as https://your-project.supabase.co.");
  }

  if (parsed.protocol !== "https:" || !parsed.hostname.endsWith(".supabase.co")) {
    throw new Error("SUPABASE_URL must be the Project URL, such as https://your-project.supabase.co.");
  }

  return `${parsed.origin}${parsed.pathname
    .replace(/\/(?:rest|auth)\/v1\/?$/i, "")
    .replace(/\/+$/, "")}`;
}

function config() {
  const url = normalizeSupabaseUrl(process.env.SUPABASE_URL);
  const publicKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !publicKey || !secretKey) throw new Error("Account database is not configured.");
  return { url, publicKey: publicKey.trim(), secretKey: secretKey.trim() };
}

function requestHeaders(key, accessToken) {
  const authorization = accessToken
    ? `Bearer ${accessToken}`
    : key.startsWith("eyJ")
      ? `Bearer ${key}`
      : null;
  return {
    apikey: key,
    ...(authorization ? { Authorization: authorization } : {})
  };
}

function databaseUnavailable(cause) {
  const error = new Error("Online support is temporarily unavailable. Please try again shortly.");
  error.status = 503;
  error.code = "SUPABASE_UNREACHABLE";
  error.cause = cause;
  return error;
}

async function resilientFetch(url, options = {}, settings = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const retryableMethod = ["GET", "HEAD", "PATCH"].includes(method);
  const maxAttempts = retryableMethod ? Number(settings.attempts || 3) : 1;
  const timeoutMs = Number(settings.timeoutMs || 10000);
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (
        attempt < maxAttempts &&
        [408, 429, 502, 503, 504].includes(response.status)
      ) {
        await new Promise((resolve) => setTimeout(resolve, 180 * attempt));
        continue;
      }
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt >= maxAttempts) throw databaseUnavailable(error);
      await new Promise((resolve) => setTimeout(resolve, 180 * attempt));
    }
  }

  throw databaseUnavailable(lastError);
}

async function supabaseFetch(path, options = {}, useServiceKey = true) {
  const { url, publicKey, secretKey } = config();
  const key = useServiceKey ? secretKey : publicKey;
  const response = await resilientFetch(`${url}${path}`, {
    ...options,
    headers: {
      ...requestHeaders(key, options.accessToken),
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.slice(0, 500) };
    }
  }
  if (!response.ok) {
    const error = new Error(data?.msg || data?.message || data?.error_description || "Database request failed.");
    error.status = response.status;
    error.code = data?.code || "SUPABASE_REQUEST_FAILED";
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

async function requireSupportAgent(req) {
  const auth = await authenticatedProfile(req);
  if (!auth || !["admin", "agent"].includes(auth.profile.role)) {
    const error = new Error("Support agent access required.");
    error.status = 403;
    throw error;
  }
  return auth;
}

module.exports = {
  authenticatedProfile,
  config,
  requestHeaders,
  requireAdmin,
  requireSupportAgent,
  resilientFetch,
  supabaseFetch
};
