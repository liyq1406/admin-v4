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
                .info {{member.name}}
              li
                .label 邮箱：
                .info {{member.email}}
              li
                .label 手机
                .info {{member.phone}}
              li
                .label 创建时间：
                .info {{member.create_time}}
              li
                .label 最后登录：
                .info {{member.last_auth_time}}
              li
                .label 角色
                .info(v-if="member.role==1") 管理员
                .info(v-if="member.role==2") 普通成员
                //.info {{member.role}}
              li
                .label 状态：
                .info(v-if="member.status==0")
                  span.hl-red 待激活
                .info(v-if="member.status==1")
                  span.hl-green 正常可用
                .info(v-if="member.status==2")
                  span.hl-red 停用
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
              //li
                .label logo:
                .info samxlu
              li
                .label 企业名称：
                .info {{corp.company}}
              li
                .label 应用类型
                .info {{corp.type}}
              li
                .label 联系人：
                .info {{corp_member.name}}
              li
                .label 联系邮箱：
                .info {{corp_member.email}}
              li
                .label 联系电话：
                .info {{corp_member.phone}}
              li
                .label 创建时间:
                .info {{corp.create_time}}
              //button.btn.btn-success.btn-lg.mt10.mb10(@click.prevent="showModal2 = true") 编辑
        // End: 企业信息
    modal(:show.sync="showModal")
      h3(slot="header") 编辑用户信息
      .form(slot="body")
        form(v-form, name="validation")
          .form-row
            label.form-control 姓名：
            .controls
              .input-text-wrap(v-placeholder="'请输入姓名'")
                input.input-text(v-model="resetmember.name", type="text", v-form-ctrl,value="{{member.name}}" name="name", maxlength="32", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入姓名
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入姓名
          .form-actions
            button.btn.btn-default(@click.prevent.stop="showModal = false") 取消
            button.btn.btn-primary(type="submit",@click.prevent.stop="resetmembermessage") 确定
    //modal(:show.sync="showModal")
      h3(slot="header") 编辑用户信息
      .form(slot="body")
        form(v-form, name="validation")
          .form-row
            label.form-control 姓名：
            .controls
              .input-text-wrap(v-placeholder="'请输入姓名'")
                input.input-text(v-model="resetmember.name", type="text", v-form-ctrl, name="name", maxlength="32", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入姓名
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入姓名
          .form-row
            label.form-control 邮箱：
            .controls
              .input-text-wrap(v-placeholder="'请输入邮箱'")
                input.input-text(v-model="resetmember.name", type="email", v-form-ctrl, name="email", maxlength="32", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入邮箱
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入邮箱
          .form-row
            label.form-control 手机：
            .controls
              .input-text-wrap(v-placeholder="'请输入手机'")
                input.input-text(v-model="resetmember.name", type="number", v-form-ctrl, name="phone", maxlength="11", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入手机
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入手机
          .form-row
            label.form-control 登录密码：
            .controls
              .input-text-wrap(v-placeholder="'请输入登录密码'")
                input.input-text(v-model="resetmember.name", type="password", v-form-ctrl, name="phone", maxlength="11", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入登录密码
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入登录密码
          .form-row
            label.form-control 重复密码：
            .controls
              .input-text-wrap(v-placeholder="'请输入登录密码'")
                input.input-text(v-model="resetmember.name", type="password", v-form-ctrl, name="phone", maxlength="11", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                span(v-if="validation.name.$error.required") 请输入重复密码
              .form-tips.form-tips-error(v-if="validation.name")
                span(v-if="validation.name.$error.required") 请输入重复密码
          .form-row
            label.form-control 状态：
            .controls
              .select
                select(v-model="resetmember.link_type", v-form-ctrl, name="link_type")
                  option(value="1", selected) 启用
                  option(value="2") 停用
          .form-row
            label.form-control 角色：
            .controls
              .select
                select(v-model="resetmember.link_type", v-form-ctrl, name="link_type")
                  option(value="1") 管理员
                  option(value="2", selected) 普通用户
          .form-actions
            button.btn.btn-default(@click.prevent.stop="showModal = false") 取消
            button.btn.btn-primary(type="submit") 确定
    //modal(:show.sync="showModal2")
      h3(slot="header") 22222222
      .form(slot="body")
        form(v-form, name="validation")
          .form-row
            label.form-control 邮箱：
            .controls
              .input-text-wrap(v-placeholder="'请输入成员邮箱'")
                input.input-text(v-model="resetcorp.email", type="email", v-form-ctrl, name="email", maxlength="32", required)
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.email.$pristine")
                span(v-if="validation.email.$error.required") 请输入成员邮箱
              .form-tips.form-tips-error(v-if="validation.email.$dirty")
                span(v-if="validation.email.$error.required") 请输入成员邮箱
          .form-row
            label.form-control 角色：
            .controls
              .select
                select(v-model="resetcorp.link_type", v-form-ctrl, name="link_type")
                  option(value="1") 管理员
                  option(value="2", selected) 普通用户
          .form-actions
            button.btn.btn-default(@click.prevent.stop="showModal = false") 取消
            button.btn.btn-primary(type="submit") 确定
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
  //var route_config = require('../../route-config');

  module.exports = {
    components: {

      'modal': Modal,
      'api': api,
      //'route_config':route_config
    },

    data: function () {
      return {
        query: '',
        searching: false,
        member:{},
        resetmember: {},
        corp:{},
        corp_member:{},
        resetcorp:{},
        showModal: false,
        showModal2: false,
        validation: {}

      }
    },

    route: {
      data: function () {
        var self = this;
        //console.log(route_config.router.app.this_user);
        var mamber_id = localStorage.getItem('member_id');
        var corp_id = localStorage.getItem('corp_id');
        api.corp.refreshToken().then(function () {//获取成员详情
          api.corp.getCorp().then(function (data) {
            if(__DEBUG__) {
              console.log(data);
            }
            self.corp=data;
            self.corp_member=data.member;
          });
          api.corp.getMember(mamber_id).then(function (data) {
            if(__DEBUG__) {
              console.log(data);
            }
            self.member=data;

          });

        })
        return {};
      }
    },

    methods: {
      resetmembermessage:function(){
        var self = this;
        console.log(router.app.this_user);
        if(self.member.name!=self.resetmember.name){
          var mamber_id = localStorage.getItem('member_id');
          api.corp.refreshToken().then(function () {
            api.corp.putMember(mamber_id,{"name":self.resetmember.name}).then(function (data) {
              if(__DEBUG__) {
                console.log(data);
              }
              self.showModal = false;
              if(data==200){
                self.member.name=self.resetmember.name;
                console.log(self.this_user.name)
              }else{
                alert("修改失败！");
              }
            });
          });
        }else{
          self.showModal = false;
        }

      }
    }
  };

</script>
