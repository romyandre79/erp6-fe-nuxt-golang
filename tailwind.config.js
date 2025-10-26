/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // penting supaya sinkron dengan useColorMode()
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#ec4899',
      },
    },
  },
  plugins: [],
}
