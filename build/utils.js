var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  };
  const postcssLoader = { // 给css3加前缀的loader
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader]: [cssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

  

    // Extract CSS when that option is specified
    // (which is the case during production build)
    /**
     *  图片资源是通过css加载的，如 background: url("../../assets/images/logo-index.png") no-repeat;
     *  被相对打包后变成了url(static/img/logo-index.2f00bf2.png) no-repeat所以我们要保留css引用图片的正常路径，
     *  即：url(../../static/img/logo-index.2f00bf2.png) no-repeat
     *  那么就需要修改build文件夹下的utils.js代码,publicPath:'../../'
     */
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath:'../../',//打包css的时候，改变publicPath公共资源路径为../../static......,所以不用再build.js里面单独用node去处理修改图片资源路径了！
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // function lessResourceLoader() {
  //   var loaders = [
  //     cssLoader,
  //     'less-loader',
  //     {
  //       loader: 'less-resources-loader',
  //       options: {
  //         resources: [
  //           path.resolve(__dirname, '../src/assets/common.less'),
  //         ]
  //       }
  //     }
  //   ];
  //   if (options.extract) {
  //     return ExtractTextPlugin.extract({
  //       use: loaders,
  //       fallback: 'vue-style-loader'
  //     })
  //   } else {
  //     return ['vue-style-loader'].concat(loaders)
  //   }
  // }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    // less: lessResourceLoader(),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
