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
import TimeLine from 'components/g2-charts/TimeLine'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'

export default {
  name: 'AlertTrends',

  components: {
    TimeLine,
    DateTimeMultiplePicker
  },

  data () {
    return {
      // period: 7,
      periods: [1, 7, 30],
      startTime: 0,
      endTime: 0,
      trendData: [{
        date: '9/20',
        val: 10
      }, {
        date: '9/21',
        val: 100
      }, {
        date: '9/22',
        val: 100
      }, {
        date: '9/23',
        val: 100
      }, {
        date: '9/24',
        val: 120
      }, {
        date: '9/25',
        val: 100
      }, {
        date: '9/26',
        val: 150
      }]
      // trendData: []
    }
  },

  // computed: {
  //   trendData () {
  //     return [{
  //       date: new Date(),
  //       value: 10
  //     }, {
  //       date: new Date(),
  //       value: 10
  //     }]
  //   }
  // },

  methods: {
    /**
     * 处理时间选择
     * @author weijie
     */
    onTimeChange (start, end) {
      // this.period = ''
      this.startTime = start.getTime()
      this.endTime = end.getTime()
      // this.getTagTrend()
    },

    getTrends () {
    }
  }
}
</script>
