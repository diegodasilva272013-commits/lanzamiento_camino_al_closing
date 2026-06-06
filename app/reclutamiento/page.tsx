import type { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Laptop,
  Percent,
  Target,
  XCircle,
} from 'lucide-react';
import { brand } from '@/constants/branding';
import { BrandLogo } from '@/components/brand/brand-logo';
import { BrandVideo } from '@/components/brand/brand-video';
import { RecruitmentForm } from '@/components/reclutamiento/recruitment-form';

export const metadata: Metadata = {
  title: 'Sumate al equipo de Setters · Camino al Closing',
  description:
    'Buscamos setters comprometidos para nuestro equipo interno. Modalidad remota, comisiones por resultados y acompañamiento con sistema y estructura.',
};

const stats = [
  {
    icon: Clock,
    label: 'Dedicación',
    value: '2 a 3 horas al día',
    text: 'El compromiso diario que genera grandes resultados.',
  },
  {
    icon: Target,
    label: 'Objetivo diario',
    value: '200 a 300 mensajes',
    text: 'Contactos nuevos todos los días para prospectar y generar agendas.',
  },
  {
    icon: Percent,
    label: 'Comisión',
    value: '10%',
    text: 'Comisión para setters por resultados.',
  },
  {
    icon: Laptop,
    label: 'Modalidad',
    value: 'Remota',
    text: 'Con sistema, estructura y seguimiento.',
  },
];

const buscamos = [
  'Compromiso real',
  'Responsabilidad',
  'Constancia',
  'Mentalidad de crecimiento',
  'Ganas de aprender y ejecutar',
];

const noEsParaVos = [
  'No podés sostener el compromiso',
  'Buscás excusas en vez de resultados',
  'No sos constante',
  'No querés seguir un proceso',
];

export default function ReclutamientoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-black text-brand-text">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12),transparent_45%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.05),transparent_35%)]"
      />

      {/* HEADER */}
      <header className="relative z-20 border-b border-[rgba(212,175,55,0.12)] bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo size="sm" priority />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold sm:text-base">{brand.name}</p>
              <p className="truncate text-[10px] uppercase tracking-[0.24em] text-brand-gold sm:text-xs">
                {brand.tagline}
              </p>
            </div>
          </div>
          <a
            href="#postulate"
            className="rounded-full bg-brand-gold px-4 py-2 text-xs font-semibold text-black transition hover:opacity-90 sm:text-sm"
          >
            Postularme
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:pb-24 lg:pt-16">
        <div className="flex max-w-2xl flex-col">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(212,175,55,0.2)] bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-brand-gold">
            Equipo interno · Búsqueda abierta
          </div>

          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Estamos buscando
            <span className="block text-brand-gold">SETTERS</span>
          </h1>
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.28em] text-brand-muted">
            Para nuestro equipo interno
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-muted sm:text-lg">
            Buscamos personas comprometidas, que quieran tomarse esto en serio, prospectar con
            constancia y <span className="font-semibold text-brand-text">crecer con nosotros</span>.
          </p>

          {/* Tickets */}
          <div className="mt-8 flex items-center gap-4 rounded-2xl border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(135deg,rgba(212,175,55,0.16),rgba(255,255,255,0.03))] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gold text-black">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-brand-muted">Tickets de</p>
              <p className="text-xl font-semibold text-brand-gold sm:text-2xl">USD 500 y USD 1.000</p>
            </div>
          </div>

          <a
            href="#postulate"
            className="mt-8 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Quiero postularme
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-[2.25rem] bg-[radial-gradient(circle,_rgba(212,175,55,0.22),transparent_65%)] blur-2xl"
          />
          <BrandVideo />
          <div className="pointer-events-none absolute left-4 right-4 top-4 rounded-2xl border border-white/10 bg-black/45 p-3 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[0.26em] text-brand-gold">Sumate al equipo</p>
            <p className="mt-1 text-sm text-brand-text">Setters · Modalidad remota</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 border-y border-[rgba(212,175,55,0.12)] bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col rounded-2xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 transition hover:border-[rgba(212,175,55,0.4)] hover:bg-white/[0.07]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-brand-muted">
                  {s.label}
                </p>
                <p className="mt-1 text-xl font-semibold text-brand-gold">{s.value}</p>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSCAMOS / NO ES PARA VOS */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-[rgba(212,175,55,0.22)] bg-white/5 p-7 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Lo que buscamos</p>
            <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">El perfil que encaja</h3>
            <ul className="mt-6 space-y-3">
              {buscamos.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-brand-text sm:text-base">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-7 sm:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-brand-muted">No es para vos si…</p>
            <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">Mejor no apliques si</h3>
            <ul className="mt-6 space-y-3">
              {noEsParaVos.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-brand-muted sm:text-base">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400/80" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="text-2xl font-semibold text-brand-gold sm:text-3xl">
            Más que experiencia, buscamos compromiso.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">
            Si vas a tomártelo en serio, te queremos en el equipo.
          </p>
        </div>
      </section>

      {/* POSTULATE */}
      <section id="postulate" className="relative z-10 mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-[linear-gradient(135deg,rgba(212,175,55,0.14),rgba(255,255,255,0.04))] p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <BrandLogo size="md" />
                <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Postulate</p>
              </div>
              <h3 className="mt-5 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Contanos por qué querés formar parte
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">
                Completá el formulario con tus datos y motivaciones. Si encajás con el perfil, nos
                ponemos en contacto con vos para avanzar.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-brand-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  Modalidad 100% remota
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  Comisiones por resultados (10%)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  Sistema, estructura y seguimiento
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[rgba(212,175,55,0.18)] bg-black/40 p-5 sm:p-7">
              <RecruitmentForm />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[rgba(212,175,55,0.12)] bg-black/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-brand-muted sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <span>
              {brand.name} · {brand.tagline}
            </span>
          </div>
          <p>
            © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
