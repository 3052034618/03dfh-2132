/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        bg: {
          primary: '#0a0a0f',
          card: '#13131a',
          input: '#1a1a24',
          hover: '#22222e',
        },
        accent: {
          gold: '#d4a574',
          'gold-light': '#e8c9a0',
          'gold-dark': '#a07844',
          crimson: '#8b2020',
          'crimson-light': '#c44040',
        },
        border: {
          subtle: '#2a2a3a',
          gold: '#d4a574',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#9898a8',
          muted: '#606070',
        },
        parchment: {
          light: '#f5e6c8',
          mid: '#e8d4a8',
          dark: '#c4a060',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        display: ['"ZCOOL QingKe HuangYou"', 'cursive'],
        hand: ['"Ma Shan Zheng"', 'cursive'],
        stamp: ['"Zhi Mang Xing"', 'cursive'],
      },
    },
  },
  plugins: [],
};
