<template>
  <div class="main">

    <div class="main-title">
      <h2>{{ $t('operation.user.list.main_title') }}</h2>
    </div>
    <!-- <pre> {{ usersOnlineType | json}} </pre> -->
    <!-- Start: 产品信息统计 -->
    <div class="row statistic-group mb20">
      <div class="col-6" v-for="statistic in statisticArr">
        <statistic :total="statistic.value" :title="statistic.title" align="left"></statistic>
      </div>
    </div>
    <!-- End: 产品信息统计 -->

    <div class="panel">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <x-select :label="selectedFilter.name" width='110px' size="small">
                  <span slot="label">{{ $t('common.display') }}</span>
                  <select v-model="selectedFilter" @change="getUsers(true)">
                    <!-- <option :value="">全部</option> -->
                    <option v-for="filter in filters" :value="filter">{{filter.name}}</option>
                  </select>
                </x-select>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="getUsers(true)" :placeholder="$t('common.placeholder.search')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getUsers(true)">
                  <x-select width="100px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="getUsers(true)" class="btn"><i class="fa fa-search"></i></button>
                  <!-- <label>{{ $t('ui.user.search_user') }}</label> -->
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-create-date="sortBySomeKey" @tbody-id="goDetails" @page-count-update="pageCountUpdate" @current-page-change="currentPageChange"></x-table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import SearchBox from 'components/SearchBox'
  import Select from 'components/Select'
  import api from 'api'
  import * as config from 'consts/config'
  import Table from 'components/Table'
  import formatDate from 'filters/format-date'
  import { globalMixins } from 'src/mixins'
  import Statistic from 'components/Statistic2'
  import {createDayRange} from 'utils'

  export default {
    name: 'UserList',

    mixins: [globalMixins],

    components: {
      'search-box': SearchBox,
      'api': api,
      'x-select': Select,
      'x-table': Table,
      Statistic
    },

    data () {
      return {
        exporting: false,
        allTotal: 0,
        // 是否缓存用户在线状态
        cacheOnlineType: false,
        query: '',
        searching: false,
        total: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        loadingData: false,
        users: [],
        queryTypeOptions: [
          { label: this.$t('common.email'), value: 'email' },
          { label: this.$t('common.phone'), value: 'phone' }
        ],
        queryType: {
          label: this.$t('common.email'),
          value: 'email'
        },
        filters: [
          {
            name: this.$t('common.all'),
            value: 0
          },
          {
            name: this.$t('operation.user.list.activated'),
            value: 1
          },
          {
            name: this.$t('operation.user.list.not_activated'),
            value: 2
          },
          {
            name: this.$t('operation.user.list.online'),
            value: 3
          }
        ],
        /**
         * 当前筛选条件
         * @type {Object}
         */
        selectedFilter: {
          name: this.$t('common.all'),
          value: 0
        },
        // 今日新增
        todayAddCount: 0,
        // 当前在线
        onlineCount: 0,
        // 7日活跃数
        serverDayActiveCount: 0,
        headers: [
          {
            key: 'id', // 与tables的key对应
            title: 'ID' // 标题的内容
          },
          {
            key: 'nickname', // 与tables的key对应
            title: this.$t('operation.user.list.columns.nickname') // 标题的内容
          },
          {
            key: 'email',
            title: this.$t('common.email')
          },
          {
            key: 'phone',
            title: this.$t('common.phone')
          },
          {
            key: 'create_date',
            title: this.$t('operation.user.list.columns.create_date'), // 标题的内容
            sortType: -1
            // tooltip: '提示内容'
          },
          {
            key: 'source',
            title: this.$t('operation.user.list.columns.source'), // 标题的内容
            class: 'tac'
          },
          {
            key: 'is_active',
            title: this.$t('operation.user.list.columns.is_active'), // 标题的内容
            class: 'tac'
          },
          {
            key: 'online',
            title: this.$t('operation.user.list.columns.online'), // 标题的内容
            class: 'tac'
          }
        ],
        // 存放各个用户的在线状态 key是用户id
        usersOnlineType: [
          {
            id: '',
            online: false
          }
        ]
      }
    },

    computed: {
      /**
       * 状态
       * @return {[type]} [description]
       */
      statisticArr () {
        var result = [
          {
            title: this.$t('operation.user.list.total'),
            value: this.allTotal
          },
          {
            title: this.$t('operation.user.list.add_count'),
            value: this.todayAddCount
          },
          {
            title: this.$t('operation.user.list.online_count'),
            value: this.onlineCount
          },
          {
            title: this.$t('operation.user.list.active_count'),
            value: this.serverDayActiveCount
          }
        ]
        return result
      },
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
          user.is_active = user.phone_valid || user.email_valid
          var table = {
            id: '<a style="color: #c0252e">' + user.id + '</a>',
            nickname: user.nickname || '-',
            email: user.email || '-',
            phone: user.phone || '-',
            create_date: formatDate(user.create_date),
            source: this.computedSource(user.source),
            is_active: user.is_active ? this.$t('operation.user.list.activated') : this.$t('operation.user.list.not_activated'),
            online: user.is_online === true ? this.$t('operation.user.list.online') : this.$t('operation.user.list.offline'),
            status: this.computedStatus(user.status),
            prototype: user
          }
          result.push(table)
        })
        return result
      },

      // 基本筛选条件
      baseCondition () {
        var condition = {
          filter: ['id', 'account', 'nickname', 'email', 'phone', 'phone/email', 'create_date', 'source', 'status', 'phone_valid', 'email_valid', 'is_online'],
          order: {
            create_time: 'desc'
          },
          query: {}
        }

        if (this.query.length > 0) {
          // condition.query['id'] = { $in: [this.query] }
          condition.query[this.queryType.value] = {
            '$like': this.query
          }
        }

        if (this.selectedFilter.value) {
          switch (this.selectedFilter.value) {
            case 1: // 已激活 查询手机不是未验证并且邮箱不是未验证
              condition.query['phone_valid'] = { $nin: [false] }
              condition.query['email_valid'] = { $nin: [false] }
              // condition.query['status'] = { $in: [1] }
              break
            case 2: // 未激活 查询手机未验证并且邮箱未验证
              condition.query['phone_valid'] = { $in: [false] }
              condition.query['email_valid'] = { $in: [false] }
              // condition.query['status'] = { $in: [2] }
              break
            case 3: // 在线
              condition.query['is_online'] = {$in: [true]}
              break
            default:
              break
          }
        }

        this.headers.map((item) => {
          if (item.sortType) {
            condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
          }
        })

        return condition
      },

      // 列表查询条件
      queryCondition () {
        let condition = _.cloneDeep(this.baseCondition)

        condition.limit = this.countPerPage
        condition.offset = (this.currentPage - 1) * this.countPerPage

        return condition
      }
    },

    route: {
      data () {
        // 获取用户列表
        this.getUsers()
        // 获取今日新增用户数
        this.getTodayAddCount()
        // 获取当前在线数
        this.getOnlineCount()
        // // 获取7日新增数
        this.getServerDayActiveCount()
        // // this.getUsers1()
      }
    },

    methods: {
      /**
       * 处理导出 CSV 按钮点击
       */
      onExportBtnClick () {
        if (this.exporting) {
          return
        }

        let postData = {
          name: '用户列表',
          describe: '用户列表',
          type: 2,
          params: this.baseCondition
        }

        this.exporting = true
        api.exportTask.createTask(postData).then((res) => {
          this.showNotice({
            type: 'success',
            content: '导出CSV任务创建成功'
          })
          this.$route.router.go('/operation/settings/offline-data')
          // this.onExportCancel()
        }).catch((res) => {
          this.exporting = false
          this.handleError(res)
        })
      },

      /**
       * 获取用户在线状态
       * @param  {[type]} userId [description]
       * @return {[type]}        [description]
       */
      getOnlineType (userId) {
        api.user.getUserSession(userId).then((res) => {
          var obj = {
            id: userId,
            online: Boolean(res.data.online),
            text: res.data.online ? this.$t('operation.user.list.online') : this.$t('operation.user.list.offline')
          }
          this.usersOnlineType.push(obj)
        }).catch((res) => {
          this.handleError(res)
        })
      },
      /**
       * 获取今日新增用户数
       * @return {[type]} [description]
       */
      getTodayAddCount () {
        api.statistics.getSummary().then((res) => {
          this.todayAddCount = res.data.user.today_add
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 获取用户在线量
       * @return {[type]} [description]
       */
      getOnlineCount () {
        api.statistics.getUserSummary().then((res) => {
          this.onlineCount = res.data.online
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 获取七天用户活跃数
       * @return {[type]} [description]
       */
      getServerDayActiveCount () {
        var time = createDayRange(1, 7)
        api.statistics.getUserTrend(time.start, time.end).then((res) => {
          var count = 0
          res.data.map((item) => {
            count += item.active
          })
          this.serverDayActiveCount = count
          // this.onlineCount = res.data.online
        }).catch((res) => {
          this.handleError(res)
        })
      },
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
        this.currentPage = 1
        this.getUsers()
      },
      /**
       * 按某个属性排序
       * 国辉
       * @param  {[type]} table [description]
       * @return {[type]}       [description]
       */
      sortBySomeKey (header, index) {
        if (header.sortType === 1) {
          header.sortType = -1
        } else {
          header.sortType = 1
        }
        this.headers.$set(index, header)
        this.getUsers()
      },
      /**
       * 解析当前在线状态
       * @param  {[type]} userId [description]
       * @return {[type]}        [description]
       */
      computedOnline (userId) {
        var result = '-'
        this.usersOnlineType.map((item) => {
          if (item.id === userId) {
            result = item.text
            return
          }
        })
        // if (online === true) {
        //   result = '在线'
        // } else if (online === false) {
        //   result = '下线'
        // }
        return result
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
          '3': 'iOS',
          '4': this.$t('common.wechat')
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
          '1': this.$t('common.normal'),
          '2': this.$t('common.outage')
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
      // 获取用户
      getUsers (reset) {
        if (reset) {
          this.currentPage = 1
        }
        this.loadingData = true
        api.user.list(this.queryCondition).then((res) => {
          if (res.status === 200) {
            this.users = res.data.list
            if (this.cacheOnlineType) {
              this.usersOnlineType = []
            }
            // 如果不缓存设备在线状态可以把这行注释掉
            // this.users.map((item) => {
            //   this.getOnlineType(item.id)
            // })
            if (this.allTotal === 0) {
              this.allTotal = res.data.count
            }
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
          this.getUsers(true)
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

<style lang="stylus" scoped>

  .statistic-group
    border-top 1px solid #d9d9d9
</style>
