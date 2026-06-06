import { NextResponse } from 'next/server';

export const maxDuration = 30;

type Payload = {
  nombre?: unknown;
  apellido?: unknown;
  edad?: unknown;
  whatsapp?: unknown;
  email?: unknown;
  porQueSetter?: unknown;
  porQueEquipo?: unknown;
  objetivos?: unknown;
  experiencia?: unknown;
  algoMas?: unknown;
  foto?: unknown;
  fotoNombre?: unknown;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 });
  }

  const nombre = asString(body.nombre);
  const apellido = asString(body.apellido);
  const edad = asString(body.edad);
  const whatsapp = asString(body.whatsapp);
  const email = asString(body.email);
  const porQueSetter = asString(body.porQueSetter);
  const porQueEquipo = asString(body.porQueEquipo);
  const objetivos = asString(body.objetivos);
  const experiencia = asString(body.experiencia);
  const algoMas = asString(body.algoMas);
  const foto = asString(body.foto);
  const fotoNombre = asString(body.fotoNombre);

  if (!nombre || !apellido) {
    return NextResponse.json({ ok: false, error: 'Completá nombre y apellido.' }, { status: 400 });
  }
  if (!whatsapp || !email) {
    return NextResponse.json(
      { ok: false, error: 'Dejá un WhatsApp y un email para contactarte.' },
      { status: 400 },
    );
  }
  if (!porQueSetter || !porQueEquipo || !objetivos || !experiencia || !algoMas) {
    return NextResponse.json(
      { ok: false, error: 'Respondé todas las preguntas de la postulación.' },
      { status: 400 },
    );
  }
  if (!edad) {
    return NextResponse.json(
      { ok: false, error: 'Ingresá tu edad.' },
      { status: 400 },
    );
  }
  if (!foto) {
    return NextResponse.json(
      { ok: false, error: 'Subí una foto para completar la postulación.' },
      { status: 400 },
    );
  }

  // URL del Apps Script con la nueva versión (con appendReclutamiento + foto a Drive).
  // Hardcodeada acá porque el env var en Vercel apuntaba a una versión vieja.
  const url =
    'https://script.google.com/macros/s/AKfycbzb6cRGhORGucp9Ww4WTXpGHNs3m1KEZG-AEl1o4Rz8bcxK5nF-H-UQ92c1N4_zUhR1/exec';

  const sheetsBody = {
    kind: 'reclutamiento',
    timestamp: new Date().toISOString(),
    nombre,
    apellido,
    edad,
    whatsapp,
    email,
    porQueSetter,
    porQueEquipo,
    objetivos,
    experiencia,
    algoMas,
    foto,
    fotoNombre,
    secret: process.env.GOOGLE_SHEETS_SECRET ?? '',
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetsBody),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[reclutamiento] Sheets HTTP', res.status, text);
      return NextResponse.json(
        { ok: false, error: 'No pudimos guardar tu postulación. Intentá de nuevo.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[reclutamiento] Error contactando Sheets', err);
    return NextResponse.json(
      { ok: false, error: 'No pudimos enviar tu postulación. Intentá de nuevo.' },
      { status: 502 },
    );
  }
}
