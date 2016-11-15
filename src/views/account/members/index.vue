<template>
  <div class="main">
    <div class="panel mt20 mb30">
      <div class="panel-bd ml20 mr20">
        <div class="action-bar">
          <a class="btn btn-primary fl" v-if="this.currentMember.role===1" @click.prevent="addMember"><i class="fa fa-plus"></i>{{ $t('account.members.add_member') }}</a>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('common.placeholder.search')" @cancel="getMembers(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getMembers(true)">
                  <x-select width="130px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="getMembers(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <h3>{{ $t('account.members.member_list') }}</h3>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th width="18%">{{ $t('account.members.fields.name') }}</th>
                <th width="22%">{{ $t('account.members.fields.email') }}</th>
                <th width="20%">{{ $t('account.members.fields.phone') }}</th>
                <th width="10%">{{ $t('account.members.fields.role') }}</th>
                <th width="10%" class="tac">{{ $t('common.status') }}</th>
                <th width="20%">{{ $t('account.members.last_login') }}</th>
                <!-- <th width="14%" class="tac" v-if ="this.currentMember.role === 1">{{ $t('common.action') }}</th> -->
              </tr>
            </thead>
            <tbody>
              <template v-if="members.length > 0">
                <tr v-for="member in members">
                  <td>
                    <a v-link="{path: member.id, append: true}" v-if="member.name && member.name.length" class="hl-red">{{ member.name }}</a>
                    <a v-link="{path: member.id, append: true}" v-else class="hl-gray">{{ $t('common.not_set') }}</a>
                  </td>
                  <td>{{ member.email || '-' }}</td>
                  <td>{{ member.phone || '-' }}</td>
                  <td><span>{{ locales.data.MEMBER_TYPES[member.role] }}</span></td>
                  <td class="tac"><span :class="{'hl-gray': member.status===0, 'hl-green': member.status===1, 'hl-red': member.status===2}">{{ statusText(member.status) }}</span></td>
                  <td>{{ member.last_auth_time | formatDate }}</td>
                  <!-- <td class="tac" v-if ="this.currentMember.role === 1">
                    <a href="#" class="hl-red" @click.prevent="deleteMember(member)">{{ $t('common.del') }}</a><a href="#" class="hl-red ml10" @click.prevent="editPwd(member)" v-if="member.role === 2" >修改</a>
                  </td> -->
                </tr>
              </template>
              <tr v-if="members.length === 0">
                <td colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination v-if="total > 0" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @count-update="getMembers(false)" @page-update="getMembers(false)" :simple="true"></pagination>
      </div>

      <!-- 添加成员 -->
      <modal :show.sync="showModal" @close="onAddCancel">
        <h3 slot="header">{{ $t('account.members.add_member') }}</h3>
        <div slot="body" class="form">
          <validator name="validation">
            <form autocomplete="off" novalidate hook="addHook" @submit.prevent="onAddSubmit">
              <div class="form-row row">
                <label class="form-control col-6">{{ $t("account.members.fields.email") }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('account.members.placeholders.email')" class="input-text-wrap">
                    <input v-model="addModel.email" type="email" name="addModel.email" v-validate:email="{required: true, format: 'email'}"  maxlength="32" required lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.email.touched && $validation.email.required">{{ $t('common.validation.required', {field: $t('auth.fields.email')}) }}</span>
                    <span v-if="$validation.email.modified && $validation.email.format">{{ $t('common.validation.format', {field: $t('auth.fields.email')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">{{ $t('account.members.phone_number') }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('auth.fields.phone')" class="input-text-wrap">
                    <input type="text" v-model="addModel.phone" v-validate:phone="{required: true, format: 'phone'}" name="addModel.phone" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.phone.touched && $validation.phone.required">{{ $t('common.validation.required', {field: $t('auth.fields.phone')}) }}</span>
                    <span v-if="$validation.phone.modified && $validation.phone.format">{{ $t('common.validation.format', {field: $t('auth.fields.phone')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">{{ $t('account.members.name') }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('auth.fields.name')" class="input-text-wrap">
                    <input type="text" v-model="addModel.name" v-validate:name="{required: true, format: 'trim'}" maxlength="10" name="addModel.name" class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: $t('auth.fields.name')}) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.format">{{ $t('account.members.name_no_space') }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">{{ $t("account.members.fields.role") }}:</label>
                <div class="controls col-18">
                  <div class="select">
                    <x-select :label="locales.data.MEMBER_TYPES[addModel.type]">
                      <select v-model="addModel.type" name="addModel.type">
                        <option v-for="type in locales.data.MEMBER_TYPES" :value="$index + 1" :selected="$index===0">{{ type }}</option>
                      </select>
                    </x-select>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">{{ $t('account.members.password') }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('auth.password')" class="input-text-wrap">
                    <input type="password" v-model="addModel.password" v-validate:password="{required: true, minlength: 8, maxlength: 16}" name="addModel.password" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.password.touched && $validation.password.required">{{ $t('common.validation.required', {field: $t('auth.fields.password')}) }}</span>
                    <span v-if="$validation.password.modified && $validation.password.minlength">{{ $t('common.validation.minlength', [$t('auth.fields.password'), 8]) }}</span>
                    <span v-if="$validation.password.modified && $validation.password.maxlength">{{ $t('common.validation.maxlength', [$t('auth.fields.password'), 16]) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">{{ $t('account.members.comfirm_password') }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('auth.fields.confirm_password')" class="input-text-wrap">
                    <input type="password" v-model="confirmPassword" v-validate:confirm-password="{required: true, equal: addModel.password}"  name="confirmPassword" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.confirmPassword.touched && $validation.confirmPassword.required">{{ $t('common.validation.required', {field: $t('auth.fields.confirm_password')}) }}</span>
                    <span v-if="$validation.confirmPassword.modified && $validation.confirmPassword.equal">{{ $t('common.validation.equal', [$t('auth.fields.confirm_password'), $t('auth.fields.password')]) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <!-- <button type="submit" @click.prevent.stop="onAddSubmit" class="btn btn-primary">{{ $t('common.add') }}</button> -->
                <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.add')" class="btn btn-primary"></button>
                <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t('common.cancel') }}</button>
              </div>
            </form>
          </validator>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
import api from 'api'
import * as config from 'consts/config'
import { globalMixins } from 'src/mixins'
import { editPasswordMixin } from '../mixins'

export default {
  name: 'MemberSettings',

  mixins: [globalMixins, editPasswordMixin],

  components: {
  },

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  data () {
    return {
      total: 0,
      query: '',
      searching: false,
      users: [],
      showModal: false,
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
      queryTypeOptions: [
        { label: this.$t('account.members.name'), value: 'name' },
        { label: this.$t('account.members.phone'), value: 'phone' },
        { label: this.$t('account.members.email'), value: 'email' }
      ],
      queryType: {
        label: this.$t('account.members.name'),
        value: 'name'
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
    // filteredMembers () {
    //   if (this.query.length) {
    //     this.currentPage = 1
    //   }
    //   return this.members.filter((item) => {
    //     return item.name.indexOf(this.query) > -1 || item.email.indexOf(this.query) > -1 || item.phone.indexOf(this.query) > -1
    //   })
    // },

    queryCondition () {
      var condition = {
        filter: ['id', 'name', 'role', 'phone', 'email', 'create_time', 'last_auth_time', 'is_notice', 'is_alert', 'status', 'role_id'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {}
      }
      if (this.query.length > 0) {
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }
      return condition
    }
  },

  methods: {
    statusText (status) {
      let result = [this.$t('account.members.not_action'), this.$t('account.members.enabled'), this.$t('account.members.not_enabled')]
      return result[status]
    },
    /**
     * 获取企业成员
     */
    getMembers (reset) {
      this.loadingData = true
      if (reset) {
        this.currentPage = 1
      }
      api.corp.getMembers(this.queryCondition).then((res) => {
        console.log(res.data)
        this.members = res.data.list
        this.total = res.data.count
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 添加成员表单钩子
     * @param {[type]} form [description]
     */
    addHook (form) {
      this.addForm = (form)
    },

    setQuery (query) {
      this.query = query
    },

    handleSearch () {
      if (this.query.length === 0) {
        this.getMembers()
      }
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
      this.$resetValidation()
    },

    // 取消添加
    onAddCancel () {
      this.resetAdd()
    },

    addMember () {
      this.originAddModel = _.clone(this.addModel)
      this.confirmPassword = ''
      this.$resetValidation()
      this.showModal = true
    },

    /**
     * 添加成员
     */
    onAddSubmit () {
      if (this.adding) return
      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }
      this.adding = true
      this.addModel.name = this.addModel.name.trim()
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
  }
}
</script>
<style lang="stylus" scoped>
  .action-bar
    padding-top 0
  .search-box-input
    width 144px
    overflow hidden
</style>
