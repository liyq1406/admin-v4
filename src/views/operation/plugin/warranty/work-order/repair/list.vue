<template>
  <div class="main">
    <div class="main-title">
      <h2>维保记录</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select :label="selectedProduct.name" @change="getOrderWorkList" width="110px" size="small">
            <span slot="label">产品</span>
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
        <statistic :info="repairSummary.unrepair" :title="repairSummary.unrepair.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="repairSummary.repairing" :title="repairSummary.repairing.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="repairSummary.today" :title="repairSummary.today.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="repairSummary.week" :title="repairSummary.week.title" align="left"></statistic>
      </div>
    </div>
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <x-select :label="queryType.label" width='110px' size="small">
                  <span slot="label">状态</span>
                  <select v-model="queryType" @change="getOrderWorkList(true)">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
              </div>
              <div class="filter-group-item">
                <button class="btn btn-primary" @click="onAddBtnClick"><i class="fa fa-plus"></i>添加工单</button>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm" @click.stop="onExportBtnClick" :class="{'disabled': exporting}" :disabled="exporting"><i class="fa fa-share"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="getOrderWorkList(true)" :placeholder="'输入工单编号'" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="" @press-enter="getOrderWorkList(true)">
                  <button slot="search-button" @click="getOrderWorkList(true)" class="btn"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" @tbody-id="goDetails" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { warrantyMixins } from '../../mixins'
import SearchBox from 'components/SearchBox'
import api from 'api'
import * as config from 'consts/config'
import Statistic from 'components/Statistic'
import formatDate from 'filters/format-date'

export default {
  name: 'OrderList',

  mixins: [globalMixins, warrantyMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  components: {
    'search-box': SearchBox,
    Statistic
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
        label: '全部',
        value: 0
      },
      searching: false,
      statusOptions: [{
        label: '全部',
        value: 0
      }, {
        label: '已接单',
        value: 1
      }, {
        label: '处理中',
        value: 2
      }, {
        label: '处理失败',
        value: 3
      }, {
        label: '完成',
        value: 4
      }],
      workOrders: [],
      loadingData: false,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      total: 0,
      queryTypeOptions: [
        { label: '全部', value: 'all' },
        { label: '待处理', value: 0 },
        { label: '维修中', value: 1 },
        { label: '维修完成', value: 2 }
      ],
      queryType: {
        label: '全部',
        value: 'all'
      },
      query: '',
      branchs: [],
      repairSummary: {
        unrepair: {
          total: 1,
          title: '待维修数'
        },
        repairing: {
          total: 1,
          title: '正在维修中'
        },
        today: {
          total: 1,
          change: 1,
          title: '今日维修数'
        },
        week: {
          total: 1,
          change: 1,
          title: '7日维修数'
        }
      },
      headers: [
        {
          key: 'id',
          title: '工单编号'
        },
        {
          key: 'create_date',
          title: '创建时间'
        },
        {
          key: 'person',
          title: '维修人员'
        },
        {
          key: 'content',
          title: '维修内容',
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
          title: '状态',
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
    tables () {
      var result = []
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
      function resetState (state) {
        var result = [
          {
            text: '待处理',
            color: '#6699CC'
          },
          {
            text: '维修中',
            color: '#CC6600'
          },
          {
            text: '维修完成',
            color: '#090'
          }
        ]
        var html = '<div class="state" style="color: ' + result[state - 0].color + '">' + result[state - 0].text + '</div>'
        return html
      }
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

      condition.query = {
        product_id: {
          $in: [this.selectedProduct.id]
        }
      }
      if (this.queryType.value !== 'all') {
        condition.query.status = this.queryType.value
      }
      if (this.useTime === true) {
        condition.query = {
          create_time: {
            $gte: {'@date': this.startTimePick},
            $lte: {'@date': this.endTimePick}
          }
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
