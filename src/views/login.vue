<template>
  <div class="auth-form login-form">
    <div class="inner">
      <div class="form-legend">云智易企业管理台</div>
      <div class="form">
        <validator name="authValidation">
          <form novalidate @submit.prevent="onSubmit">
            <div class="form-row">
              <div v-placeholder="$t('ui.auth.email_phone')" class="input-text-wrap">
                <input type="text" v-model="model.account" name="model.account" v-validate:account="{required: true}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.account.touched && $authValidation.account.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.account')}) }}</span>
              </div>
            </div>
            <div class="form-row">
              <div v-placeholder="$t('ui.auth.password')" class="input-text-wrap">
                <input type="password" v-model="model.password" name="model.password" v-validate:password="{required: true}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.password.touched && $authValidation.password.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.password')}) }}</span>
              </div>
            </div>
            <div class="form-row row-check">
              <a v-link="{ path: '/fetch-password-bymail' }">{{ $t("ui.auth.forget") }}</a>
              <label class="checkbox">
                <input type="checkbox" v-model="rememberPwd"/>{{ $t("ui.auth.remember") }}
              </label>
            </div>
            <div class="form-actions">
              <button @keyup.enter="onSubmit" :disabled="logining" :class="{'disabled':logining}" v-text="logining ? $t('ui.auth.login_submiting') : $t('ui.auth.login_submit')" class="btn btn-primary btn-xlg btn-pill focus-input">{{ $t("ui.auth.login_submit") }}</button>
            </div>
            <div class="form-operations"><a v-link="{ path: '/register' }">{{ $t("ui.auth.register") }}</a></div>
          </form>
        </validator>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  import { globalMixins } from 'src/mixins'
  import { setLoadingStatus } from 'store/actions/system'
  import store from 'store/index'

  export default {
    name: 'LoginForm',

    layouts: ['auth'],

    mixins: [globalMixins],

    store,

    vuex: {
      getters: {
        logining: ({ system }) => system.loading
      },
      actions: {
        setLoadingStatus
      }
    },

    data () {
      return {
        model: {
          account: '',
          password: ''
        },
        isLoginSuccess: false,
        rememberPwd: Boolean(this.getCookie('rememberPwd')) || false
      }
    },

    route: {
      deactivate () {
        // 清除插件的token
        window.localStorage.removeItem('pluginsToken')
        this.setLoadingStatus(false)
        if (this.isLoginSuccess) {
          this.showNotice({
            type: 'success',
            content: '登录成功！'
          })
        }
      }
    },

    ready () {
      if (this.rememberPwd) {
        this.model.account = this.getCookie('account')
        this.model.password = this.getCookie('password')
      }
      this.focus()
    },

    methods: {
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
            window.localStorage.setItem('memberId', res.data.member_id)
            window.localStorage.setItem('corpId', res.data.corp_id)
            window.localStorage.setItem('accessToken', res.data.access_token)
            window.localStorage.setItem('refreshToken', res.data.refresh_token)
            window.localStorage.setItem('expireIn', res.data.expire_in)
            window.localStorage.setItem('expireAt', today.getTime() + res.data.expire_in * 1000)
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
            this.$route.router.go({path: '/dashboard'})
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
</style>
