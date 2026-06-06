import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, isAdminPasswordValid } from '@/lib/admin-auth';

export async function POST(req: Request) {
  const formData = await req.formData();
  const password = String(formData.get('password') ?? '');
  const next = sanitizeRedirect(String(formData.get('next') ?? '/difusion'));

  if (!isAdminPasswordValid(password)) {
    const errorUrl = new URL(next, req.url);
    errorUrl.searchParams.set('error', 'auth');
    return NextResponse.redirect(errorUrl, { status: 303 });
  }

  const res = NextResponse.redirect(new URL(next, req.url), { status: 303 });
  res.cookies.set(ADMIN_COOKIE_NAME, process.env.ADMIN_PASSWORD ?? 'open-access', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

function sanitizeRedirect(value: string) {
  if (!value.startsWith('/') || value.startsWith('//')) {
    return '/difusion';
  }

  return value;
}