import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, isAdminSession } from '@/lib/admin-auth';
import { sanitizeFirstName, sendTemplateWhatsappMessage } from '@/lib/twilio';

type ContactInput = {
  contactId: string;
  firstName?: string;
  phone: string;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  if (!isAdminSession(cookies().get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    contacts?: ContactInput[];
    templateSid?: string;
  } | null;

  const contacts = body?.contacts ?? [];
  const templateSid = String(body?.templateSid ?? '').trim();

  if (!templateSid) {
    return NextResponse.json({ error: 'Falta el Template SID.' }, { status: 400 });
  }

  if (contacts.length === 0 || contacts.length > 25) {
    return NextResponse.json({ error: 'Cada lote debe tener entre 1 y 25 contactos.' }, { status: 400 });
  }

  const results: Array<{ contactId: string; phone: string; ok: boolean; sid?: string; error?: string }> = [];

  for (const contact of contacts) {
    try {
      const sent = await sendTemplateWhatsappMessage({
        to: contact.phone,
        contentSid: templateSid,
        contentVariables: {
          '1': sanitizeFirstName(contact.firstName),
        },
      });

      results.push({
        contactId: contact.contactId,
        phone: contact.phone,
        ok: true,
        sid: sent.sid,
      });
    } catch (error) {
      results.push({
        contactId: contact.contactId,
        phone: contact.phone,
        ok: false,
        error: error instanceof Error ? error.message : 'Error de Twilio',
      });
    }

    await wait(350);
  }

  return NextResponse.json({ results });
}