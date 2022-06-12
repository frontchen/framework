const baseConfig = require("./webpack.base.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const config = {
  plugins: [
    new HtmlWebpackPlugin({
      // filename: "index.html",
      hash: true,
      // chunks: ["index"],
      template: path.resolve(__dirname, "../public/index.html"),
      title: "学习webpack",
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
    }),
  ],
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] }, // 在样式的loader最后一个style-loader改成MiniCssExtractPlugin.loader
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      }, // 在样式的loader最后一个style-loader改成MiniCssExtractPlugin.loader
    ],
  },
};
module.exports = Object.assign({}, baseConfig, config);
