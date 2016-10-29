<template>
  <div class="panel">
    <div class="panel-hd">
      <h2>{{ $t('operation.user.overview.trend.title') }}</h2>
    </div>
    <div class="panel-bd">
      <div class="filter-bar filter-bar-head filter-bar-full">
        <div class="filter-group">
          <div class="filter-group-item">
            <radio-button-group :items="userCatList" :value.sync="userCat"><span slot="label" class="label"></span></radio-button-group>
          </div>
          <div class="filter-group-item fr">
            <date-time-multiple-picker @timechange="timeFilter" :periods="periods" :default-period="defaultPeriod"></date-time-multiple-picker>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="mb20" v-if="userCat === 0">
          <chart :options="addOptions" :loading="loadingData"></chart>
        </div>
        <div class="mb20" v-if="userCat === 1">
          <chart :options="activeOptions" :loading="loadingData"></chart>
        </div>
        <div class="mb20" v-if="userCat === 2">
          <chart :options="totalOptions" :loading="loadingData"></chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Panel from 'components/Panel'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Chart from 'components/Chart/index'
import {getTrend} from '../api-user'
import { globalMixins } from 'src/mixins'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import formatDate from 'filters/format-date'
import _ from 'lodash'
import {getLastYearDate} from 'utils'

export default {
  name: 'user-trend',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Panel,
    RadioButtonGroup,
    DateTimeMultiplePicker,
    Chart
  },

  data () {
    return {
      loadingData: false,
      periods: [7, 30, 90],
      defaultPeriod: 7,
      addData: [],
      activeData: [],
      totalData: [],
      userCat: 0,
      userCatList: [
        {
          label: this.$t('operation.user.overview.trend.add'),
          value: 0
        }, {
          label: this.$t('operation.user.overview.trend.active'),
          value: 1
        }, {
          label: this.$t('operation.user.overview.trend.sum'),
          value: 2
        }
      ]
    }
  },

  computed: {
    // 新增用户图表配置
    addOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 20,
          x2: 15,
          y2: 20
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: _.map(this.addData, (item) => {
            return formatDate(item.date, 'MM-dd', true)
          })
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: [{
          name: this.$t('common.count'),
          type: 'line',
          data: _.map(this.addData, 'val')
        }]
      }
    },

    // 活跃用户图表配置
    activeOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 20,
          x2: 15,
          y2: 20
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: _.map(this.activeData, (item) => {
            return formatDate(item.date, 'MM-dd', true)
          })
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: [{
          name: this.$t('common.count'),
          type: 'line',
          data: _.map(this.activeData, 'val')
        }]
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
          y: 20,
          x2: 15,
          y2: 20
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: _.map(this.totalData, (item) => {
            return formatDate(item.date, 'MM-dd', true)
          })
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: [{
          name: this.$t('common.count'),
          type: 'line',
          data: _.map(this.totalData, 'val')
        }]
      }
    }
  },

  ready () {
    // this.getUserTrend(7)
  },

  methods: {
    getUserTrend (duration) {
      this.loadingData = true
      getTrend(duration).then((res) => {
        this.addData = res.add
        this.totalData = res.total
        this.activeData = res.active
        this.avg.total = this.countAvgAdd(this.addData, this.period)
        this.countTodayAdd(this.addData, this.period)
        this.getLastDurationData(this.period)
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    countTodayAdd (addData, period) {
      var data = _.clone(addData)
      // 只在初始化计算一次
      if (data.length < 1) {
        return
      }
      if (period === 30) { // 只在初始化时计算一次
        // 计算最近2天的值
        data.sort((a, b) => {
          if (a.day.getTime() > b.day.getTime()) {
            return -1
          } else if (a.day.getTime() < b.day.getTime()) {
            return 1
          } else {
            return 0
          }
        })

        this.today.total = data[0].val
        if (data.length > 2) {
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
      return parseInt(total / duration)
    },
    // 获取上一个取值周期的所有数据，为了计算平均增长
    getLastDurationData (duration) {
      getTrend([duration, duration]).then((res) => {
        this.avg.change = this.avg.total - this.countAvgAdd(res.add, duration)
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 时间选择限制：
    // 1. 不能选取未来时间
    // 2. 选取时间段不能超过12个月
    timeFilter (start, end) {
      var cur = new Date()
      if (end.getTime() >= (cur.getTime() - 3600 * 1000 * 24)) { // 因为当天的累计用户服务器始终未0，所以不请求当天数据！！！！
        end = new Date(cur.getTime() - 3600 * 1000 * 24)
      }

      if (start.getTime() > end.getTime()) {
        return
      }

      let lastYear = getLastYearDate(end)

      if (start.getTime() < lastYear.getTime()) {
        start = lastYear
      }

      // 计算结束时间距现在多少天
      let offset = Math.floor((cur.getTime() - end.getTime()) / (3600 * 1000 * 24))
      let duration = Math.floor((end.getTime() - start.getTime()) / (3600 * 1000 * 24))
      this.getUserTrend([offset, duration + 1])

      this.period = 0
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

.statistic
  .x-panel
    padding 0

.top
  h3
    font-size 14px
    text-indent 180px
    margin 10px 0 5px
    color gray
.blockdiv
  display block!important
  margin-top 10px
  /*border-bottom 1px solid #e5e5e5*/
.pd15
  .x-statistic-left
    padding-left 15px!important
</style>
