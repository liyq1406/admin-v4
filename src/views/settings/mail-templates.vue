<template>
  <div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t("mail_templates.general") }}</h2>
      </div>
      <div class="panel-bd">
        <div class="form">
          <form v-form name="validation" @submit.prevent="onSenderSubmit">
            <div class="form-row">
              <label class="form-control">{{ $t("mail_templates.fields.sender") }}:</label>
              <div class="controls">
                <div v-placeholder="$t('mail_templates.placeholders.sender')" class="input-text-wrap">
                  <input v-model="sender" type="text" v-form-ctrl name="sender" required lazy custom-validator="noSpaces" class="input-text"/>
                </div>
                <div v-if="validation.$submitted && validation.sender.$pristine" class="form-tips form-tips-error"><span v-if="validation.sender.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.sender')}) }}</span></div>
                <div v-if="validation.sender.$dirty" class="form-tips form-tips-error"><span v-if="validation.sender.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.sender')}) }}</span><span v-if="validation.sender.$error.customValidator">{{ $t('validation.format', {field: $t('mail_templates.fields.sender')}) }}</span></div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="savingActivate || savingReset" :class="{'disabled': savingActivate || savingReset}" class="btn btn-primary btn-lg">{{ $t('common.save') }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="panel panel-mail-template">
      <div class="panel-hd">
        <div v-show="!loading && activateLang === 'zh-cn'" class="status">{{ $t('common.status') }}:<span v-if="activateStatus === 0">{{ $t('mail_templates.check_pending') }}</span><span v-if="activateStatus === -1" class="hl-red">{{ $t('mail_templates.check_reject') }}</span><span v-if="activateStatus === 1 || activateStatus === -2" class="hl-green">{{ $t('mail_templates.check_pass') }}</span></div>
        <div v-show="!loading && activateLang === 'en-us'" class="status">{{ $t('common.status') }}:<span v-if="activateStatus2 === 0">{{ $t('mail_templates.check_pending') }}</span><span v-if="activateStatus2 === -1" class="hl-red">{{ $t('mail_templates.check_reject') }}</span><span v-if="activateStatus2 === 1 || activateStatus2 === -2" class="hl-green">{{ $t('mail_templates.check_pass') }}</span></div>
        <h2>{{ $t('mail_templates.activate_template') }}</h2>
        <div class="leftbox">
          <radio-group :items="languages" :value.sync="activateLang"></radio-group>
        </div>
      </div>
      <div class="panel-bd">
        <div v-show="activateLang === 'zh-cn'" class="form template-form">
          <form v-form name="activateValidation" @submit.prevent="onActivateSubmit">
            <div class="form-row">
              <label class="form-control">{{ $t("mail_templates.fields.subject") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="activateModel.subject" type="text" v-form-ctrl name="subject" required lazy class="input-text"/>
                </div>
                <div v-if="activateValidation.$submitted && activateValidation.subject.$pristine" class="form-tips form-tips-error"><span v-if="activateValidation.subject.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}</span></div>
                <div v-if="activateValidation.subject.$dirty" class="form-tips form-tips-error"><span v-if="activateValidation.subject.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}</span></div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("mail_templates.fields.content") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <textarea v-model="activateModel.content" type="text" v-form-ctrl name="content" required lazy class="input-text"></textarea>
                </div>
                <div v-if="activateValidation.$submitted && activateValidation.content.$pristine" class="form-tips form-tips-error"><span v-if="activateValidation.content.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}</span></div>
                <div v-if="activateValidation.content.$dirty" class="form-tips form-tips-error"><span v-if="activateValidation.content.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}</span></div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="activateStatus === 0 || savingActivate" :class="{'disabled': activateStatus === 0 || savingActivate}" v-text="savingActivate ? $t('common.handling') : $t('common.save')" class="btn btn-primary btn-lg"></button>
            </div>
          </form>
        </div>
        <div v-show="activateLang === 'en-us'" class="form template-form">
          <form v-form name="activateValidation2" @submit.prevent="onActivateSubmit2">
            <div class="form-row">
              <label class="form-control">{{ $t("mail_templates.fields.subject") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="activateModel2.subject" type="text" v-form-ctrl name="subject" required lazy class="input-text"/>
                </div>
                <div v-if="activateValidation2.$submitted && activateValidation2.subject.$pristine" class="form-tips form-tips-error"><span v-if="activateValidation2.subject.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}</span></div>
                <div v-if="activateValidation2.subject.$dirty" class="form-tips form-tips-error"><span v-if="activateValidation2.subject.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}</span></div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("mail_templates.fields.content") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <textarea v-model="activateModel2.content" type="text" v-form-ctrl name="content" required lazy class="input-text"></textarea>
                </div>
                <div v-if="activateValidation2.$submitted && activateValidation2.content.$pristine" class="form-tips form-tips-error"><span v-if="activateValidation2.content.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}</span></div>
                <div v-if="activateValidation2.content.$dirty" class="form-tips form-tips-error"><span v-if="activateValidation2.content.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}</span></div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="activateStatus2 === 0 || savingActivate" :class="{'disabled': activateStatus2 === 0 || savingActivate}" v-text="savingActivate ? $t('common.handling') : $t('common.save')" class="btn btn-primary btn-lg"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="panel panel-mail-template">
      <div class="panel-hd">
        <div v-show="!loading && resetLang === 'zh-cn'" class="status">{{ $t('common.status') }}:<span v-if="resetStatus === 0">{{ $t('mail_templates.check_pending') }}</span><span v-if="resetStatus === -1" class="hl-red">{{ $t('mail_templates.check_reject') }}</span><span v-if="resetStatus === 1 || resetStatus === -2" class="hl-green">{{ $t('mail_templates.check_pass') }}</span></div>
        <div v-show="!loading && resetLang === 'en-us'" class="status">{{ $t('common.status') }}:<span v-if="resetStatus2 === 0">{{ $t('mail_templates.check_pending') }}</span><span v-if="resetStatus2 === -1" class="hl-red">{{ $t('mail_templates.check_reject') }}</span><span v-if="resetStatus2 === 1 || resetStatus2 === -2" class="hl-green">{{ $t('mail_templates.check_pass') }}</span></div>
        <h2>{{ $t('mail_templates.reset_template') }}</h2>
        <div class="leftbox">
          <radio-group :items="languages" :value.sync="resetLang"></radio-group>
        </div>
      </div>
      <div class="panel-bd">
        <div v-show="resetLang === 'zh-cn'" class="form template-form">
          <form v-form name="resetValidation" @submit.prevent="onResetSubmit">
            <div class="form-row">
              <label class="form-control">{{ $t("mail_templates.fields.subject") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="resetModel.subject" type="text" v-form-ctrl name="subject" required lazy class="input-text"/>
                </div>
                <div v-if="resetValidation.$submitted && resetValidation.subject.$pristine" class="form-tips form-tips-error"><span v-if="resetValidation.subject.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}</span></div>
                <div v-if="resetValidation.subject.$dirty" class="form-tips form-tips-error"><span v-if="resetValidation.subject.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}</span></div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("mail_templates.fields.content") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <textarea v-model="resetModel.content" type="text" v-form-ctrl name="content" required lazy class="input-text"></textarea>
                </div>
                <div v-if="resetValidation.$submitted && resetValidation.content.$pristine" class="form-tips form-tips-error"><span v-if="resetValidation.content.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}</span></div>
                <div v-if="resetValidation.content.$dirty" class="form-tips form-tips-error"><span v-if="resetValidation.content.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}</span></div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="resetStatus === 0 || savingReset" :class="{'disabled': resetStatus === 0 || savingReset}" v-text="savingReset ? $t('common.handling') : $t('common.save')" class="btn btn-primary btn-lg"></button>
            </div>
          </form>
        </div>
        <div v-show="resetLang === 'en-us'" class="form template-form">
          <form v-form name="resetValidation2" @submit.prevent="onResetSubmit2">
            <div class="form-row">
              <label class="form-control">{{ $t("mail_templates.fields.subject") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <input v-model="resetModel2.subject" type="text" v-form-ctrl name="subject" required lazy class="input-text"/>
                </div>
                <div v-if="resetValidation2.$submitted && resetValidation2.subject.$pristine" class="form-tips form-tips-error"><span v-if="resetValidation2.subject.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}</span></div>
                <div v-if="resetValidation2.subject.$dirty" class="form-tips form-tips-error"><span v-if="resetValidation2.subject.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.subject')}) }}</span></div>
              </div>
            </div>
            <div class="form-row">
              <label class="form-control">{{ $t("mail_templates.fields.content") }}:</label>
              <div class="controls">
                <div class="input-text-wrap">
                  <textarea v-model="resetModel2.content" type="text" v-form-ctrl name="content" required lazy class="input-text"></textarea>
                </div>
                <div v-if="resetValidation2.$submitted && resetValidation2.content.$pristine" class="form-tips form-tips-error"><span v-if="resetValidation2.content.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}</span></div>
                <div v-if="resetValidation2.content.$dirty" class="form-tips form-tips-error"><span v-if="resetValidation2.content.$error.required">{{ $t('validation.required', {field: $t('mail_templates.fields.content')}) }}</span></div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="resetStatus2 === 0 || savingReset" :class="{'disabled': resetStatus2 === 0 || savingReset}" v-text="savingReset ? $t('common.handling') : $t('common.save')" class="btn btn-primary btn-lg"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="status">{{ $t('common.status') }}:<span v-if="validation2.state === 1" class="hl-red">未验证</span><span v-if="validation2.state === 2">可使用</span><span v-if="validation2.state === 3" class="hl-green">已验证</span></div>
        <h2>高级设置</h2>
      </div>
      <div class="panel-bd">
        <div class="form">
          <form v-form name="validation2" @submit.prevent="onSenderSubmit2">
            <div class="form-row">
              <label class="form-control">邮件发送域名:</label>
              <div class="controls">
                <!-- <div v-placeholder="$t('mail_templates.placeholders.address')" class="input-text-wrap"> -->
                <div class="input-text-wrap">
                  <span v-if="ifxlink" style="line-height:35px">{{validation2.domain}}</span>
                  <input v-else v-model="validation2.domain" type="text" name="address" lazy custom-validator="noSpaces" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button v-if="ifxlinkbtn" type="submit" :disabled="editingAddress" :class="{'disabled': editingAddress}" class="btn btn-primary btn-lg">{{ $t('common.save') }}</button>
              <button v-else @click="changeAddress" :disabled="editingAddress" :class="{'disabled': editingAddress}" class="btn btn-primary btn-lg">修改</button>
            </div>
          </form>
        </div>
        <div v-if="showform">
          <p class="bigfont">相关信息</p>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>名称</th>
                <th>状态</th>
                <th>类型</th>
                <th>主机记录</th>
                <th>主域名</th>
                <th>需配置的记录值</th>
                <!-- <th>现有记录值</th> -->
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>VERIFY_KEY</td>
                <td v-if="validation2.info&&validation2.info.verify===31" class="bhx tg">通过</td>
                <td v-else="v-else" class="bhx btg">不通过</td>
                <td>TXT</td>
                <td v-if="!validation2.IPfront">@</td>
                <td v-else="v-else">{{ validation2.IPfront }}</td>
                <td>{{ validation2.IPbehind }}</td>
                <td>{{ validation2.info&&validation2.info['verifyKey.value'] }}</td>
                <!-- <td>{{ validation2.info&&validation2.info['verifyKey.domain'] }}</td> -->
              </tr>
              <tr>
                <td>SPF</td>
                <td v-if="validation2.info&&(validation2.info.verify===31||validation2.info.verify===3||validation2.info.verify===15)" class="bhx tg">通过</td>
                <td v-else="v-else" class="bhx btg">不通过</td>
                <td>TXT</td>
                <td v-if="!validation2.IPfront">@</td>
                <td v-else="v-else">{{ validation2.IPfront }}</td>
                <td>{{ validation2.IPbehind }}</td>
                <td>{{ validation2.info&&validation2.info['spf.value'] }}</td>
                <!-- <td>{{ validation2.info&&validation2.info['spf.domain'] }}</td> -->
              </tr>
              <tr>
                <td>DKIM</td>
                <td v-if="validation2.info&&(validation2.info.verify===31||validation2.info.verify===3||validation2.info.verify===15)" class="bhx tg">通过</td>
                <td v-else="v-else" class="bhx btg">不通过</td>
                <td>TXT</td>
                <td v-if="!validation2.IPfront">mail._domainkey</td>
                <td v-else="v-else">{{ 'mail._domainkey.'+validation2.IPfront }}</td>
                <td>{{ validation2.IPbehind }}</td>
                <td class="hx">{{ validation2.info&&validation2.info['dkim.value'] }}</td>
                <!-- <td>{{ validation2.info&&validation2.info['dkim.domain'] }}</td> -->
              </tr>
              <tr>
                <td>CNAME</td>
                <td v-if="validation2.info&&(validation2.info.verify===31||validation2.info.verify===15)" class="bhx tg">通过</td>
                <td v-else="v-else" class="bhx btg">不通过</td>
                <td>CNAME</td>
                <td v-if="!validation2.IPfront">sctrack</td>
                <td v-else="v-else">{{ 'sctrack.'+validation2.IPfront }}</td>
                <td>{{ validation2.IPbehind }}</td>
                <td>{{ validation2.info&&validation2.info['cname.value'] }}</td>
                <!-- <td>{{ validation2.info&&validation2.info['cname.domain'] }}</td> -->
              </tr>
              <tr>
                <td>MX</td>
                <td v-if="validation2.info&&(validation2.info.verify===31||validation2.info.verify===15)" class="bhx tg">通过</td>
                <td v-else="v-else" class="bhx btg">不通过</td>
                <td>MX</td>
                <td v-if="!validation2.IPfront">@</td>
                <td v-else="v-else">{{ validation2.IPfront }}</td>
                <td>{{ validation2.IPbehind }}</td>
                <td>{{ validation2.info&&validation2.info['mx.value'] }}</td>
                <!-- <td>{{ validation2.info&&validation2.info['mx.domain'] }}</td> -->
              </tr>
            </tbody>
          </table>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api'
  import RadioGroup from '../../components/RadioGroup'
  import locales from '../../consts/locales/index'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'MailTemplates',

    layout: 'admin',

    mixins: [globalMixins],

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
        editingAddress: false,
        ifxlink: false,
        ifxlinkbtn: true,
        showform: false
      }
    },

    watch: {
      sender () {
        this.activateModel.sender = this.sender
        this.activateModel2.sender = this.sender
        this.resetModel.sender = this.sender
        this.resetModel2.sender = this.sender
      }
    },

    route: {
      data () {
        this.getAddress()
        // var list = []
        api.email.getTemplateList().then((res) => {
          // console.log(data)
          var aModel = {
            name: '激活邮件模板',
            subject: '欢迎注册云智易',
            sender: '',
            content: '<p>亲爱的&nbsp%username%，</p>\n\n<div>欢迎注册云智易，请点击下方的链接完成帐号激活。</div>\n\n<div>&nbsphttp://%admin_host%/#!/user-email-activate/%corp_id%/%email%/%verifycode%</div>\n\n<div>&nbsp（本链接将在48小时后失效）</div>\n\n<div>&nbsp</div>\n\n<div>本邮件由系统自动发出，请勿回复</div>\n\n<div>&nbsp</div>\n\n<div>云智易</div>\n\n<div>%date%</div>',
            type: 1,
            lang: 'zh-cn'
          }
          var aModel2 = {
            name: '激活邮件英文模板',
            subject: 'Welcome to XLINK',
            sender: '',
            content: '<p>Dear %username%,</p>\n\n<p>Welcome to register XLINK,please click the link below to activate your account.</p>\n\n<p><a href="http://%admin_host%/#!/user-email-activate/%corp_id%/%email%/%verifycode%">http://%admin_host%/#!/user-email-activate<a></p>\n\n<p>(this link will be valid within 48 hours)<br />\n\n*Please note:this e-mail was sent from an address that cannot accept incoming e-mail.</p>\n\n<p><br />\n\nXLINK<br />\n\n%date%</p>',
            type: 1,
            lang: 'en-us'
          }
          var rModel = {
            name: '重置密码邮件模板',
            subject: '云智易找回密码',
            sender: '',
            content: '<p>亲爱的&nbsp&nbsp %username%，</p>\n\n<p>我们收到了您找回密码的请求，请点击下方链接完成密码找回：</p>\n\n<p>http://%admin_host%/#!/user-password-reset/%corp_id%/%email%/%verifycode%</p>\n\n<p>（本链接将在48小时后失效）</p>\n\n<p>本邮件由系统自动发出，请勿回复</p>\n\n<p>&nbsp</p>\n\n<p>云智易</p>\n\n<p>%date%</p>',
            type: 2,
            lang: 'zh-cn'
          }
          var rModel2 = {
            name: '重置密码邮件英文模板',
            subject: 'Reset XLINK password?',
            sender: '',
            content: '<p>Dear %username%,</p>\n\n<p>We received your request of retrieving your password,please click the link below to retrieve your password.&nbsp</p>\n\n<p><a href="http://%admin_host%/#!/user-password-reset/%corp_id%/%email%/%verifycode%">http://%admin_host%/#!/user-password-reset/</a></p>\n\n<p>（this link will be valid within 48 hours）<br />\n\n*Please note:this e-mail was sent from an address that cannot accept incoming e-mail.</p>\n\n<p>XLINK</p>\n\n<p>%date%</p>',
            type: 2,
            lang: 'en-us'
          }
          var template, i

          this.loading = false

          for (i = 0; i < res.data.count; i++) {
            template = res.data.list[i]
            this.sender = template.sender
            if (template.type === 1) {
              if (template.lang === 'zh-cn') {
                aModel.subject = template.subject
                aModel.content = template.content
                this.activateStatus = template.status
                this.activateId = template.id
              } else {
                aModel2.subject = template.subject
                aModel2.content = template.content
                this.activateStatus2 = template.status
                this.activateId2 = template.id
              }
            } else if (template.type === 2) {
              if (template.lang === 'zh-cn') {
                rModel.subject = template.subject
                rModel.content = template.content
                this.resetStatus = template.status
                this.resetId = template.id
              } else {
                rModel2.subject = template.subject
                rModel2.content = template.content
                this.resetStatus2 = template.status
                this.resetId2 = template.id
              }
            }
          }

          this.activateModel = aModel
          this.activateModel2 = aModel2
          this.resetModel = rModel
          this.resetModel2 = rModel2
        })
      }
    },

    methods: {
      /**
       * 提交发件者
       */
      onSenderSubmit () {
        if (this.validation.$valid && this.activateValidation.$valid && this.activateValidation2.$valid && this.resetValidation.$valid && this.resetValidation2.$valid) {
          this.onActivateSubmit()
          this.onActivateSubmit2()
          this.onResetSubmit()
          this.onResetSubmit2()
        }
      },
      /**
       * 提交邮件域名
       */
      onSenderSubmit2 () {
        this.setAddress()
        this.getAddress()
      },

      /**
       * 提交激活邮件中文模板
       */
      onActivateSubmit () {
        if (!this.validation.$valid) {
          this.showNotice({
            type: 'error',
            content: this.$t('mail_templates.messages.illegal_sender')
          })
          return
        }
        if (this.validation.$valid && this.activateValidation.$valid) {
          this.savingActivate = true
          if (this.activateStatus === -2) { // 新增
            api.email.createTemplate(this.activateModel).then((res) => {
              if (res.status === 200) {
                this.activateStatus = res.data.status
                this.savingActivate = false
              }
            }).catch((res) => {
              this.savingActivate = false
              this.showNotice({
                type: 'error',
                content: this.$t('mail_templates.messages.creation_fail')
              })
            })
          } else { // 修改
            api.email.updateTemplate(this.activateId, this.activateModel).then((res) => {
              if (res.status === 200) {
                this.activateStatus = res.data.status
                this.savingActivate = false
              }
            }).catch((res) => {
              this.savingActivate = false
              this.showNotice({
                type: 'error',
                content: this.$t('mail_templates.messages.update_fail')
              })
            })
          }
        }
      },

      /**
       * 提交激活英文邮件模板
       */
      onActivateSubmit2 () {
        if (!this.validation.$valid) {
          this.showNotice({
            type: 'error',
            content: this.$t('mail_templates.messages.illegal_sender')
          })
          return
        }
        if (this.validation.$valid && this.activateValidation2.$valid) {
          this.savingActivate = true
          if (this.activateStatus2 === -2) { // 新增
            api.email.createTemplate(this.activateModel2).then((res) => {
              if (res.status === 200) {
                this.activateStatus2 = res.data.status
                this.savingActivate = false
              }
            }).catch((res) => {
              this.savingActivate = false
              this.showNotice({
                type: 'error',
                content: this.$t('mail_templates.messages.creation_fail')
              })
            })
          } else { // 修改
            api.email.updateTemplate(this.activateId2, this.activateModel2).then((res) => {
              if (res.status === 200) {
                this.activateStatus2 = res.data.status
                this.savingActivate = false
              }
            }).catch((res) => {
              this.savingActivate = false
              this.showNotice({
                type: 'error',
                content: this.$t('mail_templates.messages.update_fail')
              })
            })
          }
        }
      },

      /**
       * 提交重置密码邮件模板
       */
      onResetSubmit () {
        if (!this.validation.$valid) {
          this.showNotice({
            type: 'error',
            content: this.$t('mail_templates.messages.illegal_sender')
          })
          return
        }
        if (this.validation.$valid && this.resetValidation.$valid) {
          this.savingReset = true
          if (this.resetStatus === -2) { // 新增
            api.email.createTemplate(this.resetModel).then((res) => {
              if (res.status === 200) {
                this.resetStatus = res.data.status
                this.savingReset = false
              }
            }).catch((res) => {
              this.savingReset = false
              this.showNotice({
                type: 'error',
                content: this.$t('mail_templates.messages.creation_fail')
              })
            })
          } else { // 修改
            api.email.updateTemplate(this.resetId, this.resetModel).then((res) => {
              if (res.status === 200) {
                this.resetStatus = res.data.status
                this.savingReset = false
              }
            }).catch((res) => {
              this.savingReset = false
              this.showNotice({
                type: 'error',
                content: this.$t('mail_templates.messages.update_fail')
              })
            })
          }
        }
      },

      /**
       * 提交重置密码英文邮件模板
       */
      onResetSubmit2 () {
        if (!this.validation.$valid) {
          this.showNotice({
            type: 'error',
            content: this.$t('mail_templates.messages.illegal_sender')
          })
          return
        }
        if (this.validation.$valid && this.resetValidation2.$valid) {
          this.savingReset = true
          if (this.resetStatus2 === -2) { // 新增
            api.email.createTemplate(this.resetModel2).then((res) => {
              if (res.status) {
                this.resetStatus2 = res.data.status
                this.savingReset = false
              }
            }).catch((res) => {
              this.savingReset = false
              this.showNotice({
                type: 'error',
                content: this.$t('mail_templates.messages.creation_fail')
              })
            })
          } else { // 修改
            api.email.updateTemplate(this.resetId2, this.resetModel2).then((res) => {
              if (res.status === 200) {
                this.resetStatus2 = res.data.status
                this.savingReset = false
              }
            }).catch((res) => {
              this.savingReset = false
              this.showNotice({
                type: 'error',
                content: this.$t('mail_templates.messages.update_fail')
              })
            })
          }
        }
      },
      /**
       * 获取邮件发送域名
       */
      getAddress () {
        api.email.getAddress().then((res) => {
          this.validation2 = res.data
          if (res.data.domain === 'mail.xlink.cn') {
            this.ifxlink = true
            this.ifxlinkbtn = false
            this.showform = false
          } else {
            this.ifxlink = false
            this.ifxlinkbtn = true
            this.showform = true
          }
          var IPaddress = this.validation2.domain
          var IParry = IPaddress.split('.')
          var IPlast1 = IParry.pop()
          var IPlast2 = IParry.pop()
          var IPbehind
          var IPlast3
          if ((IPlast1 === 'cn' && IPlast2 === 'com') || (IPlast1 === 'cn' && IPlast2 === 'net') || (IPlast1 === 'cn' && IPlast2 === 'gov') || (IPlast1 === 'cn' && IPlast2 === 'org')) {
            IPlast3 = IParry.pop()
            IPbehind = IPlast3 + '.' + IPlast2 + '.' + IPlast1
          } else {
            IPbehind = IPlast2 + '.' + IPlast1
          }
          var IPfront = IParry.join('.')
          this.validation2.IPfront = IPfront
          this.validation2.IPbehind = IPbehind
        })
      },
      // 修改域名
      changeAddress () {
        this.ifxlink = false
        this.ifxlinkbtn = true
        this.showform = false
      },
      /**
       * 设置邮件发送域名
       */
      setAddress () {
        this.editingAddress = true
        var params = {
          domain: this.validation2.domain
        }
        api.email.setAddress(params).then((res) => {
          if (res.status === 200) {
            this.editingAddress = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.editingAddress = false
        })
      }
    }
  }
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
