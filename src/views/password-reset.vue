<template lang="jade">
.form.form-auth.form-fetch-password
  .form-logo
  form.form-cont(v-show="!resetsuccess",v-form, name="validation", @submit.prevent="onSubmit")
    .form-header
      h2 {{ $t("auth.reset") }}
      //-
        p
          | 请为您使用邮箱
          strong {{email}}
          | 注册的帐号重新设置密码
    .form-body
      .form-row
        .input-text-wrap(v-placeholder="$t('auth.password')")
          input.input-text(type="password", v-model="model.password", v-form-ctrl, required, maxlength="16", minlength="6", name="password", lazy)
        .form-tips.form-tips-error(v-if="validation.$submitted && validation.password.$pristine")
          span(v-if="validation.password.$error.required") {{ $t('validation.required', {field: $t('auth.fields.password')}) }}
        .form-tips.form-tips-error(v-if="validation.password.$dirty")
          span(v-if="validation.password.$error.required") {{ $t('validation.required', {field: $t('auth.fields.password')}) }}
          span(v-if="validation.password.$error.minlength") {{ $t('validation.minlength', [ $t('auth.fields.password'), 6]) }}
          span(v-if="validation.password.$error.maxlength") {{ $t('validation.maxlength', [ $t('auth.fields.password'), 16]) }}
      .form-row
        .input-text-wrap(v-placeholder="$t('auth.fields.confirm_password')")
          input.input-text(type="password", v-model="confirmPassword", v-form-ctrl, required, custom-validator="checkEqualToPassword", name="confirmPassword", lazy)
        .form-tips.form-tips-error(v-if="validation.$submitted && validation.confirmPassword.$pristine")
          span(v-if="validation.confirmPassword.$error.required") {{ $t("auth.confirm_password") }}
        .form-tips.form-tips-error(v-if="validation.confirmPassword.$dirty")
          span(v-if="model.password && validation.confirmPassword.$error.required") {{ $t("auth.confirm_password") }}
          span(v-if="validation.confirmPassword.$error.customValidator") {{ $t("auth.confirm_password_tips") }}
      .form-actions
        button.btn.btn-primary.btn-block(type="submit") {{ $t("common.ok") }}
    .form-footer
      | 2015 &copy; {{ $t("common.company") }}.
  .form-cont.reset-password-success(v-show="resetsuccess")
    .alert.alert-success
      .fa.fa-check-circle-o
      h2 {{ $t("auth.reset_success") }}
      p {{ $t("auth.reset_success_msg") }}
    .form-actions
      a.btn.btn-primary.btn-block(v-link="{ path: '/login'}") {{ $t("common.ok") }}
    .form-footer
      | 2015 &copy; {{ $t("common.company") }}.
</template>

<script>
  import api from '../api';
  import base64 from '../helpers/base64';

  module.exports = {
    name: 'PwdResetForm',

    data: function () {
      return {
        email: '',
        verifycode: '',
        validation: {},
        model: {},
        confirmPassword: '',
        resetsuccess: false,
        sending: false
      };
    },

    route: {
      data: function () {
        this.email = base64.decode(this.$route.params.email);
        this.verifycode = base64.decode(this.$route.params.verifycode);
      }
    },

    methods: {
      checkEqualToPassword: function (value) {
        return value === this.model.password;
      },

      onSubmit: function () {
        var params = {email: this.email, verifycode: this.verifycode, password: this.model.password};
        var self = this;
        if (this.validation.$valid && !this.sending) {
          this.sending = true;
          api.corp.resetPasswordByMail(params).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            if (data === 200) {
              self.resetsuccess = true;
              self.sending = false;
            }
          }).catch(function (error) {
            self.handleError(error);
            self.sending = false;
          });
        }
      }
    }
  };
</script>
