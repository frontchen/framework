const baseConfig = require("./webpack.base.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //打包前删除历史文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //css文件打包成单独的文件
// 该插件将在Webpack构建过程中搜索CSS资源，并优化\最小化CSS
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const config = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:3].css?v=[hash]",
      chunkFilename: "css/[id].[hash:3].css?v=[hash]",
      ignoreOrder: false,
      linkType: "text/css",
    }),

    //打包html插件
    new CleanWebpackPlugin(),
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
    // new PurifyCSSPlugin({
    //   paths: glob.sync(path.resolve("src/*.html")),
    // }),
    new BundleAnalyzerPlugin(),
    new OptimizeCssAssetsWebpackPlugin(),
    // new HtmlWebpackPlugin({
    //   filename: "a.html",
    //   hash: true,
    //   chunks: ["index"],
    //   // template: "./public/index.html",
    //   title: "学习webpack",
    //   minify: {
    //     removeAttributeQuotes: true,
    //     collapseWhitespace: true,
    //   },
    // }),
    // new HtmlWebpackPlugin({
    //   filename: "b.html",
    //   chunks: ["a"],
    //   hash: true,
    //   // template: "./public/index.html",
    //   title: "学习webpack",
    //   minify: {
    //     removeAttributeQuotes: true,
    //     collapseWhitespace: true,
    //   },
    // }),
  ], //插件配置
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }, // 在样式的loader最后一个style-loader改成MiniCssExtractPlugin.loader
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      }, // 在样式的loader最后一个style-loader改成MiniCssExtractPlugin.loader
    ],
  },
  optimization: {
    splitChunks: {
      // 选择哪些 chunk 进行优化，默认async，即只对动态导入形成的chunk进行优化。
      chunks: "all",
      // 提取chunk最小体积
      minSize: 20000,
      // 要提取的chunk最少被引用次数
      minChunks: 1,
      // 对要提取的chunk进行分组
      cacheGroups: {
        // 匹配node_modules中的三方库，将其打包成一个chunk
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          // chunk名称
          name: "vendors",
          priority: -10,
        },
        default: {
          // 将至少被两个chunk引入的模块提取出来打包成单独chunk
          minChunks: 2,
          name: "default",
          priority: -20,
        },
      },
    },
  },
};
module.exports = Object.assign({}, baseConfig, config);
