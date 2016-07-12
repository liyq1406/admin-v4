<template>
  <div class="auth-form">
    <div class="auth-msg-box" v-show="activateSuccess">
      <v-alert :cols="16" type="success" :title="successTitle">
        <p>{{ successMsg }}</p>
      </v-alert>
    </div>
    <div class="auth-msg-box" v-show="activateFail">
      <v-alert :cols="16" type="error" :title="failTitle">
        <p>{{ failMsg }}</p>
      </v-alert>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  import base64 from 'helpers/base64'
  import { globalMixins } from 'src/mixins'
  import Alert from 'components/Alert'

  export default {
    name: 'EmailActivateForm',

    layouts: ['auth'],

    mixins: [globalMixins],

    components: {
      'v-alert': Alert
    },

    data () {
      return {
        activateSuccess: false,
        activateFail: false,
        successTitle: this.$t('ui.auth.activate_success'),
        successMsg: this.$t('ui.auth.activate_success_msg'),
        failTitle: this.$t('ui.auth.activate_fail'),
        failMsg: this.$t('ui.auth.activate_fail_msg')
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
            this.failMsg = '用于激活成员的邮箱不存在'
            break
          case 4001062:
            this.activateSuccess = true
            this.successTitle = '温馨提示'
            this.successMsg = '该成员邮箱已经激活'
            break
          default:
            this.activateFail = true
        }
      })
    }
  }
</script>
