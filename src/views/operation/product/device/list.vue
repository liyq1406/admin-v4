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
        <!-- <div class="actions">
          <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("ui.overview.add_device") }}</button>
          <label :class="{'disabled':importing}" class="btn btn-ghost btn-upload">
            <input type="file" v-el:mac-file="v-el:mac-file" name="macFile" @change.prevent="batchImport"/><i class="fa fa-reply-all"></i>{{ importing ? $t("common.handling") : $t("ui.overview.import_devices") }}
          </label>
        </div> -->
        <h2>{{ $t('operation.product.device.manager.list') }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
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
import Select from 'components/Select'
import Pager from 'components/Pager'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import locales from 'consts/locales/index'
import formatDate from 'filters/format-date'
import { globalMixins } from 'src/mixins'
import { productSummaryMixin, setCurrProductMixin } from '../mixins'
import Statistic from 'components/Statistic2'

export default {
  name: 'DeviceList',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, productSummaryMixin, setCurrProductMixin],

  components: {
    'x-select': Select,
    'x-table': Table,
    'search-box': SearchBox,
    'pager': Pager,
    DateTimeRangePicker,
    Statistic
  },

  data () {
    var sortOrders = {}
    var descProperties = ['active_date']
    var ascProperties = ['mac']

    descProperties.forEach((key) => {
      sortOrders[key] = 'desc'
    })

    ascProperties.forEach((key) => {
      sortOrders[key] = 'asc'
    })

    return {
      exporting: false,
      startDate: '',
      endDate: '',
      query: '',
      sortKey: '',
      sortOrders: sortOrders,
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
        { label: this.$t('operation.product.device.manager.device_id'), value: 'id' },
        { label: this.$t('operation.product.device.manager.device_name'), value: 'name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      headers: [
        {
          key: 'mac',
          title: this.$t('operation.product.device.manager.mac')
        },
        {
          key: 'id',
          title: this.$t('operation.product.device.manager.device_id')
        },
        {
          key: 'is_active',
          title: this.$t('operation.product.device.manager.is_active.label'),
          tooltip: this.$t('operation.product.device.manager.is_active.tooltip')
        },
        {
          key: 'active_date',
          title: this.$t('operation.product.device.manager.active_date'),
          sortType: -1
        },
        {
          key: 'is_online',
          title: this.$t('operation.product.device.manager.is_online'),
          sortType: -1
        }
      ],
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

    // 列表数据
    tables () {
      var result = []
      this.devices.forEach((item) => {
        var device = {
          id: item.id,
          mac: '<a class="hl-red">' + item.mac + '</a>',
          is_active: item.is_active ? this.$t('common.yes') : this.$t('common.no'),
          active_date: formatDate(item.active_date),
          is_online: item.is_online ? '<span class="hl-green">' + this.$t('common.online') + '</span>' : '<span class="hl-gray">' + this.$t('common.offline') + '</span>',
          prototype: item
        }
        result.push(device)
      })
      return result
    },

    // 基本筛选条件
    baseCondition () {
      var condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
        order: this.sortOrders,
        query: {}
      }

      if (this.query.length > 0) {
        this.currentPage = 1
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }

      if (this.rangeOption.value === 'specified') {
        condition.query['active_date'] = {
          '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
          '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
        }
      }

      switch (this.visibility.value) {
        case 'online':
          condition.query['is_online'] = { $in: [true] }
          break
        case 'offline':
          condition.query['is_online'] = { $in: [false] }
          break
        case 'active':
          condition.query['is_active'] = { $in: [true] }
          break
        case 'inactive':
          condition.query['is_active'] = { $in: [false] }
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
      condition.filter = ['id', 'name', 'mac', 'sn', 'is_active', 'active_date', 'is_online', 'last_login', 'mcu_mod', 'mcu_version', 'firmware_mod', 'firmware_version', 'corp_id', 'product_id', 'region_id', 'create_time']

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
      this.getDevices()

      // getProductSummary 方法来自 productSummaryMixin
      this.getProductSummary()
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
      api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
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
