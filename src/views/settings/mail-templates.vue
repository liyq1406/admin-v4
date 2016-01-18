<template lang="jade">
div
  //- Start: 通用设置
  .panel
    .panel-hd
      h2 通用设置
    .panel-bd
      .form
        form(v-form, name="validation", @submit.prevent="onSenderSubmit")
          .form-row
            label.form-control 邮件来源：
            .controls
              .input-text-wrap(v-placeholder="'如：noreply'")
                input.input-text(v-model="sender", type="text", v-form-ctrl, name="sender", required, lazy, custom-validator="noSpaceEnds")
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.sender.$pristine")
                span(v-if="validation.sender.$error.required") 请输入邮件来源
              .form-tips.form-tips-error(v-if="validation.sender.$dirty")
                span(v-if="validation.sender.$error.required") 请输入邮件来源
                span(v-if="validation.sender.$error.customValidator") 邮件来源不能带空格
          .form-actions
            button.btn.btn-primary.btn-lg(type="submit", :disabled="savingActivate || savingReset", :class="{'disabled': savingActivate || savingReset}", v-text="savingActivate || savingReset ? '处理中...' : '保存'")
  //- End: 通用设置

  //- Start: 激活邮件模板
  .panel
    .panel-hd
      .status(v-show="!loading")
        | 状态：
        span(v-if="activateStatus === 0") 待审核
        span.hl-red(v-if="activateStatus === -1") 审核不通过
        span.hl-green(v-if="activateStatus === 1 || activateStatus === -2") 审核通过
      h2 激活邮件模板
    .panel-bd
      .form.template-form
        form(v-form, name="activateValidation", @submit.prevent="onActivateSubmit")
          .form-row
            label.form-control 邮件标题：
            .controls
              .input-text-wrap
                input.input-text(v-model="activateModel.subject", type="text", v-form-ctrl, name="subject", required, lazy)
              .form-tips.form-tips-error(v-if="activateValidation.$submitted && activateValidation.subject.$pristine")
                span(v-if="activateValidation.subject.$error.required") 请输入邮件标题
              .form-tips.form-tips-error(v-if="activateValidation.subject.$dirty")
                span(v-if="activateValidation.subject.$error.required") 请输入邮件标题
          .form-row
            label.form-control 邮件内容：
            .controls
              .input-text-wrap
                textarea.input-text(v-model="activateModel.content", type="text", v-form-ctrl, name="content", required, lazy)
              .form-tips.form-tips-error(v-if="activateValidation.$submitted && activateValidation.content.$pristine")
                span(v-if="activateValidation.content.$error.required") 请输入邮件内容
              .form-tips.form-tips-error(v-if="activateValidation.content.$dirty")
                span(v-if="activateValidation.content.$error.required") 请输入邮件内容
            //-
              .form-hints-inline
                p 模板内容变量必填项：
                p 用户昵称 %username%
                p 企业ID %corp_id%
                p 邮箱地址 %email%
                p 验证码 %verifycode%
                p 日期 %date%
          .form-actions
            button.btn.btn-primary.btn-lg(type="submit", :disabled="activateStatus === 0 || savingActivate", :class="{'disabled': activateStatus === 0 || savingActivate}", v-text="savingActivate ? '处理中...' : '保存'")
  //- End: 激活邮件模板

  //- Start: 重置密码邮件模板
  .panel
    .panel-hd
      .status(v-show="!loading")
        | 状态：
        span(v-if="resetStatus === 0") 待审核
        span.hl-red(v-if="resetStatus === -1") 审核不通过
        span.hl-green(v-if="resetStatus === 1 || resetStatus === -2") 审核通过
      h2 重置密码邮件模板
    .panel-bd
      .form.template-form
        form(v-form, name="resetValidation", @submit.prevent="onResetSubmit")
          .form-row
            label.form-control 邮件标题：
            .controls
              .input-text-wrap
                input.input-text(v-model="resetModel.subject", type="text", v-form-ctrl, name="subject", required, lazy)
              .form-tips.form-tips-error(v-if="resetValidation.$submitted && resetValidation.subject.$pristine")
                span(v-if="resetValidation.subject.$error.required") 请输入邮件标题
              .form-tips.form-tips-error(v-if="resetValidation.subject.$dirty")
                span(v-if="resetValidation.subject.$error.required") 请输入邮件标题
          .form-row
            label.form-control 邮件内容：
            .controls
              .input-text-wrap
                textarea.input-text(v-model="resetModel.content", type="text", v-form-ctrl, name="content", required, lazy)
              .form-tips.form-tips-error(v-if="resetValidation.$submitted && resetValidation.content.$pristine")
                span(v-if="resetValidation.content.$error.required") 请输入邮件内容
              .form-tips.form-tips-error(v-if="resetValidation.content.$dirty")
                span(v-if="resetValidation.content.$error.required") 请输入邮件内容
            //-
              .form-hints-inline
                p 模板内容变量必填项：
                p 用户昵称 %username%
                p 企业ID %corp_id%
                p 邮箱地址 %email%
                p 验证码 %verifycode%
                p 日期 %date%
          .form-actions
            button.btn.btn-primary.btn-lg(type="submit", :disabled="resetStatus === 0 || savingReset", :class="{'disabled': resetStatus === 0 || savingReset}", v-text="savingReset ? '处理中...' : '保存'")
  //- End: 重置密码邮件模板
