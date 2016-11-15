<template>
  <div class="auth-form fetch-form">
    <div class="inner">
      <a v-link="{path: '/login'}" class="fa fa-chevron-circle-left link-return"></a>
      <div class="form-legend">{{ $t("auth.by_mail") }}</div>
      <div class="form">
        <validator name="authValidation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmit">
            <div class="form-hints">{{ $t("auth.by_mail_tips") }}</div>
            <div class="form-row">
              <div v-placeholder="$t('auth.fields.email')" class="input-text-wrap">
                <input type="text" v-model="model.email" name="model.email" v-validate:email="{required: true, format: 'email'}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.email.touched && $authValidation.email.required">{{ $t('common.validation.required', {field: $t('auth.fields.email')}) }}</span>
                <span v-if="$authValidation.email.modified && $authValidation.email.format">{{ $t('common.validation.format', {field: $t('auth.fields.email')}) }}</span>
              </div>
              <div v-if="sendSuccess" class="form-tips form-tips-success"><span><i class="fa fa-check-circle"></i>{{ $t("auth.by_mail_success_msg") }}</span></div>
            </div>
            <div class="form-actions">
              <button @keyup.enter="onSubmit" :disabled="sending" :class="{'disabled':sending}" v-text="sending ? $t('common.handling') : $t('common.ok')" class="btn btn-primary btn-xlg btn-pill">{{ $t("common.ok") }}</button>
            </div>
            <div class="form-operations"><a v-link="{ path: '/fetch-password' }">{{ $t("auth.by_phone") }}</a></div>
          </form>
        </validator>
      </div>
    </div>
  </div>
</template>

<script>
  import api from 'api'
  export default {
    name: 'FetchPwdByMailForm',

    layouts: ['auth'],
    data () {
      return {
        model: {},
        sendSuccess: false,
        sending: false
      }
    },

    methods: {
      onSubmit () {
        if (this.$authValidation.valid && !this.sending) {
          this.sending = true
          api.corp.fetchPasswordByMail(this.model).then((res) => {
            if (res.status === 200) {
              this.sendSuccess = true
              this.sending = false
            }
          }).catch((res) => {
            this.handleError(res)
            this.sending = false
          })
        }
      }
    }
  }
</script>
