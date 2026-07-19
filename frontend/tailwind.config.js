export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "zephyr-ivory": "#F8F3EC",
        "zephyr-noir": "#1B1512",
        "zephyr-umber": "#3A2E27",
        "zephyr-gold": "#B48A4A",
        "zephyr-rose": "#B76E62",
        "zephyr-sand": "#E7DCC9",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ['"Jost"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
