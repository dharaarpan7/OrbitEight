import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Event Horizon" palette — brand_design_guideline.md §1,
        // mapped to shadcn CSS variables for locked-component compatibility.
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        tertiary: "#666666",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        // Surfaces
        void: "#000000",
        surface: "#0A0A0A",
        elevated: "#1A1A1A",
        ash: "#2A2A2A",
        // Accretion gradient — warm amber only, no cool tones
        "solar-flare": "#F5A623",
        "ember-gold": "#D4891A",
        "burnt-amber": "#A86214",
        "molten-bronze": "#7A4510",
        "dark-sienna": "#3D220A",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        // Type scale — brand_design_guideline.md §2
        display: ["clamp(3rem, 5vw, 5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h1: ["clamp(2.5rem, 4vw, 3.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h2: ["clamp(2rem, 3vw, 2.5rem)", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h3: ["clamp(1.5rem, 2vw, 1.75rem)", { lineHeight: "1.3" }],
      },
      maxWidth: {
        // Primary content width — websitePrompt.md layout system
        content: "1400px",
        prose: "480px",
      },
      spacing: {
        // 8px base grid — brand_design_guideline.md §4
        "18": "4.5rem",
        "22": "5.5rem",
        "28": "7rem",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
