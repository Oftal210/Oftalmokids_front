/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        recoleta: ['"Recoleta"', 'Georgia', '"Times New Roman"', 'Times', 'serif'],
      },
    },
  },
  plugins: [],
}
