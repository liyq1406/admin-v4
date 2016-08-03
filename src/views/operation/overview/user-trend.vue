<template>
  <div class="main">
    <panel title="用户趋势">
      <div class="left-actions blockdiv" slot="left-actions">
        <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="period" @select="getUserTrend"><span slot="label" class="label"></span></radio-button-group>
        <div class="tab-s2 mt20 mb5">
          <ul>
            <li v-for="item in locales.data.USER_FILTERS" @click="currIndex=$index" :class="{'active':currIndex===$index}">{{ item.label }}</li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-offset-12 col-12 row">
          <div class="col-12">
            <statistic :info="today" title="今日增长" tooltip="今日增长" color="green" :inline="true"></statistic>
          </div>
          <div class="col-12">
            <statistic :info="avg" title="7天平均增长" tooltip="7天平均增长" color="orange" :inline="true"></statistic>
          </div>
        </div>
      </div>
      <div class="row bottom-line-height">
        <div class="mb20" v-if="currIndex === 0">
          <time-line :data="addData" :type="'smooth'" :margin="customMargin"></time-line>
        </div>
        <div class="mb20" v-if="currIndex === 1">
          <time-line :data="activeData" :type="'smooth'" :margin="customMargin"></time-line>
        </div>
        <div class="mb20" v-if="currIndex === 2">
          <time-line :data="totalData" :type="'smooth'" :margin="customMargin"></time-line>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import Panel from 'components/Panel'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Statistic from 'components/Statistic'
import TimeLine from 'components/g2-charts/TimeLine'
import {getTrend} from './api-user'
import { globalMixins } from 'src/mixins'
import _ from 'lodash'

export default {
  name: 'user-trend',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Panel,
    RadioButtonGroup,
    Statistic,
    TimeLine
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      customMargin: [30, 20, 30, 30],
      currIndex: 0,
      period: 7,
      avg: {
        change: 0,
        total: 0
      },
      today: {
        change: 0,
        total: 0
      },
      addData: [],
      activeData: [],
      totalData: []
    }
  },

  ready () {
    this.getUserTrend()
  },

  methods: {
    getUserTrend () {
      getTrend(this.period).then((res) => {
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

        this.today.total = data[0].count
        if (data.length < 2) {
          this.today.change = this.today.total - data[1].count
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
        total += item.count
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
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

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