</template>

<script>
import api from '../../api';

export default {
  name: 'MailTemplates',

  data () {
    return {
      validation: {},
      loading: true,
      activateStatus: -2,
      activateId: '',
      activateValidation: {},
      resetStatus: -2,
      resetId: '',
      resetValidation: {},
      sender: '',
      activateModel: {},
      resetModel: {},
      savingActivate: false,
      savingReset: false
    };
  },

  watch: {
    sender: function () {
      this.activateModel.sender = this.sender;
      this.resetModel.sender = this.sender;
    }
  },

  route: {
    data: function () {
      var self = this;
      // var list = [];
      api.corp.refreshToken().then(function () {
        api.email.getTemplateList().then(function (data) {
          var model1 = {
            name: '激活邮件模板',
            subject: '欢迎注册云智易',
            sender: '',
            content: '<p>亲爱的&nbsp;%username%，</p>\n\n<div>欢迎注册云智易，请点击下方的链接完成帐号激活。</div>\n\n<div>&nbsp;http://%admin_host%/#!/user-email-activate/%corp_id%/%email%/%verifycode%</div>\n\n<div>&nbsp;（本链接将在48小时后失效）</div>\n\n<div>&nbsp;</div>\n\n<div>本邮件由系统自动发出，请勿回复</div>\n\n<div>&nbsp;</div>\n\n<div>云智易</div>\n\n<div>%date%</div>',
            type: 1
          };
          var model2 = {
            name: '重置密码邮件模板',
            subject: '云智易找回密码',
            sender: '',
            content: '<p>亲爱的&nbsp;&nbsp; %username%，</p>\n\n<p>我们收到了您找回密码的请求，请点击下方链接完成密码找回：</p>\n\n<p>http://%admin_host%/#!/user-password-reset/%corp_id%/%email%/%verifycode%</p>\n\n<p>（本链接将在48小时后失效）</p>\n\n<p>本邮件由系统自动发出，请勿回复</p>\n\n<p>&nbsp;</p>\n\n<p>云智易</p>\n\n<p>%date%</p>',
            type: 2
          };
          var template, i;

          self.loading = false;

          for (i = 0; i < data.count; i++) {
            template = data.list[i];
            self.sender = template.sender;
            if (template.type === 1) {
              model1.subject = template.subject;
              model1.content = template.content;
              self.activateStatus = template.status;
              self.activateId = template.id;
            } else if (template.type === 2) {
              model2.subject = template.subject;
              model2.content = template.content;
              self.resetStatus = template.status;
              self.resetId = template.id;
            }
          }

          self.activateModel = model1;
          self.resetModel = model2;
        });
      });
    }
  },

  methods: {
    /**
     * 提交邮件来源
     */
    onSenderSubmit () {
      if (this.validation.$valid && this.activateValidation.$valid && this.resetValidation.$valid) {
        this.onActivateSubmit();
        this.onResetSubmit();
      }
    },

    /**
     * 提交激活邮件模板
     */
    onActivateSubmit () {
      var self = this;
      if (!this.validation.$valid) {
        alert('请输入合法的邮件来源');
        return;
      }
      if (this.validation.$valid && this.activateValidation.$valid) {
        this.savingActivate = true;
        if (this.activateStatus === -2) { // 新增
          api.corp.refreshToken().then(function () {
            api.email.createTemplate(self.activateModel).then(function (data) {
              self.activateStatus = data.status;
              self.savingActivate = false;
              // alert('激活邮件模板创建成功。');
            }).catch(function (error) {
              console.log(error);
              self.savingActivate = false;
              alert('激活邮件模板创建失败。');
            });
          });
        } else { // 修改
          console.log(self.activateModel);
          api.corp.refreshToken().then(function () {
            api.email.updateTemplate(self.activateId, self.activateModel).then(function (data) {
              self.activateStatus = data.status;
              self.savingActivate = false;
              // alert('激活邮件模板修改成功。');
            }).catch(function (error) {
              console.log(error);
              self.savingActivate = false;
              alert('激活邮件模板修改失败。');
            });
          });
        }
      }
    },

    /**
     * 提交重置密码邮件模板
     */
    onResetSubmit () {
      var self = this;
      if (!this.validation.$valid) {
        alert('请输入合法的邮件来源');
        return;
      }
      if (this.validation.$valid && this.resetValidation.$valid) {
        this.savingReset = true;
        if (this.resetStatus === -2) { // 新增
          api.corp.refreshToken().then(function () {
            api.email.createTemplate(self.resetModel).then(function (data) {
              self.resetStatus = data.status;
              self.savingReset = false;
              // alert('重置密码邮件模板创建成功。');
            }).catch(function (error) {
              console.log(error);
              self.savingReset = false;
              alert('重置密码邮件模板创建失败。');
            });
          });
        } else { // 修改
          console.log(self.resetModel);
          api.corp.refreshToken().then(function () {
            api.email.updateTemplate(self.resetId, self.resetModel).then(function (data) {
              self.resetStatus = data.status;
              self.savingReset = false;
              // alert('重置密码邮件模板修改成功。');
            }).catch(function (error) {
              console.log(error);
              self.savingReset = false;
              alert('重置密码邮件模板修改失败。');
            });
          });
        }
      }
    }
  }
};
</script>
