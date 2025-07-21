import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#faf8f5",
          100: "#f5f0e8",
          200: "#e8dcc6",
          300: "#d4c0a1",
          400: "#c4a882",
          500: "#b8956b",
          600: "#a8845f",
          700: "#8b6d4f",
          800: "#715a44",
          900: "#5c4a39",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#faf9f7",
          100: "#f2ede5",
          200: "#e6d7c3",
          300: "#d5bc9a",
          400: "#c49d6f",
          500: "#b8845f",
          600: "#a66f4e",
          700: "#8a5a42",
          800: "#704a39",
          900: "#5c3d30",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: "#f9f7f4",
          100: "#f0ebe2",
          200: "#dfd2c0",
          300: "#cab399",
          400: "#b59474",
          500: "#a67c5a",
          600: "#99704f",
          700: "#7f5d43",
          800: "#684d39",
          900: "#554030",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        arabic: ["Amiri"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
