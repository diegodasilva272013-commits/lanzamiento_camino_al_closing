import type { Metadata } from 'next';
import { BrandLogo } from '@/components/brand/brand-logo';
import { SettersForm } from '@/components/setters/setters-form';

export const metadata: Metadata = {
  title: 'Reporte diario · Setters · Camino al Closing',
  description: 'Form interno para que los setters carguen el reporte diario.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function SettersReportPage() {
  return (
    <main className="min-h-screen bg-brand-black px-4 py-10 text-brand-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex flex-col items-start gap-6 rounded-[2.25rem] border border-[rgba(212,175,55,0.18)] bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" priority />
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-brand-gold">Camino al Closing</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                Reporte diario · Setters
              </h1>
            </div>
          </div>

          <div className="grid gap-2 text-sm leading-relaxed text-brand-muted">
            <p>
              Cargá tu reporte del día en menos de 2 minutos. Tres tareas:{' '}
              <span className="font-semibold text-brand-text">5 mensajes de apertura</span>,{' '}
              <span className="font-semibold text-brand-text">3 líneas activas</span> y{' '}
              <span className="font-semibold text-brand-text">90 contactados con su estado</span>.
            </p>
            <p>
              Podés copiar y pegar todo desde tu planilla. La idea es que sea rápido y sin
              fricción.
            </p>
          </div>
        </header>

        <div className="mt-8">
          <SettersForm />
        </div>
      </div>
    </main>
  );
}
