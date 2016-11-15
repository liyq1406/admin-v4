import Vue from 'vue'
import VueRouter from 'vue-router'
import VueForm from 'vue-form'
import VueVlidator from 'vue-validator'
import i18n from 'vue-i18n'
import browser from 'utils/browser'

// 全局 Mixins
import { globalMixins } from './mixins'

// 全局组件
import components from 'src/components'

// 多语言配置文件
import locales from './consts/locales/index'

// 指令
import directives from './directives/index'

// 过滤器
import filters from './filters/index'

// 表单验证器
import * as validators from './validators'

// 路由设置
import configRouter from './route-config'

// 创建 vue 实例
var App = Vue.extend(require('./App'))

var router

// 调试模式
Vue.config.debug = process.env.NODE_ENV === 'production'

// 加载路由插件
Vue.use(VueRouter)

// 加载表单验证插件
// 详见：https://github.com/fergaldoyle/vue-form
Vue.use(VueForm)
Vue.use(VueVlidator)

// 加载多语言插件
// 手动切换语言设置 `Vue.config.lang = 'en-us'`
// 详见：https://github.com/kazupon/vue-i18n
let browserLang = browser.language === 'zh-cn' || browser.language === 'zh-tw' ? 'zh-cn' : 'en-us'
let lang = window.localStorage.getItem('lang')

Vue.use(i18n, {
  // 根据浏览器语言自动进行语言切换，默认为'en-us'
  lang: lang || browserLang,
  // lang: 'zh-cn',
  locales: locales
})

// 注册全局指令
// ------------------------------
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key])
})

// 注册全局过滤器
// ------------------------------
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})

// 注册全局验证器
// ------------------------------
Object.keys(validators).forEach((key) => {
  Vue.validator(key, validators[key])
})

/**
 * 用户反馈类别过滤器
 */
Vue.filter('formatTags', {
  read (val) {
    let cateStr = ''
    val.map((tag, index) => {
      cateStr += tag
      // if (tag.sub.length) {
      //   cateStr += ':'
      //   tag.sub.map((item, i) => {
      //     cateStr += item
      //     if (i < tag.sub.length - 1) {
      //       cateStr += ','
      //     }
      //   })
      // }
      if (index < val.length - 1) {
        cateStr += '\n'
      }
    })
    return cateStr
  },

  write (val, oldVal) {
    let ret = []
    let arr = val.split('\n')
    arr.map((item, index) => {
      if (item.length) {
        let string = ''
        let temp = item
        string = temp
        // if (temp[1]) {
        //   let subArr = temp[1].split(',')
        //   subArr = subArr.map((item) => {
        //     return item.trim()
        //   })
        //   string.sub = subArr
        // } else {
        //   string.sub = []
        // }
        ret.push(string)
      }
    })
    return ret
  }
})

// 路由及其配置
router = new VueRouter({
  // history: true,
  // saveScrollPosition: true
})
configRouter(router)

// 注册全局 Mixins
Vue.mixin(globalMixins)

// 注册全局组件
Vue.use(components)

// 启动 App
router.start(App, '#app')
