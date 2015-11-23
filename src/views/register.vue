<template lang="jade">
  .form.form-auth.form-login
    .form-header
      a(v-link="{ path: '/login' }") 登录
      span 注册
    .form-body
      .form-row
        input(type="text", placeholder="账号/电子邮箱")
      .form-row
        input(type="password")
      .form-actions
        button 登录
      .operations
        a.fetch-password(v-link="{ path: '/fetch-password' }")
        lable.remember-password
          input(type="checkbox")
          span 记住密码
    .form-footer
      | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'
</style>

<script>
  module.exports = {

  };
</script>