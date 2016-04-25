<template>
  <div class="panel">
    <div class="panel-hd with-actions">
      <search-box :key.sync="query" :auto="true" :active="searching" :placeholder="$t('member.search_palceholder')" @cancel="cancelSearching" @search-activate="toggleSearching" @search-deactivate="toggleSearching">
        <label>{{ $t('member.search_label') }}</label>
      </search-box>
      <h2>{{ $t('member.member_list') }}</h2>
      <button @click.prevent="showModal = true" class="btn btn-success ml20 mt10"><i class="fa fa-plus"></i>{{ $t('member.add_member') }}</button>
    </div>
    <div class="panel-bd">
      <div class="data-table">
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
              <th class="tac">{{ $t('common.action') }}</th>
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
                <td class="tac">
                  <button @click="deleteMember(member)" class="btn btn-link btn-mini">{{ $t('common.del') }}</button>
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
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import SearchBox from '../../components/SearchBox'
  import Modal from '../../components/Modal'
  import Select from '../../components/Select'
  import api from '../../api'
  import Pager from '../../components/Pager'
  import locales from '../../consts/locales/index'
  import { globalMixins } from '../../mixins'

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

    data () {
      return {
        query: '',
        searching: false,
        users: [],
        showModal: false,
        model: {},
        validation: {},
        members: [],
        newuseremail: {},
        currentPage: 1,
        pageCount: 10,
        addForm: [],
        centervalue: {},
        loadingData: false,
        memberTypes: locales[Vue.config.lang].member.types,
        statusTypes: locales[Vue.config.lang].member.status_types
      }
    },

    route: {
      data () {
        this.getMembers()
      }
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
        this.newuseremail.content = '测试邮箱内容' // 待改地方debug

        api.corp.memberInvite(this.newuseremail).then((res) => {
          if (res.status === 200) {
            this.getMembers()
          }
          this.showModal = false
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 删除企业成员
       * @param  {Object} member 待删除成员
       */
      deleteMember (member) {
        if (window.confirm(this.$t('member.del_msg'))) {
          api.corp.delMember(member.id).then((res) => {
            if (res.status === 200) {
              this.members.$remove(member)
            }
          }).catch((res) => {
            this.handleError(res)
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
