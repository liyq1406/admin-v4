<template lang="jade">
.form.form-auth.form-login
  .form-logo
  form.form-cont(v-form, name="validation", @submit.prevent="onSubmit", hook="loginFormHook")
    .form-header
      span 登录帐号
      a(v-link="{ path: '/register' }") 注册帐号
    .form-body
      .form-row
        .input-text-wrap(v-placeholder="'邮箱/手机号'")
          input.input-text(type="text", v-model="model.account", v-form-ctrl, name="account", required, lazy)
        .form-tips.form-tips-error(v-if="validation.$submitted && validation.account.$pristine")
          span(v-if="validation.account.$error.required") 请输入您的登录帐号
        .form-tips.form-tips-error(v-if="validation.account.$dirty")
          span(v-if="validation.account.$error.required") 请输入您的登录帐号
      .form-row
        .input-text-wrap(v-placeholder="'密码'")
          input.input-text(type="password", v-model="model.password", v-form-ctrl, name="password", required, lazy)
        .form-tips.form-tips-error(v-if="validation.$submitted && validation.password.$pristine")
          span(v-if="validation.password.$error.required") 请输入密码
        .form-tips.form-tips-error(v-if="validation.password.$dirty")
          span(v-if="validation.password.$error.required") 请输入密码
      .operations
        a.fetch-password(v-link="{ path: '/fetch-password-bymail' }") 忘记密码?
        label.remember-password
          input(type="checkbox", v-model="rememberPwd")
          span 记住密码
      .form-actions
        button.btn.btn-primary.btn-block(@keyup.enter="onSubmit", :disabled="logining", :class="{'disabled':logining}", v-text="logining ? '登录中...' : '登录'") 登录
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
    name: 'LoginForm',

    data: function () {
      return {
        validation: {},
        model: {
          account: '',
          password: ''
        },
        logining: false,
        rememberPwd: Boolean(this.getCookie('rememberPwd')) || false
      };
    },

    ready: function () {
      if (this.rememberPwd) {
        this.model.account = this.getCookie('account');
        this.model.password = this.getCookie('password');
      }
    },

    methods: {
      // 设置 Cookies
      setCookie: function (name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
      },

      // 读取 Cookies
      getCookie: function (name) {
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        var arr = document.cookie.match(reg) || {};
        if (arr.length) {
          return unescape(arr[2]);
        } else {
          return null;
        }
      },

      // 删除 Cookies
      delCookie: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null) {
          document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
        }
      },

      loginFormHook: function (form) {
        this.loginForm = form;
      },

      onSubmit: function () {
        var self = this;
        if (this.validation.$valid) {
          this.logining = true;
          api.corp.auth(this.model).then(function (data) {
            self.logining = false;
            var today = new Date();
            localStorage.setItem('member_id', data.member_id);
            localStorage.setItem('corp_id', data.corp_id);
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            localStorage.setItem('expireIn', data.expire_in);
            localStorage.setItem('expireAt', today.getTime() + data.expire_in * 1000);
            // localStorage.setItem('expireAt', today.getTime() + 10000);
            // 设置记住密码
            if (self.rememberPwd) {
              self.setCookie('rememberPwd', true);
              self.setCookie('account', self.model.account);
              self.setCookie('password', self.model.password);
            } else {
              self.delCookie('rememberPwd');
              self.delCookie('account');
              self.delCookie('password');
            }
            self.$route.router.go({path: '/'});
          }).catch(function (error) {
            self.logining = false;
            self.handleError(error);
          });
        }
      }
    }
  };
</script>
