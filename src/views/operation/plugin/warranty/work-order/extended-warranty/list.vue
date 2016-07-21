<template>
  <div class="main">
    <div class="main-title">
      <h2>延保工单</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <v-select label="空气净化器" width='110px' size="small">
            <span slot="label">产品</span>
          </v-select>
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
    <div class="panel">
      <div class="panel-bd">
        <div class="with-loading">
          <time-line :data="trends" :type="'smooth'"></time-line>
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="row statistic-group">
      <div class="col-6">
        <statistic :info="extendedSummary.rest" :title="extendedSummary.rest.title" :has-action="true" align="left">
          <i class="tips" slot="tips">(小于10天)</i>
          <div slot="action">
            <button>
            一键延保通知
            </button>
        </div>
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="extendedSummary.unfinished" :title="extendedSummary.unfinished.title" :has-target="true" align="left">
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="extendedSummary.today" :title="extendedSummary.today.title" align="left" :showchange="true"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="extendedSummary.week" :title="extendedSummary.week.title" align="left" :has-action="true" :showchange="true">
        </statistic>
      </div>
    </div>
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <v-select label="全部" width='110px' size="small">
                  <span slot="label">显示</span>
                </v-select>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="" :placeholder="'输入搜索内容'" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page" @tbody-id="goDetails"></c-table>
        </div>
      </div>
    </div>
    <!-- <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <search-box class="work-order-search-box" :key.sync="key" :placeholder="'请输入工单编号'" @press-enter="getWarrantyList(true)">
            <button slot="search-button" class="btn btn-primary" @click="getWarrantyList(true)"><i class="fa fa-search"></i></button>
            <label></label>
          </search-box>
        </div>

        <div class="status-bar">
          <v-select :label="statusOptions[status.value].label" width="100px" class="work-orders-select" size="small">
            <span slot="label">工单状态</span>
            <select v-model="status" @change="getWarrantyList(true)">
              <option v-for="option in statusOptions" :value="option">{{option.label}}</option>
              <p> {{status}}</p>
            </select>
          </v-select>

          <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" label="所在地区" select-size="small" @province-change="getWarrantyList(true)" @city-change="getWarrantyList(true)" @district-change="getWarrantyList(true)"></area-select>
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
                  <td>{{order.name}}</td>
                  <td>{{order.product_name}}</td>
                  <td>{{order.product_type}}</td>
                  <td>{{order.extended_days | uniformDate}}</td>
                  <td>
                    <div v-if="order.status === 0">已过期</div>
                    <div v-else class='hl-green'>未过期</div>
                  </td>
                  <td><a v-link="{path: '/plugins/warranty/' + $route.params.app_id + '/work-orders/extended-warranties/' + order._id}" class="hl-red">查看详情</a></td>
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
            <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getWarrantyList"></pager>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
  // import api from 'api'
  import * as config from 'consts/config'
  import { globalMixins } from 'src/mixins'
  import Select from 'components/Select'
  import AreaSelect from 'components/AreaSelect'
  import SearchBox from 'components/SearchBox'
  import Table from 'components/Table'
  // import Pager from 'components/Pager'
  import api from 'api'
  import { pluginMixins } from '../../../mixins'
  import Mock from 'mockjs'
  import TimeLine from 'components/g2-charts/TimeLine'
  import RadioButtonGroup from 'components/RadioButtonGroup'
  import Statistic from 'components/Statistic'

  export default {
    name: 'OrderList',

    mixins: [globalMixins, pluginMixins],

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'c-table': Table,
      // 'pager': Pager,
      TimeLine,
      Statistic,
      RadioButtonGroup
    },

    data () {
      return {
        name: '',
        status: {
          label: '全部',
          value: 0
        },
        key: '',
        curProvince: {},
        curCity: {},
        curDistrict: {},
        workOrders: [],
        statusOptions: [{
          label: '全部',
          value: 0
        }, {
          label: '未到期',
          value: 1
        }, {
          label: '已到期',
          value: 2}],

        loadingData: false,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        total: 0,
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
        ],
        headers: [
          {
            key: 'id',
            title: '工单编号'
          },
          {
            key: 'mac',
            title: '维修设备(mac)'
          },
          {
            key: 'invalid_time',
            title: '到期时间',
            sortType: -1
          },
          {
            key: 'time',
            title: '延保时间',
            sortType: -1
          },
          {
            key: 'addr',
            title: '地点'
          },
          {
            key: 'state',
            title: '状态',
            class: 'tac'
          }
        ],
        extendedSummary: {
          rest: {
            total: 235,
            change: 0,
            title: '即将到期'
          },
          unfinished: {
            total: 135,
            title: '待处理数'
          },
          today: {
            total: 232,
            change: -124,
            title: '今日延保数'
          },
          week: {
            total: 2802,
            change: 124,
            title: '一周维修数'
          }
        }
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
            invalid_time: item.invalid_time,
            time: item.time,
            addr: item.addr,
            state: item.state,
            prototype: item
          }
          result.push(workOrder)
        })
        return result
      },
      queryCondition () {
        var condition = {
          filter: ['_id', 'name', 'product_name', 'product_type', 'extended_days', 'status'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {}
        }

        if (this.curProvince.name !== this.$t('common.any')) {
          condition.query.province = this.curProvince.name
        }
        if (this.curCity.name !== this.$t('common.any')) {
          condition.query.city = this.curCity.name
        }
        if (this.curDistrict.name !== this.$t('common.any')) {
          condition.query.district = this.curDistrict.name
        }
        if (this.status.value !== 0) {
          if (this.status.value === 1) { // 未到期
            condition.query.status = 1
          } else if (this.status.value === 2) { // 已到期
            condition.query.status = 0
          }
        }
        if (this.key !== '') {
          condition.query._id = {$regex: this.key, $options: 'i'}
        }

        return condition
      }
    },

    route: {
      data () {
        this.getWarrantyList1()
      }
    },

    ready () {
      // TODO
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
      getWarrantyList1 () {
        this.total = 20
        this.workOrders = [
          {
            id: '111111111',
            mac: 'macmacmac',
            invalid_time: '2016-07-32 18:00:00',
            time: '2016-07-32 18:00:00',
            addr: '龙腾18',
            state: 1
          },
          {
            id: '222222222',
            mac: 'macmacmac',
            invalid_time: '2016-07-32 18:00:00',
            time: '2016-07-32 18:00:00',
            addr: '龙腾18',
            state: 1
          }
        ]
      },
      getWarrantyList (querying) {
        var self = this
        var argvs = arguments
        var fn = self.getWarrantyList
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }
        this.loadingData = true
        this.getAppToKen(this.$route.params.app_id, 'warranty').then((token) => {
          api.warranty.getWarrantyList(this.$route.params.app_id, token, this.queryCondition).then((res) => {
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
          this.handleError(err)
          this.loadingData = false
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../../../assets/stylus/common'
  .tips
    font-size 5px!important
    color red
</style>
