<template>
  <div v-show="!validating" class="form form-auth form-fetch-password">
    <form v-show="verifycodeValid && !resetsuccess" v-form name="validation" @submit.prevent="onSubmit" class="form-cont">
      <div class="form-header">
        <h2>{{ $t("auth.reset") }}</h2>
      </div>
      <div class="form-body">
        <div class="form-row">
          <div v-placeholder="$t('auth.password')" class="input-text-wrap">
            <input type="password" v-model="model.new_password" v-form-ctrl required maxlength="16" minlength="6" name="new_password" lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.new_password.$pristine" class="form-tips form-tips-error"><span v-if="validation.new_password.$error.required">{{ $t('validation.required', {field: $t('auth.fields.password')}) }}</span></div>
          <div v-if="validation.new_password.$dirty" class="form-tips form-tips-error"><span v-if="validation.new_password.$error.required">{{ $t('validation.required', {field: $t('auth.fields.password')}) }}</span><span v-if="validation.new_password.$error.minlength">{{ $t('validation.minlength', [ $t('auth.fields.password'), 6]) }}</span><span v-if="validation.new_password.$error.maxlength">{{ $t('validation.maxlength', [ $t('auth.fields.password'), 16]) }}</span></div>
        </div>
        <div class="form-row">
          <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
            <input type="password" v-model="confirmPassword" v-form-ctrl required custom-validator="checkEqualToPassword" name="confirmPassword" lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.confirmPassword.$pristine" class="form-tips form-tips-error"><span v-if="validation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span></div>
          <div v-if="validation.confirmPassword.$dirty" class="form-tips form-tips-error"><span v-if="model.password && validation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span><span v-if="validation.confirmPassword.$error.customValidator">{{ $t("auth.confirm_password_tips") }}</span></div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-block">{{ $t("common.ok") }}</button>
        </div>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </form>
    <div v-show="!verifycodeValid && !resetsuccess" class="form-cont reset-password-fail">
      <div class="alert alert-fail">
        <div class="fa fa-times-circle-o"></div>
        <h2>{{ $t("auth.activate_fail_msg") }}</h2>
      </div>
    </div>
    <div v-show="resetsuccess" class="form-cont reset-password-success">
      <div class="alert alert-success">
        <div class="fa fa-check-circle-o"></div>
        <h2>{{ $t("auth.reset_success") }}</h2>
        <p>{{ $t("auth.reset_success_msg") }}</p>
        <div class="actions"><a v-link="{ path: '/login'}" class="btn btn-primary">{{ $t("common.ok") }}</a></div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../api'
  import base64 from '../helpers/base64'
  import { globalMixins } from '../mixins'

  export default {
    name: 'PwdResetForm',

    layout: 'auth',

    mixins: [globalMixins],

    data () {
      return {
        corp_id: '',
        email: '',
        verifycode: '',
        validation: {},
        model: {},
        confirmPassword: '',
        resetsuccess: false,
        sending: false,
        verifycodeValid: false,
        validating: true
      }
    },

    route: {
      data () {
        this.corp_id = base64.decode(this.$route.params.corp_id)
        this.email = base64.decode(this.$route.params.email)
        this.verifycode = base64.decode(this.$route.params.verifycode)

        var params = {corp_id: this.corp_id, email: this.email, verifycode: this.verifycode}
        api.corp.validVerifycode(params).then((res) => {
          if (res.status === 200) {
            this.verifycodeValid = true
          }
          this.validating = false
        }).catch((res) => {
          if (res.error.code === 4001028) {
            this.validating = false
          } else {
            this.handleError(res)
          }
        })
      }
    },

    methods: {
      checkEqualToPassword (value) {
        return value === this.model.new_password
      },

      onSubmit () {
        var params = {corp_id: this.corp_id, email: this.email, verifycode: this.verifycode, new_password: this.model.new_password}

        if (this.validation.$valid && !this.sending) {
          this.sending = true
          api.corp.resetUserPasswordByMail(params).then((res) => {
            if (res.status === 200) {
              this.resetsuccess = true
              this.sending = false
            }
          }).catch((res) => {
            this.handleError(res)
            this.sending = false
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
.reset-password-fail
  .alert
    h2
      padding-top 10px
</style>
