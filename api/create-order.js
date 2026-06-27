const Razorpay = require("razorpay");

const MIN_ORDER_VALUE = 500;
const SHIPPING_FEE = 59;
const FREE_SHIPPING_VALUE = 999;

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

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

async function loadProductsById(productIds) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase product catalog is not configured");
  }

  const uniqueIds = Array.from(new Set(productIds.filter(Boolean)));
  if (!uniqueIds.length) return new Map();

  const quotedIds = uniqueIds.map((id) => `"${String(id).replaceAll('"', '\\"')}"`).join(",");
  const url = new URL("/rest/v1/products", supabaseUrl);
  url.searchParams.set("select", "id,data");
  url.searchParams.set("id", `in.(${quotedIds})`);

  const response = await fetch(url, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Could not load Supabase product catalog");
  }

  const rows = await response.json();
  return new Map(
    (rows || [])
      .map((row) => {
        const data = row?.data && typeof row.data === "object" ? row.data : row;
        const id = row?.id || data?.id;
        return id ? [id, { ...data, id }] : null;
      })
      .filter(Boolean),
  );
}

function getVariant(product, variantId) {
  if (Array.isArray(product.variants)) {
    return product.variants.find((variant) => variant.id === variantId) || product.variants[0];
  }

  return {
    id: product.pack || "default",
    label: product.pack || "Default pack",
    price: product.price,
  };
}

async function calculateOrderAmount(items) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error("Cart is empty");
  }

  const products = await loadProductsById(items.map((item) => String(item.id || "").trim()));
  let subtotal = 0;

  for (const item of items) {
    const productId = String(item.id || "").trim();
    const product = products.get(productId);
    const qty = Math.max(1, Math.min(99, Math.round(Number(item.qty) || 0)));
    if (!product || !product.listed) {
      throw new Error(`Product is unavailable: ${productId}`);
    }
    if (qty > Number(product.stock || 0)) {
      throw new Error(`Insufficient stock: ${productId}`);
    }

    const variant = getVariant(product, String(item.variantId || "").trim());
    const price = Math.round(Number(variant?.price));
    if (!Number.isFinite(price) || price <= 0) {
      throw new Error(`Invalid product price: ${productId}`);
    }

    subtotal += price * qty;
  }

  if (subtotal < MIN_ORDER_VALUE) {
    throw new Error("Minimum order value not reached");
  }

  const shipping = subtotal >= FREE_SHIPPING_VALUE ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    amount: Math.round((subtotal + shipping) * 100),
  };
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const razorpay = getRazorpayClient();
  if (!razorpay) {
    sendJson(response, 500, { error: "Razorpay is not configured" });
    return;
  }

  const body = await readJsonBody(request);
  const currency = String(body.currency || "INR").trim().toUpperCase();
  const receipt = String(body.receipt || `receipt_${Date.now()}`).trim().slice(0, 40);

  if (currency !== "INR") {
    sendJson(response, 400, { error: "Only INR payments are supported" });
    return;
  }

  try {
    const calculated = await calculateOrderAmount(body.items);
    const order = await razorpay.orders.create({
      amount: calculated.amount,
      currency,
      receipt,
      payment_capture: 1,
    });

    sendJson(response, 200, {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      subtotal: calculated.subtotal,
      shipping: calculated.shipping,
      total: calculated.total,
    });
  } catch (error) {
    console.warn("Razorpay order creation failed.", error);
    const statusCode = error?.statusCode === 401 ? 401 : 500;
    sendJson(response, statusCode, {
      error: statusCode === 401 ? "Razorpay authentication failed" : error?.message || "Could not create Razorpay order",
    });
  }
};
