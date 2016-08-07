<template>
  <div class="panel no-split-line">
    <div class="panel-hd panel-hd-full bordered">
      <div class="actions">
        <date-time-multiple-picker :periods="periods" @timechange="onTimeChange"></date-time-multiple-picker>
      </div>
      <h2>趋势</h2>
    </div>
    <div class="panel-bd">
      <time-line :data="trendData"></time-line>
    </div>
  </div>
</template>

<script>
import api from 'api'
import TimeLine from 'components/g2-charts/TimeLine'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import { globalMixins } from 'src/mixins'
import { uniformDate } from 'src/filters'
import _ from 'lodash'

export default {
  name: 'AlertTrends',

  mixins: [globalMixins],

  components: {
    TimeLine,
    DateTimeMultiplePicker
  },

  data () {
    return {
      periods: [1, 7, 30],
      startTime: null,
      endTime: null,
      trends: {
        light: [],
        medium: [],
        serious: []
      }
    }
  },

  computed: {
    // 趋势数据
    trendData () {
      return this.trends.light.concat(this.trends.medium).concat(this.trends.serious)
    }
  },

  methods: {
    /**
     * 处理时间选择
     * @author shengzhi
     */
    onTimeChange (start, end) {
      this.startTime = start
      this.endTime = end
      this.getTagTrend()
    },

    /**
     * 获取告警趋势图表数据
     * @author weijie
     */
    getTagTrend () {
      if (this.startTime === null || this.endTime === null) return
      let start = uniformDate(this.startTime)
      let end = uniformDate(this.endTime)
      const TAGS = {
        light: '轻微',
        medium: '中等',
        serious: '重度'
      }

      for (var key in TAGS) {
        ((tag) => {
          api.alert.getTagTrend(this.$route.params.id, TAGS[tag], start, end).then((res) => {
            if (res.status === 200) {
              // 模拟数据开始
              // res.data = [
              //   {day: '2016-07-19', hours: [{hour: '00', message: 10}, {hour: '01', message: 20}]},
              //   {day: '2016-07-20', hours: [{hour: '00', message: 30}, {hour: '01', message: 25}]}
              // ]
              // 模拟数据结束

              this.trends[tag] = res.data.map((item) => {
                // 算出某天告警总数
                let sum = _.map(item.hours, 'message').reduce((prev, next) => {
                  return prev + next
                }, 0)
                return {
                  date: item.day,
                  val: sum,
                  name: TAGS[tag]
                }
              })
            }
          }).catch((res) => {
            this.handleError(res)
          })
        })(key)
      }
    }
  }
}
</script>
