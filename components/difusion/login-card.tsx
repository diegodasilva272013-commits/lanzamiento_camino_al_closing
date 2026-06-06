export function LoginCard({
  eyebrow = 'Difusión',
  title = 'Ingresar al panel',
  description = 'Este panel centraliza campañas, respuestas entrantes e historial de WhatsApp en una sola vista.',
  redirectTo = '/difusion',
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  redirectTo?: string;
}) {
  return (
    <div className="mx-auto max-w-md rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold text-brand-text">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-brand-muted">
        {description}
      </p>

      <form action="/api/admin/login" method="post" className="mt-8 grid gap-4">
        <input type="hidden" name="next" value={redirectTo} />
        <label className="grid gap-1.5 text-left">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
            Clave de acceso
          </span>
          <input
            required
            name="password"
            type="password"
            className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
          />
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Entrar al panel
        </button>
      </form>
    </div>
  );
}