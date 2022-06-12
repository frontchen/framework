const path = require("path");

module.exports = {
  /**
   * 单入口
   */
  entry: path.resolve(__dirname, "../src/index.js"),
  /**
   * 单出口
   */
  output: {
    filename: "[name].[hash:8].js",
    path: path.resolve(__dirname, "../build"),
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
  //   path: path.resolve(__dirname, "build"),
  //   clean: true,
  // },
  devServer: {
    // contentBase: "./build",
    static: {
      directory: path.join(__dirname, "../build"),
      serveIndex: true,
    },
    port: 3000,
    compress: true, //服务器压缩
    open: true,
    // allowedHosts: ["host.com", "subdomain.host.com", "subdomain2.host.com"], //允许将允许访问开发服务器的服务列入白名单
    hot: true,
  }, //开发服务器
  plugins: [
    // new PurifyCSSPlugin({
    //   paths: glob.sync(path.resolve("src/*.html")),
    // }),
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
};
