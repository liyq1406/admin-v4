<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.alert.record.title') }}</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select :label="currentProduct.name" width="110px" size="small">
            <span slot="label">{{ $t('operation.alert.record.product') }}</span>
            <select v-model="currentProduct" @change="productSelected">
              <!-- <option :value="currentProduct">{{ currentProduct.name }}</option> -->
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </x-select>
        </div>
      </div>
    </div>
    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :info="alertSummary.unread" :title="alertSummary.unread.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.today" :title="alertSummary.today.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.week" :title="alertSummary.week.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.month" :title="alertSummary.month.title" align="left"></statistic>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <x-table :headers="headers" :selecting="selecting" @selected-change="selectChange" @tbody-content="getInfo" :tables="tables" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @theader-create-date="sortBy">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="key" :placeholder="$t('common.placeholder.search')" :active="searching" @cancel="getAlerts(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @press-enter="getAlerts(true)">
                  <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="getAlerts(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <x-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="visibility" @change="getAlerts(true)">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>

              <span class="ml10">{{ $t('operation.product.device.alert.time') }}: </span>
              <x-select width="98px" size="small" :label="rangeOption.label">
                <select v-model="rangeOption" @change="onRangeOptionChange">
                  <option v-for="option in timeRangeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <date-time-range-picker v-if="rangeOption.value === 'specified'" @timechange="onTimeChange" :start-offset="365" :show-time="false"></date-time-range-picker>
              
            </div>
          </div>
          <div slot="left-foot" v-show="showBatchBtn" class="row mt10">
            <label>{{ $t('operation.alert.record.sign') }}:</label>
            <button class="btn btn-ghost" @click="setDeal">{{ $t('operation.alert.record.processed') }}</button>
            <button class="btn btn-ghost" @click="setUnDeal">{{ $t('operation.alert.record.no_processed') }}</button>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
import locales from 'consts/locales/index'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import Statistic from 'components/Statistic'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import Table from 'components/Table'
import { globalMixins } from 'src/mixins'
import formatDate from 'filters/format-date'
import DateTimeRangePicker from 'components/DateTimeRangePicker'

