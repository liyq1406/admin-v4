<template>
  <div class="panel">
    <div class="panel-bd">
      <!-- <div class="chart-box mt20">
        <div class="with-loading">
          <line-chart :series="snapshotSeries" :x-axis-data="snapshotXAxisData" v-ref:trend-chart></line-chart>
          <div class="icon-loading" v-show="loadingProductTrends">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div> -->
      <div class="filter-bar filter-bar-head">
        <div class="filter-group fl">
          <div class="filter-group-item">
            <v-select label="Power" width="110px" size="small">
              <span slot="label">显示</span>
            </v-select>
          </div>
        </div>
        <div class="filter-group fr">
          <div class="filter-group-item">
            <!-- <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button> -->
          </div>
          <!-- <div class="filter-group-item">
            <date-time-range-picker></date-time-range-picker>
          </div> -->
          <div class="filter-group-item">
            <radio-button-group :items="locales.data.BIG_PERIODS" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
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
      <c-table :headers="headers" :tables="tables"></c-table>
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
      currentPage: 1,
      countPerPage: 20,
      snapshots: [],
      datapoints: [{
        index: 'pm25',
        description: 'PM2.5',
        selected: true
      }],
      period: 7,
      // 趋势
      trends: {
        data: [],
        options: {}
      },
      headers: [
        {
          key: '_id',
          title: '端点ID',
          class: 'tac w250'
        },
        {
          key: 'data',
          title: '数据值',
          class: 'tac'
        },
        {
          key: 'uploda_time',
          title: '上报时间',
          sortType: -1,
          class: 'tac w250'
        }
      ]
    }
  },
  computed: {
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

    selectedDatapoints () {
      return this.datapoints.filter((item) => {
        return item.selected
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
          title: `${item.index} (${item.description})`
        }
        result.push(obj)
      })
      return result
    },

    querySnapshotCondition () {
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

  ready () {
    // this.getSnapshot()
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
  },

  methods: {
    /**
     * 获取快照数据
     */
    getSnapshot () {
      api.snapshot.getSnapshot(this.$route.params.product_id, this.$route.params.device_id, this.querySnapshotCondition).then((res) => {
        if (res.status === 200) {
          // 获取全部数组数据
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

<style lang="stylus">
@import '../../../../assets/stylus/common'
</style>
