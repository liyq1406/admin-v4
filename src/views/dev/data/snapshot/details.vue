<template>
  <div class="main">
    <div class="main-title">
      <h2>{{selectedRule.name}}
        <span v-if="selectedRule.rule===3">(定时更新/{{selectedRule.interval}}分钟)</span>
        <span v-if="selectedRule.rule===2">(变化更新)</span>
        <span v-if="selectedRule.rule===1">(即时更新)</span>
      </h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="snapshot-details">
      <div class="row">
        <div class="col-24">
          <div class="panel row">
            <div class="panel-bd layout-left">
              <div class="device-list-box">
                <div class="action-bar">
                  <search-box :key.sync="query" :active="searching" :placeholder="$t('common.placeholder.search')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices(true)">
                    <x-select width="100px" :label="queryType.label" size="small">
                      <select v-model="queryType">
                        <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                      </select>
                    </x-select>
                    <button slot="search-button" @click="getDevices(true)" class="btn"><i class="fa fa-search"></i></button>
                  </search-box>
                </div>
                <table class="table table-stripe table-bordered">
                  <thead>
                    <tr>
                      <th class="wp44">设备ID</th>
                      <th>设备标识(MAC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="device in devices" :class="{'selected': device.selected}" @click="selectedDeviceDataEvent(device)">
                      <td>{{ device.id }}</td>
                      <td>
                        <div class="text-overflow w110">
                          {{ device.mac }}
                        </div>
                      </td>
                    </tr>
                    <tr v-if="devices.length === 0">
                      <td colspan="2" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                        <div v-else class="tips-null">暂无数据</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <pager v-if="total > countPerPage" :total="total" :current="currentPage" :count-per-page="countPerPage" :simple="true" @page-update="onPageUpdate"></pager>
              </div>
            </div>
            <div class="panel-bd layout-right">
              <div class="device-details-box">
                <div class="device-msg-box">
                  <div class="header-box row">
                    <div class="device-base-msg-box col-10 row">
                      <div class="device-picture col-6">
                        <img :src="deviceThumb"/>
                      </div>
                      <div class="device-base-msg row col-18">
                        <p>
                          <i>设备ID：</i>
                          <span>{{selectedDeviceData.id}}</span>
                        </p>
                        <p>
                          <i>MAC：</i>
                          <span>{{selectedDeviceData.mac}}</span>
                        </p>
                        <p>
                          <i>在线状态：</i>
                          <span v-if="selectedDeviceData.is_online=== true">在线</span>
                          <span v-else>下线</span>
                        </p>
                        <button class="btn btn-ghost btn-sm mt10" @click="showEditModal=true"><i class="fa fa-edit"></i>选择显示的索引数据</button>
                      </div>
                    </div>
                    <div class="operation-box col-14">
                      <div class="check-device hidden">
                        <button class="btn btn-primary" v-link="{path: '/dev/products/' + this.$route.params.product_id + '/devices/' + selectedDeviceData.id}">查看设备</button>
                      </div>
                      <div class="radio-group-periods">
                        <radio-button-group :items="periods" :value.sync="period" @select="getSnapshot"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
                        <!-- <date-time-multiple-picker :periods="computedPeriods" @timechange="onTimeChange" :default-period="defaultPeriod"></date-time-multiple-picker> -->
                      </div>
                      <div class="radio-group-box">
                        <button class="btn btn-ghost mr10" @click="refresh">
                          <i class="fa fa-refresh" :class="{'fa-spin': refreshing}"></i>刷新
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="over-flow-hidden">
                    <chart :options="chartOptions" :loading="loadingData"></chart>
                  </div>
                </div>
                <div class="device-data-table-box">
                  <div class="title">
                    <span>设备数据明细: </span>
                  </div>
                  <div class="table-box">
                    <intelligent-table :headers.sync="snapshotHeader" :tables="snapshots | limitBy countPerPage2 (currentPage2-1)*countPerPage2"></intelligent-table>
                    <pager v-if="snapshots.length > countPerPage2" :total="snapshots.length" :current.sync="currentPage2" :count-per-page="countPerPage2" :simple="true"></pager>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--修改快照数据索引项浮层-->
     <modal :show.sync="showEditModal" width="600px">
       <h3 slot="header">选择快照数据项</h3>
       <div slot="body" class="form">
         <div class="table-wrap" style="overflow-x: hidden">
           <div class="data-table">
             <table class="table table-stripe table-bordered">
               <thead>
                 <tr>
                   <th>索引</th>
                   <th>端点ID</th>
                   <th>描述</th>
                   <th>选择</th>
                   <!-- <th>端点ID</th> -->
                 </tr>
               </thead>
               <tbody>
                 <tr v-for="datapoint in datapoints | limitBy countPerPage3 (currentPage3-1)*countPerPage3">
                   <td>{{datapoint.index}}</td>
                   <td>{{datapoint.name}}</td>
                   <td>{{datapoint.description}}</td>
                   <td><input v-model="datapoint.selected" type="checkbox"/></td>
                 </tr>
               </tbody>
             </table>
           </div>
           <div class="data-points-footer">
             <pager v-if="datapoints.length > countPerPage3" :total="datapoints.length" :current.sync="currentPage3" :count-per-page="countPerPage3" @page-update=""></pager>
           </div>
         </div>
         <div class="form-actions snapshot-select mt10">
           <button @click="saveDataPoints" type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
           <!-- <button @click="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button> -->
         </div>
       </div>
     </modal>
     <!-- 结束添加选择快照数据项浮层-->
    </div>
  </div>
</template>

<script>
import api from 'api'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Pager from 'components/Pager'
import SearchBox from 'components/SearchBox'
import Select from 'components/Select'
import Modal from 'components/Modal'
import IntelligentTable from 'components/IntelligentTable'
import Chart from 'components/Chart/index'
import { globalMixins } from 'src/mixins'
import Alert from 'components/Alert'
import Breadcrumb from 'components/Breadcrumb'
import _ from 'lodash'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import formatDate from 'filters/format-date'

export default {
  name: 'TableDetails',

  mixins: [globalMixins],

  components: {
    Modal,
    RadioButtonGroup,
    SearchBox,
    Pager,
    IntelligentTable,
    Breadcrumb,
    Chart,
    'x-select': Select,
    'x-alert': Alert,
    DateTimeMultiplePicker
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '数据快照',
        link: '/dev/data/snapshots'
      }, {
        label: '数据快照详情'
      }],
      /** ***图表 按钮 start*********/
      loadingProductTrends: false,
      period: 0,
      periods: [],
      /* ******图表 按钮 end*************/
      query: '',
      searching: false,
      queryTypeOptions: [
        { label: '设备ID', value: 'id' },
        { label: 'MAC', value: 'mac' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      showEditModal: false,
      total: 0,
      currentPage: 1,
      currentPage2: 1,
      currentPage3: 1,
      countPerPage: 20,
      countPerPage2: 10,
      countPerPage3: 10,
      product: {},
      devices: [],
      datapoints: [],
      snapshotSeries: [
        {
          name: '温度',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ],
      // periods: [7, 30, 90],
      defaultPeriod: 7,
      beforeTime: 1,
      snapshots: [],
      allSnapshots: [],
      loadingData: true,
      refreshing: false,
      allDatapoints: [],
      chartX: 30, // 图的左侧预留空间
      selectedRule: {}, // 当前页面的设备快照
      xAxisData: [],
      beRefresh: true
    }
  },

  computed: {
    computedPeriods () {
      var result = [1, 7, 30]
      if (this.periods.length) {
        result = this.periods.map((item) => {
          return item.value
        })
      }
      return result
    },
    // 图表配置
    chartOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: this.chartX,
          y: 32,
          x2: 55,
          y2: 20
        },
        legend: {
          y: 5,
          data: this.legends
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData
        }],
        yAxis: [{
          type: 'value'
        }],
        series: this.series
      }
    },

    // 趋势图表数据
    series () {
      var result = []
      let usefulDp = _.filter(this.selectedDatapoints, (item) => {
        return this.canBeCounted(item.type)
      })
      if (!usefulDp || !usefulDp.length) {
        return result
      }
      usefulDp.forEach((item) => {
        result.push({
          name: `${item.name}`,
          type: 'line',
          data: [],
          dpIndex: item.index
        })
      })

      let maxValue = Number.NEGATIVE_INFINITY // 计算所有值的最大值。调整图标左边距
      this.xAxisData = []
      let tempData = _.clone(this.snapshots)
      let filterTempData = _.groupBy(tempData, (item) => {
        let date = +new Date(item.snapshot_date) + 1000 * 3600
        return formatDate(date, 'MM-dd hh' + ':00', true)
      })

      let filterTempDataArr = []
      for (let ts in filterTempData) {
        filterTempData[ts].sort((a, b) => {
          a = +new Date(a.snapshot_date)
          b = +new Date(b.snapshot_date)
          return a - b
        })
        let value = filterTempData[ts].slice(-1)
        if (value.length) {
          value = value[0]
        }

        filterTempDataArr.push({
          date: ts,
          value: value
        })
      }

      filterTempDataArr.sort((a, b) => {
        a = +new Date(a.date)
        b = +new Date(b.date)
        return a - b
      })

      filterTempDataArr.forEach((item) => {
        this.xAxisData.push(item.date)
        result.forEach((r) => {
          r.data.push(item.value[r.dpIndex])
          if (item.value[r.dpIndex] > maxValue) {
            maxValue = item.value[r.dpIndex]
          }
        })
      })

      // 计算最大值长度
      let maxLength = Number(maxValue).toString().length
      this.chartX = maxLength * 10 > 200 ? 200 : maxLength * 10
      return result
    },

    // 图例
    legends () {
      return this.series.length > 0 ? _.map(this.series, 'name') : []
    },

    deviceThumb () {
      let pics = this.product.pics
      return (pics && pics.length && pics[0] !== '') ? pics[0] : '/static/images/device_thumb.png'
    },
    tdnames () {
      var result = []
      this.snapshotHeader.map((item) => {
        result.push(item.key + '')
      })
      return result
    },
    selectedDeviceData () {
      var result = {}
      this.devices.map((device) => {
        if (device.selected) {
          result = device
        }
      })
      return result
    },
    queryCondition () {
      var condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {}
      }
      if (this.query.length > 0) {
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }
      return condition
    },

    selectedDatapoints () {
      return this.datapoints.filter((item) => {
        return item.selected
      }).sort((a, b) => {
        return a.index - b.index
      })
    },

    snapshotHeader () {
      var result = [
        {
          key: 'snapshot_date', // 与tables的key对应
          title: '时间'
        }
      ]
      this.selectedDatapoints.map((item) => {
        var obj = {
          key: item.index,
          title: `${item.name} (${item.description})`
        }
        result.push(obj)
      })
      return result
    },

    querySnapshotCondition () {
      var endtime
      if (this.beRefresh) {
        endtime = Date.parse(new Date())
      } else {
        endtime = Date.parse(new Date())
      }
      // 取当前开始到period天前的时间
      var begintime = endtime - this.period * 24 * 60 * 60 * 1000 - 60 * 60 * 1000 // 比当前时间往前取多一个小时为了使第一个点获取到数据
      var condition = {
        offset: 0,
        limit: 2500,
        date: {
          begin: begintime,
          end: endtime
        },
        rule_id: this.$route.params.rule_id
      }
      return condition
    }
  },

  route: {
    data () {
      this.initPeriods()
      this.getDevices()
      this.getProduct()
      this.getRule()
    }
  },

  methods: {
    /**
     * 时间组件时间改变回调
     */
    onTimeChange (start, end) {
      this.period = parseInt((end - start) / 1000 / 60 / 60 / 24) + 1
      this.beforeTime = parseInt((new Date() - end) / 1000 / 60 / 60 / 24)
      this.getSnapshot()
    },

    canBeCounted (type) {
      return (type >= 2 && type <= 5) || type === 8 || type === 9 // 可统计的数据端点类型
    },
    initPeriods () {
      let res = []
      let periodArr = [1, 7, 15]
      periodArr.forEach((item) => {
        res.push({
          label: this.locales.data.PERIODS_MAP[item],
          value: item
        })
      })
      this.periods = res
      this.period = res[0].value
    },

    /**
     * 获取快照数据
     */
    getSnapshot () {
      this.refreshing = true
      api.snapshot.getSnapshot(this.$route.params.product_id, this.selectedDeviceData.id, this.querySnapshotCondition).then((res) => {
        this.refreshing = false
        if (res.status === 200 && res.data.list && res.data.list.length) {
          // 获取全部数组数据
          this.allSnapshots = res.data.list
          this.snapshotTable = res.data.list
          this.snapshotTable.map((li) => {
            li.snapshot_date = li.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '').replace(/-/ig, '/').split('.')[0]
          })
          this.snapshots = res.data.list.sort((a, b) => {
            return new Date(b.snapshot_date) - new Date(a.snapshot_date)
          })
        } else {
          this.snapshots = []
          this.total = 0
        }
      }).catch((res) => {
        this.refreshing = false
        this.snapshots = []
        this.total = 0
        this.handleError(res)
      })
    },
    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getDevices(true)
      }
    },
    // 获取当前产品快照规则
    getRule () {
      api.snapshot.getRules(this.$route.params.product_id).then((res) => {
        if (res.status === 200 && res.data.list && res.data.list.length) {
          let selectedRule = _.find(res.data.list, (item) => {
            return item.id === this.$route.params.rule_id
          })
          if (!selectedRule) {
            return
          }
          this.selectedRule = selectedRule
          // 匹配数据端点信息
          api.product.getDatapoints(this.$route.params.product_id).then((r) => {
            if (r.status === 200) {
              var dps = []
              selectedRule.datapoint && selectedRule.datapoint.length && selectedRule.datapoint.map((item, index) => {
                r.data.map((dp) => {
                  if (dp.index === item) {
                    var obj = {
                      index: item,
                      selected: index < 3 || false,
                      description: dp.description,
                      name: dp.name,
                      type: dp.type
                    }
                    dps.push(obj)
                  }
                })
              })
              this.datapoints = dps.sort((a, b) => {
                return a.index - b.index
              })
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      }, (err) => {
        this.handleError(err)
      })
    },

    onPageUpdate (page) {
      this.currentPage = page
      this.getDevices()
    },

    // 获取设备列表
    getDevices (reset) {
      if (reset) {
        this.currentPage = 1
      }
      // this.loadingData = true
      api.device.getList(this.$route.params.product_id, this.queryCondition).then((res) => {
        if (res.status === 200 && res.data.list && res.data.list.length) {
          res.data.list.map((item) => {
            item.selected = false
          })
          res.data.list[0].selected = true
          this.devices = res.data.list
          this.total = res.data.count
          this.getSnapshot()
        } else {
          this.devices = []
        }
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    // 获取当前产品信息
    getProduct () {
      api.product.getProduct(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.product = res.data
        }
      })
    },
    /**
     * 切换搜索
     * @return {[type]} [description]
     */
    toggleSearching () {
      this.searching = !this.searching
    },
    onEditCancel () {
      this.showEditModal = false
    },
    /**
     * 选择数据端点事件
     * @return {[type]} [description]
     */
    selectedDeviceDataEvent (device) {
      this.devices.map((item) => {
        item.selected = false
      })
      device.selected = true
      // this.getRule()
      this.getSnapshot()
    },
    saveDataPoints () {
      this.showEditModal = false
    },
    refresh () {
      this.beRefresh = !this.beRefresh
      this.getSnapshot()
    }
  }
}
</script>

<style lang="stylus">
.snapshot-details
  .layout-left
    width 328px
    float left
    z-index 1
  .layout-right
    width 100%
    padding-left 328px
    box-sizing border-box
  .device-list-box
    margin 20px 20px 20px 0
    box-sizing border-box
    .action-bar
      padding-top 0
    .search-box-input
      width 174px
      overflow hidden

      input
        width 174px
    .table-stripe tbody tr.selected:nth-child(2n+1) td
    .table-stripe tbody tr.selected td
      background #c0252e
      color #fff
    .table-stripe tbody tr.selected:hover td
      background #c0252e
      cursor pointer
    .table-stripe tbody tr:hover td
      background lighten(#000, 93%)
      cursor pointer
  .device-details-box
    margin 20px 0 20px 0
    .device-msg-box
      border 1px solid light-border-color
    .header-box
      padding-bottom 15px
      box-sizing border-box
      overflow hidden
      .device-picture
        width 65px
        height 65px
        img
          display block
          width 65px
          height 65px
      .device-base-msg
        line-height 23px
        padding-left 10px
        box-sizing border-box
        p
          font-size 12px
          margin 0
          i
            display inline-block
            width 60px
    .chart-box
      width 100%
      box-sizing border-box
    .device-data-table-box
      margin-top 20px
      .title
        font-size 14px
        margin-bottom 5px
  .operation-box
    position relative
    height 70px
    .check-device
      position absolute
      right 0
      top 0
    .radio-group-box
      position absolute
      right 5px
      bottom 0
      .btn .fa
        /*height 100%*/
        font-size 14px
        line-height 26px
        color #383838
        margin-right 5px
    .radio-group-periods
      position absolute
      right 100px
      bottom 0
  .over-flow-hidden
    overflow hidden
</style>
