/**
 * Direct Google Sheets API write (sin Apps Script)
 * Testea escribiendo directamente a la hoja.
 */

const SHEET_ID = '1IErLxIcFhfBbq_a7-3QfwFPt34vTXNCrAlxEF9ymEs0';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';

// Tu API key de Google (necesitas crear una en Google Cloud)
// Por ahora, usá esta URL sin autenticación si la hoja es pública
const API_KEY = ''; // Dejaremos vacío por ahora

async function getSheetHeaders() {
  try {
    const url = `${SHEETS_API}/${SHEET_ID}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    
    console.log('📊 Hojas disponibles:');
    data.sheets.forEach(sheet => {
      console.log(`  - ${sheet.properties.title}`);
    });
    return data;
  } catch (err) {
    console.error('Error obteniendo hojas:', err.message);
  }
}

async function testWebhookDirect() {
  const webhookUrl = 'https://script.google.com/macros/s/AKfycbxsq7HX-DNzG8s8qhrnRy_OukEFLrFlpUe0wIcMUQ-ghR2wOBR6NS87d83W1HRAKxFL/exec';
  
  console.log('\n🔴 TEST 1: GET (ver si Apps Script responde)');
  try {
    const res = await fetch(webhookUrl);
    const data = await res.json();
    console.log('✅ Apps Script respondió:');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('❌ Error:', err.message);
  }

  console.log('\n🔴 TEST 2: POST con kind="setters"');
  try {
    const payload = {
      kind: 'setters',
      timestamp: new Date().toISOString(),
      setter: 'Test Usuario',
      mensajes: ['Msg1', 'Msg2', 'Msg3', 'Msg4', 'Msg5'],
      lineas: ['+541111111', '+541111112', '+541111113'],
      contactados: '+541234567 respondió\n+541234568 no responde',
    };
    
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    const data = await res.json();
    console.log('Respuesta del webhook:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.writtenTo !== 'Reportes Setters') {
      console.error('❌ ERROR: Escribió a "' + data.writtenTo + '" en lugar de "Reportes Setters"');
      console.log('\n⚠️  El Apps Script deployado NO está actualizado con el código nuevo.');
      console.log('Pasos para arreglarlo:');
      console.log('1. Abrí tu Google Sheet');
      console.log('2. Extensiones > Apps Script');
      console.log('3. Borrá TODO el código');
      console.log('4. Pegá el código de scripts/google-sheets.gs');
      console.log('5. Ctrl+S para guardar');
      console.log('6. Arriba a la derecha > Implementar > Ver todas las implementaciones');
      console.log('7. Editar la implementación activa > Versión > "Nueva versión" > Implementar');
    } else {
      console.log('✅ Escribió correctamente a "Reportes Setters"');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

async function main() {
  console.log('=== Direct Sheets Test ===\n');
  await testWebhookDirect();
}

main();
