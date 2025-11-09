/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emergency: {
          red: '#DC2626',
          orange: '#EA580C',
          blue: '#2563EB',
          dark: '#1F2937'
        }
      }
    },
  },
  plugins: [],
}

