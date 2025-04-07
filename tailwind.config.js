/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "light-primary": "#2D3748",
        secondary: "#4A5568",
        muted: "#718096",
        "dark-primary": "#F8FAFC",
        "dark-secondary": "#D1D5DB",
        "dark-muted": "#94A3B8",
        yellow: "#FFC107",
        primary: {
          500: "#1A365D", // Main Brand
          400: "#3B82F6", // Dark Mode Brand
        },
        background: {
          default: "#F7FAFC",
          secondary: "#EFF6FF",
          dark: "#111827",
          "dark-secondary": "#121926",
        },
        borderColor: {
          light: "#CBD5E1",
          dark: "#334155",
        },
        highlight: {
          blue: "#3182CE",
          "dark-blue": "#2C7A7B",
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

// List of tailwind colors used in entire website
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
// red-900/20 → rgba(127, 29, 29, 0.2);
// red-950: "#450a0a";

// blue-50: "#EFF6FF";
// blue-100: "#DBEAFE";
// blue-400: "#60A5FA";
// blue-500: "#3B82F6";
// blue-600: "#2563EB";
// blue-900/20 → rgba(30, 58, 138, 0.2);

// green-50: "#f0fdf4";
// green-100: "#dcfce7";
// green-600: "#16a34a";
// green-700: "#15803d";
// green-800: "#166534";
// green-950: "#052e16";

// white: #FFFFFF;
