<template lang="jade">
.form.form-auth.form-register
  .form-logo
  form.form-cont(v-form, name="validation", @submit.prevent="onSubmit", v-show="!registerSuccess")
    .form-header
      a(v-link="{ path: '/login' }") {{ $t("auth.login") }}
      span {{ $t("auth.register") }}
    .form-body
      .form-hints {{ $t("auth.account_tips") }}
      .form-row-group
        .form-row
          .input-text-wrap(v-placeholder="$t('auth.fields.email')")
            input.input-text(type="email", v-model="model.email", v-form-ctrl, name="email", required, lazy)
          .form-tips.form-tips-error(v-if="validation.email.$dirty")
            span(v-if="validation.email.$error.required") {{ $t('validation.required', {field: $t('auth.fields.email')}) }}
            span(v-if="validation.email.$error.email") {{ $t('validation.format', {field: $t('auth.fields.email')}) }}
        .form-row
          .input-text-wrap(v-placeholder="$t('auth.password')")
            input.input-text(type="password", v-model="model.password", v-form-ctrl, required, maxlength="16", minlength="6", name="password", lazy)
          .form-tips.form-tips-error(v-if="validation.password.$dirty")
            span(v-if="validation.password.$error.required") {{ $t('validation.required', {field: $t('auth.fields.password')}) }}
            span(v-if="validation.password.$error.minlength") {{ $t('validation.minlength', [ $t('auth.fields.password'), 6]) }}
            span(v-if="validation.password.$error.maxlength") {{ $t('validation.maxlength', [ $t('auth.fields.password'), 16]) }}
        .form-row
          .input-text-wrap(v-placeholder="$t('auth.fields.confirm_password')")
            input.input-text(type="password", v-model="confirmPassword", v-form-ctrl, required, custom-validator="checkEqualToPassword", name="confirmPassword", lazy)
          .form-tips.form-tips-error(v-if="validation.confirmPassword.$dirty")
            span(v-if="model.password && validation.confirmPassword.$error.required") {{ $t("auth.confirm_password") }}
            span(v-if="validation.confirmPassword.$error.customValidator") {{ $t("auth.confirm_password_tips") }}
      .form-hints {{ $t("auth.basic_tips") }}
      .form-row-group
        .form-row
          .input-text-wrap(v-placeholder="$t('auth.fields.name')")
            input.input-text(type="text", v-model="model.name", v-form-ctrl, required, maxlength="32", minlength="2", name="name", lazy)
          .form-tips.form-tips-error(v-if="validation.name.$dirty")
            span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('auth.fields.name')}) }}
            span(v-if="validation.name.$error.minlength") {{ $t('validation.minlength', [ $t('auth.fields.name'), 2]) }}
            span(v-if="validation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('auth.fields.name'), 32]) }}
        .form-row
          .input-text-wrap(v-placeholder="$t('auth.fields.phone')")
            input.input-text(type="text", v-model="model.phone", v-form-ctrl, required, pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$", name="phone", lazy)
          .form-tips.form-tips-error(v-if="validation.phone.$dirty")
            span(v-if="validation.phone.$error.required") {{ $t('validation.required', {field: $t('auth.fields.phone')}) }}
            span(v-if="validation.phone.$error.pattern") {{ $t('validation.format', {field: $t('auth.fields.phone')}) }}
        .form-row
          .input-text-wrap(v-placeholder="$t('auth.fields.company')")
            input.input-text(type="text", v-model="model.company", v-form-ctrl, required, maxlength="32", name="company", lazy)
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
  .form-cont.reset-password-success(v-show="registerSuccess")
    .alert.alert-success
      .fa.fa-check-circle-o
      h2 {{ $t("auth.register_success") }}
      p {{ $t("auth.register_success_msg") }}
      .actions
        a.btn.btn-primary(v-link="{ path: '/login'}") {{ $t("common.ok") }}
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
  import api from '../api';
  import locales from '../consts/locales';
  import Vue from 'vue';

  module.exports = {
    name: 'RegisterForm',

    data: function () {
      return {
        accountTypes: locales[Vue.config.lang].accountTypes,
        validation: {},
        captcha: '',
        captchaValue: '',
        model: {},
        confirmPassword: '',
        registerSuccess: false
      };
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

      /**
       * 提交注册
       */
      onSubmit: function () {
        var self = this;
        if (this.validation.$valid) {
          api.corp.emailRegister(this.model).then(function (status) {
            if (__DEBUG__) {
              console.log('[' + status + '] 注册成功');
            }
            if (status === 200) {
              self.registerSuccess = true;
              // self.$route.router.go({path: '/login'});
            }
          }).catch(function (error) {
            self.handleError(error);
          });
        }
      }
    }
  };
</script>
