import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, isAdminSession } from '@/lib/admin-auth';
import { normalizeCampaignPhone, sendFreeformWhatsappMessage } from '@/lib/twilio';

export async function POST(req: Request) {
  if (!isAdminSession(cookies().get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { to?: string; body?: string } | null;
  const to = normalizeCampaignPhone(String(body?.to ?? ''), process.env.DEFAULT_COUNTRY_CODE ?? '54');
  const message = String(body?.body ?? '').trim();

  if (!to || !message) {
    return NextResponse.json({ error: 'Faltan teléfono o mensaje.' }, { status: 400 });
  }

  try {
    await sendFreeformWhatsappMessage({ to, body: message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No pudimos enviar la respuesta.' },
      { status: 400 },
    );
  }
}