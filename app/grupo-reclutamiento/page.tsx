import type { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';
import { CalendarClock, Clock, FileText, MessageSquareText, Phone, PlayCircle, UserRound } from 'lucide-react';
import { BrandLogo } from '@/components/brand/brand-logo';
import { RecruitmentGroupTaskForm } from '@/components/reclutamiento/recruitment-group-task-form';
import { brand } from '@/constants/branding';

const ogImage = 'https://lanzamiento-camino-al-closing.vercel.app/reclutamiento-og.jpg';

export const metadata: Metadata = {
  title: 'Tarea grupo de reclutamiento · Camino al Closing',
  description: 'Formulario interno para el grupo de reclutamiento: líneas, mensajes de apertura, foto y resumen del video.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: {
    type: 'website',
    url: 'https://lanzamiento-camino-al-closing.vercel.app/grupo-reclutamiento',
    title: 'Tarea grupo de reclutamiento · Camino al Closing',
    description: 'Formulario interno para el grupo de reclutamiento: líneas, mensajes de apertura, foto y resumen del video.',
    siteName: 'Camino al Closing',
    locale: 'es_AR',
    images: [
      {
        url: ogImage,
        secureUrl: ogImage,
        width: 1200,
        height: 630,
        alt: 'Grupo de reclutamiento · Camino al Closing',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tarea grupo de reclutamiento · Camino al Closing',
    description: 'Formulario interno para el grupo de reclutamiento: líneas, mensajes de apertura, foto y resumen del video.',
    images: [ogImage],
  },
};

const tasks = [
  { icon: UserRound, title: 'Datos personales', text: 'Nombre, apellido, celular personal y foto.' },
  { icon: Phone, title: '2 o 3 líneas', text: 'Los números que vas a usar para el proyecto.' },
  { icon: MessageSquareText, title: '5 aperturas', text: 'Mensajes listos para comenzar a prospectar la base.' },
  { icon: PlayCircle, title: 'Video + resumen', text: 'Mirá el video y explicá qué entendiste.' },
];

export default function GrupoReclutamientoPage() {
  return (
    <main className="min-h-screen bg-brand-black px-4 py-8 text-brand-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="overflow-hidden rounded-[2.25rem] border border-[rgba(212,175,55,0.18)] bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.16),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.4)] sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4">
                <BrandLogo size="md" priority />
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-brand-gold">{brand.name}</p>
                  <p className="mt-1 text-sm text-brand-muted">Grupo de reclutamiento</p>
                </div>
              </div>
              <h1 className="mt-8 font-display text-5xl uppercase leading-[0.92] tracking-[0.01em] sm:text-6xl lg:text-7xl">
                Tarea para entregar <span className="gold-text">mañana</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-text/85 sm:text-lg">
                Completá este formulario antes de mañana a las 11:00 hs Argentina. La reunión es a las 12:00 hs, y esta entrega nos permite llegar con todo ordenado.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[380px] lg:grid-cols-1">
              <DeadlineCard icon={CalendarClock} label="Entrega límite" value="Mañana · 11:00 hs" />
              <DeadlineCard icon={Clock} label="Reunión" value="Mañana · 12:00 hs" />
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {tasks.map((task) => (
            <article key={task.title} className="rounded-2xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-5">
              <task.icon className="h-5 w-5 text-brand-gold" />
              <h2 className="mt-4 text-lg font-semibold text-brand-text">{task.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{task.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-5 backdrop-blur sm:p-7">
          <div className="mb-7 flex items-start gap-3 rounded-2xl border border-[rgba(212,175,55,0.22)] bg-black/35 px-4 py-3 text-sm leading-relaxed text-brand-muted">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
            <p>
              Todo lo que cargues queda guardado en Google Sheets para revisión interna. Línea 1 y Línea 2 son obligatorias; Línea 3 es opcional. El resto de campos tiene que estar completo.
            </p>
          </div>
          <RecruitmentGroupTaskForm />
        </section>
      </div>
    </main>
  );
}

function DeadlineCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(212,175,55,0.28)] bg-black/45 p-5">
      <div className="flex items-center gap-3 text-brand-muted">
        <Icon className="h-4 w-4 text-brand-gold" />
        <span className="text-xs uppercase tracking-[0.22em]">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-brand-text">{value}</p>
    </div>
  );
}