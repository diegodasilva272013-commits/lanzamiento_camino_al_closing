'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

type FormState = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
};

const initialState: FormState = {
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
};

export function RegisterForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [meetLink, setMeetLink] = useState<string>('');

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; meetLink?: string };

      if (!res.ok || !data.ok) {
        setStatus('error');
        setMessage(data.error ?? 'No pudimos completar tu registro. Probá de nuevo.');
        return;
      }

      setStatus('success');
      setMeetLink(data.meetLink ?? '');
      setMessage('Listo. Te enviamos el link de Meet a tu correo.');
      setValues(initialState);
    } catch {
      setStatus('error');
      setMessage('Error de conexión. Intentá de nuevo.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[rgba(212,175,55,0.35)] bg-black/40 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-gold" />
        <h4 className="mt-3 text-lg font-semibold text-brand-text">¡Registro confirmado!</h4>
        <p className="mt-2 text-sm text-brand-muted">{message}</p>
        {meetLink ? (
          <a
            href={meetLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Entrar al Meet
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nombre"
          name="nombre"
          autoComplete="given-name"
          value={values.nombre}
          onChange={(v) => update('nombre', v)}
        />
        <Field
          label="Apellido"
          name="apellido"
          autoComplete="family-name"
          value={values.apellido}
          onChange={(v) => update('apellido', v)}
        />
        <Field
          label="Teléfono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          value={values.telefono}
          onChange={(v) => update('telefono', v)}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(v) => update('email', v)}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            Registrarme y recibir el Meet
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {status === 'error' && message ? (
        <p className="text-sm text-red-400">{message}</p>
      ) : null}

      <p className="text-xs text-brand-muted">
        Al registrarte aceptás recibir el link del Meet y comunicaciones del lanzamiento.
      </p>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
};

function Field({ label, name, value, onChange, type = 'text', autoComplete }: FieldProps) {
  return (
    <label className="grid gap-1.5 text-left">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
        {label}
      </span>
      <input
        required
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
      />
    </label>
  );
}
