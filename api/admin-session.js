const SUPABASE_URL = "https://tbwgopxzymgdgmmkbfop.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRid2dvcHh6eW1nZGdtbWtiZm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTUyNDksImV4cCI6MjA5NzI3MTI0OX0.WqC7IIP-tp2it1L7drjmQd2LJvIJA_wESTXzGIoYRAQ";

function getAllowedEmails() {
  return new Set(
    String(process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

function sendJson(response, statusCode, body) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(statusCode).send(JSON.stringify(body));
}

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    sendJson(response, 405, { isAdmin: false, error: "Method not allowed" });
    return;
  }

  const token = String(request.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    sendJson(response, 401, { isAdmin: false, error: "Missing auth token" });
    return;
  }

  const allowedEmails = getAllowedEmails();
  if (!allowedEmails.size) {
    sendJson(response, 403, { isAdmin: false, error: "Admin access is not configured" });
    return;
  }

  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!userResponse.ok) {
    sendJson(response, 401, { isAdmin: false, error: "Invalid auth token" });
    return;
  }

  const user = await userResponse.json();
  const email = String(user.email || "").toLowerCase();
  const isAdmin = allowedEmails.has(email);
  sendJson(response, isAdmin ? 200 : 403, { isAdmin, email });
};
