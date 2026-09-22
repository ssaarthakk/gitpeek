import { heroui } from "@heroui/react";

// Mirrors the tokens in globals.css. Primary actions are white pills; orange is
// the highlight colour, yellow = expiring / waiting, green = success, red = ended.
export default heroui({
  defaultTheme: "dark",
  layout: {
    radius: { small: "10px", medium: "14px", large: "22px" },
    borderWidth: { small: "1px", medium: "1px", large: "1px" },
  },
  themes: {
    dark: {
      colors: {
        background: "#0A0A0B",
        foreground: "#F5F5F4",
        divider: "#242427",
        focus: "#F0481E",
        overlay: "#000000",
        content1: "#141415",
        content2: "#1C1C1E",
        content3: "#232326",
        content4: "#34343A",
        default: {
          50: "#0A0A0B",
          100: "#141415",
          200: "#242427",
          300: "#34343A",
          400: "#4A4A50",
          500: "#5E5E64",
          600: "#8B8B90",
          700: "#C7C7C9",
          800: "#E2E2E3",
          900: "#F5F5F4",
          DEFAULT: "#242427",
          foreground: "#F5F5F4",
        },
        primary: { DEFAULT: "#F5F5F4", foreground: "#0A0A0B" },
        secondary: { DEFAULT: "#F0481E", foreground: "#FFFFFF" },
        success: { DEFAULT: "#4ADE80", foreground: "#0A0A0B" },
        warning: { DEFAULT: "#FFC61A", foreground: "#0A0A0B" },
        danger: { DEFAULT: "#F2554A", foreground: "#0A0A0B" },
      },
    },
  },
});
