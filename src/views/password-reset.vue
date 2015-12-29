<template lang="jade">
  .form.form-auth.form-fetch-password
    .form-logo
    form.form-cont(v-show="!resetsuccess",v-form, name="validation", @submit.prevent="onSubmit")
      .form-header
        h2 修改密码
        p
          | 请为您使用邮箱
          strong {{email}}
          | 注册的帐号重新设置密码
      .form-body
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
        .form-actions
          button.btn.btn-primary.btn-block(type="submit") 确定
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
    .form-cont.reset-password-success(v-show="resetsuccess")
      .alert.alert-success
        .icon.icon-success
        h2 修改成功
        p 您的密码已重置成功，请重新登录。
      .form-actions
        a.btn.btn-primary.btn-block(v-link="{ path: '/login'}") 确定
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<script>
  var api = require('../api');
  var config = require('../consts/config');
  var base64 = require('../helpers/base64');

  module.exports = {
    name: 'PwdResetForm',

    data: function () {
      return {
        email: '',
        verifycode: '',
        validation: {},
        model: {},
        confirmPassword: '',
        resetsuccess:false,
        sending: false
      }
    },

    route: {
      data: function () {
        this.email = base64.decode(this.$route.params.email);
        this.verifycode = base64.decode(this.$route.params.verifycode);
      }
    },

    methods: {
      checkEqualToPassword: function (value) {
        return value === this.model.password;
      },

      onSubmit: function () {
        var params = {email: this.email, verifycode: this.verifycode, password: this.model.password};
        var self = this;
        if (this.validation.$valid && !this.sending) {
          this.sending = true;
          api.corp.resetPasswordByMail(params).then(function (data){
            if(__DEBUG__) {
              console.log(data);
            }
            if(data==200){
              self.resetsuccess=true;
              self.sending = false;
            }
          }).catch(function (error) {
            self.handleError(error);
            self.sending = false;
          });
        }
      }
    }
  };
</script>
