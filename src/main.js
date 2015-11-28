var Vue = require('vue');

var VueResource = require('vue-resource');
var VueRouter = require('vue-router');
var VueForm = require('vue-form');
var i18n = require('vue-i18n');

// 多语言配置文件
var locales = require('./consts/locales');

// 路由设置
var configRouter = require('./route-config');
var router;

var App = Vue.extend(require('./app.vue'));

Vue.config.debug = true;

// 使用资源插件
Vue.use(VueResource);
Vue.http.options.root = 'http://42.121.122.228:8887/v2';

// 加载路由插件
Vue.use(VueRouter);

// 使用表单验证插件
// 详见：https://github.com/fergaldoyle/vue-form
Vue.use(VueForm);

// 使用多语言插件
// 切换语言设置 `Vue.config.lang = 'en'`
// 详见：https://github.com/kazupon/vue-i18n
Vue.use(i18n, {
  lang: 'zh_cn',
  locales: locales
});

// 路由
router = new VueRouter({
  // history: true,
  // saveScrollPosition: true
});

configRouter(router);

router.start(App, '#app');
