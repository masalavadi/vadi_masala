const ORDER_HEADERS = [
  "Order ID",
  "Timestamp",
  "Customer Name",
  "Phone",
  "Address",
  "State",
  "Product",
  "Quantity",
  "Unit Price",
  "Subtotal",
  "Discount",
  "Shipping",
  "Total Amount",
  "Payment Mode",
  "Payment Status",
  "Razorpay Order ID",
  "Razorpay Payment ID",
  "Coupon Code",
  "Notes",
  "Order Status",
  "Source",
  "Customer Email",
  "Google Subject",
];

function jsonResponse(payload, statusCode) {
  return ContentService.createTextOutput(JSON.stringify({ statusCode: statusCode || 200, ...payload }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(event) {
  const expectedToken = PropertiesService.getScriptProperties().getProperty("WEBHOOK_TOKEN") || "";
  const body = JSON.parse(event.postData.contents || "{}");
  const receivedToken = body.token || "";

  if (expectedToken && receivedToken !== expectedToken) {
    return jsonResponse({ ok: false, error: "Invalid token" }, 403);
  }

  const row = body.row || {};
  if (!row["Order ID"]) {
    return jsonResponse({ ok: false, error: "Missing order row" }, 400);
  }

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName("Orders") || spreadsheet.insertSheet("Orders");

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ORDER_HEADERS);
  }

  sheet.appendRow(ORDER_HEADERS.map((header) => row[header] || ""));
  return jsonResponse({ ok: true, orderId: row["Order ID"] }, 200);
}
