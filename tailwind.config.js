/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
    screens: {
      'xs': '380px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1680px', // 👈 customized to match your desired width
    },
  },
  plugins: [],
};
