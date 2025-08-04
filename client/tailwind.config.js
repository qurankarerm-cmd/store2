/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Cairo', 'Noto Kufi Arabic', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
        clay: {
          50: '#fdfcf1',
          100: '#f8f5e0',
          200: '#f0e9c0',
          300: '#e6d896',
          400: '#dac468',
          500: '#d1b146',
          600: '#c19a3a',
          700: '#a07c31',
          800: '#85652e',
          900: '#70542a',
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
      }
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
  variants: {
    extend: {},
  },
}