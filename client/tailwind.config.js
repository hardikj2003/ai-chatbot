/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        chatBgLight: "#ffffff",
        sidebarLight: "#f9fafb", 
        accentBlue: "#1a73e8", 
      },
    },
  },
  plugins: [],
};
