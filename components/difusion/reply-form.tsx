'use client';

import { useState } from 'react';
import { Loader2, SendHorizonal } from 'lucide-react';

export function ReplyForm({ to }: { to: string }) {
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!body.trim()) {
      return;
    }

    setSending(true);
    setStatus('');

    try {
      const res = await fetch('/api/difusion/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, body }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'No pudimos enviar la respuesta.');
      }

      setBody('');
      setStatus('Respuesta enviada. Actualizá para verla en la conversación.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Error enviando la respuesta.');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 border-t border-white/10 pt-4">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        placeholder="Responder a este contacto..."
        className="rounded-2xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
      />
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-brand-muted">Funciona mientras la conversación esté abierta en la ventana de 24 horas.</p>
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizonal className="h-4 w-4" />}
          Responder
        </button>
      </div>
      {status ? <p className="text-sm text-brand-muted">{status}</p> : null}
    </form>
  );
}