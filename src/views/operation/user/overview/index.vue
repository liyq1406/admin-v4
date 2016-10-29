<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>{{ $t('operation.user.overview.main_title') }}</h2>
    </div>
    <div class="row user-card mt15">
      <div class="col-6 total-box">
        <statistic :info="statistic.total" :title="$t('operation.user.overview.total.count')" color="gray" align="left" :titletop="true"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="statistic.add" :title="$t('operation.user.overview.add.count')" color="green" align="left" :titletop="true"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="statistic.active" :title="$t('operation.user.overview.active.count')" color="blue" align="left" :titletop="true"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="statistic.seventTotal" :title="$t('operation.user.overview.sevent_total.count')" color="orange" align="left" :titletop="true"></statistic>
      </div>
    </div>
    <user-trend></user-trend>
    <user-distribution></user-distribution>
  </div>
</template>

<script>
// import api from 'api'
import Statistic from 'components/Statistic'
import { globalMixins } from 'src/mixins'
import UserTrend from './components/UserTrend'
import UserDistribution from './components/UserDistribution'
import {getTotalUser, getTrend} from './api-user'

export default {
  name: 'Dashboard',

  mixins: [globalMixins],

  components: {
    Statistic,
    UserTrend,
    UserDistribution
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

        // if (res.add.length > 0) {
        //   res.add.sort(compare)
        //   this.statistic.add.total = res.add[0].val
        //   if (res.add.length > 1) {
        //     this.statistic.add.change = res.add[0].val - res.add[1].val
        //   }
        // }

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
        this.statistic.add.total = res.add
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
