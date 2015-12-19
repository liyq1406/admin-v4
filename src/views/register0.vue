<template lang="jade">
  .form.form-auth.form-register
    .form-logo
    form.form-cont(v-form, name="validation", @submit.prevent="onSubmit")
      .form-header
        a(v-link="{ path: '/login' }") 登录帐号
        span 注册帐号
      .form-body
        .form-hints 请输入您的帐号信息：
        .form-row-group
          .form-row
            .input-text-wrap(v-placeholder="'电子邮箱'")
              input.input-text(type="email", v-model="model.email", v-form-ctrl, name="email", required, lazy)
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.email.$pristine")
              span(v-if="validation.email.$error.required") 请输入您的电子邮件地址
            .form-tips.form-tips-error(v-if="validation.email.$dirty")
              span(v-if="validation.email.$error.required") 请输入您的电子邮件地址
              span(v-if="validation.email.$error.email") 电子邮件地址格式不正确
          .form-row
            .input-text-wrap(v-placeholder="'密码'")
              input.input-text(type="password", v-model="model.password", v-form-ctrl, required, maxlength="16", minlength="6", name="password", lazy)
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.password.$pristine")
              span(v-if="validation.password.$error.required") 请输入密码
            .form-tips.form-tips-error(v-if="validation.password.$dirty")
              span(v-if="validation.password.$error.required") 请输入密码
              span(v-if="validation.password.$error.minlength") 密码最小不能少于6位
              span(v-if="validation.password.$error.maxlength") 密码最大不能超过16位
          .form-row
            .input-text-wrap(v-placeholder="'再次输入密码'")
              input.input-text(type="password", v-model="confirmPassword", v-form-ctrl, required, custom-validator="checkEqualToPassword", name="confirmPassword", lazy)
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.confirmPassword.$pristine")
              span(v-if="validation.confirmPassword.$error.required") 请再一次输入密码
            .form-tips.form-tips-error(v-if="validation.confirmPassword.$dirty")
              span(v-if="model.password && validation.confirmPassword.$error.required") 请再一次输入密码
              span(v-if="validation.confirmPassword.$error.customValidator") 两次密码输入不一致
        .form-hints 请输入您的基本信息：
        .form-row-group
          .form-row
            .input-text-wrap(v-placeholder="'姓名'")
              input.input-text(type="text", v-model="model.name", v-form-ctrl, required, maxlength="32", minlength="2", name="name", lazy)
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
              span(v-if="validation.name.$error.required") 请输入姓名
            .form-tips.form-tips-error(v-if="validation.name.$dirty")
              span(v-if="validation.name.$error.required") 请输入姓名
              span(v-if="validation.name.$error.minlength") 姓名长度不能小于2
              span(v-if="validation.name.$error.maxlength") 电话号码长度不能大于32
          .form-row
            .input-text-wrap(v-placeholder="'手机号码'")
              input.input-text(type="text", v-model="model.phone", v-form-ctrl, required, pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$", name="phone", lazy)
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.phone.$pristine")
              span(v-if="validation.phone.$error.required") 请输入您的手机号码
            .form-tips.form-tips-error(v-if="validation.phone.$dirty")
              span(v-if="validation.phone.$error.required") 请输入您的手机号码
              span(v-if="validation.phone.$error.pattern") 手机号码格式有误
          .form-row.captcha-row
            .input-text-wrap(v-placeholder="'请输入右图验证码'")
              input.input-text(type="text", v-model="captcha", lazy)
            captcha(:width="120", :height="36", :value.sync="captchaValue", v-ref:captcha)
          .form-row.verify-code
            .input-text-wrap(v-placeholder="'短信验证码'")
              input.input-text(type="text", v-model="model.verifycode", v-form-ctrl, required, name="verifycode", lazy)
            button.btn.btn-primary(@click.stop.prevent="fetchVerifyCode", :class="{'disabled': btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()}", v-bind="{'disabled': btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()}", v-text="counting ? seconds + '秒后重新获取' : '获取短信验证码'")
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.verifycode.$pristine")
              span(v-if="validation.verifycode.$error.required") 请输入手机收到的验证码
            .form-tips.form-tips-error(v-if="validation.verifycode.$dirty")
              span(v-if="validation.verifycode.$error.required") 请输入手机收到的验证码
          .form-row
            .input-text-wrap(v-placeholder="'公司名称'")
              input.input-text(type="text", v-model="model.company", v-form-ctrl, required, maxlength="32", name="company", lazy)
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.company.$pristine")
              span(v-if="validation.company.$error.required") 请输入您的公司名称
            .form-tips.form-tips-error(v-if="validation.company.$dirty")
              span(v-if="validation.company.$error.required") 请输入您的公司名称
              span(v-if="validation.company.$error.maxlength") 公司名称长度不能大于32
          .form-row
            .select
              select(v-model="model.type", v-form-ctrl, name="type", custom-validator="checkTypeValid")
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
  var Captcha = require('../components/captcha.vue');

  module.exports = {
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

        if (this.validation.phone.$invalid) {
          alert('请填写正确的手机号');
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
              alert("注册成功!");
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
