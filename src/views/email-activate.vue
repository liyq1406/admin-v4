<template lang="jade">
div
  .form.form-auth.form-member-activate(v-show="activateSuccess")
    .form-logo
    .form-cont.reset-password-success
      .alert.alert-success
        .fa.fa-check-circle-o
        h2 {{ $t("auth.activate_success") }}
        p {{ $t("auth.activate_success_msg") }}
      .form-footer
        | 2015 &copy; {{ $t("common.company") }}.
  .form.form-auth.form-member-activate(v-show="activateFail")
    .form-logo
    .form-cont.reset-password-success
      .alert.alert-success
        .fa.fa-times-circle-o
        h2 {{ $t("auth.activate_fail") }}
        p {{ $t("auth.activate_fail_msg") }}
      .form-footer
        | 2015 &copy; {{ $t("common.company") }}.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'
</style>

<script>
  import api from '../api';
  import base64 from '../helpers/base64';

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
      var email = base64.decode(this.$route.params.email);
      var verifycode = base64.decode(this.$route.params.verifycode);
      console.log(email);
      console.log(verifycode);
      api.corp.emailActivate({email: email, verifycode: verifycode}).then(function (status) {
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
