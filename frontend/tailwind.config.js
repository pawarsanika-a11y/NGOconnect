/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1B1E",
        paper: "#F6FAF9",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#1F7A5C",
          50: "#EAF6F1",
          100: "#CFEBE0",
          200: "#9FD7C1",
          300: "#6FC3A2",
          400: "#3FAF83",
          500: "#1F7A5C",
          600: "#186349",
          700: "#124B37",
          800: "#0C3325",
          900: "#061A12",
        },
        accent: {
          DEFAULT: "#E8A33D",
          50: "#FDF4E4",
          100: "#FAE4BC",
          200: "#F5CD87",
          300: "#F0B65F",
          400: "#E8A33D",
          500: "#C9821F",
          600: "#9C6518",
        },
        sky: {
          DEFAULT: "#3B7EA1",
          50: "#EAF3F7",
          100: "#C7E0EB",
          500: "#3B7EA1",
          600: "#2C6482",
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
