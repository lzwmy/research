var path = require('path');
var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var serverconfig = require('../config/serverconfig');
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// var DiyPlugin = require('./diy-plugin')

// 用了generate-asset-webpack-plugin 这个插件，
// 在webpack.prod.conf.js中去生成configServer.json文件，让其在build的时候输出：
var GenerateAssetPlugin = require('generate-asset-webpack-plugin');
var createServerConfig = function (compilation) {
  let cfgJson = serverconfig;
  return JSON.stringify(cfgJson);
};

var env = config.build.env;

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,  // 生产环境关闭cssSourceMap
      extract: true,
      usePostCSS: true // 打开postcss,给样式css3添加前缀
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[hash:7].js'),
    chunkFilename: utils.assetsPath('js/[name].[hash:7].js')
  },
  plugins: [
    // new DiyPlugin({
    //   path: config.build.assetsRoot,
    //   env: env,
    //   versionDirectory: 'static'
    // }),
    // new webpack.DllPlugin({
    //   'process.env': env
    // }),

    new GenerateAssetPlugin({
      filename: 'serverconfig.json',
      fn: (compilation, cb) => {
        cb(null, createServerConfig(compilation));
      },
      extraFiles: []
    }),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    /*new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
      },
      sourceMap: true
    }),*/
    // 打包 速度优化
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS:{
        output: {
          comments: false
        },
        warnings: false,
        compress: {
          drop_console: true,
          drop_debugger: true
        },
      }
    }),
    new HappyPack({
      //用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      //如何处理  用法和loader 的配置一样
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      //共享进程池
      threadPool: happyThreadPool,
      //允许 HappyPack 输出日志
      verbose: true,
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[hash:7].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        );
      }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     names: ['web_common', 'web_run'], // 这公共代码的chunk名为'commons'
    //     filename: utils.assetsPath('js/[name].js'), // 生成后的文件名，虽说用了[name]，但实际上就是'commons.bundle.js'了
    //     minChunks: 4444, // 设定要有4个chunk（即4个页面）加载的js模块才会被纳入公共代码。
    // }),
    // new webpack.DllReferencePlugin({
    //     context: __dirname,
    //     manifest: require('./dll/manifest.json')
    // })
    //extract webpack runtime and module manifest to its own file in order to
    //prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets 复制static资源到构建后的static
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
});

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin');

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      // deleteOriginalAssets:true, //删除源文件，不建议
      minRatio: 0.8
    })
  );
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
