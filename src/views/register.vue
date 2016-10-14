<template>
  <div class="auth-form register-form">
    <div class="slogan" v-show="!registerSuccess">让企业拥有物联网的力量</div>
    <div class="inner" v-show="!registerSuccess">
      <div class="intro">
        <div class="desc">
          <p>云智易物联PaaS平台，专注于智慧生活场景，主要服务于智能照明/电工、智能安防、生活电器、健康穿戴、智能社区等领域的企业，提供软件和云平台一体化解决方案。</p>
          <ul>
            <li><strong>快速连接：</strong><span>最快仅需一周便可接入覆盖全球的云端服务</span></li>
            <li><strong>简化开发：</strong><span>完善的开发工具协助企业快速开发和集成</span></li>
            <li><strong>设备管理：</strong><span>15个子模块提供成熟的运营体系和数据管理服务</span></li>
          </ul>
        </div>
        <div class="customers">
          <p>他们选择了云智易：</p>
          <div class="logos">
            <a href="http://www.xlink.cn/customers.html#ge" class="c-logo logo-ge" target="_blank"></a>
            <a href="http://www.xlink.cn/customers.html#fangtai" class="c-logo logo-fotile" target="_blank"></a>
            <a href="http://www.xlink.cn/customers.html#ousilang" class="c-logo logo-osram" target="_blank"></a>
            <a href="http://www.xlink.cn/customers.html#kaichi" class="c-logo logo-karcher" target="_blank"></a>
            <a href="http://www.xlink.cn/customers.html#tianji" class="c-logo logo-tonze" target="_blank"></a>
            <a href="http://www.xlink.cn/customers.html" class="c-logo logo-bull" target="_blank"></a>
          </div>
        </div>
      </div>
      <div class="form">
        <validator name="authValidation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmit">
            <div class="form-hints mt10 mb15">请输入您的账号信息</div>
            <div class="form-row">
              <div v-placeholder="$t('ui.auth.fields.email')" class="input-text-wrap">
                <input type="email" v-model="model.email" name="model.email" v-validate:email="{required: true, format: 'email'}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.email.touched && $authValidation.email.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.email')}) }}</span>
                <span v-if="$authValidation.email.modified && $authValidation.email.format">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.email')}) }}</span>
              </div>
            </div>
            <div class="form-row row">
              <div class="col-12">
                <div class="mr10">
                  <div v-placeholder="$t('ui.auth.password')" class="input-text-wrap">
                    <input type="password" v-model="model.password" name="model.password" v-validate:password="{required: true, minlength: 8, maxlength: 16}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$authValidation.password.touched && $authValidation.password.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.password')}) }}</span>
                    <span v-if="$authValidation.password.modified && $authValidation.password.minlength">{{ $t('ui.validation.minlength', [$t('ui.auth.fields.password'), 8]) }}</span>
                    <span v-if="$authValidation.password.modified && $authValidation.password.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.auth.fields.password'), 16]) }}</span>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="ml10">
                  <div v-placeholder="$t('ui.auth.fields.confirm_password')" class="input-text-wrap">
                    <input type="password" v-model="confirmPassword" name="confirmPassword" v-validate:confirm-password="{required: true, equal: model.password}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$authValidation.confirmPassword.touched && $authValidation.confirmPassword.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.confirm_password')}) }}</span>
                    <span v-if="$authValidation.confirmPassword.modified && $authValidation.confirmPassword.equal">{{ $t('ui.validation.equal', [$t('ui.auth.fields.confirm_password'), $t('ui.auth.fields.password')]) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-hints mt30 mb15">请输入您的基本信息</div>
            <div class="form-row">
              <div v-placeholder="$t('ui.auth.fields.name')" class="input-text-wrap">
                <input type="text" v-model="model.name" name="model.name" v-validate:name="{required: true, minlength: 2, maxlength: 32}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.name.touched && $authValidation.name.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.name')}) }}</span>
                <span v-if="$authValidation.name.modified && $authValidation.name.minlength">{{ $t('ui.validation.minlength', [$t('ui.auth.fields.name'), 2]) }}</span>
                <span v-if="$authValidation.name.modified && $authValidation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.auth.fields.name'), 32]) }}</span>
              </div>
            </div>
            <div class="form-row row">
              <div class="col-12">
                <div class="mr10">
                  <div v-placeholder="$t('ui.auth.fields.phone')" class="input-text-wrap">
                    <input type="text" v-model="model.phone" name="model.phone" v-validate:phone="{required: true, format: 'phone'}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$authValidation.phone.touched && $authValidation.phone.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.phone')}) }}</span>
                    <span v-if="$authValidation.phone.modified && $authValidation.phone.format">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.phone')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="ml10">
                  <div v-placeholder="$t('ui.auth.fields.company')" class="input-text-wrap">
                    <input type="text" v-model="model.company" name="model.company" v-validate:company="{required: true, maxlength: 250}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$authValidation.company.touched && $authValidation.company.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.company')}) }}</span>
                    <span v-if="$authValidation.company.modified && $authValidation.company.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.auth.fields.company'), 250]) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <x-select :placeholder="$t('ui.auth.type_tips')" :label="accountTypeLabel">
                <select v-model="model.type" name="model.type">
                  <option v-for="type in locales.data.ACCOUNT_TYPES" :value="type.value">{{ type.label }}</option>
                </select>
              </x-select>
            </div>
            <div class="form-row row-check">
              <label class="checkbox">
                <input type="checkbox" v-model="isAgree"/>我同意云智易的<a href="#">使用条款</a>和<a href="#">隐私权政策</a>
              </label>
            </div>
            <div class="form-actions">
              <button class="btn btn-primary btn-xlg btn-pill" :disabled="submitting" :class="{'disabled':submitting}">{{ $t("ui.auth.register_submit") }}</button>
            </div>
            <div class="form-operations"><a v-link="{ path: '/login' }">已有帐号？</a></div>
          </form>
        </validator>
      </div>
    </div>
    <div class="auth-msg-box" v-else>
      <x-alert :cols="16" type="success" :title="$t('ui.auth.register_success')">
        <p>{{ $t("ui.auth.register_success_msg") }}</p>
        <div class="actions"><a v-link="{ path: '/login'}" class="btn btn-primary btn-pill">{{ $t("common.ok") }}</a></div>
      </x-alert>
    </div>
  </div>
</template>

<script>
import api from 'api'
// import Vue from 'vue'
// import locales from 'consts/locales/index'
import Select from 'components/Select'
import Alert from 'components/Alert'
import { globalMixins } from 'src/mixins'
import _ from 'lodash'

export default {
  name: 'RegisterForm',

  layouts: ['auth'],

  mixins: [globalMixins],

  components: {
    'x-select': Select,
    'x-alert': Alert
  },

  data () {
    return {
      model: {
        email: '',
        password: ''
      },
      confirmPassword: '',
      isAgree: false,
      registerSuccess: false,
      submitting: false
    }
  },

  computed: {
    accountTypeLabel () {
      let accountTypes = this.locales.data.ACCOUNT_TYPES
      var index = _.findIndex(accountTypes, (item) => {
        return item.value === this.model.type
      })
      return this.model.type ? accountTypes[index].label : ''
    }
  },

  methods: {
    /**
     * 提交注册
     */
    onSubmit () {
      // 防止二次提交
      if (this.submitting) return

      // 表单验证不通过，重新验证
      if (this.$authValidation.invalid) {
        this.$validate(true)
        return
      }

      // 没有勾选同意条款，给出提示
      if (!this.isAgree) {
        this.showNotice({
          type: 'error',
          content: '您必须同意云智易的使用条款和隐私权政策才能继续注册'
        })
        return
      }

      // 注册
      this.submitting = true
      api.corp.emailRegister(this.model).then((res) => {
        if (res.status !== 200) return
        this.submitting = false
        this.registerSuccess = true
      }).catch((res) => {
        this.submitting = false
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../assets/stylus/common'

.register-form
  margin-bottom 40px
  .inner
    width 955px
    padding-bottom 0
    background #F7F7F7

  .slogan
    font-size 28px
    color #FFF
    text-align center
    margin 0 0 60px

  // 简介
  .intro
    float left
    size 411px 100%
    padding 30px 45px 0
    box-sizing border-box

    .desc
      margin-bottom 50px

      p
        font-weight bold
        margin 0 0 42px
        line-height 26px

    li
      position relative
      margin-bottom 20px
      padding-left 20px

      &:before
        absolute left top 4px
        content ''
        size 10px
        background #B4B4B4
        border-radius 10px

      span
        color #9C9B9B

  .customers
    p
      font-size 16px

    .logos
      margin-right -20px
      font-size 0

      .c-logo
        display inline-block
        height 60px
        margin 20px 20px 0 0
        background-repeat no-repeat

        &:hover
          background-position 0 -70px

      .logo-ge
        background-image url(../assets/images/register/logo_ge.png)
        width 60px

      .logo-fotile
        background-image url(../assets/images/register/logo_fotile.png)
        width 119px

      .logo-osram
        background-image url(../assets/images/register/logo_osram.png)
        width 93px
        margin-right 0

      .logo-karcher
        background-image url(../assets/images/register/logo_karcher.png)
        width 82px

      .logo-tonze
        background-image url(../assets/images/register/logo_tonze.png)
        width 68px

      .logo-bull
        background-image url(../assets/images/register/logo_bull.png)
        width 120px

  // 表单
  .form
    float right
    width 544px
    box-sizing border-box
    background #FFF
    padding 20px 45px
    font-size 16px

    .row-check
      font-size 14px
      color #969595

      a
        color red

    .form-hints
      font-size 16px

  .form-operations
    margin-top 20px
    text-align right
    font-size 14px

    a
      color #C8C8C8

.loading-resource
  .form-auth
    .form-actions
      .btn
        cursor wait
</style>
