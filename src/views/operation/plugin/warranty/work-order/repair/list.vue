<template>
  <div class="main">
    <div class="main-title">
      <h2>维修工单</h2>
    </div>
    <div class="panel"></div>
    <div class="row statistic-group">
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
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <search-box class="work-order-search-box" :key.sync="key" :placeholder="'请输入'+ queryType.label" @press-enter="getOrderWorkList(true)">
            <v-select width="100px" :label="queryType.label">
              <select v-model="queryType">
                <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
              </select>
            </v-select>
            <button slot="search-button" class="btn btn-primary" @click="getOrderWorkList(true)"><i class="fa fa-search"></i></button>
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

        <div class="data-table with-loading">
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
                  <td>{{order.create_time | uniformDate}}</td>
                  <td>{{order.status}}</td>
                  <td><a v-link="{path: '/plugins/warranty/' + $route.params.app_id + '/work-orders/repair/' + order._id}" class="hl-red">查看详情</a></td>
                </tr>
              </template>

              <tr v-if="workOrders.length === 0 && !loadingData">
                <td colspan="7" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Start: 分页信息 -->
        <div class="row">
          <div class="col-8 mb40">{{{ $t('common.total_results', {count:total}) }}}</div>
          <div class="col-16">
            <pager v-if="!loadingData && total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getOrderWorkList"></pager>
          </div>
        </div>
        <!-- End: 分页信息 -->
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../../../mixins'
  import Select from 'components/Select'
  import AreaSelect from 'components/AreaSelect'
  import SearchBox from 'components/SearchBox'
  import Pager from 'components/Pager'
  import DateRangePicker from 'components/DateRangePicker'
  import api from 'api'
  import * as config from 'consts/config'
  import Statistic from 'components/Statistic'

  export default {
    name: 'OrderList',

    mixins: [globalMixins, pluginMixins],

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'pager': Pager,
      'date-range-picker': DateRangePicker,
      Statistic
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
        countPerPage: config.COUNT_PER_PAGE,
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
        branchs: [],
        repairSummary: {
          unrepair: {
            total: 23,
            title: '待维修数'
          },
          repairing: {
            total: 135,
            title: '正在维修中'
          },
          today: {
            total: 232,
            change: 124,
            title: '今日维修数'
          },
          week: {
            total: 2800,
            change: 124,
            title: '7日维修数'
          }
        }
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
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {}
        }

        // 取地区 省市区
        if (this.curProvince.name !== this.$t('common.any')) {
          condition.query.province = this.curProvince.name
        }
        if (this.curCity.name !== this.$t('common.any')) {
          condition.query.city = this.curCity.name
        }
        if (this.curDistrict.name !== this.$t('common.any')) {
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
            condition.query[this.queryType.value] = {$regex: this.key, $options: 'i'}
          }
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
      }
    },

    methods: {
      getOrderWorkList (querying) {
        var self = this
        var argvs = arguments
        var fn = self.getOrderWorkList
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }

        this.loadingData = true
        // 如果需要检索网点名，需要先通过网点名获取branchid。再通过branchid搜索
        if (this.key !== '' && this.queryType.value === 'branch') {
          this.getBranchIdByName(this.key)
          return
        }

        this.getAppToKen(this.$route.params.app_id, 'warranty').then((token) => {
          api.warranty.getOrderWorkList(this.$route.params.app_id, token, this.queryCondition).then((res) => {
            this.total = res.data.count
            this.workOrders = res.data.list
            this.loadingData = false
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'warranty'
            }
            self.handlePluginError(err, env)
            this.loadingData = false
          })
        })
      },
      getBranchIdByName (name) {
        var self = this
        var argvs = arguments
        var fn = self.getBranchIdByName
        var condition = {
          filter: [],
          limit: 1,
          offset: 0,
          order: {},
          query: {}
        }
        condition.query.name = {$regex: name, $options: 'i'}
        this.getAppToKen(this.$route.params.app_id, 'warranty').then((token) => {
          api.warranty.getBranchList(this.$route.params.app_id, token, condition).then((res) => {
            this.branchs = res.data.list
            api.warranty.getOrderWorkList(this.$route.params.app_id, token, this.queryCondition).then((res) => {
              this.total = res.data.count
              this.workOrders = res.data.list
              this.loadingData = false
            }).catch((err) => {
              var env = {
                'fn': fn,
                'argvs': argvs,
                'context': self,
                'plugin': 'warranty'
              }
              self.handlePluginError(err, env)
              this.loadingData = false
            })
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'warranty'
            }
            self.handlePluginError(err, env)
            this.loadingData = false
          })
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../../../assets/stylus/common'
</style>
