<template lang="jade">
  .form.form-auth.form-member-activate
    .form-logo
    form.form-cont(v-show="!activateSuccess",v-form, name="validation", @submit.prevent="onSubmit")
      .form-header
        h2 成员邀请激活
        p 请输入您的姓名、登录密码、注册手机，点击发送验证码，将手机收到的验证码填到下面的输入框中。
      .form-body
        .form-row
          .input-text-wrap(v-placeholder="'姓名'")
            input.input-text(type="text", v-model="model.name", v-form-ctrl, required, maxlength="32", minlength="2", name="name")
          .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
            span(v-if="validation.name.$error.required") 请输入姓名
          .form-tips.form-tips-error(v-if="validation.name.$dirty")
            span(v-if="validation.name.$error.required") 请输入姓名
            span(v-if="validation.name.$error.minlength") 姓名长度不能小于2
            span(v-if="validation.name.$error.maxlength") 电话号码长度不能大于32
        .form-row
            .input-text-wrap(v-placeholder="'手机号码'")
              input.input-text(type="text", v-model="model.phone", v-form-ctrl, required, pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$", name="phone")
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.phone.$pristine")
              span(v-if="validation.phone.$error.required") 请输入您的手机号码
            .form-tips.form-tips-error(v-if="validation.phone.$dirty")
              span(v-if="validation.phone.$error.required") 请输入您的手机号码
              span(v-if="validation.phone.$error.pattern") 手机号码格式有误
          .form-row.verify-code
            .input-text-wrap(v-placeholder="'验证码'")
              input.input-text(type="text", v-model="model.verifycode", v-form-ctrl, required, name="verifycode")
            button.btn.btn-primary.identifying_code(@click.stop.prevent="fetchVerifyCode", :class="{'disabled': btnDisabled}", v-bind="{'disabled': btnDisabled}", v-text="counting ? seconds + '秒后重新获取' : '获取验证码'")
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.verifycode.$pristine")
              span(v-if="validation.verifycode.$error.required") 请输入手机收到的验证码
            .form-tips.form-tips-error(v-if="validation.verifycode.$dirty")
              span(v-if="validation.verifycode.$error.required") 请输入手机收到的验证码
          .form-row
            .input-text-wrap(v-placeholder="'密码'")
              input.input-text(type="password", v-model="model.password", v-form-ctrl, required, maxlength="16", minlength="6", name="password")
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.password.$pristine")
              span(v-if="validation.password.$error.required") 请输入密码
            .form-tips.form-tips-error(v-if="validation.password.$dirty")
              span(v-if="validation.password.$error.required") 请输入密码
              span(v-if="validation.password.$error.minlength") 密码最小不能少于6位
              span(v-if="validation.password.$error.maxlength") 密码最大不能超过16位
          .form-row
            .input-text-wrap(v-placeholder="'再次输入密码'")
              input.input-text(type="password", v-model="confirmPassword", v-form-ctrl, required, custom-validator="checkEqualToPassword", name="confirmPassword")
            .form-tips.form-tips-error(v-if="validation.$submitted && validation.confirmPassword.$pristine")
              span(v-if="validation.confirmPassword.$error.required") 请再一次输入密码
            .form-tips.form-tips-error(v-if="validation.confirmPassword.$dirty")
              span(v-if="model.password && validation.confirmPassword.$error.required") 请再一次输入密码
              span(v-if="validation.confirmPassword.$error.customValidator") 两次密码输入不一致
        .form-actions
          button.btn.btn-primary.btn-block(type="submit") 确定
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
    .form-cont.reset-password-success(v-show="activateSuccess")
      .alert.alert-success
        .icon.icon-success
        h2 激活成功
        p 您的成员邀请已成功激活。
      .form-actions
        a.btn.btn-primary.btn-block(v-link="{ path: '/login'}") 确定
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-member-activate
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
    .verify-code
      .input-text-wrap
        float left
        width 220px
        margin-right 10px

      .identifying_code
        float left
        width 120px
        height 36px
        line-height 36px
</style>

<script>

  var api = require('../api');
  var config = require('../consts/config');

  module.exports = {
    components: {
      'api': api
    },

    data: function () {
      return {
        validation: {},
        model: {},
        confirmPassword: '',
        verifycodeValid: false,
        counting: false,
        btnDisabled: false,
        seconds: config.verifycodeDuration,
        activateSuccess:false
      }
    },

    ready: function () {
      this.model.email = this.$route.params.email;
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
          if (__DEBUG__) {
            console.log(error);
            // console.log('[' + error.code + '] ' + error.msg);
          }
        });
      },
      onSubmit: function () {
        var content = {"phone":this.model.phone,"verifycode":this.model.verifycode,"password":this.model.password};
        var self = this;
        // console.log(content);
        api.corp.memberActivate(content).then(function (status){
          if(__DEBUG__) {
            console.log(data);
          }
          if(status===200){
            self.activateSuccess=true;
          }
        });
      }
    }
  };
</script>
