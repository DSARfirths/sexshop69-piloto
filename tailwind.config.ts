import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        brand: {
          primary: '#0A1F44',
          accent: '#9B51E0',
          warn: '#FFD600',
          electric: '#00AEEF',
        },
        night: {
          background: '#05000f',
          foreground: '#f7f2ff',
          muted: '#cbbdf5',
          subtle: '#a99eda',
          surface: '#1a062b',
          'surface-strong': '#170629',
          border: 'rgba(219, 196, 255, 0.25)',
          'border-strong': 'rgba(236, 208, 255, 0.45)'
        }
      },
      backgroundImage: {
        'night-radial':
          'radial-gradient(circle at 15% 15%, rgba(236,72,153,0.28), transparent 55%), radial-gradient(circle at 85% 20%, rgba(56,189,248,0.18), transparent 50%), linear-gradient(135deg, #05000f 0%, #0d0121 45%, #1a0235 100%)'
      },
      boxShadow: {
        'neon-sm': '0 18px 35px -16px rgba(236,72,153,0.45), 0 8px 24px -12px rgba(59,130,246,0.35)',
        neon: '0 35px 60px -25px rgba(168,85,247,0.55), 0 0 45px rgba(236,72,153,0.35)'
      },
      dropShadow: {
        neon: '0 0 12px rgba(236,72,153,0.55)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
} satisfies Config
