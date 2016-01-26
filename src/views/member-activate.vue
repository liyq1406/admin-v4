<template lang="jade">
.form.form-auth.form-member-activate
  .form-logo
  form.form-cont(v-show="!activateSuccess",v-form, name="validation", @submit.prevent="onSubmit")
    .form-header
      h2 {{ $t("auth.member_activate") }}
      p {{ $t("auth.member_activate_tips") }}
    .form-body
      .form-row
        .input-text-wrap(v-placeholder="$t('auth.fields.name')")
          input.input-text(type="text", v-model="model.name", v-form-ctrl, required, maxlength="32", minlength="2", name="name", lazy)
        .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
          span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('auth.fields.name')}) }}
        .form-tips.form-tips-error(v-if="validation.name.$dirty")
          span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('auth.fields.name')}) }}
          span(v-if="validation.name.$error.minlength") {{ $t('validation.minlength', [ $t('auth.fields.name'), 2]) }}
          span(v-if="validation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('auth.fields.name'), 32]) }}
      .form-row
          .input-text-wrap(v-placeholder="$t('auth.fields.phone')")
            input.input-text(type="text", v-model="model.phone", v-form-ctrl, required, pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$", name="phone", lazy)
          .form-tips.form-tips-error(v-if="validation.$submitted && validation.phone.$pristine")
            span(v-if="validation.phone.$error.required") {{ $t('validation.required', {field: $t('auth.fields.phone')}) }}
          .form-tips.form-tips-error(v-if="validation.phone.$dirty")
            span(v-if="validation.phone.$error.required") {{ $t('validation.required', {field: $t('auth.fields.phone')}) }}
            span(v-if="validation.phone.$error.pattern") {{ $t('validation.format', {field: $t('auth.fields.phone')}) }}
        .form-row.captcha-row
          .input-text-wrap(v-placeholder="$t('auth.insert_code')")
            input.input-text(type="text", v-model="captcha", lazy)
          captcha(:width="120", :height="36", :value.sync="captchaValue", v-ref:captcha)
        .form-row.verify-code
          .input-text-wrap(v-placeholder="$t('auth.verifycode')")
            input.input-text(type="text", v-model="model.verifycode", v-form-ctrl, required, name="verifycode", lazy)
          button.btn.btn-primary(@click.stop.prevent="fetchVerifyCode", :class="{'disabled': btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()}", v-bind="{'disabled': btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()}", v-text="counting ? $t('auth.wating', {seconds: seconds}) : $t('auth.get_code')")
          .form-tips.form-tips-error(v-if="validation.$submitted && validation.verifycode.$pristine")
            span(v-if="validation.verifycode.$error.required") {{ $t('validation.required', {field: $t('auth.verifycode')}) }}
          .form-tips.form-tips-error(v-if="validation.verifycode.$dirty")
            span(v-if="validation.verifycode.$error.required") {{ $t('validation.required', {field: $t('auth.verifycode')}) }}
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
  .form-cont.reset-password-success(v-show="activateSuccess")
    .alert.alert-success
      .fa.fa-check-circle-o
      h2 {{ $t("auth.activate_success") }}
      p {{ $t("auth.activate_success_msg") }}
      .actions
        a.btn.btn-primary(v-link="{ path: '/login'}") {{ $t("common.ok") }}
    .form-footer
      | 2015 &copy; {{ $t("common.company") }}.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-auth.form-member-activate
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

<script>
  var api = require('../api');
  var config = require('../consts/config');
  var Captcha = require('../components/captcha.vue');
  var base64 = require('../helpers/base64');

  module.exports = {
    name: 'MemberActivateForm',

    components: {
      'captcha': Captcha
    },

    data: function () {
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
        activateSuccess: false
      };
    },

    ready: function () {
      this.model.email = base64.decode(this.$route.params.email);
    },

    methods: {
      getObjLength: function (obj) {
        return Object.keys(obj).length;
      },

      checkEqualToPassword: function (value) {
        return value === this.model.password;
      },

      checkTypeValid: function (value) {
        return Number(value) > 0;
      },

      tiktac: function () {
        var self = this;
        var itvl = window.setInterval(function () {
          if (self.seconds) {
            self.seconds--;
          } else {
            self.seconds = config.verifycodeDuration;
            self.counting = false;
            self.btnDisabled = false;
            window.clearInterval(itvl);
          }
        }, 1000);
      },
      fetchVerifyCode: function () {
        var self = this;

        if (this.validation.phone.$invalid) {
          alert(this.$t('auth.phone_msg'));
          return;
        }

        this.btnDisabled = true;
        this.captcha = '';
        this.$refs.captcha.generate();
        api.sms.getVerifycode({
          phone: this.model.phone
        }).then(function (status) {
          console.log(status);
          if (__DEBUG__) {
            console.log('[' + status + '] 获取验证码成功');
          }
          self.counting = true;
          self.tiktac();
        }).catch(function (error) {
          self.handleError(error);
        });
      },
      onSubmit: function () {
        var content = {'phone': this.model.phone, 'verifycode': this.model.verifycode, 'password': this.model.password, 'email': this.model.email, 'name': this.model.name};
        var self = this;
        // console.log(content);
        api.corp.memberActivate(content).then(function (status) {
          if (__DEBUG__) {
            console.log(status);
          }
          if (status === 200) {
            self.activateSuccess = true;
          }
        }).catch(function (error) {
          self.handleError(error);
        });
      }
    }
  };
</script>
