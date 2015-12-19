<template lang="jade">
  .form.form-auth.form-reset-password
    .form-logo
    form.form-cont(v-form, name="validation", @submit.prevent="onSubmit")
      .form-header
        h2 重设密码
        p 请在下方的输入框中输入您zza的新密码完成修改密码操作。
      .form-body
        .form-row
          | 登录帐号：xiaolu@xlink.cn
        .form-row
          .input-text-wrap(v-placeholder="'请输入新密码'")
            input.input-text(type="password", v-model="model.password", v-form-ctrl, required, maxlength="16", minlength="6", name="password")
          .form-tips.form-tips-error(v-if="validation.$submitted && validation.password.$pristine")
            span(v-if="validation.password.$error.required") 请输入新密码
          .form-tips.form-tips-error(v-if="validation.password.$dirty")
            span(v-if="validation.password.$error.required") 请输入新密码
            span(v-if="validation.password.$error.minlength") 密码最小不能少于6位
            span(v-if="validation.password.$error.maxlength") 密码最大不能超过16位
        .form-row
          .input-text-wrap(v-placeholder="'再次输入密码'")
            input.input-text(type="password", v-model="confirmPassword", v-form-ctrl, required, custom-validator="checkEqualToPassword", name="confirmPassword")
          .form-tips.form-tips-error(v-if="validation.$submitted && validation.confirmPassword.$pristine")
            span(v-if="validation.confirmPassword.$error.required") 请再一次输入密码
          .form-tips.form-tips-error(v-if="validation.confirmPassword.$dirty")
            span(v-if="model.password && validation.confirmPassword.$error.required") 请再一次输入密码
            span(v-if="validation.confirmPassword.$error.customValidator") 两次密码输入不一致
        .form-actions
          button.btn.btn-primary.btn-block(type="submit") 确定
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.

    .form-cont.reset-password-success
      .alert.alert-success
        .icon.icon-success
        h2 修改成功
        p 您的密码已重置成功，请重新登录。
      .form-actions
        a.btn.btn-primary.btn-block(v-link="{ path: '/login'}") 确定
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-reset-password
    .form-cont
      padding-left 100px
      padding-right 100px

    .form-header
      padding 0
      margin-bottom 30px

    .form-body
      padding 0

    .form-actions
      margin-top 30px

    .alert
      padding-left 60px

      h2
        margin 0
        font-size 20px
        font-weight normal

      p
        margin 0
        font-size 12px

    .alert-success
      background url('../assets/images/icon_check_circle_o.png') no-repeat 0 5px
      margin-bottom 50px

    .reset-password-success
      padding 80px 140px

      .form-actions
        button
          width 90%
</style>

<script>
  module.exports = {
    data: function () {
      return {
        validation: {},
        model: {},
        confirmPassword: ''
      }
    },

    methods: {
      checkEqualToPassword: function (value) {
        return value === this.model.password;
      },

      onSubmit: function () {

      }
    }
  };
</script>
