import Vue from 'vue'
import { setLayouts, showError, showNotice, showAlertBar, removeAlertBar } from './store/actions/system'
import locales from './consts/locales/index'
import * as patterns from './consts/patterns'

export var globalMixins = {
  data () {
    return {
      lang: Vue.config.lang,
      locales: locales[Vue.config.lang],
      debug: process.env.NODE_ENV !== 'production',
      patterns: patterns
    }
  },

  vuex: {
    getters: {
      alertMsg: ({ system }) => system.alertMsg
    },
    actions: {
      setLayouts,
      showError,
      showNotice,
      showAlertBar,
      removeAlertBar
    }
  },

  created () {
    // 切换布局
    var layouts = this.$options.layouts
    if (layouts) {
      this.setLayouts(layouts)
    }
  },

  route: {
    canDeactivate () {
      if (this.alertMsg) {
        this.removeAlertBar()
      }
    }
  },

  methods: {
    // 注：以下方法可以在视图中直接引用，不需要声明，
    // 且会被视图中声明的同名方法覆盖

    /**
     * 检验目标是否为数字类型
     * @param  {Object} value 待检验目标
     * @return {Boolean}
     */
    numberic (value) {
      return /^\d*$/.test(value)
    },

    /**
     * 检验字符串中是否不含空格
     * @param  {String} value 待检验目标字符串
     * @return {Boolean}
     */
    noSpaces (value) {
      return /^\S+$/.test(value)
    },

    /**
     * 检验字符串中是否不以空格开头或结尾
     * @param  {String} value 待检验目标字符串
     * @return {Boolean}
     */
    noSpacesPrefixAndSuffix (value) {
      return /^\S(.*\S)*$/.test(value)
    },

    handleError (err) {
      // console.log(err)
      if (typeof err.data !== 'undefined' && typeof err.data.error !== 'undefined') {
        switch (err.data.error.code) {
          case 4031003:
            // console.log('即将返回登录页面, 错误信息如下')
            // console.log(err)
            // this.showNotice({
            //   type: 'error',
            //   content: locales[Vue.config.lang].errors[err.data.error.code]
            // })
            this.showNotice({
              type: 'error',
              content: locales[Vue.config.lang].errors[err.data.error.code]
            })
            this.$route.router.go('/login')
            break
          case 4001144:
            this.showAlertBar(this.locales.data.ALERT_MESSAGES['not_authorized'])
            this.showNotice({
              type: 'error',
              content: '您尚未获得此应用的使用权限'
            })
            break
          default:
            this.showNotice({
              type: 'error',
              content: locales[Vue.config.lang].errors[err.data.error.code] || '请求出错'
            })
            // this.showError(err.data.error)
        }
      }
    }
  }
}
