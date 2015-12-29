<template lang="jade">
  div
    .row
      .col-12
        // Start: 个人信息
        .panel
          .panel-hd
            h2 个人信息
          .panel-bd
            .tips-null(v-if="loadingAccount")
              i.fa.fa-refresh.fa-spin
              span 数据加载中...
            ul.user-details(v-else)
              li
                .label 姓名：
                .info
                  | {{member.name}}
                  a.fa.fa-edit(href="#", @click.prevent="editAccount")
              li
                .label 密码：
                .info
                  a.hl-red(href="#", @click.prevent="editPwd") 修改密码
              li
                .label 邮箱：
                .info {{member.email}}
              li
                .label 手机：
                .info {{member.phone}}
              li
                .label 创建时间：
                .info {{member.create_time | formatDate}}
              li
                .label 最后登录：
                .info {{member.last_auth_time | formatDate}}
              li
                .label 角色：
                .info
                  span(v-if="member.role==1") 管理员
                  span(v-if="member.role==2") 普通成员
                //.info {{member.role}}
              li
                .label 状态：
                .info
                  span.hl-gray(v-if="member.status==0") 待激活
                  span.hl-green(v-if="member.status==1") 正常可用
                  span.hl-red(v-if="member.status==2") 停用
              li
                .label 是否接受通知:
                .info
                  span.hl-green(v-if="member.is_notice") 是
                  span.hl-red(v-else) 否
              li
                .label 是否接受告警:
                .info
                  span.hl-green(v-if="member.is_alert") 是
                  span.hl-red(v-else) 否
              //- button.btn.btn-primary.mt10.mb10(@click.prevent="showEditAccountModal = true") 编辑
        // End: 个人信息

      .col-8
        // Start: 企业信息
        .panel
          .panel-hd
            h2 企业信息
          .panel-bd
            .tips-null(v-if="loadingCorp")
              i.fa.fa-refresh.fa-spin
              span 数据加载中...
            ul.user-details(v-else)
              //li
                .label logo:
                .info samxlu
              li
                .label 企业名称：
                .info {{corp.company}}
              li
                .label 企业ID：
                .info {{corp.id}}
              li
                .label 应用类型：
                .info {{accountTypes[corp.type - 1]}}
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
                .info {{corp.create_time | formatDate}}
              //button.btn.btn-success.btn-lg.mt10.mb10(@click.prevent="showEditPwdModal = true") 编辑
        // End: 企业信息
    modal(:show.sync="showEditAccountModal")
      h3(slot="header") 编辑用户信息
      .form(slot="body")
        form(v-form, name="accountValidation", @submit.prevent="onSubmitAccount")
          .form-row
            label.form-control 姓名：
            .controls
              .input-text-wrap(v-placeholder="'请输入姓名'")
                input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", maxlength="32", required, lazy)
              .form-tips.form-tips-error(v-if="accountValidation.$submitted && accountValidation.name.$pristine")
                span(v-if="accountValidation.name.$error.required") 请输入姓名
              .form-tips.form-tips-error(v-if="accountValidation.name")
                span(v-if="accountValidation.name.$error.required") 请输入姓名
          .form-row
            label.form-control 通知与告警：
            .controls
              .checkbox-group
                label.checkbox
                  input(type="checkbox", v-model="editModel.is_notice")
                  | 接受通知
                label.checkbox
                  input(type="checkbox", v-model="editModel.is_alert")
                  | 接受告警
          .form-actions
            button.btn.btn-default(@click.prevent.stop="onEditAccountCancel") 取消
            button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? '处理中...' : '确定'")

    modal(:show.sync="showEditPwdModal", :width="320")
      h3(slot="header") 修改密码
      .form(slot="body")
        form(v-form, name="pwdValidation", @submit.prevent="onSubmitPwd", hook="editPwdHook")
          .form-row
            .input-text-wrap(v-placeholder="'旧密码'")
              input.input-text(type="password", v-model="editPwdModel.oldpassword", v-form-ctrl, required, name="oldpassword", lazy)
            .form-tips.form-tips-error(v-if="pwdValidation.$submitted && pwdValidation.oldpassword.$pristine")
              span(v-if="pwdValidation.oldpassword.$error.required") 请输入旧密码
            .form-tips.form-tips-error(v-if="pwdValidation.oldpassword.$dirty")
              span(v-if="pwdValidation.oldpassword.$error.required") 请输入旧密码
          .form-row
            .input-text-wrap(v-placeholder="'新密码'")
              input.input-text(type="password", v-model="editPwdModel.newpassword", v-form-ctrl, required, maxlength="16", minlength="6", name="newpassword", lazy)
            .form-tips.form-tips-error(v-if="pwdValidation.$submitted && pwdValidation.newpassword.$pristine")
              span(v-if="pwdValidation.newpassword.$error.required") 请输入新密码
            .form-tips.form-tips-error(v-if="pwdValidation.newpassword.$dirty")
              span(v-if="pwdValidation.newpassword.$error.required") 请输入新密码
              span(v-if="pwdValidation.newpassword.$error.minlength") 密码最小不能少于6位
              span(v-if="pwdValidation.newpassword.$error.maxlength") 密码最大不能超过16位
          .form-row
            .input-text-wrap(v-placeholder="'再次输入密码'")
              input.input-text(type="password", v-model="confirmPassword", v-form-ctrl, required, custom-validator="checkEqualToPassword", name="confirmPassword", lazy)
            .form-tips.form-tips-error(v-if="pwdValidation.$submitted && pwdValidation.confirmPassword.$pristine")
              span(v-if="pwdValidation.confirmPassword.$error.required") 请再一次输入密码
            .form-tips.form-tips-error(v-if="pwdValidation.confirmPassword.$dirty")
              span(v-if="editPwdModel.newpassword && pwdValidation.confirmPassword.$error.required") 请再一次输入密码
              span(v-if="pwdValidation.confirmPassword.$error.customValidator") 两次密码输入不一致
          .form-actions
            button.btn.btn-default(@click.prevent.stop="onEditPwdCancel") 取消
            button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? '处理中...' : '确定'")
