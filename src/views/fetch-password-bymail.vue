<template>
  <div class="form form-auth form-fetch-password">
    <div class="form-logo"><a v-link="{path: '/login'}" class="fa fa-chevron-circle-left link-return"></a></div>
    <form v-form name="validation" @submit.prevent="onSubmit" class="form-cont">
      <div class="form-header"><a v-link="{ path: '/fetch-password' }">{{ $t("ui.auth.by_phone") }}</a><span>{{ $t("ui.auth.by_mail") }}</span></div>
      <div class="form-body">
        <div class="form-hints">{{ $t("ui.auth.by_mail_tips") }}</div>
        <div class="form-row row">
          <div v-placeholder="$t('ui.auth.fields.email')" class="input-text-wrap">
            <input type="email" v-model="model.email" v-form-ctrl name="email" required lazy class="input-text"/>
          </div>
          <div v-if="validation.email.$dirty" class="form-tips form-tips-error"><span v-if="validation.email.$error.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.email')}) }}</span><span v-if="validation.email.$error.email">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.email')}) }}</span></div>
          <div v-if="sendSuccess" class="form-tips form-tips-success"><span>{{ $t("ui.auth.by_mail_success_msg") }}</span></div>
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
