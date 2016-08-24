<template>
  <div class="main">
    <div class="main-title">
      <h2>维保记录</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select label="空气净化器" width='110px' size="small">
            <span slot="label">产品</span>
          </x-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="row statistic-group mb30">
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
                <x-select label="全部" width='110px' size="small">
                  <span slot="label">显示</span>
                </x-select>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="" :placeholder="'输入搜索内容'" @search-activate="" @search-deactivate="" @search="" @press-enter="getOrderWorkList">
                  <button slot="search-button" @click="getOrderWorkList" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" @tbody-id="goDetails"></x-table>
        </div>
      </div>
    </div>
    <!-- <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <search-box class="work-order-search-box" :key.sync="key" :placeholder="'请输入'+ queryType.label" @press-enter="getOrderWorkList(true)">
            <x-select width="100px" :label="queryType.label">
              <select v-model="queryType">
                <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
              </select>
            </x-select>
            <button slot="search-button" class="btn btn-primary" @click="getOrderWorkList(true)"><i class="fa fa-search"></i></button>
          </search-box>
        </div>

        <div class="status-bar">
          <x-select :label="statusOptions[status.value].label" width="100px" class="work-orders-select" size="small">
            <span slot="label">工单状态</span>
            <select v-model="status" @change="getOrderWorkList(true)">
              <option v-for="option in statusOptions" :value="option">{{option.label}}</option>
            </select>
          </x-select>

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
        <div class="row">
          <div class="col-8 mb40">{{{ $t('common.total_results', {count:total}) }}}</div>
          <div class="col-16">
            <pager v-if="!loadingData && total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getOrderWorkList"></pager>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../../../mixins'
  import Select from 'components/Select'
  import AreaSelect from 'components/AreaSelect'
  import SearchBox from 'components/SearchBox'
  import Table from 'components/Table'
  import DateRangePicker from 'components/DateRangePicker'
  import api from 'api'
  import * as config from 'consts/config'
  import Statistic from 'components/Statistic'
  import Mock from 'mockjs'
  import TimeLine from 'components/g2-charts/TimeLine'
  import RadioButtonGroup from 'components/RadioButtonGroup'

  export default {
    name: 'OrderList',

    mixins: [globalMixins, pluginMixins],

    components: {
      'x-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'x-table': Table,
      'date-range-picker': DateRangePicker,
      Statistic,
      RadioButtonGroup,
      TimeLine
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
          {
            key: 'addr',
            title: '地点'
          },
          {
            key: 'level',
            title: '维修等级',
            class: 'tac'
          },
          {
            key: 'state',
            title: '状态',
            class: 'tac'
          }
        ],
        trends: null,
        period: 7,
        periods: [
          {
            value: 1,
            label: '24h'
          },
          {
            value: 7,
            label: '7天'
          },
          {
            value: 30,
            label: '30天'
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
            id: '<a class="hl-red">' + item.id + '</a>',
            mac: item.mac,
            create_date: item.create_date,
            person: item.person,
            content: item.content,
            addr: item.addr,
            level: resetLevel(item.level),
            // state: item.state - 0 === 1 ? '维修中' : '待处理',
            state: resetState(item.state),
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
            }
          ]
          var html = '<div class="state" style="color: ' + result[state - 0].color + '">' + result[state - 0].text + '</div>'
          return html
        }
        function resetLevel (state) {
          var result = [
            {
              text: '一级',
              backgroundColor: '#ff9966'
            },
            {
              text: '二级',
              backgroundColor: '#9cc'
            },
            {
              text: '三级',
              backgroundColor: '#cb4a52'
            }
          ]
          var html = '<div class="level" style="color:#FFF; background-color: ' + result[state - 1].backgroundColor + '">' + result[state - 1].text + '</div>'
          return html
        }
      },
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

    route: {
      data () {
        this.getOrderWorkList1()
      }
    },

    ready () {
      // TODO 对接口
      this.trends = Mock.mock({
        'list|14': [{
          'date|+1': [
            new Date(2016, 7, 15),
            new Date(2016, 7, 16),
            new Date(2016, 7, 17),
            new Date(2016, 7, 18),
            new Date(2016, 7, 19),
            new Date(2016, 7, 20),
            new Date(2016, 7, 21)
          ],
          'count|+1': [6, 8, 9, 3, 9, 3, 9]
        }]
      }).list
    },

    methods: {
      goDetails (table) {
        this.$route.router.go(this.$route.path + '/' + table.prototype.id)
      },
      getOrderWorkList1 () {
        this.total = 50
        this.workOrders = [
          {
            id: 'YWD21291233',
            mac: 'a1ds54asd',
            create_date: '2016-07-22   19:21:32',
            person: '张小琴',
            content: '更换滤网',
            addr: '广东，广州',
            level: '1',
            state: '0'
          },
          {
            id: 'YWD21291232',
            mac: 'a1ds54asd',
            create_date: '2016-07-21   12:33:12',
            person: '王献强',
            content: '更换滤网',
            addr: '广东，广州',
            level: '1',
            state: '0'
          },
          {
            id: 'YWD21291231',
            mac: 'a1ds54asd',
            create_date: '2016-07-21   11:21:39',
            person: '张小琴',
            content: '电源故障，电压不稳定',
            addr: '广东，深圳',
            level: '2',
            state: '0'
          },
          {
            id: 'YWD21291229',
            mac: 'a1ds54asd',
            create_date: '2016-07-21   11:18:09',
            person: '张小琴',
            content: '电机转速过高，异响',
            addr: '广东，深圳',
            level: '2',
            state: '1'
          },
          {
            id: 'YWD21291228',
            mac: 'a1ds54asd',
            create_date: '2016-07-21   9:17:32',
            person: '王献强',
            content: '更换滤网',
            addr: '广东，佛山',
            level: '3',
            state: '0'
          },
          {
            id: 'YWD21291227',
            mac: 'a1ds54asd',
            create_date: '2016-07-20   15:13:30',
            person: '王献强',
            content: '更换滤网',
            addr: '湖北，武汉',
            level: '2',
            state: '0'
          },
          {
            id: 'YWD21291226',
            mac: 'a1ds54asd',
            create_date: '2016-07-20   15:13:30',
            person: '张小琴',
            content: '更换滤网',
            addr: '湖北，武汉',
            level: '1',
            state: '0'
          },
          {
            id: 'YWD21291225',
            mac: 'a1ds54asd',
            create_date: '2016-07-19   10:21:33',
            person: '张小琴',
            content: '外壳松动，更换A/B壳',
            addr: '广西，桂林',
            level: '1',
            state: '0'
          },
          {
            id: 'YWD21291224',
            mac: 'a1ds54asd',
            create_date: '2016-07-19   10:08:46',
            person: '王献强',
            content: '制冷异常，强制冷失效',
            addr: '河南，开封',
            level: '2',
            state: '0'
          },
          {
            id: 'YWD21291223',
            mac: 'a1ds54asd',
            create_date: '2016-07-18   16:22:38',
            person: '张小琴',
            content: '噪音过大',
            addr: '广东，广州',
            level: '3',
            state: '0'
          },
          {
            id: 'YWD21291222',
            mac: 'a1ds54asd',
            create_date: '2016-07-18   16:11:32',
            person: '张小琴',
            content: '更换滤网',
            addr: '湖北, 武汉',
            level: '3',
            state: '0'
          }
        ]
      },
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

  .table
    .level
      display inline-block
      width 50px
</style>
