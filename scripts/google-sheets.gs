/**
 * Google Apps Script para recibir registros del lanzamiento
 * y reportes diarios de setters, guardándolos en pestañas distintas.
 *
 * Pasos:
 * 1) Pegá este código en Apps Script (Extensiones > Apps Script de tu hoja).
 * 2) Guardá (Ctrl+S).
 * 3) Implementar > Administrar implementaciones > editá la activa.
 *    En "Versión" elegí "Nueva versión" > Implementar.
 *    (Sin "Nueva versión" sigue usando el código viejo.)
 */

const SHEET_ID = '1IErLxIcFhfBbq_a7-3QfwFPt34vTXNCrAlxEF9ymEs0';
const SECRET = ''; // opcional

const REGISTROS_SHEET_NAME = 'Registros';
const SETTERS_SHEET_NAME = 'Reportes Setters';

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

function appendSetters(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SETTERS_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SETTERS_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Setter',
      'Línea 1',
      'Línea 2',
      'Línea 3',
      'Mensaje 1',
      'Mensaje 2',
      'Mensaje 3',
      'Mensaje 4',
      'Mensaje 5',
      'Filas contactados',
      'Contactados (raw)',
    ]);
  }

  const mensajes = (data.mensajes || []).slice(0, 5);
  while (mensajes.length < 5) mensajes.push('');

  const lineas = (data.lineas || []).slice(0, 3);
  while (lineas.length < 3) lineas.push('');

  const contactados = data.contactados || '';
  const filasContactados = contactados
    .split('\n')
    .map(function (line) { return String(line).trim(); })
    .filter(function (line) { return line.length > 0; })
    .length;

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.setter || '',
    lineas[0],
    lineas[1],
    lineas[2],
    mensajes[0],
    mensajes[1],
    mensajes[2],
    mensajes[3],
    mensajes[4],
    filasContactados,
    contactados,
  ]);

  return jsonResponse({
    ok: true,
    writtenTo: sheet.getName(),
    totalRows: sheet.getLastRow(),
    contactadosFilas: filasContactados,
  });
}

function jsonResponse(obj) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
