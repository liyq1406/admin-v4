<template lang="jade">
div
  .form.form-auth.form-member-activate(v-show="activateSuccess")
    .form-logo
    .form-cont.reset-password-success
      .alert.alert-success
        .fa.fa-check-circle-o
        h2 激活成功
        p 您的帐号已成功激活。
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
  .form.form-auth.form-member-activate(v-show="activateFail")
    .form-logo
    .form-cont.reset-password-success
      .alert.alert-success
        .fa.fa-times-circle-o
        h2 激活失败
        p 该邮件验证码已失效。
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'
</style>

<script>
  var api = require('../api');
  var base64 = require('../helpers/base64');

  module.exports = {
    name: 'EmailActivateForm',

    data: function () {
      return {
        activateSuccess: false,
        activateFail: false
      };
    },

    ready: function () {
      var self = this;
      var corp_id = base64.decode(this.$route.params.corp_id);
      var email = base64.decode(this.$route.params.email);
      var verifycode = base64.decode(this.$route.params.verifycode);
      console.log(corp_id);
      console.log(email);
      console.log(verifycode);
      api.corp.userEmailActivate({corp_id: corp_id, email: email, verifycode: verifycode}).then(function (status) {
        if (status === 200) {
          self.activateSuccess = true;
        }
      }).catch(function (error) {
        if (error.code === 4001028) {
          self.activateFail = true;
        }
        // self.handleError(error);
      });
    },

    methods: {

    }
  };
</script>
