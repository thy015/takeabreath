/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {  fontFamily: {
      lobster: ["Lobster", "cursive"],
      gryphen: ["Qwitcher Grypen"],
      poppins:['Poppins'],
      afacad:['Afacad Flux']
    }, },
  },
  plugins: [],
};
