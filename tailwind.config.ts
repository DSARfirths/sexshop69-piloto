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
        background: '#ffffff',
        foreground: '#111827',
        brand: {
          primary: '#ec4899',
          secondary: '#7c3aed',
          accent: '#ec4899',
          highlight: '#7c3aed'
        }
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    },
  },
  plugins: [],
} satisfies Config
