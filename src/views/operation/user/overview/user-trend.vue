<template>
  <div class="main">
    <panel title="用户趋势">
      <div class="left-actions blockdiv filter-bar filter-bar-head" slot="left-actions">
        <div class="filter-group">
          <div class="filter-group-item">
            <radio-button-group :items="userCatList" :value.sync="userCat"><span slot="label" class="label"></span></radio-button-group>
          </div>
          <div class="filter-group-item fr">
            <date-time-multiple-picker @timechange="timeFilter" :periods="periods"></date-time-multiple-picker>
          </div>
          <div class="filter-group-item fr">
          </div>
        </div>
      </div>
      <div class="row bottom-line-height">
        <div class="mb20" v-if="userCat === 0">
          <time-line :data="addData" :margin="customMargin"></time-line>
        </div>
        <div class="mb20" v-if="userCat === 1">
          <time-line :data="activeData" :margin="customMargin"></time-line>
        </div>
        <div class="mb20" v-if="userCat === 2">
          <time-line :data="totalData" :margin="customMargin"></time-line>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import Panel from 'components/Panel'
import RadioButtonGroup from 'components/RadioButtonGroup'
import TimeLine from 'components/g2-charts/TimeLine'
import {getTrend} from './api-user'
import { globalMixins } from 'src/mixins'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import _ from 'lodash'
import {getLastYearDate} from 'helpers/utils'
// import {uniformDate} from 'src/filters'

export default {
  name: 'user-trend',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Panel,
    RadioButtonGroup,
    TimeLine,
    DateTimeMultiplePicker
  },

  data () {
    return {
      customMargin: [30, 20, 30, 30],
      periods: [7, 30, 90],
      addData: [],
      activeData: [],
      totalData: [],
      userCat: 0,
      userCatList: [
        {
          label: '新增用户',
          value: 0
        }, {
          label: '活跃用户',
          value: 1
        }, {
          label: '累计用户',
          value: 2
        }
      ]
    }
  },

  ready () {
    // this.getUserTrend(7)
  },

  methods: {
    getUserTrend (duration) {
      getTrend(duration).then((res) => {
        this.addData = res.add
        this.totalData = res.total
        this.activeData = res.active
        this.avg.total = this.countAvgAdd(this.addData, this.period)
        this.countTodayAdd(this.addData, this.period)
        this.getLastDurationData(this.period)
      }).catch((res) => {
        this.handleError(res)
      })
    },
    countTodayAdd (addData, period) {
      var data = _.clone(addData)
      // 只在初始化计算一次
      if (data.length < 1) {
        return
      }
      if (period === 7) { // 只在初始化时计算一次
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
      if (end.getTime() >= cur.getTime()) {
        end = cur
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
@import '../../../../assets/stylus/common'

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
.bottom-line-height
  height 300px
</style>
