import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, isAdminSession } from '@/lib/admin-auth';
import { prepareCampaignContacts } from '@/lib/campaign';

export async function POST(req: Request) {
  if (!isAdminSession(cookies().get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  const limit = Number(formData.get('limit') ?? 1000);

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Subí un archivo CSV válido.' }, { status: 400 });
  }

  try {
    const csvText = await file.text();
    const prepared = prepareCampaignContacts(csvText, Math.max(1, Math.min(limit, 5000)), process.env.DEFAULT_COUNTRY_CODE ?? '54');
    return NextResponse.json(prepared);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'No pudimos preparar la campaña.' },
      { status: 400 },
    );
  }
}