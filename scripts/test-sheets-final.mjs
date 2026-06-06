import fs from 'node:fs';

const env = fs.readFileSync('.env.local', 'utf8');
for (const rawLine of env.split('\n')) {
  const line = rawLine.replace(/\r$/, '');
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"(.*)"$/, '$1').trim();
}

const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

// 1) doGet — ver pestañas actuales
console.log('--- 1) GET (ver pestañas) ---');
const getRes = await fetch(url, { redirect: 'follow' });
const getBody = await getRes.json();
console.log('HTTP', getRes.status);
console.log(JSON.stringify(getBody, null, 2));

// 2) POST con kind: 'setters'
console.log('\n--- 2) POST kind=setters ---');
const payload = {
  kind: 'setters',
  timestamp: new Date().toISOString(),
  setter: 'TEST FINAL ' + new Date().getTime(),
  mensajes: ['mensaje 1', 'mensaje 2', 'mensaje 3', 'mensaje 4', 'mensaje 5'],
  lineas: ['+5491155500001', '+5491155500002', '+5491155500003'],
  contactados: '+5491100000001\tno responde\n+5491100000002\tcontestó',
  secret: process.env.GOOGLE_SHEETS_SECRET ?? '',
};
const postRes = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
  redirect: 'follow',
});
const postBody = await postRes.json();
console.log('HTTP', postRes.status);
console.log(JSON.stringify(postBody, null, 2));

// 3) doGet final — confirmar que la pestaña nueva existe
console.log('\n--- 3) GET final (confirmar Reportes Setters existe) ---');
const finalRes = await fetch(url, { redirect: 'follow' });
const finalBody = await finalRes.json();
console.log('HTTP', finalRes.status);
console.log(JSON.stringify(finalBody, null, 2));
