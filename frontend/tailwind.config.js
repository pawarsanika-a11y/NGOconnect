/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071A16",
        paper: "#F5F8F5",
        surface: "#FFFFFF",
        card: "#12352C",
        secondary: "#0D2922",
        line: "#D3E2DC",
        primary: {
          DEFAULT: "#087F5B",
          50: "#EAF3EF",
          100: "#D3E2DC",
          200: "#A7B8B2",
          300: "#2DD4BF",
          400: "#0F9D8A",
          500: "#087F5B",
          600: "#066B4C",
          700: "#05533C",
          800: "#0D2922",
          900: "#071A16",
        },
        accent: {
          DEFAULT: "#C99A3D",
          50: "#FBF4E4",
          100: "#F1DFB2",
          200: "#E6B85C",
          300: "#E6B85C",
          400: "#C99A3D",
          500: "#A97D2C",
          600: "#86621F",
        },
        sky: {
          DEFAULT: "#0F9D8A",
          50: "#E4F6F2",
          100: "#BCE9E1",
          500: "#0F9D8A",
          600: "#087F5B",
        },
        rose: {
          DEFAULT: "#C1495F",
          50: "#FBEBEE",
          100: "#F3C7CE",
          500: "#C1495F",
          600: "#9C3849",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 27, 30, 0.08)",
        card: "0 2px 12px -2px rgba(15, 27, 30, 0.10)",
        lift: "0 12px 32px -8px rgba(15, 27, 30, 0.18)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
