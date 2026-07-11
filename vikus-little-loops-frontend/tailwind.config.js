/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ===== Pink-forward luxury palette =====
        cream: "#FFF6F6", // pink-tinted cream
        ivory: "#FFFBFB",
        blush: {
          50: "#FFF1F3",
          100: "#FCE3E8",
          200: "#F8CDD6",
          300: "#F2B0BF",
          400: "#E88BA1",
          500: "#DC6B86", // primary rose-pink
          600: "#C5556F",
          700: "#A23F57",
        },
        rose: {
          soft: "#F7D9DF",
          gold: "#D9A6A0",
        },
        peach: "#FBE0CF",
        olive: { DEFAULT: "#94A06F", deep: "#74804F" },
        sand: "#EBDDCB",
        mauve: "#E6D6E2",
        lavender: "#E9E0F2",
        ink: { DEFAULT: "#3D2A2E", soft: "#6E575C" },
        warmgray: "#9A8C8E",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ['"Poppins"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px -22px rgba(162,63,87,0.28)",
        lift: "0 32px 70px -28px rgba(162,63,87,0.40)",
        glow: "0 0 0 4px rgba(220,107,134,0.16)",
      },
      borderRadius: {
        xl2: "26px",
        xl3: "34px",
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0) rotate(-6deg)" },
          "50%": { transform: "translateY(-22px) rotate(8deg)" },
        },
        blob: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(40px,-30px) scale(1.08)" },
        },
        spinSlow: { to: { transform: "rotate(360deg)" } },
        pulseDot: {
          "0%,100%": { opacity: "0.4", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.4)" },
        },
      },
      animation: {
        float: "float 14s ease-in-out infinite",
        blob: "blob 20s ease-in-out infinite",
        "spin-slow": "spinSlow 24s linear infinite",
        "pulse-dot": "pulseDot 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
