// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var webpack = require('webpack');
module.exports = {
  build: {
    env: require('./prod.env'),
    //index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../docker/html/'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',//编译发布的根目录，资源等编译后前面所加前缀，如编译成static/img/a.png,static/js/manifest.js,如果用的'/'，则前缀直接是根目录，
                           //这样的话，构建后直接本地打开是访问不到资源的，因为去找根路径了，用'./'相对于当前路径就可以找到；
    //部署到服务器建议用'/'根路径，这样编译的资源前缀都接根路径就可以正确访问了
    // 可配置为资源服务器域名或 CDN 域名   //assetsPublicPath: 'http://10.204.39.22:10087/',
    productionSourceMap: false,  //生产环境关闭cssSourceMap
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8840,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/research': {
        // target: 'http://120.77.199.11:8800/', // 原来设置
        // target: 'http://192.168.1.184:8080/', // 赵恒联调
        // target: 'http://192.168.1.189:8080/', // 小武联调
        // target: 'http://192.168.1.155:8080/', //  强哥联调
        target: 'http://39.108.238.209:8806/', // 测试联调
        changeOrigin: true,
        // https请求需要该设置,当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效
        secure: false,
        pathRewrite: {
          '^/research': '/research'
        }
      }
    },
    cssSourceMap: true  //开发环境打开cssSourceMap，方面调试样式快速定位样式的位置
  }
};
