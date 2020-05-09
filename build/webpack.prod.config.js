//webpack 是node写的， node语法
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const AutoDllPlugin = require("autodll-webpack-plugin");
const common = require("./webpack.base.config.js");
//serviceWorker
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const path = require("path");
const PATHS = {
  src: path.join(__dirname, "src"),
};
// 去除无用的样式
const glob = require("glob");
const PurgecssWebpackPlugin = require("purgecss-webpack-plugin");

module.exports = merge(common, {
  mode: "production", //生产模式
  optimization: {
    // 打包压缩js/css文件
    minimizer: [
      // new UglifyJsPlugin({
      //     uglifyOptions: {
      //         compress: {
      //             // 在UglifyJs删除没有用到的代码时不输出警告
      //             // warnings: false,
      //             // 删除所有的 `console` 语句，可以兼容ie浏览器
      //             // drop_console: true,
      //             // 内嵌定义了但是只用到一次的变量
      //             collapse_vars: true,
      //             // 提取出出现多次但是没有定义成变量去引用的静态值
      //             reduce_vars: true,
      //         },
      //         output: {
      //             // 最紧凑的输出
      //             beautify: false,
      //             // 删除所有的注释
      //             comments: false,
      //         },
      //          parallel: true, //使用多进程并行运行来提高构建速度
      //     }
      // }),
      // This is only used in production mode
      // uglifyjs-webpack-plugin 2.0版本的Release日志中，明确提示重新切换回到uglify-js，因为uglify-es被废弃了，如果需要ES6代码压缩，请使用terser-webpack-plugin
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
            //去掉console
            drop_console: true,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Enable file caching
        cache: true,
        sourceMap: false,
      }),
      // 压缩 CSS 代码
      new OptimizeCssAssetsPlugin({}),
    ],
    // 拆分公共模块
    splitChunks: {
      chunks: "all",
      //打包时 复用缓存里的打包文件，提高打包速度
      cacheGroups: {
        // less/css
        //     styles: {
        //         name: 'styles',
        //         test: /\.(css|less)/,
        //         chunks: 'all',
        //         enforce: true,
        //         // 表示是否复用已有的 stlyes chunk
        //         reuseExistingChunk: true
        //     },
        //     // 这种方式也会抽离出一个commons.fgd453535ftg.js文件，与第一种方式的不同是，它不仅仅抽离第三方库，
        //     // 且会把所有js模块间引入的重复代码，也会抽离到commons.fdsfs534534g.js文件中。
        //     commons: {
        //         name: 'commons',
        //         chunks: 'initial',
        //         minChunks: 2,
        //         reuseExistingChunk: true
        //     },
        //     // 会抽离出第三库的代码，生成一个vendors.db5b3f3dc26a5ebe685c.js文件，且每次打包第三库的hash也不会变化，
        //     // 这样就会利用浏览器的缓存机制，达到一个缓存优化，除非第三方库的版本变化，会重新生成一个新的文件，这样浏览
        //     // 器也会重新请求新的文件。
        //     // node_modules
        //     vendors: {
        //         test: /[\\/]node_modules[\\/]/,
        //         name: 'vendors',
        //         priority: -10,
        //         reuseExistingChunk: true
        //     }
      },
    },
    //默认false,为true时 对于每个entry会生成runtime~${entrypoint.name}的文件 添加一个额外 chunk
    runtimeChunk: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[id].[contenthash:8].css",
    }),
    new AutoDllPlugin({
      inject: true, // will inject the DLL bundles to index.html
      filename: "[name]_[hash:8].dll.js",
      path: "./dll",
      entry: {
        // 第三方库
        react: [
          "react",
          "react-dom",
          "react-router",
          "react-router-dom",
          "react-loadable",
        ],
        antd: ["antd/es"],
      },
    }),
    //PWA serviceWorker插件
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true, //删除旧的serviceWorker
      skipWaiting: true, //帮助serviceWorker快速启动
      // exclude: [/\.map$/, /asset-manifest\.json$/],
    }),
    // 去除无用的样式
    // new PurgecssWebpackPlugin({
    //     // paths表示指定要去解析的文件名数组路径
    //     // Purgecss会去解析这些文件然后把无用的样式移除
    //     // {nodir: true}表示不包含文件夹，加快查找速度
    //     paths: glob.sync(`${PATHS.src}/**/*`, {
    //         nodir: true
    //     })
    // })
    // new BundleAnalyzerPlugin({
    //     analyzerMode: 'server',
    //     analyzerHost: '127.0.0.1',
    //     analyzerPort: '9999',
    //     reportFilename: 'report.html',
    //     defaultSizes: 'parsed',
    //     openAnalyzer: true,
    // })
  ],
  // stats 配置过滤打包时出现的一些统计信息
  //   stats: {
  //     // 关闭构建模块信息
  //     // modules: false,
  //     children: false,
  //     // chunks: false,
  //     // chunkModules: false
  //     // 当文件大小超过 `performance.maxAssetSize` 时显示性能提示
  //     performance: false,
  //   },
  // 性能提醒
  performance: {
    hints: false, // 消除 文件size偏大warning等
    maxAssetSize: 30000000, //3M 整数类型（以字节为单位）
    maxEntrypointSize: 50000000, //入口文件最大50M 整数类型（以字节为单位）
  },
});
