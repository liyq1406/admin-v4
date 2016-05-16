<template>
  <div class="form form-auth form-register">
    <div class="form-logo"></div>
    <form v-form name="validation" @submit.prevent="onSubmit" v-show="!registerSuccess" class="form-cont">
      <div class="form-header"><a v-link="{ path: '/login' }">{{ $t("ui.auth.login") }}</a><span>{{ $t("ui.auth.register") }}</span></div>
      <div class="form-body">
        <div class="form-hints">{{ $t("ui.auth.account_tips") }}</div>
        <div class="form-row row-group">
          <div class="form-row row">
            <div v-placeholder="$t('ui.auth.fields.email')" class="input-text-wrap">
              <input type="email" v-model="model.email" v-form-ctrl name="email" required lazy class="input-text"/>
            </div>
            <div v-if="validation.email.$dirty" class="form-tips form-tips-error"><span v-if="validation.email.$error.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.email')}) }}</span><span v-if="validation.email.$error.email">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.email')}) }}</span></div>
          </div>
          <div class="form-row row">
            <div v-placeholder="$t('ui.auth.password')" class="input-text-wrap">
              <input type="password" v-model="model.password" v-form-ctrl required maxlength="16" minlength="6" name="password" lazy class="input-text"/>
            </div>
            <div v-if="validation.password.$dirty" class="form-tips form-tips-error"><span v-if="validation.password.$error.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.password')}) }}</span><span v-if="validation.password.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.auth.fields.password'), 6]) }}</span><span v-if="validation.password.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.auth.fields.password'), 16]) }}</span></div>
          </div>
          <div class="form-row row">
            <div v-placeholder="$t('ui.auth.fields.confirm_password')" class="input-text-wrap">
              <input type="password" v-model="confirmPassword" v-form-ctrl required custom-validator="checkEqualToPassword" name="confirmPassword" lazy class="input-text"/>
            </div>
            <div v-if="validation.confirmPassword.$dirty" class="form-tips form-tips-error"><span v-if="model.password && validation.confirmPassword.$error.required">{{ $t("ui.auth.confirm_password") }}</span><span v-if="validation.confirmPassword.$error.customValidator">{{ $t("ui.auth.confirm_password_tips") }}</span></div>
          </div>
        </div>
        <div class="form-hints">{{ $t("ui.auth.basic_tips") }}</div>
        <div class="form-row row-group">
          <div class="form-row row">
            <div v-placeholder="$t('ui.auth.fields.name')" class="input-text-wrap">
              <input type="text" v-model="model.name" v-form-ctrl required maxlength="32" minlength="2" name="name" lazy class="input-text"/>
            </div>
            <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.name')}) }}</span><span v-if="validation.name.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.auth.fields.name'), 2]) }}</span><span v-if="validation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.auth.fields.name'), 32]) }}</span></div>
          </div>
          <div class="form-row row">
            <div v-placeholder="$t('ui.auth.fields.phone')" class="input-text-wrap">
              <input type="text" v-model="model.phone" v-form-ctrl required pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" name="phone" lazy class="input-text"/>
            </div>
            <div v-if="validation.phone.$dirty" class="form-tips form-tips-error"><span v-if="validation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.phone')}) }}</span><span v-if="validation.phone.$error.pattern">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.phone')}) }}</span></div>
          </div>
          <div class="form-row row">
            <div v-placeholder="$t('ui.auth.fields.company')" class="input-text-wrap">
              <input type="text" v-model="model.company" v-form-ctrl required maxlength="32" name="company" lazy class="input-text"/>
            </div>
            <div v-if="validation.company.$dirty" class="form-tips form-tips-error"><span v-if="validation.company.$error.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.company')}) }}</span><span v-if="validation.company.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.auth.fields.company'), 32]) }}</span></div>
          </div>
          <div class="form-row row">
            <div class="select">
              <v-select :placeholder="$t('ui.auth.type_tips')" :label="accountTypeLabel">
                <select v-model="model.type" v-form-ctrl name="type" custom-validator="checkTypeValid">
                  <option v-for="type in accountTypes" :value="type.value">{{ type.label }}</option>
                </select>
              </v-select>
            </div>
            <div v-if="validation.$submitted" class="form-tips form-tips-error"><span v-if="validation.type.$error.customValidator">{{ $t("ui.auth.type_tips") }}</span></div>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary btn-block">{{ $t("ui.auth.register_submit") }}</button>
        </div>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </form>
    <div v-show="registerSuccess" class="form-cont reset-password-success">
      <div class="alert alert-success">
        <div class="fa fa-check-circle-o"></div>
        <h2>{{ $t("ui.auth.register_success") }}</h2>
        <p>{{ $t("ui.auth.register_success_msg") }}</p>
        <div class="actions"><a v-link="{ path: '/login'}" class="btn btn-primary">{{ $t("common.ok") }}</a></div>
      </div>
      <div class="form-footer">2015 &copy; {{ $t("common.company") }}.</div>
    </div>
  </div>
</template>

<script>
  import api from '../api'
  import Vue from 'vue'
  import locales from '../consts/locales/index'
  import Select from '../components/Select'
  import { globalMixins } from '../mixins'
  import _ from 'lodash'

  export default {
    name: 'RegisterForm',

    layout: 'auth',

    mixins: [globalMixins],

    components: {
      'v-select': Select
    },

    data () {
      return {
        accountTypes: locales[Vue.config.lang].data.ACCOUNT_TYPES,
        validation: {},
        model: {},
        confirmPassword: '',
        registerSuccess: false
      }
    },

    computed: {
      accountTypeLabel () {
        var index = _.findIndex(this.accountTypes, (item) => {
          return item.value === this.model.type
        })
        return this.model.type ? this.accountTypes[index].label : ''
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

      /**
       * 提交注册
       */
      onSubmit () {
        if (this.validation.$valid) {
          api.corp.emailRegister(this.model).then((res) => {
            if (res.status === 200) {
              this.registerSuccess = true
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      }
    }
  }
</script>
