<template lang="jade">
.form.form-auth.form-register
  .form-logo
  form.form-cont(v-form, name="validation", @submit.prevent="onSubmit")
    .form-header
      a(v-link="{ path: '/login' }") {{ $t("auth.login") }}
      span {{ $t("auth.register") }}
    .form-body
      .form-hints {{ $t("auth.account_tips") }}
      .form-row-group
        .form-row
          .input-text-wrap(v-placeholder="$t('auth.fields.email')")
            input.input-text(type="email", v-model="model.email", v-form-ctrl, name="email", required, lazy)
          .form-tips.form-tips-error(v-if="validation.$submitted && validation.email.$pristine")
            span(v-if="validation.email.$error.required") {{ $t('validation.required', {field: $t('auth.fields.email')}) }}
          .form-tips.form-tips-error(v-if="validation.email.$dirty")
            span(v-if="validation.email.$error.required") {{ $t('validation.required', {field: $t('auth.fields.email')}) }}
            span(v-if="validation.email.$error.email") {{ $t('validation.format', {field: $t('auth.fields.email')}) }}
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
      .form-hints {{ $t("auth.basic_tips") }}
      .form-row-group
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
          .input-text-wrap(v-placeholder="$t('auth.fields.company')")
            input.input-text(type="text", v-model="model.company", v-form-ctrl, required, maxlength="32", name="company", lazy)
          .form-tips.form-tips-error(v-if="validation.$submitted && validation.company.$pristine")
            span(v-if="validation.company.$error.required") {{ $t('validation.required', {field: $t('auth.fields.company')}) }}
          .form-tips.form-tips-error(v-if="validation.company.$dirty")
            span(v-if="validation.company.$error.required") {{ $t('validation.required', {field: $t('auth.fields.company')}) }}
            span(v-if="validation.company.$error.maxlength") {{ $t('validation.maxlength', [ $t('auth.fields.company'), 32]) }}
        .form-row
          .select
            select(v-model="model.type", v-form-ctrl, name="type", custom-validator="checkTypeValid")
              option(selected) {{ $t("auth.type_tips") }}
              option(v-for="type in accountTypes", :value="$index + 1") {{type}}
          .form-tips.form-tips-error(v-if="validation.$submitted")
            span(v-if="validation.type.$error.customValidator") {{ $t("auth.type_tips") }}
      .form-actions
        button.btn.btn-primary.btn-block(type="submit") {{ $t("auth.register_submit") }}
    .form-footer
      | 2015 &copy; {{ $t("common.company") }}.
</template>

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

<script>
  var api = require('../api');
  var config = require('../consts/config');
  var locales = require('../consts/locales');
  var Captcha = require('../components/captcha.vue');

  module.exports = {
    name: 'RegisterForm',

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
        accountTypes: locales[Vue.config.lang].accountTypes,
        seconds: config.verifycodeDuration
      };
    },

    methods: {
      getObjLength:function (obj){
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

        this.btnDisabled=true;
        this.captcha = '';
        this.$refs.captcha.generate();
        api.sms.getVerifycode({
          phone: this.model.phone
        }).then(function (status) {
          console.log(status);
          if (__DEBUG__) {
            console.log('[' + status + '] 获取验证码成功');
          }
          self.counting=true;
          self.tiktac();
        }).catch(function (error) {
          self.handleError(error)
        });
      },

      /**
       * 提交注册
       */
      onSubmit: function () {
        var self = this;
        if (this.validation.$valid) {
          api.corp.register(this.model).then(function (status) {
            if (__DEBUG__) {
              console.log('[' + status + '] 注册成功');
            }
            if (status === 200) {
              alert(this.$t('auth.register_success'));
              self.$route.router.go({path: '/login'});
            }
          }).catch(function (error) {
            self.handleError(error);
          });
        }
      }
    }
  };
</script>
