/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "Dark-Cyan": "#008A90",
        "Charleston-Green": "#222831",
        "Persian-Green": "#00A896",
        "yellow-400": "#00A896",
        "yellow-500": "#00A896",
        "orange-500": "#00A896",
        "yellow-600": "#00A896",
        //From Here
        "light-primary": "#2D3748", // Light Mode Primary Text
        secondary: "#4A5568", // Light Mode Secondary Text
        muted: "#718096", // Light Mode Muted Text
        "dark-primary": "#F8FAFC", // Dark Mode Primary Text
        "dark-secondary": "#D1D5DB", // Dark Mode Secondary Text
        "dark-muted": "#94A3B8", // Dark Mode Muted Text
        primary: {
          500: "#1A365D", // Main Brand
          400: "#3B82F6", // Dark Mode Brand
        },
        background: {
          default: "#F7FAFC", // Light Mode Main Background
          secondary: "#EFF6FF", // Light Mode Secondary Background
          dark: "#111827", // Dark Mode Main Background
          // "dark-secondary": "#1E293B",
          "dark-secondary": "#121926", // Dark Mode Secondary Background
        },
        borderColor: {
          light: "#CBD5E1", // Light Mode Border
          dark: "#334155", // Dark Mode Border
        },
        success: "#10B981",
        error: "#E53E3E",
        yellow: "#FFC107",
        highlight: {
          blue: "#3182CE", // Light Mode
          "dark-blue": "#2C7A7B", // Dark Mode
        },
      },
      spacing: {
        "10px": "10px",
        "1px": "1px",
      },
    },
  },
  plugins: [],
};

// List of all colors used in entire website

// Tailwind
// gray-100: "#F3F4F6";
// gray-200: #E5E5E5;
// gray-300: #D1D1D1;
// gray-400: #9CA3AF;
// gray-500: #6B7280;
// gray-600: #7D7D7D;
// gray-700: #374151;
// gray-800: #1F2937;
// gray-900: "#111827"; (Also gray-900/90 gray-900/70)

// red-50: "#FEF2F2";
// red-100: "#FEE2E2";
// red-200: #FCA5A5;
// red-300 → "#FCA5A5";
// red-400: "#F87171";
// red-500: #EF4444;
// red-600: #DC2626;
// red-700 → "#B91C1C";
// red-800: #991B1B;
// red-900/20 → rgba(127, 29, 29, 0.2) (Equivalent to #7F1D1D with 20% opacity);
// red-950: "#450a0a";

// blue-50: "#EFF6FF";
// blue-100: "#DBEAFE";
// blue-400: "#60A5FA";
// blue-500: "#3B82F6";
// blue-600: "#2563EB";
// blue-900/20 → rgba(30, 58, 138, 0.2) (Equivalent to #1E3A8A with 20% opacity)

// green-50: "#f0fdf4";
// green-100: "#dcfce7";
// green-600: "#16a34a";
// green-700: "#15803d";
// green-800: "#166534";
// green-950: "#052e16";

// white: #FFFFFF;

// Custom
// primary-500: #1A365D; (Also bg-primary-500/90)
// Primary-400: #3B82F6;
// background-secondary: #F3F4F6;
// background-dark-secondary: #1F2937;
// background-default: "#F7FAFC";
// background-dark: "#111827";
// secondary: "#4A5568";
// dark-secondary: "#D1D5DB";
// muted: "#718096";
// "dark-muted": "#94A3B8",
// light-primary: "#2D3748";
// dark-primary: "#F8FAFC"
// borderColor-light: "#CBD5E1";
// borderColor-dark: #334155";
// highlight-blue: #3182CE";
// highlight-dark-blue: "#2C7A7B";
// yellow: "#FFC107";
