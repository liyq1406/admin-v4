<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('ui.user.list') }}</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <v-select label="全部" width='110px' size="small">
                  <span slot="label">显示</span>
                </v-select>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <div class="fr">
                  <a class="fa fa- fa-share-square-o"></a>
                </div>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="getUsers" :placeholder="$t('ui.user.fields.account')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getUsers">
                  <button slot="search-button" @click="getUsers" class="btn btn-primary"><i class="fa fa-search"></i></button>
                  <label>{{ $t('ui.user.search_user') }}</label>
                </search-box>
              </div>
            </div>
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
                  <td><a v-link="{path: '/operation/users/'+user.id + '/device'}" class="hl-red">{{ user.id }}</a></td>
                  <td>{{ user.nickname }}</td>
                  <td>{{ user.account }}</td>
                  <td>{{ user.create_date | formatDate }}</td>
                  <td><span v-if="user.source===1">Web</span><span v-if="user.source===2">Android</span><span v-if="user.source===3">iOS</span><span v-if="user.source===4">{{ $('common.wechat') }}</span></td>
                  <td><span>{{ user.phone_valid || user.email_valid ? $t('ui.user.status.activate') :  $t('ui.user.status.deactivate') }}</span></td>
                </tr>
              </template>
              <tr v-if="total === 0 && !loadingData">
                <td colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getUsers"></pager>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchBox from 'components/SearchBox'
  import Modal from 'components/Modal'
  import Select from 'components/Select'
  import api from 'api'
  import * as config from 'consts/config'
  import Pager from 'components/Pager'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'UserList',

    mixins: [globalMixins],

    components: {
      'search-box': SearchBox,
      'modal': Modal,
      'api': api,
      'pager': Pager,
      'v-select': Select
    },

    data () {
      return {
        query: '',
        searching: false,
        users: [],
        total: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        loadingData: false,
        headers: [
          {
            key: 'nickname', // 与tables的key对应
            title: '昵称' // 标题的内容
          },
          {
            key: 'account',
            title: '帐号'
          },
          {
            key: 'create_date',
            title: '创建时间',
            tooltip: '提示内容'
          },
          {
            key: 'from',
            class: 'tac',
            title: '来源'
          },
          {
            key: 'state',
            title: '状态',
            class: 'tac',
            sortType: '-1'
          },
          {
            key: 'expand',
            title: '拓展',
            class: 'tac',
            pointer: true
          }
        ]
      }
    },

    computed: {
      /**
       * 传入智能表格的分页对象
       * @return {[type]} [description]
       */
      page () {
        var result = {
          total: this.total,
          currentPage: this.currentPage,
          countPerPage: this.countPerPage
        }
        return result
      },
      // 传入智能表格的数据对象
      tables () {
        var result = []
        this.users.map((user) => {
          var table = {}
          for (let key in user) {
            if (user.hasOwnProperty(key)) {
              table[key] = user[key]
            }
          }
          table.nickname = '<a style="color: #c0252e">' + user.nickname + '</a>'
          result.push(table)
        })
        return result
      },
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

    route: {
      data () {
        // this.getUsers()
        this.getUsers1()
      }
    },

    methods: {
      test (a, b) {
        console.log(a)
        console.log(b)
      },
      goDetails (header, table, index) {
        this.$route.router.go('/operation/users/' + table.id)
      },
      /**
       * 获取假用户数据
       * @return {[type]} [description]
       */
      getUsers1 () {
        var users = [
          {
            id: 'asdjlkahf',
            nickname: 'idididid',
            account: '1155028391',
            create_date: '2016-1-1 19:21:32',
            from: 'iOS',
            state: '下线',
            expand: '暂未定义'
          },
          {
            id: '1634a56sd45',
            nickname: '<a style="color: #c0252e">idididid</a>',
            account: '1155028391',
            create_date: '2016-1-1 19:21:32',
            from: 'iOS',
            state: '下线',
            expand: '暂未定义'
          }
        ]
        this.users = users
        this.total = 3000
      },
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
