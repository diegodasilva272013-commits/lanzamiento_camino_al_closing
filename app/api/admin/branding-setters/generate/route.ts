import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, isAdminSession } from '@/lib/admin-auth';
import { editImageWithOpenAI, getOpenAIKey } from '@/lib/openai-image';

export const runtime = 'nodejs';
// La llamada a OpenAI puede tardar hasta ~60s por imagen.
export const maxDuration = 300;

/**
 * Devuelve true si la request tiene permiso de admin: cookie valida o
 * query/header con el codigo BRANDING_ACCESS_CODE (mismo patron que /setters).
 */
function isAuthorized(req: Request): boolean {
  const adminCookie = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (isAdminSession(adminCookie)) return true;

  const expected = process.env.BRANDING_ACCESS_CODE;
  if (!expected) return true; // modo dev/setup

  const url = new URL(req.url);
  const fromQuery = url.searchParams.get('c');
  const fromHeader = req.headers.get('x-branding-code');
  return fromQuery === expected || fromHeader === expected;
}

/**
 * Prompts en ingles porque gpt-image-1 los respeta mejor que en castellano.
 * Pensados para preservar identidad facial (input_fidelity:high lo refuerza).
 */
function buildAvatarPrompt(setterName: string): string {
  return [
    `Editorial WhatsApp profile photo for "${setterName}", a professional sales setter.`,
    "Keep the person's exact face, identity, skin tone, hair, age, and facial features 100% identical to the input image — DO NOT alter the face in any way.",
    'Replace clothing with a sharp, modern professional outfit (tailored blazer or crisp shirt) in a color and style that flatters this specific person.',
    'Premium dark studio background (deep black) with a soft warm golden rim light accent.',
    'Cinematic soft lighting, head-and-shoulders portrait, sharp focus on the face, shallow depth of field.',
    'Aesthetic: luxury high-ticket sales executive, modern, confident, trustworthy.',
    'NO text, NO logos, NO watermarks in the image.',
    'Square 1:1 composition, face centered.',
  ].join(' ');
}

function buildBannerPrompt(setterName: string): string {
  return [
    `Cinematic landscape banner image featuring "${setterName}", a professional sales setter.`,
    "Keep the person's exact face, identity, skin tone, hair, age, and facial features 100% identical to the input image — DO NOT alter the face in any way.",
    'Person framed on the LEFT third of the frame, three-quarter body, sharp tailored professional outfit, confident posture, slight smile.',
    'Background: premium dark gradient (deep black to charcoal) with elegant golden accent lighting (#d4af37) on the right side. Modern luxury sales atmosphere.',
    'Right two-thirds of the frame should be relatively empty (just gradient and bokeh light) so the brand "Camino al Closing" wordmark can be overlaid later.',
    'NO text, NO logos, NO watermarks in the image.',
    'Landscape 3:2 composition.',
  ].join(' ');
}

/**
 * 3 opciones de bio profesional general para WhatsApp Business / estado.
 * Las devolvemos siempre las mismas — el usuario las copia y elige.
 */
const BIO_OPTIONS = [
  'Setter en Camino al Closing · Te ayudo a agendar tu sesion estrategica con nuestros closers. Disponible 9 a 21h.',
  'Camino al Closing | Equipo comercial. Coordino tu llamada con el closer asignado. Respondo rapido.',
  'Setter oficial — Camino al Closing. Te contacto para coordinar tu sesion 1 a 1. Pedi tu horario por aca.',
];

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  if (!getOpenAIKey()) {
    return NextResponse.json(
      {
        error:
          'Falta la API key de OpenAI. Configura la variable `api_open_ai` en Vercel y volve a probar.',
      },
      { status: 500 },
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Body invalido, esperaba multipart/form-data' }, { status: 400 });
  }

  const photo = formData.get('photo');
  const setterName = String(formData.get('name') ?? 'Setter').trim() || 'Setter';
  const wantAvatar = formData.get('avatar') !== 'false';
  const wantBanner = formData.get('banner') !== 'false';

  if (!(photo instanceof Blob) || photo.size === 0) {
    return NextResponse.json({ error: 'Falta la foto del setter (campo `photo`).' }, { status: 400 });
  }

  // OpenAI limita el tamaño del archivo de entrada (~25 MB en gpt-image-1, pero
  // mejor cortar antes para latencia). Si es >8 MB, devolvemos error claro.
  if (photo.size > 8 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'La foto pesa mas de 8 MB. Mandala mas chica (idealmente <2 MB).' },
      { status: 400 },
    );
  }

  const tasks: Array<Promise<{ kind: 'avatar' | 'banner'; dataUrl: string }>> = [];

  if (wantAvatar) {
    tasks.push(
      editImageWithOpenAI(photo, buildAvatarPrompt(setterName), '1024x1024').then((r) => ({
        kind: 'avatar' as const,
        dataUrl: r.dataUrl,
      })),
    );
  }
  if (wantBanner) {
    tasks.push(
      editImageWithOpenAI(photo, buildBannerPrompt(setterName), '1536x1024').then((r) => ({
        kind: 'banner' as const,
        dataUrl: r.dataUrl,
      })),
    );
  }

  if (tasks.length === 0) {
    return NextResponse.json({ error: 'Tenes que pedir al menos avatar o banner.' }, { status: 400 });
  }

  try {
    const results = await Promise.all(tasks);
    const avatar = results.find((r) => r.kind === 'avatar')?.dataUrl ?? null;
    const banner = results.find((r) => r.kind === 'banner')?.dataUrl ?? null;

    return NextResponse.json({
      ok: true,
      setterName,
      avatar,
      banner,
      bios: BIO_OPTIONS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[branding-setters/generate] error:', message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
