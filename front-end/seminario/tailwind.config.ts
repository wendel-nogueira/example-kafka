import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Zilla Slab", "serif"],
      },
      animation: {
        "fade-in-0.2": "fadeIn 0.2s ease-in-out",
        "fade-in-0.5": "fadeIn 0.5s ease-in-out",
        "fade-out-0.5": "fadeOut 0.5s ease-in-out",
        "fade-in-1": "fadeIn 1s ease-in-out",
        "fade-out-1": "fadeOut 1s ease-in-out",
        "fade-in-1.5": "fadeIn 1.5s ease-in-out",
        "fade-out-1.5": "fadeOut 1.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
