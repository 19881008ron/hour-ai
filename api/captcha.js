const crypto = require("crypto");
const { sendJson, signCaptcha } = require("./_lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  if (!process.env.CAPTCHA_SECRET && !process.env.SUPABASE_SECRET_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return sendJson(res, 503, { error: "Account database is not configured." });
  }

  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(5);
  const answer = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  const nonce = crypto.randomBytes(16).toString("hex");
  const expires = Date.now() + 5 * 60 * 1000;
  const signature = signCaptcha(answer, nonce, expires);
  const colors = ["#00b8d4", "#2bd576", "#7668ff", "#ff8a32"];
  const characters = answer.split("").map((character, index) => {
    const x = 22 + index * 31;
    const y = 38 + (bytes[index] % 7);
    const rotation = (bytes[index] % 17) - 8;
    return `<text x="${x}" y="${y}" transform="rotate(${rotation} ${x} ${y})" fill="${colors[index % colors.length]}">${character}</text>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="190" height="58" viewBox="0 0 190 58"><rect width="190" height="58" rx="5" fill="#0a0d12"/><path d="M8 17L182 42M12 47L178 12M0 31H190" stroke="#39414d" stroke-width="1" opacity=".8"/><g font-family="Arial,sans-serif" font-size="27" font-weight="800">${characters}</g></svg>`;

  sendJson(res, 200, {
    image: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    token: { nonce, expires, signature }
  });
};
