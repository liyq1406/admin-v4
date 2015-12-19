<template lang="jade">
  .form.form-auth.form-member-activate(v-show="activateSuccess")
    .form-logo
    .form-cont.reset-password-success
      .alert.alert-success
        .fa.fa-check-circle-o
        h2 激活成功
        p 您的帐号已成功激活。
        .actions
          a.btn.btn-primary(v-link="{ path: '/login'}") 确定
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'
</style>

<script>
  var api = require('../api');

  module.exports = {
    data: function () {
      return {
        activateSuccess: false
      }
    },

    ready: function () {
      var self = this;
      api.corp.emailActivate({email: this.$route.params.email, verifycode: this.$route.params.verifycode}).then(function (status) {
        if (status === 200) {
          self.activateSuccess = true;
        }
      }).catch(function (error) {
        self.handleError(error);
      });
    },

    methods: {

    }
  };
</script>
