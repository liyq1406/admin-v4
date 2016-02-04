<template lang="jade">
div
  .form.form-auth.form-member-activate(v-show="activateSuccess")
    //- .form-logo
    .form-cont.reset-password-success
      .alert.alert-success
        .fa.fa-check-circle-o
        h2 {{ $t("auth.activate_success") }}
        p {{ $t("auth.activate_success_msg") }}
      //- .form-footer
        | 2015 &copy; {{ $t("common.company") }}.
  .form.form-auth.form-member-activate(v-show="activateFail")
    .form-logo
    .form-cont.reset-password-success
      .alert.alert-success
        .fa.fa-times-circle-o
        h2 {{ $t("auth.activate_fail") }}
        p {{ $t("auth.activate_fail_msg") }}
      //- .form-footer
        | 2015 &copy; {{ $t("common.company") }}.
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
