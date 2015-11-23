<template lang="jade">
  .form.form-auth.form-reset-password
    .form-header
      span 重设密码
    .form-body
      .form-hints xxx，您申请了重置密码，请在下方的输入框中输入您的新密码完成修改密码操作。
      .form-row
        .form-control 登录账号：
        .controls
          span xiaolu@xlink.cn
      .form-row
        label.form-control 输入新密码：
        .controls
          input(type="password")
      .form-row
        label.form-control 确认密码：
        .controls
          input(type="password")
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