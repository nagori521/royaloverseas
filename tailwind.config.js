/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          blue: '#0A3D91',
          navy: '#082B66',
          light: '#EAF1FF',
        },
        gold: '#D4AF37',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(10, 61, 145, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
