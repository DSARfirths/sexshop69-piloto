import type { Config } from 'tailwindcss'
export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0A1F44',
          accent: '#9B51E0',
          warn: '#FFD600',
          electric: '#00AEEF',
        }
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
} satisfies Config
