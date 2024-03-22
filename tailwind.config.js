/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0a4f7d",
        secondory: "#F1F4F7",
        thirdOne: "#ffff",
      },
    },
  },
  plugins: [],
};
