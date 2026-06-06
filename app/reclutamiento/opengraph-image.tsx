import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Sumate al equipo de Setters · Camino al Closing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          background:
            'radial-gradient(circle at top right, rgba(212,175,55,0.35), transparent 55%), radial-gradient(circle at bottom left, rgba(212,175,55,0.18), transparent 50%), #0a0a0a',
          color: '#f5f5f5',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: '#d4af37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 800,
              color: '#0a0a0a',
            }}
          >
            CC
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>
              Camino al Closing
            </span>
            <span
              style={{
                fontSize: 16,
                color: '#d4af37',
                letterSpacing: 6,
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              Comunidad premium de cierre
            </span>
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              padding: '12px 22px',
              borderRadius: 999,
              border: '1px solid rgba(212,175,55,0.5)',
              color: '#d4af37',
              fontSize: 18,
              letterSpacing: 4,
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Búsqueda abierta
          </div>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 60,
              fontWeight: 500,
              fontStyle: 'italic',
              color: '#f5f5f5',
              lineHeight: 1,
            }}
          >
            Estamos buscando
          </span>
          <span
            style={{
              fontSize: 220,
              fontWeight: 900,
              letterSpacing: 4,
              lineHeight: 0.9,
              marginTop: 10,
              backgroundImage:
                'linear-gradient(100deg, #b8860b 0%, #d4af37 35%, #f5d97a 55%, #d4af37 75%, #b8860b 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            SETTERS
          </span>
          <span
            style={{
              fontSize: 22,
              color: '#d4af37',
              letterSpacing: 8,
              textTransform: 'uppercase',
              marginTop: 18,
              fontWeight: 600,
            }}
          >
            Para nuestro equipo interno
          </span>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 40,
            paddingTop: 30,
            borderTop: '1px solid rgba(212,175,55,0.25)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 16, color: '#a0a0a0', letterSpacing: 5, textTransform: 'uppercase' }}>
              Tickets que vendemos
            </span>
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: '#d4af37',
                marginTop: 6,
              }}
            >
              USD 500 · USD 1.000
            </span>
          </div>

          <div style={{ display: 'flex', gap: 14 }}>
            <Pill label="Remoto" />
            <Pill label="Comisión 10%" gold />
            <Pill label="2–3 hs/día" />
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function Pill({ label, gold = false }: { label: string; gold?: boolean }) {
  return (
    <div
      style={{
        padding: '14px 24px',
        borderRadius: 999,
        border: gold ? '1px solid #d4af37' : '1px solid rgba(212,175,55,0.35)',
        background: gold ? '#d4af37' : 'rgba(255,255,255,0.04)',
        color: gold ? '#0a0a0a' : '#f5f5f5',
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 1,
      }}
    >
      {label}
    </div>
  );
}
