import type { Config } from "tailwindcss";

/**
 * Tokeny wizualne zgodne z handoffem UI (doc/13, sekcja 11).
 * Czcionki ładowane przez pakiet `geist` i wystawiane jako zmienne CSS
 * (--font-geist-sans / --font-geist-mono) ustawiane w app/layout.tsx.
 */
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      colors: {
        bg: "oklch(0.985 0.003 100)",
        surface: "oklch(1 0 0)",
        "surface-2": "oklch(0.975 0.003 100)",
        border: "oklch(0.91 0.005 100)",
        "border-soft": "oklch(0.945 0.004 100)",
        ink: {
          900: "oklch(0.22 0.012 250)",
          800: "oklch(0.30 0.011 250)",
          700: "oklch(0.42 0.010 250)",
          600: "oklch(0.52 0.008 250)",
          500: "oklch(0.62 0.008 250)",
          400: "oklch(0.74 0.006 250)",
        },
        accent: {
          DEFAULT: "oklch(0.42 0.058 115)",
          soft: "oklch(0.95 0.03 115)",
          strong: "oklch(0.35 0.06 115)",
          fg: "oklch(0.99 0.005 115)",
        },
        risk: {
          "low-fg": "oklch(0.42 0.09 150)",
          "low-bg": "oklch(0.95 0.04 150)",
          "med-fg": "oklch(0.45 0.12 75)",
          "med-bg": "oklch(0.96 0.06 80)",
          "high-fg": "oklch(0.45 0.16 25)",
          "high-bg": "oklch(0.96 0.05 25)",
        },
      },
      borderRadius: {
        DEFAULT: "10px",
        lg: "14px",
        sm: "6px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(20,25,30,.04), 0 1px 1px rgba(20,25,30,.02)",
        md: "0 4px 10px -3px rgba(20,25,30,.07), 0 2px 4px -2px rgba(20,25,30,.04)",
        lg: "0 18px 40px -16px rgba(20,25,30,.12), 0 4px 10px -4px rgba(20,25,30,.06)",
      },
    },
  },
  plugins: [],
} satisfies Config;
