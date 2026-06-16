const { readJson, sendJson } = require("../_lib/http");

const courses = {
  C: { name: "C-Level AI Editor", amount: 199 },
  B: { name: "B-Level AI Editor", amount: 599 },
  A: { name: "A-Level AI Editor", amount: 999 }
};

function paypalBaseUrl() {
  return process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

function siteOrigin(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
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
    const level = String(body.level || "").toUpperCase();
    const course = courses[level];
    if (!course) return sendJson(res, 400, { error: "Invalid course level." });

    const currency = process.env.PAYPAL_CURRENCY || "USD";
    const total = (course.amount * 1.04).toFixed(2);
    const token = await paypalAccessToken();
    const origin = siteOrigin(req);

    const orderResponse = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: `hour-ai-${level}`,
            description: `${course.name} course with 4% PayPal processing fee`,
            amount: {
              currency_code: currency,
              value: total,
              breakdown: {
                item_total: { currency_code: currency, value: course.amount.toFixed(2) },
                handling: { currency_code: currency, value: (course.amount * 0.04).toFixed(2) }
              }
            },
            items: [
              {
                name: course.name,
                quantity: "1",
                unit_amount: { currency_code: currency, value: course.amount.toFixed(2) },
                category: "DIGITAL_GOODS"
              }
            ]
          }
        ],
        application_context: {
          brand_name: "Hour AI",
          landing_page: "BILLING",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: `${origin}/?payment=paypal-return&level=${encodeURIComponent(level)}`,
          cancel_url: `${origin}/?payment=cancelled`
        }
      })
    });

    const order = await orderResponse.json();
    if (!orderResponse.ok) {
      return sendJson(res, orderResponse.status, { error: order.message || "PayPal order creation failed." });
    }

    const approvalUrl = (order.links || []).find((link) => link.rel === "approve")?.href;
    if (!approvalUrl) return sendJson(res, 502, { error: "PayPal approval link was not returned." });

    return sendJson(res, 200, { approvalUrl, orderId: order.id, amount: total, currency });
  } catch (error) {
    return sendJson(res, 503, { error: error.message || "PayPal checkout is temporarily unavailable." });
  }
};
