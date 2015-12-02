<template lang="jade">
  div
    .row
      .col-12
        // Start: 个人信息
        .panel
          .panel-hd
            radio-group(:items="periods", :value="period", @check="setPeriod")
            h2 个人信息
          .panel-bd
            ul.user-details
              li
                .label 姓名：
                .info samxlu
              li
                .label 邮箱：
                .info samxlu@xlink.cn
              li
                .label 手机
                .info 路路
              li
                .label 创建时间：
                .info 2015-11-12 19:33:22
              li
                .label 最后登录：
                .info 2015-11-12 19:33:22
              li
                .label 角色
                .info 普通用户
              li
                .label 状态：
                .info
                  span.hl-green 正常
              button.btn.btn-success.btn-lg.mt10.mb10(@click.prevent="showModal = true") 编辑
        // End: 个人信息

      .col-8
        // Start: 企业信息
        .panel
          .panel-hd
            v-select(:options="regions", :value="region", @select="setRegion")
            h2 企业信息
          .panel-bd
            ul.user-details
              li
                .label logo:
                .info samxlu
              li
                .label 企业名称：
                .info xlink云智易
              li
                .label 应用类型
                .info 智能家居
              li
                .label 联系人：
                .info 路路
              li
                .label 联系邮箱：
                .info xiaolu@xlink.cn
              li
                .label 联系电话：
                .info 13800138000
              li
                .label 创建时间:
                .info 2015-11-1  15:33:21
              button.btn.btn-success.btn-lg.mt10.mb10(@click.prevent="showModa2 = true") 编辑
        // End: 企业信息
    modal(:show.sync="showModal")
      h3(slot="header") 编辑用户信息
      .form(slot="body")
        form(v-form, name="validation")
          .form-row
            label.form-control 姓名：
            .controls
              .input-text-wrap(v-placeholder="'请输入姓名'")
                input.input-text(v-model="user.name", type="text", v-form-ctrl, name="name", maxlength="32", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入姓名
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入姓名
          .form-row
            label.form-control 邮箱：
            .controls
              .input-text-wrap(v-placeholder="'请输入邮箱'")
                input.input-text(v-model="user.name", type="email", v-form-ctrl, name="email", maxlength="32", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入邮箱
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入邮箱
          .form-row
            label.form-control 手机：
            .controls
              .input-text-wrap(v-placeholder="'请输入手机'")
                input.input-text(v-model="user.name", type="number", v-form-ctrl, name="phone", maxlength="11", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入手机
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入手机
          .form-row
            label.form-control 重复密码：
            .controls
              .input-text-wrap(v-placeholder="'请输入登录密码'")
                input.input-text(v-model="user.name", type="password", v-form-ctrl, name="phone", maxlength="11", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入重复密码
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入重复密码
          .form-row
            label.form-control 登录密码：
            .controls
              .input-text-wrap(v-placeholder="'请输入登录密码'")
                input.input-text(v-model="user.name", type="password", v-form-ctrl, name="phone", maxlength="11", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入登录密码
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入登录密码
          .form-row
            label.form-control 状态：
            .controls
              .select
                select(v-model="user.link_type", v-form-ctrl, name="link_type")
                  option(value="1", selected) 启用
                  option(value="2") 停用
          .form-row
            label.form-control 角色：
            .controls
              .select
                select(v-model="user.link_type", v-form-ctrl, name="link_type")
                  option(value="1") 管理员
                  option(value="2", selected) 普通用户
          .form-actions
            button.btn.btn-default(@click.prevent.stop="showModal = false") 取消
            button.btn.btn-primary(type="submit") 添加
    modal(:show.sync="showModa2")
      h3(slot="header") 22222222
      .form(slot="body")
        form(v-form, name="validation")
          .form-row
            label.form-control 邮箱：
            .controls
              .input-text-wrap(v-placeholder="'请输入成员邮箱'")
                input.input-text(v-model="corp.email", type="email", v-form-ctrl, name="email", maxlength="32", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.email.$pristine")
                span(v-if="validation.email.$error.required") 请输入成员邮箱
              .form-tips.form-tips-error(v-if="validation.email.$dirty")
                span(v-if="validation.email.$error.required") 请输入成员邮箱
          .form-row
            label.form-control 角色：
            .controls
              .select
                select(v-model="corp.link_type", v-form-ctrl, name="link_type")
                  option(value="1") 管理员
                  option(value="2", selected) 普通用户
          .form-actions
            button.btn.btn-default(@click.prevent.stop="showModal = false") 取消
            button.btn.btn-primary(type="submit") 添加
</template>
<style lang="stylus">
  @import '../../assets/stylus/common'

  ul.user-details
    li
      list-style none
      .label
        display inline-block
        width 103px
        line-height 35px
      .info
        display inline-block
</style>
<script>
  var Modal = require('../../components/modal.vue');
  var api = require('../../api');

  module.exports = {
    components: {

      'modal': Modal,
      'api': api
    },

    data: function () {
      return {
        query: '',
        searching: false,
        user: {},
        corp:{},
        showModal: false,
        showModa2: false,
        validation: {}
      }
    },

    route: {
      data: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.user.profile('1207d2acbacdc801').then(function (data) {
            if(__DEBUG__) {
              console.log(data);
            }

            console.log(self.users.list)
          });
        })
        return {};
      }
    },

    methods: {
      setQuery: function (query) {
        this.query = query;
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        this.setQuery('');
      }
    }
  };

</script>
