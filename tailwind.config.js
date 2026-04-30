/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['"Orbitron"', 'sans-serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
      colors: {
        'brand-blue': '#00d2ff',
        'brand-red': '#ff003c',
        'brand-gold': '#ffb700',
        'brand-dark': '#0a0a0f',
      }
    },
  },
  plugins: [],
}
