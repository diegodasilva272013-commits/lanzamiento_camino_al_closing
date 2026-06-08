import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/difusion',
          '/email-marketing',
          '/setters',
          '/reclutamiento',
          '/grupo-reclutamiento',
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
