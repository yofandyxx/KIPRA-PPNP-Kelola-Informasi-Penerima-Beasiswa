/**
 * Utilitas umum: respons JSON, akses sheet, ID, dan konversi data.
 */

function jsonResponse(success, message, data) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: success,
      message: message,
      data: typeof data === 'undefined' ? null : data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

function getSheet(sheetName) {
  var sheet = getSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error('Sheet "' + sheetName + '" tidak ditemukan.');
  return sheet;
}

function readSheetObjects(sheetName) {
  var sheet = getSheet(sheetName);
  var headers = CONFIG.HEADERS[sheetName];
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  var result = [];
  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    if (!row[0]) continue;
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = normalizeCellValue(row[j]);
    }
    result.push(obj);
  }
  return result;
}

function normalizeCellValue(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return value;
}

function findRowIndexById(sheetName, id) {
  var sheet = getSheet(sheetName);
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2;
  }
  return -1;
}

function appendObject(sheetName, obj) {
  var sheet = getSheet(sheetName);
  var headers = CONFIG.HEADERS[sheetName];
  var row = headers.map(function (key) {
    var value = obj[key];
    if (value === undefined || value === null) return '';
    if (key.indexOf('_date') >= 0 || key === 'start_date' || key === 'end_date') {
      return parseDateValue(value);
    }
    return value;
  });
  sheet.appendRow(row);
  return obj;
}

function updateObjectById(sheetName, id, patch) {
  var rowIndex = findRowIndexById(sheetName, id);
  if (rowIndex === -1) return null;
  var sheet = getSheet(sheetName);
  var headers = CONFIG.HEADERS[sheetName];
  var current = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
  var merged = {};
  for (var i = 0; i < headers.length; i++) merged[headers[i]] = current[i];
  for (var key in patch) {
    if (patch.hasOwnProperty(key) && headers.indexOf(key) >= 0) merged[key] = patch[key];
  }
  var newRow = headers.map(function (key) {
    var value = merged[key];
    if (value === undefined || value === null) return '';
    if (key.indexOf('_date') >= 0 || key === 'start_date' || key === 'end_date') {
      return parseDateValue(value);
    }
    return value;
  });
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([newRow]);
  return merged;
}

function deleteObjectById(sheetName, id) {
  var rowIndex = findRowIndexById(sheetName, id);
  if (rowIndex === -1) return false;
  getSheet(sheetName).deleteRow(rowIndex);
  return true;
}

function parseDateValue(value) {
  if (value instanceof Date) return value;
  if (!value) return '';
  var parts = String(value).split('-');
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return value;
}

function generateId(prefix) {
  return prefix + '-' + Utilities.getUuid().slice(0, 8).toUpperCase();
}

function nowString() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function sanitizeString(value) {
  return String(value === undefined || value === null ? '' : value).trim();
}

function parseNumber(value) {
  var n = Number(value);
  return isNaN(n) ? 0 : n;
}

function isValidDateString(value) {
  if (!value) return false;
  var parts = String(value).split('-');
  if (parts.length !== 3) return false;
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return !isNaN(d.getTime());
}