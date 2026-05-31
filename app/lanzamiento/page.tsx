import { ArrowRight, CheckCircle2, Clock, Lock, MessageCircle, Sparkles } from 'lucide-react';
import { brand } from '@/constants/branding';
import { BrandLogo } from '@/components/brand/brand-logo';
import { BrandVideo } from '@/components/brand/brand-video';
import { WhatsAppIcon } from '@/components/brand/whatsapp-icon';
import { RegisterForm } from '@/components/register-form';

const WHATSAPP_URL = 'https://chat.whatsapp.com/BouUahLfmvu4PKL8hJbhCP?mode=gi_t';

const timezones = [
  { time: '20:00', label: 'Argentina · Uruguay · Brasil', codes: ['ar', 'uy', 'br'] },
  { time: '19:00', label: 'Chile · Paraguay · Bolivia · Venezuela · Rep. Dominicana', codes: ['cl', 'py', 'bo', 've', 'do'] },
  { time: '18:00', label: 'Perú · Colombia · Ecuador · Panamá', codes: ['pe', 'co', 'ec', 'pa'] },
  { time: '17:00', label: 'México · Costa Rica · Guatemala · Honduras · El Salvador · Nicaragua', codes: ['mx', 'cr', 'gt', 'hn', 'sv', 'ni'] },
  { time: '01:00 (+1 día)', label: 'España peninsular', codes: ['es'] },
  { time: '00:00 (+1 día)', label: 'Islas Canarias', codes: ['es'] },
];

const agenda = [
  {
    day: 'Lunes',
    date: '1 de Junio',
    title: 'Generar CONFIANZA con el lead',
    text: 'Cómo crear el clima correcto desde el primer mensaje para que el lead te elija a vos.',
  },
  {
    day: 'Martes',
    date: '2 de Junio',
    title: 'Seguir el Hilo Conversacional',
    text: 'La técnica para que la charla fluya natural y no se rompa en cada respuesta.',
  },
  {
    day: 'Miércoles',
    date: '3 de Junio',
    title: 'La verdad del "Presionar"',
    text: 'Qué significa realmente presionar sin romper la relación con el prospecto.',
  },
  {
    day: 'Jueves',
    date: '4 de Junio',
    title: 'Resolución de Objeciones',
    text: 'Cómo desarmar las 5 objeciones más comunes que te frenan los cierres.',
  },
  {
    day: 'Viernes',
    date: '5 de Junio',
    title: 'Resolución de dudas + Regalos',
    text: 'Cierre del evento, dudas en vivo y regalos exclusivos para los participantes.',
  },
];

const benefits = [
  '5 días de formación en vivo enfocada en el cierre',
  'Comunidad activa en WhatsApp con todos los participantes',
  'Material y regalos exclusivos para los registrados',
  'Acceso directo a la metodología completa',
];

