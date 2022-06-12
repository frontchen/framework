const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //打包前删除历史文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //css文件打包成单独的文件
// const PurifyCSSPlugin = require("purifycss-webpack");
// const glob = require("glob");
// 该插件将在Webpack构建过程中搜索CSS资源，并优化\最小化CSS
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

let webpack = require("webpack");
module.exports = {
  /**
   * 单入口
   */
  entry: "./src/index.js",
  /**
   * 单出口
   */
  output: {
    filename: "[name].[hash:8].js",
    path: path.resolve("dist"),
    clean: true,
  },
  /**
   * 多入口、多出口
   */
  // entry: {
  //   index: "./src/index.js",
  //   a: "./src/a.js",
  // },
  // output: {
  //   filename: "[name].[hash:8].js",
  //   path: path.resolve(__dirname, "dist"),
  //   clean: true,
  // },
  devServer: {
    // contentBase: "./dist",
    static: {
      directory: path.join(__dirname, "dist"),
      serveIndex: true,
    },
    port: 3000,
    compress: true, //服务器压缩
    open: true,
    // allowedHosts: ["host.com", "subdomain.host.com", "subdomain2.host.com"], //允许将允许访问开发服务器的服务列入白名单
    hot: true,
  }, //开发服务器
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:3].css?v=[hash]",
      chunkFilename: "css/[id].[hash:3].css?v=[hash]",
      ignoreOrder: false,
      linkType: "text/css",
    }),
    new webpack.HotModuleReplacementPlugin(),
    //打包html插件
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // filename: "index.html",
      hash: true,
      // chunks: ["index"],
      template: "public/index.html",
      title: "学习webpack",
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
    }),
    // new PurifyCSSPlugin({
    //   paths: glob.sync(path.resolve("src/*.html")),
    // }),
    process.env.NODE_ENV === "production"
      ? new BundleAnalyzerPlugin()
      : () => {},
    process.env.NODE_ENV === "production"
      ? new OptimizeCssAssetsWebpackPlugin()
      : () => {},
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
  mode: process.env.NODE_ENV,
  // mode: "development", //开发环境模式
  resolve: {}, //模块解析
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] }, // 在样式的loader最后一个style-loader改成MiniCssExtractPlugin.loader
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      }, // 在样式的loader最后一个style-loader改成MiniCssExtractPlugin.loader
    ],
  },
};
