import type { Metadata } from 'next';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand/brand-logo';

export const metadata: Metadata = {
  title: 'Tareas 9/6/2026 · Setters · Camino al Closing',
  description: 'Formulario de respuestas sobre la propuesta de entrenamiento para setters.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const questions = [
  'En tus palabras, ¿cuál es el problema real que esta propuesta busca resolver en las personas que quieren trabajar en ventas remotas?',
  '¿Por qué la propuesta insiste en que "tener ganas no alcanza"? Explícalo con un ejemplo concreto de un setter mal preparado.',
  '¿Cuál es la diferencia principal entre un curso común y esta inmersión laboral? No respondas con frases copiadas: explícalo como si se lo tuvieras que contar a un prospecto.',
  'Según la propuesta, ¿qué necesita hoy el mercado de un setter o closer para considerarlo preparado?',
  '¿Por qué "no enseñamos scripts" es un punto importante de la propuesta? ¿Qué riesgo tiene depender solo de frases memorizadas?',
  'Si un alumno te pregunta: "¿Y después de las clases qué pasa?", ¿cómo le explicarías el proceso de entrenamiento, corrección, auditoría, simulación y salida al campo?',
  '¿Qué significa trabajar uno a uno dentro de esta propuesta y por qué eso aumenta el valor percibido del programa?',
  '¿Por qué la comunicación profesional no depende solamente de lo que se dice? Mencioná al menos tres elementos que influyen en la percepción del prospecto o de una empresa.',
  '¿Qué rol cumple la mentalidad comercial dentro de esta inmersión? Explícalo por qué la técnica sola no alcanza para sostener oportunidades reales.',
  'Si tuvieras que resumir esta propuesta en una sola idea poderosa para que un prospecto la entienda, ¿cuál sería y por qué?',
];

export default function SettersTareasPage() {
  return (
    <main className="min-h-screen bg-brand-black px-4 py-10 text-brand-text sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="flex flex-col gap-6 rounded-[2.25rem] border border-[rgba(212,175,55,0.18)] bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.15),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_32px_100px_rgba(0,0,0,0.4)] sm:p-8 mb-8">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" priority />
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#d4af37]">Ejercicio del día</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                Tareas · 9/6/2026
              </h1>
            </div>
          </div>

          <div className="grid gap-3 text-sm leading-relaxed text-[#a3a3a3]">
            <p>
              Lee la propuesta completa y responde las 10 preguntas con tus propias palabras. 
              <strong className="text-brand-text block mt-2">No copies textos literales: demuestra comprensión real.</strong>
            </p>
          </div>
        </header>

        {/* Propuesta Cover */}
        <div className="mb-8 rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-[linear-gradient(135deg,rgba(212,175,55,0.08),rgba(212,175,55,0.04))] p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#d4af37]">Antes de responder</p>
          <h2 className="mt-3 text-2xl font-semibold">Abre la propuesta</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#a3a3a3]">
            Descarga o visualiza el archivo PDF de la propuesta de entrenamiento. Tenés que leerla completa para responder con fundamento.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/propuesta.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Ver propuesta (PDF)
            </Link>
          </div>
        </div>

        {/* Form */}
        <form className="rounded-[2rem] border border-[rgba(212,175,55,0.18)] bg-white/5 backdrop-blur p-6 sm:p-8 space-y-8">
          {questions.map((question, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(212,175,55,0.15)] text-xs font-semibold text-[#d4af37] flex-shrink-0">
                  {index + 1}
                </div>
                <label className="block flex-1 text-sm leading-relaxed text-brand-text font-medium">
                  {question}
                </label>
              </div>
              <textarea
                name={`question_${index + 1}`}
                rows={5}
                placeholder="Escribe tu respuesta aquí con tus propias palabras..."
                className="ml-11 w-full rounded-lg border border-[rgba(212,175,55,0.18)] bg-[#0d0d0d] px-4 py-3 text-sm text-brand-text placeholder:text-[#666666] focus:border-[rgba(212,175,55,0.45)] focus:outline-none focus:ring-1 focus:ring-[rgba(212,175,55,0.25)]"
              />
            </div>
          ))}

          {/* Submit */}
          <div className="pt-4 border-t border-[rgba(212,175,55,0.12)] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#a3a3a3] uppercase tracking-[0.16em]">
              Guarda localmente o copiar/pegar a tu entrega
            </p>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Enviar respuestas
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-[#666666] uppercase tracking-[0.16em]">
          <p>Lanzamiento · Camino al Closing</p>
        </div>
      </div>
    </main>
  );
}
