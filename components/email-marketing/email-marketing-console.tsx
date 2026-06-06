'use client';

import { useMemo, useState } from 'react';
import Papa from 'papaparse';
import { AlertTriangle, CheckCircle2, Download, FileUp, Filter, Mail, Search, ShieldAlert } from 'lucide-react';

type RawContact = {
  'Contact Id'?: string;
  'First Name'?: string;
  'Last Name'?: string;
  Phone?: string | number;
  Email?: string;
  'Business Name'?: string;
  Created?: string;
  'Last Activity'?: string;
  Tags?: string;
};

type Contact = {
  rowNumber: number;
  contactId: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  email: string;
  created: string;
  lastActivity: string;
  tags: string[];
  stars: number;
  status: 'usable' | 'blocked' | 'invalid';
  reasons: string[];
};

type SegmentKey = 'hot' | 'buyers' | 'reactivation' | 'clean' | 'all';

const segmentOptions: Array<{ key: SegmentKey; label: string; description: string }> = [
  { key: 'hot', label: 'Alta intención', description: '4-5 estrellas, clickers o actividad reciente, sin bloqueos.' },
  { key: 'buyers', label: 'Compradores', description: 'Compraron low ticket, ebook o producto previo.' },
  { key: 'reactivation', label: 'Reactivación', description: 'No show, cancelados o agendas caídas, filtrando rebotes.' },
  { key: 'clean', label: 'Base limpia', description: 'Todo contacto usable, sin hard bounce ni email inválido.' },
  { key: 'all', label: 'Auditoría completa', description: 'Muestra todos para revisar, incluso bloqueados.' },
];

function normalizeText(value: unknown) {
  return String(value ?? '').trim();
}

function normalizePhone(value: unknown) {
  return String(value ?? '')
    .trim()
    .replace(/\.0$/, '')
    .replace(/[^\d+]/g, '');
}

