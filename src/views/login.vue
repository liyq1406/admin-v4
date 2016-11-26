<template>
  <div>
    <loginarea></loginarea>
    <div class="auth-form login-form">
      <div class="inner">
        <div class="form-legend">{{ $t('layout.platform.name') }}</div>
        <div class="form">
          <validator name="authValidation">
            <form novalidate @submit.prevent="onSubmit">
              <div class="form-row">
                <div v-placeholder="$t('auth.email_phone')" class="input-text-wrap">
                  <input type="text" v-model="model.account" name="model.account" v-validate:account="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$authValidation.account.touched && $authValidation.account.required">{{ $t('common.validation.required', {field: $t('auth.fields.account')}) }}</span>
                </div>
              </div>
              <div class="form-row">
                <div v-placeholder="$t('auth.password')" class="input-text-wrap">
                  <input type="password" v-model="model.password" name="model.password" v-validate:password="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$authValidation.password.touched && $authValidation.password.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
                </div>
              </div>
              <div class="form-row row-check">
                <a v-link="{ path: '/fetch-password-bymail' }">{{ $t("auth.forget") }}</a>
                <label class="checkbox">
                  <input type="checkbox" v-model="rememberPwd"/>{{ $t("auth.remember") }}
                </label>
              </div>
              <div class="form-actions">
                <button @keyup.enter="onSubmit" :disabled="logining" :class="{'disabled':logining}" v-text="logining ? $t('auth.login_submitting') : $t('auth.login_submit')" class="btn btn-primary btn-xxlg btn-pill focus-input">{{ $t("auth.login_submit") }}</button>
              </div>
              <div class="form-operations"><a v-link="{ path: '/register' }">{{ $t("auth.register") }}</a></div>
            </form>
          </validator>
        </div>
      </div>
      <div class="extra-actions">
        <div class="old-entrance" v-if="isShowOldEntrance">
          <a href="http://admin-v3.xlink.cn/" target="_blank">{{ $t('auth.old_entrance') }} &gt;</a>
        </div>
        <div class="lang-switcher">
          <a href="#" :class="{'active': currLang === 'zh-cn'}" @click.prevent.stop="switchLanguage('zh-cn')">中文</a> / <a href="#" :class="{'active': currLang === 'en-us'}"  @click.prevent.stop="switchLanguage('en-us')">English</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'api'
  import { setLoadingStatus } from 'store/actions/system'
  import { IS_SHOW_OLD_ENTRANCE } from 'consts/config'
  import Loginarea from 'components/other/layout/Loginarea'

  export default {
    name: 'LoginForm',

    layouts: ['auth'],
    vuex: {
      getters: {
        logining: ({ system }) => system.loading
      },
      actions: {
        setLoadingStatus
      }
    },
    components: {
      Loginarea
    },

    data () {
      return {
        currLang: window.localStorage.getItem('lang'),
        isShowOldEntrance: IS_SHOW_OLD_ENTRANCE,
        model: {
          account: '',
          password: ''
        },
        isLoginSuccess: false,
        rememberPwd: Boolean(this.getCookie('rememberPwd')) || false
      }
    },

    route: {
      canActivate (transition) {
        let userRole = window.localStorage.getItem('userRole')

        if (userRole === 'heavy-buyer') {
          let heavyBuyerId = window.localStorage.getItem('heavyBuyerId')
          // console.log(transition)
          transition.redirect(`/heavy-buyer-login/${heavyBuyerId}`)
        } else if (userRole === 'dealer') {
          let dealerId = window.localStorage.getItem('dealerId')
          let corpId = window.localStorage.getItem('corpId')
          console.log(corpId)
          console.log('1111')
          transition.redirect(`/dealer/${corpId}/${dealerId}`)
        }

        transition.next()
      },

      deactivate () {
        // 清除插件的token
        window.localStorage.removeItem('pluginsToken')
        // this.setLoadingStatus(false)
        if (this.isLoginSuccess) {
          this.showNotice({
            type: 'success',
            content: this.$t('auth.login_success')
          })
        }
      }
    },

    ready () {
      this.setLoadingStatus(false)
      if (this.rememberPwd) {
        this.model.account = this.getCookie('account')
        this.model.password = this.getCookie('password')
      }
      this.focus()
    },

    methods: {
      /**
       * 切换语言
       */
      switchLanguage (lang) {
        if (lang !== this.currLang) {
          this.currLang = lang
          window.localStorage.setItem('lang', lang)
          Vue.config.lang = lang
          document.location.reload()
        }
      },

      // 设置 Cookies
      setCookie (name, value) {
        var Days = 30
        var exp = new Date()
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
      },

      // 读取 Cookies
      getCookie (name) {
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
        var arr = document.cookie.match(reg) || {}
        if (arr.length) {
          return unescape(arr[2])
        } else {
          return null
        }
      },

      // 删除 Cookies
      delCookie (name) {
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        var cval = this.getCookie(name)
        if (cval != null) {
          document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
        }
      },

      loginFormHook (form) {
        this.loginForm = form
      },

      onSubmit () {
        if (this.$authValidation.valid) {
          this.setLoadingStatus(true)
          api.corp.auth(this.model).then((res) => {
            var today = new Date()
            // window.localStorage.clear()
            window.localStorage.removeItem('pluginsToken')
            window.localStorage.removeItem('memberRole')
            window.localStorage.removeItem('dealerConfig')
            window.localStorage.setItem('memberId', res.data.member_id)
            window.localStorage.setItem('corpId', res.data.corp_id)
            window.localStorage.setItem('accessToken', res.data.access_token)
            window.localStorage.setItem('refreshToken', res.data.refresh_token)
            window.localStorage.setItem('expireIn', res.data.expire_in)
            window.localStorage.setItem('expireAt', today.getTime() + res.data.expire_in * 1000)
            window.localStorage.setItem('userRole', 'member')
            // window.localStorage.setItem('expireAt', today.getTime() + 10000)
            // 设置记住密码
            if (this.rememberPwd) {
              this.setCookie('rememberPwd', true)
              this.setCookie('account', this.model.account)
              this.setCookie('password', this.model.password)
            } else {
              this.delCookie('rememberPwd')
              this.delCookie('account')
              this.delCookie('password')
            }
            this.isLoginSuccess = true
            this.$emit('login-success')
            api.custom.empty() // 清除api缓存
            this.$route.router.replace({path: '/dashboard'})
          }).catch((res) => {
            this.setLoadingStatus(false)
            this.handleError(res)
          })
        }
      },

      /**
       * 首次进入光标移入密码框 然后移动到登录按钮  以解决浏览器记住密码时候v-placeholder的bug
       * @return {[type]} [description]
       */
      focus () {
        var focusInputs = document.getElementsByClassName('focus-input')
        for (var i = 0; i < focusInputs.length; i++) {
          setTimeout(((i) => {
            return function () {
              focusInputs[i].focus()
            }
          })(i), 50 * i)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../assets/stylus/common'

  .login-form
    .row-check
      a
        float right

  // 页脚
  .reg-footer
    .copyright
      color #FFF
      text-align center
      margin 80px 0

  .loading-resource
    .form-auth
      .form-actions
        .btn
          cursor wait

  .extra-actions
    width 500px
    margin 10px auto 0
    color #CCC
    clearfix()

    a
      color #CCC

      &:hover
        color #FFF
        text-decoration underline

      &.active
        color #FFF

    .lang-switcher
      margin-left 10px

    .old-entrance
      float right
      margin-right 10px
</style>
