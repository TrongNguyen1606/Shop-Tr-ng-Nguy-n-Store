/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: { fuchsia: '#D946EF', cyan: '#22D3EE' },
      },
    },
  },
  plugins: [],
};
