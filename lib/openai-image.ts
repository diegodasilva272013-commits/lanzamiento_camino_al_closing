/**
 * Wrapper minimal para llamar a la API de OpenAI Images Edit (gpt-image-1).
 *
 * Usamos `images.edit` (no `generations`) porque acepta una imagen de entrada
 * y, con `input_fidelity: "high"`, mantiene fielmente el rostro/identidad
 * de la persona en la foto original mientras cambia ropa, fondo, estilo, etc.
 *
 * Variable de entorno: `api_open_ai` (preferida, ya cargada en Vercel) o
 * `OPENAI_API_KEY` como fallback.
 */

export type ImageEditSize = '1024x1024' | '1024x1536' | '1536x1024' | 'auto';

export type ImageEditResult = {
  /** Base64 PNG sin prefijo data:. */
  b64: string;
  /** Data URL listo para usar en <img src>. */
  dataUrl: string;
};

export function getOpenAIKey(): string | null {
  return process.env.api_open_ai || process.env.OPENAI_API_KEY || null;
}

/**
 * Llama a POST https://api.openai.com/v1/images/edits con un solo archivo de
 * entrada y devuelve la primera imagen generada en base64.
 *
 * @param imageBlob Blob/File de la foto original del setter.
 * @param prompt Descripción de lo que queremos generar.
 * @param size Tamaño de salida.
 */
export async function editImageWithOpenAI(
  imageBlob: Blob,
  prompt: string,
  size: ImageEditSize = '1024x1024',
): Promise<ImageEditResult> {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    throw new Error(
      'Falta la API key de OpenAI. Definí la variable de entorno `api_open_ai` (o `OPENAI_API_KEY`).',
    );
  }

  // gpt-image-1 acepta PNG/JPG/WEBP. Renombramos a .png para que la API
  // lo procese sin problema de MIME aunque venga como image/jpeg.
  const file =
    imageBlob instanceof File
      ? imageBlob
      : new File([imageBlob], 'input.png', { type: imageBlob.type || 'image/png' });

  const form = new FormData();
  form.append('model', 'gpt-image-1');
  form.append('prompt', prompt);
  form.append('size', size);
  form.append('n', '1');
  // Clave para preservar el rostro real del setter.
  form.append('input_fidelity', 'high');
  form.append('image', file);

  const res = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `OpenAI images.edit fallo (${res.status}): ${text.slice(0, 500) || res.statusText}`,
    );
  }

  const json = (await res.json()) as {
    data?: Array<{ b64_json?: string }>;
  };

  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error('OpenAI no devolvio imagen (b64_json vacio).');
  }

  return {
    b64,
    dataUrl: `data:image/png;base64,${b64}`,
  };
}
