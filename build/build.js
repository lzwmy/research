require('./check-versions')()
process.env.NODE_ENV = 'production'
var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
var spinner = ora('building for production...')
spinner.start()
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    /**
     *  图片资源是通过css加载的，如 background: url("../../assets/images/logo-index.png") no-repeat;
     *  被相对打包后变成了url(static/img/logo-index.2f00bf2.png) no-repeat所以我们要保留css引用图片的正常路径，
     *  即：url(../../static/img/logo-index.2f00bf2.png) no-repeat
     *  那么就需要修改build文件夹下的utils.js代码,publicPath:'../../'
     *  只需要简单一句配置在ExtractTextPlugin.extract中，何必写下面一大段！
     */
    //将.css文件中的资源地址如图片等改为上一级即与css文件夹同级地址，这样如果本地打开构建后的文件，图片资源是可以访问到的
    //如部署到服务器上，是不需要做此操作的，但做了也不会影响
    // var fs = require("fs");
    // var path = require("path");
    // var runPath = path.join(__dirname, '../docker/html/static/css/');
    // fs.readdir(runPath, function(err, files) {
    //   if (err) {
    //     console.log('html 目录文件不全，请重新npm run build 构建');
    //     return;
    //   }
    //   files.forEach(function(filename) {
    //     if (filename.indexOf('map') === -1) {
    //       var filePath = path.join(runPath, filename);
    //       var data = fs.readFileSync(filePath, "utf-8").replace(/static\//g, '../');
    //       console.log('\n' + ' [INFO]  (' + filePath + ')');
    //       fs.writeFile(filePath, data, function(err) {
    //         if (err) return;
    //         //console.log('\n' + '\x1B[32m 构建环境：' + 　process.env.FIS_WEBPACK + '   Ω ................... ' + 　(+new Date() - start) + ' ms \x1B[37m')
    //       });
    //     }
    //   });
    // });
  })
})
