<template>
  <div class="main">
    <div class="account-info">
      <h2>
        {{ currentMember.name }}
        <a class="fa fa-edit" @click="showEditModal"></a>
      </h2>
      <div class="details row">
        <div class="col-16">
          <div v-stretch="182">
            <info-list :info="accountInfo">
              <a href="#" class="hl-red" @click.prevent="editPwd" slot="password">修改密码</a>
            </info-list>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑帐号信息浮层 start -->
    <modal :show.sync="isShowEditModal">
      <h3 slot="header">编辑帐号信息</h3>
      <div slot="body" class="form">
        <edit-info-form :model="editModel" :submitting="editing" @form-submit="onSubmitEditInfo" @cancel="onEditInfoCancel"></edit-info-form>
      </div>
    </modal>
    <!-- 编辑帐号信息浮层 end -->

    <!-- 修改密码浮层 start -->
    <modal :show.sync="isShowModal" width="400px">
      <h3 slot="header">{{ $t("auth.reset") }}</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmitPwd">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('ui.account.fields.old_password') }}</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="password" v-model="model.oldpassword" name="model.oldpassword" v-validate:oldpassword="{required: true}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.oldpassword.touched && $validation.oldpassword.required">{{ $t('common.validation.required', {field: $t('ui.account.fields.old_password')}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('ui.account.fields.new_password') }}</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="password" v-model="model.newpassword" name="model.newpassword" v-validate:newpassword="{required: true, minlength: 8, maxlength: 16}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.newpassword.touched && $validation.newpassword.required">{{ $t('common.validation.required', {field: $t('ui.account.fields.new_password')}) }}</span>
                  <span v-if="$validation.newpassword.touched && $validation.newpassword.minlength">{{ $t('common.validation.minlength', [$t('ui.account.fields.new_password'), 8]) }}</span>
                  <span v-if="$validation.newpassword.touched && $validation.newpassword.maxlength">{{ $t('common.validation.maxlength', [$t('ui.account.fields.new_password'), 16]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('auth.fields.confirm_password') }}</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="password" v-model="confirmPassword" name="confirmPassword" v-validate:confirm-password="{required: true, equal: model.newpassword}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.confirmPassword.touched && $validation.confirmPassword.required">{{ $t('common.validation.required', {field: $t('auth.fields.confirm_password')}) }}</span>
                  <span v-if="$validation.confirmPassword.touched && $validation.confirmPassword.equal">{{ $t('common.validation.equal', [$t('auth.fields.confirm_password'), $t('auth.fields.password')]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onEditPwdCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
    <!-- 修改密码浮层 end -->
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { editPasswordMixin } from '../mixins'
import InfoList from 'components/InfoList'
import Modal from 'components/Modal'
import store from 'store'
import formatDate from 'filters/format-date'
import api from 'api'
import Select from 'components/Select'
import EditInfoForm from './components/EditInfoForm'
import { setCurrentMember } from 'store/actions/system'
// import _ from 'lodash'

export default {
  name: 'Info',

  // editPasswordMixin提供编辑密码的逻辑
  mixins: [globalMixins, editPasswordMixin],

  store,

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    },
    actions: {
      setCurrentMember
    }
  },

  components: {
    InfoList,
    Modal,
    EditInfoForm,
    'x-select': Select
  },

  data () {
    return {
      editing: false,
      role: {
        value: 0,
        label: ''
      },
      isShowEditModal: false,
      editModel: {
        name: ''
      },
      originModel: {
        oldpassword: '',
        newpassword: ''
      },
      model: {},
      loadingCorp: false
    }
  },

  computed: {
    accountInfo () {
      return {
        role: {
          label: '角色',
          value: this.MEMBER_TYPES[this.currentMember.role]
        },
        password: {
          label: '密码',
          slot: true
        },
        phone: {
          label: '手机',
          value: this.currentMember.phone
        },
        email: {
          label: '邮箱',
          value: this.currentMember.email
        },
        lastAuthTime: {
          label: '最后登录',
          value: formatDate(this.currentMember.last_auth_time)
        },
        createTime: {
          label: '创建时间',
          value: formatDate(this.currentMember.create_time)
        }
      }
    }
  },

  watch: {
    currentMember () {
      this.init()
    }
  },
  route: {
    data () {
      this.getCorpInfo()
    }
  },

  ready () {
    this.init()
  },

  methods: {
    /**
     * 初始化: 获取成员角色
     * @return {void}
     */
    init () {
      this.role = {
        value: this.currentMember.role,
        label: this.MEMBER_TYPES[this.currentMember.role]
      }
    },

    /**
     * 编辑信息提交表单
     * @return {void}
     */
    onSubmitEditInfo () {
      if (this.currentMember.name !== this.editModel.name) {
        this.setMemberInfo()
        return
      }
      this.onEditInfoCancel()
    },

    /**
     * 更新用户信息
     * @return {void}
     */
    setMemberInfo () {
      this.editModel.is_notice = true
      this.editModel.is_alert = true
      this.editing = true
      api.corp.updateMember(this.currentMember.id, this.editModel).then((res) => {
        this.onEditInfoCancel()
        this.showNotice({
          type: 'success',
          content: '更新成功'
        })
        this.getMember()
      }).catch((res) => {
        this.onEditInfoCancel()
        this.handleError(res)
      })
    },

    /**
     * 获取成员信息
     * @return {void}
     */
    getMember () {
      api.corp.getMember(this.currentMember.id).then((res) => {
        this.setCurrentMember(res.data)
        window.localStorage.memberRole = res.data.role
      })
    },

    /**
     * 显示编辑浮层：初始化需要编辑的模型
     * @return {void}
     */
    showEditModal () {
      this.editModel.name = this.currentMember.name
      this.isShowEditModal = true
    },

    /**
     * 取消编辑个人信息：重置标志位
     * @return {void}
     */
    onEditInfoCancel () {
      this.editing = false
      this.isShowEditModal = false
    },

    /**
     * 获取企业信息
     * @author shengzhi
     */
    getCorpInfo () {
      this.loadingCorp = true
      api.corp.getCorpInfo().then((res) => {
        this.corp = res.data
        this.loadingCorp = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingCorp = false
      })
    },

    /**
     * 提交密码修改
     * @author shengzhi
     */
    onSubmitPwd () {
      // 防止二次提交
      if (this.editing) return

      // 验证不通过，手动触发验证
      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      // 密码修改
      this.editing = true
      api.corp.memberResetPwd(this.model).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: this.$t('ui.account.password_msg')
          })
        }
        this.onEditPwdCancel()
      }).catch((res) => {
        this.handleError(res)
        this.editing = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../account-info'
</style>
