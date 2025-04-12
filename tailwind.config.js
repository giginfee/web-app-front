/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: [
    "./presets/**/*.{js,vue,ts}",
    "./components/**/*.vue",
    "./pages/**/*.vue",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  safelist: [
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "hover:bg-red-600",
    "hover:bg-green-600",
    "hover:bg-yellow-600",
    "hover:bg-blue-600",
    "hover:bg-purple-600",
    "hover:bg-pink-600",
  ],
  plugins: [require("tailwindcss-primeui")],
};
