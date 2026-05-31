import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://lanzamiento-camino-al-closing.vercel.app';
const title = 'Camino al Closing — Lanzamiento';
const description = 'Lanzamiento oficial con cupos limitados.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: {
    icon: '/logo_original.png',
    shortcut: '/logo_original.png',
    apple: '/logo_original.png',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Camino al Closing',
    title,
    description,
    locale: 'es_AR',
    images: [
      {
        url: '/logo_original.png',
        width: 1200,
        height: 1200,
        alt: 'Camino al Closing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/logo_original.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
