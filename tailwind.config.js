/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F7F3",
        ink: "#1B2B1E",
        fairway: {
          DEFAULT: "#2F6D4F",
          dark: "#1F4B37",
          light: "#DCEBE1",
        },
        brick: {
          DEFAULT: "#B23A2E",
          dark: "#8A2C22",
          light: "#F3DAD6",
        },
        chain: {
          DEFAULT: "#E3A73A",
          dark: "#B9822A",
        },
        line: "#D8D3C4",
      },
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
