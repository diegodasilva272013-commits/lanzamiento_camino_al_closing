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
const RECLUTAMIENTO_SHEET_NAME = 'Postulaciones Setters';
const GRUPO_RECLUTAMIENTO_SHEET_NAME = 'Grupo Reclutamiento';
const FOTOS_FOLDER_NAME = 'Postulaciones Setters - Fotos';

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

const RECLUTAMIENTO_HEADERS = [
  'Fecha',
  'Nombre',
  'Apellido',
  'Edad',
  'WhatsApp',
  'Email',
  'Foto',
  '¿Por qué setter?',
  '¿Por qué el equipo?',
  'Objetivos',
  'Experiencia',
  'Algo más',
];

const GRUPO_RECLUTAMIENTO_HEADERS = [
  'Fecha',
  'Nombre',
  'Apellido',
  'Celular personal',
  'Línea 1',
  'Línea 2',
  'Línea 3',
  'Mensaje 1',
  'Mensaje 2',
  'Mensaje 3',
  'Mensaje 4',
  'Mensaje 5',
  'Foto',
  'Video',
  'Resumen del video',
];

function doGet() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  repairReclutamientoFotoFormulas(ss);
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

    if (data.kind === 'reclutamiento') {
      return appendReclutamiento(data);
    }

    if (data.kind === 'grupo_reclutamiento') {
      return appendGrupoReclutamiento(data);
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

  const targetRow = sheet.getLastRow() + 1;

  // Forzar TEXTO PLANO antes de escribir, así el "+" de los teléfonos y del
  // detalle no se interpreta como fórmula (#ERROR!) ni se convierte en número.
  sheet.getRange(targetRow, 3, 1, 8).setNumberFormat('@'); // Mensajes + Líneas (cols 3-10)
  sheet.getRange(targetRow, 12).setNumberFormat('@');      // Contactados (detalle)

  sheet.getRange(targetRow, 1, 1, SETTER_HEADERS.length).setValues([row]);

  // Formato de la fila recién agregada
  const lastRow = targetRow;
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

/* ============ POSTULACIONES DE SETTERS (reclutamiento) ============ */

function appendReclutamiento(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  let sheet = ss.getSheetByName(RECLUTAMIENTO_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(RECLUTAMIENTO_SHEET_NAME);
    setupReclutamientoSheet(sheet);
  }

  repairReclutamientoFotoFormulas(ss);

  const now = data.timestamp ? new Date(data.timestamp) : new Date();
  const fecha = Utilities.formatDate(now, TIMEZONE, 'dd/MM/yyyy HH:mm');

  // Subir foto a Drive y renderizarla inline en la celda con el endpoint compatible de Google.
  let fotoCell = '';
  let fotoFormula = '';
  try {
    const fotoFileId = saveReclutamientoFoto(data);
    if (fotoFileId) {
      fotoFormula = '=IMAGE("https://drive.google.com/thumbnail?id=' + fotoFileId + '&sz=w400",4,130,100)';
      fotoCell = fotoFormula;
    }
  } catch (errFoto) {
    fotoCell = 'Error foto: ' + String(errFoto);
  }

  const row = [
    fecha,
    String(data.nombre || ''),
    String(data.apellido || ''),
    String(data.edad || ''),
    String(data.whatsapp || ''),
    String(data.email || ''),
    '', // foto: se setea aparte
    String(data.porQueSetter || ''),
    String(data.porQueEquipo || ''),
    String(data.objetivos || ''),
    String(data.experiencia || ''),
    String(data.algoMas || ''),
  ];

  const targetRow = sheet.getLastRow() + 1;

  // Texto plano en WhatsApp/Email/datos para que el "+" no se rompa
  sheet.getRange(targetRow, 2, 1, 5).setNumberFormat('@'); // Nombre..Email
  sheet.getRange(targetRow, 8, 1, 5).setNumberFormat('@'); // Respuestas

  sheet.getRange(targetRow, 1, 1, RECLUTAMIENTO_HEADERS.length).setValues([row]);

  // Foto: imagen inline en columna 7
  if (fotoCell) {
    if (fotoFormula) {
      sheet.getRange(targetRow, 7).setFormula(fotoFormula);
    } else {
      sheet.getRange(targetRow, 7).setValue(fotoCell);
    }
  }

  formatReclutamientoRow(sheet, targetRow);
  sheet.setRowHeight(targetRow, 110);

  return jsonResponse({
    ok: true,
    writtenTo: sheet.getName(),
    totalRows: targetRow,
    foto: fotoCell ? 'sí' : 'no',
  });
}

function saveReclutamientoFoto(data) {
  const foto = String(data.foto || '');
  if (!foto || foto.indexOf('data:') !== 0) return '';

  const match = foto.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) return '';

  const mime = match[1];
  const base64 = match[2];
  const bytes = Utilities.base64Decode(base64);

  const ext = mime.indexOf('png') >= 0 ? 'png' : 'jpg';
  const nombre =
    sanitizeSheetName(String(data.nombre || '') + ' ' + String(data.apellido || '')).trim() ||
    'postulante';
  const fileName =
    nombre + ' - ' + Utilities.formatDate(new Date(), TIMEZONE, 'yyyyMMdd-HHmmss') + '.' + ext;

  const blob = Utilities.newBlob(bytes, mime, fileName);
  const folder = getFotosFolder();
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getId();
}

