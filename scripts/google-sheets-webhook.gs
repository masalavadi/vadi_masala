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

const ORDER_SPREADSHEET_ID = "1Qty1AhyMYag69xdEIkKChy8ATz4xWyTUkL4RENkzcEM";

function jsonResponse(payload, statusCode) {
  return ContentService.createTextOutput(JSON.stringify({ statusCode: statusCode || 200, ...payload }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrderSpreadsheet() {
  return SpreadsheetApp.openById(ORDER_SPREADSHEET_ID);
}

function doGet() {
  try {
    const spreadsheet = getOrderSpreadsheet();
    return jsonResponse(
      {
        ok: true,
        spreadsheetId: spreadsheet.getId(),
        spreadsheetUrl: spreadsheet.getUrl(),
        sheetName: "Orders",
      },
      200,
    );
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) }, 500);
  }
}

function sheetCellValue(header, value) {
  if (value === null || value === undefined) return "";
  if (header === "Timestamp" && value) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (typeof value === "string") {
    const limitedValue = value.slice(0, 5000);
    return /^[=+\-@]/.test(limitedValue) ? `'${limitedValue}` : limitedValue;
  }
  return value;
}

function ensureOrderHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, ORDER_HEADERS.length).setValues([ORDER_HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function upsertOrderRows(sheet, rows) {
  ensureOrderHeaders(sheet);
  const previousLastRow = sheet.getLastRow();
  const existingIds =
    previousLastRow > 1
      ? sheet.getRange(2, 1, previousLastRow - 1, 1).getDisplayValues()
      : [];
  const rowByOrderId = new Map();
  existingIds.forEach((values, index) => {
    const orderId = String(values[0] || "").trim();
    if (orderId) rowByOrderId.set(orderId, index + 2);
  });

  let nextRow = Math.max(previousLastRow + 1, 2);
  rows.forEach((row) => {
    const orderId = String(row["Order ID"] || "").trim();
    if (!orderId) return;

    const targetRow = rowByOrderId.get(orderId) || nextRow++;
    const values = ORDER_HEADERS.map((header) => sheetCellValue(header, row[header]));
    const targetRange = sheet.getRange(targetRow, 1, 1, ORDER_HEADERS.length);

    if (targetRow > previousLastRow && previousLastRow >= 2) {
      const templateRange = sheet.getRange(2, 1, 1, ORDER_HEADERS.length);
      templateRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
      templateRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
    }

    targetRange.setValues([values]);
    sheet.getRange(targetRow, 2).setNumberFormat("yyyy-mm-dd hh:mm:ss");
    sheet.getRange(targetRow, 8).setNumberFormat("#,##0");
    sheet.getRange(targetRow, 10, 1, 4).setNumberFormat('"₹"#,##0.00');
    rowByOrderId.set(orderId, targetRow);
  });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const expectedToken = PropertiesService.getScriptProperties().getProperty("WEBHOOK_TOKEN") || "";
    const body = JSON.parse(event.postData.contents || "{}");
    const receivedToken = body.token || "";

    if (expectedToken && receivedToken !== expectedToken) {
      return jsonResponse({ ok: false, error: "Invalid token" }, 403);
    }

    const rows = Array.isArray(body.rows) ? body.rows : body.row ? [body.row] : [];
    const validRows = rows.filter((row) => row && row["Order ID"]);
    if (!validRows.length) {
      return jsonResponse({ ok: false, error: "Missing order rows" }, 400);
    }

    const spreadsheet = getOrderSpreadsheet();
    const sheet = spreadsheet.getSheetByName("Orders") || spreadsheet.insertSheet("Orders");
    upsertOrderRows(sheet, validRows);
    return jsonResponse({ ok: true, synced: validRows.length }, 200);
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error && error.message ? error.message : error) }, 500);
  } finally {
    lock.releaseLock();
  }
}
