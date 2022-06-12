// 导入内置path模块
let path = require('path')
const webpack = require('webpack')
// html-webpack-plugin插件
// 安装：yarn add html-webpack-plugin -D
// let HtmlWebpackPlugin = require('html-webpack-plugin') //每一个插件都是一个类

// mini-css-extract-plugin 抽离css内容
// 安装：yarn add mini-css-extract-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const pkg = require('../package.json')
module.exports = {
  // 入口
  entry: {
    main: './src/index.js',
  },
  // 出口
  output: {
    //输出文件名 bundle.min.[hash].js让每次生成文件名都带着hash值
    filename: '[name].js',
    //输出目录必须是绝对路径
    path: path.resolve(__dirname, '../dist'), //在当前目录创建一个dist文件
    //给编译后饮用资源地址前面加前缀
    // publicPath: "./",
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  // 使用插件 plugin
  plugins: [
    // new HtmlWebpackPlugin({
    //   //指定模板 不指定会生成一个默认的html页面（空的）
    //   template: path.resolve(__dirname, '../public/index.html'),
    //   //输出后的文件名
    //   filename: 'index.html',
    //   //让html文件中引入的js文件后面加上hash戳 每次生成文件名不一样 为了清除缓存
    //   //真实项目中一般都是每次编译生成不同的js文件引入
    //   // hash: true,
    //   //控制压缩
    //   minify: {
    //     collapseWhitespace: true, //去掉空格
    //     removeComments: true, //删除注释
    //     removeAttributeQuotes: true, //删除双引号
    //     removeEmptyAttributes: true, //删除声明了但是没赋值的属性 let a;
    //   },
    // }),
    new MiniCssExtractPlugin({
      //指定输出文件名
      filename: 'main.min.css',
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.VERSION': `'${pkg.version}'`,
    }),
  ],
  // 使用加载器 loader处理规则
  // @@@ webpack中css需要我们在入口的js文件中导入后才能使用 require('./my-index.css')
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        //编译js的loader
        //基于babel实现es6转换和ESLint语法检测
        //babel转换语法模块 @babel/preset-env
        //安装：yarn add babel-loader @babel/core @babel/preset-env @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators @babel/plugin-transform-runtime -D
        //安装：yarn add eslint eslint-loader -D ESLint词法检测（很恶心）
        test: /\.js$/i,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                //基于babel的语法解析包 es6 -> es5
                '@babel/preset-env',
              ],
              plugins: [
                //使用插件处理大于ES6中的特殊语法
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    legacy: true,
                  },
                ],
                [
                  '@babel/plugin-proposal-class-properties',
                  {
                    loose: true,
                  },
                ],
              ],
            },
          },
        ],
        //指定js编译的目录
        include: path.resolve(__dirname, 'src'),
        //忽略哪个目录
        exclude: /node_modules/,
      },
      {
        //处理图片 模块规则： 使用加载器 默认从右向左执行
        //安装：yarn add file-loader url-loader html-withimg-loader -D
        test: /\.(png|jpg|gif|jpeg|ico|webp|bmp)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 200 * 1024, //只要图片小于200KB 直接转成base64
              outputPath: '/images',
            },
          },
        ],
      },
      {
        //处理html文件中导入的img图片
        test: /\.(html|htm|xml)$/i,
        use: ['html-withimg-loader'],
      },
    ],
  },
  performance: {
    hints: false,
  },
}
