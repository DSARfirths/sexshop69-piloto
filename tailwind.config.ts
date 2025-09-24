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
          primary: '#4C0A3D',
          accent: '#FF3FA4',
          warn: '#FF87D0',
          electric: '#FF5CC2',
        },
        night: {
          background: '#180013',
          foreground: '#ffeafd',
          muted: '#f3b5e6',
          subtle: '#e38ad1',
          surface: '#320427',
          'surface-strong': '#2a031f',
          border: 'rgba(255, 143, 214, 0.35)',
          'border-strong': 'rgba(255, 123, 209, 0.55)'
        }
      },
      backgroundImage: {
        'night-radial':
          'radial-gradient(circle at 15% 15%, rgba(255,64,160,0.4), transparent 55%), radial-gradient(circle at 85% 20%, rgba(255,92,194,0.25), transparent 50%), linear-gradient(135deg, #180013 0%, #2a0323 45%, #3c0534 100%)'
      },
      boxShadow: {
        'neon-sm': '0 18px 35px -16px rgba(255,99,199,0.5), 0 8px 24px -12px rgba(255,135,208,0.35)',
        neon: '0 35px 60px -25px rgba(255,90,190,0.6), 0 0 45px rgba(255,64,160,0.4)'
      },
      dropShadow: {
        neon: '0 0 12px rgba(255,64,160,0.6)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
} satisfies Config
