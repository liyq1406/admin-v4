<template>
  <div class="main device-list">
    <div class="main-title">
      <h2>{{ $t('operation.product.device.manager.title') }}</h2>
    </div>

    <!-- Start: 产品信息统计 -->
    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :total="statistic.devices.sum.total" :change="statistic.devices.sum.change" :title="$t('operation.product.device.manager.sum.count')" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.devices.activated.total" :change="statistic.devices.activated.change" :title="$t('operation.product.device.manager.activated.count')" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.devices.online.total" :change="statistic.devices.online.change" :title="$t('operation.product.device.manager.online.count')" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.users.total" :change="statistic.users.change" :title="$t('operation.product.device.manager.users.count')" align="left"></statistic>
      </div>
    </div>
    <!-- End: 产品信息统计 -->

    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t('operation.product.device.manager.list') }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <!-- <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button> -->
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('common.placeholder.search')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices(true)" :max="(queryType.value === 'id'?2100000000: false)">
                  <x-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" @click="getDevices" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <x-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}: </span>
                <select v-model="visibility" @change="getDevices">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <span class="ml10">{{ $t('operation.product.device.manager.active_date') }}: </span>
              <x-select width="98px" size="small" :label="rangeOption.label">
                <select v-model="rangeOption" @change="onRangeOptionChange">
                  <option v-for="option in timeRangeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <date-time-range-picker v-if="rangeOption.value === 'specified'" @timechange="onTimeChange" :start-offset="365" :show-time="true"></date-time-range-picker>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @theader-active-date="sortBy" @theader-is-online="sortBy" @tbody-mac="linkToDetails" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
