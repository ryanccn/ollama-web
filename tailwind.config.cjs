/* eslint-env node */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,ts,html}', './index.html'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
