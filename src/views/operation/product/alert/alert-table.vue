<template>
  <div class="panel">
    <div class="panel-bd">
      <!-- <pre> {{ dealList | json}}</pre> -->
      <div class="data-table with-loading">
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <x-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('operation.product.alert.display') }}：</span>
                <select v-model="visibility" @change="getAlerts(true)">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="key" :placeholder="$t('common.placeholder.search')" :active="searching" @cancel="getAlerts(true)" @search-activate="searching=!searching"  @press-enter="getAlerts(true)">
                <x-select width="90px" :label="queryType.label" size="small">
                  <select v-model="queryType">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
                <button slot="search-button" @click="getAlerts(true)" class="btn"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
        </div>
        <x-table :headers="headers" :tables="tables" :page="page" :selecting="selecting" :loading="loadingData" @tbody-content="getInfo" @selected-change="selectChange" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @theader-create-date="sortBy">
          <div slot="left-foot" v-show="showBatchBtn" class="row mt10">
            <label>{{ $t('operation.product.alert.sign') }}:</label>
            <button class="btn btn-ghost" @click="setDeal">{{ $t('operation.product.alert.processed') }}</button>
            <button class="btn btn-ghost" @click="setUnDeal">{{ $t('operation.product.alert.no_processed') }}</button>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import formatDate from 'filters/format-date'
import { globalMixins } from 'src/mixins'
import * as config from 'consts/config'

export default {
  name: 'AlertTable',

  mixins: [globalMixins],

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  components: {
    'x-table': Table,
    'x-select': Select,
    SearchBox
  },

  data () {
    return {
      selecting: true,
      alerts: [],
      visibilityOptions: [
        { label: this.$t('operation.product.alert.all_level'), value: 'all' },
        { label: this.$t('operation.product.alert.info'), value: this.$t('operation.product.alert.info') },
        { label: this.$t('operation.product.alert.warning'), value: this.$t('operation.product.alert.warning') },
        { label: this.$t('operation.product.alert.danger'), value: this.$t('operation.product.alert.danger') }
      ],
      visibility: {},
      queryTypeOptions: [
        { label: this.$t('operation.product.alert.mac'), value: 'mac' },
        { label: this.$t('operation.product.alert.device_id'), value: 'from' },
        { label: this.$t('operation.product.alert.alert_content'), value: 'alert_name' }
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
      dealList: []
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

    // 查询条件
    queryCondition () {
      let condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          product_id: {
            $in: [this.$route.params.id]
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

      // 显示指定告警类型
      if (this.visibility.value !== 'all') {
        condition.query.tags = { $in: [this.visibility.value] }
      }

      this.headers.forEach((item) => {
        if (item.sortType) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
    },

    tables () {
      var result = []
      this.alerts.map((item) => {
        let levelCls = ({
          [this.$t('operation.product.alert.warning')]: 'text-label-warning',
          [this.$t('operation.product.alert.danger')]: 'text-label-danger'
        })[item.tags] || ''
        let content = '<span class="table-limit-width">' + item.content + '</span>'
        let alert = {
          content: content,
          mac: item.mac,
          create_date: formatDate(item.create_date),
          duration: this.prettyDuration(item.lasting),
          id: item.from,
          level: `<div class="level level1 text-label ${levelCls} w50">${item.tags || this.$t('operation.product.alert.info')}</div>`,
          state: item.is_read ? this.$t('operation.product.alert.processed') : this.$t('operation.product.alert.no_processed'),
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
        this.currentPage = 1
        this.init()
      }
    }
  },

  ready () {
    if (this.currentProduct.id) {
      this.init()
    }
  },

  methods: {
    init () {
      this.visibility = this.visibilityOptions[0]
      this.queryType = this.queryTypeOptions[0]
      this.getAlerts()
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
