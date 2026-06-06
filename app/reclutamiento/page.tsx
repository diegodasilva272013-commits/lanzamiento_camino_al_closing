import type { Metadata } from 'next';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Laptop,
  Percent,
  Quote,
  Sparkles,
  Target,
  TrendingUp,
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
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

const stats = [
  {
    n: '01',
    icon: Clock,
    label: 'Dedicación',
    value: '2 a 3 hs',
    valueSub: 'al día',
    text: 'El compromiso diario que genera grandes resultados.',
  },
  {
    n: '02',
    icon: Target,
    label: 'Objetivo diario',
    value: '200 a 300',
    valueSub: 'mensajes nuevos',
    text: 'Contactos nuevos todos los días para prospectar y generar agendas.',
  },
  {
    n: '03',
    icon: Percent,
    label: 'Comisión',
    value: '10%',
    valueSub: 'por resultados',
    text: 'Comisión para setters por cada cierre que generen.',
  },
  {
    n: '04',
    icon: Laptop,
    label: 'Modalidad',
    value: 'Remota',
    valueSub: 'con estructura',
    text: 'Sistema, seguimiento y acompañamiento 100% online.',
  },
];

const buscamos = [
  { t: 'Compromiso real', s: 'Te tomás esto en serio desde el día 1.' },
  { t: 'Responsabilidad', s: 'Cumplís con lo que decís que vas a hacer.' },
  { t: 'Constancia', s: 'No te detenés cuando se pone difícil.' },
  { t: 'Mentalidad de crecimiento', s: 'Querés mejorar y aprender todos los días.' },
  { t: 'Ganas de aprender y ejecutar', s: 'No te quedás solo en la teoría.' },
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
      {/* Fondos decorativos globales */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.08),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(212,175,55,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.6)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      {/* HEADER */}
      <header className="relative z-20 border-b border-[rgba(212,175,55,0.15)] bg-black/80 backdrop-blur-md">
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
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-gold px-5 py-2.5 text-xs font-semibold text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] transition hover:scale-[1.02] sm:text-sm"
          >
            <span className="relative z-10">Postularme</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition group-hover:translate-x-0.5" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.18),transparent_60%)] blur-3xl"
        />

        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-28 lg:pt-20">
          <div className="flex max-w-2xl flex-col">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.06)] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.26em] text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" />
              Búsqueda abierta · Equipo interno
            </div>

            <h1 className="text-[2.6rem] font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-[5.5rem]">
              <span className="block text-brand-text/90">Estamos</span>
              <span className="block text-brand-text/90">buscando</span>
              <span className="gold-text block pb-1 text-[3.2rem] font-extrabold leading-[0.95] tracking-tight sm:text-7xl lg:text-[6.5rem]">
                SETTERS
              </span>
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-10 bg-brand-gold/60" />
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-brand-gold">
                Para nuestro equipo interno
              </p>
            </div>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-brand-muted sm:text-lg">
              Buscamos personas comprometidas, que quieran tomarse esto en serio, prospectar con
              constancia y{' '}
              <span className="font-semibold text-brand-text">crecer con nosotros</span>.
            </p>

            <div className="mt-9 overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.4)] bg-[linear-gradient(135deg,rgba(212,175,55,0.22),rgba(212,175,55,0.04)_60%,rgba(255,255,255,0.02))] p-[1px] gold-border-glow">
              <div className="flex items-center gap-4 rounded-[15px] bg-black/60 p-5 backdrop-blur">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-black">
                  <DollarSign className="h-7 w-7" />
                  <span className="absolute -inset-1 rounded-2xl bg-brand-gold/40 blur-md" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-brand-muted">
                    Tickets que vendemos
                  </p>
                  <p className="gold-text text-2xl font-bold sm:text-3xl">USD 500 y USD 1.000</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#postulate"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-gold px-7 py-4 text-sm font-semibold text-black shadow-[0_15px_40px_-10px_rgba(212,175,55,0.7)] transition hover:scale-[1.02]"
              >
                <span className="relative z-10">Quiero postularme</span>
                <ArrowRight className="relative z-10 h-4 w-4 transition group-hover:translate-x-0.5" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </a>
              <a
                href="#info"
                className="text-sm font-medium text-brand-muted underline-offset-4 transition hover:text-brand-text hover:underline"
              >
                Ver detalles del rol →
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle,_rgba(212,175,55,0.3),transparent_60%)] blur-3xl"
            />
            <div className="relative float-slow">
              <div className="absolute -inset-[3px] rounded-[2.15rem] bg-gradient-to-br from-brand-gold/70 via-brand-gold/10 to-brand-gold/40 opacity-90" />
              <div className="relative">
                <BrandVideo />
              </div>
              <div className="pointer-events-none absolute left-5 right-5 top-5 rounded-2xl border border-white/10 bg-black/60 p-3.5 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.9)]" />
                  <p className="text-[10px] uppercase tracking-[0.28em] text-brand-gold">
                    Sumate al equipo
                  </p>
                </div>
                <p className="mt-1 text-sm font-medium text-brand-text">
                  Setters · Modalidad remota
                </p>
              </div>
              <div className="pointer-events-none absolute -bottom-5 -left-5 hidden rounded-2xl border border-[rgba(212,175,55,0.3)] bg-black/85 p-4 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-brand-muted">
                      Resultados
                    </p>
                    <p className="text-sm font-semibold text-brand-gold">Comisión 10%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        id="info"
        className="relative z-10 border-y border-[rgba(212,175,55,0.18)] bg-[linear-gradient(180deg,rgba(0,0,0,0.6),rgba(20,16,8,0.5))]"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-brand-gold">El rol en números</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Reglas del juego claras
            </h2>
            <div className="gold-divider mx-auto mt-5 w-32" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6 transition hover:-translate-y-1 hover:border-[rgba(212,175,55,0.5)] hover:bg-[rgba(212,175,55,0.06)]"
              >
                <span className="pointer-events-none absolute -right-2 -top-4 select-none text-[5rem] font-black leading-none text-white/[0.04] transition group-hover:text-brand-gold/15">
                  {s.n}
                </span>

                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold ring-1 ring-brand-gold/30">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="relative mt-5 text-[10px] uppercase tracking-[0.28em] text-brand-muted">
                  {s.label}
                </p>
                <p className="relative mt-1 text-2xl font-bold leading-tight text-brand-gold sm:text-[1.6rem]">
                  {s.value}
                </p>
                <p className="relative -mt-0.5 text-xs uppercase tracking-[0.18em] text-brand-muted">
                  {s.valueSub}
                </p>
                <p className="relative mt-4 text-sm leading-relaxed text-brand-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 pt-20 sm:px-6">
        <div className="relative text-center">
          <Quote className="mx-auto h-10 w-10 text-brand-gold/50" />
          <p className="mt-6 text-2xl font-semibold leading-tight text-brand-text sm:text-3xl lg:text-4xl">
            “Más que experiencia,{' '}
            <span className="gold-text font-bold">buscamos compromiso</span>.”
          </p>
          <p className="mt-4 text-base text-brand-muted sm:text-lg">
            Si vas a tomártelo en serio, te queremos en el equipo.
          </p>
          <div className="gold-divider mx-auto mt-8 w-40" />
        </div>
      </section>

      {/* BUSCAMOS / NO ES PARA VOS */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.3)] bg-[linear-gradient(160deg,rgba(212,175,55,0.1),rgba(255,255,255,0.02))] p-8 sm:p-10 gold-border-glow">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-gold/15 blur-3xl"
            />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-brand-gold" />
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-gold">
                  Lo que buscamos
                </p>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                El perfil que <span className="gold-text">encaja</span>
              </h3>
              <ul className="mt-7 space-y-4">
                {buscamos.map((item) => (
                  <li
                    key={item.t}
                    className="group flex items-start gap-4 rounded-xl border border-transparent p-2 transition hover:border-[rgba(212,175,55,0.18)] hover:bg-white/[0.03]"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 ring-1 ring-brand-gold/40">
                      <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                    </span>
                    <div>
                      <p className="text-base font-semibold text-brand-text">{item.t}</p>
                      <p className="mt-0.5 text-sm text-brand-muted">{item.s}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/50 p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-red-500/[0.08] blur-3xl"
            />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-white/30" />
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-muted">
                  No es para vos si…
                </p>
              </div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-brand-text/85 sm:text-4xl">
                Mejor no apliques si
              </h3>
              <ul className="mt-7 space-y-4">
                {noEsParaVos.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-400/30">
                      <XCircle className="h-4 w-4 text-red-400/90" />
                    </span>
                    <p className="text-base text-brand-muted/90">{item}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-white/10 pt-5 text-sm italic text-brand-muted">
                Preferimos un “no” a tiempo que perder semanas en alguien que no se lo va a tomar
                en serio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POSTULATE */}
      <section
        id="postulate"
        className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32"
      >
        <div className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(212,175,55,0.28)] bg-[linear-gradient(150deg,rgba(212,175,55,0.16),rgba(255,255,255,0.03)_55%,rgba(0,0,0,0.4))] p-6 sm:p-10 lg:p-12 gold-border-glow">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-gold/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl"
          />

          <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <BrandLogo size="md" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-brand-gold">
                    Postulate
                  </p>
                  <p className="text-sm text-brand-muted">Camino al Closing · Equipo interno</p>
                </div>
              </div>

              <h3 className="mt-7 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.6rem]">
                Contanos por qué <span className="gold-text">querés formar parte</span>
              </h3>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-muted">
                Completá el formulario con tus datos y motivaciones. Si encajás con el perfil, nos
                ponemos en contacto con vos para avanzar.
              </p>

              <div className="mt-8 grid gap-3">
                {[
                  'Modalidad 100% remota',
                  'Comisiones por resultados (10%)',
                  'Sistema, estructura y seguimiento',
                  'Tickets de USD 500 y USD 1.000',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[rgba(212,175,55,0.15)] bg-white/[0.025] px-4 py-3 text-sm text-brand-text"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 hidden rounded-2xl border border-[rgba(212,175,55,0.18)] bg-black/40 p-5 lg:block">
                <Quote className="h-5 w-5 text-brand-gold/70" />
                <p className="mt-3 text-sm leading-relaxed text-brand-text/90">
                  Si vas a tomártelo en serio, este puede ser el lugar donde tu trabajo se
                  multiplique.
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.26em] text-brand-gold">
                  — {brand.name}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(212,175,55,0.22)] bg-black/55 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur sm:p-7">
              <RecruitmentForm />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[rgba(212,175,55,0.15)] bg-black/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-7 text-xs text-brand-muted sm:flex-row sm:px-6">
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
