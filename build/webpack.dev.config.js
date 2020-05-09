// webpack node语法
let path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const common = require("./webpack.base.config.js");
const env = process.env.NODE_ENV;
let isProd = env === "production";
console.log("env=====", env);
console.log("isProd=====", isProd);

module.exports = merge(common, {
  mode: "development", //模式
  devServer: {
    port: 3000, //端口号
    // host: '0.0.0.0', // 允许ip访问
    hot: true, //热更新
    compress: true, // gzip压缩
    progress: true, //进度条
    // contentBase: path.join(__dirname, '../dist'), // 服务启动访问的目录，默认为跟目录 dist/index.html
    // 解决刷新页面404，当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。通过设置为 true 进行启用
    historyApiFallback: {
      disableDotRule: true,
    },
    // 出现错误时是否在浏览器上出现遮罩层提示
    overlay: true,
    // 设置接口请求代理，更多 proxy 配置请参考 https://github.com/chimurai/http-proxy-middleware#options
    proxy: {
      "/api/": {
        changeOrigin: true, //解决跨域
        // 目标地址
        target: "http://localhost:3000",
        // 重写路径
        pathRewrite: {
          "^/api/": "/",
        },
      },
    },
  },
  plugins: [
    // 自动在出口目录生成 html 并自动引入 js 文件
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
      filename: "index.html",
      chunks: ["main"], // 与入口文件对应的模块名
    }),
    // 热加载插件
    new webpack.HotModuleReplacementPlugin(),
  ],
});
