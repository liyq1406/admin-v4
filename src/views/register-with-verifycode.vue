<template>
  <div class="form form-auth form-register">
    <div class="form-logo"></div>
    <form v-form name="validation" @submit.prevent="onSubmit" class="form-cont">
      <div class="form-header"><a v-link="{ path: '/login' }">{{ $t("auth.login") }}</a><span>{{ $t("auth.register") }}</span></div>
      <div class="form-body">
        <div class="form-hints">{{ $t("auth.account_tips") }}</div>
        <div class="form-row-group">
          <div class="form-row">
            <div v-placeholder="$t('auth.fields.email')" class="input-text-wrap">
              <input type="email" v-model="model.email" v-form-ctrl name="email" required lazy class="input-text"/>
            </div>
            <div v-if="validation.$submitted && validation.email.$pristine" class="form-tips form-tips-error"><span v-if="validation.email.$error.required">{{ $t('validation.required', {field: $t('auth.fields.email')}) }}</span></div>
            <div v-if="validation.email.$dirty" class="form-tips form-tips-error"><span v-if="validation.email.$error.required">{{ $t('validation.required', {field: $t('auth.fields.email')}) }}</span><span v-if="validation.email.$error.email">{{ $t('validation.format', {field: $t('auth.fields.email')}) }}</span></div>
          </div>
          <div class="form-row">
            <div v-placeholder="$t('auth.password')" class="input-text-wrap">
              <input type="password" v-model="model.password" v-form-ctrl required maxlength="16" minlength="6" name="password" lazy class="input-text"/>
            </div>
            <div v-if="validation.$submitted && validation.password.$pristine" class="form-tips form-tips-error"><span v-if="validation.password.$error.required">{{ $t('validation.required', {field: $t('auth.fields.password')}) }}</span></div>
            <div v-if="validation.password.$dirty" class="form-tips form-tips-error"><span v-if="validation.password.$error.required">{{ $t('validation.required', {field: $t('auth.fields.password')}) }}</span><span v-if="validation.password.$error.minlength">{{ $t('validation.minlength', [ $t('auth.fields.password'), 6]) }}</span><span v-if="validation.password.$error.maxlength">{{ $t('validation.maxlength', [ $t('auth.fields.password'), 16]) }}</span></div>
          </div>
          <div class="form-row">
            <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
              <input type="password" v-model="confirmPassword" v-form-ctrl required custom-validator="checkEqualToPassword" name="confirmPassword" lazy class="input-text"/>
            </div>
            <div v-if="validation.$submitted && validation.confirmPassword.$pristine" class="form-tips form-tips-error"><span v-if="validation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span></div>
            <div v-if="validation.confirmPassword.$dirty" class="form-tips form-tips-error"><span v-if="model.password && validation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span><span v-if="validation.confirmPassword.$error.customValidator">{{ $t("auth.confirm_password_tips") }}</span></div>
          </div>
        </div>
        <div class="form-hints">{{ $t("auth.basic_tips") }}</div>
        <div class="form-row-group">
          <div class="form-row">
            <div v-placeholder="$t('auth.fields.name')" class="input-text-wrap">
              <input type="text" v-model="model.name" v-form-ctrl required maxlength="32" minlength="2" name="name" lazy class="input-text"/>
            </div>
            <div v-if="validation.$submitted && validation.name.$pristine" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('validation.required', {field: $t('auth.fields.name')}) }}</span></div>
            <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('validation.required', {field: $t('auth.fields.name')}) }}</span><span v-if="validation.name.$error.minlength">{{ $t('validation.minlength', [ $t('auth.fields.name'), 2]) }}</span><span v-if="validation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('auth.fields.name'), 32]) }}</span></div>
          </div>
          <div class="form-row">
            <div v-placeholder="$t('auth.fields.phone')" class="input-text-wrap">
              <input type="text" v-model="model.phone" v-form-ctrl required pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" name="phone" lazy class="input-text"/>
            </div>
            <div v-if="validation.$submitted && validation.phone.$pristine" class="form-tips form-tips-error"><span v-if="validation.phone.$error.required">{{ $t('validation.required', {field: $t('auth.fields.phone')}) }}</span></div>
            <div v-if="validation.phone.$dirty" class="form-tips form-tips-error"><span v-if="validation.phone.$error.required">{{ $t('validation.required', {field: $t('auth.fields.phone')}) }}</span><span v-if="validation.phone.$error.pattern">{{ $t('validation.format', {field: $t('auth.fields.phone')}) }}</span></div>
          </div>
          <div class="form-row captcha-row">
            <div v-placeholder="$t('auth.insert_code')" class="input-text-wrap">
              <input type="text" v-model="captcha" lazy class="input-text"/>
            </div>
            <captcha :width="120" :height="32" :value.sync="captchaValue" v-ref:captcha></captcha>
          </div>
          <div class="form-row verify-code">
            <div v-placeholder="$t('auth.verifycode')" class="input-text-wrap">
              <input type="text" v-model="model.verifycode" v-form-ctrl required name="verifycode" lazy class="input-text"/>
            </div>
            <button @click.stop.prevent="fetchVerifyCode" :class="{'disabled': btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()}" v-bind="{'disabled': btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()}" v-text="counting ? $t('auth.wating', {seconds: seconds}) : $t('auth.get_code')" class="btn btn-primary"></button>
            <div v-if="validation.$submitted && validation.verifycode.$pristine" class="form-tips form-tips-error"><span v-if="validation.verifycode.$error.required">{{ $t('validation.required', {field: $t('auth.verifycode')}) }}</span></div>
            <div v-if="validation.verifycode.$dirty" class="form-tips form-tips-error"><span v-if="validation.verifycode.$error.required">{{ $t('validation.required', {field: $t('auth.verifycode')}) }}</span></div>
          </div>
          <div class="form-row">
            <div v-placeholder="$t('auth.fields.company')" class="input-text-wrap">
              <input type="text" v-model="model.company" v-form-ctrl required maxlength="32" name="company" lazy class="input-text"/>
            </div>
            <div v-if="validation.$submitted && validation.company.$pristine" class="form-tips form-tips-error"><span v-if="validation.company.$error.required">{{ $t('validation.required', {field: $t('auth.fields.company')}) }}</span></div>
            <div v-if="validation.company.$dirty" class="form-tips form-tips-error"><span v-if="validation.company.$error.required">{{ $t('validation.required', {field: $t('auth.fields.company')}) }}</span><span v-if="validation.company.$error.maxlength">{{ $t('validation.maxlength', [ $t('auth.fields.company'), 32]) }}</span></div>
          </div>
          <div class="form-row">
            <div class="select">
              <select v-model="model.type" v-form-ctrl name="type" custom-validator="checkTypeValid">
                <option selected="selected">{{ $t("auth.type_tips") }}</option>
                <option v-for="type in accountTypes" :value="$index + 1">{{ type }}</option>
              </select>
            </div>
            <div v-if="validation.$submitted" class="form-tips form-tips-error"><span v-if="validation.type.$error.customValidator">{{ $t("auth.type_tips") }}</span></div>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-block">{{ $t("auth.register_submit") }}</button>
        </div>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </form>
  </div>
