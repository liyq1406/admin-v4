<template>
  <div class="auth-form">
    <div class="auth-msg-box" v-show="activateSuccess">
      <x-alert :cols="16" type="success" :title="successTitle">
        <p>{{ successMsg }}</p>
      </x-alert>
    </div>
    <div class="auth-msg-box" v-show="activateFail">
      <x-alert :cols="16" type="error" :title="failTitle">
        <p>{{ failMsg }}</p>
      </x-alert>
    </div>
  </div>
</template>

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
        activateFail: false,
        successTitle: this.$t('auth.activate_success'),
        successMsg: this.$t('auth.activate_success_msg'),
        failTitle: this.$t('auth.activate_fail'),
        failMsg: this.$t('auth.activate_fail_msg')
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
      }).catch((res) => {
        switch (res.data.error.code) {
          case 4041004:
            this.activateFail = true
            this.failMsg = this.$t('auth.email_not_exists')
            break
          case 4001062:
            this.activateSuccess = true
            this.successTitle = this.$t('auth.success_tips')
            this.successMsg = this.$t('auth.email_activated')
            break
          default:
            this.activateFail = true
        }
      })
    }
  }
</script>
