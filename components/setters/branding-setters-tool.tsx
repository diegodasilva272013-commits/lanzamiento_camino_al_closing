'use client';

import { useRef, useState } from 'react';

type GenerateResponse =
  | {
      ok: true;
      setterName: string;
      avatar: string | null;
      banner: string | null;
      bios: string[];
    }
  | { error: string };

export function BrandingSettersTool({ accessCode }: { accessCode?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    setterName: string;
    avatar: string | null;
    banner: string | null;
    bios: string[];
  } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError('Subi una foto del setter.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('photo', file);
      fd.append('name', name || 'Setter');
      fd.append('avatar', 'true');
      fd.append('banner', 'true');

      const url = accessCode
        ? `/api/admin/branding-setters/generate?c=${encodeURIComponent(accessCode)}`
        : '/api/admin/branding-setters/generate';

      const res = await fetch(url, { method: 'POST', body: fd });
      const data = (await res.json()) as GenerateResponse;
      if (!res.ok || 'error' in data) {
        setError('error' in data ? data.error : `HTTP ${res.status}`);
        return;
      }
      setResult({
        setterName: data.setterName,
        avatar: data.avatar,
        banner: data.banner,
        bios: data.bios,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  function downloadDataUrl(dataUrl: string, filename: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function copyText(text: string, idx: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="rounded-[1.75rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur"
      >
        <h2 className="text-lg font-semibold">1. Subi la foto del setter</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Foto que mandaron por WhatsApp. JPG o PNG, idealmente que se le vea la cara clara y de frente.
          Maximo 8 MB.
        </p>

        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
          Nombre del setter (opcional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Juan Perez"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-brand-text outline-none focus:border-brand-gold"
        />

        <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
          Foto original
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onFileChange}
          required
          className="mt-2 block w-full text-sm text-brand-muted file:mr-4 file:rounded-lg file:border-0 file:bg-brand-gold/20 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.18em] file:text-brand-gold hover:file:bg-brand-gold/30"
        />

        {preview && (
          <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="block w-full object-contain" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-brand-gold px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-brand-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Generando... (puede tardar ~60s)' : 'Generar avatar + banner'}
        </button>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}
      </form>

      {/* Result */}
      <div className="rounded-[1.75rem] border border-[rgba(212,175,55,0.18)] bg-white/5 p-6 backdrop-blur">
        <h2 className="text-lg font-semibold">2. Resultado</h2>
        {!result && !loading && (
          <p className="mt-2 text-sm text-brand-muted">
            Aca aparecen el avatar de WhatsApp, el banner para portada y 3 opciones de bio
            para copiar.
          </p>
        )}
        {loading && (
          <div className="mt-6 grid gap-4">
            <div className="h-64 animate-pulse rounded-xl bg-white/5" />
            <div className="h-40 animate-pulse rounded-xl bg-white/5" />
          </div>
        )}
        {result && (
          <div className="mt-5 grid gap-6">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Avatar WhatsApp (1:1)
              </h3>
              {result.avatar ? (
                <div className="mt-2 grid gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.avatar}
                    alt={`Avatar ${result.setterName}`}
                    className="block w-full max-w-[420px] rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      downloadDataUrl(
                        result.avatar!,
                        `avatar-${slug(result.setterName)}.png`,
                      )
                    }
                    className="w-fit rounded-lg border border-brand-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold transition hover:bg-brand-gold/10"
                  >
                    Descargar avatar
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-brand-muted">(no generado)</p>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Banner portada (3:2)
              </h3>
              {result.banner ? (
                <div className="mt-2 grid gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.banner}
                    alt={`Banner ${result.setterName}`}
                    className="block w-full rounded-xl border border-white/10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      downloadDataUrl(
                        result.banner!,
                        `banner-${slug(result.setterName)}.png`,
                      )
                    }
                    className="w-fit rounded-lg border border-brand-gold/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold transition hover:bg-brand-gold/10"
                  >
                    Descargar banner
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-brand-muted">(no generado)</p>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                Bio sugerida (elegi una)
              </h3>
              <ul className="mt-2 grid gap-2">
                {result.bios.map((bio, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/30 p-3 text-sm"
                  >
                    <span className="leading-relaxed text-brand-text">{bio}</span>
                    <button
                      type="button"
                      onClick={() => copyText(bio, i)}
                      className="shrink-0 rounded-md border border-brand-gold/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gold transition hover:bg-brand-gold/10"
                    >
                      {copiedIndex === i ? 'Copiado' : 'Copiar'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40) || 'setter';
}
