<template>
  <div class="main">
    <div class="main-title">
      <h3>{{ $t('ui.user.list') }}</h3>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <!-- <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fr">
              <search-box :key.sync="query" :active="searching" @cancel="getUsers" :placeholder="$t('ui.user.fields.account')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getUsers">
                <button slot="search-button" @click="getUsers" class="btn btn-primary"><i class="fa fa-search"></i></button>
                <label>{{ $t('ui.user.search_user') }}</label>
              </search-box>
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
                  <td><a v-link="{path: '/operation/user/'+user.id}" class="hl-red">{{ user.id }}</a></td>
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
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getUsers"></pager> -->
        <c-table :headers="table.headers" :tables="table.tables" @theader-update-time="test" @tbody-update-time="test" :loading="false">
          <div class="filter-container" slot="filter-container">
            头部
          </div>
        </c-table>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchBox from 'components/SearchBox'
  import Modal from 'components/Modal'
  import Table from 'components/Table'
  import api from 'api'
  import * as config from 'consts/config'
  import Pager from 'components/Pager'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'UserList',

    mixins: [globalMixins],

    components: {
      'search-box': SearchBox,
      'c-table': Table,
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
        loadingData: false,
        table: {
          headers: [
            {
              key: 'id', // 与tables的key对应
              title: 'ID', // 标题的内容
              class: 'tac', // 传入className 自动加入整一列中
              sortType: -1
            },
            {
              key: 'creatTime',
              title: '创建时间',
              class: 'tac',
              tooltip: '提示'
            },
            {
              key: 'updateTime',
              title: '更新时间',
              sortType: 0,
              tooltip: '提示'
            },
            {
              key: 'creater',
              title: '创建者'
            }
          ],
          tables: [
            // {
            //   id: '<a href="">idididid</a>',
            //   creatTime: '123',
            //   updateTime: '更新时间',
            //   creater: '创建者1',
            //   operation: '操作'
            // },
            // {
            //   id: 'idididid',
            //   creatTime: '创建时间',
            //   updateTime: '更新时间',
            //   creater: '创建者2',
            //   operation: '操作'
            // }
          ]
        }
      }
    },

    route: {
      data () {
        // this.getUsers()
        this.getUsers1()
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
      test (a, b) {
        console.log(a)
        console.log(b)
      },
      /**
       * 获取假用户数据
       * @return {[type]} [description]
       */
      getUsers1 () {
        var users = [
          {
            id: '2786121657641',
            nickname: '盛志',
            account: '13585634347',
            create_date: '2014-06-24 16:22:37',
            source: 2,
            phone_valid: true
          },
          {
            id: '7861231657894',
            nickname: '黄工',
            account: '13085347634',
            create_date: '2015-12-11 16:22:12',
            source: 1,
            phone_valid: true
          },
          {
            id: '1657894786123',
            nickname: '黄妲',
            account: '13634085347',
            create_date: '2016-08-24 12:02:57',
            source: 3,
            phone_valid: true
          },
          {
            id: '6578978681434',
            nickname: '豆腐',
            account: '13534077642',
            create_date: '2015-02-24 12:32:37',
            source: 3,
            phone_valid: false
          },
          {
            id: '7861231657894',
            nickname: '黄工',
            account: '13085347634',
            create_date: '2015-12-11 16:22:12',
            source: 1,
            phone_valid: true
          },
          {
            id: '1657894786123',
            nickname: '小龙',
            account: '13634085347',
            create_date: '2016-08-24 12:02:57',
            source: 3,
            phone_valid: true
          },
          {
            id: '6578937861434',
            nickname: 'dms',
            account: '13534077648',
            create_date: '2015-02-24 12:32:37',
            source: 3,
            phone_valid: false
          },
          {
            id: '7861231657894',
            nickname: '美博',
            account: '13085347635',
            create_date: '2015-12-11 16:22:12',
            source: 1,
            phone_valid: true
          },
          {
            id: '1657894786123',
            nickname: 'exlink',
            account: '13634085347',
            create_date: '2016-08-24 12:02:57',
            source: 3,
            phone_valid: true
          },
          {
            id: '6578978614347',
            nickname: 'javelin',
            account: '13534077645',
            create_date: '2015-02-24 12:32:37',
            source: 3,
            phone_valid: true
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
