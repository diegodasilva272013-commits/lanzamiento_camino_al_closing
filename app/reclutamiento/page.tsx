import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Laptop,
  Percent,
  Quote,
  Target,
  XCircle,
} from 'lucide-react';
import { brand } from '@/constants/branding';
import { BrandLogo } from '@/components/brand/brand-logo';
import { BrandVideo } from '@/components/brand/brand-video';
import { CountdownDeadline } from '@/components/reclutamiento/countdown-deadline';
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
    value: '2–3',
    valueSub: 'horas / día',
    text: 'El compromiso diario que genera resultados sostenidos.',
  },
  {
    n: '02',
    icon: Target,
    label: 'Volumen diario',
    value: '200–300',
    valueSub: 'mensajes nuevos',
    text: 'Contactos nuevos cada día para prospectar y agendar.',
  },
  {
    n: '03',
    icon: Percent,
    label: 'Comisión',
    value: '10%',
    valueSub: 'por resultados',
    text: 'Comisión sobre cada cierre que se genere desde tu agenda.',
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
  { t: 'Compromiso real', s: 'Te lo tomás en serio desde el día 1.' },
  { t: 'Responsabilidad', s: 'Cumplís con lo que decís que vas a hacer.' },
  { t: 'Constancia', s: 'No te detenés cuando se pone difícil.' },
  { t: 'Mentalidad de crecimiento', s: 'Querés mejorar y aprender todos los días.' },
  { t: 'Ejecución', s: 'No te quedás solo en la teoría.' },
];

const noEsParaVos = [
  'No podés sostener el compromiso diario.',
  'Buscás excusas en vez de resultados.',
  'No sos constante con tus acciones.',
  'No querés seguir un proceso probado.',
];

