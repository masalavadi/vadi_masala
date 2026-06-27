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

async function getAuthorizedUser(request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase auth is not configured");

  const token = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new Error("Missing auth token");

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userResponse.ok) throw new Error("Invalid auth token");
  return userResponse.json();
}

function orderItemsSummary(order) {
  return (order.items || [])
    .map((item) => `${item.name} (${item.pack}) x ${item.qty}`)
    .join(", ");
}

function orderQuantitySummary(order) {
  return (order.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function toSheetRow(order) {
  const subtotal = Number(order.subtotal) || (order.items || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping) || 0;
  const total = Number(order.totalAmount) || Math.max(0, subtotal - discount + shipping);

  return {
    "Order ID": order.id || "",
    Timestamp: new Date().toISOString(),
    "Customer Name": order.customer || "",
    Phone: order.phone || "",
    Address: order.address || "",
    State: order.state || "",
    Product: orderItemsSummary(order),
    Quantity: String(orderQuantitySummary(order)),
    "Unit Price": "",
    Subtotal: String(subtotal),
    Discount: String(discount),
    Shipping: String(shipping),
    "Total Amount": String(total),
    "Payment Mode": order.payment || "Razorpay",
    "Payment Status": order.paymentStatus || "",
    "Razorpay Order ID": order.razorpay?.orderId || "",
    "Razorpay Payment ID": order.razorpay?.paymentId || "",
    "Coupon Code": order.couponCode || "",
    Notes: order.notes || "",
    "Order Status": order.status || "New",
    Source: "Website",
    "Customer Email": order.email || "",
    "Google Subject": order.supabaseUserId || "",
  };
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    sendJson(response, 200, { ok: false, configured: false, error: "Google Sheets webhook is not configured" });
    return;
  }

  try {
    const user = await getAuthorizedUser(request);
    const body = await readJsonBody(request);
    const order = body.order && typeof body.order === "object" ? body.order : {};
    const userEmail = String(user.email || "").toLowerCase();
    const orderEmail = String(order.email || "").toLowerCase();
    if (!order.id || !orderEmail || orderEmail !== userEmail) {
      sendJson(response, 403, { ok: false, error: "Order does not belong to this user" });
      return;
    }

    const webhookToken = process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN || "";
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
      },
      body: JSON.stringify({
        token: webhookToken,
        order,
        row: toSheetRow(order),
      }),
    });

    const resultText = await webhookResponse.text();
    sendJson(response, webhookResponse.ok ? 200 : 502, {
      ok: webhookResponse.ok,
      configured: true,
      status: webhookResponse.status,
      result: resultText.slice(0, 600),
    });
  } catch (error) {
    console.warn("Google Sheets order sync failed.", error);
    sendJson(response, 500, { ok: false, error: error?.message || "Google Sheets order sync failed" });
  }
};
