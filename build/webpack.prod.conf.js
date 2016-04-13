var minimist = require('minimist')
var webpack = require('webpack')
var config = require('./webpack.base.conf')
var cssLoaders = require('./css-loaders')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// get terminal params
var argv = minimist(process.argv.slice(2))

// naming output files with hashes for better caching.
// dist/index.html will be auto-generated with correct URLs.
config.output.filename = 'scripts/[name].[chunkhash:7].js'
// config.output.chunkFilename = '[id].[chunkhash].js'
config.output.chunkFilename = 'scripts/[name].[chunkhash:7].js'

// whether to generate source map for production files.
// disabling this can speed up the build.
var SOURCE_MAP = false

config.devtool = SOURCE_MAP ? 'source-map' : false

config.vue = config.vue || {}
config.vue.loaders = config.vue.loaders || {}
cssLoaders({
  sourceMap: SOURCE_MAP,
  extract: true
}).forEach(function (loader) {
  config.vue.loaders[loader.key] = loader.value
})

config.plugins = (config.plugins || []).concat([
  // http://vuejs.github.io/vue-loader/workflow/production.html
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
      API_SERVER: argv['api-server'] ? '"' + argv['api-server'] + '"' : undefined
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.OccurenceOrderPlugin(),
  // extract css into its own file
  new ExtractTextPlugin('styles/[name].[contenthash:7].css'),
  // generate dist index.html with correct asset hash for caching.
  // you can customize output by editing /index.html
  // see https://github.com/ampedandwired/html-webpack-plugin
  new HtmlWebpackPlugin({
    filename: '../index.html',
    template: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    }
  })
])

module.exports = config
