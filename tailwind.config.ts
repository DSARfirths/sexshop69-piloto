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
        sans: ['"Jost"', ...defaultTheme.fontFamily.sans],
        brand: ['"Jost"', ...defaultTheme.fontFamily.sans],
        heading: ['var(--font-heading)', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        background: '#ffffff',
        foreground: '#050505',
        muted: {
          DEFAULT: '#5d5b66',
          foreground: '#5d5b66',
        },
        brand: {
          DEFAULT: '#ff2193',
          black: '#000000',
          white: '#ffffff',
          pink: '#ff2193',
          femme: '#ff2193',
          homme: '#1151bb',
          couple: '#0098d5',
        },
        accent: {
          femme: '#ff2193',
          homme: '#1151bb',
          couple: '#0098d5',
        },
        surface: {
          DEFAULT: '#ffffff',
          soft: '#f5f7fb',
          glass: 'rgba(10,10,12,0.7)',
        },
        outline: {
          DEFAULT: 'rgba(0,0,0,0.08)',
        },
        neutral: {
          950: '#050505',
          900: '#111013',
          800: '#1f1d24',
          700: '#34323d',
          500: '#5d5b66',
          300: '#d5d5da',
          200: '#e8e8ec',
          100: '#f5f7fb',
          50: '#fafbff',
        },
      },
      boxShadow: {
        'brand-soft': '0 30px 60px rgba(15,17,32,0.12)',
        'brand-strong': '0 40px 80px rgba(0,0,0,0.45)',
      },
      borderRadius: {
        pill: '999px',
        mega: '32px',
        'mega-lg': '36px',
      },
      spacing: {
        nav: '72px',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.2, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
