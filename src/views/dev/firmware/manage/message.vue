<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="filter-bar">
        <div class="filter-group fl">
          <div class="filter-group-item">
            <x-select v-else width="200px" placeholder="请选择产品" :label="currProduct.name" size="small">
              <span slot="label">产品：</span>
              <select v-model="currProduct" name="product" @change="Productstatus">
                <option v-for="product in products" :value="product">{{ product.name }}</option>
              </select>
            </x-select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <chart :options="versionOptions" :loading="loadingSummary" height="320px"></chart>
        </div>
        <div class="col-11 col-offset-1 data-table-wrap">
          <div class="data-table">
            <table class="table">
              <thead>
                <tr>
                  <th>版本号</th>
                  <th>设备数/占比</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="warningLevel.length > 0">
                  <tr v-for="item in warningLevel">
                    <td>{{item.name}}</td>
                    <td>{{ item.value }}/{{ item.percent | toPercentage }}</td>
                  </tr>
                </template>
                <tr v-if="warningLevel.length === 0">
                  <td colspan="3"  class="tac">
                    <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="data-table with-loading">
        <div class="filter-bar">
          <div class="filter-group">
            <span>明细</span>

            <!-- <span class="ml10">{{ this.$t('operation.user.list.columns.create_date') }}: </span>
            <x-select width="98px" size="small" :label="rangeOption.label">
              <select v-model="rangeOption" @change="onRangeOptionChange">
                <option v-for="option in timeRangeOptions" :value="option">{{ option.label }}</option>
              </select>
            </x-select>
            <date-time-range-picker v-if="rangeOption.value === 'specified'" @timechange="onTimeChange" :start-offset="365" :show-time="false"></date-time-range-picker> -->

          </div>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th width="10%">固件版本号</th>
              <th>版本说明</th>
              <th width="8%">固件类型</th>
              <th width="6%">识别码</th>
              <th width="15%">添加日期</th>
              <th width="8%">文件大小</th>
              <th width="26%">MD5</th>
              <th width="6%" class="tac">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="firmwares.length > 0">
              <tr v-for="firmware in firmwares | orderBy 'version'">
                <td>{{ firmware.version }}</td>
                <td>{{ firmware.description }}</td>
                <td><span v-if="firmware.type===1">WIFI</span><span v-if="firmware.type===2">MCU</span><span v-if="firmware.type===3">子设备</span></td>
                <td><span v-if="firmware.identify===0">-</span><span v-else>{{ firmware.identify }}</span></td>
                <td>{{ firmware.create_date | formatDate }}</td>
                <td>{{ firmware.file_size | prettyBytes }}</td>
                <td>{{ firmware.file_md5 }}</td>
                <td class="tac">
                  <!-- <button @click="onEditFirmware(firmware)" class="btn btn-link btn-mini">{{ $t('common.edit') }}</button> -->
                  <button v-link="{ path: '/dev/firmware/edit/' + currProduct.id + '/' + firmware.id }" class="btn btn-link btn-mini">{{ $t('common.edit') }}</button>
                </td>
              </tr>
            </template>
            <tr v-if="firmwares.length === 0 && !loadingData">
              <td colspan="8" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pagination v-if="total > 0" :total="total" :current.sync="currentPage"  :count-per-page="countPerPage "@count-update="pageCountUpdate"  @page-update="currentPageChange"></pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import locales from 'consts/locales/index'
import formatDate from 'filters/format-date'
import api from 'api'
import * as config from 'consts/config'
// import { productSummaryMixin, setCurrProductMixin } from './mixins'
import Chart from 'components/chart/index'

