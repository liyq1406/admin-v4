<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <search-box class="work-order-search-box" :key.sync="key" :placeholder="'请输入'+ queryType.label" @press-enter="getOrderWorkList(true)">
          <v-select width="100px" :label="queryType.label">
            <select v-model="queryType">
              <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
            </select>
          </v-select>
          <button slot="search-button" class="btn btn-primary" @click="getOrderWorkList(true)">搜索</button>
        </search-box>
      </div>

      <div class="status-bar">
        <v-select :label="statusOptions[status.value].label" width="100px" class="work-orders-select" size="small">
          <span slot="label">工单状态</span>
          <select v-model="status" @change="getOrderWorkList(true)">
            <option v-for="option in statusOptions" :value="option">{{option.label}}</option>
          </select>
        </v-select>

        <date-range-picker input-size="small" class="mr20" :from.sync="startDate" :to.sync="endDate" input-width="94px" @select-day="getOrderWorkList(true)">
          <span slot="label">创建时间</span>
        </date-range-picker>

        <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" label="所在地区" select-size="small" @province-change="getOrderWorkList(true)" @city-change="getOrderWorkList(true)" @district-change="getOrderWorkList(true)"></area-select>
      </div>

      <div class="data-table">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>工单编号</th>
              <th>客户姓名</th>
              <th>产品名称</th>
              <th>产品型号</th>
              <th>创建日期</th>
              <th>工单状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="workOrders.length > 0">
              <tr v-for="order in workOrders">
                <td>{{order._id}}</td>
                <td>{{order.linkman}}</td>
                <td>{{order.product_name}}</td>
                <td>{{order.product_sn}}</td>
                <td>{{order.create_time}}</td>
                <td>{{order.status}}</td>
                <td><a v-link="{path: '/warranty/work-orders/repair/' + order._id}" class="hl-red">查看详情</a></td>
              </tr>
            </template>

            <tr v-if="workOrders.length === 0 && !loadingData">
              <td colspan="7" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Start: 分页信息 -->
      <div class="row">
        <div class="col-8">共有{{total}}条结果</div>
        <div class="col-16">
          <pager v-if="!loadingData && total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getOrderWorkList"></pager>
        </div>
      </div>
      <!-- End: 分页信息 -->
  </div>
</template>

<script>
  import { globalMixins } from '../../../../mixins'
  import Select from '../../../../components/Select'
  import AreaSelect from '../../../../components/AreaSelect'
  import SearchBox from '../../../../components/SearchBox'
  import Pager from '../../../../components/Pager'
  import DateRangePicker from '../../../../components/DateRangePicker'
  import api from '../../../../api'

  export default {
    name: 'OrderList',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'pager': Pager,
      'date-range-picker': DateRangePicker
    },

    data () {
      return {
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
        pageCount: 10,
        total: 0,
        queryTypeOptions: [
          { label: '工单编号', value: '_id' },
          { label: '客户姓名', value: 'linkman' },
          { label: '网点', value: 'branch' }
        ],
        queryType: {
          label: '工单编号',
          value: '_id'
        },
        branchs: []
      }
    },

    route: {
      data () {
        this.getOrderWorkList()
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: [],
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: {},
          query: {}
        }

        // 取地区 省市区
        if (this.curProvince.hasOwnProperty('name')) {
          condition.query.province = this.curProvince.name
        }
        if (this.curCity.hasOwnProperty('name')) {
          condition.query.city = this.curCity.name
        }
        if (this.curDistrict.hasOwnProperty('name')) {
          condition.query.district = this.curDistrict.name
        }
        // 去工单状态 过期和未过期
        if (this.status.value !== 0) {
          condition.query.status = this.status.label
        }
        // 取搜索条件
        if (this.key !== '') {
          if (this.queryType.value === 'branch') {
            var ids = []
            this.branchs.forEach((item) => {
              ids.push({'@data': item._id})
            })
            condition.query.branch_id = {'$in': ids}
          } else {
            condition.query[this.queryType.value] = {'$like': {'@string': this.key}}
          }
        }
        // 取时间条件
        if (this.startTime !== undefined && this.startTime !== '') {
          if (this.endDate === '') { // 只有开始时间
            condition.query.create_time = {'$gte': {'@date': new Date(this.startDate)}}
          } else if (this.endDate !== '') { // 都不为空
            // 服务器未实现
          }
        } else {
          if (this.endDate !== '') { // 只有结束时间
            condition.query.create_time = {'$lte': {'@date': new Date(this.endDate)}}
          }
        }

        return condition
      }
    },

    methods: {
      getOrderWorkList (querying) {
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }

        this.loadingData = true
        // 如果需要检索网点名，需要先通过网点名获取branchid。再通过branchid搜索
        if (this.key !== '' && this.queryType.value === 'branch') {
          this.getBranchIdByName(this.key)
          return
        }

        api.warranty.getOrderWorkList(this.queryCondition).then((res) => {
          this.total = res.data.count
          this.workOrders = res.data.list
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      getBranchIdByName (name) {
        var condition = {
          filter: [],
          limit: 1,
          offset: 0,
          order: {},
          query: {}
        }
        condition.query.name = {'$like': {'@string': name}}
        api.warranty.getBranchList(condition).then((res) => {
          this.branchs = res.data.list
          api.warranty.getOrderWorkList(this.queryCondition).then((res) => {
            this.total = res.data.count
            this.workOrders = res.data.list
            this.loadingData = false
          }).catch((res) => {
            this.handleError(res)
            this.loadingData = false
          })
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
</style>
