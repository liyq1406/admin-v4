<template>
  <div class="auth-form fetch-form">
    <div class="inner" v-show="!resetsuccess">
      <a v-link="{path: '/login'}" class="fa fa-chevron-circle-left link-return"></a>
      <div class="form-legend">{{ $t("auth.by_phone") }}</div>
      <div class="form">
        <validator name="authValidation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmit">
            <div class="form-hints">{{ $t("auth.by_phone_tips") }}</div>
            <div class="form-row">
              <div v-placeholder="$t('auth.fields.phone')" class="input-text-wrap">
                <input type="text" v-model="model.phone" name="model.phone" v-validate:phone="{required: true, format: 'phone'}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.phone.touched && $authValidation.phone.required">{{ $t('common.validation.required', {field: $t('auth.fields.phone')}) }}</span>
                <span v-if="$authValidation.phone.modified && $authValidation.phone.format">{{ $t('common.validation.format', {field: $t('auth.fields.phone')}) }}</span>
              </div>
            </div>
            <div class="form-row row">
              <div class="col-15">
                <div class="mr10">
                  <div v-placeholder="$t('auth.insert_code')" class="input-text-wrap">
                    <input type="text" v-model="captcha" name="captcha" lazy class="input-text"/>
                  </div>
                </div>
              </div>
              <div class="col-9">
                <div class="ml10">
                  <captcha :width="120" :height="44" :value.sync="captchaValue" v-ref:captcha></captcha>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="col-15">
                <div class="mr10">
                  <div v-placeholder="$t('auth.verifycode')" class="input-text-wrap">
                    <input type="text" v-model="model.verifycode" name="model.verifycode" v-validate:verifycode="{required: true}" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$authValidation.verifycode.touched && $authValidation.verifycode.required">{{ $t('common.validation.required', {field: $t('auth.verifycode')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="col-9">
                <div class="ml10">
                  <button @click.stop.prevent="fetchVerifyCode" :class="{'disabled': btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()}" :disabled="btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()" v-text="counting ? $t('auth.waiting', {seconds: seconds}) : $t('auth.get_code')" class="btn btn-primary btn-fetch"></button>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div v-placeholder="$t('auth.password')" class="input-text-wrap">
                <input type="password" v-model="model.password" name="model.password" v-validate:password="{required: true, minlength: 6, maxlength: 16}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.password.touched && $authValidation.password.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
                <span v-if="$authValidation.password.modified && $authValidation.password.minlength">{{ $t('common.validation.minlength', [$t('auth.fields.password'), 6]) }}</span>
                <span v-if="$authValidation.password.modified && $authValidation.password.maxlength">{{ $t('common.validation.maxlength', [$t('auth.fields.password'), 16]) }}</span>
              </div>
            </div>
            <div class="form-row">
              <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
                <input type="password" v-model="confirmPassword" name="confirmPassword" v-validate:confirm-password="{required: true, equal: model.password}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$authValidation.confirmPassword.touched && $authValidation.confirmPassword.required">{{ $t('common.validation.required', {field: $t('auth.fields.confirm_password')}) }}</span>
                <span v-if="$authValidation.confirmPassword.modified && $authValidation.confirmPassword.equal">{{ $t('common.validation.equal', [$t('auth.fields.confirm_password'), $t('auth.fields.password')]) }}</span>
              </div>
            </div>
            <div class="form-actions">
              <button @keyup.enter="onSubmit" :disabled="sending" :class="{'disabled':sending}" v-text="sending ? $t('common.handling') : $t('common.ok')" class="btn btn-primary btn-xlg btn-pill">{{ $t("common.ok") }}</button>
            </div>
            <div class="form-operations"><a v-link="{ path: '/fetch-password-bymail' }">{{ $t("auth.by_mail") }}</a></div>
          </form>
        </validator>
      </div>
    </div>
    <div class="auth-msg-box" v-else>
      <x-alert :cols="16" type="success" :title="$t('auth.by_phone_success')">
        <p>{{ $t("auth.by_phone_success_msg") }}</p>
        <div class="actions"><a v-link="{ path: '/login'}" class="btn btn-primary btn-pill">{{ $t("common.ok") }}</a></div>
      </x-alert>
    </div>
  </div>
  <!-- <div class="form form-auth form-fetch-password">
    <div class="form-logo"><a v-link="{path: '/login'}" class="fa fa-chevron-circle-left link-return"></a></div>
    <form autocomplete="off" v-show="!resetsuccess" v-form name="validation" @submit.prevent="onSubmit" class="form-cont">
      <div class="form-header">
        <h2>{{ $t("auth.fetch") }}</h2>
        <p>{{ $t("auth.by_phone_tips") }}</p>
      </div>
      <div class="form-body">
        <div class="form-row row">
          <div v-placeholder="$t('auth.fields.phone')" class="input-text-wrap">
            <input type="text" v-model="model.phone" v-form-ctrl required :pattern="patterns.PHONE" name="phone" lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.phone.$pristine" class="form-tips form-tips-error">
            <span v-if="validation.phone.$error.required">{{ $t('common.validation.required', {field: $t('auth.fields.phone')}) }}</span>
          </div>
          <div v-if="validation.phone.$dirty" class="form-tips form-tips-error">
            <span v-if="validation.phone.$error.required">{{ $t('common.validation.required', {field: $t('auth.fields.phone')}) }}</span>
            <span v-if="validation.phone.$error.pattern">{{ $t('common.validation.format', {field: $t('auth.fields.phone')}) }}</span>
          </div>
        </div>
        <div class="form-row row captcha-row">
          <div v-placeholder="$t('auth.insert_code')" class="input-text-wrap">
            <input type="text" v-model="captcha" lazy class="input-text"/>
          </div>
          <captcha :width="120" :height="32" :value.sync="captchaValue" v-ref:captcha></captcha>
        </div>
        <div class="form-row row verify-code">
          <div v-placeholder="$t('auth.verifycode')" class="input-text-wrap">
            <input type="text" v-model="model.verifycode" v-form-ctrl required name="verifycode" lazy class="input-text"/>
          </div>
          <button @click.stop.prevent="fetchVerifyCode" :class="{'disabled': btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()}" v-bind="{'disabled': btnDisabled || captcha.toLowerCase() !== captchaValue.toLowerCase()}" v-text="counting ? $t('auth.waiting', {seconds: seconds}) : $t('auth.get_code')" class="btn btn-primary"></button>
          <div v-if="validation.$submitted && validation.verifycode.$pristine" class="form-tips form-tips-error"><span v-if="validation.verifycode.$error.required">{{ $t('common.validation.required', {field: $t('auth.verifycode')}) }}</span></div>
          <div v-if="validation.verifycode.$dirty" class="form-tips form-tips-error"><span v-if="validation.verifycode.$error.required">{{ $t('common.validation.required', {field: $t('auth.verifycode')}) }}</span></div>
        </div>
        <div class="form-row row">
          <div v-placeholder="$t('auth.password')" class="input-text-wrap">
            <input type="password" v-model="model.password" v-form-ctrl required maxlength="16" minlength="6" name="password" lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.password.$pristine" class="form-tips form-tips-error">
            <span v-if="validation.password.$error.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
          </div>
          <div v-if="validation.password.$dirty" class="form-tips form-tips-error">
            <span v-if="validation.password.$error.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
            <span v-if="validation.password.$error.minlength">{{ $t('common.validation.minlength', [ $t('auth.fields.password'), 6]) }}</span>
            <span v-if="validation.password.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('auth.fields.password'), 16]) }}</span>
          </div>
        </div>
        <div class="form-row row">
          <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
            <input type="password" v-model="confirmPassword" v-form-ctrl required custom-validator="checkEqualToPassword" name="confirmPassword" lazy class="input-text"/>
          </div>
          <div v-if="validation.$submitted && validation.confirmPassword.$pristine" class="form-tips form-tips-error">
            <span v-if="validation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span>
          </div>
          <div v-if="validation.confirmPassword.$dirty" class="form-tips form-tips-error">
            <span v-if="model.password && validation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span>
            <span v-if="validation.confirmPassword.$error.customValidator">{{ $t("auth.confirm_password_tips") }}</span>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-block">{{ $t("common.ok") }}</button>
        </div>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </form>
    <div v-show="resetsuccess" class="form-cont reset-password-success">
      <div class="alert alert-success">
        <div class="icon icon-success"></div>
        <h2>{{ $t("auth.by_phone_success") }}</h2>
        <p>{{ $t("auth.by_phone_success_msg") }}</p>
      </div>
      <div class="form-actions">
        <a v-link="{ path: '/login'}" class="btn btn-primary btn-block">{{ $t("common.ok") }}</a>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </div>
  </div> -->