export default {
  name: 'DeviceList',
  components: {
    Chart
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
      currProduct: {},
      products: [],
      warningLevel: [],
      firmwares: [
        // {
        //   content: '这是描述',
        //   code: '123',
        //   version: 'v-1.0',
        //   type: 'WIFI',
        //   add_date: '2016-08-16 20:00:00'
        // },
        // {
        //   content: '这是描述',
        //   code: '123',
        //   version: 'v-1.0',
        //   type: 'WIFI',
        //   add_date: '2016-08-16 20:00:00'
        // },
        // {
        //   content: '这是描述',
        //   code: '123',
        //   version: 'v-1.0',
        //   type: 'WIFI',
        //   add_date: '2016-08-16 20:00:00'
        // },
        // {
        //   content: '这是描述',
        //   code: '123',
        //   version: 'v-1.0',
        //   type: 'WIFI',
        //   add_date: '2016-08-16 20:00:00'
        // },
        // {
        //   content: '这是描述',
        //   code: '123',
        //   version: 'v-1.0',
        //   type: 'WIFI',
        //   add_date: '2016-08-16 20:00:00'
        // }
      ],
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      loadingData: false,
      queryTypeOptions: [
        { label: '固件类型', value: 'type' },
        { label: '识别码', value: 'code' }
      ],
      queryType: {
        label: '固件类型',
        value: 'type'
      },
      rangeOption: {
        label: this.$t('common.any'),
        value: 'any'
      },
      timeRangeOptions: locales[Vue.config.lang].data.TIME_RANGE_OPTIONS,
      startTime: new Date(new Date() - 365 * 1000 * 60 * 60 * 24),
      endTime: new Date()
    }
  },
  // vuex: {
  //   getters: {
  //     products: ({ products }) => products.all
  //   }
  // },

  computed: {
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },
    /**
     * 列表查询条件
     * @return {[type]} [description]
     */
    queryCondition () {
      var condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {}
      }

      if (this.rangeOption.value === 'specified') {
        condition.query['create_date'] = {
          '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
          '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
        }
      }

      return condition
    },

    // 版本信息图表配置
    versionOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          y: 20,
          data: _.map(this.warningLevel, 'name')
        },
        series: [{
          name: '数量',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.warningLevel,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    }
  },
  // 监听属性变动
  watch: {
    // products () {
    //   this.getFirstProduct()
    //   if (this.products.length > 0) {
    //     // this.getTagTrend()
    //     // this.getAlertList()
    //     this.sortRegion()
    //   }
    // }
  },

  route: {
    data () {
      // this.getFirstProduct()
      this.getProducts()
      // this.sortRegion()
    }
  },
  ready () {
    this.getProducts()
    // this.sortRegion()
  },

  methods: {
    /**
     * 当前页码改变
     * @param  {[type]} page [description]
     * @return {[type]}      [description]
     */
    currentPageChange (page) {
      this.currentPage = page
      this.getFirmwares()
    },
    /**
     * 每页显示数量改变
     * @param  {[type]} count [description]
     * @return {[type]}       [description]
     */
    pageCountUpdate (count) {
      this.countPerPage = count - 0
      this.currentPage = 1
      this.getFirmwares()
    },
    // 获取第一个产品@author weijie
    // getFirstProduct () {
    //   this.currentProduct = this.products[0] || {}
    // },
    // 获取产品列表
    getProducts () {
      // console.log(111)
      this.loadingProducts = true
      api.product.all().then((res) => {
        this.loadingProducts = false
        this.products = res.data
        if (this.products.length === 0) {
          return
        }
        this.currProduct = this.products[0]
        this.getFirmwares()
        this.getTrend()
      }).catch((res) => {
        this.handleError(res)
        this.loadingProducts = false
      })
    },
    // 获取分布情况
    getTrend () {
      api.firmware.trend(this.currProduct.id).then((res) => {
        if (res.status === 200) {
          // console.log(res.data)
          var arr = []
          res.data.forEach((item) => {
            var obj = {}
            obj.name = '版本' + item.firmware_version
            obj.value = item.total
            arr.push(obj)
          })
          if (arr.length === res.data.length) {
            console.log(arr)
            this.warningLevel = arr
            this.sortRegion(this.warningLevel)
          }
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * 获取固件列表
     */
    getFirmwares () {
      // TODO 改接口 需要做分页功能
      this.loadingFirmwares = true
      api.product.getFirmwares(this.currProduct.id, this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.firmwares = res.data.list
          this.total = res.data.count
          this.loadingFirmwares = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingFirmwares = false
      })
    },
    // 更改应用后获取列表与状态
    Productstatus () {
      this.currentPage = 1
      this.getFirmwares()
      this.getTrend()
    },
    sortRegion (warningLevel) {
      // console.log(warningLevel)
      // 由大到小排序
      warningLevel.sort((a, b) => {
        if (a.value > b.value) {
          return -1
        } else if (a.value < b.value) {
          return 1
        } else {
          return 0
        }
      })
      // console.log(arr)

      if (warningLevel.length > 10) {
        this.numToPercent(warningLevel.slice(0, 10), 'value')
        this.warningLevel = warningLevel
      } else {
        this.numToPercent(warningLevel, 'value')
        this.warningLevel = warningLevel
      }
      // console.log(arr)
    },
    numToPercent (arr, field) {
      var total = 0
      arr.forEach((item) => {
        total += item[field]
      })

      arr.map((item) => {
        item.percent = item[field] / total
      })
      return arr
    },

    /**
     * 处理时间区段改变
     */
    onRangeOptionChange () {
      if (this.rangeOption.value === 'any') {
        this.getFirmwares(true)
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
      this.getFirmwares(true)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.statistic-group
  border-top 1px solid default-border-color
</style>