import locales from 'consts/locales/index'
import formatDate from 'filters/format-date'
import { productSummaryMixin, setCurrProductMixin } from '../mixins'
export default {
  name: 'DeviceList',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [productSummaryMixin, setCurrProductMixin],

  data () {
    var sortOrders = {}
    var descProperties = ['active_date', 'is_online']
    var ascProperties = []

    descProperties.forEach((key) => {
      sortOrders[key] = 'desc'
    })

    ascProperties.forEach((key) => {
      sortOrders[key] = 'asc'
    })

    return {
      // 基本字段
      base_fields: [
        {
          'name': 'mac',
          'label': 'MAC地址',
          'hidden': false,
          'sort': 1
        },
        {
          'name': 'id',
          'label': '设备ID',
          'hidden': false,
          'sort': 2
        },
        {
          'name': 'is_active',
          'label': '是否激活',
          'hidden': false,
          'sort': 3
        },
        {
          'name': 'active_date',
          'label': '激活时间',
          'hidden': false,
          'sort': 4
        },
        {
          'name': 'is_online',
          'label': '是否在线',
          'hidden': false,
          'sort': 5
        },
        {
          'name': 'sn',
          'label': 'SN',
          'hidden': true,
          'sort': 6
        },
        {
          'name': 'online_count',
          'label': '累计在线时间',
          'hidden': true,
          'sort': 7
        },
        {
          'name': 'firmware_version',
          'label': '固件版本号',
          'hidden': true,
          'sort': 8
        }
      ],
      exporting: false,
      startDate: '',
      endDate: '',
      query: '',
      sortOrders: sortOrders,
      sortKey: '',
      searching: false,
      visibility: {
        label: this.$t('common.all'),
        value: 'all'
      },
      visibilityOptions: locales[Vue.config.lang].data.DEVICE_VISIBILITY_OPTIONS,
      rangeOption: {
        label: this.$t('common.any'),
        value: 'any'
      },
      timeRangeOptions: locales[Vue.config.lang].data.TIME_RANGE_OPTIONS,
      devices: [],
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      // querying: false,
      loadingData: false,
      queryTypeOptions: [
        { label: this.$t('operation.product.device.manager.mac'), value: 'mac' },
        { label: this.$t('operation.product.device.manager.device_id'), value: 'id' }
        // { label: this.$t('operation.product.device.manager.device_name'), value: 'name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      // headers: [
      //   {
      //     key: 'mac',
      //     title: this.$t('operation.product.device.manager.mac')
      //   },
      //   {
      //     key: 'id',
      //     title: this.$t('operation.product.device.manager.device_id')
      //   },
      //   {
      //     key: 'is_active',
      //     title: this.$t('operation.product.device.manager.is_active.label'),
      //     tooltip: this.$t('operation.product.device.manager.is_active.tooltip')
      //   },
      //   {
      //     key: 'active_date',
      //     title: this.$t('operation.product.device.manager.active_date'),
      //     sortType: -1
      //   },
      //   {
      //     key: 'is_online',
      //     title: this.$t('operation.product.device.manager.is_online'),
      //     sortType: -1
      //   }
      // ],
      loadingDataField: false,
      deviceFields: {},
      loadingDataPoint: false,
      dataPoints: [],
      // 统计
      statistic: {
        // 用户总数
        users: {
          options: {},
          total: 0,
          change: 0,
          data: []
        },
        // 设备
        devices: {
          // 总数
          sum: {
            options: {},
            total: 0,
            change: 0,
            data: []
          },
          // 激活设备
          activated: {
            options: {},
            total: 0,
            change: 0,
            data: []
          },
          // 在线设备
          online: {
            options: {},
            total: 0,
            change: 0,
            data: []
          }
        }
      },
      startTime: new Date(new Date() - 365 * 1000 * 60 * 60 * 24),
      endTime: new Date()
    }
  },

  computed: {
    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    deviceList () {
      var result = []
      this.devices.forEach((item) => {
        var obj = {}
        for (let key in item.device) {
          if (item.device.hasOwnProperty(key)) {
            obj[key] = item.device[key]
          }
        }
        for (let key in item.online) {
          if (item.online.hasOwnProperty(key)) {
            obj[key] = item.online[key]
          }
        }
        for (let key in item.vdevice) {
          if (item.vdevice.hasOwnProperty(key)) {
            obj[key] = item.vdevice[key]
          }
        }
        result.push(obj)
      })
      return result
    },

    // 列表数据
    tables () {
      var result = []
      var deviceModal = {}
      this.fieldKeys.forEach((key) => {
        deviceModal[key] = '-'
        // if (key === 'mac') {
        //   deviceModal[key] = '<a class="hl-red">-</a>'
        // }
      })
      this.deviceList.forEach((item) => {
        var device = _.clone(deviceModal)
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            device[key] = item[key]
          }
        }
        device.mac = '<a class="hl-red">' + item.mac + '</a>'
        device.is_active = item.is_active ? this.$t('common.yes') : this.$t('common.no')
        device.active_date = formatDate(item.active_date) || '-'
        device.is_online = item.is_online ? '<span class="hl-green">' + this.$t('common.online') + '</span>' : '<span class="hl-gray">' + this.$t('common.offline') + '</span>'
        device.online_count = item.online_count ? (item.online_count - 0).toFixed(2) + '小时' : '-'
        device.prototype = item

        result.push(device)
      })
      return result
    },

    // 字段列表
    fields () {
      var result = []
      // 当前基本字段 接口有的话取接口的 没有的话取默认值
      var baseFields = this.base_fields
      if (this.deviceFields.base_fields && this.deviceFields.base_fields.length > 0) {
        baseFields = this.deviceFields.base_fields
      }
      baseFields.forEach((item, index) => {
        var field = _.clone(item)
        field.category = 'base_fields'
        result.push(field)
      })
      // 计算当前产品数据端点 更新页面数据端点字段
      this.dataPoints.forEach((item, index) => {
        var dataPoint = {
          'category': 'datapoints',
          'index': item.index,
          'name': item.name,
          'label': item.name,
          'hidden': true,
          'sort': baseFields.length + this.dataPoints.length + index
        }
        this.deviceFields.datapoints && this.deviceFields.datapoints.forEach((item2) => {
          if (item2.index === dataPoint.index && item2.name === dataPoint.name) {
            dataPoint.label = item2.label
            dataPoint.hidden = item2.hidden
            dataPoint.sort = item2.sort
          }
        })
        result.push(dataPoint)
      })

      var snapshotShuffle = this.deviceFields.snapshot_shuffle || []
      snapshotShuffle.forEach((item, index) => {
        var field = _.clone(item)
        field.category = 'snapshot_shuffle'
        result.push(field)
      })
      // 所有字段排序
      result.sort((a, b) => {
        return a.sort - b.sort
      })
      // 所有字段重新计算索引
      result.forEach((item, index) => {
        item.sort = index + 1
      })
      return result
    },

    fieldKeys () {
      var result = []
      this.fields.forEach((item) => {
        if (item.hidden) return
        result.push(item.name)
      })
      return result
    },

    deviceKeys () {
      var result = []
      result = ['mac', 'id', 'name', 'is_active', 'sn', 'active_date', 'firmware_version']
      return result
    },

    vDevicekeys () {
      var ignore = this.deviceKeys.concat(['is_online'])
      var result = []
      result = this.fieldKeys.filter((item) => {
        return ignore.indexOf(item) === -1
      })
      return result
    },

    headers () {
      var result = []
      this.fields.forEach((item) => {
        if (item.hidden) return
        var header = {
          key: item.name,
          title: item.label
        }

        if (item.name === 'is_active') {
          header.tooltip = this.$t('operation.product.device.manager.is_active.tooltip')
        }

        if (item.name === 'active_date') {
          header.sortType = this.sortOrders['active_date'] === 'asc' ? 1 : -1
        }

        if (item.name === 'is_online') {
          header.sortType = this.sortOrders['is_online'] === 'asc' ? 1 : -1
        }

        result.push(header)
      })
      return result
    },

    // 基本筛选条件
    baseCondition () {
      var condition = {
        // filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login', 'sn', 'online_count', 'firmware_version'],
        filter: {
          device: this.deviceKeys,
          vdevice: this.vDevicekeys,
          online: ['is_online']
        },
        // order: this.sortOrders,
        order: {
          device: {},
          vDevice: {},
          online: {}
        },

        query: {
          '$logical': 'AND',
          device: {},
          vDevice: {},
          online: {}
        }
      }

      if (this.sortKey === 'is_online') {
        condition.order.online = {
          'is_online': this.sortOrders['is_online']
        }
      } else if (this.deviceKeys && this.deviceKeys.indexOf(this.sortKey) > -1) {
        condition.order.device[this.sortKey] = this.sortOrders[this.sortKey]
      } else if (this.vDeviceKeys && this.vDeviceKeys.indexOf(this.sortKey) > -1) {
        condition.order.vdevice[this.sortKey] = this.sortOrders[this.sortKey]
      }

      if (this.query.length > 0) {
        this.currentPage = 1
        condition.query.device[this.queryType.value] = this.queryType.value === 'id' ? { $eq: Number(this.query) } : { $like: this.query }
      }

      if (this.rangeOption.value === 'specified') {
        condition.query.device['active_date'] = {
          '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
          '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
        }
      }

      switch (this.visibility.value) {
        case 'online':
          condition.query.online['is_online'] = { $eq: true }
          break
        case 'offline':
          condition.query.online['is_online'] = { $eq: false }
          break
        case 'active':
          condition.query.device['is_active'] = { $eq: true }
          break
        case 'inactive':
          condition.query.device['is_active'] = { $eq: false }
          break
        default:
      }

      return condition
    },

    // 列表查询条件
    queryCondition () {
      let condition = _.cloneDeep(this.baseCondition)

      condition.limit = this.countPerPage
      condition.offset = (this.currentPage - 1) * this.countPerPage

      return condition
    },

    // 导出CSV条件参数
    exportParams () {
      let condition = _.cloneDeep(this.baseCondition)
      // condition.filter = ['id', 'name', 'mac', 'sn', 'is_active', 'active_date', 'is_online', 'last_login', 'mcu_mod', 'mcu_version', 'firmware_mod', 'firmware_version', 'corp_id', 'product_id', 'region_id', 'create_time']

      return {
        name: '设备列表',
        describe: '设备列表',
        type: 1,
        params: condition,
        extend: {
          product_id: this.$route.params.id
        }
      }
    }
  },

  route: {
    data () {
      this.query = ''
      this.originAddModel = _.clone(this.addModel)
      this.currentPage = 1
      this.getDataPoint()
      this.getField(() => {
        this.getDevices()
      })

      // getProductSummary 方法来自 productSummaryMixin
      this.getProductSummary()
    }
  },

  methods: {
    /**
     * 获取字段
     */
    getField (fn) {
      this.loadingDataField = true
      api.custom.field.getCustomFieldConfig(this.$route.params.id).then((data) => {
        this.deviceFields = data || {}
        // if (data.base_fields && data.base_fields.length) {
        // }
        this.loadingDataField = false
        fn && fn()
      }).catch((res) => {
        this.loadingDataField = false
        this.handleError(res)
      })
    },

    /**
     * 获取数据端点
     * @return {[type]} [description]
     */
    getDataPoint () {
      this.loadingDataPoint = true
      api.product.getDatapoints(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.dataPoints = res.data
          this.loadingDataPoint = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingDataPoint = false
      })
    },

    /**
     * 处理导出 CSV 按钮点击
     */
    onExportBtnClick () {
      if (this.exporting) {
        return
      }

      this.exporting = true
      api.exportTask.createTask(this.exportParams).then((res) => {
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
     * 处理时间区段改变
     */
    onRangeOptionChange () {
      if (this.rangeOption.value === 'any') {
        this.getDevices()
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
      this.getDevices()
    },

    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getDevices()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getDevices()
    },

    /**
     * 跳转至设备详情
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    linkToDetails (table) {
      this.$route.router.go(`${this.$route.path}/${table.prototype.id}`)
    },

    // 获取设备列表
    getDevices (reset) {
      if (this.queryType.value === 'id') {
        if (this.query - 0 > 2100000000) {
          this.showNotice({
            type: 'error',
            content: this.$t('operation.product.device.manager.query_device_id_error')
          })
          return
        }
      }
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      // api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
      api.device.getAggregateDevices(this.$route.params.id, this.queryCondition).then((res) => {
        this.devices = res.data.list
        this.total = res.data.count
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getDevices(true)
      }
    },

    // 排序
    sortBy (key) {
      if (typeof key === 'object') {
        key = key.key
      }
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] === 'asc' ? 'desc' : 'asc'
      this.getDevices()
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getDevices()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.statistic-group
  border-top 1px solid default-border-color
</style>
