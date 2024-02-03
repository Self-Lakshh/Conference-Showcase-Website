/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom premium color system
        brand: {
          navy: {
            DEFAULT: "#0B0F19",
            light: "#151C2C",
            lighter: "#1F293D",
            deep: "#05070B",
          },
          cyan: {
            DEFAULT: "#00E5FF",
            dim: "rgba(0, 229, 255, 0.15)",
            border: "rgba(0, 229, 255, 0.3)",
          },
          violet: {
            DEFAULT: "#8A2BE2",
            dim: "rgba(138, 43, 226, 0.15)",
            border: "rgba(138, 43, 226, 0.3)",
          },
          emerald: {
            DEFAULT: "#00FA9A",
            dim: "rgba(0, 250, 154, 0.15)",
            border: "rgba(0, 250, 154, 0.3)",
          },
          purple: {
            DEFAULT: "#D946EF",
            dim: "rgba(217, 70, 239, 0.15)",
          },
          orange: {
            DEFAULT: "#FF6B35",
          },
          bone: "#F4F3F0",
          ivory: "#FAF9F6",
          pearl: "#EAE6DF",
          graphite: "#1C1C1E",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-slow": "glow 8s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "reveal": "reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        glow: {
          "0%": { opacity: 0.3, filter: "blur(40px)" },
          "100%": { opacity: 0.6, filter: "blur(60px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        reveal: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        }
      }
    },
  },
  plugins: [],
}
