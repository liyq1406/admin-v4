<template>
  <div class="main">
    <div class="main-title">
      <h2>成员管理</h2>
    </div>
    <div class="tool-bar">
      <div class="tool-list">
        <div class="tool-list-item">
          <div class="trigger" v-if="this.currentMember.role===1" @click.prevent="addMember"><i class="fa fa-plus"></i><span class="trigger-text">添加成员</span></div>
        </div>
      </div>
    </div>
    <div class="panel mt20">
      <div class="panel-hd with-actions">
        <h2>{{ $t('ui.member.member_list') }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fr">
              <search-box :key.sync="query" :auto="true" :active="searching" :placeholder="$t('ui.member.search_palceholder')" @cancel="cancelSearching" @search-activate="toggleSearching" @search-deactivate="toggleSearching">
                <!-- <label>{{ $t('ui.member.search_label') }}</label> -->
              </search-box>
            </div>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t('ui.member.fields.name') }}</th>
                <th>{{ $t('ui.member.fields.email') }}</th>
                <th>{{ $t('ui.member.fields.phone') }}</th>
                <th>{{ $t('ui.member.fields.role') }}</th>
                <!--th 最后一次登录-->
                <th class="tac">{{ $t('common.status') }}</th>
                <th class="tac" v-if ="this.currentMember.role === 1">{{ $t('common.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="filteredMembers.length > 0">
                <tr v-for="member in filteredMembers | limitBy countPerPage (currentPage-1)*countPerPage">
                  <td><span v-if="member.name.length">{{ member.name }}</span><span v-else class="hl-gray">{{ $t('common.not_set') }}</span></td>
                  <td><span v-if="member.email.length">{{ member.email }}</span><span v-else class="hl-gray">{{ $t('common.not_set') }}</span></td>
                  <td><span v-if="member.phone.length">{{ member.phone }}</span><span v-else class="hl-gray">{{ $t('common.not_set') }}</span></td>
                  <td><span>{{ memberTypes[member.role-1] }}</span></td>
                  <!--td 2015-6-3 15:38:53-->
                  <td class="tac"><span :class="{'hl-gray': member.status===0, 'hl-green': member.status===1, 'hl-red': member.status===2}">{{ statusTypes[member.status] }}</span></td>
                  <td class="tac" v-if ="this.currentMember.role === 1">
                    <button @click="deleteMember(member)" class="btn btn-link btn-mini">{{ $t('common.del') }}</button>
                    <button v-if="member.role === 2" @click="editPwd(member)" class="btn btn-link btn-mini">修改</button>
                  </td>
                </tr>
              </template>
              <tr v-if="filteredMembers.length === 0">
                <td colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="filteredMembers.length > countPerPage" :total="filteredMembers.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager>
      </div>

      <!-- 新版添加成员 -->
      <modal :show.sync="showModal" @close="onAddCancel">
        <h3 slot="header">{{ $t('ui.member.add_member') }}</h3>
        <div slot="body" class="form">
          <form v-form name="validation" hook="addHook">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.member.fields.email") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.member.placeholders.email')" class="input-text-wrap">
                  <input v-model="addModel.email" type="email" v-form-ctrl name="email" maxlength="32" required lazy class="input-text"/>
                </div>
                <div v-if="validation.email.$dirty" class="form-tips form-tips-error"><span v-if="validation.email.$error.required">{{ $t('ui.validation.required', {field: $t('ui.member.fields.email')}) }}</span><span v-if="validation.email.$error.email">{{ $t('ui.validation.format', {field: $t('ui.member.fields.email')}) }}</span></div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">手机号码:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.auth.fields.phone')" class="input-text-wrap">
                  <input type="text" v-model="addModel.phone" v-form-ctrl required :pattern="patterns.PHONE" name="phone" lazy class="input-text"/>
                </div>
                <div v-if="validation.phone.$dirty" class="form-tips form-tips-error"><span v-if="validation.phone.$error.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.phone')}) }}</span><span v-if="validation.phone.$error.pattern">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.phone')}) }}</span></div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">姓名:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.auth.fields.name')" class="input-text-wrap">
                  <input type="text" v-model="addModel.name" v-form-ctrl required name="name" lazy class="input-text"/>
                </div>
                <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.name')}) }}</span><span v-if="validation.name.$error.pattern">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.name')}) }}</span></div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.member.fields.role") }}:</label>
              <div class="controls col-18">
                <div class="select">
                  <x-select :label="memberTypes[addModel.type-1]">
                    <select v-model="addModel.type" v-form-ctrl name="role">
                      <option v-for="type in memberTypes" :value="$index + 1" :selected="$index===1">{{ type }}</option>
                    </select>
                  </x-select>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">密码:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.auth.password')" class="input-text-wrap">
                  <input type="password" v-model="addModel.password" v-form-ctrl required maxlength="16" minlength="8" name="password" lazy class="input-text"/>
                </div>
                <div v-if="validation.password.$dirty" class="form-tips form-tips-error"><span v-if="validation.password.$error.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.password')}) }}</span><span v-if="validation.password.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.auth.fields.password'), 8]) }}</span><span v-if="validation.password.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.auth.fields.password'), 16]) }}</span></div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">确认密码:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.auth.fields.confirm_password')" class="input-text-wrap">
                  <input type="password" v-model="confirmPassword" v-form-ctrl required custom-validator="checkEqualToPassword" name="confirmPassword" lazy class="input-text"/>
                </div>
                <div v-if="validation.confirmPassword.$dirty" class="form-tips form-tips-error"><span v-if="model.password && validation.confirmPassword.$error.required">{{ $t("ui.auth.confirm_password") }}</span><span v-if="validation.confirmPassword.$error.customValidator">{{ $t("ui.auth.confirm_password_tips") }}</span></div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit"  @click.prevent.stop="onAddSubmit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.add')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t('common.cancel') }}</button>
              <!-- <button type="submit" @click.prevent.stop="onAddSubmit" class="btn btn-primary">{{ $t('common.add') }}</button> -->
            </div>
          </form>
        </div>
      </modal>

      <!-- 编辑密码 -->
      <modal :show.sync="showEditPwdModal" width="320px" @close="onEditPwdCancel">
        <h3 slot="header">{{ $t("ui.auth.reset") }}</h3>
        <div slot="body" class="form">
          <form v-form name="pwdValidation" @submit.prevent="onSubmitPwd" hook="editPwdHook">
            <div class="form-row row">
              <div v-placeholder="$t('ui.account.placeholders.new_password')" class="input-text-wrap">
                <input type="password" v-model="editPwdModel.newpassword" v-form-ctrl required maxlength="16" minlength="8" name="newpassword" lazy class="input-text"/>
              </div>
              <div v-if="pwdValidation.$submitted && pwdValidation.newpassword.$pristine" class="form-tips form-tips-error"><span v-if="pwdValidation.newpassword.$error.required">{{ $t('ui.validation.required', {field: $t('ui.account.fields.new_password')}) }}</span></div>
              <div v-if="pwdValidation.newpassword.$dirty" class="form-tips form-tips-error"><span v-if="pwdValidation.newpassword.$error.required">{{ $t('ui.validation.required', {field: $t('ui.account.fields.new_password')}) }}</span><span v-if="pwdValidation.newpassword.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.account.fields.new_password'), 8]) }}</span><span v-if="pwdValidation.newpassword.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.account.fields.new_password'), 16]) }}</span></div>
            </div>
            <div class="form-row row">
              <div v-placeholder="$t('ui.auth.fields.confirm_password')" class="input-text-wrap">
                <input type="password" v-model="confirmPassword2" v-form-ctrl required custom-validator="checkEqualToPassword2" name="confirmPassword2" lazy class="input-text"/>
              </div>
              <div v-if="pwdValidation.$submitted && pwdValidation.confirmPassword2.$pristine" class="form-tips form-tips-error"><span v-if="pwdValidation.confirmPassword2.$error.required">{{ $t("ui.auth.confirm_password") }}</span></div>
              <div v-if="pwdValidation.confirmPassword2.$dirty" class="form-tips form-tips-error"><span v-if="editPwdModel.newpassword && pwdValidation.confirmPassword2.$error.required">{{ $t("ui.auth.confirm_password") }}</span><span v-if="pwdValidation.confirmPassword2.$error.customValidator">{{ $t("ui.auth.confirm_password_tips") }}</span></div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onEditPwdCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  // import Vue from 'vue'
  import store from 'store/index'
  import SearchBox from 'components/SearchBox'
  import Modal from 'components/Modal'
  import Select from 'components/Select'
  import api from 'api'
  import * as config from 'consts/config'
  import Pager from 'components/Pager'
  // import locales from 'consts/locales/index'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'MemberSettings',

    mixins: [globalMixins],

    components: {
      'search-box': SearchBox,
      'modal': Modal,
      'pager': Pager,
      'x-select': Select
    },
    // 状态管理
    store,

    vuex: {
      getters: {
        currentMember: ({ system }) => system.currentMember
      }
    },

    data () {
      return {
        query: '',
        searching: false,
        users: [],
        showModal: false,
        showEditPwdModal: false,
        model: {},
        validation: {},
        members: [],
        addModel: {
          email: '',
          phone: '',
          name: '',
          type: 2,
          password: ''
        },
        originAddModel: {},
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        centervalue: {},
        pwdValidation: {},
        confirmPassword: '',
        confirmPassword2: '',
        editing: false,
        adding: false,
        editPwdModel: {
          newpassword: ''
        },
        originEditPwdModel: {},
        loadingData: false,
        memberTypes: this.locales.data.MEMBER_TYPES,
        statusTypes: this.locales.data.MEMBER_STATUS_TYPES,
        currentEditMember: {}
      }
    },

    route: {
      data () {
        this.originAddModel = _.clone(this.addModel)
        this.originEditPwdModel = _.clone(this.editPwdModel)
        this.getMembers()
      }
    },

    computed: {
      filteredMembers () {
        if (this.query.length) {
          this.currentPage = 1
        }
        return this.members.filter((item) => {
          return item.name.indexOf(this.query) > -1 || item.email.indexOf(this.query) > -1 || item.phone.indexOf(this.query) > -1
        })
        // var filter = Vue.filter('filterBy')
        // if (this.query.length) {
        //   this.currentPage = 1
        // }
        // return filter(this.members, this.query, 'name')
      },

      queryCondition () {
        var condition = {
          offset: this.countPerPage * (this.currentPage - 1),
          limit: 1000
        }

        return condition
      }
    },

    methods: {
      /**
       * 获取企业成员
       */
      getMembers () {
        this.loadingData = true
        api.corp.getMembers(this.queryCondition).then((res) => {
          this.members = res.data.list
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      /**
       * 检查密码是否跟添加密码一致
       * @param  {String} value 密码
       */
      checkEqualToPassword (value) {
        return value === this.addModel.password
      },

      /**
       * 检查密码是否跟修改密码一致
       * @param  {String} value 密码
       */
      checkEqualToPassword2 (value) {
        return value === this.editPwdModel.newpassword
      },

      /**
       * 修改密码表单钩子
       */
      editPwdHook (form) {
        this.editPwdForm = form
      },

      /**
       * 添加成员表单钩子
       * @param {[type]} form [description]
       */
      addHook (form) {
        this.addForm = (form)
      },

      // 取消修改密码
      onEditPwdCancel () {
        this.resetEditPassword()
      },

      // 初始化编辑用户信息表单
      editPwd (member) {
        this.showEditPwdModal = true
        this.currentEditMember = member
        this.originEditPwdModel = _.clone(this.editPwdModel)
      },

      // 关闭编辑浮层并净化编辑表单
      resetEditPassword () {
        this.editing = false
        this.showEditPwdModal = false
        this.editPwdModel = _.clone(this.originEditPwdModel)
        this.confirmPassword2 = ''
        this.$nextTick(() => {
          this.editPwdForm.setPristine()
        })
      },

      // 提交密码修改
      onSubmitPwd () {
        if (this.pwdValidation.$valid && !this.editing) {
          this.editing = true
          api.user.editMember(this.currentEditMember.id, this.editPwdModel).then((res) => {
            if (res.status === 200) {
              this.showNotice({
                type: 'success',
                content: this.$t('ui.account.password_msg')
              })
            }
            this.resetEditPassword()
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },

      setQuery (query) {
        this.query = query
      },

      toggleSearching () {
        this.searching = !this.searching
      },

      cancelSearching () {
        this.setQuery('')
      },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.addModel = _.clone(this.originAddModel)
        this.showModal = false
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      addMember () {
        this.originAddModel = _.clone(this.addModel)
        this.confirmPassword = ''
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
        this.showModal = true
      },

      /**
       * 添加成员
       */
      onAddSubmit () {
        if (this.validation.$valid) {
          this.adding = true
          api.user.addMember(this.addModel).then((res) => {
            this.adding = false
            if (res.status === 200) {
              this.getMembers()
              this.resetAdd()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },

      /**
       * 删除企业成员
       * @param  {Object} member 待删除成员
       */
      deleteMember (member) {
        if (window.confirm(this.$t('ui.member.del_msg'))) {
          api.corp.delMember(member.id).then((res) => {
            if (res.status === 200) {
              this.members.$remove(member)
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .panel
    .panel-hd
      .title
        display inline
      .bottom_add
        margin-left 50px

</style>
