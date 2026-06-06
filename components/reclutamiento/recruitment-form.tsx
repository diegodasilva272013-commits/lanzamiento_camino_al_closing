'use client';

import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Upload, X } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

type FormState = {
  nombre: string;
  apellido: string;
  edad: string;
  whatsapp: string;
  email: string;
  porQueSetter: string;
  porQueEquipo: string;
  objetivos: string;
  experiencia: string;
  algoMas: string;
};

const initialState: FormState = {
  nombre: '',
  apellido: '',
  edad: '',
  whatsapp: '',
  email: '',
  porQueSetter: '',
  porQueEquipo: '',
  objetivos: '',
  experiencia: '',
  algoMas: '',
};

const MAX_DIMENSION = 800;
const JPEG_QUALITY = 0.82;

async function compressImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > MAX_DIMENSION) {
        height = Math.round((height * MAX_DIMENSION) / width);
        width = MAX_DIMENSION;
      } else if (height > MAX_DIMENSION) {
        width = Math.round((width * MAX_DIMENSION) / height);
        height = MAX_DIMENSION;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo procesar la imagen'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function RecruitmentForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [foto, setFoto] = useState<string>('');
  const [fotoNombre, setFotoNombre] = useState<string>('');
  const [fotoError, setFotoError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFile(file: File | undefined) {
    setFotoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFotoError('El archivo tiene que ser una imagen.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setFotoError('La imagen es muy pesada (máx. 12 MB).');
      return;
    }
    try {
      const compressed = await compressImage(file);
      setFoto(compressed);
      setFotoNombre(file.name.replace(/\.[^.]+$/, '') + '.jpg');
    } catch {
      setFotoError('No pudimos procesar la imagen. Probá con otra.');
    }
  }

  function clearFoto() {
    setFoto('');
    setFotoNombre('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!foto) {
      setStatus('error');
      setMessage('Subí una foto para completar tu postulación.');
      setFotoError('La foto es obligatoria.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/reclutamiento/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, foto, fotoNombre }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus('error');
        setMessage(data.error ?? 'No pudimos enviar tu postulación. Probá de nuevo.');
        return;
      }

      setStatus('success');
      setMessage('¡Recibimos tu postulación! Si encajás con el perfil, te vamos a contactar.');
      setValues(initialState);
      clearFoto();
    } catch {
      setStatus('error');
      setMessage('Error de conexión. Intentá de nuevo.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[rgba(212,175,55,0.35)] bg-black/40 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-gold" />
        <h4 className="mt-4 font-display text-3xl uppercase tracking-[0.02em] text-brand-text">
          ¡Postulación enviada!
        </h4>
        <p className="mt-3 font-sans text-sm leading-relaxed text-brand-muted">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" value={values.nombre} onChange={(v) => update('nombre', v)} autoComplete="given-name" />
        <Field label="Apellido" value={values.apellido} onChange={(v) => update('apellido', v)} autoComplete="family-name" />
        <Field label="Edad" type="number" value={values.edad} onChange={(v) => update('edad', v)} />
        <Field label="WhatsApp" type="tel" value={values.whatsapp} onChange={(v) => update('whatsapp', v)} autoComplete="tel" placeholder="+54 9 11..." />
        <div className="sm:col-span-2">
          <Field label="Email" type="email" value={values.email} onChange={(v) => update('email', v)} autoComplete="email" />
        </div>
      </div>

      {/* Foto */}
      <div className="grid gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">
          Foto
        </span>
        {foto ? (
          <div className="flex items-center gap-4 rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto} alt="Tu foto" className="h-20 w-20 rounded-lg object-cover ring-1 ring-[rgba(212,175,55,0.3)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-brand-text">{fotoNombre}</p>
              <p className="text-xs text-brand-muted">Lista para enviar</p>
            </div>
            <button
              type="button"
              onClick={clearFoto}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs text-brand-muted transition hover:bg-white/5"
            >
              <X className="h-3.5 w-3.5" />
              Quitar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[rgba(212,175,55,0.4)] bg-black/40 px-4 py-6 text-sm text-brand-muted transition hover:border-brand-gold hover:bg-white/[0.03]"
          >
            <Upload className="h-4 w-4 text-brand-gold" />
            Subí tu foto
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {fotoError ? <p className="text-xs text-red-400">{fotoError}</p> : null}
      </div>

      <TextArea label="¿Por qué querés ser setter?" value={values.porQueSetter} onChange={(v) => update('porQueSetter', v)} />
      <TextArea label="¿Por qué querés ser parte del equipo?" value={values.porQueEquipo} onChange={(v) => update('porQueEquipo', v)} />
      <TextArea label="¿Cuáles son tus objetivos?" value={values.objetivos} onChange={(v) => update('objetivos', v)} />
      <TextArea label="¿Tenés experiencia? Contanos" value={values.experiencia} onChange={(v) => update('experiencia', v)} />
      <TextArea label="Contanos algo que quieras que sepamos" value={values.algoMas} onChange={(v) => update('algoMas', v)} />

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-4 font-display text-base uppercase tracking-[0.18em] text-black shadow-[0_15px_40px_-10px_rgba(212,175,55,0.7)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            Enviar mi postulación
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {status === 'error' && message ? <p className="text-sm text-red-400">{message}</p> : null}

      <p className="text-xs leading-relaxed text-brand-muted">
        Al enviar tu postulación aceptás que nos contactemos con vos por los datos que dejaste.
      </p>
    </form>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
};

function Field({ label, value, onChange, type = 'text', autoComplete, placeholder }: FieldProps) {
  return (
    <label className="grid gap-1.5 text-left">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">{label}</span>
      <input
        required
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
      />
    </label>
  );
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TextArea({ label, value, onChange }: TextAreaProps) {
  return (
    <label className="grid gap-1.5 text-left">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">{label}</span>
      <textarea
        required
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm leading-relaxed text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
      />
    </label>
  );
}
