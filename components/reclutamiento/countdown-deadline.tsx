'use client';

import { useEffect, useState } from 'react';

// Domingo 17:00 hs Argentina (UTC-3) -> 20:00 UTC.
// Este timestamp se calcula en tiempo de build/runtime; el countdown
// se actualiza cada segundo en el cliente.
const DEADLINE_ISO = '2026-06-07T17:00:00-03:00';

type Parts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function calcParts(target: number): Parts {
  const diff = target - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, expired: false };
}

const LABELS: { key: keyof Omit<Parts, 'expired'>; label: string }[] = [
  { key: 'days', label: 'Días' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Seg' },
];

export function CountdownDeadline() {
  const target = new Date(DEADLINE_ISO).getTime();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(calcParts(target));
    const id = setInterval(() => setParts(calcParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {LABELS.map((l) => {
        const value = parts ? parts[l.key] : 0;
        const pad = l.key === 'days' ? value.toString() : value.toString().padStart(2, '0');
        return (
          <div
            key={l.key}
            className="relative overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.35)] bg-[linear-gradient(160deg,rgba(212,175,55,0.18),rgba(0,0,0,0.5))] p-[1px] gold-border-glow"
          >
            <div className="rounded-[15px] bg-black/70 px-2 py-4 text-center backdrop-blur sm:px-4 sm:py-6">
              <span
                className="gold-text block font-display leading-none tracking-tight"
                style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)' }}
              >
                {parts && parts.expired ? '00' : pad}
              </span>
              <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.32em] text-brand-muted sm:text-xs">
                {l.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
