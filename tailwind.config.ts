import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === DESIGN TOKENS ===
        bgPrimary: "#0B0B0F",
        textPrimary: "#EAEAF0",
        textSecondary: "#A1A1AA",
        accentStart: "#FF4D4D",
        accentEnd: "#FFD700",

        // Existing tokens (preserved for backward compatibility)
        background: "rgb(var(--background) / <alpha-value>)",
        "background-secondary": "rgb(var(--background-secondary) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        "foreground-secondary": "rgb(var(--foreground-secondary) / <alpha-value>)",
        "foreground-muted": "rgb(var(--foreground-muted) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "rgb(var(--secondary-foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        gold: "rgb(var(--gold) / <alpha-value>)",
        "gold-light": "rgb(var(--gold-light) / <alpha-value>)",
        "red-deep": "rgb(var(--red-deep) / <alpha-value>)",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F4C542 0%, #FFD84D 100%)',
        'red-gradient': 'linear-gradient(135deg, #C1121F 0%, #E63946 100%)',
        'maroon-gradient': 'linear-gradient(180deg, #1A0F2E 0%, #2A0D0D 100%)',
        'mystical-gradient': 'radial-gradient(ellipse at top, rgba(244, 197, 66, 0.1) 0%, #0A0A0A 50%)',
      },
      fontSize: {
        // === TYPOGRAPHY SCALE ===
        hero: ["42px", { lineHeight: "1.2", fontWeight: "500", letterSpacing: "-0.02em" }],
        heading: ["28px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.01em" }],
        subheading: ["20px", { lineHeight: "1.4", fontWeight: "500" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.5", fontWeight: "400" }],

        // Existing scales (preserved for compatibility)
        'hero-legacy': ['3rem', { lineHeight: '1.1', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h1': ['2rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '500' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'xs': ['0.75rem', { lineHeight: '1.4' }],
      },
      spacing: {
        // === SPACING SYSTEM ===
        section: "80px",
        block: "40px",
        element: "20px",
        tight: "10px",
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(244, 197, 66, 0.3)',
        'glow-gold-sm': '0 0 15px rgba(244, 197, 66, 0.2)',
        'glow-red': '0 0 30px rgba(193, 18, 31, 0.3)',
        'glow-red-sm': '0 0 15px rgba(193, 18, 31, 0.2)',
      },
    },
  },
  plugins: [],
};
export default config;