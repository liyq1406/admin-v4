<template>
  <div class="panel">
    <div class="panel-hd panel-hd-full bordered">
      <div class="actions">
        <date-time-multiple-picker :periods="periods" @timechange="onTimeChange" :default-period="defaultPeriod"></date-time-multiple-picker>
      </div>
      <h2>趋势</h2>
    </div>
    <div class="panel-bd">
      <chart :options="trendOptions" :loading="loadingData"></chart>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Chart from 'components/Chart/index'
import { patchLostDates } from 'utils'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import { globalMixins } from 'src/mixins'
import formatDate from 'filters/format-date'
import _ from 'lodash'

export default {
  name: 'AlertTrends',

  mixins: [globalMixins],

  components: {
    Chart,
    DateTimeMultiplePicker
  },

  props: {
    productId: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      periods: [1, 7, 30],
      startTime: null,
      endTime: null,
      scale: 'day',
      trend: {
        xAxis: [],
        series: []
      },
      recvDataCount: 0,
      defaultPeriod: 7
    }
  },

  computed: {
    // 是否正在加载数据
    loadingData () {
      return this.recvDataCount < 3
    },

    // 图例
    legend () {
      return _.map(this.trend.series, 'name')
    },

    // 趋势图表配置
    trendOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 32,
          x2: 15,
          y2: 30
        },
        legend: {
          y: 5,
          data: this.legend
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.trend.xAxis
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: this.trend.series
      }
    }
  },

  watch: {
    productId () {
      this.getTagTrend()
    }
  },

  methods: {
    /**
     * 处理时间选择
     * @author shengzhi
     * @param {Date} start 开始时间
     * @param {Date} end  结束时间
     * @return null
     */
    onTimeChange (start, end) {
      this.startTime = start
      this.endTime = end
      if (end.getTime() - start.getTime() > 3600 * 1000 * 24) {
        this.scale = 'day'
      } else {
        this.scale = 'hour'
      }
      this.getTagTrend()
    },

    /**
     * 获取告警趋势图表数据
     * @author weijie
     */
    getTagTrend () {
      if (this.startTime === null || this.endTime === null) return
      let begin = formatDate(this.startTime, 'yyyy-MM-dd', true)
      let beginHour = this.startTime.getHours()
      let end = formatDate(this.endTime, 'yyyy-MM-dd', true)
      let endHour = this.endTime.getHours()

      if (this.scale !== 'hour') {
        beginHour = 0
        endHour = 24
      }

      let xAxis = []
      let series = []
      const TAGS = this.locales.data.RULE_CANDIDATE_TAGS

      this.recvDataCount = 0
      for (let i = 0, len = TAGS.length; i < len; i++) {
        ((index) => {
          api.alert.getTagTrend(this.$route.params.id, TAGS[index], begin, end, beginHour, endHour).then((res) => {
            if (res.status !== 200) {
              return
            }
            if (this.scale === 'hour') {
              let data = []
              _.forEach(res.data, (item) => {
                var i = 0
                while (i < item.hours.length) {
                  data.push({
                    day: item.day + ' ' + item.hours[i].hour + ':00',
                    value: item.hours[i].message
                  })
                  i++
                }
              })

              let yesterday = new Date().getTime() - 24 * 3600 * 1000
              yesterday = formatDate(yesterday, 'yyyy-MM-dd hh', true) + ':00'
              data = patchLostDates(data, yesterday, 24, ['value'], 'hour')
              if (!xAxis.length) {
                xAxis = _.map(data, 'day')
              }
              series.push({
                name: TAGS[index],
                type: 'line',
                data: _.map(data, 'value')
              })
            } else {
              let data = res.data.map((item) => {
                // 算出某天告警总数
                let sum = _.sum(_.map(item.hours, 'message'))
                return {
                  day: item.day,
                  value: sum
                }
              })
              data = patchLostDates(data, begin, end, ['value'])
              if (!xAxis.length) {
                xAxis = _.map(data, 'day')
              }
              series.push({
                name: TAGS[index],
                type: 'line',
                data: _.map(data, 'value')
              })
            }
            this.recvDataCount++
            this.trend.series = series
            this.trend.xAxis = xAxis
          }).catch((res) => {
            this.handleError(res)
          })
        })(i)
      }
    }
  }
}
</script>
