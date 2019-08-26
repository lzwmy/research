var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var serverconfig = require('../config/serverconfig');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (page) {
  baseWebpackConfig.entry[page] = ['./build/dev-client'].concat(baseWebpackConfig.entry[page]);
});

// 用了generate-asset-webpack-plugin 这个插件，
// 在webpack.prod.conf.js中去生成configServer.json文件，让其在build的时候输出：
var GenerateAssetPlugin = require('generate-asset-webpack-plugin');
var createServerConfig = function (compilation) {
  let cfgJson = serverconfig;
  return JSON.stringify(cfgJson);
};

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap}) //开发环境打开cssSourceMap，方便调试样式快速定位样式的位置
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new GenerateAssetPlugin({
      filename: 'serverconfig.json',
      fn: (compilation, cb) => {
        cb(null, createServerConfig(compilation));
      },
      extraFiles: []
    }),
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
});
