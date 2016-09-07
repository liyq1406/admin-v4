<template>
  <div class="main">
    <div class="panel mt20 mb30">
      <div class="panel-hd with-actions ml20 mr20">
        <div class="actions">
          <search-box :key.sync="query" :auto="true" :active="searching" :placeholder="$t('ui.member.search_palceholder')" @cancel="cancelSearching" @search-activate="toggleSearching" @search-deactivate="toggleSearching">
            <label>{{ $t('ui.member.search_label') }}</label>
          </search-box>
        </div>
        <h2>{{ $t('ui.member.member_list') }}</h2>
        <button class="btn btn-primary fl ml20" v-if="this.currentMember.role===1" @click.prevent="addMember"><i class="fa fa-plus"></i>添加成员</button>
      </div>
      <div class="panel-bd ml20 mr20">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th width="18%">{{ $t('ui.member.fields.name') }}</th>
                <th width="22%">{{ $t('ui.member.fields.email') }}</th>
                <th width="20%">{{ $t('ui.member.fields.phone') }}</th>
                <th width="10%">{{ $t('ui.member.fields.role') }}</th>
                <th width="10%" class="tac">{{ $t('common.status') }}</th>
                <th width="20%">最后一次登录</th>
                <!-- <th width="14%" class="tac" v-if ="this.currentMember.role === 1">{{ $t('common.action') }}</th> -->
              </tr>
            </thead>
            <tbody>
              <template v-if="filteredMembers.length > 0">
                <tr v-for="member in filteredMembers | limitBy countPerPage (currentPage-1)*countPerPage">
                  <td><a v-link="{path: member.id, append: true}" v-if="member.name.length" class="hl-red">{{ member.name }}</a><a v-link="{path: member.id, append: true}" v-else class="hl-gray">{{ $t('common.not_set') }}</a></td>
                  <td><span v-if="member.email.length">{{ member.email }}</span><span v-else class="hl-gray">{{ $t('common.not_set') }}</span></td>
                  <td><span v-if="member.phone.length">{{ member.phone }}</span><span v-else class="hl-gray">{{ $t('common.not_set') }}</span></td>
                  <td><span>{{ MEMBER_TYPES[member.role-1] }}</span></td>
                  <td class="tac"><span :class="{'hl-gray': member.status===0, 'hl-green': member.status===1, 'hl-red': member.status===2}">{{statusText(member.status)}}</span></td>
                  <td>{{ member.last_auth_time | formatDate}}</td>
                  <!-- <td class="tac" v-if ="this.currentMember.role === 1">
                    <a href="#" class="hl-red" @click.prevent="deleteMember(member)">{{ $t('common.del') }}</a><a href="#" class="hl-red ml10" @click.prevent="editPwd(member)" v-if="member.role === 2" >修改</a>
                  </td> -->
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
        <pager v-if="filteredMembers.length > countPerPage" :total="filteredMembers.length" :current.sync="currentPage" :count-per-page="countPerPage" :simple="true"></pager>
      </div>

      <!-- 新版添加成员 -->
      <modal :show.sync="showModal" @close="onAddCancel">
        <h3 slot="header">{{ $t('ui.member.add_member') }}</h3>
        <div slot="body" class="form">
          <validator name="validation">
            <form novalidate hook="addHook" @submit.prevent="onAddSubmit">
              <div class="form-row row">
                <label class="form-control col-6">{{ $t("ui.member.fields.email") }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.member.placeholders.email')" class="input-text-wrap">
                    <input v-model="addModel.email" type="email" name="addModel.email" v-validate:email="{required: true, format: 'email'}"  maxlength="32" required lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.email.touched && $validation.email.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.email')}) }}</span>
                    <span v-if="$validation.email.modified && $validation.email.format">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.email')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">手机号码:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.auth.fields.phone')" class="input-text-wrap">
                    <input type="text" v-model="addModel.phone" v-validate:phone="{required: true, format: 'phone'}" name="addModel.phone" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.phone.touched && $validation.phone.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.phone')}) }}</span>
                    <span v-if="$validation.phone.modified && $validation.phone.format">{{ $t('ui.validation.format', {field: $t('ui.auth.fields.phone')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">姓名:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.auth.fields.name')" class="input-text-wrap">
                    <input type="text" v-model="addModel.name" v-validate:name="{required: true, format: 'space'}" maxlength="10" name="name" class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.name')}) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.format">名字不能全为空格</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">{{ $t("ui.member.fields.role") }}:</label>
                <div class="controls col-18">
                  <div class="select">
                    <x-select :label="MEMBER_TYPES[addModel.type]">
                      <select v-model="addModel.type" name="addModel.type">
                        <option v-for="type in MEMBER_TYPES" :value="$index + 1" :selected="$index===0">{{ type }}</option>
                      </select>
                    </x-select>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">密码:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.auth.password')" class="input-text-wrap">
                    <input type="password" v-model="addModel.password" v-validate:password="{required: true, minlength: 8, maxlength: 16}" name="addModel.password" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.password.touched && $validation.password.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.password')}) }}</span>
                    <span v-if="$validation.password.modified && $validation.password.minlength">{{ $t('ui.validation.minlength', [$t('ui.auth.fields.password'), 8]) }}</span>
                    <span v-if="$validation.password.modified && $validation.password.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.auth.fields.password'), 16]) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">确认密码:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.auth.fields.confirm_password')" class="input-text-wrap">
                    <input type="password" v-model="confirmPassword" v-validate:confirm-password="{required: true, equal: addModel.password}"  name="confirmPassword" lazy class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.confirmPassword.touched && $validation.confirmPassword.required">{{ $t('ui.validation.required', {field: $t('ui.auth.fields.confirm_password')}) }}</span>
                    <span v-if="$validation.confirmPassword.modified && $validation.confirmPassword.equal">{{ $t('ui.validation.equal', [$t('ui.auth.fields.confirm_password'), $t('ui.auth.fields.password')]) }}</span>
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
import _ from 'lodash'
import store from 'store/index'
import SearchBox from 'components/SearchBox'
import Modal from 'components/Modal'
import Select from 'components/Select'
import api from 'api'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import { globalMixins } from 'src/mixins'
import { editPasswordMixin } from '../mixins'

export default {
  name: 'MemberSettings',

  mixins: [globalMixins, editPasswordMixin],

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
    statusText (status) {
      let result = ['未激活', '已启用', '已停用']
      return result[status]
    },
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
     * 添加成员表单钩子
     * @param {[type]} form [description]
     */
    addHook (form) {
      this.addForm = (form)
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
      if (this.$validation.valid) {
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
      } else {
        this.$validation.email.touched = true
      }
    }
  }
}
</script>
