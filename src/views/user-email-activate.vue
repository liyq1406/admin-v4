<template>
  <div>
    <div v-show="activateSuccess" class="form form-auth form-member-activate">
      <div class="form-cont reset-password-success">
        <div class="alert alert-success">
          <div class="fa fa-check-circle-o"></div>
          <h2>{{ $t("ui.auth.activate_success") }}</h2>
          <p>{{ $t("ui.auth.activate_success_msg") }}</p>
        </div>
      </div>
    </div>
    <div v-show="activateFail" class="form form-auth form-member-activate">
      <div class="form-cont reset-password-success">
        <div class="alert alert-success">
          <div class="fa fa-times-circle-o"></div>
          <h2>{{ $t("ui.auth.activate_fail") }}</h2>
          <p>{{ $t("ui.auth.activate_fail_msg") }}</p>
        </div>
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
  import { globalMixins } from '../mixins'

  export default {
    name: 'EmailActivateForm',

    layout: 'auth',

    mixins: [globalMixins],

    data () {
      return {
        activateSuccess: false,
        activateFail: false
      }
    },

    ready () {
      var corpId = base64.decode(this.$route.params.corp_id)
      var email = base64.decode(this.$route.params.email)
      var verifycode = base64.decode(this.$route.params.verifycode)

      api.corp.userEmailActivate({
        corp_id: corpId,
        email: email,
        verifycode: verifycode
      }).then((res) => {
        if (res.status === 200) {
          this.activateSuccess = true
        }
      }).catch((res) => {
        if (res.error.code === 4001028) {
          this.activateFail = true
        }
      })
    }
  }
</script>
