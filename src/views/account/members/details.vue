<template>
  <div class="main">
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="account-info">
      <div class="details row">
        <div class="col-16">
          <h2>{{ member.name }}</h2>
          <div class="actions" v-if="currentMember.role === 1 && member.role === 2">
            <button class="btn btn-ghost" @click="toggleAccount"><i class="hl-red fa" :class="{'fa-ban': member.status === 1, 'fa-undo': member.status !== 1}"></i>{{ member.status === 1 ? '停用帐号' : '启用帐号'}}</button>
          </div>
          <div v-stretch="182">
            <info-list :info="accountInfo">
              <div slot="password">
                <a href="#" class="hl-red" @click.prevent="editPwd" v-if="currentMember.role === 1 && member.role === 2">修改密码</a>
                <span class="hl-gray" v-else>无权修改</span>
              </div>
            </info-list>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码浮层 start -->
    <modal :show.sync="isShowModal" width="400px">
      <h3 slot="header">{{ $t("ui.auth.reset") }}</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form novalidate @submit.prevent="onSubmitPwd">
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
              <button @click.prevent.stop="onEditPwdCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
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
import { formatDate } from 'src/filters'
import api from 'api'

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
    Breadcrumb
  },

  data () {
    return {
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
          value: this.locales.data.MEMBER_TYPES[this.member.role - 1]
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
      this.getMember(this.$route.params.id)
    }
  },

  methods: {
    /**
     * 获取用户信息
     * @author shengzhi
     * @param {String} id 用户 ID
     * @return {void}
     */
    getMember (id) {
      api.corp.getMember(id).then((res) => {
        if (res.status === 200) {
          this.member = res.data
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
