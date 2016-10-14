<template>
  <div class="main">
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="account-info">
      <div class="details row">
        <div class="col-16">
          <h2>{{ member.name }}</h2>
          <div class="actions" v-if="currentMember.role === 1 && member.role !== 1">
            <button class="btn btn-ghost" @click="toggleAccount"><i class="hl-red fa" :class="{'fa-ban': member.status === 1, 'fa-undo': member.status !== 1}"></i>{{ member.status === 1 ? '停用帐号' : '启用帐号'}}</button>
            <button class="btn btn-ghost" @click="delMember"><i class="hl-red fa fa-times"></i>删除成员</button>
          </div>
          <div v-stretch="182">
            <info-list :info="accountInfo">
              <div slot="role">
                {{MEMBER_TYPES[member.role]}}
                <a class="fa fa-edit" @click="onShowMemberRoleModal" v-if="member.role !== 1"></a>
              </div>
              <div slot="password">
                <a href="#" class="hl-red" @click.prevent="editPwd" v-if="currentMember.role === 1 && member.role != 1">修改密码</a>
                <span class="hl-gray" v-else>无权修改</span>
              </div>
            </info-list>
          </div>
        </div>
      </div>
    </div>

    <!-- 切换状态浮层   -->
    <modal :show.sync="showMemberRoleModal">
      <h3 slot="header">修改角色</h3>
      <div slot="body" class="form">
        <form autocomplete="off" novalidate @submit.prevent="onSubmitMemberRole">
          <div class="form-row row">
            <label class="form-control col-6">角色: </label>
            <div class="controls col-18">
              <x-select :label="role.label">
                <select v-model="role" @change="">
                  <option v-for="(key, type) in MEMBER_TYPES" :value="{label: type, value: key}">{{type}}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onSubmitMemberRoleCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 修改密码浮层 start -->
    <modal :show.sync="isShowModal" width="400px">
      <h3 slot="header">{{ $t("ui.auth.reset") }}</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmitPwd">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('ui.account.fields.new_password') }}</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="password" v-model="model.newpassword" name="model.newpassword" v-validate:newpassword="{required: true, minlength: 8, maxlength: 16}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.newpassword.touched && $validation.newpassword.required">{{ $t('ui.validation.required', {field: $t('ui.account.fields.new_password')}) }}</span>
                  <span v-if="$validation.newpassword.touched && $validation.newpassword.minlength">{{ $t('ui.validation.minlength', [$t('ui.account.fields.new_password'), 8]) }}</span>
                  <span v-if="$validation.newpassword.touched && $validation.newpassword.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.account.fields.new_password'), 16]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t('ui.auth.fields.confirm_password') }}</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="password" v-model="confirmPassword" name="confirmPassword" v-validate:confirm-password="{required: true, equal: model.newpassword}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.confirmPassword.touched && $validation.confirmPassword.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.confirm_password')}) }}</span>
                  <span v-if="$validation.confirmPassword.touched && $validation.confirmPassword.equal">{{ $t('ui.validation.equal', [$t('ui.auth.fields.confirm_password'), $t('ui.auth.fields.password')]) }}</span>
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
import Breadcrumb from 'components/Breadcrumb'
import store from 'store'
import formatDate from 'filters/format-date'
import Select from 'components/Select'
import api from 'api'
// import _ from 'lodash'

export default {
  name: 'MemberDetails',

  // editPasswordMixin提供编辑密码的逻辑
  mixins: [globalMixins, editPasswordMixin],

  store,

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  components: {
    InfoList,
    Modal,
    'x-select': Select,
    Breadcrumb
  },

  data () {
    return {
      role: {
        value: 0,
        label: ''
      },
      showMemberRoleModal: false,
      originModel: {
        newpassword: ''
      },
      member: {},
      breadcrumbNav: [{
        label: '成员列表',
        link: '/account/members'
      }, {
        label: '成员资料'
      }]
    }
  },

  computed: {
    accountInfo () {
      return {
        role: {
          label: '角色',
          slot: true
        },
        password: {
          label: '密码',
          slot: true
        },
        phone: {
          label: '手机',
          value: this.member.phone
        },
        email: {
          label: '邮箱',
          value: this.member.email
        },
        lastAuthTime: {
          label: '最后登录',
          value: formatDate(this.member.last_auth_time)
        },
        createTime: {
          label: '创建时间',
          value: formatDate(this.member.create_time)
        }
      }
    }
  },

  route: {
    data () {
      this.getMember()
    }
  },

  methods: {
    /**
     * 编辑成员角色表单提交
     * @return {[type]} [description]
     */
    onSubmitMemberRole () {
      let roleType = this.role.value
      let params = {
        // 'role_id': '自定义角色ID'
      }
      api.corp.setMemberRole(this.member.id, roleType, params).then((res) => {
        this.showNotice({
          type: 'success',
          content: '设置成功！'
        })
        this.getMember()
        this.onSubmitMemberRoleCancel()
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * 编辑成员按钮事件
     * @return {[type]} [description]
     */
    onShowMemberRoleModal () {
      this.showMemberRoleModal = true
    },
    /**
     * 编辑成员角色浮层取消事件
     * @return {[type]} [description]
     */
    onSubmitMemberRoleCancel () {
      this.showMemberRoleModal = false
    },
    /**
     * 获取用户信息
     * @author shengzhi
     * @param {String} id 用户 ID
     * @return {void}
     */
    getMember (id = this.$route.params.id) {
      api.corp.getMember(id).then((res) => {
        if (res.status === 200) {
          this.member = res.data
          this.role = {
            value: this.member.role,
            label: this.MEMBER_TYPES[this.member.role]
          }
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 切换成员状态
     * @param  {[type]} id =             this.member.id [description]
     * @return {[type]}    [description]
     */
    toggleAccount () {
      let id = this.member.id
      let type = ''
      let status = 0
      let text = ''
      if (this.member.status === 1) {
        type = 'disableMember'
        status = 2
        text = '停用成功！'
      } else if (this.member.status === 2) {
        type = 'enableMember'
        status = 1
        text = '启用成功！'
      } else {
        return
      }
      api.corp[type](id).then((res) => {
        this.member.status = status
        this.showNotice({
          type: 'success',
          content: text
        })
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * 删除成员
     * @return {[type]} [description]
     */
    delMember () {
      if (!window.confirm('确定删除？')) {
        return
      }
      api.corp.delMember(this.member.id).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '删除成功！'
          })
          this.$route.router.go('/account/members')
        } else {
          this.showNotice({
            type: 'error',
            content: '删除失败！'
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 提交密码修改
     * @author shengzhi
     */
    onSubmitPwd () {
      if (this.$validation.valid && !this.editing) {
        this.editing = true
        api.user.editMember(this.$route.params.id, this.model).then((res) => {
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
}
</script>

<style lang="stylus" scoped>
@import '../account-info'

.x-breadcrumb
  padding-left 50px
  margin-top 15px
  border none

  & + .account-info
    padding-top 10px
</style>
