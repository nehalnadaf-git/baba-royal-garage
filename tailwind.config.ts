import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Bebas Neue", "sans-serif"],
        heading: ["var(--font-heading)", "Barlow", "sans-serif"],
        subheading: ["var(--font-subheading)", "Barlow Condensed", "sans-serif"],
        body:    ["var(--font-body)", "Inter", "sans-serif"],
        label:   ["var(--font-tech)", "Space Mono", "monospace"],
        mono:    ["var(--font-tech)", "Space Mono", "monospace"],
      },
      colors: {
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark:       "hsl(var(--primary-dark))",
          light:      "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold:    "hsl(var(--gold))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          dark:    "hsl(var(--surface-dark))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "4xl": "2rem",
        "5xl": "3rem",
      },
      boxShadow: {
        card:          "0 4px 28px rgba(0,0,0,0.07)",
        hover:         "0 10px 44px rgba(254,36,20,0.22)",
        deep:          "0 24px 64px rgba(0,0,0,0.24)",
        glass:         "0 8px 36px rgba(0,0,0,0.06)",
        "glass-hover": "0 14px 52px rgba(0,0,0,0.10), 0 0 34px rgba(254,36,20,0.14)",
        "glow-sm":     "0 0 22px rgba(254,36,20,0.12)",
        "glow-md":     "0 0 34px rgba(254,36,20,0.18)",
        "glow-lg":     "0 0 56px rgba(254,36,20,0.24)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in-up":     { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "pulse-wa":       { "0%,100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.12)" } },
        "slide-left":     { "0%": { opacity: "0", transform: "translateX(32px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        "slide-right":    { "0%": { opacity: "0", transform: "translateX(-32px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        "glow-pulse":     { "0%,100%": { boxShadow: "0 0 22px rgba(254,36,20,0.18)" }, "50%": { boxShadow: "0 0 44px rgba(254,36,20,0.36)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in-up":     "fade-in-up 0.6s ease-out forwards",
        "pulse-wa":       "pulse-wa 2.2s ease-in-out infinite",
        "slide-left":     "slide-left 0.38s cubic-bezier(0.22,1,0.36,1)",
        "slide-right":    "slide-right 0.38s cubic-bezier(0.22,1,0.36,1)",
        "glow-pulse":     "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
