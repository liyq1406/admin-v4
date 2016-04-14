<template>
  <div class="form form-auth form-fetch-password">
    <div class="form-logo"><a v-link="{path: '/login'}" class="fa fa-chevron-circle-left link-return"></a></div>
    <form v-form name="validation" @submit.prevent="onSubmit" class="form-cont">
      <div class="form-header"><a v-link="{ path: '/fetch-password' }">{{ $t("auth.by_phone") }}</a><span>{{ $t("auth.by_mail") }}</span></div>
      <div class="form-body">
        <div class="form-hints">{{ $t("auth.by_mail_tips") }}</div>
        <div class="form-row">
          <div v-placeholder="$t('auth.fields.email')" class="input-text-wrap">
            <input type="email" v-model="model.email" v-form-ctrl name="email" required lazy class="input-text"/>
          </div>
          <div v-if="validation.email.$dirty" class="form-tips form-tips-error"><span v-if="validation.email.$error.required">{{ $t('validation.required', {field: $t('auth.fields.email')}) }}</span><span v-if="validation.email.$error.email">{{ $t('validation.format', {field: $t('auth.fields.email')}) }}</span></div>
          <div v-if="sendSuccess" class="form-tips form-tips-success"><span>{{ $t("auth.by_mail_success_msg") }}</span></div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-block">{{ $t("common.ok") }}</button>
        </div>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </form>
  </div>
</template>

<script>
  import api from '../api'
  import { globalMixins } from '../mixins'

  export default {
    name: 'FetchPwdByMailForm',

    layout: 'auth',

    mixins: [globalMixins],

    data () {
      return {
        validation: {},
        model: {},
        sendSuccess: false,
        sending: false
      }
    },

    methods: {
      onSubmit () {
        if (this.validation.$valid && !this.sending) {
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
