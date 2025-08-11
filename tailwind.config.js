// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f6feb',
        secondary: '#8957e5',
        mainbg: '#0b0f14',
        surface: '#14181e',
        'text-primary': '#f0f6fc',
        'text-secondary': '#9ba3af',
      },
    },
  },
  plugins: [heroui()],
};