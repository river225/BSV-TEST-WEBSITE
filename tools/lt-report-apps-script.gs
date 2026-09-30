/**
 * Live Trading — Report Issues → Google Sheet writer
 *
 * Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1FEwl6yfOIVm79d1OlNMy8olYVngcdrVocWi462DXWRk/edit
 *
 * Setup (one time):
 * 1. Open that spreadsheet → Extensions → Apps Script
 * 2. Paste this whole file, Save
 * 3. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web app URL
 * 5. Paste it into Railway env as LT_REPORT_APPS_SCRIPT_URL
 *    (or into live-trading.js as LT_REPORT_APPS_SCRIPT_URL)
 *
 * Sheet columns (auto-created on first submit):
 * Timestamp | Display Name | Username | Discord ID | Issue
 */

var SHEET_ID = "1FEwl6yfOIVm79d1OlNMy8olYVngcdrVocWi462DXWRk";
var HEADERS = ["Timestamp", "Display Name", "Username", "Discord ID", "Issue"];

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }
  var first = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (!first[0] || String(first[0]).toLowerCase().indexOf("timestamp") === -1) {
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function appendReport_(data) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheets()[0];
  ensureHeaders_(sheet);
  sheet.appendRow([
    new Date(),
    String((data && data.displayName) || ""),
    String((data && data.username) || ""),
    String((data && data.discordId) || ""),
    String((data && data.issue) || "")
  ]);
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || "{}";
    var data = JSON.parse(raw);
    if (!String((data && data.issue) || "").trim()) {
      return jsonOut_({ ok: false, error: "missing_issue" });
    }
    appendReport_(data);
    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    if (!String(p.issue || "").trim()) {
      return jsonOut_({ ok: true, service: "lt-report" });
    }
    appendReport_({
      displayName: p.displayName || "",
      username: p.username || "",
      discordId: p.discordId || "",
      issue: p.issue || ""
    });
    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}
