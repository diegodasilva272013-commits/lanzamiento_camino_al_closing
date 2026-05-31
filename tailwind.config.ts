import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './constants/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
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
