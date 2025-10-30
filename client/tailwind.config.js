/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector", // or 'media' for automatic dark mode
  theme: {
    extend: {
      colors: {
        // Badger Blue palette
        "badger-blue": {
          100: "hsl(221, 20%, 97%)", // #F6F7F9
          200: "hsl(221, 25%, 90%)", // #DFE3EC
          300: "hsl(221, 35%, 75%)", // #A9B7D6
          400: "hsl(221, 45%, 60%)", // #6B88C7
          DEFAULT: "#0b1d2a", // Primary blue
          600: "hsl(221, 60%, 22%)", // #162C5A
          700: "hsl(221, 65%, 16%)", // #0E1F43
          800: "hsl(221, 70%, 10%)", // #081329
          900: "hsl(221, 75%, 5%)", // #030916
        },
        // Badger Orange palette (bold)
        "badger-orange": {
          100: "hsl(25.2, 83%, 91%)", // #FBE5D5
          200: "hsl(25.2, 92%, 79%)", // #FBC298
          300: "hsl(35, 95%, 59%)", // #FAA634
          400: "hsl(25.2, 95.2%, 59.2%)", // #FA8734
          DEFAULT: "hsl(25.2, 90.6%, 54.1%)", // #F47920
          600: "hsl(25.2, 76.9%, 45.9%)", // #CF671B
          700: "hsl(25.2, 76.7%, 35.3%)", // #9F4F15
          800: "hsl(25.2, 77.4%, 24.3%)", // #6E360E
          900: "hsl(25.2, 76.8%, 13.5%)", // #3D1E08
        },
        // Primary colors matching Bootstrap theme
        primary: "#0b1d2a",
        bold: "hsl(25.2, 90.6%, 54.1%)",
        "badger-gray": "#939598",
        "danger-light": "#f44336",
        "info-dark": "#0097a7",
      },
      fontFamily: {
        museo: ['"MuseoSans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
