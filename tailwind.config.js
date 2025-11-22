/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // penting supaya sinkron dengan useColorMode()
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      },
    },
  },
  plugins: [],
};
