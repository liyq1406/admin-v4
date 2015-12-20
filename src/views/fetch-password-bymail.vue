<template lang="jade">
  .form.form-auth.form-fetch-password
    .form-logo
      a.fa.fa-chevron-circle-left.link-return(v-link="{path: '/login'}")
    form.form-cont(v-form, name="validation", @submit.prevent="onSubmit")
      .form-header
        a(v-link="{ path: '/fetch-password' }") 手机找回
        span 邮箱找回
      .form-body
        .form-hints 请输入您的注册邮箱，我们会将重设密码的链接发到您的邮箱中。
        .form-row
        .form-row
          .input-text-wrap(v-placeholder="'电子邮箱'")
            input.input-text(type="email", v-model="model.email", v-form-ctrl, name="email", required, lazy)
          .form-tips.form-tips-error(v-if="validation.email.$dirty")
            span(v-if="validation.email.$error.required") 请输入您的电子邮件地址
            span(v-if="validation.email.$error.email") 电子邮件地址格式不正确
          .form-tips.form-tips-success(v-if="sendSuccess")
            span 一封找回密码的邮件已发送到您的邮箱，请查收
        .form-actions
          button.btn.btn-primary.btn-block(type="submit") 确定
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<script>
  var api = require('../api');

  module.exports = {
    data: function () {
      return {
        validation: {},
        model: {},
        sendSuccess: false,
        sending: false
      }
    },

    methods: {
      onSubmit: function () {
        var self = this;
        if (this.validation.$valid && !this.sending) {
          this.sending = true;
          api.corp.fetchPasswordByMail(this.model).then(function (data){
            if(__DEBUG__) {
              console.log(data);
            }
            if(data===200){
              self.sendSuccess=true;
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
