import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E1116",
        surface: "#161B22",
        surface2: "#1D232C",
        hairline: "#2A303C",
        fg: "#EDEFF2",
        fgmuted: "#8B93A1",
        ember: "#FF8A3D",
        emberdim: "#B85E22",
        signal: "#5EEAD4",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      keyframes: {
        pulseglow: {
          "0%, 100%": { opacity: "0.55", filter: "drop-shadow(0 0 0px currentColor)" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 6px currentColor)" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        dash: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        pulseglow: "pulseglow 2.2s ease-in-out infinite",
        rise: "rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        dash: "dash 1.1s ease forwards",
      },
    },
  },
  plugins: [],
};
export default config;
