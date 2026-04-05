/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff3ed',
          100: '#ffe4d5',
          400: '#ff7733',
          500: '#ff4500', // Neon Orange
          600: '#e63e00',
          700: '#cc3700',
        },
        accent: {
          400: '#4db8ff',
          500: '#0099ff', // Electric Blue
          600: '#008ae6',
        },
        dark: {
          bg: '#050505',
          surface: '#121212',
          surface_hover: '#1e1e1e',
          border: '#2a2a2a',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px rgba(255, 69, 0, 0.5), 0 0 20px rgba(255, 69, 0, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
};
