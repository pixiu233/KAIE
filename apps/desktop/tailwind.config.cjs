/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F5FA',
          100: '#DDE5F7',
          200: '#B8D0EB',
          300: '#8EBAD9',
          400: '#5CA0C4',
          500: '#3B8AB3',
          600: '#2E6F91',
          700: '#235570',
          800: '#1A3F52',
          900: '#102B38',
        },
        cream: {
          50: '#FFFAF0',
          100: '#FFF5DC',
          200: '#FFEFC8',
          300: '#FFE4A8',
          400: '#FFD680',
          500: '#FFC652',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
