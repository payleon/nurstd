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
            d: "path('M3,11.5 C5,10.5 7,12.5 9,11 C11,9.5 13,11.5 15,10 C17,8.8 19,10.5 21,11 L21,12.5 L3,12.5 Z')",
          },
          "20%": {
            d: "path('M3,10.5 C5,11.5 7,10 9,12 C11,13.5 13,11 15,12 C17,13 19,11 21,10.5 L21,12.5 L3,12.5 Z')",
          },
          "40%": {
            d: "path('M3,11 C5,12.5 7,11.5 9,10 C11,9 13,12 15,11 C17,10 19,12 21,11 L21,12.5 L3,12.5 Z')",
          },
          "60%": {
            d: "path('M3,10 C5,9.5 7,11 9,12 C11,13 13,10.5 15,12 C17,13.5 19,11 21,10 L21,12.5 L3,12.5 Z')",
          },
          "80%": {
            d: "path('M3,10.5 C5,12 7,13 9,11 C11,9.5 13,10.5 15,12 C17,13 19,10.5 21,10 L21,12.5 L3,12.5 Z')",
          },
          "100%": {
            d: "path('M3,11.5 C5,10.5 7,12.5 9,11 C11,9.5 13,11.5 15,10 C17,8.8 19,10.5 21,11 L21,12.5 L3,12.5 Z')",
          },
        },
        "liquid-wave-2": {
          "0%": {
            d: "path('M3,12 C5,11.5 7,13 9,12 C11,11 13,12 15,11.5 C17,11 19,12 21,11.5 L21,13 L3,13 Z')",
          },
          "30%": {
            d: "path('M3,11.5 C5,12.5 7,11.5 9,12.5 C11,13.5 13,12 15,13 C17,14 19,12.5 21,11.5 L21,13 L3,13 Z')",
          },
          "60%": {
            d: "path('M3,12.5 C5,11.5 7,12 9,13 C11,14 13,11.5 15,12.5 C17,13.5 19,11.5 21,12 L21,13 L3,13 Z')",
          },
          "100%": {
            d: "path('M3,12 C5,11.5 7,13 9,12 C11,11 13,12 15,11.5 C17,11 19,12 21,11.5 L21,13 L3,13 Z')",
          },
        },
        "liquid-body": {
          "0%": {
            d: "path('M4,20 L4,12 C5.5,11.5 7,13 8.5,12.5 C11,11.8 13.5,11.2 15,11.8 C17,12.5 19,11.8 20,11.8 L20,20 L4,20 Z')",
          },
          "25%": {
            d: "path('M4,20 L4,12.5 C5.5,11.8 7,13.5 8.5,12.8 C11,11.5 13.5,10.8 15,11.5 C17,12.2 19,11.3 20,12.2 L20,20 L4,20 Z')",
          },
          "50%": {
            d: "path('M4,20 L4,11.5 C5.5,12.2 7,11.5 8.5,13 C11,13.8 13.5,12.2 15,12.8 C17,13.5 19,12.5 20,11.5 L20,20 L4,20 Z')",
          },
          "75%": {
            d: "path('M4,20 L4,12.2 C5.5,13 7,12.5 8.5,11.8 C11,11 13.5,13 15,12 C17,11.3 19,12.8 20,13 L20,20 L4,20 Z')",
          },
          "100%": {
            d: "path('M4,20 L4,12 C5.5,11.5 7,13 8.5,12.5 C11,11.8 13.5,11.2 15,11.8 C17,12.5 19,11.8 20,11.8 L20,20 L4,20 Z')",
          },
        },
        "reflection": {
          "0%": {
            d: "path('M6,14 L8,13.5 C9,14 10,15 11,14.5 C12,14 13,15 14,14.5 L15,15 L6,15.5 Z')",
            opacity: "0.3",
          },
          "50%": {
            d: "path('M6,14.5 L8,14 C9,15 10,14 11,15 C12,15.5 13,14.5 14,15 L15,15.5 L6,16 Z')",
            opacity: "0.4",
          },
          "100%": {
            d: "path('M6,14 L8,13.5 C9,14 10,15 11,14.5 C12,14 13,15 14,14.5 L15,15 L6,15.5 Z')",
            opacity: "0.3",
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
        "liquid": "liquid-wave 4s ease-in-out infinite",
        "liquid-2": "liquid-wave-2 3.5s ease-in-out infinite",
        "liquid-body": "liquid-body 4s ease-in-out infinite",
        "reflection": "reflection 4s ease-in-out infinite",
        "bubble-1": "bubble-float-1 4s ease-in-out infinite",
        "bubble-2": "bubble-float-2 4.5s ease-in-out infinite 0.5s",
        "bubble-3": "bubble-float-3 3.7s ease-in-out infinite 1s",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
