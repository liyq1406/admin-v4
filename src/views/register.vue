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
            input.input-text(type="email", placeholder="电子邮箱", v-model="model.email", v-form-ctrl, name="email", required)
            .form-tips.form-tips-error(v-if="registerForm.email.$dirty")
              span(v-if="registerForm.email.$error.required") 请输入您的电子邮件地址
              span(v-if="registerForm.email.$error.email") 电子邮件地址格式不正确
          .form-row
            input.input-text(type="password", placeholder="密码", v-model="model.password", v-form-ctrl, required, maxlength="16", minlength="6", name="password")
            .form-tips.form-tips-error(v-if="registerForm.password.$dirty")
              span(v-if="registerForm.password.$error.required") 请输入密码
              span(v-if="registerForm.password.$error.minlength") 密码最小不能少于6位
              span(v-if="registerForm.password.$error.maxlength") 密码最大不能超过16位
          .form-row
            input.input-text(type="password", placeholder="再次输入密码", v-model="model.checkPassword", v-form-ctrl, required, custom-validator="customValidator", name="checkPassword")
            .form-tips.form-tips-error(v-if="registerForm.checkPassword.$dirty")
              span(v-if="model.password && registerForm.checkPassword.$error.required") 请再一次输入密码
              span(v-if="registerForm.checkPassword.$error.customValidator") 两次密码输入不一致
        .form-hints 请输入您的基本信息：
        .form-row-group
          .form-row
            input.input-text(type="text", placeholder="姓名", v-model="model.name", v-form-ctrl, required, maxlength="32", minlength="2", name="name")
            .form-tips.form-tips-error(v-if="registerForm.name.$dirty")
              span(v-if="registerForm.name.$error.required") 请输入姓名
              span(v-if="registerForm.name.$error.minlength") 姓名长度不能小于2
              span(v-if="registerForm.name.$error.maxlength") 电话号码长度不能大于32
          .form-row
            input.input-text(type="number", placeholder="联系电话", v-model="model.phone", v-form-ctrl, required, maxlength="11", minlength="8", name="phone")
            .form-tips.form-tips-error(v-if="registerForm.phone.$dirty")
              span(v-if="registerForm.phone.$error.required") 请输入您的联系电话
              span(v-if="registerForm.phone.$error.minlength") 电话号码长度不能小于8
              span(v-if="registerForm.phone.$error.number") 联系电话格式有误
              span(v-if="registerForm.phone.$error.maxlength") 电话号码长度不能大于11
          .form-row
            input.input-text(type="text", placeholder="公司名称", v-model="model.company", v-form-ctrl, required, maxlength="32", name="company")
            .form-tips.form-tips-error(v-if="registerForm.company.$dirty")
              span(v-if="registerForm.company.$error.required") 请输入您的公司名称
              span(v-if="registerForm.company.$error.maxlength") 公司名称长度不能大于32
          .form-row
            select(v-model="model.type", v-form-ctrl, required, name="type")
              option(selected) 请选择应用类型
              option(value="1") 消费电子（含穿戴设备/娱乐产品等）
              option(value="2") 智能家居
              option(value="3") 智能安防
              option(value="4") 商用/工控设备
              option(value="5") 其它
            .form-tips.form-tips-error(v-if="registerForm.type.$dirty")
              span(v-if="registerForm.type.$error.required") 请选择您的应用类型
        .form-actions
          button.btn.btn-primary.btn-block(type="submit") 注册
      .form-footer
        | 2015 &copy; 广州云湾信息技术有限公司.
</template>

<style lang="stylus">
  @import '../assets/stylus/common'

  .form-register
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
  // var Promise = require('promise');

  module.exports = {
    data: function () {
      return {
        registerForm: {},
        model: {}
      };
    },

    http: {
      headers: {
        "Content-Type": "application/json"
      }
    },

    methods: {
      getObjLength:function(obj){
        return Object.keys(obj).length;
      },

      customValidator: function (value) {
        return value === this.model.password;
      },

      onSubmit: function () {
        /*
        $.ajax({
          url: 'http://42.121.122.228:8887/v2/corp_register',
          type: 'POST',
          params: this.model,
          contentType: 'application/json',
          crossDomain: true,
          success: function (data, status, xhr) {
            console.log(status);
          },
          error: function (xhr, status, error) {
            console.log(status);
          }
        })
        */
        console.log(this.registerForm.$valid);
        this.$http.post('corp_register', this.model, function (data, status, request) {
          console.log(data);
        }).error(function (data, status, request) {
          console.log(status);
        });
      }
    }
  };
</script>