import { NextResponse } from 'next/server';

type Payload = {
  setter?: unknown;
  mensajes?: unknown;
  lineas?: unknown;
  contactados?: unknown;
  accessCode?: unknown;
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

  const expectedCode = process.env.SETTERS_ACCESS_CODE;
  if (expectedCode && asString(body.accessCode) !== expectedCode) {
    return NextResponse.json({ ok: false, error: 'Código de acceso inválido.' }, { status: 401 });
  }

  const setter = asString(body.setter);
  const mensajes = asArray(body.mensajes).slice(0, 5);
  const lineas = asArray(body.lineas).slice(0, 3);
  const contactados = asString(body.contactados);

  if (!setter) {
    return NextResponse.json({ ok: false, error: 'Falta tu nombre.' }, { status: 400 });
  }

  const mensajesValidos = mensajes.filter(Boolean);
  if (mensajesValidos.length < 5) {
    return NextResponse.json(
      { ok: false, error: 'Cargá los 5 mensajes de apertura.' },
      { status: 400 },
    );
  }

  const lineasValidas = lineas.filter(Boolean);
  if (lineasValidas.length < 3) {
    return NextResponse.json(
      { ok: false, error: 'Cargá las 3 líneas activas.' },
      { status: 400 },
    );
  }

  if (!contactados) {
    return NextResponse.json(
      { ok: false, error: 'Pegá la lista de contactados con su estado.' },
      { status: 400 },
    );
  }

  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error('[setters] GOOGLE_SHEETS_WEBHOOK_URL no configurado.');
    return NextResponse.json(
      { ok: false, error: 'Webhook de Google Sheets no configurado en el servidor.' },
      { status: 500 },
    );
  }

  const sheetsBody = {
    kind: 'setters',
    timestamp: new Date().toISOString(),
    setter,
    mensajes,
    lineas,
    contactados,
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
      console.error('[setters] Sheets HTTP', res.status, text);
      return NextResponse.json(
        { ok: false, error: 'No pudimos guardar el reporte. Intentá de nuevo.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[setters] Error contactando Sheets', err);
    return NextResponse.json(
      { ok: false, error: 'No pudimos contactar a Google Sheets.' },
      { status: 502 },
    );
  }
}
