/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A1C3A",
        secondary: "#C69C6D",
        navy: "#0A1C3A",
        gold: "#C69C6D",
        "gold-light": "#DEB887",
        teal: "#008080",
        "teal-light": "#20B2AA",
        gray: "#e9ecef",
        "dark-gray": "#495057",
        white: "#ffffff",
        black: "#212529",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-up": "slide-up 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
};
