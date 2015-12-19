<template lang="jade">
  .form.form-auth.form-register
    .form-logo
    form.form-cont(v-form, name="validation", @submit.prevent="onSubmit", v-show="!registerSuccess")
      .form-header
        a(v-link="{ path: '/login' }") 登录帐号
        span 注册帐号
      .form-body
        .form-hints 请输入您的帐号信息：
        .form-row-group
          .form-row
            .input-text-wrap(v-placeholder="'电子邮箱'")
              input.input-text(type="email", v-model="model.email", v-form-ctrl, name="email", required, lazy)
            .form-tips.form-tips-error(v-if="validation.email.$dirty")
              span(v-if="validation.email.$error.required") 请输入您的电子邮件地址
              span(v-if="validation.email.$error.email") 电子邮件地址格式不正确
          .form-row
            .input-text-wrap(v-placeholder="'密码'")
              input.input-text(type="password", v-model="model.password", v-form-ctrl, required, maxlength="16", minlength="6", name="password", lazy)
            .form-tips.form-tips-error(v-if="validation.password.$dirty")
              span(v-if="validation.password.$error.required") 请输入密码
              span(v-if="validation.password.$error.minlength") 密码最小不能少于6位
              span(v-if="validation.password.$error.maxlength") 密码最大不能超过16位
          .form-row
            .input-text-wrap(v-placeholder="'再次输入密码'")
              input.input-text(type="password", v-model="confirmPassword", v-form-ctrl, required, custom-validator="checkEqualToPassword", name="confirmPassword", lazy)
            .form-tips.form-tips-error(v-if="validation.confirmPassword.$dirty")
              span(v-if="model.password && validation.confirmPassword.$error.required") 请再一次输入密码
              span(v-if="validation.confirmPassword.$error.customValidator") 两次密码输入不一致
        .form-hints 请输入您的基本信息：
        .form-row-group
          .form-row
            .input-text-wrap(v-placeholder="'姓名'")
              input.input-text(type="text", v-model="model.name", v-form-ctrl, required, maxlength="32", minlength="2", name="name", lazy)
            .form-tips.form-tips-error(v-if="validation.name.$dirty")
              span(v-if="validation.name.$error.required") 请输入姓名
              span(v-if="validation.name.$error.minlength") 姓名长度不能小于2
              span(v-if="validation.name.$error.maxlength") 电话号码长度不能大于32
          .form-row
            .input-text-wrap(v-placeholder="'手机号码'")
              input.input-text(type="text", v-model="model.phone", v-form-ctrl, required, pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$", name="phone", lazy)
            .form-tips.form-tips-error(v-if="validation.phone.$dirty")
              span(v-if="validation.phone.$error.required") 请输入您的手机号码
              span(v-if="validation.phone.$error.pattern") 手机号码格式有误
          .form-row
            .input-text-wrap(v-placeholder="'公司名称'")
              input.input-text(type="text", v-model="model.company", v-form-ctrl, required, maxlength="32", name="company", lazy)
            .form-tips.form-tips-error(v-if="validation.company.$dirty")
              span(v-if="validation.company.$error.required") 请输入您的公司名称
              span(v-if="validation.company.$error.maxlength") 公司名称长度不能大于32
          .form-row
            .select
              select(v-model="model.type", v-form-ctrl, name="type", custom-validator="checkTypeValid", lazy)
                option(selected) 请选择应用类型
                option(value="1") 消费电子（含穿戴设备/娱乐产品等）
                option(value="2") 智能家居
                option(value="3") 智能安防
                option(value="4") 商用/工控设备
                option(value="5") 其它
            .form-tips.form-tips-error(v-if="validation.$submitted")
              span(v-if="validation.type.$error.customValidator") 请选择您的应用类型
        .form-actions
          button.btn.btn-primary.btn-block(type="submit") 注册
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
    .form-cont.reset-password-success(v-show="registerSuccess")
      .alert.alert-success
        .fa.fa-check-circle-o
        h2 注册成功
        p 系统已经发了一封激活邮件到您的邮箱，请查阅。
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
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

  module.exports = {

    data: function () {
      return {
        validation: {},
        captcha: '',
        captchaValue: '',
        model: {},
        confirmPassword: '',
        registerSuccess: false
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
      },

      /**
       * 错误处理
       * @param  {Object} error 错误信息
       */
      handleError: function (error) {
        if (__DEBUG__) {
          console.log(error);
        }
      }
    }
  };
</script>
