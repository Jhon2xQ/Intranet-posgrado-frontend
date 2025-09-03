/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // UNSAAC institutional red colors
        unsaac: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Success colors for payments
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Neutral grays for light mode (softer)
        neutral: {
          50: '#fafafa',
          100: '#f7f7f7',
          200: '#e8e8e8',
          300: '#d1d1d1',
          400: '#a8a8a8',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Dark header color (violet theme)
        header: {
          light: '#1e293b', // slate-800 (unchanged for light mode)
          dark: '#2e1065',  // violet-950
        },
        // Custom dark theme colors
        'dark-theme': {
          50: '#faf7ff',   // Very light violet-blue
          100: '#f3f0ff',  // Light violet-blue
          200: '#e9e5ff',  // Lighter violet-blue
          300: '#d4d1ff',  // Medium-light violet-blue
          400: '#a5a0ff',  // Medium violet-blue
          500: '#7c73ff',  // Base violet-blue
          600: '#5b52d9',  // Darker violet-blue
          700: '#4338ca',  // Dark violet-blue
          800: '#312e81',  // Very dark violet-blue
          900: '#1e1b4b',  // Darkest violet-blue
          950: '#0f0d2a',  // Ultra dark violet-blue
        },
        // Custom card colors
        'card-dark': '#1c1a42',    // Card background
        'card-border': '#1c1a50',  // Card border
        'card-hover': '#2c2867',   // Hover effects
        // Warning amber for pending states
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // Error red for failed states
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      fontFamily: {
        elegant: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
