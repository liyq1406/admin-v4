<template>
  <div>
    <div v-show="activateSuccess" class="form form-auth form-member-activate">
      <div class="form-logo"></div>
      <div class="form-cont reset-password-success">
        <div class="alert alert-success">
          <div class="fa fa-check-circle-o"></div>
          <h2>{{ $t("auth.activate_success") }}</h2>
          <p>{{ $t("auth.activate_success_msg") }}</p>
        </div>
        <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
      </div>
    </div>
    <div v-show="activateFail" class="form form-auth form-member-activate">
      <div class="form-logo"></div>
      <div class="form-cont reset-password-success">
        <div class="alert alert-success">
          <div class="fa fa-times-circle-o"></div>
          <h2>{{ $t("auth.activate_fail") }}</h2>
          <p>{{ $t("auth.activate_fail_msg") }}</p>
        </div>
        <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
  @import '../assets/stylus/common'
</style>

<script>
  import api from '../api'
  import base64 from '../helpers/base64'

  export default {
    name: 'EmailActivateForm',

    data () {
      return {
        activateSuccess: false,
        activateFail: false
      }
    },

    ready () {
      var email = base64.decode(this.$route.params.email)
      var verifycode = base64.decode(this.$route.params.verifycode)

      api.corp.emailActivate({
        email: email,
        verifycode: verifycode
      }).then((res) => {
        if (res.status === 200) {
          this.activateSuccess = true
        }
      }).catch((error) => {
        if (error.code === 4001028) {
          this.activateFail = true
        }
      })
    }
  }
</script>
