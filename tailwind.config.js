/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444', 
          600: '#e11d48', // Stark red
          700: '#be123c',
        },
        dark: {
          bg: '#0a0a0a',
          surface: '#111111',
          surface_hover: '#1a1a1a',
          border: '#2a2a2a',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
