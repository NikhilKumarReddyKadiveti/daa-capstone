/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        primary: {
          50: '#eefbf3',
          100: '#d6f5e3',
          200: '#b0ebcb',
          300: '#7ddaaa',
          400: '#48c285',
          500: '#25a869',
          600: '#188754',
          700: '#146b44',
          800: '#135537',
          900: '#10452e',
          950: '#07271a'
        },
        accent: {
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7'
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 8s linear infinite'
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
