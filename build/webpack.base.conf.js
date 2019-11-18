var fs = require('fs');
var path = require('path');
var utils = require('./utils');
var config = require('../config');
var vueLoaderConfig = require('./vue-loader.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


//循环所有页面入口文件main.js
var entryConfig = {};
var HtmlPlugins = [];
//可分析打包文件详情
// HtmlPlugins.push(new BundleAnalyzerPlugin());

//默认路径为webpack.config.js所在的路径，这里通过npm run 运行方式，引用的根路径为package.json, 开发环境，文件构成至内存中，webpack-dev-middleware根路径指向'/'
var entryArray = fs.readdirSync(path.join(__dirname, '../src/pages'));
entryArray.forEach((page) => {
  entryConfig['web_' + page] = [];
  entryConfig['web_' + page][0] = 'babel-polyfill';
  entryConfig['web_' + page][1] = path.join(__dirname, '../src/pages/' + page + '/main.js');

  if (process.env.NODE_ENV === 'production') {
    var Html = new HtmlWebpackPlugin({
      filename: page + '.html',
      template: 'template.html',
      chunks: ['manifest', 'vendor', 'web_' + page],
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    });
   /*var Html =  new HappyPack({
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
     })*/
  } else {
    var Html = new HtmlWebpackPlugin({
      filename: page + '.html',
      template: 'template.html',
      chunks: ['web_' + page],
      inject: true
    });
  }
  HtmlPlugins.push(Html);
});
function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  entry: entryConfig,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : './',
    chunkFilename: utils.assetsPath('[name].js')
  },
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex':'Vuex',
    'element-ui': 'ElementUI',
    'axios': 'axios',
    // 'jspdf': 'JsPDF',
    'highcharts': 'highcharts'
  },
  resolve: {
    extensions: ['.js', '.vue', '.css', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
      'src': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'packages': resolve('src/pages/index/packages')
    }
  },
  module: {
    rules: [
      // {
      //   test: /.(vue|js|jsx)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/,
      //   enforce: 'pre'
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      }, {
        test: /\.js$/,
        loader:process.env.NODE_ENV === 'production'? ['happypack/loader?id=happyBabel'] : 'babel-loader',
        // include: [resolve('src'), resolve('test')],
        // use: ['babel-loader?cacheDirectory'] 之前是使用这种方式直接使用 loader
        // 现在用下面的方式替换成 happypack/loader，并使用 id 指定创建的 HappyPack 插件
        /*use: ['happypack/loader?id=babel'],
        exclude: /node_modules/,*/
        include: [resolve('src')],
        //排除node_modules 目录下的文件
        exclude: /node_modules/
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,//小于10K的图片将直接以base64的形式内联在代码中
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }]
  },
  plugins: HtmlPlugins
};
