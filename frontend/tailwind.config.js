/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#e9cfbaff",
        mint: "#a4ecd2ff",
        lilac: "#c8a8efff",
        blush: "#e6a1acff",
        ink: "#333333",
        sky: "#a3d9ff",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
