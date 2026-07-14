/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [
    'border-red-400', 'border-red-500',
    'border-yellow-400', 'border-yellow-500',
    'border-green-400', 'border-green-500',
    'border-blue-400', 'border-blue-500',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
