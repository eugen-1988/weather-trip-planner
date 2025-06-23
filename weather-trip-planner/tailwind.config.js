// tailwind.config.js
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        prata: ['"Prata"', "serif"],
        outfit: ['"Outfit"', "sans-serif"],
      },
      animation: {
        "gradient-x": "gradient-x 6s ease infinite",
        "bounce-slow": "bounce-slow 2.5s infinite",
        "soft-gradient": "softGradient 15s ease infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8%)" },
        },
        softGradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundSize: {
        "gradient-x": "200% 200%",
      },
    },
  },
  plugins: [],
};
