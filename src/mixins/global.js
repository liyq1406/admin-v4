import Vue from 'vue'
import locales from '../consts/locales'

export default {
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

    /**
     * 对错误进行处理
     * @param  {Object} error 错误
     */
    handleError (error) {
      // 处理错误码以4或5开头的错误
      if (error.code && /^[4|5]/.test(error.code)) {
        // 对错误码为4031003的错误作跳转到登录界面的处理
        // 其余直接对用户抛出
        if (error.code === 4031003) {
          this.$route.router.app.access = false
          this.$route.router.go('/login')
        } else {
          window.alert(locales[Vue.config.lang].errors[error.code])
        }
      }
    }
  }
}
