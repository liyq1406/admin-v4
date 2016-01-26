<template lang="jade">
.form.form-auth.form-fetch-password
  .form-logo
    a.fa.fa-chevron-circle-left.link-return(v-link="{path: '/login'}")
  form.form-cont(v-form, name="validation", @submit.prevent="onSubmit")
    .form-header
      a(v-link="{ path: '/fetch-password' }") {{ $t("auth.by_phone") }}
      span {{ $t("auth.by_mail") }}
    .form-body
      .form-hints {{ $t("auth.by_mail_tips") }}
      .form-row
      .form-row
        .input-text-wrap(v-placeholder="$t('auth.fields.email')")
          input.input-text(type="email", v-model="model.email", v-form-ctrl, name="email", required, lazy)
        .form-tips.form-tips-error(v-if="validation.email.$dirty")
          span(v-if="validation.email.$error.required") {{ $t('validation.required', {field: $t('auth.fields.email')}) }}
          span(v-if="validation.email.$error.email") {{ $t('validation.format', {field: $t('auth.fields.email')}) }}
        .form-tips.form-tips-success(v-if="sendSuccess")
          span {{ $t("auth.by_mail_success_msg") }}
      .form-actions
        button.btn.btn-primary.btn-block(type="submit") {{ $t("common.ok") }}
    .form-footer
      | 2015 &copy; {{ $t("common.company") }}.
</template>

<script>
  var api = require('../api');

  module.exports = {
    name: 'FetchPwdByMailForm',

    data: function () {
      return {
        validation: {},
        model: {},
        sendSuccess: false,
        sending: false
      };
    },

    methods: {
      onSubmit: function () {
        var self = this;
        if (this.validation.$valid && !this.sending) {
          this.sending = true;
          api.corp.fetchPasswordByMail(this.model).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            if (data === 200) {
              self.sendSuccess = true;
              self.sending = false;
            }
          }).catch(function (error) {
            self.handleError(error);
            self.sending = false;
          });
        }
      }
    }
  };
</script>
