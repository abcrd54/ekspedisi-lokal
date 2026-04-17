import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{vue,ts}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        border: "hsl(214 20% 88%)",
        input: "hsl(214 26% 92%)",
        ring: "hsl(210 71% 32%)",
        background: "hsl(210 33% 97%)",
        foreground: "hsl(222 47% 11%)",
        primary: {
          DEFAULT: "hsl(210 71% 25%)",
          foreground: "hsl(210 40% 98%)"
        },
        secondary: {
          DEFAULT: "hsl(34 95% 46%)",
          foreground: "hsl(32 100% 96%)"
        },
        muted: {
          DEFAULT: "hsl(210 28% 92%)",
          foreground: "hsl(215 16% 42%)"
        },
        accent: {
          DEFAULT: "hsl(213 100% 93%)",
          foreground: "hsl(210 71% 25%)"
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(222 47% 11%)"
        },
        success: {
          DEFAULT: "hsl(164 94% 24%)",
          foreground: "hsl(161 94% 96%)"
        },
        warning: {
          DEFAULT: "hsl(32 95% 44%)",
          foreground: "hsl(48 100% 96%)"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem"
      },
      boxShadow: {
        ambient: "0 24px 60px rgba(15, 23, 42, 0.10)"
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"]
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(96,165,250,0.24), transparent 28%), radial-gradient(circle at right, rgba(251,191,36,0.18), transparent 24%)"
      }
    }
  },
  plugins: []
} satisfies Config;
