'use client';

import { useMemo, useState } from 'react';
import { Loader2, Send, UploadCloud } from 'lucide-react';

type PreparedContact = {
  rowNumber: number;
  contactId: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  tags: string[];
};

type PreparedCampaignResult = {
  contacts: PreparedContact[];
  summary: {
    totalRows: number;
    accepted: number;
    invalidPhone: number;
    excludedByTag: number;
    duplicates: number;
    truncated: number;
  };
};

type SendResult = {
  contactId: string;
  phone: string;
  ok: boolean;
  sid?: string;
  error?: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export function CampaignConsole({ defaultTemplateSid }: { defaultTemplateSid: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [limit, setLimit] = useState(1000);
  const [batchSize, setBatchSize] = useState(10);
  const [pauseMs, setPauseMs] = useState(800);
  const [templateSid, setTemplateSid] = useState(defaultTemplateSid);
  const [preparing, setPreparing] = useState(false);
  const [sending, setSending] = useState(false);
  const [prepared, setPrepared] = useState<PreparedCampaignResult | null>(null);
  const [sendResults, setSendResults] = useState<SendResult[]>([]);
  const [status, setStatus] = useState('');

  const progress = useMemo(() => {
    const total = prepared?.contacts.length ?? 0;
    const sent = sendResults.length;
    const ok = sendResults.filter((item) => item.ok).length;
    return { total, sent, ok };
  }, [prepared, sendResults]);

  async function prepareCampaign() {
    if (!file) {
      setStatus('Elegí primero el CSV.');
      return;
    }

    setPreparing(true);
    setStatus('');
    setSendResults([]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('limit', String(limit));

      const res = await fetch('/api/difusion/prepare', {
        method: 'POST',
        body: formData,
      });

      const data = (await res.json()) as PreparedCampaignResult & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? 'No pudimos preparar la campaña.');
      }

      setPrepared(data);
      setStatus(`Base lista: ${data.summary.accepted} contactos preparados para envío.`);
    } catch (error) {
      setPrepared(null);
      setStatus(error instanceof Error ? error.message : 'Error preparando la campaña.');
    } finally {
      setPreparing(false);
    }
  }

  async function sendCampaign() {
    if (!prepared || prepared.contacts.length === 0) {
      setStatus('No hay contactos preparados para enviar.');
      return;
    }

    setSending(true);
    setStatus('Envío en curso. Mantené esta pestaña abierta hasta terminar.');
    setSendResults([]);

    try {
      for (const contactsChunk of chunk(prepared.contacts, Math.max(1, batchSize))) {
        const res = await fetch('/api/difusion/send-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contacts: contactsChunk, templateSid }),
        });

        const data = (await res.json()) as { results?: SendResult[]; error?: string };
        const batchResults = data.results;
        if (!res.ok || !batchResults) {
          throw new Error(data.error ?? 'Falló un lote del envío.');
        }

        setSendResults((previous) => [...previous, ...batchResults]);
        if (pauseMs > 0) {
          await sleep(pauseMs);
        }
      }

      setStatus('Campaña terminada. Revisá el historial y las respuestas entrantes abajo.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Error enviando la campaña.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Campañas masivas</p>
          <h2 className="mt-2 text-2xl font-semibold text-brand-text">Preparar CSV y enviar por lotes</h2>
        </div>
        <p className="max-w-xl text-sm text-brand-muted">
          El panel prepara la base, deduplica teléfonos, excluye tags conflictivos y envía en lotes chicos para evitar picos bruscos.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
          <label className="grid gap-1.5 text-left">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
              Archivo CSV
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text file:mr-4 file:rounded-full file:border-0 file:bg-brand-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FieldNumber label="Tope de contactos" value={limit} onChange={setLimit} min={1} max={5000} />
            <FieldNumber label="Tamaño del lote" value={batchSize} onChange={setBatchSize} min={1} max={25} />
            <FieldNumber label="Pausa entre lotes (ms)" value={pauseMs} onChange={setPauseMs} min={0} max={10000} />
            <label className="grid gap-1.5 text-left">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
                Template SID
              </span>
              <input
                value={templateSid}
                onChange={(event) => setTemplateSid(event.target.value)}
                className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={prepareCampaign}
              disabled={preparing || sending}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(212,175,55,0.35)] px-5 py-3 text-sm font-semibold text-brand-text transition hover:bg-[rgba(212,175,55,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {preparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              Preparar base
            </button>

            <button
              type="button"
              onClick={sendCampaign}
              disabled={sending || preparing || !prepared || prepared.contacts.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Enviar campaña
            </button>
          </div>

          {status ? <p className="text-sm text-brand-muted">{status}</p> : null}
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-brand-muted">
          <SummaryRow label="Filas en CSV" value={prepared?.summary.totalRows ?? 0} />
          <SummaryRow label="Listos para enviar" value={prepared?.summary.accepted ?? 0} />
          <SummaryRow label="Teléfonos inválidos" value={prepared?.summary.invalidPhone ?? 0} />
          <SummaryRow label="Excluidos por tag" value={prepared?.summary.excludedByTag ?? 0} />
          <SummaryRow label="Duplicados" value={prepared?.summary.duplicates ?? 0} />
          <SummaryRow label="Fuera del tope" value={prepared?.summary.truncated ?? 0} />
          <SummaryRow label="Mensajes ya procesados" value={progress.sent} />
          <SummaryRow label="Entregados a Twilio" value={progress.ok} />
        </div>
      </div>

      {prepared ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-gold">
              Vista previa de la base
            </h3>
            <div className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-brand-muted">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Teléfono</th>
                    <th className="px-4 py-3">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-brand-text">
                  {prepared.contacts.slice(0, 50).map((contact) => (
                    <tr key={contact.contactId}>
                      <td className="px-4 py-3">{contact.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{contact.phone}</td>
                      <td className="px-4 py-3 text-brand-muted">{contact.email || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-gold">
              Resultado del envío
            </h3>
            <div className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="bg-white/5 text-brand-muted">
                  <tr>
                    <th className="px-4 py-3">Teléfono</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-brand-text">
                  {sendResults.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-brand-muted">
                        Cuando envíes la campaña, acá vas a ver cada resultado lote por lote.
                      </td>
                    </tr>
                  ) : (
                    sendResults.map((result) => (
                      <tr key={`${result.contactId}-${result.phone}`}>
                        <td className="px-4 py-3 font-mono text-xs">{result.phone}</td>
                        <td className="px-4 py-3">
                          <span className={result.ok ? 'text-emerald-400' : 'text-red-400'}>
                            {result.ok ? 'OK' : 'Error'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-brand-muted">{result.sid ?? result.error ?? '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FieldNumber(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1.5 text-left">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
        {props.label}
      </span>
      <input
        type="number"
        min={props.min}
        max={props.max}
        value={props.value}
        onChange={(event) => props.onChange(Number(event.target.value))}
        className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
      />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <span>{label}</span>
      <span className="text-base font-semibold text-brand-text">{value}</span>
    </div>
  );
}