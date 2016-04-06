<template lang="jade">
div
  //- Start: 通用设置
  .panel
    .panel-hd
      h2 {{ $t("mail_templates.general") }}
    .panel-bd
      .form
        form(v-form, name="validation", @submit.prevent="onSenderSubmit")
          .form-row
            label.form-control {{ $t("mail_templates.fields.sender") }}:
            .controls
              .input-text-wrap(v-placeholder="$t('mail_templates.placeholders.sender')")
                input.input-text(v-model="sender", type="text", v-form-ctrl, name="sender", required, lazy, custom-validator="noSpaces")
              .form-tips.form-tips-error(v-if="validation.$submitted && validation.sender.$pristine")
                span(v-if="validation.sender.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.sender')}) }}
              .form-tips.form-tips-error(v-if="validation.sender.$dirty")
                span(v-if="validation.sender.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.sender')}) }}
                span(v-if="validation.sender.$error.customValidator") {{ $t('validation.format', {field: $t('mail_templates.fields.sender')}) }}
          .form-actions
            button.btn.btn-primary.btn-lg(type="submit", :disabled="savingActivate || savingReset", :class="{'disabled': savingActivate || savingReset}") {{ $t('common.save') }}
  //- End: 通用设置

  //- Start: 激活邮件模板
  .panel.panel-mail-template
    .panel-hd
      .status(v-show="!loading && activateLang === 'zh-cn'")
        | {{ $t('common.status') }}:
        span(v-if="activateStatus === 0") {{ $t('mail_templates.check_pending') }}
        span.hl-red(v-if="activateStatus === -1") {{ $t('mail_templates.check_reject') }}
        span.hl-green(v-if="activateStatus === 1 || activateStatus === -2") {{ $t('mail_templates.check_pass') }}
      .status(v-show="!loading && activateLang === 'en-us'")
        | {{ $t('common.status') }}:
        span(v-if="activateStatus2 === 0") {{ $t('mail_templates.check_pending') }}
        span.hl-red(v-if="activateStatus2 === -1") {{ $t('mail_templates.check_reject') }}
        span.hl-green(v-if="activateStatus2 === 1 || activateStatus2 === -2") {{ $t('mail_templates.check_pass') }}
      h2 {{ $t('mail_templates.activate_template') }}
      .leftbox
        radio-group(:items="languages", :value.sync="activateLang")
    .panel-bd
      //- 中文
      .form.template-form(v-show="activateLang === 'zh-cn'")
        form(v-form, name="activateValidation", @submit.prevent="onActivateSubmit")
          .form-row
            label.form-control {{ $t("mail_templates.fields.subject") }}:
            .controls
              .input-text-wrap
                input.input-text(v-model="activateModel.subject", type="text", v-form-ctrl, name="subject", required, lazy)
              .form-tips.form-tips-error(v-if="activateValidation.$submitted && activateValidation.subject.$pristine")
                span(v-if="activateValidation.subject.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}
              .form-tips.form-tips-error(v-if="activateValidation.subject.$dirty")
                span(v-if="activateValidation.subject.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}
          .form-row
            label.form-control {{ $t("mail_templates.fields.content") }}:
            .controls
              .input-text-wrap
                textarea.input-text(v-model="activateModel.content", type="text", v-form-ctrl, name="content", required, lazy)
              .form-tips.form-tips-error(v-if="activateValidation.$submitted && activateValidation.content.$pristine")
                span(v-if="activateValidation.content.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}
              .form-tips.form-tips-error(v-if="activateValidation.content.$dirty")
                span(v-if="activateValidation.content.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}
          .form-actions
            button.btn.btn-primary.btn-lg(type="submit", :disabled="activateStatus === 0 || savingActivate", :class="{'disabled': activateStatus === 0 || savingActivate}", v-text="savingActivate ? $t('common.handling') : $t('common.save')")

      //- 英文
      .form.template-form(v-show="activateLang === 'en-us'")
        form(v-form, name="activateValidation2", @submit.prevent="onActivateSubmit2")
          .form-row
            label.form-control {{ $t("mail_templates.fields.subject") }}:
            .controls
              .input-text-wrap
                input.input-text(v-model="activateModel2.subject", type="text", v-form-ctrl, name="subject", required, lazy)
              .form-tips.form-tips-error(v-if="activateValidation2.$submitted && activateValidation2.subject.$pristine")
                span(v-if="activateValidation2.subject.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}
              .form-tips.form-tips-error(v-if="activateValidation2.subject.$dirty")
                span(v-if="activateValidation2.subject.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}
          .form-row
            label.form-control {{ $t("mail_templates.fields.content") }}:
            .controls
              .input-text-wrap
                textarea.input-text(v-model="activateModel2.content", type="text", v-form-ctrl, name="content", required, lazy)
              .form-tips.form-tips-error(v-if="activateValidation2.$submitted && activateValidation2.content.$pristine")
                span(v-if="activateValidation2.content.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}
              .form-tips.form-tips-error(v-if="activateValidation2.content.$dirty")
                span(v-if="activateValidation2.content.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}
          .form-actions
            button.btn.btn-primary.btn-lg(type="submit", :disabled="activateStatus2 === 0 || savingActivate", :class="{'disabled': activateStatus2 === 0 || savingActivate}", v-text="savingActivate ? $t('common.handling') : $t('common.save')")
  //- End: 激活邮件模板

  //- Start: 重置密码邮件模板
  .panel.panel-mail-template
    .panel-hd
      .status(v-show="!loading && resetLang === 'zh-cn'")
        | {{ $t('common.status') }}:
        span(v-if="resetStatus === 0") {{ $t('mail_templates.check_pending') }}
        span.hl-red(v-if="resetStatus === -1") {{ $t('mail_templates.check_reject') }}
        span.hl-green(v-if="resetStatus === 1 || resetStatus === -2") {{ $t('mail_templates.check_pass') }}
      .status(v-show="!loading && resetLang === 'en-us'")
        | {{ $t('common.status') }}:
        span(v-if="resetStatus2 === 0") {{ $t('mail_templates.check_pending') }}
        span.hl-red(v-if="resetStatus2 === -1") {{ $t('mail_templates.check_reject') }}
        span.hl-green(v-if="resetStatus2 === 1 || resetStatus2 === -2") {{ $t('mail_templates.check_pass') }}
      h2 {{ $t('mail_templates.reset_template') }}
      .leftbox
        radio-group(:items="languages", :value.sync="resetLang")
    .panel-bd
      //- 中文
      .form.template-form(v-show="resetLang === 'zh-cn'")
        form(v-form, name="resetValidation", @submit.prevent="onResetSubmit")
          .form-row
            label.form-control {{ $t("mail_templates.fields.subject") }}:
            .controls
              .input-text-wrap
                input.input-text(v-model="resetModel.subject", type="text", v-form-ctrl, name="subject", required, lazy)
              .form-tips.form-tips-error(v-if="resetValidation.$submitted && resetValidation.subject.$pristine")
                span(v-if="resetValidation.subject.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}
              .form-tips.form-tips-error(v-if="resetValidation.subject.$dirty")
                span(v-if="resetValidation.subject.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}
          .form-row
            label.form-control {{ $t("mail_templates.fields.content") }}:
            .controls
              .input-text-wrap
                textarea.input-text(v-model="resetModel.content", type="text", v-form-ctrl, name="content", required, lazy)
              .form-tips.form-tips-error(v-if="resetValidation.$submitted && resetValidation.content.$pristine")
                span(v-if="resetValidation.content.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}
              .form-tips.form-tips-error(v-if="resetValidation.content.$dirty")
                span(v-if="resetValidation.content.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}
          .form-actions
            button.btn.btn-primary.btn-lg(type="submit", :disabled="resetStatus === 0 || savingReset", :class="{'disabled': resetStatus === 0 || savingReset}", v-text="savingReset ? $t('common.handling') : $t('common.save')")

      //- 英文
      .form.template-form(v-show="resetLang === 'en-us'")
        form(v-form, name="resetValidation2", @submit.prevent="onResetSubmit2")
          .form-row
            label.form-control {{ $t("mail_templates.fields.subject") }}:
            .controls
              .input-text-wrap
                input.input-text(v-model="resetModel2.subject", type="text", v-form-ctrl, name="subject", required, lazy)
              .form-tips.form-tips-error(v-if="resetValidation2.$submitted && resetValidation2.subject.$pristine")
                span(v-if="resetValidation2.subject.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}
              .form-tips.form-tips-error(v-if="resetValidation2.subject.$dirty")
                span(v-if="resetValidation2.subject.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}
          .form-row
            label.form-control {{ $t("mail_templates.fields.content") }}:
            .controls
              .input-text-wrap
                textarea.input-text(v-model="resetModel2.content", type="text", v-form-ctrl, name="content", required, lazy)
              .form-tips.form-tips-error(v-if="resetValidation2.$submitted && resetValidation2.content.$pristine")
                span(v-if="resetValidation2.content.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}
              .form-tips.form-tips-error(v-if="resetValidation2.content.$dirty")
                span(v-if="resetValidation2.content.$error.required") {{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}
          .form-actions
            button.btn.btn-primary.btn-lg(type="submit", :disabled="resetStatus2 === 0 || savingReset", :class="{'disabled': resetStatus2 === 0 || savingReset}", v-text="savingReset ? $t('common.handling') : $t('common.save')")
  //- End: 重置密码邮件模板
  //- Start: 高级设置
  .panel
    .panel-hd
      .status
        | {{ $t('common.status') }}:
        span.hl-red(v-if="validation2.state === 1") 未验证
        span(v-if="validation2.state === 2") 可使用
        span.hl-green(v-if="validation2.state === 3") 已验证
      h2 高级设置
    .panel-bd
      .form
        form(v-form, name="validation2", @submit.prevent="onSenderSubmit2")
          .form-row
            label.form-control 邮件发送域名:
            .controls
              .input-text-wrap(v-placeholder="$t('mail_templates.placeholders.address')")
                input.input-text(v-model="validation2.domain", type="text", name="address", lazy, custom-validator="noSpaces")
          .form-actions
            button.btn.btn-primary.btn-lg(type="submit", :disabled="editingAddress", :class="{'disabled': editingAddress}") {{ $t('common.save') }}
      p.bigfont 相关信息
      table.table.table-stripe.table-bordered
        thead
          tr
            th 名称
            th 状态
            th 类型
            th 主机记录
            th 主域名
            th 需配置的记录值
            th 现有记录值
        tbody
          tr
            td VERIFY_KEY
            td.bhx.tg(v-if="validation2.info&&validation2.info.verify===31") 通过
            td.bhx.btg(v-else) 不通过
            td TXT
            td(v-if='!validation2.IPfront') @
            td(v-else) {{validation2.IPfront}}
            td {{validation2.IPbehind}}
            td {{validation2.info&&validation2.info['verifyKey.value']}}
            td {{validation2.info&&validation2.info['verifyKey.domain']}}
          tr
            td SPF
            td.bhx.tg(v-if="validation2.info&&(validation2.info.verify===31||validation2.info.verify===3||validation2.info.verify===15)") 通过
            td.bhx.btg(v-else) 不通过
            td TXT
            td(v-if='!validation2.IPfront') @
            td(v-else) {{validation2.IPfront}}
            td {{validation2.IPbehind}}
            td {{validation2.info&&validation2.info['spf.value']}}
            td {{validation2.info&&validation2.info['spf.domain']}}
          tr
            td DKIM
            td.bhx.tg(v-if="validation2.info&&(validation2.info.verify===31||validation2.info.verify===3||validation2.info.verify===15)") 通过
            td.bhx.btg(v-else) 不通过
            td TXT
            td(v-if='!validation2.IPfront') mail._domainkey
            td(v-else) {{'mail._domainkey.'+validation2.IPfront}}
            td {{validation2.IPbehind}}
            td.hx {{validation2.info&&validation2.info['dkim.value']}}
            td {{validation2.info&&validation2.info['dkim.domain']}}
          tr
            td CNAME
            td.bhx.tg(v-if="validation2.info&&(validation2.info.verify===31||validation2.info.verify===15)") 通过
            td.bhx.btg(v-else) 不通过
            td CNAME
            td(v-if='!validation2.IPfront') sctrack
            td(v-else) {{'sctrack.'+validation2.IPfront}}
            td {{validation2.IPbehind}}
            td {{validation2.info&&validation2.info['cname.value']}}
            td {{validation2.info&&validation2.info['cname.domain']}}
          tr
            td MX
            td.bhx.tg(v-if="validation2.info&&(validation2.info.verify===31||validation2.info.verify===15)") 通过
            td.bhx.btg(v-else) 不通过
            td MX
            td(v-if='!validation2.IPfront') @
            td(v-else) {{validation2.IPfront}}
            td {{validation2.IPbehind}}
            td {{validation2.info&&validation2.info['mx.value']}}
            td {{validation2.info&&validation2.info['mx.domain']}}
      //- table.table.table-stripe.table-bordered
      //-   tbody
      //-     tr
      //-       td.sxtd 名称
      //-       td {{validation2.info&&validation2.info.name}}
      //-     tr
      //-       td.sxtd 域名类型
      //-       td {{validation2.info&&validation2.info.type}}
      //-     tr
      //-       td.sxtd 域名验证值
      //-       td {{validation2.info&&validation2.info.verify}}
      //-     tr
      //-       td.sxtd 此域名VERIFY_KEY的主机记录
      //-       td {{validation2.info&&validation2.info['verifyKey.domain']}}
      //-     tr
      //-       td.sxtd 此域名VERIFY_KEY 的配置值
      //-       td {{validation2.info&&validation2.info['verifyKey.value']}}
      //-     tr
      //-       td.sxtd 此域名SPF 的主机记录
      //-       td {{validation2.info&&validation2.info['spf.domain']}}
      //-     tr
      //-       td.sxtd 此域名SPF 的配置值
      //-       td {{validation2.info&&validation2.info['spf.value']}}
      //-     tr
      //-       td.sxtd 此域名DKIM 的主机记录
      //-       td {{validation2.info&&validation2.info['dkim.domain']}}
      //-     tr
      //-       td.sxtd 此域名DKIM 的配置值
      //-       td {{validation2.info&&validation2.info['dkim.value']}}
      //-     tr
      //-       td.sxtd 此域名CNAME 的主机记录
      //-       td {{validation2.info&&validation2.info['cname.domain']}}
      //-     tr
      //-       td.sxtd 此域名CNAME 的配置值
      //-       td {{validation2.info&&validation2.info['cname.value']}}
      //-     tr
      //-       td.sxtd 此域名MX 的主机记录
      //-       td {{validation2.info&&validation2.info['mx.domain']}}
      //-     tr
      //-       td.sxtd 此域名MX 的配置值
      //-       td {{validation2.info&&validation2.info['mx.value']}}
      //-     tr
      //-       td.sxtd 域名创建时间
      //-       td {{validation2.info&&validation2.info.gmtCreated}}
      //-     tr
      //-       td.sxtd 域名修改时间
      //-       td {{validation2.info&&validation2.info.gmtUpdated}}

  //- End: 通用设置
</template>

<script>
import Vue from 'vue';
import api from '../../api';
import RadioGroup from '../../components/radio-group.vue';
import locales from '../../consts/locales';;

export default {
  name: 'MailTemplates',

  components: {
    'radio-group': RadioGroup
  },

  data () {
    return {
      languages: locales[Vue.config.lang].mail_templates.languages,
      validation: {},
      validation2: {
        info: {
          name: '123',
          type: '123',
          verify: '123',
          verifyKey: {
            domain: '',
            value: ''
          },
          spf: {
            domain: '',
            value: ''
          },
          dkim: {
            domain: '',
            value: ''
          },
          cname: {
            domain: '',
            value: ''
          },
          mx: {
            domain: '',
            value: ''
          },
          gmtCreated: '',
          gmtUpdated: ''
        }
      },
      loading: true,
      activateLang: 'zh-cn',
      resetLang: 'zh-cn',
      // 激活邮件中文
      activateStatus: -2,
      activateId: '',
      activateModel: {},
      activateValidation: {},
      // 激活邮件英文
      activateStatus2: -2,
      activateId2: '',
      activateModel2: {},
      activateValidation2: {},
      // 重置密码邮件中文
      resetStatus: -2,
      resetId: '',
      resetModel: {},
      resetValidation: {},
      // 重置密码邮件英文
      resetStatus2: -2,
      resetId2: '',
      resetModel2: {},
      resetValidation2: {},
      sender: '',
      savingActivate: false,
      savingReset: false,
      editingAddress: false
    };
  },

  watch: {
    sender: function () {
      this.activateModel.sender = this.sender;
      this.activateModel2.sender = this.sender;
      this.resetModel.sender = this.sender;
      this.resetModel2.sender = this.sender;
    }
  },

  route: {
    data: function () {
      var self = this;
      self.getAddress();
      // var list = [];
      api.corp.refreshToken().then(function () {
        api.email.getTemplateList().then(function (data) {
          // console.log(data);
          var aModel = {
            name: '激活邮件模板',
            subject: '欢迎注册云智易',
            sender: '',
            content: '<p>亲爱的&nbsp;%username%，</p>\n\n<div>欢迎注册云智易，请点击下方的链接完成帐号激活。</div>\n\n<div>&nbsp;http://%admin_host%/#!/user-email-activate/%corp_id%/%email%/%verifycode%</div>\n\n<div>&nbsp;（本链接将在48小时后失效）</div>\n\n<div>&nbsp;</div>\n\n<div>本邮件由系统自动发出，请勿回复</div>\n\n<div>&nbsp;</div>\n\n<div>云智易</div>\n\n<div>%date%</div>',
            type: 1,
            lang: 'zh-cn'
          };
          var aModel2 = {
            name: '激活邮件英文模板',
            subject: 'Welcome to XLINK',
            sender: '',
            content: '<p>Dear %username%,</p>\n\n<p>Welcome to register XLINK,please click the link below to activate your account.</p>\n\n<p><a href="http://%admin_host%/#!/user-email-activate/%corp_id%/%email%/%verifycode%">http://%admin_host%/#!/user-email-activate<a></p>\n\n<p>(this link will be valid within 48 hours)<br />\n\n*Please note:this e-mail was sent from an address that cannot accept incoming e-mail.</p>\n\n<p><br />\n\nXLINK<br />\n\n%date%</p>',
            type: 1,
            lang: 'en-us'
          };
          var rModel = {
            name: '重置密码邮件模板',
            subject: '云智易找回密码',
            sender: '',
            content: '<p>亲爱的&nbsp;&nbsp; %username%，</p>\n\n<p>我们收到了您找回密码的请求，请点击下方链接完成密码找回：</p>\n\n<p>http://%admin_host%/#!/user-password-reset/%corp_id%/%email%/%verifycode%</p>\n\n<p>（本链接将在48小时后失效）</p>\n\n<p>本邮件由系统自动发出，请勿回复</p>\n\n<p>&nbsp;</p>\n\n<p>云智易</p>\n\n<p>%date%</p>',
            type: 2,
            lang: 'zh-cn'
          };
          var rModel2 = {
            name: '重置密码邮件英文模板',
            subject: 'Reset XLINK password?',
            sender: '',
            content: '<p>Dear %username%,</p>\n\n<p>We received your request of retrieving your password,please click the link below to retrieve your password.&nbsp;</p>\n\n<p><a href="http://%admin_host%/#!/user-password-reset/%corp_id%/%email%/%verifycode%">http://%admin_host%/#!/user-password-reset/</a></p>\n\n<p>（this link will be valid within 48 hours）<br />\n\n*Please note:this e-mail was sent from an address that cannot accept incoming e-mail.</p>\n\n<p>XLINK</p>\n\n<p>%date%</p>',
            type: 2,
            lang: 'en-us'
          };
          var template, i;

          self.loading = false;

          for (i = 0; i < data.count; i++) {
            template = data.list[i];
            self.sender = template.sender;
            if (template.type === 1) {
              if (template.lang === 'zh-cn') {
                aModel.subject = template.subject;
                aModel.content = template.content;
                self.activateStatus = template.status;
                self.activateId = template.id;
              } else {
                aModel2.subject = template.subject;
                aModel2.content = template.content;
                self.activateStatus2 = template.status;
                self.activateId2 = template.id;
              }
            } else if (template.type === 2) {
              if (template.lang === 'zh-cn') {
                rModel.subject = template.subject;
                rModel.content = template.content;
                self.resetStatus = template.status;
                self.resetId = template.id;
              } else {
                rModel2.subject = template.subject;
                rModel2.content = template.content;
                self.resetStatus2 = template.status;
                self.resetId2 = template.id;
              }
            }
          }

          self.activateModel = aModel;
          self.activateModel2 = aModel2;
          self.resetModel = rModel;
          self.resetModel2 = rModel2;
        });
      });
    }
  },

  methods: {
    /**
     * 提交发件者
     */
    onSenderSubmit () {
      if (this.validation.$valid && this.activateValidation.$valid && this.activateValidation2.$valid && this.resetValidation.$valid && this.resetValidation2.$valid) {
        this.onActivateSubmit();
        this.onActivateSubmit2();
        this.onResetSubmit();
        this.onResetSubmit2();
      }
    },
    /**
     * 提交邮件域名
     */
    onSenderSubmit2 () {
      var self = this;
      self.setAddress();
      self.getAddress();
    },

    /**
     * 提交激活邮件中文模板
     */
    onActivateSubmit () {
      var self = this;
      if (!this.validation.$valid) {
        alert(this.$t('mail_templates.messages.illegal_sender'));
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
              alert(self.$t('mail_templates.messages.creation_fail'));
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
              alert(self.$t('mail_templates.messages.update_fail'));
            });
          });
        }
      }
    },

    /**
     * 提交激活英文邮件模板
     */
    onActivateSubmit2 () {
      var self = this;
      if (!this.validation.$valid) {
        alert(this.$t('mail_templates.messages.illegal_sender'));
        return;
      }
      if (this.validation.$valid && this.activateValidation2.$valid) {
        this.savingActivate = true;
        if (this.activateStatus2 === -2) { // 新增
          api.corp.refreshToken().then(function () {
            api.email.createTemplate(self.activateModel2).then(function (data) {
              self.activateStatus2 = data.status;
              self.savingActivate = false;
              // alert('激活邮件模板创建成功。');
            }).catch(function (error) {
              console.log(error);
              self.savingActivate = false;
              alert(self.$t('mail_templates.messages.creation_fail'));
            });
          });
        } else { // 修改
          console.log(self.activateModel2);
          api.corp.refreshToken().then(function () {
            api.email.updateTemplate(self.activateId2, self.activateModel2).then(function (data) {
              self.activateStatus2 = data.status;
              self.savingActivate = false;
              // alert('激活邮件模板修改成功。');
            }).catch(function (error) {
              console.log(error);
              self.savingActivate = false;
              alert(self.$t('mail_templates.messages.update_fail'));
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
        alert(this.$t('mail_templates.messages.illegal_sender'));
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
              alert(self.$t('mail_templates.messages.creation_fail'));
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
              alert(self.$t('mail_templates.messages.update_fail'));
            });
          });
        }
      }
    },

    /**
     * 提交重置密码英文邮件模板
     */
    onResetSubmit2 () {
      var self = this;
      if (!this.validation.$valid) {
        alert(this.$t('mail_templates.messages.illegal_sender'));
        return;
      }
      if (this.validation.$valid && this.resetValidation2.$valid) {
        this.savingReset = true;
        if (this.resetStatus2 === -2) { // 新增
          api.corp.refreshToken().then(function () {
            api.email.createTemplate(self.resetModel2).then(function (data) {
              self.resetStatus2 = data.status;
              self.savingReset = false;
              // alert('重置密码邮件模板创建成功。');
            }).catch(function (error) {
              console.log(error);
              self.savingReset = false;
              alert(self.$t('mail_templates.messages.creation_fail'));
            });
          });
        } else { // 修改
          console.log(self.resetModel2);
          api.corp.refreshToken().then(function () {
            api.email.updateTemplate(self.resetId2, self.resetModel2).then(function (data) {
              self.resetStatus2 = data.status;
              self.savingReset = false;
              // alert('重置密码邮件模板修改成功。');
            }).catch(function (error) {
              console.log(error);
              self.savingReset = false;
              alert(self.$t('mail_templates.messages.update_fail'));
            });
          });
        }
      }
    },
    /**
     * 获取邮件发送域名
     */
    getAddress: function () {
      var self = this;
      api.corp.refreshToken().then(function () {
        api.email.getAddress().then(function (data) {
          self.validation2 = data;
          var IPaddress = self.validation2.domain;
          var IParry = IPaddress.split('.');
          var IPlast1 = IParry.pop();
          var IPlast2 = IParry.pop();
          var IPbehind;
          var IPlast3;
          if ((IPlast1 === 'cn' && IPlast2 === 'com') || (IPlast1 === 'cn' && IPlast2 === 'net') || (IPlast1 === 'cn' && IPlast2 === 'gov') || (IPlast1 === 'cn' && IPlast2 === 'org')) {
            IPlast3 = IParry.pop();
            IPbehind = IPlast3 + '.' + IPlast2 + '.' + IPlast1 ;
          } else {
            IPbehind = IPlast2 + '.' + IPlast1;
          }
          var IPfront = IParry.join('.');
          self.validation2.IPfront = IPfront;
          self.validation2.IPbehind = IPbehind;
          console.log(IPfront);
          console.log(data);
        });
      });
    },
    /**
     * 设置邮件发送域名
     */
    setAddress: function () {
      var self = this;
      self.editingAddress = true;
      // api.corp.refreshToken().then(function () {
      //   console.log(self.validation2.domain);
      //   var params = {
      //     domain: self.validation2.domain
      //   };
      //   api.email.setAddress(params).then(function (data) {
      //     console.log(self.validation2);
      //   });
      // });
      api.corp.refreshToken().then(function () {
        var params = {
          domain: self.validation2.domain
        };
        api.email.setAddress(params).then(function (data) {
          console.log(self.validation2);
          self.editingAddress = false;
        }).catch(function (error) {
          self.handleError(error);
          self.editingAddress = false;
        });
      });
    }
  }
};
</script>

<style lang="stylus">
.panel-mail-template
  .panel-hd
    .leftbox
      left 160px
.bigfont
  font-size 18px
  border-bottom 1px solid #e4e4e4
.panel-bd .form
  padding 30px 0 10px
ul.device-details
  padding-bottom 30px
ul.device-details li
  line-height 32px
ul.device-details li .label
  display inline-block
  width 180px
ul.device-details li .info
  display inline-block
.sxtd
  width 180px
  text-align left
.hx
  word-break break-all
.bhx
  white-space nowrap
.btg
  color #c0252e
.tg
  color #35aa47
</style>
