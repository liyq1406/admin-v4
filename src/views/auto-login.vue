<template>
  <div>
    <loginarea></loginarea>
    <div class="auth-form login-form">
      <div class="inner">
        <div class="form-legend">{{ $t('auth.platform_name') }}</div>
        <div class="form">
          <validator name="authValidation">
            <form autocomplete="off" novalidate @submit.prevent="onSubmit">
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
      <div class="old-entrance" v-if="isShowOldEntrance">
        <a href="http://admin-v3.xlink.cn/" target="_blank">{{ $t('auth.old_entrance') }} &gt;</a>
      </div>
    </div>
  </div>
</template>

<script>
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
        isShowOldEntrance: IS_SHOW_OLD_ENTRANCE,
        model: {
          account: '',
          password: ''
        },
        isLoginSuccess: false
      }
    },

    route: {
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
      window.localStorage.setItem('memberId', '123')
      this.model.account = 'demo'
      this.model.password = 'demo'
      this.onSubmit()
    },

    methods: {
      loginFormHook (form) {
        this.loginForm = form
      },

      onSubmit () {
        api.corp.auth(this.model).then((res) => {
          this.isLoginSuccess = true
          this.$route.router.replace({path: '/operation/overview'})
        }).catch((res) => {
          this.handleError(res)
        })
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

  .old-entrance
    width 500px
    margin 10px auto 0
    text-align right

    a
      margin-right 10px
      color #CCC
</style>
