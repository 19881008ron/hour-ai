const crypto = require("crypto");

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 100000) reject(new Error("Request is too large."));
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });
    req.on("error", reject);
  });
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => {
        const index = value.indexOf("=");
        return [decodeURIComponent(value.slice(0, index)), decodeURIComponent(value.slice(index + 1))];
      })
  );
}

function setSessionCookies(res, session) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const common = `; Path=/; HttpOnly; SameSite=Lax${secure}`;
  res.setHeader("Set-Cookie", [
    `hour_ai_access=${encodeURIComponent(session.access_token)}; Max-Age=${session.expires_in || 3600}${common}`,
    `hour_ai_refresh=${encodeURIComponent(session.refresh_token)}; Max-Age=2592000${common}`
  ]);
}

function clearSessionCookies(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const common = `; Path=/; HttpOnly; SameSite=Lax${secure}`;
  res.setHeader("Set-Cookie", [
    `hour_ai_access=; Max-Age=0${common}`,
    `hour_ai_refresh=; Max-Age=0${common}`
  ]);
}

function captchaSecret() {
  return process.env.CAPTCHA_SECRET || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function signCaptcha(answer, nonce, expires) {
  return crypto.createHmac("sha256", captchaSecret()).update(`${answer}|${nonce}|${expires}`).digest("hex");
}

function validateCaptcha(answer, token = {}) {
  if (!captchaSecret() || !answer || !token.nonce || !token.expires || !token.signature) return false;
  if (Date.now() > Number(token.expires)) return false;
  const expected = signCaptcha(String(answer).trim().toUpperCase(), token.nonce, token.expires);
  const actual = String(token.signature);
  return expected.length === actual.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
}

module.exports = {
  clearSessionCookies,
  parseCookies,
  readJson,
  sendJson,
  setSessionCookies,
  signCaptcha,
  validateCaptcha
};
