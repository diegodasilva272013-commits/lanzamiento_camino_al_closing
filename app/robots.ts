import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/difusion', '/api/admin', '/api/difusion'],
      },
    ],
    host: 'https://lanzamiento-camino-al-closing.vercel.app',
  };
}
