import Vue from 'vue'
import { setLayout, showError, showNotice } from './store/actions/system'
import locales from './consts/locales/index'

export var globalMixins = {
  data () {
    return {
      debug: process.env.NODE_ENV !== 'production'
    }
  },

  vuex: {
    actions: {
      setLayout,
      showError,
      showNotice
    }
  },

  created () {
    // 切换布局
    var layout = this.$options.layout
    if (layout) {
      this.setLayout(layout)
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
            this.showNotice({
              type: 'error',
              content: locales[Vue.config.lang].errors[err.data.error.code]
            })
            this.$route.router.go('/login')
            break
          default:
            this.showError(err.data.error)
        }
      }
    }
  }
}
