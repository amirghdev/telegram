/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,html,vue,ts}"],
  theme: {
    fontFamily: {
      iransensBlack: "iran-sens-black",
      iransensBold: "iran-sens-bold",
      iransensDemibold: "iran-sens-demibold",
      iransensExtrabold: "iran-sens-extrabold",
      iransenslight: "iran-sens-light",
      iransensMedium: "iran-sens-medium",
      iransensRegular: "iran-sens-regular",
      iransensThin: "iran-sens-thin",
      iransensUltralight: "iran-sens-ultralight",
    },
    extend: {
      borderWidth: {
        1: "1px",
      },
      backgroundImage: {
        img1: "url(./src/assets/images/login/Telegram_logo3.png)",
        tickimage: "url(./src/assets/images/login/tick.jpg)",
        tickimage2: "url(./src/assets/images/login/tick2.jpg)",
      },
    },
  },
  plugins: [],
};
