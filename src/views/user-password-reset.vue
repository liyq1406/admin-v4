<template lang="jade">
.form.form-auth.form-fetch-password(v-show="!validating")
  //- .form-logo
  form.form-cont(v-show="verifycodeValid && !resetsuccess",v-form, name="validation", @submit.prevent="onSubmit")
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
          input.input-text(type="password", v-model="model.new_password", v-form-ctrl, required, maxlength="16", minlength="6", name="new_password", lazy)
        .form-tips.form-tips-error(v-if="validation.$submitted && validation.new_password.$pristine")
          span(v-if="validation.new_password.$error.required") {{ $t('validation.required', {field: $t('auth.fields.password')}) }}
        .form-tips.form-tips-error(v-if="validation.new_password.$dirty")
          span(v-if="validation.new_password.$error.required") {{ $t('validation.required', {field: $t('auth.fields.password')}) }}
          span(v-if="validation.new_password.$error.minlength") {{ $t('validation.minlength', [ $t('auth.fields.password'), 6]) }}
          span(v-if="validation.new_password.$error.maxlength") {{ $t('validation.maxlength', [ $t('auth.fields.password'), 16]) }}
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
  .form-cont.reset-password-fail(v-show="!verifycodeValid && !resetsuccess")
    .alert.alert-fail
      .fa.fa-times-circle-o
      h2 {{ $t("auth.activate_fail_msg") }}
    //- .form-footer
      | 2015 &copy; {{ $t("common.company") }}.
  .form-cont.reset-password-success(v-show="resetsuccess")
    .alert.alert-success
      .fa.fa-check-circle-o
      h2 {{ $t("auth.reset_success") }}
      p {{ $t("auth.reset_success_msg") }}
    .form-actions
      a.btn.btn-primary.btn-block(v-link="{ path: '/login'}") {{ $t("common.ok") }}
    //- .form-footer
      | 2015 &copy; {{ $t("common.company") }}.
</template>

<script>
  import api from '../api';
  import base64 from '../helpers/base64';

  module.exports = {
    name: 'PwdResetForm',

    data: function () {
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
      };
    },

    route: {
      data: function () {
        var self = this;
        this.corp_id = base64.decode(this.$route.params.corp_id);
        this.email = base64.decode(this.$route.params.email);
        this.verifycode = base64.decode(this.$route.params.verifycode);

        var params = {corp_id: this.corp_id, email: this.email, verifycode: this.verifycode};
        api.corp.validVerifycode(params).then(function (status) {
          if (status === 200) {
            self.verifycodeValid = true;
          }
          self.validating = false;
        }).catch(function (error) {
          if (error.code === 4001028) {
            self.validating = false;
          } else {
            self.handleError(error);
          }
        });
      }
    },

    methods: {
      checkEqualToPassword: function (value) {
        return value === this.model.new_password;
      },

      onSubmit: function () {
        var params = {corp_id: this.corp_id, email: this.email, verifycode: this.verifycode, new_password: this.model.new_password};
        var self = this;

        if (__DEBUG__) {
          console.log(params);
        }

        if (this.validation.$valid && !this.sending) {
          this.sending = true;
          api.corp.resetUserPasswordByMail(params).then(function (data) {
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

<style lang="stylus">
.reset-password-fail
  .alert
    h2
      padding-top 10px
</style>
