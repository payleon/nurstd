import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        '3': '3px',
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "flask-bubble": {
          "0%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "0.9",
          },
          "25%": {
            transform: "scale(1.05) rotate(3deg)",
            opacity: "1",
          },
          "50%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "0.9",
          },
          "75%": {
            transform: "scale(1.05) rotate(-3deg)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "0.9",
          },
        },
        "liquid-wave": {
          "0%": {
            d: "path('M3,11 C5,10.5 7,12 9,11.5 C11,11 13,10.5 15,11 C17,11.5 19,11 21,11.5 L21,12.5 L3,12.5 Z')",
          },
          "25%": {
            d: "path('M3,11 C5,10.7 7,11.8 9,11.3 C11,10.8 13,11.2 15,11.5 C17,11.8 19,10.7 21,11.2 L21,12.5 L3,12.5 Z')",
          },
          "50%": {
            d: "path('M3,11 C5,11.2 7,11.5 9,11 C11,10.5 13,11.8 15,11.3 C17,10.8 19,11.2 21,10.8 L21,12.5 L3,12.5 Z')",
          },
          "75%": {
            d: "path('M3,11 C5,11.5 7,11 9,10.8 C11,10.6 13,11.5 15,11 C17,10.5 19,11.8 21,11.3 L21,12.5 L3,12.5 Z')",
          },
          "100%": {
            d: "path('M3,11 C5,10.5 7,12 9,11.5 C11,11 13,10.5 15,11 C17,11.5 19,11 21,11.5 L21,12.5 L3,12.5 Z')",
          },
        },
        "bubble-float-1": {
          "0%": {
            transform: "translateY(0)",
            opacity: "0.6",
          },
          "50%": {
            transform: "translateY(-5px)",
            opacity: "0.8",
          },
          "100%": {
            transform: "translateY(-10px)",
            opacity: "0",
          },
        },
        "bubble-float-2": {
          "0%": {
            transform: "translateY(0)",
            opacity: "0.5",
          },
          "65%": {
            transform: "translateY(-7px)",
            opacity: "0.7",
          },
          "100%": {
            transform: "translateY(-12px)",
            opacity: "0",
          },
        },
        "bubble-float-3": {
          "0%": {
            transform: "translateY(0)",
            opacity: "0.7",
          },
          "40%": {
            transform: "translateY(-4px)",
            opacity: "0.9",
          },
          "100%": {
            transform: "translateY(-8px)",
            opacity: "0",
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "flask": "flask-bubble 3s ease-in-out infinite",
        "liquid": "liquid-wave 5s ease-in-out infinite",
        "bubble-1": "bubble-float-1 4s ease-in-out infinite",
        "bubble-2": "bubble-float-2 4.5s ease-in-out infinite 0.5s",
        "bubble-3": "bubble-float-3 3.7s ease-in-out infinite 1s",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
