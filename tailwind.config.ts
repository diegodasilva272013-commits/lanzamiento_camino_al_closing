import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
      },
      colors: {
        brand: {
          black: '#0a0a0a',
          gold: '#d4af37',
          text: '#f5f5f5',
          muted: '#a0a0a0',
        },
      },
    },
  },
  plugins: [],
};

export default config;
