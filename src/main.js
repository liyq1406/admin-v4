import Vue from 'vue';
import VueRouter from 'vue-router';
import VueForm from 'vue-form';
import i18n from 'vue-i18n';
import browser from './helpers/browser';

// 多语言配置文件
import locales from './consts/locales';

// 指令
import * as directives from './directives';

// 过滤器
import * as filters from './filters';

// 全局混合
import globalMixin from './mixins/global';

// 路由设置
import configRouter from './route-config';

// 创建 vue 实例
var App = Vue.extend(require('./app.vue'));

var router;

// if (__DEBUG__) {
  // console.log('系统语言：' + browser.language);
// }

// 调试模式
Vue.config.debug = __DEBUG__;

// 加载路由插件
Vue.use(VueRouter);

// 加载表单验证插件
// 详见：https://github.com/fergaldoyle/vue-form
Vue.use(VueForm);

// 加载多语言插件
// 手动切换语言设置 `Vue.config.lang = 'en-us'`
// 详见：https://github.com/kazupon/vue-i18n
Vue.use(i18n, {
  // 根据浏览器语言自动进行语言切换，默认为'en-us'
  lang: browser.language === 'zh-cn' || browser.language === 'zh-tw' ? 'zh-cn' : 'en-us',
  // lang: 'zh-cn',
  locales: locales
});

// 注册全局指令
// ------------------------------
Object.keys(directives).forEach(function (key) {
  Vue.directive(key, directives[key]);
});

// 注册全局过滤器
// ------------------------------
Object.keys(filters).forEach(function (key) {
  Vue.filter(key, filters[key]);
});

Vue.filter('formatCategories', {
  read (val) {
    let cateStr = '';
    val.map((category, index) => {
      cateStr += category.main;
      if (category.sub.length) {
        cateStr += ':';
        category.sub.map((item, i) => {
          cateStr += item;
          if (i < category.sub.length - 1) {
            cateStr += ',';
          }
        });
      }
      if (index < val.length - 1) {
        cateStr += '\n';
      }
    });
    return cateStr;
  },

  write (val, oldVal) {
    let ret = [];
    let arr = val.split('\n');
    console.log(arr);
    arr.map((item, index) => {
      if (item.length) {
        let obj = {};
        let temp = item.split(':');
        obj.main = temp[0].trim();
        if (temp[1]) {
          let subArr = temp[1].split(',');
          subArr = subArr.map((item) => {
            return item.trim();
          });
          obj.sub = subArr;
        } else {
          obj.sub = [];
        }
        ret.push(obj);
      }
    });
    return ret;
  }
});

// 注册全局全局混合
// ------------------------------
Vue.mixin(globalMixin);

// 路由及其配置
router = new VueRouter({
  // history: true,
  // saveScrollPosition: true
});
configRouter(router);

// 启动 App
router.start(App, '#app');
