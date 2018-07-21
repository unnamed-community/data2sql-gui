const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
  chunks: ['renderer']
});

module.exports = {
  target: "electron-renderer",
  entry: {
    renderer: './src/renderer.js',
  },
  plugins: [htmlWebpackPlugin]
}
