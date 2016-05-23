// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false
  },
  dev: {
    env: require('./dev.env'),
    port: 9000,
    // http://vuejs-templates.github.io/webpack/proxy.html
    proxyTable: {
      '/v2': {
        target: 'http://api-test.xlink.cn:8887/v2',
        changeOrigin: true,
        pathRewrite: {
          '^/v2': ''
        }
      }
    }
  }
}
