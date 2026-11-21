import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fundo: "#0b0b0c",
        fundo2: "#141416",
        cartao: "#1a1a1d",
        linha: "#2a2a2e",
        ouro: { DEFAULT: "#c9a45c", claro: "#e8cc8a" },
        texto: "#ecebe8",
        mudo: "#a3a19c",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
