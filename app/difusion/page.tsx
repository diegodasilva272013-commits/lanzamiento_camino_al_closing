import Link from 'next/link';
import { cookies } from 'next/headers';
import { Activity, ArrowUpRight, MessageCircleMore, RefreshCw, SendHorizonal } from 'lucide-react';
import { LoginCard } from '@/components/difusion/login-card';
import { CampaignConsole } from '@/components/difusion/campaign-console';
import { ReplyForm } from '@/components/difusion/reply-form';
import { ADMIN_COOKIE_NAME, hasAdminPassword, isAdminSession } from '@/lib/admin-auth';
import { buildWhatsappThreads, getWhatsappSender, listRecentWhatsappMessages } from '@/lib/twilio';

function formatDate(value: string | null) {
  if (!value) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default async function DifusionPage({
  searchParams,
}: {
  searchParams?: { contact?: string; error?: string };
}) {
  const isAllowed = isAdminSession(cookies().get(ADMIN_COOKIE_NAME)?.value);

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-brand-black px-4 py-10 text-brand-text sm:px-6 lg:px-8">
        <LoginCard />
        {searchParams?.error === 'auth' ? (
          <p className="mt-4 text-center text-sm text-red-400">La clave ingresada no es correcta.</p>
        ) : null}
      </main>
    );
  }

  const messages = await listRecentWhatsappMessages(200);
  const threads = buildWhatsappThreads(messages);
  const selectedPhone = searchParams?.contact ?? threads[0]?.contactPhone ?? '';
  const selectedThread = threads.find((thread) => thread.contactPhone === selectedPhone) ?? threads[0] ?? null;
  const deliveredCount = messages.filter((item) => item.status === 'delivered').length;
  const inboundCount = messages.filter((item) => item.to === getWhatsappSender()).length;
  const defaultTemplateSid = process.env.TWILIO_BROADCAST_TEMPLATE_SID ?? 'HX1e552a71ab82179c62514e3488d15ae7';

  return (
    <main className="min-h-screen bg-brand-black px-4 py-8 text-brand-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2.25rem] border border-[rgba(212,175,55,0.18)] bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.32em] text-brand-gold">Herramienta operativa</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Difusión y bandeja de WhatsApp
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
                Panel separado del landing para preparar campañas por CSV, enviar por plantilla aprobada y revisar respuestas de cada contacto en el mismo historial.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/difusion"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.35)] px-4 py-2.5 text-sm font-semibold text-brand-text transition hover:bg-[rgba(212,175,55,0.08)]"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </Link>
              <form action="/api/admin/logout" method="post">
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
              Antes de usarlo en producción, cargá esa variable en Vercel.
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard icon={SendHorizonal} label="Mensajes recientes" value={String(messages.length)} />
            <MetricCard icon={Activity} label="Entregados" value={String(deliveredCount)} />
            <MetricCard icon={MessageCircleMore} label="Entrantes" value={String(inboundCount)} />
          </div>
        </section>

        <div className="mt-8">
          <CampaignConsole defaultTemplateSid={defaultTemplateSid} />
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
          <div className="rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-5 backdrop-blur sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Historial</p>
                <h2 className="mt-2 text-2xl font-semibold">Conversaciones recientes</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-brand-muted">
                Últimos 200 mensajes
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {threads.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-8 text-center text-sm text-brand-muted">
                  Todavía no hay mensajes recientes en la línea de Twilio.
                </div>
              ) : (
                threads.map((thread) => {
                  const active = selectedThread?.contactPhone === thread.contactPhone;
                  return (
                    <Link
                      key={thread.contactPhone}
                      href={`/difusion?contact=${encodeURIComponent(thread.contactPhone)}`}
                      className={`rounded-2xl border px-4 py-4 transition ${
                        active
                          ? 'border-brand-gold bg-brand-gold/10'
                          : 'border-white/10 bg-black/30 hover:border-[rgba(212,175,55,0.28)] hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-brand-text">{thread.contactPhone.replace('whatsapp:', '')}</p>
                          <p className="mt-1 truncate text-sm text-brand-muted">{thread.latestBody || 'Sin contenido'}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs text-brand-muted">{formatDate(thread.latestAt)}</p>
                          {thread.unreadInboundCount > 0 ? (
                            <span className="mt-2 inline-flex items-center rounded-full bg-brand-gold px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black">
                              {thread.unreadInboundCount} entrante
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-5 backdrop-blur sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Chat</p>
                <h2 className="mt-2 text-2xl font-semibold">{selectedThread?.contactPhone.replace('whatsapp:', '') ?? 'Seleccioná un contacto'}</h2>
              </div>
              {selectedThread ? (
                <a
                  href={`https://wa.me/${selectedThread.contactPhone.replace('whatsapp:+', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.35)] px-4 py-2.5 text-sm font-semibold text-brand-text transition hover:bg-[rgba(212,175,55,0.08)]"
                >
                  Abrir en WhatsApp
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>

            {selectedThread ? (
              <>
                <div className="mt-5 flex max-h-[560px] flex-col gap-3 overflow-auto rounded-2xl border border-white/10 bg-black/30 p-4">
                  {selectedThread.messages.map((message) => (
                    <div
                      key={message.sid}
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.inbound
                          ? 'self-start border border-white/10 bg-white/10 text-brand-text'
                          : 'self-end bg-brand-gold text-black'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.body || 'Mensaje sin cuerpo visible.'}</p>
                      <div className={`mt-2 flex items-center gap-2 text-[11px] ${message.inbound ? 'text-brand-muted' : 'text-black/70'}`}>
                        <span>{formatDate(message.occurredAt)}</span>
                        <span>·</span>
                        <span>{message.status}</span>
                        {message.errorCode ? (
                          <>
                            <span>·</span>
                            <span>Error {message.errorCode}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <ReplyForm to={selectedThread.contactPhone.replace('whatsapp:', '')} />
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-10 text-center text-sm text-brand-muted">
                Cuando entren respuestas o tengas campañas enviadas, vas a poder abrir cada conversación desde acá.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-brand-gold/15 p-3 text-brand-gold">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-muted">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-brand-text">{value}</p>
        </div>
      </div>
    </div>
  );
}