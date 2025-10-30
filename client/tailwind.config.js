/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary - Financial Trust & Growth (Teal/Cyan)
        primary: {
          50: "#f0fdfa", // Very light teal
          100: "#ccfbf1", // Light teal
          200: "#99f6e4", // Lighter teal
          300: "#5eead4", // Light cyan
          400: "#2dd4bf", // Cyan
          500: "#14b8a6", // Main primary - teal
          600: "#0d9488", // Dark teal
          700: "#0f766e", // Darker teal
          800: "#115e59", // Deep teal
          900: "#134e4a", // Deepest teal
          950: "#042f2e", // Almost black teal
          DEFAULT: "#14b8a6",
        },
        // Secondary - Professional Navy
        secondary: {
          50: "#f8fafc", // Off white
          100: "#f1f5f9", // Very light gray-blue
          200: "#e2e8f0", // Light gray-blue
          300: "#cbd5e1", // Gray-blue
          400: "#94a3b8", // Medium gray-blue
          500: "#64748b", // Slate
          600: "#475569", // Dark slate
          700: "#334155", // Darker slate
          800: "#1e293b", // Navy
          900: "#0f172a", // Deep navy
          950: "#020617", // Almost black
          DEFAULT: "#1e293b",
        },
        // Success - Financial Growth (Green)
        success: {
          50: "#f0fdf4", // Very light green
          100: "#dcfce7", // Light green
          200: "#bbf7d0", // Lighter green
          300: "#86efac", // Light success
          400: "#4ade80", // Success green
          500: "#22c55e", // Main success
          600: "#16a34a", // Dark success
          700: "#15803d", // Darker success
          800: "#166534", // Deep success
          900: "#14532d", // Deepest success
          950: "#052e16", // Almost black green
          DEFAULT: "#22c55e",
        },
        // Warning - Budget Alerts (Amber)
        warning: {
          50: "#fffbeb", // Very light amber
          100: "#fef3c7", // Light amber
          200: "#fde68a", // Lighter amber
          300: "#fcd34d", // Light warning
          400: "#fbbf24", // Warning yellow
          500: "#f59e0b", // Main warning
          600: "#d97706", // Dark warning
          700: "#b45309", // Darker warning
          800: "#92400e", // Deep warning
          900: "#78350f", // Deepest warning
          950: "#451a03", // Almost black amber
          DEFAULT: "#f59e0b",
        },
        // Danger - Overspending (Red)
        danger: {
          50: "#fef2f2", // Very light red
          100: "#fee2e2", // Light red
          200: "#fecaca", // Lighter red
          300: "#fca5a5", // Light danger
          400: "#f87171", // Danger red
          500: "#ef4444", // Main danger
          600: "#dc2626", // Dark danger
          700: "#b91c1c", // Darker danger
          800: "#991b1b", // Deep danger
          900: "#7f1d1d", // Deepest danger
          950: "#450a0a", // Almost black red
          DEFAULT: "#ef4444",
        },
        // Accent - AI Assistant (Purple)
        accent: {
          50: "#faf5ff", // Very light purple
          100: "#f3e8ff", // Light purple
          200: "#e9d5ff", // Lighter purple
          300: "#d8b4fe", // Light accent
          400: "#c084fc", // Accent purple
          500: "#a855f7", // Main accent
          600: "#9333ea", // Dark accent
          700: "#7e22ce", // Darker accent
          800: "#6b21a8", // Deep accent
          900: "#581c87", // Deepest accent
          950: "#3b0764", // Almost black purple
          DEFAULT: "#a855f7",
        },
        // Info - Neutral Information (Blue)
        info: {
          50: "#eff6ff", // Very light blue
          100: "#dbeafe", // Light blue
          200: "#bfdbfe", // Lighter blue
          300: "#93c5fd", // Light info
          400: "#60a5fa", // Info blue
          500: "#3b82f6", // Main info
          600: "#2563eb", // Dark info
          700: "#1d4ed8", // Darker info
          800: "#1e40af", // Deep info
          900: "#1e3a8a", // Deepest info
          950: "#172554", // Almost black blue
          DEFAULT: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
