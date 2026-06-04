'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Send } from 'lucide-react';

const MENSAJES = 5;
const LINEAS = 3;

export function SettersForm() {
  const [setter, setSetter] = useState('');
  const [mensajes, setMensajes] = useState<string[]>(() => Array(MENSAJES).fill(''));
  const [lineas, setLineas] = useState<string[]>(() => Array(LINEAS).fill(''));
  const [contactados, setContactados] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const code = new URLSearchParams(window.location.search).get('c') ?? '';
    setAccessCode(code);
  }, []);

  const filasContactados = useMemo(() => {
    const lines = contactados.split('\n').map((line) => line.trim()).filter(Boolean);
    return lines.length;
  }, [contactados]);

  function updateMensaje(index: number, value: string) {
    setMensajes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function updateLinea(index: number, value: string) {
    setLineas((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/setters/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setter, mensajes, lineas, contactados, accessCode }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'No pudimos guardar tu reporte.');
      }

      setFeedback({
        kind: 'ok',
        message: '¡Listo! Tu reporte quedó registrado. Buen trabajo.',
      });
      setMensajes(Array(MENSAJES).fill(''));
      setLineas(Array(LINEAS).fill(''));
      setContactados('');
    } catch (err) {
      setFeedback({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Error inesperado.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      {/* Identificación */}
      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Tu identificación</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-text">¿Quién hace este reporte?</h2>
        <label className="mt-5 grid gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
            Nombre y apellido
          </span>
          <input
            required
            value={setter}
            onChange={(event) => setSetter(event.target.value)}
            placeholder="Ej: Juan Pérez"
            className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
          />
        </label>
      </section>

      {/* 5 mensajes de apertura */}
      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Tarea 1</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-text">5 mensajes de apertura</h2>
        <p className="mt-2 text-sm text-brand-muted">
          Pegá los 5 mensajes con los que abriste conversaciones hoy. Uno por bloque.
        </p>

        <div className="mt-6 grid gap-4">
          {mensajes.map((value, index) => (
            <label key={`mensaje-${index}`} className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
                Mensaje {index + 1}
              </span>
              <textarea
                required
                rows={3}
                value={value}
                onChange={(event) => updateMensaje(index, event.target.value)}
                placeholder={`Pegá acá el mensaje ${index + 1}`}
                className="resize-y rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm leading-relaxed text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
              />
            </label>
          ))}
        </div>
      </section>

      {/* 3 líneas activas */}
      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Tarea 2</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-text">3 líneas activas y calientes</h2>
        <p className="mt-2 text-sm text-brand-muted">
          Compartí los 3 números desde los que estás contactando hoy.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {lineas.map((value, index) => (
            <label key={`linea-${index}`} className="grid gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
                Línea {index + 1}
              </span>
              <input
                required
                value={value}
                onChange={(event) => updateLinea(index, event.target.value)}
                placeholder="+54 9 11..."
                className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 font-mono text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
              />
            </label>
          ))}
        </div>
      </section>

      {/* Lista de contactados */}
      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Tarea 3</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-text">90 contactados de hoy</h2>
        <p className="mt-2 text-sm text-brand-muted">
          Pegá la lista de los números que contactaste con su estado al lado. Podés copiar y pegar
          directo desde Excel o Google Sheets — cada fila va en una línea.
        </p>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs leading-relaxed text-brand-muted">
          <p className="font-semibold text-brand-text">Formato sugerido (uno por línea):</p>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-[12px]">
{`+54 9 11 1234-5678    no responde
+54 9 11 2345-6789    contestó
+54 9 11 3456-7890    interesado
+54 9 11 4567-8901    pidió info
+54 9 11 5678-9012    no responde`}
          </pre>
          <p className="mt-3">
            Estados sugeridos: <span className="font-medium text-brand-text">no responde</span>,{' '}
            <span className="font-medium text-brand-text">contestó</span>,{' '}
            <span className="font-medium text-brand-text">interesado</span>,{' '}
            <span className="font-medium text-brand-text">pidió info</span>,{' '}
            <span className="font-medium text-brand-text">cerró</span>,{' '}
            <span className="font-medium text-brand-text">descartado</span>.
          </p>
        </div>

        <label className="mt-5 grid gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
            Pegá tu lista acá
          </span>
          <textarea
            required
            rows={16}
            value={contactados}
            onChange={(event) => setContactados(event.target.value)}
            spellCheck={false}
            placeholder="Pegá acá los números y al lado el estado. Una fila por línea."
            className="resize-y rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 font-mono text-[13px] leading-relaxed text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
          />
          <span className="text-xs text-brand-muted">
            Filas detectadas: <span className="font-semibold text-brand-text">{filasContactados}</span>
          </span>
        </label>
      </section>

      {/* Submit */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-brand-muted">
          Los datos quedan registrados y los revisamos a fin del día.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Enviar reporte
        </button>
      </div>

      {feedback ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.kind === 'ok'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
              : 'border-red-500/30 bg-red-500/10 text-red-200'
          }`}
        >
          {feedback.message}
        </div>
      ) : null}
    </form>
  );
}
