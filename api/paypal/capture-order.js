const { readJson, sendJson } = require("../_lib/http");

function paypalBaseUrl() {
  return process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function paypalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error("PayPal checkout is not configured yet.");

  const response = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) throw new Error("PayPal authorization failed.");
  return data.access_token;
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed." });

  try {
    const body = await readJson(req);
    const orderId = String(body.orderId || "").trim();
    if (!orderId) return sendJson(res, 400, { error: "Missing PayPal order ID." });

    const token = await paypalAccessToken();
    const response = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    if (!response.ok) {
      return sendJson(res, response.status, { error: data.message || "PayPal payment capture failed." });
    }

    return sendJson(res, 200, {
      status: data.status,
      orderId: data.id,
      payerEmail: data.payer?.email_address || "",
      captureId: data.purchase_units?.[0]?.payments?.captures?.[0]?.id || ""
    });
  } catch (error) {
    return sendJson(res, 503, { error: error.message || "PayPal payment capture is temporarily unavailable." });
  }
};
