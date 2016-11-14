<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.alert.analysis.detail')}}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="left-actions blockdiv clearfix mt10" slot="left-actions">
      <div class="filter-group fl ml20">
        <div class="filter-group-item">
          <!-- <x-select label="空气净化器" width="110px" size="small">
            <span slot="label">产品：空气净化器</span>
          </x-select> -->
          <div class="lh28">
            <span class="text-label" :class="tagStyle(alert.tag)">{{ alert.tag }}</span>
            <span class="ml10">{{alert.name}}</span>
          </div>
        </div>
      </div>
      <!-- <div class="filter-group fr mr20">
        <date-time-multiple-picker :periods="periods" @timechange="getSpecial" :default-period="defaultPeriod"></date-time-multiple-picker>
      </div> -->
    </div>
    <div class="panel mt10">
      <div class="filter-bar filter-bar-head filter-bar-lr">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
          </div>
          <div class="filter-group-item">
            <search-box :key.sync="key" :placeholder="$t('common.placeholder.search')" :active="searching" @cancel="getList(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @press-enter="getList(true)">
              <x-select width="90px" :label="queryType.label" size="small">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <button slot="search-button" @click="getList(true)" class="btn"><i class="fa fa-search"></i></button>
            </search-box>
          </div>
        </div>
        <h3>{{ $t('operation.alert.analysis.alert_list') }}</h3>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @page-count-update="pageCountUpdate" @current-page-change="currentPageChange" @theader-create-date="sortBySomeKey" :selecting="selecting" @selected-change="selectChange">
            <div slot="left-foot" v-show="showBatchBtn" class="row mt10">
              <label>{{ $t('operation.product.alert.sign') }}:</label>
              <button class="btn btn-ghost" @click="setDeal">{{ $t('operation.product.alert.processed') }}</button>
              <button class="btn btn-ghost" @click="setUnDeal">{{ $t('operation.product.alert.no_processed') }}</button>
            </div>
          </x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as config from 'consts/config'
import api from 'api'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import Statistic from 'components/Statistic'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import { globalMixins } from 'src/mixins'
import formatDate from 'filters/format-date'
import locales from 'consts/locales/index'
import Vue from 'vue'

