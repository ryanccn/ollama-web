/* eslint-env node */
const defaultColors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{vue,ts,html}', './index.html'],
  theme: {
    colors: {
      base: 'rgba(var(--ow-base) / <alpha-value>)',
      surface: 'rgba(var(--ow-surface) / <alpha-value>)',
      overlay: 'rgba(var(--ow-overlay) / <alpha-value>)',
      accent: 'rgba(var(--ow-accent) / <alpha-value>)',
      text: 'rgba(var(--ow-text) / <alpha-value>)',
      danger: 'rgba(var(--ow-danger) / <alpha-value>)',

      transparent: defaultColors.transparent,
      white: defaultColors.white,
      black: defaultColors.black,
      neutral: defaultColors.neutral,
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
