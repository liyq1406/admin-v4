var path = require('path')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/static'),
    publicPath: '/static/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    alias: {
      'src': path.resolve(__dirname, '../src')
    }
  },
  externals: {
    'AMap': 'window.AMap'
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    preLoaders: [
      {
        test: /\.vue$/,
        loader: 'eslint',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.vue$/,
        loader: 'vue'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.html$/,
        loader: 'vue-html'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'fonts/[name].[ext]?[hash:7]',
          mimetype: 'application/font-woff',
          prefix: 'fonts'
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'fonts/[name].[ext]?[hash:7]',
          mimetype: 'application/octet-stream',
          prefix: 'fonts'
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'fonts/[name].[ext]?[hash:7]',
          mimetype: 'application/vnd.ms-fontobject',
          prefix: 'fonts'
        }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'fonts/[name].[ext]?[hash:7]',
          mimetype: 'image/svg+xml&prefix=fonts',
          prefix: 'fonts'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          limit: 5120,
          name: 'images/[name].[ext]?[hash:7]'
        }
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  }
}
