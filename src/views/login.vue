<template>
  <div class="form form-auth form-login">
    <div class="form-logo"></div>
    <form v-form name="validation" @submit.prevent="onSubmit" hook="loginFormHook" class="form-cont">
      <div class="form-header">
        <span>{{ $t("auth.login") }}</span>
        <a v-link="{ path: '/register' }">{{ $t("auth.register") }}</a>
      </div>
      <div class="form-body">
        <div class="form-row">
          <div v-placeholder="$t('auth.email_phone')" class="input-text-wrap">
            <input type="text" v-model="model.account" v-form-ctrl name="account" required lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.account.$pristine" class="form-tips form-tips-error">
            <span v-if="validation.account.$error.required">{{ $t('validation.required', {field: $t('auth.fields.account')}) }}</span>
          </div>
          <div v-if="validation.account.$dirty" class="form-tips form-tips-error">
            <span v-if="validation.account.$error.required">{{ $t('validation.required', {field: $t('auth.fields.account')}) }}</span>
          </div>
        </div>
        <div class="form-row">
          <div v-placeholder="$t('auth.password')" class="input-text-wrap">
            <input type="password" v-model="model.password" v-form-ctrl name="password" required lazy class="input-text focus-input"/>
          </div>
          <div v-if="validation.$submitted && validation.password.$pristine" class="form-tips form-tips-error">
            <span v-if="validation.password.$error.required">{{ $t('validation.required', {field: $t('auth.fields.password')}) }}</span>
          </div>
          <div v-if="validation.password.$dirty" class="form-tips form-tips-error">
            <span v-if="validation.password.$error.required">{{ $t('validation.required', {field: $t('auth.fields.password')}) }}</span>
          </div>
        </div>
        <div class="operations"><a v-link="{ path: '/fetch-password-bymail' }" class="fetch-password">{{ $t("auth.forget") }}</a>
          <label class="remember-password">
            <input type="checkbox" v-model="rememberPwd"/><span>{{ $t("auth.remember") }}</span>
          </label>
        </div>
        <div class="form-actions">
          <button @keyup.enter="onSubmit" :disabled="logining" :class="{'disabled':logining}" v-text="logining ? $t('auth.login_submiting') : $t('auth.login_submit')" class="btn btn-primary btn-block focus-input">{{ $t("auth.login_submit") }}</button>
        </div>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </form>
  </div>
</template>

<script>
  import api from '../api'
  import { globalMixins } from '../mixins'
  import { setLoadingStatus } from '../store/actions/system'
  import store from '../store/index'

  export default {
    name: 'LoginForm',

    layout: 'auth',

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
        validation: {},
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
        if (this.validation.$valid) {
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

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-login
    .operations
      clearfix()
      margin 25px 0

      .fetch-password
        float right
        color red

      .remember-password
        input
          margin-right 5px

  .loading-resource
    .form-auth
      .form-actions
        .btn
          cursor wait
</style>
