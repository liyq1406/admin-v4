<template lang="jade">
  .form.form-auth.form-login
    .form-logo
    form.form-cont(v-form, name="registerForm", @submit.prevent="onSubmit")
      .form-header
        span 登录账号
        a(v-link="{ path: '/register' }") 注册账号
      .form-body
        .form-row
          input.input-text(type="text", placeholder="账号/电子邮箱")
        .form-row
          input.input-text(type="password", placeholder="密码")
        .operations
          a.fetch-password(v-link="{ path: '/fetch-password' }") 忘记密码?
          lable.remember-password
            input(type="checkbox")
            span 记住密码
        .form-actions
          button.btn.btn-primary.btn-block 登录
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-login
    .operations
      clearfix()
      margin 25px 0

      .fetch-password
        float right
        color red

      .remember-password
        input
          margin-right 5px
</style>

<script>
  module.exports = {

  };
</script>