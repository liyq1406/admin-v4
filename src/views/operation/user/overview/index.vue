<template>
  <div>
    <panel>
      <div class="row user-card">
        <div class="col-6 total-box">
          <statistic :info="statistic.total" title="总用户数" color="gray" :has-chart="true" align="center" :titletop="true">
            <interval-icon color="gray"></interval-icon>
          </statistic>
        </div>
        <div class="col-6">
          <statistic :info="statistic.add" title="今日新增" color="green" :has-chart="true" align="center" :titletop="true">
            <interval-icon color="green"></interval-icon>
          </statistic>
        </div>
        <div class="col-6">
          <statistic :info="statistic.active" title="今日活跃用户" color="blue" :has-chart="true" align="center" :titletop="true">
            <interval-icon color="blue"></interval-icon>
          </statistic>
        </div>
        <div class="col-6">
          <statistic :info="statistic.seventTotal" title="过去7天活跃用户数" color="orange" :has-chart="true" align="center" :titletop="true">
            <interval-icon color="orange"></interval-icon>
          </statistic>
        </div>
      </div>
    </panel>
    <user-trend></user-trend>
    <user-distribution></user-distribution>
  </div>
</template>

<script>
// import api from 'api'
// import G2 from 'g2'
import Panel from 'components/Panel'
import Statistic from 'components/Statistic'
import { globalMixins } from 'src/mixins'
import UserTrend from './user-trend'
import UserDistribution from './user-distribution'
import IntervalIcon from 'components/g2-charts/IntervalIcon'
import {getTotalUser, getTrend} from './api-user'

export default {
  name: 'Dashboard',

  mixins: [globalMixins],

  components: {
    Panel,
    Statistic,
    UserTrend,
    UserDistribution,
    IntervalIcon
  },

  data () {
    return {
      // 统计
      statistic: {
        // 用户总数
        total: {
          total: '',
          change: ''
        },
        add: {
          total: '',
          change: ''
        },
        active: {
          total: '',
          change: ''
        },
        seventTotal: {
          total: '',
          change: ''
        }
      }
    }
  },

  ready () {
    this.getUserCount()
    this.getRecentTrend()
  },

  methods: {
    getRecentTrend () {
      getTrend(7).then((res) => {
        var compare = (a, b) => {
          if (a.date.getTime() > b.date.getTime()) {
            return -1
          } else if (a.date.getTime() < b.date.getTime()) {
            return 1
          } else {
            return 0
          }
        }

        if (res.add.length > 0) {
          res.add.sort(compare)
          this.statistic.add.total = res.add[0].val
          if (res.add.length > 1) {
            this.statistic.add.change = res.add[0].val - res.add[1].val
          }
        }

        if (res.active.length > 0) {
          res.active.sort(compare)
          this.statistic.active.total = res.active[0].val
          if (res.active.length > 1) {
            this.statistic.active.change = res.active[0].val - res.active[1].val
          }
        }

        let seventTotal = 0
        res.active.forEach((item) => {
          seventTotal += item.val
        })
        this.statistic.seventTotal.total = seventTotal
        this.getLastSevenUser()
      }).catch((res) => {
        this.handleError(res)
      })
    },
    getLastSevenUser () {
      getTrend([7, 7]).then((res) => {
        let lastSeventTotal = 0
        res.active.forEach((item) => {
          lastSeventTotal += item.val
        })
        this.statistic.seventTotal.change = this.statistic.seventTotal.total - lastSeventTotal
      })
    },
    getUserCount () {
      getTotalUser().then((res) => {
        this.statistic.total.total = res.total
        this.statistic.total.change = res.add
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.user-card
  .x-statistic
    & > .info
      font-size 36px
      margin 7px 0

    & > .chart
      size 120px 30px

  .total-box
    .x-statistic
      position relative

      & > .info
        font-size 44px
        margin 20px 0 0

      & > .tit
        absolute left 50% top 100px
        margin-left -24px

.top-regions
.top-phones
  h3
    text-align center
    font-size 14px
    color gray
.panel
  padding-top 20px
.border-top-style
  border-top 1px solid #e5e5e5
  margin-top 10px
</style>
