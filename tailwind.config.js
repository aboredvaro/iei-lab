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
      white: colors.white,
      indigo: colors.indigo,
      rose: colors.rose,
      emerald: colors.emerald,
      gray: colors.gray,
    },
    extend: {
      transitionDuration: {
        '0': '0ms',
        '50': '50ms',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'group-focus'],
      textColor: ['active', 'group-focus'],
    },
  },
  plugins: [],
}
