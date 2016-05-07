<template>
  <section>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <search-box :key.sync="query" :active="searching" :placeholder="$t('overview.addForm.search_condi')" @cancel="getHistory(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getHistory(true)">
            <v-select width="100px" :label="queryType.label">
              <select v-model="queryType">
                <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
              </select>
            </v-select>
            <button slot="search-button" @click="getHistory(true)" class="btn btn-primary">{{ $t('common.search') }}</button>
          </search-box>
        </div>
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
                  <td><a v-link="{path: '/plugins/broadcast/history/' + ($index + 1)}">{{ history.content }}</a></td>
                  <td>{{ history.channel }}</td>
                  <td>{{ history.type }}</td>
                  <td>
                    <span v-if="history.status===1" class="hl-green">已发送</span>
                    <span v-if="history.status===0" class="hl-gray">待发送<a v-link="{path: '/plugins/broadcast/history/' + ($index + 1) + '/update'}" class="fa fa-edit"></a></span>
                    <div class="broadcast-details" v-if="history.status===1">
                      <p>发送：38492</p>
                      <p>接收：122232</p>
                    </div>
                  </td>
                  <td>{{ history.broadcast_time }}</td>
                  <!-- <td><a v-link="'/products/' + $route.params.id + '/devices/' + device.id" class="hl-red">{{ device.mac }}</a></td>
                  <td>{{ device.id }}</td>
                  <td v-text="device.is_active ? $t('device_list.active') : $t('device_list.not_active')"></td>
                  <td><span v-if="device.active_date">{{ device.active_date | formatDate }}</span></td>
                  <td><span v-if="device.is_online" class="hl-green">{{ $t('device_list.online') }}</span><span v-else class="hl-gray">{{ $t('device_list.offline') }}</span></td> -->
                </tr>
              </template>
              <tr v-if="histories.length === 0 && !loadingData">
                <td colspan="5" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Select from '../../../components/Select'
  import SearchBox from '../../../components/SearchBox'
  import { globalMixins } from '../../../mixins'

  export default {
    name: 'BroadcastHistory',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'search-box': SearchBox
    },

    data () {
      return {
        histories: [],
        loadingData: false,
        searching: false,
        total: 0,
        currentPage: 1,
        pageCount: 10,
        query: '',
        queryTypeOptions: [
          { label: '推送内容', value: 'content' },
          { label: '推送方式', value: 'type' }
        ],
        queryType: {
          label: '推送内容',
          value: 'content'
        }
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
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
  @import '../../../assets/stylus/common'

  .broadcast-details
    p
      margin 0
</style>
