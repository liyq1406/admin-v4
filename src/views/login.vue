<template lang="jade">
  .form.form-auth.form-login
    .form-logo
    form.form-cont(v-form, name="validation", @submit.prevent="onSubmit")
      .form-header
        span 登录帐号
        a(v-link="{ path: '/register' }") 注册帐号
      .form-body
        .form-row
          .input-text-wrap(v-placeholder="'手机号'")
            input.input-text(type="text", v-model="model.account", v-form-ctrl, name="account", required, lazy)
          .form-tips.form-tips-error(v-if="validation.account.$dirty")
            span(v-if="validation.account.$error.required") 请输入您的注册手机号
        .form-row
          .input-text-wrap(v-placeholder="'密码'")
            input.input-text(type="password", v-model="model.password", v-form-ctrl, name="password", required, lazy)
          .form-tips.form-tips-error(v-if="validation.password.$dirty")
            span(v-if="validation.password.$error.required") 请输入密码
        .operations
          a.fetch-password(v-link="{ path: '/fetch-password' }") 忘记密码?
          label.remember-password
            input(type="checkbox")
            span 记住密码
        .form-actions
          button.btn.btn-primary.btn-block(@keyup.enter="onSubmit") 登录
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-login
    .operations
      clearfix()
      margin 25px 0

      .fetch-password
        float right
        color red

      .remember-password
        input
          margin-right 5px
</style>

<script>
  var api = require('../api');

  module.exports = {
    data: function () {
      return {
        validation: {},
        model: {}
      }
    },

    methods: {
      onSubmit: function () {
        var self = this;
        if (this.validation.$valid) {
          api.corp.auth(this.model).then(function (data) {
            var today = new Date();
            localStorage.setItem('member_id', data.member_id);
            localStorage.setItem('corp_id', data.corp_id);
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            localStorage.setItem('expireIn', data.expire_in);
            localStorage.setItem('expireAt', today.getTime() + data.expire_in * 1000);
            // localStorage.setItem('expireAt', today.getTime() + 20000);
            self.$route.router.go({path: '/'});
          }).catch(function (error) {
            self.handleError(error);
          });
        }
      }
    }
  };
</script>
