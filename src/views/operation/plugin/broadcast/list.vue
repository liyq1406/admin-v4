<template>
  <div class="main">
    <div class="main-title">
      <h2>消息列表</h2>
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
              <div class="filter-group-item">
                <div class="fr">
                  <a class="fa fa- fa-share-square-o"></a>
                </div>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="getHistories" :placeholder="$t('ui.user.fields.account')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getHistories">
                  <button slot="search-button" @click="getHistories" class="btn btn-primary"><i class="fa fa-search"></i></button>
                  <label>{{ $t('ui.user.search_user') }}</label>
                </search-box>
              </div>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables"></c-table>
        </div>
      </div>
    </div>
    <!-- <section>
      <div class="panel">
        <div class="panel-hd">
          <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getHistory(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getHistory(true)">
            <v-select width="100px" :label="queryType.label">
              <select v-model="queryType">
                <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
              </select>
            </v-select>
            <button slot="search-button" @click="getHistory(true)" class="btn btn-primary"><i class="fa fa-search"></i></button>
          </search-box>
          <h2>推送历史列表</h2>
        </div>
        <div class="panel-bd">
          <div class="data-table with-loading">
            <div class="icon-loading" v-show="loadingData">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
            <table class="table table-stripe table-bordered">
              <thead>
                <tr>
                  <th>推送内容</th>
                  <th>推送渠道</th>
                  <th>推送方式</th>
                  <th>推送状态</th>
                  <th>推送时间</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="histories.length > 0">
                  <tr v-for="history in histories">
                    <td>{{ history.content }}</td>
                    <td>{{ history.channel }}</td>
                    <td>{{ history.type }}</td>
                    <td>
                      <span v-if="history.status===1" class="hl-green">已发送</span>
                      <span v-if="history.status===0" class="hl-gray">待发送
                      </span>
                      <div class="broadcast-details" v-if="history.status===1">
                        <p>发送：38492</p>
                        <p>接收：122232</p>
                      </div>
                    </td>
                    <td>{{ history.broadcast_time }}</td>
                  </tr>
                </template>
                <tr v-if="histories.length === 0 && !loadingData">
                  <td colspan="5" class="tac">
                    <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section> -->
  </div>
</template>

<script>
  import * as config from 'consts/config'
  import Select from 'components/Select'
  import Table from 'components/Table'
  import SearchBox from 'components/SearchBox'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'BroadcastHistory',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'c-table': Table,
      'search-box': SearchBox
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
        queryTypeOptions: [
          { label: '推送内容', value: 'content' },
          { label: '推送方式', value: 'type' }
        ],
        queryType: {
          label: '推送内容',
          value: 'content'
        },
        headers: [
          {
            key: 'title',
            title: '推送标题',
            class: 'tac'
          },
          {
            key: 'channel',
            title: '推送平台',
            class: 'tac'
          },
          {
            key: 'broadcast_time',
            title: '推送时间',
            sortType: -1,
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
            key: 'arrive_count',
            title: '抵达数',
            class: 'tac'
          },
          {
            key: 'arrive_rate',
            title: '抵达率',
            class: 'tac'
          },
          {
            key: 'click_count',
            title: '点击数',
            class: 'tac'
          },
          {
            key: 'click_rate',
            title: '点击数',
            class: 'tac'
          }
        ]
      }
    },

    computed: {
      tables () {
        var result = []
        this.histories.map((item) => {
          var history = {
            title: '<a class="hl-red">' + item.content + '</a>',
            channel: item.channel,
            broadcast_time: item.broadcast_time,
            status: item.status
          }
          result.push(history)
        })
        return result
      },
      queryCondition () {
        var condition = {
          filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {}
        }

        if (this.query.length > 0) {
          condition.query[this.queryType.value] = { $like: this.query }
        }

        return condition
      }
    },

    ready () {
      this.getHistories()
    },

    methods: {
      getHistories (querying) {
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }

        this.histories = [{
          content: '五一家电狂欢盛典，全场狂嗨5天5夜',
          channel: 'APP1',
          type: '组播',
          status: 1,
          broadcast_time: '2013-03-04 12:30',
          user_type: '7天未活跃用户'
        }, {
          content: '五一家电狂欢盛典，全场狂嗨5天5夜',
          channel: 'APP1',
          type: '广播',
          status: 0,
          broadcast_time: '2013-03-04 12:30',
          user_type: '7天未活跃用户'
        }, {
          content: '五一家电狂欢盛典，全场狂嗨5天5夜',
          channel: 'APP1',
          type: '组播',
          status: 1,
          broadcast_time: '2013-03-04 12:30',
          user_type: '7天未活跃用户'
        }, {
          content: '五一家电狂欢盛典，全场狂嗨5天5夜',
          channel: 'APP1',
          type: '广播',
          status: 0,
          broadcast_time: '2013-03-04 12:30',
          user_type: '7天未活跃用户'
        }]
      },

      // 搜索
      handleSearch () {
        if (this.query.length === 0) {
          this.getHistories(true)
        }
      },

      // 切换搜索
      toggleSearching () {
        this.searching = !this.searching
      },

      // 取消搜索
      cancelSearching () {
        this.getHistories(true)
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
