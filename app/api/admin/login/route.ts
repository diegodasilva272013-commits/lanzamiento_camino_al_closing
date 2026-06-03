import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, isAdminPasswordValid } from '@/lib/admin-auth';

export async function POST(req: Request) {
  const formData = await req.formData();
  const password = String(formData.get('password') ?? '');

  if (!isAdminPasswordValid(password)) {
    return NextResponse.redirect(new URL('/difusion?error=auth', req.url), { status: 303 });
  }

  const res = NextResponse.redirect(new URL('/difusion', req.url), { status: 303 });
  res.cookies.set(ADMIN_COOKIE_NAME, process.env.ADMIN_PASSWORD ?? 'open-access', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}