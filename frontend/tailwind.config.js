module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Quét tất cả các file JS/JSX/TS/TSX trong thư mục src
  ],
  theme: {
    extend: {
      colors :{
        'primary' : "#5f6fff"
      },
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px , 1fr))'
      }
    },
  },
  plugins: [],
};
