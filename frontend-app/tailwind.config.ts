import type { Config } from "tailwindcss";

// daisyui ships its own types in newer versions; cast to any to stay compatible
// eslint-disable-next-line @typescript-eslint/no-require-imports
const daisyui = require("daisyui");

const config: Config & { daisyui?: Record<string, unknown> } = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
};

export default config;
