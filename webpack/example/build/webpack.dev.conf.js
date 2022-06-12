const webpack = require("webpack");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "#cheap-module-eval-source-map",
  // webpack-dev-server配置
  // 安装：yarn add webpack-dev-server -D
  // 执行命令： webpack-dev-server --config webpack.config.development.js
  devServer: {
    hot: true,
    host: HOST,
    port: PORT,
    // progress: true, //显示打包编译的进度
    // contentBase: "./dist", //指定当前服务处理的资源目录
    // open: true, //编译完会自动打开浏览器
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  optimization: {
    providedExports: true,
    usedExports: true,
    sideEffects: true,
    concatenateModules: true,
    noEmitOnErrors: true,
    splitChunks: {
      chunks: "initial",
    },
  },
});

module.exports = devWebpackConfig;