// TODO 消除代码冗余 #weijie

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    Pager,
    Modal,
    RadioButtonGroup,
    Statistic,
    DateTimeMultiplePicker,
    'x-select': Select,
    'x-table': Table,
    SearchBox,
    DateTimeRangePicker
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      exporting: false,
      searching: false,
      defaultPeriod: 7,
      currentProduct: {},
      key: '',
      alerts: [],
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      model: {
        id: '',
        type: 1,
        product_name: '',
        alert_name: '',
        alert_value: '',
        notify_type: 1,
        from: '',
        to: [],
        content: '',
        create_date: '',
        is_read: false,
        tags: ''
      },
      period: 7,
      periods: [1, 7, 30],
      product_id: '',
      alertTypes: locales[Vue.config.lang].data.ALERT_TYPES,
      informTypes: locales[Vue.config.lang].data.INFORM_TYPES,
      alertSummary: {
        unread: {
          title: this.$t('operation.alert.record.untreated'),
          total: '--',
          change: 0
        },
        today: {
          title: this.$t('operation.alert.record.today_add'),
          total: '--',
          change: 0
        },
        week: {
          title: this.$t('operation.alert.record.sevent_add'),
          total: '--',
          change: 0
        },
        month: {
          title: this.$t('operation.alert.record.thirty_add'),
          total: '--',
          change: 0
        }
      },
      today: formatDate(new Date(), 'yyyy-MM-dd', true),
      loadingData: false,
      startTimePick: '',
      endTimePick: '',
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: this.$t('operation.alert.record.device_id'), value: 'from' },
        { label: this.$t('operation.alert.record.alert_content'), value: 'content' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      visibility: {
        label: this.$t('operation.alert.record.all_level'),
        value: 'all'
      },
      visibilityOptions: [
        { label: this.$t('operation.product.alert.all_level'), value: 'all' },
        { label: this.$t('operation.product.alert.info'), value: this.$t('operation.product.alert.info') },
        { label: this.$t('operation.product.alert.warning'), value: this.$t('operation.product.alert.warning') },
        { label: this.$t('operation.product.alert.danger'), value: this.$t('operation.product.alert.danger') }
      ],
      headers: [{
        key: 'content',
        title: this.$t('operation.product.device.alert.alert_content')
      }, {
        key: 'mac',
        title: this.$t('operation.product.device.alert.mac')
      }, {
        key: 'id',
        title: this.$t('operation.product.device.alert.device_id')
      }, {
        key: 'create_date',
        title: this.$t('operation.product.device.alert.time'),
        sortType: -1
      }, {
        key: 'duration',
        title: this.$t('operation.product.device.alert.time_length'),
        class: 'wp10'
      }, {
        key: 'level',
        title: this.$t('operation.product.device.alert.alert_level'),
        class: 'wp8'
      }, {
        key: 'state',
        title: this.$t('operation.product.device.alert.state'),
        class: 'wp6'
      }],
      showBatchBtn: false,
      dealList: [],
      selecting: true,
      rangeOption: {
        label: this.$t('common.any'),
        value: 'any'
      },
      timeRangeOptions: locales[Vue.config.lang].data.TIME_RANGE_OPTIONS,
      startTime: new Date(new Date() - 365 * 1000 * 60 * 60 * 24),
      endTime: new Date()
    }
  },

  computed: {
    // 分页信息
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
          product_id: {
            $in: [this.currentProduct.id]
          }
          // create_date: {
          //   $lte: this.endTimePick,
          //   $gte: this.startTimePick
          // }
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

      if (this.rangeOption.value === 'specified') {
        condition.query['create_date'] = {
          '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
          '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
        }
      }

      switch (this.visibility.value) {
        case `${this.$t('operation.alert.record.info')}`:
          condition.query['tags'] = { $in: [`${this.$t('operation.alert.record.info')}`] }
          break
        case `${this.$t('operation.alert.record.warning')}`:
          condition.query['tags'] = { $in: [`${this.$t('operation.alert.record.warning')}`] }
          break
        case `${this.$t('operation.alert.record.danger')}`:
          condition.query['tags'] = { $in: [`${this.$t('operation.alert.record.danger')}`] }
          break
        default:
      }

      this.headers.forEach((item) => {
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
      this.alerts.forEach((item) => {
        let levelCls = ({
          [this.$t('operation.product.alert.warning')]: 'text-label-warning',
          [this.$t('operation.product.alert.danger')]: 'text-label-danger'
        })[item.tags] || ''

        let content = '<a class="table-limit-width hl-red">' + item.content + '</a>'
        let alert = {
          content: content,
          mac: item.mac,
          create_date: formatDate(item.create_date),
          duration: this.prettyDuration(item.lasting),
          id: item.from,
          level: `<div class="level level1 text-label ${levelCls}">${item.tags || this.$t('operation.product.alert.info')}</div>`,
          state: item.is_read ? `<span class="hl-green">${this.$t('operation.product.alert.processed')}</span>` : `<span>${this.$t('operation.product.alert.no_processed')}</span>`,
          prototype: item
        }
        result.push(alert)
      })
      return result
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  ready () {
    if (this.products.length > 0) {
      this.getFirstProduct()
      this.getSummary()
      this.getAlerts()
    }
  },

  // 监听属性变动
  watch: {
    products () {
      if (this.products.length > 0) {
        this.getFirstProduct()
        this.getSummary()
        this.getAlerts(true)
      }
    }
  },

  methods: {
    /**
     * 处理时间区段改变
     */
    onRangeOptionChange () {
      if (this.rangeOption.value === 'any') {
        this.getAlerts(true)
      }
    },

    /**
     * 时间范围改变
     * @param  {[type]} startDate [description]
     * @param  {[type]} endDate   [description]
     * @return {[type]}           [description]
     */
    onTimeChange (start, end) {
      this.startTime = start
      this.endTime = end
      this.getAlerts(true)
    },

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

    productSelected () {
      this.getSummary()
      this.getAlerts(true)
    },
    // 获取第一个产品@author weijie
    getFirstProduct () {
      this.currentProduct = this.products[0] || {}
    },

    // 获取告警概览
    getSummary () {
      const MILLISECONDS_PER_DAY = 24 * 3600 * 1000
      var todayTime = formatDate(new Date(), 'yyyy-MM-dd', true)
      var initTime = formatDate(new Date(0), 'yyyy-MM-dd', true)
      var weekBeginTime = new Date().getTime() - 7 * MILLISECONDS_PER_DAY
      weekBeginTime = formatDate(weekBeginTime, 'yyyy-MM-dd', true)
      var monthBeginTime = new Date().getTime() - 30 * MILLISECONDS_PER_DAY
      monthBeginTime = formatDate(monthBeginTime, 'yyyy-MM-dd', true)
      var now = new Date().getTime() - MILLISECONDS_PER_DAY
      now = formatDate(now, 'yyyy-MM-dd', true)
      // 获取当天数据
      api.statistics.getProductAlertSummary(this.currentProduct.id, initTime, todayTime).then((res) => {
        if (res.status === 200) {
          this.alertSummary.unread.total = res.data.unread
          this.alertSummary.today.total = res.data.add_today
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 获取7天数据
      api.statistics.getProductAlertSummary(this.currentProduct.id, weekBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.week.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // 获取30天数据
      api.statistics.getProductAlertSummary(this.currentProduct.id, monthBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.month.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
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

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getAlerts(true)
    },

    /**
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getAlerts()
    },

    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getAlerts()
    },

    /**
     * 按某个属性排序
     * @author shengzhi
     * @param  {Object} header 表头
     * @param  {Number} 索引
     */
    sortBy (header, index) {
      header.sortType = header.sortType * -1
      this.headers.$set(index, header)
      this.getAlerts()
    },

    // 获取消息列表@author weijie
    getAlerts (reset) {
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.total = res.data.count
          this.alerts = res.data.list.map((item) => {
            // 计算已读告警持续时间
            let begin = new Date((new Date(item.create_date)).getTime())
            // 默认为未读，时间从当前算起
            let end = new Date(+new Date() + 3600 * 8 * 1000)
            // 如果为已读，则从已读时间算起
            if (item.is_read) {
              end = new Date((new Date(item.read_time)).getTime())
            }
            // 持续时间
            item.lasting = end.getTime() - begin.getTime()
            return item
          })
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    selectChange (table) {
      var result = []
      table.forEach((item) => {
        result.push(item.prototype)
      })
      this.dealList = result
      if (table.length > 0) {
        this.showBatchBtn = true
      } else {
        this.showBatchBtn = false
      }
    },
    // 标记为已处理
    setDeal () {
      var params = []
      this.dealList.forEach((item) => {
        params.push(item.id)
      })
      api.alert.setAlertRead(params).then((res) => {
        if (res.status === 200) {
          this.getAlerts()
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
          this.getAlerts()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 跳转详情信息
    getInfo (table, header, index) {
      this.$route.router.go('/operation/alerts/detail/' + table.prototype.id)
    }
  }
}
</script>
