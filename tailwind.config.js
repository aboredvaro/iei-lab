const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['"Basier Circular"', 'sans-serif']
    },
    colors: {
      transparent: 'rgba(0,0,0,0)',
      orange: colors.orange,
      gray: colors.gray
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
