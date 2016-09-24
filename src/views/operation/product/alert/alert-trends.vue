<template>
  <div class="panel">
    <div class="panel-hd panel-hd-full bordered">
      <div class="actions">
        <date-time-multiple-picker :periods="periods" @timechange="onTimeChange" :default-period="defaultPeriod"></date-time-multiple-picker>
      </div>
      <h2>趋势</h2>
    </div>
    <div class="panel-bd min-height">
      <div v-if="showHour">
        <time-line :data="trendData" :scale="scale"></time-line>
      </div>
      <div v-else>
        <time-line :data="trendData" :scale="scale"></time-line>
      </div>
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

  props: {
    productId: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      showHour: true,
      scale: 'hour', // 折线图默认以小时显示
      periods: [1, 7, 30],
      startTime: null,
      endTime: null,
      trends: {
        light: [],
        medium: [],
        serious: []
      },
      recvDataCount: 0,
      defaultPeriod: 7
    }
  },

  computed: {
    // 趋势数据
    trendData () {
      let temp = this.trends.light.concat(this.trends.medium).concat(this.trends.serious)
      if (temp.length === 0) { // 销毁图标并重新渲染
        this.showHour = !this.showHour
        setTimeout(() => {
          this.showHour = !this.showHour
        }, 0)
      }

      return temp
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
      let begin = uniformDate(this.startTime)
      let beginHour = this.startTime.getHours()
      let end = uniformDate(this.endTime)
      let endHour = this.endTime.getHours()
      const TAGS = {
        light: '通知',
        medium: '轻微',
        serious: '严重'
      }

      this.recvDataCount = 0
      for (var key in TAGS) {
        ((tag) => {
          api.alert.getTagTrend(this.$route.params.id, TAGS[tag], begin, end, beginHour, endHour).then((res) => {
            if (res.status === 200) {
              // 模拟数据开始
              // res.data = [
              //   {day: '2016-07-19', hours: [{hour: '00', message: 10}, {hour: '01', message: 20}]},
              //   {day: '2016-07-20', hours: [{hour: '00', message: 30}, {hour: '01', message: 25}]}
              // ]
              // 模拟数据结束
              if (this.scale === 'hour') {
                let rearr = []
                res.data.forEach((item) => {
                  var i = 0
                  while (i < item.hours.length) {
                    rearr.push({
                      date: item.day + ' ' + item.hours[i].hour + ':00:00',
                      val: item.hours[i].message,
                      name: TAGS[tag]
                    })
                    i++
                  }
                })
                this.trends[tag] = rearr
              } else {
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
              this.recvDataCount++
              if (this.recvDataCount === 3) {
                if (this.scale === 'hour') {
                  this.showHour = true
                } else {
                  this.showHour = false
                }
              }
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

<style lang="stylus" scoped>
.min-height
  height 250px
  overflow hidden
</style>
