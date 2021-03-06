<template>
  <div class="panel">
    <div class="panel-bd">
      <!-- <pre> {{ dealList | json}}</pre> -->
      <div class="data-table with-loading">
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <x-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('operation.product.device.alert.display') }}：</span>
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
          <div class="filter-group fr">
            <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
            </div>
            <div class="filter-group-item">
              <search-box
                :key="key"
                :placeholder="$t('common.placeholder.search')"
                :active="searching"
                @cancel="getAlerts(true)"
                @search="handleSearch"
                @search-activate="searching=!searching"
                @press-enter="getAlerts(true)">
                <x-select width="90px" :label="queryType.label" size="small">
                  <select v-model="queryType">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
                <button slot="search-button" @click="getAlerts(true)" class="btn"><i class="fa fa-search"></i></button
              </search-box>
            </div>
          </div>
        </div>
        <x-table :headers="headers" :rows="rows" :page="page" :selecting="selecting" :loading="loadingData" @tbody-content="getInfo" @tbody-mac="jumpInfo" @selected-change="selectChange" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @theader-create-date="sortBy">
          <div slot="left-foot" v-show="showBatchBtn" class="row mt10">
            <label>{{ $t('operation.product.device.alert.sign') }}:</label>
            <button class="btn btn-ghost" @click="setDeal">{{ $t('operation.product.device.alert.processed') }}</button>
            <button class="btn btn-ghost" @click="setUnDeal">{{ $t('operation.product.device.alert.no_processed') }}</button>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import locales from 'consts/locales/index'
import api from 'api'
import formatDate from 'filters/format-date'
import * as config from 'consts/config'
export default {
  name: 'AlertTable',
  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  components: {
  },

  data () {
    return {
      exporting: false,
      selecting: true,
      alerts: [],
      tags: [],
      visibilityOptions: [
        { label: this.$t('operation.product.device.alert.all_level'), value: 'all' }
        // { label: this.$t('operation.product.device.alert.info'), value: this.$t('operation.product.device.alert.info') },
        // { label: this.$t('operation.product.device.alert.warning'), value: this.$t('operation.product.device.alert.warning') },
        // { label: this.$t('operation.product.device.alert.danger'), value: this.$t('operation.product.device.alert.danger') }
      ],
      visibility: {},
      queryTypeOptions: [
        { label: this.$t('operation.product.device.alert.mac'), value: 'mac' },
        { label: this.$t('operation.product.device.alert.device_id'), value: 'from' },
        { label: this.$t('operation.product.device.alert.alert_content'), value: 'alert_name' }
      ],
      queryType: {},
      key: '',
      loadingData: true,
      searching: false,
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
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
        title: this.$t('operation.product.device.alert.time_length')
      }, {
        key: 'level',
        title: this.$t('operation.product.device.alert.alert_level')
      }, {
        key: 'state',
        title: this.$t('operation.product.device.alert.state')
      }],
      showBatchBtn: false,
      dealList: [],
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
            $in: [this.$route.params.product_id]
          },
          from: {
            $in: [this.$route.params.device_id]
          }
        }
      }

      // 关键字搜索
      if (this.key.length > 0) {
        this.currentPage = 1
        condition.query[this.queryType.value] = this.queryType.value === 'from' ? { $in: [Number(this.key)] } : { $like: this.key }
      }

      // 显示指定告警类型
      if (this.visibility.value !== 'all') {
        condition.query.tags = { $in: [this.visibility.label] }
      }

      if (this.rangeOption.value === 'specified') {
        condition.query['create_date'] = {
          '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
          '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
        }
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

    rows () {
      var result = []
      this.alerts.map((item) => {
        // let levelCls = ({
        //   [this.$t('operation.product.device.alert.warning')]: 'text-label-warning',
        //   [this.$t('operation.product.device.alert.danger')]: 'text-label-danger'
        // })[item.tags] || ''
        let content = '<a class="table-limit-width hl-red">' + item.content + '</a>'
        let alert = {
          content: content,
          mac: '<a class="hl-red">' + item.mac + '</a>',
          create_date: formatDate(item.create_date),
          duration: this.prettyDuration(item.lasting),
          id: item.from,
          // level: `<div class="level level1 text-label ${levelCls}">${item.tags || this.$t('operation.product.device.alert.info')}</div>`,
          level: item.tags || this.$t('operation.product.device.alert.info'),
          state: item.is_read ? this.$t('operation.product.device.alert.processed') : this.$t('operation.product.device.alert.no_processed'),
          prototype: item
        }
        result.push(alert)
      })
      return result
    }
  },

  watch: {
    currentProduct () {
      if (this.currentProduct.id) {
        // this.init()
        this.getTags()
      }
    }
  },

  ready () {
    if (this.currentProduct.id) {
      // this.init()
      this.getTags()
    }
  },

  methods: {
    // 获取告警类型
    getTags () {
      api.alert.getAlertTags().then((res) => {
        if (res.status === 200) {
          this.tags = res.data.tags
          this.tags.forEach((tag) => {
            var obj = {
              label: tag
            }
            this.visibilityOptions.push(obj)
          })
          if (this.visibilityOptions.length === this.tags.length + 1) {
            this.init()
          }
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 跳转设备详情
    jumpInfo (info) {
      this.$route.router.go({path: '/operation/products/' + this.currentProduct.id + '/devices/' + info.id + '/info'})
    },
    init () {
      this.visibility = this.visibilityOptions[0]
      this.queryType = this.queryTypeOptions[0]
      this.getAlerts()
    },

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

    /**
     * 将毫秒数格式化为合适显示的时间段
     */
    prettyDuration (n) {
      let hours = (n / 3600000).toFixed(1)
      if (hours > 1) {
        return `${hours}${this.$t('operation.product.device.alert.hour')}`
      } else {
        return `${Math.floor(n / 60000)}${this.$t('operation.product.device.alert.minutes')}`
      }
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

    handleSearch (val) {
      this.key = val
    },

    /**
     * 获取消息列表
     * @author weijie
     */
    getAlerts (reset) {
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        this.loadingData = false
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
        }
      }).catch((res) => {
        this.loadingData = false
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
      // this.$route.router.go('/operation/alerts/record')
    }
  }
}
</script>
