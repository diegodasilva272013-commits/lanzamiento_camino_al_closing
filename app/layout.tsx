import type { Metadata } from 'next';
import { Inter, Playfair_Display, Bebas_Neue } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

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
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Camino al Closing — 1 al 5 de junio',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} ${bebas.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
