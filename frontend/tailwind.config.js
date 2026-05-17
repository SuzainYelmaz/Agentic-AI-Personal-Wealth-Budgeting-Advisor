/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        stone: {
          50: '#F7F6F3', // Warm premium paper background
          100: '#EFECE6',
          200: '#E2DDD4',
          800: '#2C2B29',
          900: '#1C1B19', // Soft black for high contrast
        }
      }
    },
  },
  plugins: [],
}
