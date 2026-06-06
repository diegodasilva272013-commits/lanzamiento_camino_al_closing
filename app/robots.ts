import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/difusion',
          '/setters',
          '/reclutamiento',
          '/api/admin',
          '/api/difusion',
          '/api/setters',
          '/api/reclutamiento',
        ],
      },
    ],
    host: 'https://lanzamiento-camino-al-closing.vercel.app',
  };
}
