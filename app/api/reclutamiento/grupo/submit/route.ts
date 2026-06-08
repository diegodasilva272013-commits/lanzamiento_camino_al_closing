import { NextResponse } from 'next/server';

export const maxDuration = 30;

type Payload = {
  nombre?: unknown;
  apellido?: unknown;
  celular?: unknown;
  lineas?: unknown;
  mensajes?: unknown;
  foto?: unknown;
  fotoNombre?: unknown;
  resumenVideo?: unknown;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => asString(item)) : [];
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
  const celular = asString(body.celular);
  const lineas = asArray(body.lineas).slice(0, 3);
  const mensajes = asArray(body.mensajes).slice(0, 5);
  const foto = asString(body.foto);
  const fotoNombre = asString(body.fotoNombre);
  const resumenVideo = asString(body.resumenVideo);

  if (!nombre || !apellido || !celular) {
    return NextResponse.json({ ok: false, error: 'Completá nombre, apellido y celular personal.' }, { status: 400 });
  }

  if (lineas.filter(Boolean).length < 2) {
    return NextResponse.json({ ok: false, error: 'Cargá al menos 2 líneas para el proyecto.' }, { status: 400 });
  }

  if (mensajes.filter(Boolean).length < 5) {
    return NextResponse.json({ ok: false, error: 'Cargá los 5 mensajes de apertura.' }, { status: 400 });
  }

  if (!foto) {
    return NextResponse.json({ ok: false, error: 'Subí tu foto para completar la entrega.' }, { status: 400 });
  }

  if (!resumenVideo) {
    return NextResponse.json({ ok: false, error: 'Escribí el resumen del video.' }, { status: 400 });
  }

  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error('[grupo-reclutamiento] GOOGLE_SHEETS_WEBHOOK_URL no configurado.');
    return NextResponse.json({ ok: false, error: 'Webhook de Google Sheets no configurado.' }, { status: 500 });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: 'grupo_reclutamiento',
        timestamp: new Date().toISOString(),
        nombre,
        apellido,
        celular,
        lineas,
        mensajes,
        foto,
        fotoNombre,
        resumenVideo,
        videoUrl: 'https://www.youtube.com/watch?v=7RUmzfEaGco',
        secret: process.env.GOOGLE_SHEETS_SECRET ?? '',
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[grupo-reclutamiento] Sheets HTTP', res.status, text);
      return NextResponse.json({ ok: false, error: 'No pudimos guardar la entrega.' }, { status: 502 });
    }

    const data = (await res.json().catch(() => ({ ok: true }))) as { ok?: boolean; error?: string };
    if (data.ok === false) {
      console.error('[grupo-reclutamiento] Sheets error', data);
      return NextResponse.json({ ok: false, error: data.error ?? 'Google Sheets rechazó la entrega.' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[grupo-reclutamiento] Error contactando Sheets', error);
    return NextResponse.json({ ok: false, error: 'No pudimos contactar a Google Sheets.' }, { status: 502 });
  }
}