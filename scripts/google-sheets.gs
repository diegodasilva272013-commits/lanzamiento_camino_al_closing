/**
 * Google Apps Script — Camino al Closing
 * Guarda registros del lanzamiento y reportes diarios de setters.
 *
 * Reportes de setters: crea UNA HOJA POR SETTER, con formato prolijo
 * (título de marca, encabezados, colores, columnas ordenadas y wrap).
 *
 * Cómo actualizar (IMPORTANTE, seguir tal cual):
 * 1) Extensiones > Apps Script de tu hoja.
 * 2) Borrá TODO el código y pegá este.
 * 3) Guardá (Ctrl+S).
 * 4) Implementar > Nueva implementación > Tipo: Aplicación web.
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier persona
 *    - Implementar. Copiá la URL nueva (/exec) y pasásela a Diego.
 *    (Una "Nueva implementación" evita el problema de la versión vieja.)
 */

const SHEET_ID = '1IErLxIcFhfBbq_a7-3QfwFPt34vTXNCrAlxEF9ymEs0';
const SECRET = ''; // opcional
const TIMEZONE = 'America/Argentina/Buenos_Aires';

const REGISTROS_SHEET_NAME = 'Registros';

// Paleta de marca
const COLOR_GOLD = '#d4af37';
const COLOR_BLACK = '#0a0a0a';
const COLOR_HEADER_BG = '#1a1a1a';
const COLOR_ROW_ALT = '#f7f3e8';

const SETTER_HEADERS = [
  'Fecha',
  'Hora',
  'Mensaje 1',
  'Mensaje 2',
  'Mensaje 3',
  'Mensaje 4',
  'Mensaje 5',
  'Línea 1',
  'Línea 2',
  'Línea 3',
  'Total contactados',
  'Contactados (detalle)',
];

function doGet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheets = ss.getSheets().map(function (sheet) {
    return { name: sheet.getName(), rows: sheet.getLastRow() };
  });
  return jsonResponse({
    ok: true,
    spreadsheetName: ss.getName(),
    sheets: sheets,
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    if (SECRET && data.secret !== SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    if (data.kind === 'setters') {
      return appendSetters(data);
    }

    return appendRegistro(data);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

/* ============ REGISTROS DEL LANZAMIENTO ============ */

function appendRegistro(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(REGISTROS_SHEET_NAME);

  // Backwards compat: si no existe la pestaña con nombre, usamos la primera.
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Nombre', 'Apellido', 'Teléfono', 'Email']);
  }

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.nombre || '',
    data.apellido || '',
    data.telefono || '',
    data.email || '',
  ]);

  return jsonResponse({
    ok: true,
    writtenTo: sheet.getName(),
    totalRows: sheet.getLastRow(),
  });
}

/* ============ REPORTES DE SETTERS (una hoja por setter) ============ */

function appendSetters(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  const setterName = String(data.setter || 'Sin nombre').trim() || 'Sin nombre';
  const sheetName = sanitizeSheetName(setterName);

  let sheet = ss.getSheetByName(sheetName);
  let isNew = false;
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    isNew = true;
    setupSetterSheet(sheet, setterName);
  }

  // Normalizar datos
  const mensajes = (data.mensajes || []).slice(0, 5);
  while (mensajes.length < 5) mensajes.push('');

  const lineas = (data.lineas || []).slice(0, 3);
  while (lineas.length < 3) lineas.push('');

  const contactados = String(data.contactados || '');
  const contactadosLineas = contactados
    .split('\n')
    .map(function (line) { return String(line).trim(); })
    .filter(function (line) { return line.length > 0; });
  const totalContactados = contactadosLineas.length;

  const now = data.timestamp ? new Date(data.timestamp) : new Date();
  const fecha = Utilities.formatDate(now, TIMEZONE, 'dd/MM/yyyy');
  const hora = Utilities.formatDate(now, TIMEZONE, 'HH:mm');

  const row = [
    fecha,
    hora,
    mensajes[0],
    mensajes[1],
    mensajes[2],
    mensajes[3],
    mensajes[4],
    lineas[0],
    lineas[1],
    lineas[2],
    totalContactados,
    contactadosLineas.join('\n'),
  ];

  sheet.appendRow(row);

  // Formato de la fila recién agregada
  const lastRow = sheet.getLastRow();
  formatDataRow(sheet, lastRow);

  return jsonResponse({
    ok: true,
    writtenTo: sheet.getName(),
    totalRows: lastRow,
    contactadosFilas: totalContactados,
    nuevaHoja: isNew,
  });
}

function setupSetterSheet(sheet, setterName) {
  const cols = SETTER_HEADERS.length;

  // Fila 1: título de marca
  sheet.getRange(1, 1, 1, cols).merge();
  sheet.getRange(1, 1)
    .setValue('Reporte diario · ' + setterName + ' — Camino al Closing')
    .setBackground(COLOR_GOLD)
    .setFontColor(COLOR_BLACK)
    .setFontSize(13)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 34);

  // Fila 2: encabezados
  sheet.getRange(2, 1, 1, cols)
    .setValues([SETTER_HEADERS])
    .setBackground(COLOR_HEADER_BG)
    .setFontColor(COLOR_GOLD)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(2, 26);

  // Congelar título + encabezados
  sheet.setFrozenRows(2);

  // Anchos de columna
  sheet.setColumnWidth(1, 90);   // Fecha
  sheet.setColumnWidth(2, 60);   // Hora
  for (let c = 3; c <= 7; c++) sheet.setColumnWidth(c, 200); // Mensajes
  for (let c = 8; c <= 10; c++) sheet.setColumnWidth(c, 130); // Líneas
  sheet.setColumnWidth(11, 110); // Total contactados
  sheet.setColumnWidth(12, 320); // Contactados detalle

  // Borrar columnas sobrantes para que quede limpio
  const maxCols = sheet.getMaxColumns();
  if (maxCols > cols) {
    sheet.deleteColumns(cols + 1, maxCols - cols);
  }
}

function formatDataRow(sheet, rowIndex) {
  const cols = SETTER_HEADERS.length;
  const range = sheet.getRange(rowIndex, 1, 1, cols);

  range
    .setVerticalAlignment('top')
    .setWrap(true)
    .setBorder(true, true, true, true, true, true, '#e0d6bd', SpreadsheetApp.BorderStyle.SOLID);

  // Filas alternadas (la primera de datos es la fila 3)
  if ((rowIndex - 3) % 2 === 1) {
    range.setBackground(COLOR_ROW_ALT);
  } else {
    range.setBackground('#ffffff');
  }

  // Fecha/Hora centrados, Total en negrita
  sheet.getRange(rowIndex, 1, 1, 2).setHorizontalAlignment('center');
  sheet.getRange(rowIndex, 11).setHorizontalAlignment('center').setFontWeight('bold');
}

/* ============ Helpers ============ */

function sanitizeSheetName(name) {
  // Google Sheets no permite: \ / ? * [ ] : y máximo 100 chars
  let clean = String(name).replace(/[\\\/\?\*\[\]:]/g, ' ').trim();
  if (clean.length > 95) clean = clean.substring(0, 95);
  return clean || 'Sin nombre';
}

function jsonResponse(obj) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