export default function ReclutamientoPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-brand-black text-brand-text antialiased">
      {/* Fondos */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.08),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(212,175,55,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.5)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      {/* HEADER */}
      <header className="relative z-20 border-b border-[rgba(212,175,55,0.15)] bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BrandLogo size="sm" priority />
            <div className="min-w-0 leading-tight">
              <p className="truncate font-serif text-base font-semibold tracking-tight sm:text-lg">
                {brand.name}
              </p>
              <p className="truncate text-[10px] uppercase tracking-[0.32em] text-brand-gold sm:text-[11px]">
                {brand.tagline}
              </p>
            </div>
          </div>
          <a
            href="#postulate"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-black shadow-[0_8px_24px_-8px_rgba(212,175,55,0.6)] transition hover:scale-[1.02]"
          >
            <span className="relative z-10">Postularme</span>
            <ArrowRight className="relative z-10 h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(212,175,55,0.22),transparent_60%)] blur-3xl"
        />

        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pb-32 lg:pt-24">
          <div className="flex max-w-2xl flex-col">
            {/* Eyebrow estilo magazine */}
            <div className="mb-8 flex items-center gap-4">
              <span className="font-display text-3xl text-brand-gold/90 leading-none">N° 01</span>
              <span className="h-px flex-1 max-w-16 bg-brand-gold/40" />
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-gold">
                Búsqueda abierta
              </span>
            </div>

            <h1 className="leading-[0.92] tracking-tight">
              <span className="block font-serif text-5xl font-medium italic text-brand-text sm:text-6xl lg:text-7xl">
                Estamos
              </span>
              <span className="mt-1 block font-serif text-5xl font-medium italic text-brand-text sm:text-6xl lg:text-7xl">
                buscando
              </span>
              <span className="gold-text mt-3 block font-display text-[5.5rem] font-normal leading-[0.85] tracking-[0.01em] sm:text-[7.5rem] lg:text-[10rem]">
                SETTERS
              </span>
            </h1>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-px w-10 bg-brand-gold/60" />
              <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-brand-gold">
                Para nuestro equipo interno
              </p>
            </div>

            <p className="mt-8 max-w-xl font-serif text-lg leading-relaxed text-brand-text/85 sm:text-xl">
              Buscamos personas <em className="text-brand-gold not-italic font-semibold">comprometidas</em>,
              que quieran tomarse esto en serio, prospectar con constancia y crecer con nosotros.
            </p>

            {/* Tickets banner premium */}
            <div className="mt-10 overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.45)] bg-[linear-gradient(135deg,rgba(212,175,55,0.22),rgba(212,175,55,0.04)_60%,rgba(255,255,255,0.02))] p-[1px] gold-border-glow">
              <div className="flex items-center gap-5 rounded-[15px] bg-black/65 p-5 backdrop-blur sm:p-6">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-black sm:h-16 sm:w-16">
                  <span className="font-serif text-3xl font-bold sm:text-4xl">$</span>
                  <span className="absolute -inset-1 rounded-2xl bg-brand-gold/40 blur-md" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.36em] text-brand-muted">
                    Tickets que vendemos
                  </p>
                  <p className="gold-text mt-0.5 font-serif text-2xl font-bold sm:text-3xl">
                    USD 500 · USD 1.000
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href="#postulate"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-gold px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-black shadow-[0_15px_40px_-10px_rgba(212,175,55,0.7)] transition hover:scale-[1.02]"
              >
                <span className="relative z-10">Quiero postularme</span>
                <ArrowRight className="relative z-10 h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </a>
              <a
                href="#info"
                className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-brand-muted transition hover:text-brand-gold"
              >
                Ver detalles
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Video */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle,_rgba(212,175,55,0.32),transparent_60%)] blur-3xl"
            />
            <div className="relative float-slow">
              <div className="absolute -inset-[3px] rounded-[2.15rem] bg-gradient-to-br from-brand-gold/80 via-brand-gold/10 to-brand-gold/50 opacity-90" />
              <div className="relative">
                <BrandVideo />
              </div>
              <div className="pointer-events-none absolute left-5 right-5 top-5 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(212,175,55,0.9)]" />
                  <p className="text-[10px] uppercase tracking-[0.32em] text-brand-gold">
                    En vivo
                  </p>
                </div>
                <p className="mt-1 font-serif text-base font-semibold italic text-brand-text">
                  Sumate al equipo
                </p>
                <p className="text-xs text-brand-muted">Setters · Modalidad remota</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        id="info"
        className="relative z-10 border-y border-[rgba(212,175,55,0.18)] bg-[linear-gradient(180deg,rgba(0,0,0,0.6),rgba(20,16,8,0.55))]"
      >
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-brand-gold/50" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-brand-gold">
                El rol en números
              </p>
              <span className="h-px w-10 bg-brand-gold/50" />
            </div>
            <h2 className="mt-5 font-serif text-4xl font-medium tracking-tight text-brand-text sm:text-5xl">
              Reglas del juego <em className="gold-text font-bold not-italic">claras</em>.
            </h2>
            <p className="mt-4 text-base text-brand-muted">
              Sin promesas vacías. Esto es lo que esperamos y lo que ofrecemos.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <article
                key={s.label}
                className="group relative overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.18)] bg-[linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-6 transition hover:-translate-y-1 hover:border-[rgba(212,175,55,0.55)] hover:bg-[rgba(212,175,55,0.06)] sm:p-7"
              >
                <span className="pointer-events-none absolute -right-3 -top-6 select-none font-display text-[6.5rem] leading-none text-white/[0.05] transition group-hover:text-brand-gold/20">
                  {s.n}
                </span>

                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold ring-1 ring-brand-gold/30">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="relative mt-6 text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-muted">
                  {s.label}
                </p>
                <p className="relative mt-2 font-display text-5xl leading-none text-brand-gold sm:text-6xl">
                  {s.value}
                </p>
                <p className="relative mt-2 text-xs uppercase tracking-[0.2em] text-brand-muted">
                  {s.valueSub}
                </p>
                <div className="relative mt-5 h-px w-10 bg-brand-gold/30" />
                <p className="relative mt-4 text-sm leading-relaxed text-brand-muted">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 pt-24 sm:px-6">
        <div className="relative text-center">
          <Quote className="mx-auto h-12 w-12 text-brand-gold/50" />
          <p className="mt-7 font-serif text-3xl font-medium italic leading-[1.2] text-brand-text sm:text-4xl lg:text-5xl">
            “Más que experiencia,
            <br className="hidden sm:block" />{' '}
            <span className="gold-text font-bold not-italic">buscamos compromiso</span>.”
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.32em] text-brand-muted">
            — Camino al Closing
          </p>
          <div className="gold-divider mx-auto mt-10 w-48" />
        </div>
      </section>

      {/* BUSCAMOS / NO ES PARA VOS */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lo que buscamos */}
          <article className="relative overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.32)] bg-[linear-gradient(160deg,rgba(212,175,55,0.12),rgba(255,255,255,0.02))] p-8 sm:p-10 gold-border-glow">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand-gold/20 blur-3xl"
            />
            <div className="relative">
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl text-brand-gold/90 leading-none">02</span>
                <span className="h-px flex-1 max-w-16 bg-brand-gold/50" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-gold">
                  Lo que buscamos
                </p>
              </div>
              <h3 className="mt-5 font-serif text-4xl font-medium tracking-tight sm:text-[2.6rem]">
                El perfil que <em className="gold-text font-bold not-italic">encaja</em>.
              </h3>
              <ul className="mt-9 space-y-4">
                {buscamos.map((item, i) => (
                  <li
                    key={item.t}
                    className="group flex items-start gap-4 border-b border-[rgba(212,175,55,0.1)] pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="font-display text-2xl leading-none text-brand-gold/70 pt-1 w-7 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <p className="font-serif text-xl font-semibold text-brand-text">{item.t}</p>
                      <p className="mt-1 text-sm leading-relaxed text-brand-muted">{item.s}</p>
                    </div>
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-brand-gold/80" />
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* No es para vos */}
          <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/55 p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-red-500/[0.08] blur-3xl"
            />
            <div className="relative">
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl text-white/30 leading-none">03</span>
                <span className="h-px flex-1 max-w-16 bg-white/30" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-muted">
                  No es para vos si…
                </p>
              </div>
              <h3 className="mt-5 font-serif text-4xl font-medium tracking-tight text-brand-text/85 sm:text-[2.6rem]">
                Mejor <em className="font-bold not-italic">no apliques</em> si:
              </h3>
              <ul className="mt-9 space-y-5">
                {noEsParaVos.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-400/30">
                      <XCircle className="h-4 w-4 text-red-400/90" />
                    </span>
                    <p className="font-serif text-lg leading-snug text-brand-muted/90">{item}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-10 border-t border-white/10 pt-5 font-serif text-base italic leading-relaxed text-brand-muted">
                Preferimos un “no” a tiempo que perder semanas con alguien que no se lo va a tomar
                en serio.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.32)] bg-[linear-gradient(150deg,rgba(212,175,55,0.18),rgba(255,255,255,0.03)_55%,rgba(0,0,0,0.4))] p-7 sm:p-10 lg:p-12 gold-border-glow">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-gold/20 blur-3xl"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold ring-1 ring-brand-gold/40">
                  <CalendarClock className="h-4 w-4" />
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-gold">
                  Cierre de postulación
                </p>
              </div>
              <h3 className="mt-5 font-serif text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.6rem]">
                Tenés tiempo hasta el{' '}
                <em className="gold-text font-bold not-italic">domingo a las 16:00</em>.
              </h3>
              <p className="mt-5 max-w-md font-serif text-base leading-relaxed text-brand-text/85 sm:text-lg">
                La reunión con todo el equipo de setters es el{' '}
                <span className="font-semibold text-brand-gold">domingo a las 19:00 hs</span>{' '}
                (Argentina). Si querés estar, postulate antes del cierre.
              </p>
              <a
                href="#postulate"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black shadow-[0_15px_40px_-12px_rgba(212,175,55,0.7)] transition hover:scale-[1.02]"
              >
                Postularme ahora
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </a>
            </div>

            <div>
              <CountdownDeadline />
              <p className="mt-5 text-center text-[11px] uppercase tracking-[0.32em] text-brand-muted">
                Faltan para el cierre · Hora Argentina
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POSTULATE */}
      <section
        id="postulate"
        className="relative z-10 mx-auto max-w-6xl px-4 pb-28 sm:px-6 lg:pb-36"
      >
        <div className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(212,175,55,0.32)] bg-[linear-gradient(150deg,rgba(212,175,55,0.18),rgba(255,255,255,0.03)_55%,rgba(0,0,0,0.4))] p-6 sm:p-10 lg:p-14 gold-border-glow">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-brand-gold/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-brand-gold/12 blur-3xl"
          />

          <div className="relative grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="flex flex-col">
              <div className="mb-7 flex items-center gap-4">
                <span className="font-display text-3xl text-brand-gold/90 leading-none">04</span>
                <span className="h-px flex-1 max-w-16 bg-brand-gold/50" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-gold">
                  Postulate
                </p>
              </div>

              <div className="flex items-center gap-4">
                <BrandLogo size="md" />
                <div className="leading-tight">
                  <p className="font-serif text-lg font-semibold tracking-tight">{brand.name}</p>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-brand-gold">
                    Equipo interno
                  </p>
                </div>
              </div>

              <h3 className="mt-8 font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.2rem]">
                Contanos por qué{' '}
                <em className="gold-text font-bold not-italic">querés formar parte</em>.
              </h3>

              <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-brand-text/85">
                Completá el formulario con tus datos y motivaciones. Si encajás con el perfil, nos
                ponemos en contacto con vos.
              </p>

              <div className="mt-9 grid gap-3">
                {[
                  'Modalidad 100% remota',
                  'Comisiones por resultados (10%)',
                  'Sistema, estructura y seguimiento',
                  'Tickets de USD 500 y USD 1.000',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[rgba(212,175,55,0.18)] bg-white/[0.03] px-4 py-3 text-sm text-brand-text"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-gold" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-10 hidden rounded-2xl border border-[rgba(212,175,55,0.22)] bg-black/45 p-6 lg:block">
                <Quote className="h-5 w-5 text-brand-gold/70" />
                <p className="mt-3 font-serif text-base italic leading-relaxed text-brand-text/90">
                  Si vas a tomártelo en serio, este puede ser el lugar donde tu trabajo se
                  multiplique.
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.32em] text-brand-gold">
                  — {brand.name}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[rgba(212,175,55,0.25)] bg-black/60 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur sm:p-7">
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
            <span className="font-serif italic">
              {brand.name} · {brand.tagline}
            </span>
          </div>
          <p className="uppercase tracking-[0.24em]">
            © {new Date().getFullYear()} · Todos los derechos reservados
          </p>
        </div>
      </footer>
    </main>
  );
}