export default function LanzamientoPage() {
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

          <nav className="flex items-center gap-2 sm:gap-3">
            <a
              href="#agenda"
              className="rounded-full border border-[rgba(212,175,55,0.35)] px-3 py-2 text-xs font-medium text-brand-text transition hover:bg-[rgba(212,175,55,0.08)] sm:px-4 sm:text-sm"
            >
              Agenda
            </a>
            <a
              href="#registro"
              className="rounded-full bg-brand-gold px-3 py-2 text-xs font-semibold text-black transition hover:opacity-90 sm:px-4 sm:text-sm"
            >
              Registro
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-12 lg:pb-24 lg:pt-16">
        <div className="flex max-w-2xl flex-col">
          <div className="mb-6 flex items-center gap-4">
            <BrandLogo size="lg" priority />
            <div>
              <p className="text-sm font-semibold text-brand-text">{brand.name}</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-brand-gold">
                {brand.tagline}
              </p>
            </div>
          </div>

          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(212,175,55,0.2)] bg-white/5 px-3 py-1 text-xs text-brand-muted">
            <Lock className="h-3.5 w-3.5 text-brand-gold" />
            5 días en vivo · 20:00 hs Argentina · del 1 al 5 de Junio
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Camino al Closing
            <span className="block text-brand-gold">Evento de Cierre de Ventas</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-muted sm:text-lg">
            En este evento abordamos los <span className="text-brand-text font-semibold">4 puntos
            fundamentales</span> para cerrar una venta. 5 días en vivo, comunidad activa y regalos
            para los participantes.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-brand-text sm:text-base">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#registro"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Quiero mi lugar
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#1ebe57]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Unirme al grupo
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden
            className="absolute -inset-4 rounded-[2.25rem] bg-[radial-gradient(circle,_rgba(212,175,55,0.22),transparent_65%)] blur-2xl"
          />
          <BrandVideo />
          <div className="pointer-events-none absolute left-4 right-4 top-4 rounded-2xl border border-white/10 bg-black/45 p-3 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[0.26em] text-brand-gold">
              Evento en vivo
            </p>
            <p className="mt-1 text-sm text-brand-text">
              1 al 5 de Junio · Cierre de ventas paso a paso
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/55 p-4 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.22em] text-brand-muted">5 días · 20:00 hs ARG</p>
            <p className="mt-1 text-base font-semibold text-brand-text sm:text-lg">
              Confianza · Conversación · Presión · Objeciones · Cierre
            </p>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section
        id="agenda"
        className="relative z-10 border-y border-[rgba(212,175,55,0.12)] bg-black/40"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Agenda del evento</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              4 puntos fundamentales para cerrar una venta
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
              5 encuentros en vivo, uno por día, con todo lo que necesitás para profesionalizar tus
              cierres.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {agenda.map((item, idx) => (
              <div
                key={item.title}
                className="relative flex flex-col rounded-2xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-5 transition hover:border-[rgba(212,175,55,0.4)] hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center rounded-full bg-brand-gold/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gold">
                    Día {idx + 1}
                  </span>
                  <span className="text-xs text-brand-muted">{item.day}</span>
                </div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-brand-muted">
                  {item.date}
                </p>
                <h3 className="mt-2 text-base font-semibold leading-snug text-brand-text">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HORARIOS */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.25)] bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-brand-gold">
            <Clock className="h-3.5 w-3.5" />
            Horarios por país
          </div>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            20:00 hs Argentina · todos los días
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">
            Mismo horario los 5 días del evento. Revisá el equivalente en tu país para no perderte
            ningún encuentro.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {timezones.map((tz) => (
            <div
              key={tz.label}
              className="flex flex-col rounded-2xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-5 transition hover:border-[rgba(212,175,55,0.4)] hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {tz.codes.map((code) => (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      key={code}
                      src={`https://flagcdn.com/w40/${code}.png`}
                      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
                      width={28}
                      height={20}
                      alt={code.toUpperCase()}
                      loading="lazy"
                      className="h-5 w-7 rounded-sm object-cover ring-1 ring-white/15"
                    />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-brand-gold/15 px-3 py-1.5 text-base font-semibold tracking-tight text-brand-gold">
                  <Clock className="h-3.5 w-3.5" />
                  {tz.time}
                </span>
              </div>
              <p className="mt-4 text-sm leading-snug text-brand-text">{tz.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-brand-muted">
          * Referencia para junio 2026. Si tu país tiene horario de verano, verificá la diferencia
          con Buenos Aires (GMT-3).
        </p>
      </section>

      {/* WHATSAPP CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#25D366]/30 bg-[linear-gradient(135deg,rgba(37,211,102,0.18),rgba(37,211,102,0.04))] p-8 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#25D366]/20 blur-3xl"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-black shadow-[0_15px_40px_-10px_rgba(37,211,102,0.6)]">
                <WhatsAppIcon className="h-9 w-9" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-[#25D366]">
                  Grupo oficial del evento
                </p>
                <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  Sumate al grupo de WhatsApp
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">
                  Adentro vas a recibir el link de cada encuentro, recordatorios diarios y los
                  regalos exclusivos del último día. Nos vemos ahí 🔥
                </p>
              </div>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-semibold text-black transition hover:bg-[#1ebe57] lg:px-7"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Unirme al grupo
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* REGISTRO */}
      <section id="registro" className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:pb-24">
        <div className="overflow-hidden rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-[linear-gradient(135deg,rgba(212,175,55,0.14),rgba(255,255,255,0.04))] p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <BrandLogo size="md" />
                <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Registro</p>
              </div>
              <h3 className="mt-5 text-2xl font-semibold sm:text-3xl lg:text-4xl">
                Reservá tu lugar para los 5 encuentros
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-muted sm:text-base">
                Dejá tus datos para confirmar tu cupo. Después sumate al grupo de WhatsApp para
                recibir el link de cada día y los regalos del cierre.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-brand-muted">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  Acceso a los 5 encuentros en vivo (1 al 5 de Junio)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                  Comunidad cerrada en WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-gold" />
                  Regalos exclusivos el día viernes
                </li>
              </ul>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-sm font-medium text-[#25D366] transition hover:bg-[#25D366]/20"
              >
                <WhatsAppIcon className="h-4 w-4" />
                También podés entrar directo al grupo
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="rounded-2xl border border-[rgba(212,175,55,0.18)] bg-black/40 p-5 sm:p-6">
              <RegisterForm />
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
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[#25D366] transition hover:opacity-80"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Sumate al grupo de WhatsApp
          </a>
          <p>
            © {new Date().getFullYear()} {brand.name}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
