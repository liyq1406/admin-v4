<template>
  <div v-show="!validating" class="auth-form fetch-form">
    <div class="inner" v-show="verifycodeValid && !resetsuccess">
      <a v-link="{path: '/login'}" class="fa fa-chevron-circle-left link-return"></a>
      <div class="form-legend">{{ $t("auth.reset") }}</div>
      <div class="form">
        <validator name="authValidation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmit">
            <div class="form-row">
              <div v-placeholder="$t('auth.password')" class="input-text-wrap">
                <input type="password" v-model="model.password" name="model.password" v-validate:password="{required: true, minlength: 6, maxlength: 16}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.password.touched && $authValidation.password.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
                <span v-if="$authValidation.password.modified && $authValidation.password.minlength">{{ $t('common.validation.minlength', [$t('auth.fields.password'), 6]) }}</span>
                <span v-if="$authValidation.password.modified && $authValidation.password.maxlength">{{ $t('common.validation.maxlength', [$t('auth.fields.password'), 16]) }}</span>
              </div>
            </div>
            <div class="form-row">
              <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
                <input type="password" v-model="confirmPassword" name="confirmPassword" v-validate:confirm-password="{required: true, equal: model.password}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.confirmPassword.touched && $authValidation.confirmPassword.required">{{ $t('common.validation.required', {field: $t('auth.fields.confirm_password')}) }}</span>
                <span v-if="$authValidation.confirmPassword.modified && $authValidation.confirmPassword.equal">{{ $t('common.validation.equal', [$t('auth.fields.confirm_password'), $t('auth.fields.password')]) }}</span>
              </div>
            </div>
            <div class="form-actions">
              <button @keyup.enter="onSubmit" :disabled="sending" :class="{'disabled':sending}" v-text="sending ? $t('common.handling') : $t('common.ok')" class="btn btn-primary btn-xlg btn-pill">{{ $t("common.ok") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </div>
    <div class="auth-msg-box" v-show="!verifycodeValid && !resetsuccess">
      <x-alert :cols="16" type="error">
        <p>{{ $t("auth.activate_fail_msg") }}</p>
        <div class="actions"><a v-link="{ path: '/login'}" class="btn btn-primary btn-pill">{{ $t("common.ok") }}</a></div>
      </x-alert>
    </div>
    <div class="auth-msg-box" v-show="resetsuccess">
      <x-alert :cols="16" type="success" :title="$t('auth.reset_success')">
        <p>{{ $t("auth.reset_success_msg") }}</p>
        <div class="actions"><a v-link="{ path: '/login'}" class="btn btn-primary btn-pill">{{ $t("common.ok") }}</a></div>
      </x-alert>
    </div>
  </div>
  <!-- <div v-show="!validating" class="form form-auth form-fetch-password">
    <form autocomplete="off" v-show="verifycodeValid && !resetsuccess" v-form name="validation" @submit.prevent="onSubmit" class="form-cont">
      <div class="form-header">
        <h2>{{ $t("auth.reset") }}</h2>
      </div>
      <div class="form-body">
        <div class="form-row row">
          <div v-placeholder="$t('auth.password')" class="input-text-wrap">
            <input type="password" v-model="model.new_password" v-form-ctrl required maxlength="16" minlength="6" name="new_password" lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.new_password.$pristine" class="form-tips form-tips-error"><span v-if="validation.new_password.$error.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span></div>
          <div v-if="validation.new_password.$dirty" class="form-tips form-tips-error"><span v-if="validation.new_password.$error.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span><span v-if="validation.new_password.$error.minlength">{{ $t('common.validation.minlength', [ $t('auth.fields.password'), 6]) }}</span><span v-if="validation.new_password.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('auth.fields.password'), 16]) }}</span></div>
        </div>
        <div class="form-row row">
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
  </div> -->
</template>

<script>
  import api from 'api'
  import base64 from 'utils/base64'
  import { globalMixins } from 'src/mixins'
  import Alert from 'components/Alert'

  export default {
    name: 'PwdResetForm',

    layouts: ['auth'],

    mixins: [globalMixins],

    components: {
      'x-alert': Alert
    },

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
