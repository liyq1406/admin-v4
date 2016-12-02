<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.warranty.repair.main_title') }}</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select :label="selectedProduct.name" @change="getOrderWorkList" width="110px" size="small">
            <span slot="label">{{ $t('operation.warranty.product') }}</span>
            <select v-model="selectedProduct">
              <option :value="opt" v-for="opt in products">{{ opt.name }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-range-picker @timechange = "getSpecial"></date-time-range-picker>
        </div>
      </div>
    </div>
    <div class="row statistic-group mb20">
      <div class="col-6">
        <statistic :total="repairSummary.unrepair.total" :title="repairSummary.unrepair.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="repairSummary.repairing.total" :title="repairSummary.repairing.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="repairSummary.today.total" :change="repairSummary.today.change" :title="repairSummary.today.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="repairSummary.week.total" :change="repairSummary.today.change" :title="repairSummary.week.title" align="left"></statistic>
      </div>
    </div>
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="action-bar">
          <button class="btn btn-primary" @click="onAddBtnClick"><i class="fa fa-plus"></i>{{ $t('operation.warranty.repair.add') }}</button>
        </div>
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <x-select :label="queryType.label" width='110px' size="small">
                  <span slot="label">{{ $t('common.status') }}</span>
                  <select v-model="queryType" @change="getOrderWorkList(true)">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
              </div>

              <span class="ml10">{{ $t('operation.product.device.alert.time') }}: </span>
              <x-select width="98px" size="small" :label="rangeOption.label">
                <select v-model="rangeOption" @change="onRangeOptionChange">
                  <option v-for="option in timeRangeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <date-time-range-picker v-if="rangeOption.value === 'specified'" @timechange="onTimeChange" :start-offset="365" :show-time="false"></date-time-range-picker>

            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="getOrderWorkList(true)" :placeholder="$t('operation.warranty.repair.search_placeholder')" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="" @press-enter="getOrderWorkList(true)">
                  <button slot="search-button" @click="getOrderWorkList(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :rows="rows" :page="page" @tbody-id="goDetails" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import locales from 'consts/locales/index'
import { warrantyMixins } from '../../mixins'
import api from 'api'
import * as config from 'consts/config'
import formatDate from 'filters/format-date'

export default {
  name: 'OrderList',

  mixins: [warrantyMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  components: {
  },

  data () {
    return {
      exporting: false,
      token: JSON.parse(window.localStorage.pluginsToken)[this.$route.params.app_id].token,
      useTime: false,
      startTimePick: '',
      endTimePick: '',
      selectedProduct: {},
      name: '',
      key: '',
      curProvince: {},
      curCity: {},
      curDistrict: {},
      startDate: '',
      endDate: '',
      status: {
        label: this.$t('common.all'),
        value: 0
      },
      searching: false,
      statusOptions: [{
        label: this.$t('common.all'),
        value: 0
      }, {
        label: this.$t('operation.warranty.repair.status_options.received'),
        value: 1
      }, {
        label: this.$t('operation.warranty.repair.status_options.processing'),
        value: 2
      }, {
        label: this.$t('operation.warranty.repair.status_options.failed'),
        value: 3
      }, {
        label: this.$t('operation.warranty.repair.status_options.finished'),
        value: 4
      }],
      workOrders: [],
      loadingData: false,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      total: 0,
      queryTypeOptions: [
        { label: this.$t('common.all'), value: 'all' },
        { label: this.$t('operation.warranty.repair.query_types.pending'), value: 0 },
        { label: this.$t('operation.warranty.repair.query_types.processing'), value: 1 },
        { label: this.$t('operation.warranty.repair.query_types.finished'), value: 2 }
      ],
      queryType: {
        label: this.$t('common.all'),
        value: 'all'
      },
      query: '',
      branchs: [],
      repairSummary: {
        unrepair: {
          total: 0,
          title: this.$t('operation.warranty.repair.summary.all')
        },
        repairing: {
          total: 0,
          title: this.$t('operation.warranty.repair.summary.processing')
        },
        today: {
          total: 0,
          change: 0,
          title: this.$t('operation.warranty.repair.summary.today')
        },
        week: {
          total: 0,
          change: 0,
          title: this.$t('operation.warranty.repair.summary.week')
        }
      },
      rangeOption: {
        label: this.$t('common.any'),
        value: 'any'
      },
      timeRangeOptions: locales[Vue.config.lang].data.TIME_RANGE_OPTIONS,
      startTime: new Date(new Date() - 365 * 1000 * 60 * 60 * 24),
      endTime: new Date(),
      headers: [
        {
          key: 'id',
          title: this.$t('operation.warranty.repair.columns.id')
        },
        {
          key: 'create_date',
          title: this.$t('operation.warranty.repair.columns.create_date')
        },
        {
          key: 'person',
          title: this.$t('operation.warranty.repair.columns.person')
        },
        {
          key: 'content',
          title: this.$t('operation.warranty.repair.columns.content'),
          class: 'w200'
        },
        // {
        //   key: 'addr',
        //   title: '地点'
        // },
        // {
        //   key: 'level',
        //   title: '维修等级',
        //   class: 'tac'
        // },
        {
          key: 'state',
          title: this.$t('operation.warranty.repair.columns.state'),
          class: 'tac'
        }
      ]
    }
  },

  computed: {
    page () {
      return {
        currentPage: this.currentPage,
        countPerPage: this.countPerPage,
        total: this.total
      }
    },
    rows () {
      var result = []
      let resetState = (state) => {
        var result = [
          {
            text: this.$t('operation.warranty.repair.query_types.pending'),
            color: '#6699CC'
          },
          {
            text: this.$t('operation.warranty.repair.query_types.processing'),
            color: '#CC6600'
          },
          {
            text: this.$t('operation.warranty.repair.query_types.finished'),
            color: '#090'
          }
        ]
        var html = '<div class="state" style="color: ' + result[state - 0].color + '">' + result[state - 0].text + '</div>'
        return html
      }

      this.workOrders.map((item) => {
        var workOrder = {
          id: '<a class="hl-red">' + item._id + '</a>',
          // mac: item.mac,
          create_date: formatDate(item.create_time),
          person: item.assigned_name,
          content: item.remark,
          // addr: item.addr,
          // level: resetLevel(item.level),
          // state: item.state - 0 === 1 ? '维修中' : '待处理',
          state: resetState(item.status || 0),
          prototype: item
        }
        result.push(workOrder)
      })
      return result
      // function resetLevel (state) {
      //   var result = [
      //     {
      //       text: '一级',
      //       backgroundColor: '#ff9966'
      //     },
      //     {
      //       text: '二级',
      //       backgroundColor: '#9cc'
      //     },
      //     {
      //       text: '三级',
      //       backgroundColor: '#cb4a52'
      //     }
      //   ]
      //   var html = '<div class="level" style="color:#FFF; background-color: ' + result[state - 1].backgroundColor + '">' + result[state - 1].text + '</div>'
      //   return html
      // }
    },

    // 基本筛选条件
    baseCondition () {
      var condition = {
        filter: ['_id', 'assigned_id', 'create_time', 'product_id', 'product_sn', 'remark', 'status', 'assigned_name'],
        order: {'create_time': -1},
        query: {}
      }

      condition.query.product_id = {
        $in: [this.selectedProduct.id]
      }

      if (this.rangeOption.value === 'specified') {
        condition.query['create_time'] = {
          '$gte': formatDate(this.startTime, 'yyyy-MM-ddT00:00:00.000Z', true),
          '$lte': formatDate(this.endTime, 'yyyy-MM-ddT23:59:59.999Z', true)
        }
      }

      if (this.queryType.value !== 'all') {
        condition.query.status = this.queryType.value
      }
      if (this.useTime === true) {
        condition.query.create_time = {
          $gte: {'@date': this.startTimePick},
          $lte: {'@date': this.endTimePick}
        }
      }

      // 取地区 省市区
      // if (this.curProvince.name !== this.$t('common.any')) {
      //   condition.query.province = this.curProvince.name
      // }
      // if (this.curCity.name !== this.$t('common.any')) {
      //   condition.query.city = this.curCity.name
      // }
      // if (this.curDistrict.name !== this.$t('common.any')) {
      //   condition.query.district = this.curDistrict.name
      // }
      // 去工单状态 过期和未过期
      if (this.status.value !== 0) {
        condition.query.status = this.status.label
      }
      // 取搜索条件
      // if (this.query !== '') {
      //   if (this.queryType.value === 'branch') {
      //     var ids = []
      //     this.branchs.forEach((item) => {
      //       ids.push({'@data': item._id})
      //     })
      //     condition.query.branch_id = {'$in': ids}
      //   } else {
      //     condition.query[this.queryType.value] = {$regex: this.key, $options: 'i'}
      //   }
      // }
      if (this.query !== '') {
        condition.query._id = {$in: [this.query]}
      }
      // 取时间条件
      if (this.startDate !== undefined && this.startDate !== '') {
        if (this.endDate === '') { // 只有开始时间
          condition.query.create_time = {'$gte': {'@date': new Date(this.startDate)}}
        } else if (this.endDate !== '') { // 都不为空
          condition.query.create_time = {'$gte': {'@date': new Date(this.startDate)}, '$lte': {'@date': new Date(this.endDate)}}
        }
      } else {
        if (this.startDate !== undefined && this.endDate !== '') { // 只有结束时间
          condition.query.create_time = {'$lte': {'@date': new Date(this.endDate)}}
        }
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
      return {
        name: '维修列表',
        describe: '维修列表',
        type: 6,
        params: this.baseCondition,
        extend: {
          app_id: this.$route.params.app_id
        }
      }
    }
  },

  route: {
    data () {
      // this.getOrderWorkList()
      this.init()
      this.getSummary()
    }
  },

  ready () {
  },

  watch: {
    products () {
      this.init()
    }
  },

  methods: {
    /**
     * 处理时间区段改变
     */
    onRangeOptionChange () {
      if (this.rangeOption.value === 'any') {
        this.getOrderWorkList(true)
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
      this.getOrderWorkList(true)
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
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getOrderWorkList()
    },
    toggleSearching () {
      this.searching = !this.searching
    },

    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getOrderWorkList(true)
    },
    init () {
      this.selectedProduct = this.products[0] || {}
      if (this.products.length > 0) {
        this.getOrderWorkList()
      }
    },
    getSpecial (start, end) {
      this.useTime = true
      this.startTimePick = start
      this.endTimePick = end
      this.getOrderWorkList()
    },
    goDetails (table) {
      this.$route.router.go(this.$route.path + '/' + table.prototype._id)
    },
    // goInfo (table, header, index) {
    //   console.log(table)
    //   this.$route.router.go('/operation/plugins/warranty/' + this.$route.params.app_id + '/work-orders/repair/' + table.prototype.id)
    // },
    // 获取概览
    getSummary () {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      api.warranty.getSummary(this.$route.params.app_id).then((res) => {
        this.repairSummary.unrepair.total = res.data.untreatedTotal
        this.repairSummary.repairing.total = res.data.treatedTotal
        this.repairSummary.today.total = res.data.dayCount
        this.repairSummary.today.change = Math.round(res.data.dayCountPercent)
        this.repairSummary.week.total = res.data.sevenCount
        this.repairSummary.week.change = Math.round(res.data.sevenCountPercent)
      }).catch((err) => {
        this.handleError(err)
      })
    },
    // 获取工单列表
    getOrderWorkList (reset) {
      // if (typeof querying !== 'undefined') {
      //   this.currentPage = 1
      // }

      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      this.loadingData = true
      // 如果需要检索网点名，需要先通过网点名获取branchid。再通过branchid搜索
      // if (this.key !== '' && this.queryType.value === 'branch') {
      //   this.getBranchIdByName(this.key)
      //   return
      // }
      if (reset) {
        this.currentPage = 1
      }

      api.warranty.getOrderWorkList(this.$route.params.app_id, this.queryCondition).then((res) => {
        this.total = res.data.count
        this.workOrders = res.data.list
        this.loadingData = false
      }).catch((err) => {
        this.handleError(err)
        this.loadingData = false
      })
    },
    getBranchIdByName (name) {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      var condition = {
        filter: [],
        limit: 1,
        offset: 0,
        order: {},
        query: {}
      }
      condition.query.name = {$regex: name, $options: 'i'}
      api.warranty.getBranchList(this.$route.params.app_id, condition).then((res) => {
        this.branchs = res.data.list
        api.warranty.getOrderWorkList(this.$route.params.app_id, this.queryCondition).then((res) => {
          this.total = res.data.count
          this.workOrders = res.data.list
          this.loadingData = false
        }).catch((err) => {
          this.handleError(err)
          this.loadingData = false
        })
      }).catch((err) => {
        this.handleError(err)
        this.loadingData = false
      })
    },
    onAddBtnClick () {
      this.$route.router.go({path: 'add', append: true})
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../../../assets/stylus/common'

.table
  .level
    display inline-block
    width 50px
</style>
