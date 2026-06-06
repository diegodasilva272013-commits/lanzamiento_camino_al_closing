import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { BarChart3, Database, Lock, MailCheck, RefreshCw, ShieldCheck } from 'lucide-react';
import { LoginCard } from '@/components/difusion/login-card';
import { EmailMarketingConsole } from '@/components/email-marketing/email-marketing-console';
import { ADMIN_COOKIE_NAME, hasAdminPassword, isAdminSession } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: 'Email marketing privado · Camino al Closing',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function EmailMarketingPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const isAllowed = isAdminSession(cookies().get(ADMIN_COOKIE_NAME)?.value);

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-brand-black px-4 py-10 text-brand-text sm:px-6 lg:px-8">
        <LoginCard
          eyebrow="Email marketing"
          title="Acceso privado"
          description="Panel interno para limpiar bases, segmentar prospectos y preparar campañas antes de activar envíos reales."
          redirectTo="/email-marketing"
        />
        {searchParams?.error === 'auth' ? (
          <p className="mt-4 text-center text-sm text-red-400">La clave ingresada no es correcta.</p>
        ) : null}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-black px-4 py-8 text-brand-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Panel privado</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Email marketing y segmentación
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
                Importá una base CSV, limpiá contactos problemáticos, separá segmentos y prepará campañas con control antes de habilitar envíos automáticos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/email-marketing"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.35)] px-4 py-2.5 text-sm font-semibold text-brand-text transition hover:bg-[rgba(212,175,55,0.08)]"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Link>
              <form action="/api/admin/logout" method="post">
                <input type="hidden" name="next" value="/email-marketing" />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>

          {!hasAdminPassword() ? (
            <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              El panel está abierto porque todavía no configuraste <span className="font-semibold">ADMIN_PASSWORD</span>.
              Antes de usarlo, cargá esa variable en Vercel.
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Metric icon={Lock} label="Acceso" value="Privado" />
            <Metric icon={Database} label="Entrada" value="CSV" />
            <Metric icon={ShieldCheck} label="Protección" value="Limpieza" />
            <Metric icon={MailCheck} label="Envíos" value="Pendiente" />
          </div>
        </section>

        <div className="mt-8">
          <EmailMarketingConsole />
        </div>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof BarChart3; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center gap-3 text-brand-muted">
        <Icon className="h-4 w-4 text-brand-gold" />
        <span className="text-xs uppercase tracking-[0.18em]">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-brand-text">{value}</p>
    </div>
  );
}