function getFotosFolder() {
  const folders = DriveApp.getFoldersByName(FOTOS_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(FOTOS_FOLDER_NAME);
}

function repairReclutamientoFotoFormulas(ss) {
  const sheet = ss.getSheetByName(RECLUTAMIENTO_SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 3) return;

  const range = sheet.getRange(3, 7, sheet.getLastRow() - 2, 1);
  const formulas = range.getFormulas();
  let changed = false;

  for (let i = 0; i < formulas.length; i++) {
    const formula = formulas[i][0];
    const match = formula.match(/uc\?export=view&id=([^"&]+)/);
    if (match) {
      formulas[i][0] = '=IMAGE("https://drive.google.com/thumbnail?id=' + match[1] + '&sz=w400",4,130,100)';
      changed = true;
    }
  }

  if (changed) range.setFormulas(formulas);
}

function setupReclutamientoSheet(sheet) {
  const cols = RECLUTAMIENTO_HEADERS.length;

  // Fila 1: título de marca
  sheet.getRange(1, 1, 1, cols).merge();
  sheet.getRange(1, 1)
    .setValue('Postulaciones · Setters — Camino al Closing')
    .setBackground(COLOR_GOLD)
    .setFontColor(COLOR_BLACK)
    .setFontSize(13)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 34);

  // Fila 2: encabezados
  sheet.getRange(2, 1, 1, cols)
    .setValues([RECLUTAMIENTO_HEADERS])
    .setBackground(COLOR_HEADER_BG)
    .setFontColor(COLOR_GOLD)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(2, 26);

  sheet.setFrozenRows(2);

  // Anchos de columna
  sheet.setColumnWidth(1, 130);  // Fecha
  sheet.setColumnWidth(2, 120);  // Nombre
  sheet.setColumnWidth(3, 120);  // Apellido
  sheet.setColumnWidth(4, 60);   // Edad
  sheet.setColumnWidth(5, 130);  // WhatsApp
  sheet.setColumnWidth(6, 200);  // Email
  sheet.setColumnWidth(7, 130);  // Foto
  for (let c = 8; c <= 12; c++) sheet.setColumnWidth(c, 260); // Respuestas

  const maxCols = sheet.getMaxColumns();
  if (maxCols > cols) {
    sheet.deleteColumns(cols + 1, maxCols - cols);
  }
}

function formatReclutamientoRow(sheet, rowIndex) {
  const cols = RECLUTAMIENTO_HEADERS.length;
  const range = sheet.getRange(rowIndex, 1, 1, cols);

  range
    .setVerticalAlignment('top')
    .setWrap(true)
    .setBorder(true, true, true, true, true, true, '#e0d6bd', SpreadsheetApp.BorderStyle.SOLID);

  if ((rowIndex - 3) % 2 === 1) {
    range.setBackground(COLOR_ROW_ALT);
  } else {
    range.setBackground('#ffffff');
  }

  sheet.getRange(rowIndex, 1).setHorizontalAlignment('center');
  sheet.getRange(rowIndex, 4).setHorizontalAlignment('center');
  sheet.getRange(rowIndex, 7).setHorizontalAlignment('center').setVerticalAlignment('middle');
}

/* ============ GRUPO DE RECLUTAMIENTO (tarea previa) ============ */

function appendGrupoReclutamiento(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  let sheet = ss.getSheetByName(GRUPO_RECLUTAMIENTO_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(GRUPO_RECLUTAMIENTO_SHEET_NAME);
    setupGrupoReclutamientoSheet(sheet);
  }

  const now = data.timestamp ? new Date(data.timestamp) : new Date();
  const fecha = Utilities.formatDate(now, TIMEZONE, 'dd/MM/yyyy HH:mm');

  const lineas = (data.lineas || []).slice(0, 3);
  while (lineas.length < 3) lineas.push('');

  const mensajes = (data.mensajes || []).slice(0, 5);
  while (mensajes.length < 5) mensajes.push('');

  let fotoCell = '';
  let fotoFormula = '';
  try {
    const fotoFileId = saveReclutamientoFoto(data);
    if (fotoFileId) {
      fotoFormula = '=IMAGE("https://drive.google.com/thumbnail?id=' + fotoFileId + '&sz=w400",4,130,100)';
      fotoCell = fotoFormula;
    }
  } catch (errFoto) {
    fotoCell = 'Error foto: ' + String(errFoto);
  }

  const row = [
    fecha,
    String(data.nombre || ''),
    String(data.apellido || ''),
    String(data.celular || ''),
    String(lineas[0] || ''),
    String(lineas[1] || ''),
    String(lineas[2] || ''),
    String(mensajes[0] || ''),
    String(mensajes[1] || ''),
    String(mensajes[2] || ''),
    String(mensajes[3] || ''),
    String(mensajes[4] || ''),
    '',
    String(data.videoUrl || 'https://www.youtube.com/watch?v=7RUmzfEaGco'),
    String(data.resumenVideo || ''),
  ];

  const targetRow = sheet.getLastRow() + 1;

  sheet.getRange(targetRow, 2, 1, 11).setNumberFormat('@');
  sheet.getRange(targetRow, 14, 1, 2).setNumberFormat('@');
  sheet.getRange(targetRow, 1, 1, GRUPO_RECLUTAMIENTO_HEADERS.length).setValues([row]);

  if (fotoCell) {
    if (fotoFormula) {
      sheet.getRange(targetRow, 13).setFormula(fotoFormula);
    } else {
      sheet.getRange(targetRow, 13).setValue(fotoCell);
    }
  }

  formatGrupoReclutamientoRow(sheet, targetRow);
  sheet.setRowHeight(targetRow, 110);

  return jsonResponse({
    ok: true,
    writtenTo: sheet.getName(),
    totalRows: targetRow,
    foto: fotoCell ? 'sí' : 'no',
  });
}

function setupGrupoReclutamientoSheet(sheet) {
  const cols = GRUPO_RECLUTAMIENTO_HEADERS.length;

  sheet.getRange(1, 1, 1, cols).merge();
  sheet.getRange(1, 1)
    .setValue('Grupo de reclutamiento · Tareas — Camino al Closing')
    .setBackground(COLOR_GOLD)
    .setFontColor(COLOR_BLACK)
    .setFontSize(13)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 34);

  sheet.getRange(2, 1, 1, cols)
    .setValues([GRUPO_RECLUTAMIENTO_HEADERS])
    .setBackground(COLOR_HEADER_BG)
    .setFontColor(COLOR_GOLD)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(2, 26);
  sheet.setFrozenRows(2);

  sheet.setColumnWidth(1, 130);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 150);
  for (let c = 5; c <= 7; c++) sheet.setColumnWidth(c, 140);
  for (let c = 8; c <= 12; c++) sheet.setColumnWidth(c, 240);
  sheet.setColumnWidth(13, 130);
  sheet.setColumnWidth(14, 230);
  sheet.setColumnWidth(15, 360);

  const maxCols = sheet.getMaxColumns();
  if (maxCols > cols) {
    sheet.deleteColumns(cols + 1, maxCols - cols);
  }
}

function formatGrupoReclutamientoRow(sheet, rowIndex) {
  const cols = GRUPO_RECLUTAMIENTO_HEADERS.length;
  const range = sheet.getRange(rowIndex, 1, 1, cols);

  range
    .setVerticalAlignment('top')
    .setWrap(true)
    .setBorder(true, true, true, true, true, true, '#e0d6bd', SpreadsheetApp.BorderStyle.SOLID);

  if ((rowIndex - 3) % 2 === 1) {
    range.setBackground(COLOR_ROW_ALT);
  } else {
    range.setBackground('#ffffff');
  }

  sheet.getRange(rowIndex, 1).setHorizontalAlignment('center');
  sheet.getRange(rowIndex, 13).setHorizontalAlignment('center').setVerticalAlignment('middle');
}

/* ============ Helpers ============ */

/**
 * Función para autorizar permisos de Drive y Sheets.
 *
 * EJECUTAR UNA VEZ desde el editor de Apps Script:
 *   1) Abrí el editor (Extensiones > Apps Script).
 *   2) En el selector de funciones (arriba) elegí: autorizar
 *   3) Click en "Ejecutar".
 *   4) Va a aparecer un popup pidiendo permisos. Click "Revisar permisos",
 *      elegí tu cuenta, click "Avanzado" > "Ir a (no seguro)" > "Permitir".
 *   5) Listo. Ya no hace falta volver a hacerlo.
 *
 * Después de esto las fotos se guardan en Drive sin error.
 */
function autorizar() {
  // Toca Drive para gatillar el consent screen
  const folder = getFotosFolder();
  // Toca Sheets también
  const ss = SpreadsheetApp.openById(SHEET_ID);
  Logger.log('Autorizado OK. Carpeta de fotos: ' + folder.getName() + ' | Sheet: ' + ss.getName());
  return 'OK — permisos concedidos. Carpeta: ' + folder.getName();
}

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
