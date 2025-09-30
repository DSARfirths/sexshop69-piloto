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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: {
          foreground: 'var(--muted-foreground)',
          subtle: 'var(--subtle-foreground)'
        },
        surface: {
          DEFAULT: 'var(--surface)',
          strong: 'var(--surface-strong)'
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)'
        },
        brand: {
          DEFAULT: '#DA469A',
          pink: '#DA469A',
          violet: '#624EA9',
          blue: '#2551B6'
        },
        neutral: {
          950: '#05000F',
          900: '#0B021B',
          800: '#170629',
          700: '#26123B',
          300: '#B8AADC',
          200: '#CBBDF5',
          50: '#F7F2FF'
        }
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
} satisfies Config
