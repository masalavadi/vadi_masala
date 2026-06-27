function sendJson(response, statusCode, body) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(statusCode).send(JSON.stringify(body));
}

module.exports = function handler(request, response) {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  if (!supabaseUrl || !supabaseAnonKey) {
    sendJson(response, 500, { error: "Supabase public config is not configured" });
    return;
  }

  sendJson(response, 200, {
    supabaseUrl,
    supabaseAnonKey,
    razorpayKeyId: razorpayKeyId || "",
  });
};
