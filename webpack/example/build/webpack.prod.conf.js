const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
// mini-css-extract-plugin 抽离css内容
// 安装：yarn add mini-css-extract-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D
// css压缩规则
let OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// js压缩规则
let UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'eval-cheap-module-source-map',
  resolve: {
    mainFields: ['jsnext:main', 'browser', 'main'],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      main: path.resolve(__dirname, '../src'),
    },
  },
  // externals: {
  //   vue: {
  //     root: 'Vue',
  //     commonjs: 'vue',
  //     commonjs2: 'vue',
  //     amd: 'vue',
  //   },
  //   axios: 'axios',
  //   iview: 'iview',
  //   mathjs: 'mathjs',
  // },
  plugins: [
    // 打包进度
    new webpack.ProgressPlugin(),
    // 删除打包文件
    new CleanWebpackPlugin(),
    new webpack.ContextReplacementPlugin(
      /\.\/locale$/,
      'empty-module',
      false,
      /js$/
    ),
    new BundleAnalyzerPlugin(),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  // 设置优化规则 不设置会走默认压缩规则
  optimization: {
    providedExports: true,
    usedExports: true,
    sideEffects: true,
    concatenateModules: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'all',
          minChunks: 2,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 0,
        },
      },
    },
    //压缩优化
    minimizer: [
      //压缩css(产生问题 js压缩不在压缩)
      new OptimizeCssAssetsWebpackPlugin(),
      //压缩js
      new UglifyjsWebpackPlugin({
        cache: true, //是否使用缓存
        parallel: true, //是否并发编译
        sourceMap: true, //是否启动源码映射（方便调试）
      }),
    ],
  },
})

module.exports = webpackConfig
