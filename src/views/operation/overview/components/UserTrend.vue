<template>
  <div class="panel mt20 mb20">
    <div class="panel-hd">
      <h2>{{ $t('operation.overview.user_trend.title') }}</h2>
    </div>
    <div class="tab-s2 tab-s2-full mt10 mb5">
      <div class="actions">
        <!-- <radio-button-group :items="locales.data.PERIODS" :value.sync="period" @select="getTrend"></radio-button-group> -->
        <date-time-multiple-picker :periods="periods" @timechange="onTimeChange" :default-period="defaultPeriod"></date-time-multiple-picker>
      </div>
      <ul>
        <li v-for="item in locales.data.USER_FILTERS" @click="tabIndex = $index" class="tab-s2-item" :class="{'active': tabIndex === $index}">{{ item.label }}</li>
      </ul>
    </div>
    <div class="row mt10">
      <div class="col-offset-12 col-12 row">
        <div class="col-12">
          <statistic :total="today.total" :change="today.change" :title="$t('common.today_increase')" :tooltip="$t('common.today_increase')" color="green" :titletop="true"></statistic>
        </div>
        <div class="col-12">
          <statistic :total="avg.total" :change="avg.change" :title="$t('common.avg_increase', {period: period})" :tooltip="$t('common.avg_increase', {period: period})" color="orange" :titletop="true"></statistic>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="mb20" v-if="tabIndex === 0">
        <chart :options="addOptions" :loading="loadingTrend"></chart>
      </div>
      <div class="mb20" v-if="tabIndex == 1">
        <chart :options="activeOptions" :loading="loadingTrend"></chart>
      </div>
      <div class="mb20" v-if="tabIndex == 2">
        <chart :options="totalOptions" :loading="loadingTrend"></chart>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Chart from 'components/Chart/index'
import Statistic from 'components/Statistic2'
import { createDayRange, patchLostDates } from 'utils'
import api from 'api'
// import truncate from 'filters/truncate'
import formatDate from 'filters/format-date'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import _ from 'lodash'

export default {
  name: 'UserTrend',

  mixins: [globalMixins],

  components: {
    RadioButtonGroup,
    Chart,
    Statistic,
    DateTimeMultiplePicker
  },

  data () {
    return {
      tabIndex: 0, // 当前 Tab 的索引
      period: 30, // 时间间隔
      addData: [],
      totalData: [],
      add: { // 新增
        series: [],
        xAxis: []
      },
      active: { // 活跃
        series: [],
        xAxis: []
      },
      total: { // 累计
        series: [],
        xAxis: []
      },
      avg: {
        change: 0,
        total: 0
      },
      today: {
        change: 0,
        total: 0
      },
      periods: [7, 30, 90],
      defaultPeriod: 7,
      beforeTime: 1,
      loadingTrend: false
    }
  },

  computed: {
    // avgTitle () {
    //   return this.period + '天平均增长'
    // },
    //
    // avgTooltip () {
    //   return this.period + '天平均增长'
    // },

    // avg () {
    //   return {
    //     count: parseInt((this.latest * 2 - this.doubled) / this.period), // (后段 - 前段) / 时间段
    //     change: 0
    //   }
    // },

    // 新增用户图表配置
    addOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 5,
          x2: 15,
          y2: 20
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.add.xAxis
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: this.add.series
      }
    },

    // 激活用户图表配置
    activeOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 5,
          x2: 15,
          y2: 20
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.active.xAxis
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: this.active.series
      }
    },

    // 累计用户图表配置
    totalOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 5,
          x2: 15,
          y2: 20
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.total.xAxis
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: this.total.series
      }
    }
  },

  ready () {
    this.getTrend()
  },

  methods: {
    /**
     * 时间组件时间改变回调
     */
    onTimeChange (start, end) {
      this.period = parseInt((end - start) / 1000 / 60 / 60 / 24) + 1
      this.beforeTime = parseInt((new Date() - end) / 1000 / 60 / 60 / 24)
      this.getTrend()
    },
    /**
     * 获取产品激活趋势数据
     * 遍历产品列表，获取每种产品的激活趋势数据
     * @author shengzhi
     */
    getTrend () {
      let addSeries = []
      let addXAxis = []
      let activeSeries = []
      let activeXAxis = []
      let totalSeries = []
      let totalXAxis = []

      // 数据日期范围
      let range = createDayRange(this.beforeTime, this.period)

      api.statistics.getUserTrend(range.start, range.end).then((res) => {
        this.addData = _.map(res.data, (item) => {
          return {
            day: item.day,
            val: item.add
          }
        })
        this.totalData = _.map(res.data, (item) => {
          return {
            day: item.day,
            val: item.total
          }
        })
        this.avg.total = this.countAvgAdd(this.addData, this.period)
        this.countTodayAdd(this.addData, this.period)

        // 日期数据补全，缺失的日期数据全部补0
        let userData = patchLostDates(res.data, range.start, this.period, ['add', 'active', 'total'])
        let addObj = {
          name: this.$t('common.count'),
          type: 'line',
          data: []
        }
        let activeObj = {
          name: this.$t('common.count'),
          type: 'line',
          data: []
        }
        let totalObj = {
          name: this.$t('common.count'),
          type: 'line',
          data: []
        }

        this.doubled = _.reduce(_.map(res.data, 'add'), (prev, next) => {
          return prev + next
        }, this.doubled)

        // 最新的数据在后半段
        for (let i = 0; i < this.period; i++) {
          this.latest += userData[i].add
          addObj.data.push(userData[i].add)
          activeObj.data.push(userData[i].active)
          totalObj.data.push(userData[i].total)
          addXAxis.push(formatDate(userData[i].day, 'MM-dd', true))
          activeXAxis.push(formatDate(userData[i].day, 'MM-dd', true))
          totalXAxis.push(formatDate(userData[i].day, 'MM-dd', true))
        }
        addSeries.push(addObj)
        activeSeries.push(activeObj)
        totalSeries.push(totalObj)
      })

      this.add.series = addSeries
      this.add.xAxis = addXAxis
      this.active.series = activeSeries
      this.active.xAxis = activeXAxis
      this.total.series = totalSeries
      this.total.xAxis = totalXAxis
    },

    countTodayAdd (addData, period) {
      var data = _.clone(addData)
      // console.log(period)
      // 只在初始化计算一次
      if (data.length < 1) {
        return
      }
      if (period === 30) { // 只在初始化时计算一次
        // 计算最近2天的值
        data.sort((a, b) => {
          let t1 = new Date(a.day).getTime()
          let t2 = new Date(b.day).getTime()
          if (t1 > t2) {
            return -1
          } else if (t1 < t2) {
            return 1
          } else {
            return 0
          }
        })

        this.today.total = data[0].val
        if (data.length < 2) {
          this.today.change = this.today.total - data[1].val
        }
      }
    },

    // 计算平均增长
    countAvgAdd (data, duration) {
      if (!duration) {
        throw new TypeError()
      }
      let total = 0
      data.forEach((item) => {
        total += item.val
      })
      return Math.round(total / duration)
    }
  }
}
</script>
