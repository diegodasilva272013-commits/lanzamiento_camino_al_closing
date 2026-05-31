import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type Payload = {
  nombre?: unknown;
  apellido?: unknown;
  telefono?: unknown;
  email?: unknown;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  const telefono = asString(body.telefono);
  const email = asString(body.email);

  if (!nombre || !apellido || !telefono || !email) {
    return NextResponse.json(
      { ok: false, error: 'Todos los campos son obligatorios.' },
      { status: 400 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'Email inválido.' }, { status: 400 });
  }

  const meetLink = process.env.MEET_LINK ?? 'https://meet.google.com/your-meet-code';

  // 1) Guardar en Google Sheets (via Google Apps Script Web App)
  const sheetsResult = await saveToGoogleSheets({
    nombre,
    apellido,
    telefono,
    email,
  });

  // 2) Enviar WhatsApp con el link (via Twilio)
  const whatsappResult = await sendWhatsApp({
    nombre,
    telefono,
    meetLink,
  });

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  const smtpConfigured = SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS;

  if (!smtpConfigured) {
    console.warn(
      '[register] SMTP no configurado. Devolviendo el link sin enviar mail.',
      { nombre, apellido, telefono, email, meetLink },
    );
    return NextResponse.json({
      ok: true,
      meetLink,
      mailed: false,
      sheets: sheetsResult,
      whatsapp: whatsappResult,
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const from = MAIL_FROM ?? SMTP_USER;
    const subject = 'Tu acceso al Meet del lanzamiento';
    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;background:#0a0a0a;color:#f5f5f5;padding:32px;border-radius:16px;max-width:560px;margin:auto">
        <h1 style="color:#d4af37;margin:0 0 12px 0;font-size:22px">¡Estás dentro, ${nombre}!</h1>
        <p style="line-height:1.6;color:#cccccc">
          Reservamos tu lugar para el lanzamiento. Ingresá al Meet con el link de abajo a la hora pactada.
        </p>
        <p style="margin:24px 0">
          <a href="${meetLink}" style="background:#d4af37;color:#000;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">
            Entrar al Meet
          </a>
        </p>
        <p style="color:#a0a0a0;font-size:13px">
          O copiá este enlace: <br/>
          <span style="color:#d4af37">${meetLink}</span>
        </p>
        <hr style="border:none;border-top:1px solid rgba(212,175,55,0.2);margin:24px 0"/>
        <p style="color:#a0a0a0;font-size:12px">
          Datos registrados:<br/>
          ${nombre} ${apellido} — ${telefono} — ${email}
        </p>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: email,
      subject,
      html,
      text: `Hola ${nombre}, este es tu link de Meet: ${meetLink}`,
    });

    return NextResponse.json({
      ok: true,
      meetLink,
      mailed: true,
      sheets: sheetsResult,
      whatsapp: whatsappResult,
    });
  } catch (err) {
    console.error('[register] Error enviando mail', err);
    return NextResponse.json(
      { ok: false, error: 'No pudimos enviar el mail. Revisá la configuración SMTP.' },
      { status: 500 },
    );
  }
}

type SheetsResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
};

async function saveToGoogleSheets(payload: {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}): Promise<SheetsResult> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.warn('[register] GOOGLE_SHEETS_WEBHOOK_URL no configurado. No se guarda en Sheets.');
    return { ok: false, skipped: true };
  }

  const body = {
    timestamp: new Date().toISOString(),
    ...payload,
    secret: process.env.GOOGLE_SHEETS_SECRET ?? '',
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      // Apps Script suele responder rápido; evitamos cachear
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[register] Google Sheets respondió con error', res.status, text);
      return { ok: false, error: `Sheets HTTP ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    console.error('[register] Error guardando en Google Sheets', err);
    return { ok: false, error: 'No se pudo contactar a Google Sheets' };
  }
}

// ============================================================
// WhatsApp vía Twilio
// ============================================================

type WhatsappResult = {
  ok: boolean;
  skipped?: boolean;
  error?: string;
  sid?: string;
  to?: string;
};

function normalizePhone(raw: string): string | null {
  // Mantiene sólo dígitos y el '+' inicial
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (!cleaned) return null;

  // Ya viene con código de país
  if (cleaned.startsWith('+')) {
    return cleaned.length >= 8 ? cleaned : null;
  }

  // Prepende el país por defecto
  const cc = (process.env.DEFAULT_COUNTRY_CODE ?? '54').replace(/\D/g, '');
  let national = cleaned;
  // Saca el 0 inicial típico de números locales argentinos
  if (national.startsWith('0')) national = national.slice(1);
  // Saca el 15 inicial (móviles AR)
  if (national.startsWith('15')) national = national.slice(2);

  const full = `+${cc}${national}`;
  return full.length >= 8 ? full : null;
}

async function sendWhatsApp(params: {
  nombre: string;
  telefono: string;
  meetLink: string;
}): Promise<WhatsappResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const contentSid = process.env.TWILIO_CONTENT_SID;

  if (!sid || !token || !from) {
    console.warn('[register] Twilio no configurado. Skip WhatsApp.');
    return { ok: false, skipped: true };
  }

  const to = normalizePhone(params.telefono);
  if (!to) {
    return { ok: false, error: 'Teléfono inválido' };
  }

  const body = new URLSearchParams({
    From: from,
    To: `whatsapp:${to}`,
  });

  if (contentSid) {
    // Plantilla aprobada: permite enviar fuera de la ventana de 24h.
    // Las variables se mapean en el orden definido en el Content Template Builder ({{1}}, {{2}}, ...).
    body.set('ContentSid', contentSid);
    body.set(
      'ContentVariables',
      JSON.stringify({
        '1': params.nombre,
        '2': params.meetLink,
      }),
    );
  } else {
    // Fallback: mensaje libre (sólo funciona dentro de la ventana de 24h después de que el usuario escriba)
    const message =
      `Hola ${params.nombre}! 👋\n\n` +
      `Confirmamos tu lugar en *Camino al Closing* 🎯\n` +
      `5 encuentros en vivo, 20:00 hs Argentina, del 1 al 5 de junio.\n\n` +
      `📹 Link del Meet:\n${params.meetLink}\n\n` +
      `Nos vemos! 🚀`;
    body.set('Body', message);
  }

  const auth = Buffer.from(`${sid}:${token}`).toString('base64');

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
        cache: 'no-store',
      },
    );

    const data = (await res.json().catch(() => ({}))) as {
      sid?: string;
      message?: string;
      code?: number;
    };

    if (!res.ok) {
      console.error('[register] Twilio respondió error', res.status, data);
      return {
        ok: false,
        to,
        error: `Twilio ${res.status}: ${data.message ?? 'error desconocido'}`,
      };
    }

    return { ok: true, sid: data.sid, to };
  } catch (err) {
    console.error('[register] Error llamando a Twilio', err);
    return { ok: false, to, error: 'No se pudo contactar a Twilio' };
  }
}
