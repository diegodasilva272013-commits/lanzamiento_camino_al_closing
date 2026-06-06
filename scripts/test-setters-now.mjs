// Test del payload NUEVO (compatible con Apps Script viejo)
const webhookUrl = 'https://script.google.com/macros/s/AKfycbxsq7HX-DNzG8s8qhrnRy_OukEFLrFlpUe0wIcMUQ-ghR2wOBR6NS87d83W1HRAKxFL/exec';

const setter = 'PRUEBA Diego';
const mensajes = ['Hola msg1', 'Hola msg2', 'Hola msg3', 'Hola msg4', 'Hola msg5'];
const lineas = ['+5491111111111', '+5491122222222', '+5491133333333'];
const contactados = '+5491244444444 respondió\n+5491255555555 no responde\n+5491266666666 interesado';

const payload = {
  kind: 'setters',
  timestamp: new Date().toISOString(),
  setter,
  mensajes,
  lineas,
  contactados,
  nombre: setter,
  apellido: `Mensajes: ${mensajes.join('  |  ')}`,
  telefono: `Líneas: ${lineas.join(', ')}`,
  email: `Contactados:\n${contactados}`,
  secret: '',
};

const res = await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
const data = await res.json();
console.log('Respuesta:', JSON.stringify(data, null, 2));
console.log('\n✅ Revisá tu Google Sheet: tiene que aparecer una fila nueva con "PRUEBA Diego" y los datos.');
