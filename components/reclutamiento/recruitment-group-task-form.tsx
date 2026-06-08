'use client';

import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Upload, X } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

type FormState = {
  nombre: string;
  apellido: string;
  celular: string;
  resumenVideo: string;
};

const initialState: FormState = {
  nombre: '',
  apellido: '',
  celular: '',
  resumenVideo: '',
};

const MENSAJES = 5;
const LINEAS = 3;
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

export function RecruitmentGroupTaskForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [lineas, setLineas] = useState<string[]>(() => Array(LINEAS).fill(''));
  const [mensajes, setMensajes] = useState<string[]>(() => Array(MENSAJES).fill(''));
  const [foto, setFoto] = useState('');
  const [fotoNombre, setFotoNombre] = useState('');
  const [fotoError, setFotoError] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  function updateLinea(index: number, value: string) {
    setLineas((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });
  }

  function updateMensaje(index: number, value: string) {
    setMensajes((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });
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
    setStatus('loading');
    setMessage('');

    const lineasValidas = lineas.filter((linea) => linea.trim());
    if (lineasValidas.length < 2) {
      setStatus('error');
      setMessage('Cargá al menos 2 líneas para el proyecto. La tercera es opcional.');
      return;
    }

    if (!foto) {
      setStatus('error');
      setFotoError('La foto es obligatoria.');
      setMessage('Subí tu foto para completar la entrega.');
      return;
    }

    try {
      const res = await fetch('/api/reclutamiento/grupo/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, lineas, mensajes, foto, fotoNombre }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? 'No pudimos guardar tu entrega.');
      }

      setStatus('success');
      setMessage('Entrega recibida. Quedó guardada correctamente para revisar antes de la reunión.');
      setValues(initialState);
      setLineas(Array(LINEAS).fill(''));
      setMensajes(Array(MENSAJES).fill(''));
      clearFoto();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Error inesperado. Intentá de nuevo.');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[rgba(212,175,55,0.35)] bg-black/45 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-gold" />
        <h4 className="mt-4 font-display text-3xl uppercase tracking-[0.02em] text-brand-text">
          Entrega recibida
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Tarea para hoy</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-text">Entrega obligatoria antes de las 11:00 hs</h2>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">
          Completá este formulario antes de hoy a las 11:00 hs Argentina. La reunión del grupo es a las 12:00 hs, y vamos a revisar estas entregas antes de entrar.
        </p>
      </section>

      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Datos personales</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" value={values.nombre} onChange={(value) => update('nombre', value)} autoComplete="given-name" />
          <Field label="Apellido" value={values.apellido} onChange={(value) => update('apellido', value)} autoComplete="family-name" />
          <div className="sm:col-span-2">
            <Field label="Celular personal" value={values.celular} onChange={(value) => update('celular', value)} autoComplete="tel" placeholder="+54 9 11..." />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Líneas del proyecto</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-text">Cargá 2 o 3 números</h2>
        <p className="mt-2 text-sm text-brand-muted">
          Línea 1 y Línea 2 son obligatorias. Línea 3 es opcional si ya tenés una tercera disponible.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {lineas.map((value, index) => (
            <Field
              key={`linea-${index}`}
              label={`Línea ${index + 1}${index === 2 ? ' (opcional)' : ''}`}
              value={value}
              onChange={(nextValue) => updateLinea(index, nextValue)}
              required={index < 2}
              placeholder="+54 9 11..."
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Prospección</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-text">5 mensajes de apertura</h2>
        <p className="mt-2 text-sm text-brand-muted">
          Escribí los 5 mensajes con los que vas a comenzar a prospectar la base. Tienen que estar listos para usar.
        </p>
        <div className="mt-6 grid gap-4">
          {mensajes.map((value, index) => (
            <TextArea
              key={`mensaje-${index}`}
              label={`Mensaje de apertura ${index + 1}`}
              value={value}
              onChange={(nextValue) => updateMensaje(index, nextValue)}
              rows={3}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Foto personal</p>
        {foto ? (
          <div className="mt-5 flex items-center gap-4 rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={foto} alt="Foto cargada" className="h-20 w-20 rounded-lg object-cover ring-1 ring-[rgba(212,175,55,0.3)]" />
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
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[rgba(212,175,55,0.4)] bg-black/40 px-4 py-6 text-sm text-brand-muted transition hover:border-brand-gold hover:bg-white/[0.03]"
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
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        {fotoError ? <p className="mt-2 text-xs text-red-400">{fotoError}</p> : null}
      </section>

      <section className="rounded-3xl border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur sm:p-8">
        <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">Video de capacitación</p>
        <h2 className="mt-2 text-2xl font-semibold text-brand-text">Miralo completo y resumí lo entendido</h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.22)] bg-black/60">
          <iframe
            className="aspect-video w-full"
            src="https://www.youtube.com/embed/7RUmzfEaGco"
            title="Video de capacitación del grupo de reclutamiento"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="mt-5">
          <TextArea
            label="Resumen del video: qué entendiste y qué fue lo que más te quedó"
            value={values.resumenVideo}
            onChange={(value) => update('resumenVideo', value)}
            rows={6}
          />
        </div>
      </section>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-brand-muted">
          Todos los campos son obligatorios salvo la tercera línea. La entrega queda registrada para revisión interna.
        </p>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-4 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Enviar entrega
        </button>
      </div>

      {status === 'error' && message ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {message}
        </p>
      ) : null}
    </form>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
};

function Field({ label, value, onChange, required = true, autoComplete, placeholder }: FieldProps) {
  return (
    <label className="grid gap-1.5 text-left">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
      />
    </label>
  );
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
};

function TextArea({ label, value, onChange, rows }: TextAreaProps) {
  return (
    <label className="grid gap-1.5 text-left">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand-muted">{label}</span>
      <textarea
        required
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="resize-y rounded-xl border border-[rgba(212,175,55,0.25)] bg-black/60 px-4 py-3 text-sm leading-relaxed text-brand-text outline-none transition focus:border-brand-gold focus:ring-2 focus:ring-[rgba(212,175,55,0.25)]"
      />
    </label>
  );
}