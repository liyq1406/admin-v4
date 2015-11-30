var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var sequence = require('gulp-sequence');
var jade = require('gulp-jade');
var webpack = require('webpack');
var rimraf = require('rimraf');
var browserSync = require('browser-sync');
var jsonServer = require('json-server');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config').webpackConfig;
var config = require('./webpack.config').config;
var fakeData = require('./data');
var mocha = require('gulp-mocha');

var DEV = webpackConfig.debug;

// 资源服务
gulp.task('webpack-server', function (cb) {
  function createServer () {
    var bundler = webpack(webpackConfig);

    var webpackServer = new WebpackDevServer(bundler, {
      contentBase: config.dirs.src,
      hot: true,
      // 此处需要手动设置 `publicPath` 的值
      publicPath: webpackConfig.output.publicPath,
      // quiet: true,
      filename: 'app.js',
      stats: { colors: true },
      historyApiFallback: true
    });

    // 资源伺服
    webpackServer.listen(config.port, config.devIP, function () {
      gutil.log('Webpack-dev-server is serving files from http://' + config.devIP + ':' + config.port + '...');
    });

  }

  try {
    createServer();
  } catch (err) {
    console.log(err.toString());
  }

  cb();

});

// JSON 服务器
gulp.task('json-server', function() {
  var server = jsonServer.create();
  var router;

  router = jsonServer.router(fakeData);

  server.use(jsonServer.defaults());
  server.use(router);

  server.listen(9090);
});

// HTTP 服务器
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: DEV ? ['./' + config.dirs.pub, 'node_modules', './' + config.dirs.src + '/vendors'] : ['./' + config.dirs.dist]
    }
  });
});

// 打包
gulp.task('bundle', function (cb) {
  var bundler = webpack(webpackConfig);

  function bundle(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    // 打印打包进程消息
    console.log(stats.toString({
      colors: gutil.colors.supportsColor,
      hash: config.verbose,
      version: config.verbose,
      timings: config.verbose,
      chunks: config.verbose,
      chunkModules: config.verbose,
      cached: config.verbose,
      cachedAssets: config.verbose
    }));

    return cb();
  }

  // 执行打包!
  bundler.run(bundle);

});

// 生成 HTML 文件
gulp.task('markup', ['clean'], function () {
  gulp.src(config.markup.src)
    .pipe(jade({
      pretty: '  ',
      locals: config.markup.locals
    }))
    .pipe(gulp.dest(config.markup.dest))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }));
});

// 清理
gulp.task('clean', function(cb) {
  rimraf(DEV ? './' + config.dirs.pub : './' + config.dirs.dist, cb);
});

// 资源
gulp.task('vendors', function() {
  gulp.src('./' + config.dirs.src + '/vendors/**/*.[css|js|jpg|png|gif]')
    .pipe(gulp.dest('./' + config.dirs.dist + '/vendors'));
});

// 监听
gulp.task('watch', function () {
  watch(config.markup.src, function () {
    gulp.start('markup');
  });

});

// 默认任务
gulp.task('default', function(cb) {
  if (DEV) {
    sequence('webpack-server', 'markup', 'serve', 'watch', cb);
  } else {
    sequence('markup', 'bundle', 'vendors', cb);
  }
});
