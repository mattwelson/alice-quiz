/** @type {import('tailwindcss').Config} */

const {theme} = require('@sanity/demo/tailwind')
const colors = require('tailwindcss/colors')
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {...theme, colors: {...colors, ...theme.colors}},
  plugins: [require('@tailwindcss/typography')],
}