</template>

<script>
  import api from '../api'
  import config from '../consts/config'
  import locales from '../consts/locales/index'
  import Captcha from '../components/Captcha'
  import { globalMixins } from '../mixins'

  export default {
    name: 'RegisterForm',

    layout: 'auth',

    mixins: [globalMixins],

    components: {
      'captcha': Captcha
    },

    data () {
      return {
        validation: {},
        captcha: '',
        captchaValue: '',
        model: {},
        confirmPassword: '',
        verifycodeValid: false,
        counting: false,
        btnDisabled: false,
        accountTypes: locales[Vue.config.lang].accountTypes,
        seconds: config.verifycode.duration
      }
    },

    methods: {
      getObjLength:function (obj){
        return Object.keys(obj).length
      },

      checkEqualToPassword (value) {
        return value === this.model.password
      },

      checkTypeValid (value) {
        return Number(value) > 0
      },

      tiktac () {
        var itvl = window.setInterval(() => {
          if (this.seconds) {
            this.seconds--
          } else {
            this.seconds = config.verifycode.duration
            this.counting = false
            this.btnDisabled = false
            window.clearInterval(itvl)
          }
        }, 1000)
      },

      fetchVerifyCode () {
        if (this.validation.phone.$invalid) {
          window.alert(this.$t('auth.phone_msg'))
          return
        }

        this.btnDisabled=true
        this.captcha = ''
        this.$refs.captcha.generate()
        api.sms.getVerifycode({
          phone: this.model.phone
        }).then((res) => {
          if (res.status === 200) {
            this.counting = true
            this.tiktac()
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 提交注册
       */
      onSubmit () {
        if (this.validation.$valid) {
          api.corp.register(this.model).then((res) => {
            if (res.status === 200) {
              window.alert(this.$t('auth.register_success'))
              this.$route.router.go({path: '/login'})
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-register
    .captcha-row
      clearfix()

      .input-text-wrap
        float left
        width 190px
        margin-right 10px

      .captcha
        float left
        width 120px

    .verify-code
      clearfix()

      .input-text-wrap
        float left
        width 190px
        margin-right 10px

      .btn
        float left
        width 120px
        height 36px
        line-height 36px
</style>
