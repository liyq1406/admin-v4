import Vue from 'vue'
import { setLayouts, showError, showNotice } from './store/actions/system'
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
    actions: {
      setLayouts,
      showError,
      showNotice
    }
  },

  created () {
    // 切换布局
    var layouts = this.$options.layouts
    if (layouts) {
      this.setLayouts(layouts)
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
        this.showNotice({
          type: 'error',
          content: locales[Vue.config.lang].errors[err.data.error.code] || '请求出错'
        })
        switch (err.data.error.code) {
          case 4031003:
            alert('出错 即将跳回登录页')
            // this.showNotice({
            //   type: 'error',
            //   content: locales[Vue.config.lang].errors[err.data.error.code]
            // })
            this.$route.router.go('/login')
            break
          default:
            // this.showError(err.data.error)
        }
      }
    }
  }
}
