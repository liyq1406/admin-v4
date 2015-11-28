<template lang="jade">
  .form.form-auth.form-register
    .form-logo
    form.form-cont(v-form, name="registerForm", @submit.prevent="onSubmit")
      .form-header
        a(v-link="{ path: '/login' }") 登录账号
        span 注册账号
      .form-body
        .form-hints 请输入您的账号信息：
        .form-row-group
          .form-row
            input.input-text(type="email", placeholder="电子邮箱", v-model="model.email", v-form-ctrl, name="email", required)
            .form-tips.form-tips-error(v-if="registerForm.$submitted && registerForm.email.$pristine")
              span(v-if="registerForm.email.$error.required") 请输入您的电子邮件地址
            .form-tips.form-tips-error(v-if="registerForm.email.$dirty")
              span(v-if="registerForm.email.$error.required") 请输入您的电子邮件地址
              span(v-if="registerForm.email.$error.email") 电子邮件地址格式不正确
          .form-row
            input.input-text(type="password", placeholder="密码", v-model="model.password", v-form-ctrl, required, maxlength="16", minlength="6", name="password")
            .form-tips.form-tips-error(v-if="registerForm.$submitted && registerForm.password.$pristine")
              span(v-if="registerForm.password.$error.required") 请输入密码
            .form-tips.form-tips-error(v-if="registerForm.password.$dirty")
              span(v-if="registerForm.password.$error.required") 请输入密码
              span(v-if="registerForm.password.$error.minlength") 密码最小不能少于6位
              span(v-if="registerForm.password.$error.maxlength") 密码最大不能超过16位
          .form-row
            input.input-text(type="password", placeholder="再次输入密码", v-model="confirmPassword", v-form-ctrl, required, custom-validator="checkEqualToPassword", name="confirmPassword")
            .form-tips.form-tips-error(v-if="registerForm.$submitted && registerForm.confirmPassword.$pristine")
              span(v-if="registerForm.confirmPassword.$error.required") 请再一次输入密码
            .form-tips.form-tips-error(v-if="registerForm.confirmPassword.$dirty")
              span(v-if="model.password && registerForm.confirmPassword.$error.required") 请再一次输入密码
              span(v-if="registerForm.confirmPassword.$error.customValidator") 两次密码输入不一致
        .form-hints 请输入您的基本信息：
        .form-row-group
          .form-row
            input.input-text(type="text", placeholder="姓名", v-model="model.name", v-form-ctrl, required, maxlength="32", minlength="2", name="name")
            .form-tips.form-tips-error(v-if="registerForm.$submitted && registerForm.name.$pristine")
              span(v-if="registerForm.name.$error.required") 请输入姓名
            .form-tips.form-tips-error(v-if="registerForm.name.$dirty")
              span(v-if="registerForm.name.$error.required") 请输入姓名
              span(v-if="registerForm.name.$error.minlength") 姓名长度不能小于2
              span(v-if="registerForm.name.$error.maxlength") 电话号码长度不能大于32
          .form-row
            input.input-text(type="text", placeholder="手机号码", v-model="model.phone", v-form-ctrl, required, pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$", name="phone")
            .form-tips.form-tips-error(v-if="registerForm.$submitted && registerForm.phone.$pristine")
              span(v-if="registerForm.phone.$error.required") 请输入您的手机号码
            .form-tips.form-tips-error(v-if="registerForm.phone.$dirty")
              span(v-if="registerForm.phone.$error.required") 请输入您的手机号码
              span(v-if="registerForm.phone.$error.pattern") 手机号码格式有误
          .form-row.verify-code
            input.input-text(type="text", placeholder="验证码", v-model="model.verifycode", v-form-ctrl, required, name="verifycode")
            button.btn.btn-primary(@click.stop.prevent="fetchVerifyCode", :class="{'disabled': btnDisabled}", v-bind="{'disabled': btnDisabled}", v-text="counting ? seconds + '秒后重新获取' : '获取验证码'")
            .form-tips.form-tips-error(v-if="registerForm.$submitted && registerForm.verifycode.$pristine")
              span(v-if="registerForm.verifycode.$error.required") 请输入手机收到的验证码
            .form-tips.form-tips-error(v-if="registerForm.verifycode.$dirty")
              span(v-if="registerForm.verifycode.$error.required") 请输入手机收到的验证码
          .form-row
            input.input-text(type="text", placeholder="公司名称", v-model="model.company", v-form-ctrl, required, maxlength="32", name="company")
            .form-tips.form-tips-error(v-if="registerForm.$submitted && registerForm.company.$pristine")
              span(v-if="registerForm.company.$error.required") 请输入您的公司名称
            .form-tips.form-tips-error(v-if="registerForm.company.$dirty")
              span(v-if="registerForm.company.$error.required") 请输入您的公司名称
              span(v-if="registerForm.company.$error.maxlength") 公司名称长度不能大于32
          .form-row
            select(v-model="model.type", v-form-ctrl, name="type", custom-validator="checkTypeValid")
              option(selected) 请选择应用类型
              option(value="1") 消费电子（含穿戴设备/娱乐产品等）
              option(value="2") 智能家居
              option(value="3") 智能安防
              option(value="4") 商用/工控设备
              option(value="5") 其它
            .form-tips.form-tips-error(v-if="registerForm.$submitted")
              span(v-if="registerForm.type.$error.customValidator") 请选择您的应用类型
        .form-actions
          button.btn.btn-primary.btn-block(type="submit") 注册
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-register
    select
      display block
      width 100%
      text-indent 10px
      border 1px solid #D9D9D9
      height 35px
      line-height 35px
      outline none
      box-sizing border-box

    .verify-code
      clearfix()

      .input-text
        float left
        width 190px
        margin-right 10px

      .btn
        float left
        width 120px
        height 35px
        line-height 35px
</style>

<script>
  var api = require('../api');
  var config = require('../consts/config');

  module.exports = {
    data: function () {
      return {
        registerForm: {},
        model: {},
        confirmPassword: '',
        verifycodeValid: false,
        counting: false,
        btnDisabled: false,
        seconds: config.verifycodeDuration
      };
    },

    methods: {
      getObjLength:function(obj){
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

        if (this.registerForm.phone.$invalid) {
          alert('请填写正确的手机号');
          return;
        }

        this.btnDisabled=true;
        api.sms.getVerifycode({
          phone: this.model.phone
        }).then(function (data) {
          if (__DEBUG__) {
            console.log('[' + data.status + '] 获取验证码成功');
          }
          self.counting=true;
          self.tiktac();
        }).catch(function (error) {
          if (__DEBUG__) {
            console.log('[' + error.status + '] 获取验证码失败');
          }
        });
      },

      onSubmit: function () {
        if (this.registerForm.$valid) {
          api.corp.register(this.model).then(function (data) {
            if (__DEBUG__) {
              console.log('[' + data.status + '] 注册成功');
            }
            alert("注册成功!");
            this.$route.router.go({path: '/login'});
          }).catch(function (error) {
            var errorCode = JSON.parse(error.response.body).error.code;
            if (errorCode === 4001003 || errorCode === 4001004) {
              alert("验证码有误，请重新输入！");
            } else if (errorCode === 4001005) {
              alert("该手机号已注册");
            }
          });
        }
      }
    }
  };
</script>
