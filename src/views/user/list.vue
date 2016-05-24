<template>
  <div class="panel">
    <div class="panel-hd">
      <search-box :key.sync="query" :active="searching" @cancel="getUsers" :placeholder="$t('ui.user.fields.account')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getUsers">
        <button slot="search-button" @click="getUsers" class="btn btn-primary">{{ $t('common.search') }}</button>
        <label>{{ $t('ui.user.search_user') }}</label>
      </search-box>
      <h2>{{ $t('ui.user.list') }}</h2>
    </div>
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ $t('ui.user.fields.nick_name') }}</th>
              <th>{{ $t('ui.user.fields.account') }}</th>
              <th>{{ $t('ui.user.fields.create_date') }}</th>
              <th>{{ $t('ui.user.fields.source') }}</th>
              <th>{{ $t('common.status') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="users.length > 0">
              <tr v-for="user in users">
                <td><a v-link="{path: '/user/'+user.id}" class="hl-red">{{ user.id }}</a></td>
                <td>{{ user.nickname }}</td>
                <td>{{ user.account }}</td>
                <td>{{ user.create_date | formatDate }}</td>
                <td><span v-if="user.source===1">Web</span><span v-if="user.source===2">Android</span><span v-if="user.source===3">iOS</span><span v-if="user.source===4">{{ $('common.wechat') }}</span></td>
                <td><span>{{ user.phone_valid || user.email_valid ? $t('ui.user.status.activate') :  $t('ui.user.status.deactivate') }}</span></td>
              </tr>
            </template>
            <tr v-if="total === 0 && !loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :page-count="countPerPage" @page-update="getUsers"></pager>
    </div>
  </div>
</template>

<script>
  import SearchBox from '../../components/SearchBox'
  import Modal from '../../components/Modal'
  import api from '../../api'
  import * as config from '../../consts/config'
  import Pager from '../../components/Pager'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'UserList',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'search-box': SearchBox,
      'modal': Modal,
      'api': api,
      'pager': Pager
    },

    data () {
      return {
        query: '',
        searching: false,
        users: [],
        total: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        loadingData: false
      }
    },

    route: {
      data () {
        this.getUsers()
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: ['id', 'account', 'nickname', 'create_date', 'source', 'status', 'phone_valid', 'email_valid'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {'create_date': 'desc'},
          query: {}
        }

        if (this.query.length > 0) {
          condition.query['account'] = { $like: this.query }
        }

        return condition
      }
    },

    methods: {
      // 获取用户
      getUsers () {
        this.loadingData = true
        api.user.list(this.queryCondition).then((res) => {
          if (res.status === 200) {
            this.users = res.data.list
            this.total = res.data.count
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      // 搜索
      handleSearch () {
        if (this.query.length === 0) {
          this.getUsers()
        }
      },

      toggleSearching () {
        this.searching = !this.searching
      },

      cancelSearching () {
        this.query = ''
      }
    }
  }
</script>
