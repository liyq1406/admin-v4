<template>
  <div class="form form-auth form-fetch-password">
    <div class="form-logo"><a v-link="{path: '/login'}" class="fa fa-chevron-circle-left link-return"></a></div>
    <form v-show="!resetsuccess" v-form name="validation" @submit.prevent="onSubmit" class="form-cont">
      <div class="form-header">
        <h2>{{ $t("auth.fetch") }}</h2>
        <p>{{ $t("auth.by_phone_tips") }}</p>
      </div>
      <div class="form-body">
        <div class="form-row">
          <div v-placeholder="$t('auth.fields.phone')" class="input-text-wrap">
            <input type="text" v-model="model.phone" v-form-ctrl required pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" name="phone" lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.phone.$pristine" class="form-tips form-tips-error">
            <span v-if="validation.phone.$error.required">{{ $t('validation.required', {field: $t('auth.fields.phone')}) }}</span>
          </div>
          <div v-if="validation.phone.$dirty" class="form-tips form-tips-error">
            <span v-if="validation.phone.$error.required">{{ $t('validation.required', {field: $t('auth.fields.phone')}) }}</span>
            <span v-if="validation.phone.$error.pattern">{{ $t('validation.format', {field: $t('auth.fields.phone')}) }}</span>
          </div>
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
          <div v-placeholder="$t('auth.password')" class="input-text-wrap">
            <input type="password" v-model="model.password" v-form-ctrl required maxlength="16" minlength="6" name="password" lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.password.$pristine" class="form-tips form-tips-error">
            <span v-if="validation.password.$error.required">{{ $t('validation.required', {field: $t('auth.fields.password')}) }}</span>
          </div>
          <div v-if="validation.password.$dirty" class="form-tips form-tips-error">
            <span v-if="validation.password.$error.required">{{ $t('validation.required', {field: $t('auth.fields.password')}) }}</span>
            <span v-if="validation.password.$error.minlength">{{ $t('validation.minlength', [ $t('auth.fields.password'), 6]) }}</span>
            <span v-if="validation.password.$error.maxlength">{{ $t('validation.maxlength', [ $t('auth.fields.password'), 16]) }}</span>
          </div>
        </div>
        <div class="form-row">
          <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
            <input type="password" v-model="confirmPassword" v-form-ctrl required custom-validator="checkEqualToPassword" name="confirmPassword" lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.confirmPassword.$pristine" class="form-tips form-tips-error">
            <span v-if="validation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span>
          </div>
          <div v-if="validation.confirmPassword.$dirty" class="form-tips form-tips-error">
            <span v-if="model.password && validation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span>
            <span v-if="validation.confirmPassword.$error.customValidator">{{ $t("auth.confirm_password_tips") }}</span>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-block">{{ $t("common.ok") }}</button>
        </div>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </form>
    <div v-show="resetsuccess" class="form-cont reset-password-success">
      <div class="alert alert-success">
        <div class="icon icon-success"></div>
        <h2>{{ $t("auth.by_phone_success") }}</h2>
        <p>{{ $t("auth.by_phone_success_msg") }}</p>
      </div>
      <div class="form-actions">
        <a v-link="{ path: '/login'}" class="btn btn-primary btn-block">{{ $t("common.ok") }}</a>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </div>
  </div>
</template>

<script>
  import api from '../api'
  import config from '../consts/config'
  import Captcha from '../components/Captcha'

  export default {
    name: 'FetchPwdForm',

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
        seconds: config.verifycodeDuration,
        resetsuccess: false
      }
    },

    methods: {
      getObjLength (obj) {
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
            this.seconds = config.verifycodeDuration
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

        this.btnDisabled = true
        this.captcha = ''
        this.$refs.captcha.generate()
        api.sms.getVerifycode({
          phone: this.model.phone
        }).then((res) => {
          if (res.status === 200) {
            this.counting = true
            this.tiktac()
          }
        }).catch((error) => {
          this.handleError(error)
        })
      },

      onSubmit () {
        var content = {'phone': this.model.phone, 'verifycode': this.model.verifycode, 'password': this.model.password}

        api.corp.resetPassword(content).then((res) => {
          if (res.data === 200) {
            this.resetsuccess = true
          }
        }).catch((error) => {
          this.handleError(error)
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-auth.form-fetch-password
    .form-logo
      position relative

    .link-return
      font-size 20px
      absolute left top 35px

    .form-cont
      padding-left 100px
      padding-right 100px

    .form-header
      padding 0
      margin-bottom 30px

    .form-body
      padding 0

    .form-actions
      margin-top 30px

    .captcha-row
      clearfix()

      .input-text-wrap
        float left
        width 220px
        margin-right 10px

      .captcha
        float left
        width 120px

    .verify-code
      .input-text-wrap
        float left
        width 220px
        margin-right 10px

      .btn
        float left
        width 120px
        height 36px
        line-height 36px
</style>
