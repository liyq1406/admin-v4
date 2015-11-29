var path = require('path');
var minimist = require('minimist');
var vue = require('vue-loader');
var devip = require('dev-ip');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var DefinePlugin = require('webpack').DefinePlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// 获取命令行参数
// --debug 输出日志
// --release 发布到生产环境
// --port 指定端口
var argv = minimist(process.argv.slice(2));

// 调试日志开关
var DEBUG = !!argv.debug;

// 是否使用虚拟数据
var MOCK = !!argv.mock;

// 开发环境与生产环境切换开关
var DEV = !argv.release;

// 资源服务IP
// 该IP地址用于开发时供页面引用资源
var DEV_IP = devip()[0];

// 资源服务端口
// 如果默认端口8090被占用，可通过命令行参数 --port 指定
var PORT = argv.port || 8090;

// 样式表需要兼容的最低系统或浏览器版本
var AUTOPREFIXER_BROWSERS = [
  // 'Android 2.3',
  'Android >= 4',
  'Chrome >= 36',
  'Explorer >= 9',
  'iOS >= 7',
  'Safari >= 7'
];

// 指定图片转换成BASE64的最大比特数
// 当图片大小小于指定比特数时转换为BASE64以减少请求数，否则直接使用图片文件
var BASE64_LIMIT = 2048;

// 基础目录
var dirs = {
  src: 'src',     // 源文档目录
  pub: 'public',  // 开发调试临时目录
  dist: 'dist',   // 代码发布目录
  test: 'test'    // 代码测试目录
};

// 传递到脚本文件中的全局变量
// 形如 `if(__DEBUG__) { ... }` 的调试代码会在不指定命令行`--debug`参数时自动被丢弃
var GLOBALS = {
  'process.env.NODE_ENV': DEV ? '"development"' : '"production"',
  'apiRoot': MOCK ? '"http://localhost:9090/"' : '"http://api.xlink.cn/"',
  '__DEBUG__': DEBUG
};

// 传入 Jade 文件中的变量
var MARKUP_LOCALS = {
  __DEV__: DEV,
  basePath: DEV ? 'http://' + DEV_IP + ':' + PORT + '/' + dirs.dist + '/' : ''
};

// 基本配置
var config = {
  // 基础目录
  dirs: dirs,

  // 域名
  devIP: DEV_IP,

  // 端口
  port: PORT,

  // 详细日志输出
  verbose: DEV,

  // 标记语言
  markup: {
    src: [
      './' + dirs.src + '/**/*.jade'
    ],
    dest: DEV ? './' + dirs.pub : './' + dirs.dist,
    locals: MARKUP_LOCALS
  },

  // 测试
  test: {
    dir: [
      './' + dirs.test + '/**/*.js'
    ]
  }
};

var webpackConfig = {
  // 开发环境启用 source-map
  devtool: DEV ? 'inline-source-map' : false,

  cache: DEV,
  debug: DEV,

  // 高亮 webpack 输出
  stats: {
    color: true,
    reasons: DEV
  },

  node: {
    fs: 'empty'
  },

  // 入口文件
  entry : {
    app: [
      './' + dirs.src + '/main'
    ].concat(DEV ? [
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://' + DEV_IP + ':' + PORT,
    ] : [])
  },

  output: {
    filename: 'scripts/[name].js',
    path: path.join(__dirname, 'dist'),
    publicPath: DEV ? 'http://' + DEV_IP + ':' + PORT + '/' + dirs.dist + '/' : '../'
  },

  resolve: {
    modulesDirectories: ['node_modules'],
    // 设置自动扩展名识别
    extensions: ['', '.js', '.json']
  },

  module: {
    loaders: [{
      test: /\.vue$/,
      // exclude: /node_modules/,
      loader: 'vue'
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff&prefix=fonts'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream&prefix=fonts'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?name=fonts/[name].[ext]&limit=10000&mimetype=application/vnd.ms-fontobject&prefix=fonts'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml&prefix=fonts'
    }, {
      test: /\.png/,
      loader: 'url?name=images/[name]_[hash:6].[ext]&limit=' + BASE64_LIMIT + '&mimetype=image/png'
    }, {
      test: /\.jpg/,
      loader: 'url?name=images/[name]_[hash:6].[ext]&limit=' + BASE64_LIMIT + '&mimetype=image/jpg'
    }, {
      test: /\.gif/,
      loader: 'url?name=images/[name]_[hash:6].[ext]&limit=' + BASE64_LIMIT + '&mimetype=image/gif'
    }]
  },

  vue: {
    loaders: {
      //css: DEV ? 'style!css?sourceMap!postcss' : ExtractTextPlugin.extract('css!postcss'),
      //stylus: DEV ? 'style!css?sourceMap!postcss!stylus' : ExtractTextPlugin.extract('css!postcss!stylus')
      css: DEV ? 'style!css?sourceMap' : ExtractTextPlugin.extract('css'),
      stylus: DEV ? 'style!css?sourceMap!stylus' : ExtractTextPlugin.extract('css!stylus')
    }
  },

  // postcss: function () {
  //   return [autoprefixer(AUTOPREFIXER_BROWSERS)];
  // },

  // 如果是调试模式，则不打包库文件以加速编译速度
  // externals: DEV ? [{
    // 'vue': 'Vue'
  // }] : [],

  plugins:[
    // 优化模块加载顺序
    new webpack.optimize.OccurenceOrderPlugin(true),

    // 变量定义，以便在开发阶段使用
    new DefinePlugin(GLOBALS),

    new webpack.ProvidePlugin({
      Vue: 'vue'
    })
  ].concat(DEV ? [
    // 代码热替换
    new webpack.HotModuleReplacementPlugin(),

    // 禁止调试模式报错
    new webpack.NoErrorsPlugin()
  ] : [
    // 抽取 CSS 到独立的文件
    new ExtractTextPlugin('styles/[name].css'),

    // 合并相同
    new webpack.optimize.DedupePlugin(),

    // 代码压缩
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    // 最大限度地合并相似模块
    new webpack.optimize.AggressiveMergingPlugin()
  ])
};

exports.config = config;
exports.webpackConfig = webpackConfig;
