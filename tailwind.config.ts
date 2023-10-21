import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        brand: ["var(--font-brand)"],
        brand2: ["var(--font-brand2)"],
        brand3: ["var(--font-brand3)"],
        brand4: ["var(--font-brand4)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
