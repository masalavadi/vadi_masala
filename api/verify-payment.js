const crypto = require("crypto");

function sendJson(response, statusCode, body) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(statusCode).send(JSON.stringify(body));
}

function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return Promise.resolve(request.body);
  if (typeof request.body === "string") {
    try {
      return Promise.resolve(JSON.parse(request.body || "{}"));
    } catch {
      return Promise.resolve({});
    }
  }

  return new Promise((resolve) => {
    let rawBody = "";
    request.on("data", (chunk) => {
      rawBody += chunk;
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(rawBody || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left || ""), "hex");
  const rightBuffer = Buffer.from(String(right || ""), "hex");
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    sendJson(response, 500, { error: "Razorpay is not configured" });
    return;
  }

  const body = await readJsonBody(request);
  const orderId = String(body.razorpay_order_id || "").trim();
  const paymentId = String(body.razorpay_payment_id || "").trim();
  const signature = String(body.razorpay_signature || "").trim();

  if (!orderId || !paymentId || !signature) {
    sendJson(response, 400, { success: false, error: "Missing payment verification fields" });
    return;
  }

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (!safeCompare(generatedSignature, signature)) {
    sendJson(response, 400, { success: false, error: "Invalid payment signature" });
    return;
  }

  sendJson(response, 200, {
    success: true,
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
  });
};
