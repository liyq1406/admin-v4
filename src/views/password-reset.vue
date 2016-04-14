<template>
  <div class="form form-auth form-fetch-password">
    <div class="form-logo"></div>
    <form v-show="!resetsuccess" v-form name="validation" @submit.prevent="onSubmit" class="form-cont">
      <div class="form-header">
        <h2>{{ $t("auth.reset") }}</h2>
      </div>
      <div class="form-body">
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
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-block">{{ $t("common.ok") }}</button>
        </div>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </form>
    <div v-show="resetsuccess" class="form-cont reset-password-success">
      <div class="alert alert-success">
        <div class="fa fa-check-circle-o"></div>
        <h2>{{ $t("auth.reset_success") }}</h2>
        <p>{{ $t("auth.reset_success_msg") }}</p>
      </div>
      <div class="form-actions"><a v-link="{ path: '/login'}" class="btn btn-primary btn-block">{{ $t("common.ok") }}</a></div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
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
        email: '',
        verifycode: '',
        validation: {},
        model: {},
        confirmPassword: '',
        resetsuccess: false,
        sending: false
      }
    },

    route: {
      data () {
        this.email = base64.decode(this.$route.params.email)
        this.verifycode = base64.decode(this.$route.params.verifycode)
      }
    },

    methods: {
      checkEqualToPassword (value) {
        return value === this.model.password
      },

      onSubmit () {
        var params = {email: this.email, verifycode: this.verifycode, password: this.model.password}

        if (this.validation.$valid && !this.sending) {
          this.sending = true
          api.corp.resetPasswordByMail(params).then((res) => {
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
