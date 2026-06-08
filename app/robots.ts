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
      {
        userAgent: ['facebookexternalhit', 'Facebot', 'WhatsApp', 'Twitterbot'],
        allow: '/',
      },
    ],
    host: 'https://lanzamiento-camino-al-closing.vercel.app',
  };
}