</template>

<script>
  var Modal = require('../../components/modal.vue');
  var config = require('../../consts/config');
  var api = require('../../api');
  var _ = require('lodash');

  module.exports = {
    name: 'AccountSettings',

    components: {
      'modal': Modal,
      'api': api
    },

    data: function () {
      return {
        accountTypes: config.accountTypes,
        query: '',
        searching: false,
        corp:{},
        corp_member:{},
        member: {},
        showEditAccountModal: false,
        showEditPwdModal: false,
        editModel: {},
        originEditModel:{},
        editPwdModel: {
          oldpassword: '',
          newpassword: ''
        },
        originEditPwdModel: {},
        accountValidation: {},
        confirmPassword: '',
        pwdValidation: {},
        editing: false,
        loadingAccount: false,
        loadingCorp: false
      }
    },

    route: {
      data: function () {
        this.getCorpInfo();
        this.getMemberInfo();
        /*
        var self = this;
        var member_id = localStorage.getItem('member_id');
        var corp_id = localStorage.getItem('corp_id');
        api.corp.refreshToken().then(function () {//获取成员详情
          api.corp.getCorp().then(function (data) {
            if(__DEBUG__) {
              console.log("企业信息如下：");
              console.log(data);
            }
            self.corp=data;
            self.corp_member=data.member;
          }).catch(function (error) {
            self.handleError(error)
          });

          api.corp.getMember(member_id).then(function (data) {
            if(__DEBUG__) {
              console.log("个人信息如下：");
              console.log(data);
            }
            self.member=data;
          }).catch(function (error) {
            self.handleError(error)
          });
        })
        */
      }
    },

    watch: {
      member: function (newVal, oldVal) {
        this.$dispatch('update-member', newVal);
      }
    },

    methods: {
      // 获取企业信息
      getCorpInfo: function () {
        var self = this;
        // var corp_id = localStorage.getItem('corp_id');
        this.loadingCorp = true
        api.corp.refreshToken().then(function () {//获取成员详情
          api.corp.getCorp().then(function (data) {
            if(__DEBUG__) {
              console.log("企业信息如下：");
              console.log(data);
            }
            self.corp = data;
            self.corp_member = data.member;
            self.loadingCorp = false;
          }).catch(function (error) {
            self.handleError(error)
            self.loadingCorp = false;
          });
        });
      },

      // 获取个人信息
      getMemberInfo: function () {
        var self = this;
        var member_id = localStorage.getItem('member_id');

        this.loadingAccount = true;
        api.corp.refreshToken().then(function () {//获取成员详情
          api.corp.getMember(member_id).then(function (data) {
            if(__DEBUG__) {
              console.log("个人信息如下：");
              console.log(data);
            }
            self.member = data;
            self.loadingAccount = false;
          }).catch(function (error) {
            self.handleError(error)
            self.loadingAccount = false;
          });
        });
      },
      /*
      // 编辑账户信息表单钩子
      editAccountHook: function (form) {
        this.editAccountForm = form;
      },
      */

      // 修改密码表单钩子
      editPwdHook: function (form) {
        this.editPwdForm = form;
      },

      // 关闭编辑账户信息浮层并净化表单
      resetEditAccount: function () {
        var self = this;
        this.editing = false;
        this.showEditAccountModal = false;
        this.editModel = _.clone(this.originEditModel);
        //this.$nextTick(function () {
          //self.editAccountForm.setPristine();
        //});
      },

      // 关闭编辑浮层并净化编辑表单
      resetEditPassword: function () {
        var self = this;
        this.editing = false;
        this.showEditPwdModal = false;
        this.editPwdModel = _.clone(this.originEditPwdModel);
        this.confirmPassword = '';
        this.$nextTick(function (){
          self.editPwdForm.setPristine();
        });
      },

       // 初始化编辑用户信息表单
      editAccount: function () {
        var model = {
          name: this.member.name,
          is_alert: this.member.is_alert,
          is_notice: this.member.is_notice
        };
        this.showEditAccountModal = true;
        this.editModel = _.clone(model);
        this.originEditModel = _.clone(model);
      },

      // 初始化编辑用户信息表单
      editPwd: function () {
        this.showEditPwdModal = true;
        this.originEditPwdModel = _.clone(this.editPwdModel);
      },

      // 取消编辑用户信息
      onEditAccountCancel: function () {
        this.resetEditAccount();
      },

      // 取消修改密码
      onEditPwdCancel: function () {
        this.resetEditPassword();
      },

      // 提交编辑用户信息
      onSubmitAccount:function(){
        var self = this;
        var member_id = localStorage.getItem('member_id');
        if (this.accountValidation.$valid && !this.editing) {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.corp.putMember(member_id, self.editModel).then(function (data) {
              if(__DEBUG__) {
                console.log(data);
              }
              self.resetEditAccount();
              if(data==200){
                self.getMemberInfo();
              }else{
                alert("修改失败！");
              }
            }).catch(function (error) {
              self.handleError(error)
              self.editing = false;
            });
          });
        }
      },

      /**
       * 检查密码是否相等
       * @param  {String} value 密码值
       */
      checkEqualToPassword: function (value) {
        return value === this.editPwdModel.newpassword;
      },

      // 提交密码修改
      onSubmitPwd: function () {
        var self = this;

        if (this.pwdValidation.$valid && !this.editing) {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.corp.memberResetPwd(self.editPwdModel).then(function (status) {
              if (status === 200) {
                alert('密码修改成功');
              }
              self.resetEditPassword();
            }).catch(function (error) {
              self.handleError(error)
              self.editing = false;
            });
          })
        }
      }
    }
  };

</script>

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

        .fa
          font-size 16px
          margin 0 10px
</style>
