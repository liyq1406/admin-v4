<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="filter-bar">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <date-time-range-picker></date-time-range-picker>
          </div>
          <div class="filter-group-item">
            <radio-button-group :items="locales.data.BIG_PERIODS" :value.sync="period" @select="getSnapshot"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-group-item">
            <v-select :label="selectedDatapoint.name" width="110px" size="small">
              <span slot="label">显示</span>
              <select v-model="selectedDatapoint">
                <option v-for="opt in datapoints" :value="opt">{{ opt.name }}</option>
              </select>
            </v-select>
          </div>
        </div>
      </div>
      <div class="device-data-table-box">
        <div class="title">
          <!-- <span>设备数据明细 : </span> -->
        </div>
        <!-- <div class="table-box">
          <intelligent-table :headers.sync="snapshotHeader" :tables="snapshots | limitBy countPerPage (currentPage-1)*countPerPage"></intelligent-table>
          <pager v-if="snapshots.length > countPerPage" :total="snapshots.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager>
        </div> -->
        <div class="panel-bd">
          <time-line :data="trends.data"></time-line>
        </div>
      </div>
      <div class="history-list">
        <div class="col-dates">
          <ul>
            <li v-for="n in 10">2016-07-01  09:00:00</li>
          </ul>
        </div>
        <div class="col-details">
          <c-table :headers="headers" :tables="tables" :bordered="false"></c-table>
        </div>
      </div>
      <pager v-if="total" :total="total" :current="currentPage" :count-per-page="countPerPage" @page-update="onCurrPageChage" @count-update="onPageCountUpdate"></pager>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import LineChart from 'components/charts/Line'
import Pager from 'components/Pager'
import IntelligentTable from 'components/IntelligentTable'
import api from 'src/api'
import Select from 'components/Select'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Table from 'components/Table'

import Mock from 'mockjs'

export default {
  name: 'History',

  mixins: [globalMixins],

  components: {
    LineChart,
    'pager': Pager,
    'c-table': Table,
    'intelligent-table': IntelligentTable,
    'v-select': Select,
    RadioButtonGroup,
    DateTimeRangePicker,
    TimeLine
  },

  data () {
    return {
      loadingProductTrends: false,
      snapshotSeries: [
        {
          name: 'PM2.5',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ],
      period: 1,
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      snapshots: [],
      datapoints: [],
      selectedDatapoint: {},
      // 趋势
      trends: {
        data: [],
        options: {}
      },
      headers: [
        {
          key: 'name',
          title: '数据端点'
        },
        {
          key: 'description',
          title: '描述'
        },
        {
          key: 'value',
          title: '数据值'
        }
      ]
    }
  },
  computed: {
    tables () {
      let result = []

      return result
    },

    // 图表横轴数据
    snapshotXAxisData () {
      // var today = new Date()
      var now = Date.parse(new Date())
      var result = []
      for (var i = this.period * 24 - 1; i >= 0; i--) {
        // result[i] = dateFormat('MM-dd', new Date(today - (this.period - i - 1) * 24 * 3600 * 1000))
        var date = new Date(now - i * 3600 * 1000)
        var hour = date.getHours() + 1
        result.push(`${hour > 9 ? hour : `0${hour}`}:00`)
      }
      return result
    },

    // 查询条件
    queryCondition () {
      var endtime = Date.parse(new Date())
      // 取当前开始到period天前的时间
      var begintime = endtime - this.period * 24 * 60 * 60 * 1000 - 60 * 60 * 1000 // 比当前时间往前取多一个小时为了使第一个点获取到数据
      var condition = {
        offset: 0,
        limit: 2500,
        date: {
          begin: begintime,
          end: endtime
        }
      }
      return condition
    }
  },

  route: {
    data () {
      this.getSnapshot()
      this.getDatapoints()
      // 监听窗口尺寸变化
      // window.onresize = () => {
      //   this.$refs.trendChart.chart.resize()
      // }
      this.trends.data = Mock.mock({
        'list|16': [{
          'date|+1': [
            new Date(2016, 7, 17),
            new Date(2016, 7, 18),
            new Date(2016, 7, 19),
            new Date(2016, 7, 20)
          ],
          'count|+1': [6, 8, 9, 8],
          '产品|+1': ['Power', 'Power', 'Power', 'Power']
        }]
      }).list
    }
  },

  methods: {
    // 获取设备端点列表
    getDatapoints () {
      api.product.getDatapoints(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
          this.selectedDatapoint = res.data[0]
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getSnapshot()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getSnapshot(true)
    },

    /**
     * 获取快照数据
     */
    getSnapshot () {
      api.snapshot.getSnapshot(this.$route.params.product_id, this.$route.params.device_id, this.queryCondition).then((res) => {
        console.log(this.queryCondition)
        if (res.status === 200) {
          // 获取全部数组数据
          this.total = res.data.count
          this.allSnapshots = res.data.list
          this.snapshotTable = res.data.list
          this.snapshotTable.map((li) => {
            li.snapshot_date = li.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '').replace(/-/ig, '/').split('.')[0]
          })
          this.snapshots = res.data.list.sort((a, b) => {
            return new Date(b.snapshot_date) - new Date(a.snapshot_date)
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.history-list
  clearfix()
  background #F2F2F2
  border 1px solid light-border-color

  .col-dates
    float left
    width 180px
    position relative

    li
      height 32px
      line-height 32px
      font-size 12px
      padding-left 15px
      border-bottom 1px solid light-border-color

      &:last-child
        border none

  .col-details
    min-height 269px
    padding 30px
    background #FFF
    margin-left 181px
    border-left 1px solid light-border-color
</style>
