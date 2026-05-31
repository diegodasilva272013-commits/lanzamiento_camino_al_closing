/**
 * Google Apps Script para recibir registros del lanzamiento
 * y guardarlos en la PRIMERA pestaña de la hoja.
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

function doGet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheets()[0];
  return jsonResponse({
    ok: true,
    spreadsheetName: ss.getName(),
    firstSheetName: sheet.getName(),
    rowCount: sheet.getLastRow(),
  });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    if (SECRET && data.secret !== SECRET) {
      return jsonResponse({ ok: false, error: 'unauthorized' });
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets()[0]; // primera pestaña visible

    // Si la hoja está vacía, agregamos encabezados
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
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
