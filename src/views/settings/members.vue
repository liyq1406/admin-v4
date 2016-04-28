<template>
  <div class="panel">
    <div class="panel-hd with-actions">
      <search-box :key.sync="query" :auto="true" :active="searching" :placeholder="$t('member.search_palceholder')" @cancel="cancelSearching" @search-activate="toggleSearching" @search-deactivate="toggleSearching">
        <label>{{ $t('member.search_label') }}</label>
      </search-box>
      <h2>{{ $t('member.member_list') }}</h2>
      <button  v-if ="this.currentMember.role === 1" @click.prevent="showModal = true" class="btn btn-success ml20 mt10"><i class="fa fa-plus"></i>{{ $t('member.add_member') }}</button>
    </div>
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>{{ $t('member.fields.name') }}</th>
              <th>{{ $t('member.fields.phone') }}</th>
              <th>{{ $t('member.fields.email') }}</th>
              <th>{{ $t('member.fields.role') }}</th>
              <!--th 最后一次登录-->
              <th class="tac">{{ $t('common.status') }}</th>
              <th class="tac" v-if ="this.currentMember.role === 1">{{ $t('common.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="filteredMembers.length > 0">
              <tr v-for="member in filteredMembers | limitBy pageCount (currentPage-1)*pageCount">
                <td><span v-if="member.name.length">{{ member.name }}</span><span v-else class="hl-gray">{{ $t('common.not_set') }}</span></td>
                <td><span v-if="member.phone.length">{{ member.phone }}</span><span v-else class="hl-gray">{{ $t('common.not_set') }}</span></td>
                <td><span v-if="member.email.length">{{ member.email }}</span><span v-else class="hl-gray">{{ $t('common.not_set') }}</span></td>
                <td><span>{{ memberTypes[member.role-1] }}</span></td>
                <!--td 2015-6-3 15:38:53-->
                <td class="tac"><span :class="{'hl-gray': member.status===0, 'hl-green': member.status===1, 'hl-red': member.status===2}">{{ statusTypes[member.status] }}</span></td>
                <td class="tac" v-if ="this.currentMember.role === 1">
                  <button @click="deleteMember(member)" class="btn btn-link btn-mini">{{ $t('common.del') }}</button>
                  <button v-if="member.role === 2" @click="editPwd(member)" class="btn btn-link btn-mini">修改</button>
                </td>
              </tr>
            </template>
            <tr v-if="filteredMembers.length === 0 && !loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="filteredMembers.length > pageCount" :total="filteredMembers.length" :current.sync="currentPage" :page-count="pageCount"></pager>
    </div>

    <!-- 旧版添加成员 -->
    <!-- <modal :show.sync="showModal">
      <h3 slot="header">{{ $t('member.add_member') }}</h3>
      <div slot="body" class="form">
        <form v-form name="validation" hook="FormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("member.fields.email") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('member.placeholders.email')" class="input-text-wrap">
                <input v-model="newuseremail.email" type="email" v-form-ctrl name="email" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="validation.email.$dirty" class="form-tips form-tips-error"><span v-if="validation.email.$error.required">{{ $t('validation.required', {field: $t('member.fields.email')}) }}</span><span v-if="validation.email.$error.email">{{ $t('validation.format', {field: $t('member.fields.email')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("member.fields.role") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :label="memberTypes[newuseremail.role-1]">
                  <select v-model="newuseremail.role" v-form-ctrl name="role">
                    <option v-for="type in memberTypes" :value="$index + 1" :selected="$index===1">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="showModal = false" class="btn btn-default">{{ $t('common.cancel') }}</button>
            <button type="submit" @click.prevent.stop="adduser" class="btn btn-primary">{{ $t('common.add') }}</button>
          </div>
        </form>
      </div>
    </modal> -->
    <!-- 新版添加成员 -->
    <modal :show.sync="showModal">
      <h3 slot="header">{{ $t('member.add_member') }}</h3>
      <div slot="body" class="form">
        <form v-form name="validation" hook="FormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("member.fields.email") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('member.placeholders.email')" class="input-text-wrap">
                <input v-model="newuseremail.email" type="email" v-form-ctrl name="email" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="validation.email.$dirty" class="form-tips form-tips-error"><span v-if="validation.email.$error.required">{{ $t('validation.required', {field: $t('member.fields.email')}) }}</span><span v-if="validation.email.$error.email">{{ $t('validation.format', {field: $t('member.fields.email')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">手机号码:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('auth.fields.phone')" class="input-text-wrap">
                <input type="text" v-model="newuseremail.phone" v-form-ctrl required pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" name="phone" lazy class="input-text"/>
              </div>
              <div v-if="validation.phone.$dirty" class="form-tips form-tips-error"><span v-if="validation.phone.$error.required">{{ $t('validation.required', {field: $t('auth.fields.phone')}) }}</span><span v-if="validation.phone.$error.pattern">{{ $t('validation.format', {field: $t('auth.fields.phone')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">姓名:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('auth.fields.name')" class="input-text-wrap">
                <input type="text" v-model="newuseremail.name" v-form-ctrl required name="name" lazy class="input-text"/>
              </div>
              <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('validation.required', {field: $t('auth.fields.name')}) }}</span><span v-if="validation.name.$error.pattern">{{ $t('validation.format', {field: $t('auth.fields.name')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("member.fields.role") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :label="memberTypes[newuseremail.type-1]">
                  <select v-model="newuseremail.type" v-form-ctrl name="role">
                    <option v-for="type in memberTypes" :value="$index + 1" :selected="$index===1">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">密码:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('auth.password')" class="input-text-wrap">
                <input type="password" v-model="newuseremail.password" v-form-ctrl required maxlength="16" minlength="6" name="password" lazy class="input-text"/>
              </div>
              <div v-if="validation.password.$dirty" class="form-tips form-tips-error"><span v-if="validation.password.$error.required">{{ $t('validation.required', {field: $t('auth.fields.password')}) }}</span><span v-if="validation.password.$error.minlength">{{ $t('validation.minlength', [ $t('auth.fields.password'), 6]) }}</span><span v-if="validation.password.$error.maxlength">{{ $t('validation.maxlength', [ $t('auth.fields.password'), 16]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">确认密码:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
                <input type="password" v-model="confirmPassword" v-form-ctrl required custom-validator="checkEqualToPassword" name="confirmPassword" lazy class="input-text"/>
              </div>
              <div v-if="validation.confirmPassword.$dirty" class="form-tips form-tips-error"><span v-if="model.password && validation.confirmPassword.$error.required">{{ $t("auth.confirm_password") }}</span><span v-if="validation.confirmPassword.$error.customValidator">{{ $t("auth.confirm_password_tips") }}</span></div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="showModal = false" class="btn btn-default">{{ $t('common.cancel') }}</button>
            <button type="submit" @click.prevent.stop="adduser" class="btn btn-primary">{{ $t('common.add') }}</button>
          </div>
        </form>
      </div>
    </modal>

    <!-- 编辑密码 -->
    <modal :show.sync="showEditPwdModal" width="320px">
      <h3 slot="header">{{ $t("auth.reset") }}</h3>
      <div slot="body" class="form">
        <form v-form name="pwdValidation" @submit.prevent="onSubmitPwd" hook="editPwdHook">
          <div class="form-row row">
            <div v-placeholder="$t('account.placeholders.new_password')" class="input-text-wrap">
              <input type="password" v-model="editPwdModel.newpassword" v-form-ctrl required maxlength="16" minlength="6" name="newpassword" lazy class="input-text"/>
            </div>
            <div v-if="pwdValidation.$submitted && pwdValidation.newpassword.$pristine" class="form-tips form-tips-error"><span v-if="pwdValidation.newpassword.$error.required">{{ $t('validation.required', {field: $t('account.fields.new_password')}) }}</span></div>
            <div v-if="pwdValidation.newpassword.$dirty" class="form-tips form-tips-error"><span v-if="pwdValidation.newpassword.$error.required">{{ $t('validation.required', {field: $t('account.fields.new_password')}) }}</span><span v-if="pwdValidation.newpassword.$error.minlength">{{ $t('validation.minlength', [ $t('account.fields.new_password'), 6]) }}</span><span v-if="pwdValidation.newpassword.$error.maxlength">{{ $t('validation.maxlength', [ $t('account.fields.new_password'), 16]) }}</span></div>
          </div>
          <div class="form-row row">
            <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
              <input type="password" v-model="confirmPassword" v-form-ctrl required custom-validator="checkEqualToPassword2" name="confirmPassword" lazy class="input-text"/>
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
  import _ from 'lodash'
  import Vue from 'vue'
  import store from '../../store/index'
  import SearchBox from '../../components/SearchBox'
  import Modal from '../../components/Modal'
  import Select from '../../components/Select'
  import api from '../../api'
  import Pager from '../../components/Pager'
  import locales from '../../consts/locales/index'
  import { globalMixins } from '../../mixins'
  import { getCurrentMember } from '../../store/actions/system'

  export default {
    name: 'MemberSettings',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'search-box': SearchBox,
      'modal': Modal,
      'pager': Pager,
      'v-select': Select
    },
    // 状态管理
    store,

    vuex: {
      getters: {
        currentMember: ({ system }) => system.currentMember
      },
      actions: {
        getCurrentMember
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
        newuseremail: {},
        currentPage: 1,
        pageCount: 10,
        addForm: [],
        centervalue: {},
        pwdValidation: {},
        confirmPassword: '',
        editing: false,
        editPwdModel: {
          newpassword: ''
        },
        originEditPwdModel: {},
        loadingData: false,
        memberTypes: locales[Vue.config.lang].member.types,
        statusTypes: locales[Vue.config.lang].member.status_types,
        currentEditMember: {}
      }
    },

    route: {
      data () {
        this.getMembers()
      }
    },
    ready () {
      this.getCurrentMember(window.localStorage.getItem('memberId'), this)
    },

    computed: {
      filteredMembers () {
        var filter = Vue.filter('filterBy')
        return filter(this.members, this.query, 'name')
      }
    },

    watch: {
      showModal () { // 是否有弹出的编辑框
        for (var i = 0; i < this.addForm.length; i++) {
          this.addForm[i].setPristine()
          this.addForm[i].setValidity()
        }
        if (!this.showModal) { // 当编辑框关掉的时候
          setTimeout(() => {
            this.newuseremail.email = undefined
          }, 100)
        }
      }
    },

    methods: {
      getMembers () {
        this.loadingData = true
        api.corp.getMembers().then((res) => {
          this.members = res.data.list
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      checkEqualToPassword (value) {
        return value === this.newuseremail.password
      },
      checkEqualToPassword2 (value) {
        return value === this.editPwdModel.newpassword
      },
      // 修改密码表单钩子
      editPwdHook (form) {
        this.editPwdForm = form
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
        this.confirmPassword = ''
        this.$nextTick(() => {
          this.editPwdForm.setPristine()
        })
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

      /**
       * 添加成员
       */
      adduser () {
        // this.newuseremail.content = '测试邮箱内容' // 待改地方debug

        // api.corp.memberInvite(this.newuseremail).then((res) => {
        //   if (res.status === 200) {
        //     this.getMembers()
        //   }
        //   this.showModal = false
        // }).catch((res) => {
        //   this.handleError(res)
        // })
        if (this.validation.$valid) {
          api.user.addMember(this.newuseremail).then((res) => {
            if (res.status === 200) {
              this.getMembers()
            }
            this.showModal = false
          }).catch((res) => {
            this.handleError(res)
          })
        }
      },

      /**
       * 删除企业成员
       * @param  {Object} member 待删除成员
       */
      deleteMember (member) {
        if (window.confirm(this.$t('member.del_msg'))) {
          api.corp.delMember(this.currentEditMember.id, member.id).then((res) => {
            if (res.status === 200) {
              this.members.$remove(member)
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      },
      // 提交密码修改
      onSubmitPwd () {
        if (this.pwdValidation.$valid && !this.editing) {
          this.editing = true
          api.user.editMember(this.currentEditMember.id, this.editPwdModel).then((res) => {
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
      },
      // 表单钩子
      FormHook (form) {
        this.addForm.push(form)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'

  .panel
    .panel-hd
      .title
        display inline
      .bottom_add
        margin-left 50px

</style>