export default {
  name: 'Overview',

  mixins: [globalMixins],

  components: {
    DateTimeMultiplePicker,
    'x-table': Table,
    Statistic,
    SearchBox
  },

  data () {
    return {
      exporting: false,
      alert: {
        tag: '',
        name: ''
      },
      defaultPeriod: 7,
      startTimePick: '',
      endTimePick: '',
      searching: false,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      records: [],
      key: '',
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: this.$t('operation.alert.analysis.device_id'), value: 'from' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      // 数据是否加载中
      loadingData: false,
      headers: [
        {
          key: 'mac',
          title: this.$t('operation.alert.analysis.mac')
        },
        {
          key: 'id',
          title: this.$t('operation.alert.analysis.device_id')
        },
        {
          key: 'create_date',
          title: this.$t('operation.alert.analysis.time'),
          sortType: -1
        },
        {
          key: 'duration',
          title: this.$t('operation.alert.analysis.time_length')
        },
        {
          key: 'state',
          title: this.$t('operation.alert.analysis.state')
        }
      ],
      breadcrumbNav: [{
        label: this.$t('operation.alert.analysis.title'),
        link: '/operation/alerts/analysis'
      }, {
        label: '当前'
      }],
      product: {},
      total: 0,
      periods: [1, 7, 30],
      showBatchBtn: false,
      dealList: [],
      selecting: true
    }
  },

  ready () {
    this.getRules()
    this.getList()
  },

  computed: {
    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },

    // 基本筛选条件
    baseCondition () {
      var condition = {
        filter: ['alert_id', 'alert_name', 'content', 'create_date', 'from', 'id', 'is_read', 'location', 'mac', 'notify_type', 'product_id', 'product_name', 'tags', 'to', 'type'],
        order: {},
        query: {
          alert_id: {
            $in: [this.$route.params.id]
          },
          product_id: {
            $in: [this.$route.params.product_id]
          }
        }
      }

      // 关键字搜索
      if (this.key !== '') {
        if (this.queryType.value === 'from') {
          // 设备ID
          let temp = parseInt(this.key)
          if (!temp || temp > 2100000000 || this.key.length !== temp.toString().length) {
            temp = 2100000000
          }
          // 设备ID不能用模糊匹配
          condition.query.from = {
            '$in': [temp]
          }
        } else {
          condition.query[this.queryType.value] = {
            '$like': this.key
          }
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
    },

    tables () {
      var result = []
      this.records.map((item) => {
        var alert = {
          mac: item.mac,
          id: item.from,
          create_date: formatDate(item.create_date),
          duration: this.prettyDuration(item.lasting),
          state: item.is_read ? this.$t('operation.product.alert.processed') : this.$t('operation.product.alert.no_processed'),
          prototype: item
        }
        result.push(alert)
      })
      return result
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
        name: '告警列表',
        describe: '告警列表',
        type: 3,
        params: this.baseCondition
      }

      this.exporting = true
      api.exportTask.createTask(postData).then((res) => {
        this.showNotice({
          type: 'success',
          content: this.$t('operation.settings.offline.export_success')
        })
        this.$route.router.go('/operation/settings/offline-data')
        // this.onExportCancel()
      }).catch((res) => {
        this.exporting = false
        this.handleError(res)
      })
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
      this.getList()
    },
    currentPageChange (number) {
      this.currentPage = number
      this.getList()
    },
    pageCountUpdate (count) {
      this.countPerPage = count
      this.getList(true)
    },
    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getAlerts(true)
    },

    getSpecial (start, end) {
      this.startTimePick = new Date(start.getTime() + 3600 * 1000 * 8)
      this.endTimePick = new Date(end.getTime() + 3600 * 1000 * 8)
      this.getList(true)
    },
    // 获取告警历史@author weijie
    getList (reset) {
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.total = res.data.count
          // this.alerts = res.data.list
          this.records = res.data.list.map((item) => {
            // 计算已读告警持续时间
            let begin = new Date((new Date(item.create_date)).getTime() + 3600 * 8 * 1000)
            // 默认为未读，时间从当前算起
            let end = new Date()
            // 如果为已读，则从已读时间算起
            if (item.is_read) {
              end = new Date((new Date(item.read_time)).getTime() + 3600 * 8 * 1000)
            }
            // 持续时间
            item.lasting = end.getTime() - begin.getTime()
            return item
          })
          this.loadingData = false
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },
    getRules () {
      api.alert.getRules(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.alert = _.find(res.data, (item) => {
            return item.id === this.$route.params.id
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    tagStyle (tag) {
      switch (tag) {
        case locales[Vue.config.lang].data.ALERT_LEVELS.orange:
          return 'text-label-warning'
        case locales[Vue.config.lang].data.ALERT_LEVELS.red:
          return 'text-label-danger'
        default:
          break
      }
      return ''
    },
    /**
     * 将毫秒数格式化为合适显示的时间段
     */
    prettyDuration (n) {
      let hours = (n / 3600000).toFixed(1)
      if (hours > 1) {
        return `${hours}${this.$t('operation.product.alert.hour')}`
      } else {
        return `${Math.floor(n / 60000)}${this.$t('operation.product.alert.minutes')}`
      }
    },
    // 标记为已处理
    setDeal () {
      var params = []
      this.dealList.forEach((item) => {
        params.push(item.id)
      })
      // var params = [this.$route.params.id]
      api.alert.setAlertRead(params).then((res) => {
        if (res.status === 200) {
          this.getList()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 标记为未处理
    setUnDeal () {
      var params = []
      this.dealList.forEach((item) => {
        params.push(item.id)
      })
      // var params = [this.$route.params.id]
      api.alert.setAlertUnread(params).then((res) => {
        if (res.status === 200) {
          this.getList()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    selectChange (table) {
      var result = []
      table.forEach((item) => {
        result.push(item.prototype)
      })
      // this.dealList = []
      this.dealList = result
      if (table.length > 0) {
        this.showBatchBtn = true
      } else {
        this.showBatchBtn = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'
.filter-bar-lr
  border 1px solid #d9d9d9
.inlinediv
  display inline-block!important
.lh28
  line-height 28px
.nobgnobrt
  background-color none
  border-top none!important
</style>
