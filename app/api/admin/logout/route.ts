import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export async function POST(req: Request) {
  const formData = await req.formData().catch(() => null);
  const nextValue = String(formData?.get('next') ?? '/difusion');
  const next = nextValue.startsWith('/') && !nextValue.startsWith('//') ? nextValue : '/difusion';
  const res = NextResponse.redirect(new URL(next, req.url), { status: 303 });
  res.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return res;
}