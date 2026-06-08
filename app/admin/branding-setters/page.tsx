import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, isAdminSession } from '@/lib/admin-auth';
import { BrandLogo } from '@/components/brand/brand-logo';
import { BrandingSettersTool } from '@/components/setters/branding-setters-tool';

export const metadata: Metadata = {
  title: 'Branding setters · Camino al Closing',
  description: 'Herramienta privada para generar avatares y banners de setters.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

/**
 * Devuelve true si la request tiene permiso:
 *  - cookie admin valida, o
 *  - el query param ?c=<BRANDING_ACCESS_CODE> coincide.
 * Si BRANDING_ACCESS_CODE no esta seteado, dejamos pasar (modo dev/setup).
 */
function isAuthorized(searchParams?: { c?: string }): boolean {
  const adminCookie = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (isAdminSession(adminCookie)) return true;

  const expected = process.env.BRANDING_ACCESS_CODE;
  if (!expected) return true;

  return (searchParams?.c ?? '') === expected;
}

export default function BrandingSettersPage({
  searchParams,
}: {
  searchParams?: { c?: string };
}) {
  const authorized = isAuthorized(searchParams);

  if (!authorized) {
    return (
      <main className="min-h-screen bg-brand-black px-4 py-16 text-brand-text sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-md flex-col items-start gap-6 rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-8 backdrop-blur">
          <BrandLogo size="md" priority />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Acceso restringido</p>
            <h1 className="mt-2 text-2xl font-semibold">Este link no es valido</h1>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">
              Esta seccion es solo para administracion. Volve a entrar con el link completo.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-black px-4 py-10 text-brand-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col items-start gap-6 rounded-[2.25rem] border border-[rgba(212,175,55,0.18)] bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" priority />
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-brand-gold">Admin · privado</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                Branding de setters
              </h1>
            </div>
          </div>

          <div className="grid gap-2 text-sm leading-relaxed text-brand-muted">
            <p>
              Subi la foto que mando el setter y la IA genera:{' '}
              <span className="font-semibold text-brand-text">avatar profesional</span> para
              perfil de WhatsApp y{' '}
              <span className="font-semibold text-brand-text">banner</span> para portada del
              grupo, con la estetica de Camino al Closing.
            </p>
            <p>
              Modelo: <code className="rounded bg-white/10 px-1.5 py-0.5">gpt-image-1</code> con{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5">input_fidelity: high</code>{' '}
              para preservar el rostro real. Probamos con 1 primero, despues escalamos.
            </p>
          </div>
        </header>

        <section className="mt-8">
          <BrandingSettersTool accessCode={searchParams?.c} />
        </section>
      </div>
    </main>
  );
}
