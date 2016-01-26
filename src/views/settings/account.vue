<template lang="jade">
div
  .row
    .col-12
      // Start: 个人信息
      .panel
        .panel-hd
          h2 {{ $t('account.personal') }}
        .panel-bd
          .tips-null(v-if="loadingAccount")
            i.fa.fa-refresh.fa-spin
            span {{ $t("common.data_loading") }}
          ul.user-details(v-else)
            li
              .label {{ $t("member.fields.name") }}:
              .info
                | {{member.name}}
                a.fa.fa-edit(href="#", @click.prevent="editAccount")
            li
              .label {{ $t("member.fields.password") }}:
              .info
                a.hl-red(href="#", @click.prevent="editPwd") 修改密码
            li
              .label {{ $t("member.fields.email") }}:
              .info {{member.email}}
            li
              .label {{ $t("member.fields.phone") }}:
              .info {{member.phone}}
            li
              .label {{ $t("member.fields.create_time") }}:
              .info {{member.create_time | formatDate}}
            li
              .label {{ $t("member.fields.last_auth_time") }}:
              .info {{member.last_auth_time | formatDate}}
            li
              .label {{ $t("member.fields.role") }}:
              .info
                span {{ memberTypes[member.role-1] }}
              //.info {{member.role}}
            li
              .label {{ $t("common.status") }}:
              .info
                span(:class="{'hl-gray': member.status===0, 'hl-green': member.status===1, 'hl-red': member.status===2}") {{ statusTypes[member.status] }}
            li
              .label {{ $t("member.fields.is_notice") }}:
              .info
                span.hl-green(v-if="member.is_notice") {{ $t("common.yes") }}
                span.hl-red(v-else) {{ $t("common.no") }}
            li
              .label {{ $t("member.fields.is_alert") }}:
              .info
                span.hl-green(v-if="member.is_alert") {{ $t("common.yes") }}
                span.hl-red(v-else) {{ $t("common.no") }}
            //- button.btn.btn-primary.mt10.mb10(@click.prevent="showEditAccountModal = true") 编辑
      // End: 个人信息

    .col-8
      // Start: 企业信息
      .panel
        .panel-hd
          h2 {{ $t('account.corp') }}
        .panel-bd
          .tips-null(v-if="loadingCorp")
            i.fa.fa-refresh.fa-spin
            span {{ $t("common.data_loading") }}
          ul.user-details(v-else)
            //li
              .label logo:
              .info samxlu
            li
              .label {{ $t("corp.fields.company") }}:
              .info {{corp.company}}
            li
              .label {{ $t("corp.fields.id") }}:
              .info {{corp.id}}
            li
              .label {{ $t("corp.fields.type") }}:
              .info {{accountTypes[corp.type - 1]}}
            li
              .label {{ $t("corp.fields.name") }}:
              .info {{corp_member.name}}
            li
              .label {{ $t("corp.fields.email") }}:
              .info {{corp_member.email}}
            li
              .label {{ $t("corp.fields.phone") }}:
              .info {{corp_member.phone}}
            li
              .label {{ $t("corp.fields.create_time") }}:
              .info {{corp.create_time | formatDate}}
            //button.btn.btn-success.btn-lg.mt10.mb10(@click.prevent="showEditPwdModal = true") 编辑
      // End: 企业信息
  modal(:show.sync="showEditAccountModal")
    h3(slot="header") {{ $t('account.edit_member') }}
    .form(slot="body")
      form(v-form, name="accountValidation", @submit.prevent="onSubmitAccount")
        .form-row
          label.form-control {{ $t("member.fields.name") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('member.placeholders.name')")
              input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="accountValidation.$submitted && accountValidation.name.$pristine")
              span(v-if="accountValidation.name.$error.required") {{ $t('validation.required', {field: $t('member.fields.name')}) }}
            .form-tips.form-tips-error(v-if="accountValidation.name")
              span(v-if="accountValidation.name.$error.required") {{ $t('validation.required', {field: $t('member.fields.name')}) }}
        .form-row
          label.form-control {{ $t("member.alert_settings") }}:
          .controls
            .checkbox-group
              label.checkbox
                input(type="checkbox", v-model="editModel.is_notice")
                | {{ $t("member.fields.is_notice") }}
              label.checkbox
                input(type="checkbox", v-model="editModel.is_alert")
                | {{ $t("member.fields.is_alert") }}
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onEditAccountCancel") {{ $t('common.cancel') }}
          button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")

  modal(:show.sync="showEditPwdModal", :width="320")
    h3(slot="header") {{ $t("auth.reset") }}
    .form(slot="body")
      form(v-form, name="pwdValidation", @submit.prevent="onSubmitPwd", hook="editPwdHook")
        .form-row
          .input-text-wrap(v-placeholder="$t('account.placeholders.old_password')")
            input.input-text(type="password", v-model="editPwdModel.oldpassword", v-form-ctrl, required, name="oldpassword", lazy)
          .form-tips.form-tips-error(v-if="pwdValidation.$submitted && pwdValidation.oldpassword.$pristine")
            span(v-if="pwdValidation.oldpassword.$error.required") {{ $t('validation.required', {field: $t('account.fields.old_password')}) }}
          .form-tips.form-tips-error(v-if="pwdValidation.oldpassword.$dirty")
            span(v-if="pwdValidation.oldpassword.$error.required") {{ $t('validation.required', {field: $t('account.fields.old_password')}) }}
        .form-row
          .input-text-wrap(v-placeholder="$t('account.placeholders.new_password')")
            input.input-text(type="password", v-model="editPwdModel.newpassword", v-form-ctrl, required, maxlength="16", minlength="6", name="newpassword", lazy)
          .form-tips.form-tips-error(v-if="pwdValidation.$submitted && pwdValidation.newpassword.$pristine")
            span(v-if="pwdValidation.newpassword.$error.required") {{ $t('validation.required', {field: $t('account.fields.new_password')}) }}
          .form-tips.form-tips-error(v-if="pwdValidation.newpassword.$dirty")
            span(v-if="pwdValidation.newpassword.$error.required") {{ $t('validation.required', {field: $t('account.fields.new_password')}) }}
            span(v-if="pwdValidation.newpassword.$error.minlength") {{ $t('validation.minlength', [ $t('account.fields.new_password'), 6]) }}
            span(v-if="pwdValidation.newpassword.$error.maxlength") {{ $t('validation.maxlength', [ $t('account.fields.new_password'), 16]) }}
        .form-row
          .input-text-wrap(v-placeholder="$t('auth.fields.confirm_password')")
            input.input-text(type="password", v-model="confirmPassword", v-form-ctrl, required, custom-validator="checkEqualToPassword", name="confirmPassword", lazy)
          .form-tips.form-tips-error(v-if="pwdValidation.$submitted && pwdValidation.confirmPassword.$pristine")
            span(v-if="pwdValidation.confirmPassword.$error.required") {{ $t("auth.confirm_password") }}
          .form-tips.form-tips-error(v-if="pwdValidation.confirmPassword.$dirty")
            span(v-if="editPwdModel.newpassword && pwdValidation.confirmPassword.$error.required") {{ $t("auth.confirm_password") }}
            span(v-if="pwdValidation.confirmPassword.$error.customValidator") {{ $t("auth.confirm_password_tips") }}
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onEditPwdCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")
</template>

<script>
  var Vue = require('vue');
  var Modal = require('../../components/modal.vue');
  var locales = require('../../consts/locales');
  var api = require('../../api');
  var _ = require('lodash');

  module.exports = {
    name: 'AccountSettings',

    components: {
      'modal': Modal
    },

    data: function () {
      return {
        accountTypes: locales[Vue.config.lang].accountTypes,
        memberTypes: locales[Vue.config.lang].member.types,
        statusTypes: locales[Vue.config.lang].member.status_types,
        query: '',
        searching: false,
        corp: {},
        corp_member: {},
        member: {},
        showEditAccountModal: false,
        showEditPwdModal: false,
        editModel: {},
        originEditModel: {},
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
      };
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
        this.loadingCorp = true;
        api.corp.refreshToken().then(function () { // 获取成员详情
          api.corp.getCorp().then(function (data) {
            if (__DEBUG__) {
              console.log('企业信息如下：');
              console.log(data);
            }
            self.corp = data;
            self.corp_member = data.member;
            self.loadingCorp = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingCorp = false;
          });
        });
      },

      // 获取个人信息
      getMemberInfo: function () {
        var self = this;
        var member_id = localStorage.getItem('member_id');

        this.loadingAccount = true;
        api.corp.refreshToken().then(function () { // 获取成员详情
          api.corp.getMember(member_id).then(function (data) {
            if (__DEBUG__) {
              console.log('个人信息如下：');
              console.log(data);
            }
            self.member = data;
            self.loadingAccount = false;
          }).catch(function (error) {
            self.handleError(error);
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
        this.editing = false;
        this.showEditAccountModal = false;
        this.editModel = _.clone(this.originEditModel);
      },

      // 关闭编辑浮层并净化编辑表单
      resetEditPassword: function () {
        var self = this;
        this.editing = false;
        this.showEditPwdModal = false;
        this.editPwdModel = _.clone(this.originEditPwdModel);
        this.confirmPassword = '';
        this.$nextTick(function () {
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
      onSubmitAccount: function () {
        var self = this;
        var member_id = localStorage.getItem('member_id');
        if (this.accountValidation.$valid && !this.editing) {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.corp.putMember(member_id, self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.resetEditAccount();
              if (data === 200) {
                self.getMemberInfo();
              }
            }).catch(function (error) {
              self.handleError(error);
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
                alert(self.$t('account.password_msg'));
              }
              self.resetEditPassword();
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        }
      }
    }
  };

</script>
