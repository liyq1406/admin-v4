<template>
  <div class="auth-form">
    <div class="auth-msg-box" v-show="activateSuccess">
      <x-alert :cols="16" type="success" :title="$t('auth.activate_success')">
        <p>{{ $t("auth.activate_success_msg") }}</p>
      </x-alert>
    </div>
    <div class="auth-msg-box" v-show="activateFail">
      <x-alert :cols="16" type="error" :title="$t('auth.activate_fail')">
        <p>{{ $t("auth.activate_fail_msg") }}</p>
      </x-alert>
    </div>
  </div>
</template>

<style lang="stylus">
  @import '../assets/stylus/common'
</style>

<script>
  import api from 'api'
  import base64 from 'utils/base64'
  import { globalMixins } from 'src/mixins'
  import Alert from 'components/Alert'

  export default {
    name: 'EmailActivateForm',

    layouts: ['auth'],

    mixins: [globalMixins],

    components: {
      'x-alert': Alert
    },

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
