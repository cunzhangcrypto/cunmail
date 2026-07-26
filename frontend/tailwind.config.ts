import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cun: {
          50: "#eef9ff",
          100: "#d9f1ff",
          200: "#bbe7ff",
          300: "#8cd8ff",
          400: "#55c0ff",
          500: "#2ea2ff",
          600: "#1782f5",
          700: "#1069e1",
          800: "#1454b6",
          900: "#16498f",
          950: "#112d57",
        },
        neon: {
          blue: "#00d4ff",
          purple: "#a855f7",
          pink: "#ec4899",
          green: "#22c55e",
        },
        dark: {
          50: "#f7f8fa",
          100: "#eceef2",
          200: "#d5dae2",
          300: "#b0bac8",
          400: "#8494a8",
          500: "#64748b",
          600: "#4b5b70",
          700: "#3d4a5c",
          800: "#343f4e",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)" },
          "100%": { boxShadow: "0 0 10px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at top, rgba(0, 212, 255, 0.15) 0%, transparent 50%)",
        "gradient-cun":
          "linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #ec4899 100%)",
      },
      backgroundSize: {
        "grid": "24px 24px",
        "gradient-300": "300% 300%",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [typography],
} satisfies Config;
