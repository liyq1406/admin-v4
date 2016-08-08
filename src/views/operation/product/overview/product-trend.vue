<template>
  <div class="panel mt20 no-split-line">
    <div class="panel-hd">
      <h2 class="col-4">产品趋势</h2>
    </div>
    <div class="panel-bd">
      <div class="tab-s2 tab-s2-full mb5">
        <div class="actions">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="period" @select="activatedSelect"></radio-button-group>
        </div>
        <ul>
          <li v-for="item in locales.data.PRODUCT_FILTERS" :class="{'active':trendTabIndex===$index}" @click="trendTabIndex=$index">{{ item.label }}</li>
        </ul>
      </div>
      <div class="row">
        <div class="col-offset-12 col-12 row">
          <div class="col-12">
            <statistic :info="today" title="今日增长" tooltip="今日增长" color="green" :inline="true"></statistic>
          </div>
          <div class="col-12">
            <statistic :info="avg" :title="period+'天平均增长'" :tooltip="period+'天平均增长'" color="orange" :inline="true"></statistic>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-24" v-if="trendTabIndex === 0">
          <time-line :data="activatedData" :margin="customMargin"></time-line>
        </div>
        <div class="col-24" v-else>
          <time-line :data="totalData" :margin="customMargin"></time-line>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimeLine from 'components/g2-charts/TimeLine'
import Interval from 'components/g2-charts/Interval'
import RadioButtonGroup from 'components/RadioButtonGroup'
import { globalMixins } from 'src/mixins'
import Statistic from 'components/Statistic'
import {getActivatedTrend} from './api-product'
import _ from 'lodash'

export default {
  name: 'producttrend',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    RadioButtonGroup,
    TimeLine,
    Interval,
    Statistic
  },

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  data () {
    return {
      trendTabIndex: 0,
      period: 7,
      activatedData: [], // 激活设备数据
      totalData: [], // 累计设备数据
      avg: { // 平均设备数据
        change: '--',
        total: '--'
      },
      today: { // 今日设备数据
        change: '--',
        total: '--'
      }
    }
  },

  computed: {
    avgTitle () {
      return this.period + '天平均增长'
    },
    avgTooltip () {
      return this.period + '天平均增长'
    }
  },

  watch: {
    currentProduct () {
      if (this.currentProduct.id) {
        this.getActivatedProductsTrend(this.currentProduct, 7)
      }
    }
  },

  ready () {
    if (this.currentProduct.id) {
      this.getActivatedProductsTrend(this.currentProduct, 7)
    }
  },
  methods: {
    // 将所有产品数据合并成一个数组
    combineRecv (recv) {
      let res = []
      recv.forEach((item) => {
        let temp = {}
        temp.date = item.day
        temp.val = item.count
        res.push(temp)
      })
      return res
    },
    getActivatedProductsTrend (product, duration) {
      getActivatedTrend(product.id, duration).then((res) => {
        this.activatedData = this.combineRecv(res.activated)
        this.totalData = this.combineRecv(res.total)
        this.avg.total = this.countAvg(this.activatedData, duration)
        // 计算上个取值周期的平均值
        this.getLastDurationData(product, [duration, duration])
        // 计算今日新增
        this.countTodayAdd(this.activatedData, duration)
      }).catch((res) => {
        this.handleError(res)
      })
    },
    countTodayAdd (activatedData, period) {
      var data = _.clone(activatedData)
      // 只在初始化计算一次
      if (data.length < 1) {
        return
      }
      if (period === 7) { // 只在初始化时计算一次
        // 计算最近2天的值
        data.sort((a, b) => {
          if (a.date.getTime() > b.date.getTime()) {
            return -1
          } else if (a.date.getTime() < b.date.getTime()) {
            return 1
          } else {
            return 0
          }
        })

        this.today.total = data[0].val
        if (data.length >= 2) {
          this.today.change = this.today.total - data[1].val
        }
      }
    },
    activatedSelect () {
      this.getActivatedProductsTrend(this.currentProduct, this.period)
    },
    // 获取上一个取值周期的所有数据，为了计算平均增长
    getLastDurationData (product, duration) {
      getActivatedTrend(product.id, duration).then((res) => {
        var activatedData = this.combineRecv(res.activated)

        this.avg.change = this.avg.total - this.countAvg(activatedData, duration[0])
      }).catch((res) => {
        this.handleError(res)
      })
    },
    countAvg (data, duration) {
      var total = 0
      data.forEach((item) => {
        total += item.val
      })
      return parseInt(total / duration)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
.blockdiv
  display block!important
  margin-top 10px

.pd15
  .x-statistic-left
    padding-left 15px!important

.top
  h3
    font-size 14px
    text-indent 100px
    text-align left
    margin 10px 0 5px
    color gray
</style>