</template>

<script>
  import api from 'api'
  import * as config from 'consts/config'
  import Alert from 'components/Alert'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'FetchPwdForm',

    layouts: ['auth'],

    mixins: [globalMixins],

    components: {
      'x-alert': Alert
    },

    data () {
      return {
        validation: {},
        captcha: '',
        captchaValue: '',
        model: {},
        confirmPassword: '',
        verifycodeValid: false,
        counting: false,
        btnDisabled: false,
        seconds: config.VERIFYCODE_DURATION,
        resetsuccess: false,
        sending: false
      }
    },

    methods: {
      getObjLength (obj) {
        return Object.keys(obj).length
      },

      checkEqualToPassword (value) {
        return value === this.model.password
      },

      checkTypeValid (value) {
        return Number(value) > 0
      },

      tiktac () {
        var itvl = window.setInterval(() => {
          if (this.seconds) {
            this.seconds--
          } else {
            this.seconds = config.VERIFYCODE_DURATION
            this.counting = false
            this.btnDisabled = false
            window.clearInterval(itvl)
          }
        }, 1000)
      },

      fetchVerifyCode () {
        if (this.$authValidation.phone.invalid) {
          this.showNotice({
            type: 'error',
            content: this.$t('auth.phone_msg')
          })
          return
        }

        this.btnDisabled = true
        this.captcha = ''
        this.$refs.captcha.generate()
        api.sms.getVerifycode({
          phone: this.model.phone
        }).then((res) => {
          if (res.status === 200) {
            this.counting = true
            this.tiktac()
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      onSubmit () {
        var content = {
          'phone': this.model.phone,
          'verifycode': this.model.verifycode,
          'password': this.model.password
        }

        if (this.$authValidation.valid && !this.sending) {
          this.sending = true
          api.corp.resetPassword(content).then((res) => {
            if (res.data === 200) {
              this.resetsuccess = true
              this.sending = false
            }
          }).catch((res) => {
            this.handleError(res)
            this.sending = false
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
@import '../assets/stylus/common'

.fetch-form
  .btn-fetch
    height 40px
    line-height 40px
</style>
