<template lang="jade">
  .form.form-auth.form-fetch-password
    .form-header
      span 找回密码
    .form-body
      .form-hints 请输入您的注册邮箱，我们会将重设密码的链接发到您的邮箱中。
      .form-row
        input(type="text", placeholder="请输入邮箱")
      .form-actions
        button 确定
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