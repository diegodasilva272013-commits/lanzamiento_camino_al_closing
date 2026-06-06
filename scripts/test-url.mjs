// Uso: node scripts/test-url.mjs "https://script.google.com/macros/s/XXXX/exec"
const url = process.argv[2];
if (!url) {
  console.error('❌ Pasá la URL: node scripts/test-url.mjs "https://script.google.com/.../exec"');
  process.exit(1);
}

const setter = 'PRUEBA Diego';
const mensajes = ['Hola msg1', 'Hola msg2', 'Hola msg3', 'Hola msg4', 'Hola msg5'];
const lineas = ['+5491111111111', '+5491122222222', '+5491133333333'];
const contactados = '+5491244444444 respondió\n+5491255555555 no responde\n+5491266666666 interesado';

console.log('🔎 Probando URL:', url, '\n');

console.log('--- 1) GET (forma del doGet) ---');
const getRes = await fetch(url);
const getData = await getRes.json();
console.log(JSON.stringify(getData, null, 2));
const formaNueva = Array.isArray(getData.sheets);
console.log(formaNueva ? '✅ doGet NUEVO (devuelve sheets[])' : '❌ doGet VIEJO (no devuelve sheets[])');

console.log('\n--- 2) POST kind=setters ---');
const postRes = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ kind: 'setters', timestamp: new Date().toISOString(), setter, mensajes, lineas, contactados, secret: '' }),
});
const postData = await postRes.json();
console.log(JSON.stringify(postData, null, 2));

if (postData.writtenTo === setter) {
  console.log('\n🎉 PERFECTO: creó la hoja "' + setter + '" con formato prolijo.');
} else {
  console.log('\n❌ Escribió en "' + postData.writtenTo + '" — esta URL TODAVÍA es vieja.');
}
