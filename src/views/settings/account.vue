<template>
  <div>
    <div class="row">
      <div class="col-14">
        <!-- Start: 个人信息-->
        <div class="panel">
          <div class="panel-hd">
            <h2>{{ $t('account.personal') }}</h2>
          </div>
          <div class="panel-bd">
            <div v-if="loadingAccount" class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
            <ul v-else class="info-details">
              <li>
                <div class="label">{{ $t("member.fields.name") }}:</div>
                <div class="info">{{ member.name }}<a href="#" @click.prevent="editAccount" class="fa fa-edit"></a></div>
              </li>
              <li>
                <div class="label">{{ $t("member.fields.password") }}:</div>
                <div class="info"><a href="#" @click.prevent="editPwd" class="hl-red">修改密码</a></div>
              </li>
              <li>
                <div class="label">{{ $t("member.fields.email") }}:</div>
                <div class="info">{{ member.email }}</div>
              </li>
              <li>
                <div class="label">{{ $t("member.fields.phone") }}:</div>
                <div class="info">{{ member.phone }}</div>
              </li>
              <li>
                <div class="label">{{ $t("member.fields.create_time") }}:</div>
                <div class="info">{{ member.create_time | formatDate }}</div>
              </li>
              <li>
                <div class="label">{{ $t("member.fields.last_auth_time") }}:</div>
                <div class="info">{{ member.last_auth_time | formatDate }}</div>
              </li>
              <li>
                <div class="label">{{ $t("member.fields.role") }}:</div>
                <div class="info"><span>{{ memberTypes[member.role-1] }}</span></div>
                <!--.info {{ member.role }}-->
              </li>
              <li>
                <div class="label">{{ $t("common.status") }}:</div>
                <div class="info"><span :class="{'hl-gray': member.status===0, 'hl-green': member.status===1, 'hl-red': member.status===2}">{{ statusTypes[member.status] }}</span></div>
              </li>
              <li>
                <div class="label">{{ $t("member.fields.is_notice") }}:</div>
                <div class="info"><span v-if="member.is_notice" class="hl-green">{{ $t("common.yes") }}</span><span v-else class="hl-red">{{ $t("common.no") }}</span></div>
              </li>
              <li>
                <div class="label">{{ $t("member.fields.is_alert") }}:</div>
                <div class="info"><span v-if="member.is_alert" class="hl-green">{{ $t("common.yes") }}</span><span v-else class="hl-red">{{ $t("common.no") }}</span></div>
              </li>
            </ul>
          </div>
        </div>
        <!-- End: 个人信息-->
      </div>
      <div class="col-10">
        <!-- Start: 企业信息-->
        <div class="panel">
          <div class="panel-hd">
            <h2>{{ $t('account.corp') }}</h2>
          </div>
          <div class="panel-bd">
            <div v-if="loadingCorp" class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
            <ul v-else class="info-details">
              <!--li
              .label logo:
              .info samxlu
              -->
              <li>
                <div class="label">{{ $t("corp.fields.company") }}:</div>
                <div class="info">{{ corp.company }}</div>
              </li>
              <li>
                <div class="label">{{ $t("corp.fields.id") }}:</div>
                <div class="info">{{ corp.id }}</div>
              </li>
              <li>
                <div class="label">{{ $t("corp.fields.type") }}:</div>
                <div class="info">{{ accountTypes[corp.type - 1] }}</div>
              </li>
              <li>
                <div class="label">{{ $t("corp.fields.name") }}:</div>
                <div class="info">{{ corp_member.name }}</div>
              </li>
              <li>
                <div class="label">{{ $t("corp.fields.email") }}:</div>
                <div class="info">{{ corp_member.email }}</div>
              </li>
              <li>
                <div class="label">{{ $t("corp.fields.phone") }}:</div>
                <div class="info">{{ corp_member.phone }}</div>
              </li>
              <li>
                <div class="label">{{ $t("corp.fields.create_time") }}:</div>
                <div class="info">{{ corp.create_time | formatDate }}</div>
              </li>
              <!--button.btn.btn-success.btn-lg.mt10.mb10(@click.prevent="showEditPwdModal = true") 编辑-->
            </ul>
          </div>
        </div>
        <!-- End: 企业信息-->
      </div>
    </div>
    <modal :show.sync="showEditAccountModal">
      <h3 slot="header">{{ $t('account.edit_member') }}</h3>
      <div slot="body" class="form">
        <form v-form name="accountValidation" @submit.prevent="onSubmitAccount">
          <div class="form-row">
            <label class="form-control">{{ $t("member.fields.name") }}:</label>
            <div class="controls">
              <div v-placeholder="$t('member.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel.name" type="text" v-form-ctrl name="name" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="accountValidation.$submitted && accountValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="accountValidation.name.$error.required">{{ $t('validation.required', {field: $t('member.fields.name')}) }}</span></div>
              <div v-if="accountValidation.name" class="form-tips form-tips-error"><span v-if="accountValidation.name.$error.required">{{ $t('validation.required', {field: $t('member.fields.name')}) }}</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("member.alert_settings") }}:</label>
            <div class="controls">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" v-model="editModel.is_notice"/>{{ $t("member.fields.is_notice") }}
                </label>
                <label class="checkbox">
                  <input type="checkbox" v-model="editModel.is_alert"/>{{ $t("member.fields.is_alert") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onEditAccountCancel" class="btn btn-default">{{ $t('common.cancel') }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <modal :show.sync="showEditPwdModal" width="320px">
      <h3 slot="header">{{ $t("auth.reset") }}</h3>
      <div slot="body" class="form">
        <form v-form name="pwdValidation" @submit.prevent="onSubmitPwd" hook="editPwdHook">
          <div class="form-row">
            <div v-placeholder="$t('account.placeholders.old_password')" class="input-text-wrap">
              <input type="password" v-model="editPwdModel.oldpassword" v-form-ctrl required name="oldpassword" lazy class="input-text"/>
            </div>
            <div v-if="pwdValidation.$submitted && pwdValidation.oldpassword.$pristine" class="form-tips form-tips-error"><span v-if="pwdValidation.oldpassword.$error.required">{{ $t('validation.required', {field: $t('account.fields.old_password')}) }}</span></div>
            <div v-if="pwdValidation.oldpassword.$dirty" class="form-tips form-tips-error"><span v-if="pwdValidation.oldpassword.$error.required">{{ $t('validation.required', {field: $t('account.fields.old_password')}) }}</span></div>
          </div>
          <div class="form-row">
            <div v-placeholder="$t('account.placeholders.new_password')" class="input-text-wrap">
              <input type="password" v-model="editPwdModel.newpassword" v-form-ctrl required maxlength="16" minlength="6" name="newpassword" lazy class="input-text"/>
            </div>
            <div v-if="pwdValidation.$submitted && pwdValidation.newpassword.$pristine" class="form-tips form-tips-error"><span v-if="pwdValidation.newpassword.$error.required">{{ $t('validation.required', {field: $t('account.fields.new_password')}) }}</span></div>
            <div v-if="pwdValidation.newpassword.$dirty" class="form-tips form-tips-error"><span v-if="pwdValidation.newpassword.$error.required">{{ $t('validation.required', {field: $t('account.fields.new_password')}) }}</span><span v-if="pwdValidation.newpassword.$error.minlength">{{ $t('validation.minlength', [ $t('account.fields.new_password'), 6]) }}</span><span v-if="pwdValidation.newpassword.$error.maxlength">{{ $t('validation.maxlength', [ $t('account.fields.new_password'), 16]) }}</span></div>
          </div>
          <div class="form-row">
            <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
              <input type="password" v-model="confirmPassword" v-form-ctrl required custom-validator="checkEqualToPassword" name="confirmPassword" lazy class="input-text"/>
            </div>
            <div v-if="pwdValidation.$submitted && pwdValidation.confirmPassword.$pristine" class="form-tips form-tips-error"><span v-if="pwdValidation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span></div>
            <div v-if="pwdValidation.confirmPassword.$dirty" class="form-tips form-tips-error"><span v-if="editPwdModel.newpassword && pwdValidation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span><span v-if="pwdValidation.confirmPassword.$error.customValidator">{{ $t("auth.confirm_password_tips") }}</span></div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onEditPwdCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Modal from '../../components/Modal'
  import locales from '../../consts/locales/index'
  import api from '../../api'
  import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'AccountSettings',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal
    },

    data () {
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
      }
    },

    route: {
      data () {
        this.getCorpInfo()
        this.getMemberInfo()
      }
    },

    watch: {
      member (newVal, oldVal) {
        this.$dispatch('update-member', newVal)
      }
    },

    methods: {
      // 获取企业信息
      getCorpInfo () {
        this.loadingCorp = true
        api.corp.getCorpInfo().then((res) => {
          this.corp = res.data
          this.corp_member = res.data.member
          this.loadingCorp = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingCorp = false
        })
      },

      // 获取个人信息
      getMemberInfo () {
        var memberId = window.localStorage.getItem('memberId')

        this.loadingAccount = true
        api.corp.getMember(memberId).then((res) => {
          this.member = res.data
          this.loadingAccount = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingAccount = false
        })
      },
      /*
      // 编辑账户信息表单钩子
      editAccountHook (form) {
        this.editAccountForm = form
      },
      */

      // 修改密码表单钩子
      editPwdHook (form) {
        this.editPwdForm = form
      },

      // 关闭编辑账户信息浮层并净化表单
      resetEditAccount () {
        this.editing = false
        this.showEditAccountModal = false
        this.editModel = _.clone(this.originEditModel)
      },

      // 关闭编辑浮层并净化编辑表单
      resetEditPassword () {
        this.editing = false
        this.showEditPwdModal = false
        this.editPwdModel = _.clone(this.originEditPwdModel)
        this.confirmPassword = ''
        this.$nextTick(() => {
          this.editPwdForm.setPristine()
        })
      },

       // 初始化编辑用户信息表单
      editAccount () {
        var model = {
          name: this.member.name,
          is_alert: this.member.is_alert,
          is_notice: this.member.is_notice
        }
        this.showEditAccountModal = true
        this.editModel = _.clone(model)
        this.originEditModel = _.clone(model)
      },

      // 初始化编辑用户信息表单
      editPwd () {
        this.showEditPwdModal = true
        this.originEditPwdModel = _.clone(this.editPwdModel)
      },

      // 取消编辑用户信息
      onEditAccountCancel () {
        this.resetEditAccount()
      },

      // 取消修改密码
      onEditPwdCancel () {
        this.resetEditPassword()
      },

      // 提交编辑用户信息
      onSubmitAccount () {
        var member_id = window.localStorage.getItem('member_id')
        if (this.accountValidation.$valid && !this.editing) {
          this.editing = true
          api.corp.updateMember(member_id, this.editModel).then((res) => {
            this.resetEditAccount()
            if (res.status === 200) {
              this.getMemberInfo()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },

      /**
       * 检查密码是否相等
       * @param  {String} value 密码值
       */
      checkEqualToPassword (value) {
        return value === this.editPwdModel.newpassword
      },

      // 提交密码修改
      onSubmitPwd () {
        if (this.pwdValidation.$valid && !this.editing) {
          this.editing = true
          api.corp.memberResetPwd(this.editPwdModel).then((res) => {
            if (res.status === 200) {
              this.showNotice({
                type: 'success',
                content: this.$t('account.password_msg')
              })
            }
            this.resetEditPassword()
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      }
    }
  }
</script>
