<template>
  <div class="main">
    <div class="main-title">
      <h2>故障事件</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select :label="product.name" width='110px' size="small">
            <span slot="label">产品</span>
            <select v-model="product">
              <option v-for="opt in productOptions" :value="opt">{{ opt.name }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-range-picker></date-time-range-picker>
        </div>
      </div>
    </div>
    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :info="extendedSummary.rest" :title="extendedSummary.rest.title" :has-action="true" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="extendedSummary.unfinished" :title="extendedSummary.unfinished.title" :has-target="true" align="left"></statistic>
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
                <x-select label="全部" width='110px' size="small">
                  <span slot="label">显示</span>
                </x-select>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="" :placeholder="'输入搜索内容'" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <x-table :headers="headers" :tables="tables" :page="page" @tbody-id="goDetails"></x-table>
        </div>
      </div>
    </div>
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
  import DateTimeRangePicker from 'components/DateTimeRangePicker'
  import store from 'store'
  import api from 'api'
  import { pluginMixins } from '../../../mixins'
  import Mock from 'mockjs'
  import Statistic from 'components/Statistic'

  export default {
    name: 'OrderList',

    mixins: [globalMixins, pluginMixins],

    store,

    vuex: {
      getters: {
        products: ({ products }) => products.all
      }
    },

    components: {
      'x-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'x-table': Table,
      DateTimeRangePicker,
      Statistic
    },

    data () {
      return {
        product: {},
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
            key: 'device_id',
            title: '设备ID'
          },
          {
            key: 'event_id',
            title: '事件ID'
          },
          {
            key: 'description',
            title: '描述'
          },
          {
            key: 'tag',
            title: '标签'
          },
          {
            key: 'report_time',
            title: '上报时间',
            sortType: -1
          },
          {
            key: 'state',
            title: '状态',
            class: 'tac'
          }
        ],
        extendedSummary: {
          rest: {
            total: 0,
            change: 0,
            title: '事件总数'
          },
          unfinished: {
            total: 0,
            title: '待处理数'
          },
          today: {
            total: 0,
            change: 0,
            title: '今日事件'
          },
          week: {
            total: 0,
            change: 0,
            title: '近7天事件数'
          }
        }
      }
    },

    computed: {
      productOptions () {
        if (this.products.length) {
          this.product = this.products[0]
        }
        return this.products
      },
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
              text: '已延保',
              color: '#006633'
            }
          ]
          var html = '<div class="state" style="color: ' + result[state - 0].color + '">' + result[state - 0].text + '</div>'
          return html
        }
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
      getWarrantyList1 () {
        // this.total = 20
        this.workOrders = [
          // {
          //   id: 'YWD212912341',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '2年',
          //   addr: '湖北, 武汉',
          //   state: 1
          // },
          // {
          //   id: 'YWD212912342',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '待延保',
          //   addr: '湖北, 武汉',
          //   state: 0
          // },
          // {
          //   id: 'YWD212912342',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '待延保',
          //   addr: '湖北, 武汉',
          //   state: 0
          // },
          // {
          //   id: 'YWD212912342',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '待延保',
          //   addr: '湖北, 武汉',
          //   state: 0
          // },
          // {
          //   id: 'YWD212912342',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '待延保',
          //   addr: '湖北, 武汉',
          //   state: 0
          // },
          // {
          //   id: 'YWD212912342',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '待延保',
          //   addr: '湖北, 武汉',
          //   state: 0
          // },
          // {
          //   id: 'YWD212912342',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '待延保',
          //   addr: '湖北, 武汉',
          //   state: 0
          // },
          // {
          //   id: 'YWD212912342',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '待延保',
          //   addr: '湖北, 武汉',
          //   state: 0
          // },
          // {
          //   id: 'YWD212912342',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '待延保',
          //   addr: '湖北, 武汉',
          //   state: 0
          // },
          // {
          //   id: 'YWD212912342',
          //   mac: '1108ea95',
          //   invalid_time: '2016-1-1   19:21:32',
          //   time: '待延保',
          //   addr: '湖北, 武汉',
          //   state: 0
          // }
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
    font-size 10px!important
    color red
</style>
