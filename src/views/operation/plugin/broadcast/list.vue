<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>消息列表</h2>
    </div>
    <!-- <div class="panel">
    </div> -->
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <h3>消息记录</h3>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="getTasks" :placeholder="'请输入' + queryType.label" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getTasks">
                  <button slot="search-button" @click="getTasks" class="btn"><i class="fa fa-search"></i></button>
                  <!-- <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select> -->
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-time="sortByTime" @tbody-title="goDetail"  @page-count-update="pageCountUpdate" @current-page-change="currentPageChange">
          </x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as config from 'consts/config'
  import api from 'api'
  import formatDate from 'filters/format-date'

  export default {
    name: 'BroadcastHistory',
    components: {
    },

    data () {
      return {
        histories: [],
        loadingData: false,
        searching: false,
        total: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        query: '',
        queryType: {
          label: '推送标题',
          value: 'title'
        },
        headers: [
          {
            key: 'title',
            title: '推送标题',
            class: 'tac'
          },
          {
            key: 'app',
            title: '推送应用',
            class: 'tac'
          },
          {
            key: 'time',
            title: '推送时间',
            sortType: -1,
            class: 'tac'
          },
          {
            key: 'people',
            title: '推送人群',
            class: 'tac'
          },
          {
            key: 'status',
            title: '推送状态',
            class: 'tac'
          },
          {
            key: 'valid_count',
            title: '有效推送量',
            class: 'tac'
          },
          {
            key: 'arrive_num',
            title: '抵达数',
            class: 'tac'
          },
          {
            key: 'read_num',
            title: '阅读数',
            class: 'tac'
          }
        ],
        sortKey: ''
      }
    },

    computed: {
      tables () {
        var result = []
        this.histories.map((item) => {
          var history = {
            title: '<a class="hl-red">' + item.title + '</a>',
            app: item.appNames || '全部',
            time: formatDate(item.time),
            people: this.computedPeopleText(item.scope.type),
            status: this.computedStatusText(item.status),
            valid_count: item.user_num,
            arrive_num: item.arrive_num + '<br>(' + ((parseInt(item.arrive_num / item.user_num * 10000) / 100) || 0) + '%)',
            read_num: item.read_num + '<br>(' + ((parseInt(item.read_num / item.user_num * 10000) / 100) || 0) + '%)',
            prototype: item
          }
          result.push(history)
        })
        return result
      },
      page () {
        var result = {
          total: this.total,
          currentPage: this.currentPage,
          countPerPage: this.countPerPage
        }
        return result
      },
      queryCondition () {
        var condition = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {},
          order: {
            time: 'desc'
          }
        }

        if (this.query.length > 0) {
          condition.offset = 0
          condition.query[this.queryType.value] = { $like: this.query }
        }

        this.headers.map((item) => {
          if (item.sortType && (item.key === this.sortKey)) {
            condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
          }
        })

        return condition
      }
    },

    ready () {
      this.getTasks()
    },

    methods: {
      pageCountUpdate (count) {
        this.countPerPage = count
        this.getTasks()
      },
      currentPageChange (number) {
        this.currentPage = number
        this.getTasks()
      },
      computedStatusText (status) {
        var result = ''
        if (status === 2) {
          result = '已发送'
        } else if (status === 1) {
          result = '发送中'
        } else if (status === 0) {
          result = '未发送'
        }
        return result
      },
      computedPeopleText (type) {
        var result = ''
        if (type === 1) {
          result = '所有用户'
        } else if (type === 2) {
          result = '定向推送'
        } else if (type === 3) {
          result = '单个用户'
        }
        return result
      },
      goDetail (table) {
        if (table.prototype.status === 2) {
          this.$route.router.go(this.$route.path + '/' + table.prototype.id)
        } else {
          this.$route.router.go(this.$route.path + '/' + table.prototype.id + '/update')
        }
      },
      getTasks () {
        this.loadingData = true
        api.broadcast.getTasks(this.queryCondition).then((res) => {
          this.loadingData = false
          if (res.status === 200 && res.data.list && res.data.list.length > 0) {
            this.histories = res.data.list
            this.total = res.data.count
            // 获取APP名称
            this.getAppName()
            this.histories.forEach((item) => {
              if (item.scope.app_list && item.scope.app_list.length > 0) {
              }
            })
          } else {
            this.histories = []
          }
        }).catch((res) => {
          this.loadingData = false
          this.handleError(res)
        })
      },
      // 获取APP名字
      getAppName () {
        this.histories.forEach((item, index) => {
          var Apps = []
          if (item.scope.type === 2) {
            item.scope.app_list.forEach((app) => {
              api.plugin.get(app).then((res) => {
                Apps.push(res.data.name + '(' + res.data.plugin + ')')
                item.appNames = Apps.join(' , ')
                this.histories.$set(index, item)
              })
            })
            // console.log(Apps)
            // item.appNames = Apps.join(' , ')
            // console.log(item.appNames)
            // this.histories.$set(index, item)
            // Apps = []
          }
        })
      },

      // 搜索
      handleSearch () {
        if (this.query.length === 0) {
          this.getTasks(true)
        }
      },

      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },

      // 取消搜索
      cancelSearching () {
        this.getTasks(true)
      },

      sortByTime (header, index) {
        this.sortKey = header.key
        if (header.sortType === 1) {
          header.sortType = -1
        } else {
          header.sortType = 1
        }
        this.headers.$set(index, header)
        this.getTasks()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../../assets/stylus/common'

  .broadcast-details
    p
      margin 0
</style>