function parseTags(value: unknown) {
  return normalizeText(value)
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function starScore(tags: string[]) {
  const joined = tags.join(' ');
  const match = joined.match(/(?:lead_|b2c_|calificado\s)([1-5])_?estrellas?/);
  return match ? Number(match[1]) : 0;
}

function contactFromRow(row: RawContact, rowNumber: number, seenEmails: Set<string>): Contact {
  const firstName = normalizeText(row['First Name']);
  const lastName = normalizeText(row['Last Name']);
  const email = normalizeText(row.Email).toLowerCase();
  const phone = normalizePhone(row.Phone);
  const tags = parseTags(row.Tags);
  const reasons: string[] = [];

  if (!email || !isValidEmail(email)) reasons.push('email inválido');
  if (!phone || phone.length < 8) reasons.push('teléfono inválido');
  if (tags.includes('hard_bounced')) reasons.push('hard bounced');
  if (seenEmails.has(email)) reasons.push('duplicado');
  if (email) seenEmails.add(email);

  const blocked = reasons.some((reason) => reason === 'hard bounced' || reason === 'duplicado');
  const invalid = reasons.some((reason) => reason.includes('inválido'));

  return {
    rowNumber,
    contactId: normalizeText(row['Contact Id']) || `fila-${rowNumber}`,
    firstName,
    lastName,
    name: [firstName, lastName].filter(Boolean).join(' ') || 'Sin nombre',
    phone,
    email,
    created: normalizeText(row.Created),
    lastActivity: normalizeText(row['Last Activity']),
    tags,
    stars: starScore(tags),
    status: invalid ? 'invalid' : blocked ? 'blocked' : 'usable',
    reasons,
  };
}

function belongsToSegment(contact: Contact, segment: SegmentKey) {
  if (segment === 'all') return true;
  if (contact.status !== 'usable') return false;

  const has = (needle: string) => contact.tags.some((tag) => tag.includes(needle));

  if (segment === 'hot') {
    return contact.stars >= 4 || has('clicker') || has('actividad reciente') || has('lista activa');
  }

  if (segment === 'buyers') {
    return has('compradores') || has('comprador') || has('ebook');
  }

  if (segment === 'reactivation') {
    return has('no_show') || has('no asistio') || has('cancelado') || has('agenda_cancelada');
  }

  return contact.status === 'usable';
}

function exportCsv(contacts: Contact[]) {
  const csv = Papa.unparse(
    contacts.map((contact) => ({
      nombre: contact.firstName,
      apellido: contact.lastName,
      email: contact.email,
      telefono: contact.phone,
      estrellas: contact.stars,
      tags: contact.tags.join(', '),
      estado: contact.status,
      motivos: contact.reasons.join(', '),
    })),
  );
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'segmento-email-marketing.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function EmailMarketingConsole() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [segment, setSegment] = useState<SegmentKey>('hot');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');

  const summary = useMemo(() => {
    const usable = contacts.filter((contact) => contact.status === 'usable').length;
    const blocked = contacts.filter((contact) => contact.status === 'blocked').length;
    const invalid = contacts.filter((contact) => contact.status === 'invalid').length;
    const bounced = contacts.filter((contact) => contact.tags.includes('hard_bounced')).length;
    return { total: contacts.length, usable, blocked, invalid, bounced };
  }, [contacts]);

  const segmented = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return contacts
      .filter((contact) => belongsToSegment(contact, segment))
      .filter((contact) => {
        if (!normalizedQuery) return true;
        return `${contact.name} ${contact.email} ${contact.phone} ${contact.tags.join(' ')}`
          .toLowerCase()
          .includes(normalizedQuery);
      });
  }, [contacts, query, segment]);

  function handleFile(file: File | null) {
    if (!file) return;

    Papa.parse<RawContact>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const seenEmails = new Set<string>();
        const parsed = result.data.map((row, index) => contactFromRow(row, index + 2, seenEmails));
        setContacts(parsed);
        setStatus(`Base cargada: ${parsed.length} contactos analizados.`);
      },
      error: (error) => {
        setContacts([]);
        setStatus(error.message || 'No se pudo leer el CSV.');
      },
    });
  }

  return (
    <section className="rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-7">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">MVP operativo</p>
          <h2 className="mt-2 text-2xl font-semibold text-brand-text">Limpieza y segmentación de base</h2>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-brand-muted">
          Esta primera versión no envía emails: prepara la base, bloquea rebotes/duplicados y permite exportar segmentos para revisar antes de activar automatizaciones.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <label className="grid gap-1.5 text-left">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
              Base CSV
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
              className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text file:mr-4 file:rounded-full file:border-0 file:bg-brand-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
            />
          </label>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {segmentOptions.map((option) => {
              const active = option.key === segment;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSegment(option.key)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? 'border-brand-gold bg-brand-gold/10 text-brand-text'
                      : 'border-white/10 bg-white/5 text-brand-muted hover:border-[rgba(212,175,55,0.35)]'
                  }`}
                >
                  <span className="block text-sm font-semibold">{option.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed">{option.description}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por nombre, email, teléfono o tag"
                className="w-full rounded-full border border-[rgba(212,175,55,0.25)] bg-black/60 py-3 pl-11 pr-4 text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
              />
            </label>
            <button
              type="button"
              onClick={() => exportCsv(segmented)}
              disabled={segmented.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Exportar segmento
            </button>
          </div>

          {status ? <p className="mt-3 text-sm text-brand-muted">{status}</p> : null}
        </div>

        <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-brand-muted">
          <SummaryCard icon={FileUp} label="Total importado" value={summary.total} />
          <SummaryCard icon={CheckCircle2} label="Usables" value={summary.usable} />
          <SummaryCard icon={ShieldAlert} label="Bloqueados" value={summary.blocked} />
          <SummaryCard icon={AlertTriangle} label="Inválidos" value={summary.invalid} />
          <SummaryCard icon={Mail} label="Hard bounced" value={summary.bounced} />
          <SummaryCard icon={Filter} label="En segmento actual" value={segmented.length} highlight />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-gold">
            Vista previa del segmento
          </h3>
          <span className="text-xs text-brand-muted">Mostrando hasta 120 contactos</span>
        </div>
        <div className="mt-4 max-h-[560px] overflow-auto rounded-xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 text-brand-muted">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Estrellas</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-brand-text">
              {segmented.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-brand-muted">
                    Cargá un CSV para analizar la base y preparar segmentos.
                  </td>
                </tr>
              ) : (
                segmented.slice(0, 120).map((contact) => (
                  <tr key={`${contact.contactId}-${contact.rowNumber}`}>
                    <td className="px-4 py-3 font-medium">{contact.name}</td>
                    <td className="px-4 py-3 text-brand-muted">{contact.email || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs">{contact.phone || '—'}</td>
                    <td className="px-4 py-3">{contact.stars || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={contact.status === 'usable' ? 'text-emerald-400' : contact.status === 'blocked' ? 'text-amber-300' : 'text-red-400'}>
                        {contact.status === 'usable' ? 'usable' : contact.reasons.join(', ')}
                      </span>
                    </td>
                    <td className="max-w-[360px] px-4 py-3 text-xs text-brand-muted">
                      <span className="line-clamp-2">{contact.tags.join(', ') || '—'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof FileUp;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${highlight ? 'border-brand-gold/50 bg-brand-gold/10' : 'border-white/10 bg-white/5'}`}>
      <span className="inline-flex items-center gap-2">
        <Icon className="h-4 w-4 text-brand-gold" />
        {label}
      </span>
      <span className="text-base font-semibold text-brand-text">{value}</span>
    </div>
  );
}