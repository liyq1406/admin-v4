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
          <x-table :headers="headers" :rows="rows" :page="page" :loading="loadingData" @theader-device--active-date="sortBy" @theader--online-is-online="sortBy" @tbody-device--mac="linkToDetails" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>

          <!-- {{snapshotShuffle | json}} -->
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
      // 数据统计类型
      SNAPSHOT_STATISTICS_TYPES: {
        '1': 'max',
        '2': 'min',
        '3': 'avg',
        '4': 'sum'
      },

      // 设备字段
      DEVICEFIELD: [
        'id',
        'mac',
        'name',
        'is_active',
        'active_date',
        'mcu_mod',
        'mcu_version',
        'firmware_mod',
        'firmware_version',
        'product_id',
        'region_id',
        'sn',
        'domain',
        'create_time',
        'creator_id',
        'creator_type',
        'tags',
        'dealer_scope',
        'heavy_buyer',
        'groups'
      ],

      // 虚拟设备字段列表
      VDEVICEFIELD: [
        'cm_id',
        'ip',
        'online_count',
        'last_login',
        'last_logout',
        'last_update'
      ],

      // 在线字段列表
      ONLINEFIELD: [
        'is_online',
        'last_login',
        'last_login_ip'
      ],

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
      // 正在导出标志位
      exporting: false,
      // 开始时间
      startDate: '',
      // 结束时间
      endDate: '',
      // 搜索条件
      query: '',
      // 排序
      sortOrders: sortOrders,
      // 当前排序字段
      sortKey: '',
      // 正在搜索标志位
      searching: false,
      // 筛选条件
      visibility: {
        label: this.$t('common.all'),
        value: 'all'
      },
      // 筛选选项
      visibilityOptions: locales[Vue.config.lang].data.DEVICE_VISIBILITY_OPTIONS,
      // 时间筛选条件
      rangeOption: {
        label: this.$t('common.any'),
        value: 'any'
      },
      // 时间筛选条件选项
      timeRangeOptions: locales[Vue.config.lang].data.TIME_RANGE_OPTIONS,
      // 设备列表
      devices: [],
      // 列表总数
      total: 0,
      // 当前页码
      currentPage: 1,
      // 页面数
      countPerPage: config.COUNT_PER_PAGE,
      // querying: false,
      // 正在加载数据
      loadingData: false,
      // 搜索选项
      queryTypeOptions: [
        { label: this.$t('operation.product.device.manager.mac'), value: 'mac' },
        { label: this.$t('operation.product.device.manager.device_id'), value: 'id' }
        // { label: this.$t('operation.product.device.manager.device_name'), value: 'name' }
      ],
      // 搜索条件类型
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      // 正在加载字段
      loadingDataField: false,
      // 设备字段列表
      deviceFields: {},
      // 正在加载数据端点标志位
      loadingDataPoint: false,
      // 数据端点列表
      dataPoints: [],
      // 快照统计数据列表
      // snapshotShuffleData: null,
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
      // 开始时间
      startTime: new Date(new Date() - 365 * 1000 * 60 * 60 * 24),
      // 结束时间
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
    // 设备列表
    deviceList () {
      var result = []
      this.devices.forEach((item) => {
        var obj = {}
        for (var key1 in item) {
          if (key1 === 'snapshot_shuffle') {
            this.snapshotShuffle.forEach((snapshot) => {
              if (snapshot.deviceId === item.device.id) {
                obj[snapshot.key] = snapshot.value
              }
            })
          } else {
            if (item.hasOwnProperty(key1)) {
              for (let key2 in item[key1]) {
                if (item[key1].hasOwnProperty(key2)) {
                  obj[`${key1}--${key2}`] = item[key1][key2]
                }
              }
            }
          }
        }
        result.push(obj)
      })
      return result
    },
    // 快照统计规则
    snapshotShuffle () {
      var result = []
      if (!this.deviceFields.snapshot_shuffle || !this.deviceFields.snapshot_shuffle.length) return []
      var showSnapshotShuffleFields = this.deviceFields.snapshot_shuffle.filter((item) => !item.hidden)
      showSnapshotShuffleFields.forEach((field) => {
        this.devices.forEach((device) => {
          var obj = {
            key: 'snapshot_shuffle--' + field.name,
            deviceId: device.device.id,
            value: this.getSnapshotShuffleValue(field, device)
          }
          result.push(obj)
        })
      })
      return result
    },

    // 列表数据
    rows () {
      var result = []
      var deviceModal = {}
      this.fieldKeys.forEach((key) => {
        deviceModal[key] = '-'
      })
      this.deviceList.forEach((item) => {
        var device = _.clone(deviceModal)
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            device[key] = item[key] || '-'
          }
        }
        device['device--mac'] = '<a class="hl-red">' + (item['device--mac'] || '-') + '</a>'
        device['device--is_active'] = item['device--is_active'] ? this.$t('common.yes') : this.$t('common.no')
        device['device--active_date'] = formatDate(item['device--active_date']) || '-'
        device['online--is_online'] = item['online--is_online'] ? '<span class="hl-green">' + this.$t('common.online') + '</span>' : '<span class="hl-gray">' + this.$t('common.offline') + '</span>'
        device['vdevice--online_count'] = item['vdevice--online_count'] - 0 >= 0 ? (item['vdevice--online_count'] - 0).toFixed(2) + '小时' : '-'
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

    // 字段key列表
    fieldKeys () {
      var result = []
      this.fields.forEach((item) => {
        if (item.hidden) return
        result.push(this.resetFieldKey(item).key)
      })
      return result
    },

    // 表格头部信息列表
    headers () {
      var result = []
      this.fields.forEach((item) => {
        if (item.hidden) return
        var key = this.resetFieldKey(item).key
        var header = {
          key: key,
          title: item.label
        }

        if (header.key === 'device--is_active') {
          header.tooltip = this.$t('operation.product.device.manager.is_active.tooltip')
        }

        if (header.key === 'device--active_date') {
          header.sortType = this.sortOrders['active_date'] === 'asc' ? 1 : -1
        }

        if (header.key === 'online--is_online') {
          header.sortType = this.sortOrders['is_online'] === 'asc' ? 1 : -1
        }

        result.push(header)
      })
      return result
    },

    // 用于发送请求的filter
    filter () {
      var result = {}
      var hasSnapshotShuffle = false
      this.fieldKeys.forEach((item) => {
        var field = item.split('--')
        if (field[0] === 'snapshot_shuffle') {
          hasSnapshotShuffle = true
        }
        result[field[0]] = result[field[0]] || []
        result[field[0]].push(field[1])
      })
      if (hasSnapshotShuffle) {
        result.snapshot_shuffle = [
          'statistic_rule_id',
          'index',
          'fineness',
          'date_start',
          'date_end',
          'sum',
          'max',
          'min',
          'avg'
        ]
      }
      return result
    },

    // 用于发送请求的统计规则条件
    computedSnapshotShuffleQuery () {
      var results = []
      this.fields.forEach((item) => {
        if (item.category !== 'snapshot_shuffle') return
        if (item.hidden) return
        var result = {
          'index': {
            '$eq': item.datapointIndex
          },
          'fineness': {
            '$eq': item.fineness
          },
          'statistic_rule_id': {
            '$eq': item.snapshot
          },
          'date': {
            '$lte': this.fieldEndTime(item),
            '$gte': this.fieldStartTime(item)
          }
        }
        results.push(result)
      })
      return results
    },

    // 基本筛选条件
    baseCondition () {
      var condition = {
        filter: this.filter,
        order: {
          device: {},
          vDevice: {},
          online: {}
        },

        query: {
          '$logical': 'AND',
          device: {},
          vDevice: {},
          online: {},
          snapshot_shuffle: this.computedSnapshotShuffleQuery
          // snapshot_shuffle: {}
        }
      }

      if (this.sortKey === 'is_online') {
        condition.order.online = {
          'is_online': this.sortOrders['is_online']
        }
      } else if (this.DEVICEFIELD.indexOf(this.sortKey) > -1) {
        condition.order.device[this.sortKey] = this.sortOrders[this.sortKey]
      } else if (this.VDEVICEFIELD.indexOf(this.sortKey) > -1) {
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
     * 获取统计规则的值
     * field: 当前字段
     * device: 当前设备数据
     */
    getSnapshotShuffleValue (field, device) {
      var result = null
      if (!device.snapshot_shuffle.list.length) return result
      var snapshotShuffleList = device.snapshot_shuffle.list || []
      var snapshotId = field.snapshot
      var datapointIndex = field.datapointIndex
      var fineness = field.fineness
      var dateStart = this.fieldStartTime(field)
      snapshotShuffleList.forEach((item) => {
        var conditions = [
          item.index - 0 === datapointIndex - 0,
          item.statistic_rule_id === snapshotId,
          item.fineness - 0 === fineness - 0,
          item.date_start.indexOf(dateStart.split('T')[0]) === 0
        ]
        // 如果条件满足
        if (conditions.every((condition) => condition)) {
          result = item[this.SNAPSHOT_STATISTICS_TYPES[field.dp_mode]]
        }
      })
      return result
    },

    /**
     * 重置字段key
     */
    resetFieldKey (field) {
      var result = {
        field: field
      }
      if (field.category === 'base_fields' && this.DEVICEFIELD.indexOf(field.name) >= 0) {
        result.key = `device--${field.name}`
      } else if (field.category === 'base_fields' && this.ONLINEFIELD.indexOf(field.name) >= 0) {
        result.key = `online--${field.name}`
      } else if (field.category === 'base_fields' && this.VDEVICEFIELD.indexOf(field.name) >= 0) {
        result.key = `vdevice--${field.name}`
      } else if (field.category === 'datapoints') {
        result.key = `vdevice--${field.name}`
      } else {
        result.key = `${field.category}--${field.name}`
      }
      return result
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
      this.$route.router.go(`${this.$route.path}/${table.prototype['device--id']}`)
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
        // this.snapshotShuffleData = res.data.list.snapshot_shuffle || []
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
    },

    /**
     * 获取当前字段开始时间
     */
    fieldStartTime (field) {
      var result = ''
      switch (field.fineness - 0) {
        // 天
        case 2:
          result = this.getFieldDay(field)
          break
        case 3:
          result = this.getFieldWeek(field)
          break
        case 4:
          result = this.getFieldMonth(field)
          break
        case 5:
          result = this.getFieldYear(field)
          break
        case 6:
          result = formatDate(new Date(0), 'yyyy-MM-ddT00:00:00.000Z', true)
          break
        default:
          break
      }
      return result
    },

    /**
     * 获取当前字段结束时间
     */
    fieldEndTime (field) {
      var result = ''
      switch (field.fineness - 0) {
        // 天
        case 2:
          result = this.getFieldDay(field, true)
          break
        case 3:
          result = this.getFieldWeek(field, true)
          break
        case 4:
          result = this.getFieldMonth(field, true)
          break
        case 5:
          result = this.getFieldYear(field, true)
          break
        case 6:
          result = formatDate(new Date(), 'yyyy-MM-ddT23:59:59.999Z', true)
          break
        default:
          break
      }
      return result
    },

    /**
     * 根据当前字段信息获取当前今天或者昨天的开始时间或者结束时间
     */
    getFieldDay (field, isEnd) {
      var isPrev = field.selectTimeType - 0 === 2
      var result = formatDate(isPrev ? (new Date() - 1000 * 60 * 60 * 24) : (new Date()), isEnd ? 'yyyy-MM-ddT23:59:59.999Z' : 'yyyy-MM-ddT00:00:00.000Z', true)
      return result
    },

    /**
     * 根据当前字段信息获取本周或者上周的开始时间或者结束时间
     */
    getFieldWeek (field, isEnd) {
      var isPrev = field.selectTimeType - 0 === 2
      var dWeekDay = new Date().getDay() - 1 + (isPrev ? 7 : 0)
      if (isEnd) {
        dWeekDay = isPrev ? (new Date().getDay() - 1) : -1
      }
      var result = formatDate(new Date() - dWeekDay * 1000 * 60 * 60 * 24, 'yyyy-MM-ddT00:00:00.000Z', true)
      return result
    },

    /**
     * 根据当前字段获取本月或者上个月的开始时间或者结束时间
     */
    getFieldMonth (field, isEnd) {
      var isPrev = field.selectTimeType - 0 === 2
      var prevMonthDays = this.monthmaxday(new Date().getFullYear(), new Date().getMonth)
      var dDay = new Date().getDate() - 1 + (isPrev ? prevMonthDays : 0)
      var result = formatDate(new Date() - dDay * 1000 * 60 * 60 * 24, 'yyyy-MM-ddT00:00:00.000Z', true)
      if (isEnd) {
        dDay = isPrev ? (new Date().getDate() - 1) : 0
        result = formatDate(new Date() - dDay * 1000 * 60 * 60 * 24, 'yyyy-MM-ddT23:59:59.999Z', true)
        'yyyy-MM-ddT23:59:59.999Z'
      }
      return result
    },

    /**
     * 根据当前字段获取今年或者去年的开始时间或者结束时间
     */
    getFieldYear (field, isEnd) {
      var isPrev = field.selectTimeType - 0 === 2
      var result = formatDate((new Date().getFullYear() - (isPrev ? 1 : 0)) + '-01-01', 'yyyy-MM-ddT00:00:00.000Z', true)
      if (isEnd) {
        result = formatDate((new Date().getFullYear()) + '-01-01', 'yyyy-MM-ddT00:00:00.000Z', true)
        if (!isPrev) {
          result = formatDate(new Date(), 'yyyy-MM-ddT23:59:59.999Z')
        }
      }
      return result
    },

    /**
     * 获取某年某月有多少天  如果月为0 自动退到上一年最后一个月
     */
    monthmaxday (year, month) { // 返回某年某月有多少天
      if (month === 0) {
        year = year - 1
        month = 12
      }
      if (month === 2) {
        if (isLeapYear(year)) {
          return 29
        } else {
          return 28
        }
      } else if (month === 4 || month === 6 || month === 9 || month === 11) {
        return 30
      } else {
        return 31
      }
      function isLeapYear (year) { // 判断闰年
        return (year % 4 === 0 && ((year % 100 !== 0) || (year % 400 === 0)))
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.statistic-group
  border-top 1px solid default-border-color
</style>
