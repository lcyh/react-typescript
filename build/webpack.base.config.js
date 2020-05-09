//webpack 是node写的， node语法
let path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const friendlyFormatter = require("eslint-formatter-friendly");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const chalk = require("chalk");
const env = process.env.NODE_ENV;
let isProd = env === "production";

module.exports = {
  devtool: isProd ? "none" : "cheap-module-eval-source-map", //https://www.jianshu.com/p/62dc120d96d0
  entry: {
    main: ["@babel/polyfill", path.resolve(__dirname, "../src/index.tsx")], // 入口文件 ,
    // header: path.resolve(__dirname, '../src/header.js'), //多入口
    vendor: ["react", "react-router-dom", "react-dom", "mobx"], //公共依赖
  },
  output: {
    filename: "static/js/[name].[hash:8].js", // 打包后的文件名称 打包到dist/js
    path: path.resolve(__dirname, "../dist"), // 打包后的目录
    chunkFilename: "static/js/[name].[hash:8].js",
    publicPath: isProd ? "./" : "/", //打包后引用路径前缀 production时 "./"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      filename: "index.html",
    }),
    // new HtmlWebpackPlugin({
    //     template: path.resolve(__dirname, '../public/header.html'),
    //     filename: 'header.html',
    //     chunks: ['header'] // 与入口文件对应的模块名
    // }),
    // 打包进度
    new ProgressBarPlugin({
      complete: "█",
      format:
        chalk.green("Webpack ") +
        "[ " +
        chalk.green(":bar") +
        " ] " +
        ":msg: " +
        chalk.bold("(:percent)"),
      clear: true,
    }),
  ],
  module: {
    rules: [
      {
        enforce: "pre", // 强制放在最前面执行
        test: /\.(ts|tsx|js)?$/,
        include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/,
        use: {
          loader: "eslint-loader",
          options: {
            cache: true, // 缓存lint结果，可以减少lint时间
            formatter: friendlyFormatter,
          },
        },
      },
      {
        test: /\.(ts|tsx|js|jsx)?$/, //test: /\.(ts|tsx|js|jsx)?$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: !isProd, // 缓存
          },
        },
        include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/,
      },
      {
        test: /\.(css|less)$/,
        include: path.join(__dirname, "../src"),
        use: [
          isProd ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: {
                localIdentName: "[local]", //[local].[hash:8]
              },
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(css|less)$/,
        include: path.join(__dirname, "../node_modules"),
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "img/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "media/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "fonts/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    // 设置别名
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts", ".less", ".css"], //扩展名
    // 设置模块查找范围
    modules: ["node_modules", path.resolve(__dirname, "../node_modules")],
  },
  // stats 配置过滤打包时出现的一些统计信息
  stats: {
    // 关闭构建模块信息
    // modules: false,
    children: false,
    // chunks: false,
    // chunkModules: false
    // 当文件大小超过 `performance.maxAssetSize` 时显示性能提示
    performance: false,
  },
  // performance 配置关闭性能提示
  performance: {
    hints: false,
  },
};
