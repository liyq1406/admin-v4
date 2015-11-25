<template lang="jade">
  .form.form-auth.form-fetch-password
    .form-logo
    form.form-cont(v-form, name="registerForm", @submit.prevent="onSubmit")
      .form-header
        h2 找回密码
        p 请输入您的注册邮箱，我们会将重设密码的链接发到您的邮箱中。
      .form-body
        .form-row
          input.input-text(type="text", placeholder="请输入邮箱")
        .form-tips.form-tips-success
          i.fa.fa-check-circle
          span 一封找回密码的邮件已发送到您的邮箱，请查收
        .form-tips.form-tips-error
          i.fa.fa-times-circle
          span 该邮箱地址不存在，请重试
        .form-actions
          button.btn.btn-primary.btn-block 确定
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-fetch-password
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
</style>

<script>
  module.exports = {

  };
</script>