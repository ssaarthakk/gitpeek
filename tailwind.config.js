// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mainbg: '#0b0f14',
        surface: '#14181e',
        'text-primary': '#f0f6fc',
        'text-secondary': '#9ba3af',
      },
      animation: {
        "meteor-effect": "meteor 8s linear infinite",
      },
      keyframes: {
        meteor: {
          "0%": { 
            transform: "rotate(215deg) translateX(0)", 
            opacity: "1" 
          },
          "70%": { 
            opacity: "1" 
          },
          "100%": {
            transform: "rotate(215deg) translateX(-800px)",
            opacity: "0",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};