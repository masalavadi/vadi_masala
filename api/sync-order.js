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

function getSupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase auth is not configured");
  return { supabaseUrl, supabaseAnonKey };
}

function getBearerToken(request) {
  const token = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new Error("Missing auth token");
  return token;
}

async function getAuthorizedUser(token, { supabaseUrl, supabaseAnonKey }) {
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userResponse.ok) throw new Error("Invalid auth token");
  return userResponse.json();
}

function getAdminEmails() {
  return String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function orderFromSupabaseRow(row) {
  const data = row?.data && typeof row.data === "object" ? row.data : {};
  const id = row?.id || data.id;
  if (!id) return null;
  return {
    ...data,
    id,
    date: data.date || row.created_at || "",
  };
}

async function getCanonicalOrders({ token, config, orderId, syncAll }) {
  const query = new URLSearchParams({
    select: "id,data,created_at",
    order: "created_at.asc",
  });
  if (!syncAll) query.set("id", `eq.${orderId}`);

  const ordersResponse = await fetch(`${config.supabaseUrl}/rest/v1/orders?${query}`, {
    headers: {
      apikey: config.supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!ordersResponse.ok) {
    const errorText = await ordersResponse.text();
    throw new Error(`Could not load canonical orders: ${errorText.slice(0, 200)}`);
  }

  return (await ordersResponse.json()).map(orderFromSupabaseRow).filter(Boolean);
}

function orderItemsSummary(order) {
  return (order.items || [])
    .map((item) => `${item.name} (${item.pack}) x ${item.qty}`)
    .join(", ");
}

function orderQuantitySummary(order) {
  return (order.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function orderUnitPriceSummary(order) {
  return (order.items || [])
    .map((item) => `${item.name}: ${Number(item.price || 0)}`)
    .join(", ");
}

function toSheetRow(order) {
  const subtotal = Number(order.subtotal) || (order.items || []).reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping) || 0;
  const total = Number(order.totalAmount) || Math.max(0, subtotal - discount + shipping);

  return {
    "Order ID": order.id || "",
    Timestamp: order.date || order.createdAt || new Date().toISOString(),
    "Customer Name": order.customer || "",
    Phone: order.phone || "",
    Address: order.address || "",
    State: order.state || "",
    Product: orderItemsSummary(order),
    Quantity: orderQuantitySummary(order),
    "Unit Price": orderUnitPriceSummary(order),
    Subtotal: subtotal,
    Discount: discount,
    Shipping: shipping,
    "Total Amount": total,
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
    const config = getSupabaseConfig();
    const token = getBearerToken(request);
    const user = await getAuthorizedUser(token, config);
    const body = await readJsonBody(request);
    const userEmail = String(user.email || "").toLowerCase();
    const isAdmin = getAdminEmails().includes(userEmail);
    const syncAll = body.syncAll === true;
    const orderId = String(body.orderId || body.order?.id || "").trim();

    if (syncAll && !isAdmin) {
      sendJson(response, 403, { ok: false, error: "Admin access required" });
      return;
    }
    if (!syncAll && !orderId) {
      sendJson(response, 400, { ok: false, error: "Order ID is required" });
      return;
    }

    const orders = await getCanonicalOrders({ token, config, orderId, syncAll });
    if (!orders.length) {
      sendJson(response, 404, { ok: false, error: syncAll ? "No orders found" : "Order not found" });
      return;
    }
    if (!isAdmin && orders.some((order) => String(order.email || "").toLowerCase() !== userEmail)) {
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
        rows: orders.map(toSheetRow),
      }),
      signal: AbortSignal.timeout(15000),
    });

    const resultText = await webhookResponse.text();
    let webhookResult = {};
    try {
      webhookResult = JSON.parse(resultText);
    } catch {
      webhookResult = {};
    }
    const syncSucceeded = webhookResponse.ok && webhookResult.ok === true;
    sendJson(response, syncSucceeded ? 200 : 502, {
      ok: syncSucceeded,
      configured: true,
      status: webhookResponse.status,
      synced: Number(webhookResult.synced || 0),
      result: resultText.slice(0, 600),
    });
  } catch (error) {
    console.warn("Google Sheets order sync failed.", error);
    sendJson(response, 500, { ok: false, error: error?.message || "Google Sheets order sync failed" });
  }
};
