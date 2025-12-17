/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Crimson Text', 'serif'],
        'body': ['DM Sans', 'sans-serif'],
      },
      colors: {
        'brand': {
          'primary': '#29235C',
          'secondary': '#CA9E67',
          'tertiary': '#CC2936',
          'success': '#00A878',
          'warning': '#FF8800',
          'error': '#CC2936',
        },
      },
    },
  },
  plugins: [],
}

