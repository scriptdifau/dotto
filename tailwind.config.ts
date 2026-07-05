import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Palette Dotto — dal logo Instagram: bici bianca/navy su cerchio blu.
        dotto: {
          ink: "#17255A", // navy profondo (testo, sezioni scure)
          blue: "#3F7EC0", // blu primario (il cerchio del logo)
          "blue-dark": "#2C5E97", // hover / stati premuti
          navy: "#21357E", // blu scuro della bici (accenti forti)
          sky: "#BBD7F1", // azzurro chiaro (accenti tenui)
          cream: "#F1F6FC", // sfondo chiaro (bianco-azzurro)
          sand: "#E2ECF7", // superfici tenui
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(23, 37, 90, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
