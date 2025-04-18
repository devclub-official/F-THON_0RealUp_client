const path = require("path");

module.exports = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // '@'를 'src'로 매핑
    },
  },
};