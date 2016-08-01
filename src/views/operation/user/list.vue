<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('ui.user.list') }}</h2>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <v-select label="全部" width='110px' size="small">
                  <span slot="label">显示</span>
                </v-select>
              </div>
            </div>
            <div class="filter-group fr">
              <!-- <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa- fa-share-square-o"></i></button>
              </div> -->
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="getUsers" :placeholder="$t('ui.user.fields.account')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getUsers">
                  <button slot="search-button" @click="getUsers" class="btn btn-primary"><i class="fa fa-search"></i></button>
                  <label>{{ $t('ui.user.search_user') }}</label>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-status="sortBysomeKey" @tbody-nickname="goDetails" @page-count-update="pageCountUpdate" @current-page-change="currentPageChange"></x-table>
        </div>
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
  import Table from 'components/Table'
  import { formatDate } from 'src/filters'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'UserList',

    mixins: [globalMixins],

    components: {
      'search-box': SearchBox,
      'modal': Modal,
      'api': api,
      'v-select': Select,
      'x-table': Table
    },

    data () {
      return {
        query: '',
        searching: false,
        total: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        loadingData: false,
        sortByStatus: false,
        users: [],
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
            title: '创建时间'
            // tooltip: '提示内容'
          },
          {
            key: 'source',
            class: 'tac',
            title: '来源'
          },
          {
            key: 'status',
            title: '状态',
            class: 'tac',
            sortType: '-1'
          },
          {
            key: 'expand',
            title: '拓展',
            class: 'tac'
          }
        ]
      }
    },

    computed: {
      /**
       * 传入智能表格的分页对象
       * 国辉
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
      /**
       * 传入智能表格的数据对象
       * 国辉
       * @return {[type]} [description]
       */
      tables () {
        var result = []
        this.users.map((user) => {
          var table = {
            nickname: '<a style="color: #c0252e">' + user.nickname + '</a>',
            account: user.account,
            create_date: formatDate(user.create_date),
            source: this.computedSource(user.source),
            status: this.computedStatus(user.status),
            expand: '暂未定义',
            prototype: user
          }
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

        this.headers.map((item) => {
          if (item.sortType) {
            condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
          }
        })

        return condition
      }
    },

    route: {
      data () {
        this.getUsers()
        // this.getUsers1()
      }
    },

    methods: {
      /**
       * 当前页码改变
       * 国辉
       * @param  {[type]} number [description]
       * @return {[type]}        [description]
       */
      currentPageChange (number) {
        this.currentPage = number
        this.getUsers()
      },
      /**
       * 每页显示的数量改变
       * 国辉
       * @param  {[type]} count 每页显示数量
       * @return {[type]}       [description]
       */
      pageCountUpdate (count) {
        this.countPerPage = count
        this.getUsers()
      },
      /**
       * 按某个属性排序
       * 国辉
       * @param  {[type]} table [description]
       * @return {[type]}       [description]
       */
      sortBysomeKey (header, index) {
        if (header.sortType === 1) {
          header.sortType = -1
        } else {
          header.sortType = 1
        }
        this.headers.$set(index, header)
        this.getUsers()
      },
      /**
       * 解析当前的用户来源
       * 国辉
       * @param  {[type]} source [description]
       * @return {[type]}        [description]
       */
      computedSource (source) {
        var result = {
          '1': 'Web',
          '2': 'Android',
          '3': 'IOS',
          '4': '微信'
        }
        return result[source]
      },
      /**
       * 解析用户状态
       * 国辉
       * @param  {[type]} status [description]
       * @return {[type]}        [description]
       */
      computedStatus (status) {
        var result = {
          '1': '正常',
          '2': '停用'
        }
        return result[status]
      },
      /**
       * 进入详情页
       * 国辉
       * @param  {[type]} table [description]
       * @return {[type]}       [description]
       */
      goDetails (table) {
        this.$route.router.go('/operation/users/details/' + table.prototype.id)
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
            source: 'iOS',
            status: '下线',
            expand: '暂未定义'
          },
          {
            id: '1634a56sd45',
            nickname: '<a style="color: #c0252e">idididid</a>',
            account: '1155028391',
            create_date: '2016-1-1 19:21:32',
            source: 'iOS',
            status: '下线',
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
