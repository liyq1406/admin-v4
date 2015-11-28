<template lang="jade">
  .form.form-auth.form-login
    .form-logo
    form.form-cont(v-form, name="loginForm", @submit.prevent="onSubmit")
      .form-header
        span 登录账号
        a(v-link="{ path: '/register' }") 注册账号
      .form-body
        .form-row
          input.input-text(type="text", placeholder="手机号", v-model="model.account", v-form-ctrl, name="account", required)
          .form-tips.form-tips-error(v-if="loginForm.$submitted && loginForm.account.$pristine")
            span(v-if="loginForm.account.$error.required") 请输入您的注册手机号
          .form-tips.form-tips-error(v-if="loginForm.account.$dirty")
            span(v-if="loginForm.account.$error.required") 请输入您的注册手机号
        .form-row
          input.input-text(type="password", placeholder="密码", v-model="model.password", v-form-ctrl, required, name="password")
          .form-tips.form-tips-error(v-if="loginForm.$submitted && loginForm.password.$pristine")
            span(v-if="loginForm.password.$error.required") 请输入密码
          .form-tips.form-tips-error(v-if="loginForm.password.$dirty")
            span(v-if="loginForm.password.$error.required") 请输入密码
        .operations
          a.fetch-password(v-link="{ path: '/fetch-password' }") 忘记密码?
          label.remember-password
            input(type="checkbox")
            span 记住密码
        .form-actions
          button.btn.btn-primary.btn-block 登录
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
        loginForm: {},
        model: {}
      }
    },

    methods: {
      onSubmit: function () {
        var self = this;
        if (this.loginForm.$valid) {
          api.corp.auth(this.model).then(function (res) {
            var today = new Date();
            localStorage.setItem('accessToken', res.body.access_token);
            localStorage.setItem('refreshToken', res.body.refresh_token);
            localStorage.setItem('expireIn', res.body.expire_in);
            localStorage.setItem('expireAt', today.getTime() + res.body.expire_in * 1000);
            // localStorage.setItem('expireAt', today.getTime() + 20000);
            self.$route.router.go({path: '/'});
          }).catch(function (err) {
            console.log(err);
          });
        }
      }
    }
  };
</script>
