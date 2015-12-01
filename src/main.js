var Vue = require('vue');

// require('input-placeholder-polyfill');
// var VueResource = require('vue-resource');
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
// Vue.use(VueResource);
// Vue.http.options.root = 'http://42.121.122.228:8887/v2';

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

// Mixins
Vue.mixin({
  created: function () {
    var documentTitle = this.$options.documentTitle;
    if (documentTitle) {
      document.title = documentTitle + ' | 云智易物联平台';
    }
  }
});

// Directives
// ------------------------------

// 占位符
Vue.directive('placeholder', {
  bind: function () {
    var self = this;
    var vModel;
    var handlePlaceholder = function () {
      if (this.input.value.length === 0) {
        this.placeholder.style.display = 'inline';
      } else {
        this.placeholder.style.display = 'none';
      }
    };

    this.placeholder = document.createElement('span');
    this.placeholder.className = 'placeholder';
    this.el.appendChild(this.placeholder);

    this.input = this.el.getElementsByClassName('input-text')[0];
    vModel = this.input.getAttribute('v-model');
    console.log(vModel);

    if (vModel) {
      this.vm.$watch(vModel, function (value, oldValue) {
        if (value === 0) {
          self.placeholder.style.display = 'inline';
        } else {
          self.placeholder.style.display = 'none';
        }
      }, { immediate: true });
    }

    this.input.addEventListener('input', function () {
      handlePlaceholder.apply(self);
    });

    this.placeholder.addEventListener('click', function () {
      self.input.focus();
    });

    this.input.addEventListener('blur', function () {
      handlePlaceholder.apply(self);
    });

    handlePlaceholder.apply(this);
  },

  update: function (value) {
    this.placeholder.innerText = value;
  }
});

// 路由
router = new VueRouter({
  // history: true,
  // saveScrollPosition: true
});

configRouter(router);

router.start(App, '#app');
