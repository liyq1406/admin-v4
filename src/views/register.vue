<template lang="jade">
  .form.form-auth.form-register
    .form-logo
    form.form-cont(v-form, name="registerForm", @submit.prevent="onSubmit")
      .form-header
        a(v-link="{ path: '/login' }") 登录账号
        span 注册账号
      .form-body
        .form-hints 请输入您的账号信息：
        .form-row-group
          .form-row
            input.input-text(type="text", placeholder="账号/电子邮箱", v-model="username")
          .form-row
            input.input-text(type="password", placeholder="密码")
          .form-row
            input.input-text(type="password", placeholder="再次输入密码")
        .form-hints 请输入您的基本信息：
        .form-row-group
          .form-row
            input.input-text(type="text", placeholder="姓名")
          .form-row
            input.input-text(type="text", placeholder="联系电话")
          .form-row
            input.input-text(type="text", placeholder="公司名称")
          .form-row
            select
              option 请选择应用类型
              option(value="1") 消费电子（含穿戴设备/娱乐产品等）
              option(value="2") 智能家居
              option(value="3") 智能安防
              option(value="4") 商用/工控设备
              option(value="5") 其它
        .form-actions
          button.btn.btn-primary.btn-block(type="submit") 注册
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-register
    margin-top -360px

    select
      display block
      width 100%
      border 1px solid #D9D9D9
      height 35px
      line-height 35px
      outline none
      box-sizing border-box

</style>

<script>
  module.exports = {
    data: function () {
      return {
        username: ''
      }
    },

    methods: {
      onSubmit: function () {
        console.log(11111);
      }
    }
  };
</script>