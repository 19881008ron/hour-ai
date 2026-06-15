const { readJson, sendJson, setSessionCookies, validateCaptcha } = require("./_lib/http");
const { supabaseFetch } = require("./_lib/supabase");

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME = /^[a-zA-Z0-9_.-]{3,30}$/;
const GENDERS = new Set(["female", "male", "nonbinary", "prefer_not_to_say"]);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed." });
  try {
    const body = await readJson(req);
    const username = String(body.username || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const nationality = String(body.nationality || "").trim();
    const occupation = String(body.occupation || "").trim();
    const age = Number(body.age);
    const gender = String(body.gender || "");

    if (!USERNAME.test(username)) throw new Error("Username must be 3-30 letters, numbers, dots, dashes, or underscores.");
    if (!EMAIL.test(email)) throw new Error("Enter a valid email address.");
    if (password.length < 8) throw new Error("Password must contain at least 8 characters.");
    if (!nationality || nationality.length > 80) throw new Error("Enter a valid nationality.");
    if (!occupation || occupation.length > 100) throw new Error("Enter a valid occupation.");
    if (!Number.isInteger(age) || age < 18 || age > 100) throw new Error("Age must be between 18 and 100.");
    if (!GENDERS.has(gender)) throw new Error("Select a valid gender option.");
    if (!body.consent) throw new Error("Consent is required to create an account.");
    if (!validateCaptcha(body.captchaAnswer, body.captchaToken)) throw new Error("The verification code is incorrect or expired.");

    const created = await supabaseFetch("/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { username } })
    });

    try {
      await supabaseFetch("/rest/v1/profiles", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          user_id: created.id,
          username,
          email,
          nationality,
          occupation,
          age,
          gender,
          level: null,
          role: "customer",
          consent_at: new Date().toISOString()
        })
      });
    } catch (error) {
      await supabaseFetch(`/auth/v1/admin/users/${created.id}`, { method: "DELETE" }).catch(() => {});
      throw error;
    }

    const session = await supabaseFetch(
      "/auth/v1/token?grant_type=password",
      { method: "POST", body: JSON.stringify({ email, password }) },
      false
    );
    setSessionCookies(res, session);
    sendJson(res, 201, { ok: true });
  } catch (error) {
    sendJson(res, error.status || 400, { error: error.message });
  }
};
