<template>
  <div class="panel mt20 mb20">
    <div class="panel-hd">
      <h2>{{ $t('operation.overview.product_trend.title') }}</h2>
    </div>
    <div class="tab-s2 tab-s2-full mt10 mb5">
      <div class="actions">
        <radio-button-group :items="locales.data.PERIODS" :value.sync="period" @select="getTrend"></radio-button-group>
      </div>
      <ul>
        <li v-for="item in locales.data.PRODUCT_FILTERS" @click="tabIndex = $index" :class="{'active': tabIndex === $index}">{{ item.label }}</li>
      </ul>
    </div>
    <div class="row min-height">
      <div class="col-14" v-if="tabIndex === 0">
        <chart :options="activatedOptions" :loading="loadingTrend"></chart>
      </div>
      <div class="col-14" v-else>
        <chart :options="sumActivatedOptions" :loading="loadingTrend"></chart>
      </div>
      <div class="col-9 col-offset-1">
        <div class="row">
          <div class="col-20 col-offset-4">
            <statistic :total="avg.count" :change="avg.change" :title="$t('common.avg_increase', {period: period})" :tooltip="$t('common.avg_increase', {period: period})" color="orange" :titletop="true">
          </div>
        </div>
        <div class="top">
          <h3><span v-show="!loadingTrend">{{ $t('operation.overview.product_trend.top', {period: period, n: topOptions.series[0].data.length}) }}</span></h3>
          <chart :options="topOptions" :loading="loadingTrend" height="120px"></chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Chart from 'components/Chart/index'
import Statistic from 'components/Statistic2'
import { createDayRange, patchLostDates } from 'utils'
import api from 'api'
import truncate from 'filters/truncate'
import formatDate from 'filters/format-date'
import { CHART_COLORS } from 'consts/config'
import _ from 'lodash'

export default {
  name: 'ProductTrend',

  mixins: [globalMixins],

  components: {
    RadioButtonGroup,
    Chart,
    Statistic
  },

  vuex: {
    getters: {
      releasedProducts: ({ products }) => products.released
    }
  },

  data () {
    return {
      loaded: 0, // 已加载产品数
      tabIndex: 0, // 当前 Tab 的索引
      period: 30, // 时间间隔
      activated: { // 激活设备数据
        series: [],
        xAxis: []
      },
      sumActivated: { // 累计激活设备数据
        series: [],
        xAxis: []
      },
      doubled: 0, // 两倍时间段数据总和
      latest: 0 // 时间段数据总和
    }
  },

  computed: {
    avg () {
      return {
        count: parseInt((this.latest * 2 - this.doubled) / this.period), // (后段 - 前段) / 时间段
        change: 0
      }
    },

    loadingTrend () {
      return this.loaded < this.releasedProducts.length
    },

    // 图例
    legend () {
      return _.map(this.activated.series, 'name')
    },

    // 激活设备图表配置
    activatedOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 32,
          x2: 15,
          y2: 20
        },
        legend: {
          y: 5,
          data: this.legend
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.activated.xAxis
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: this.activated.series
      }
    },

    // 累计激活设备图表配置
    sumActivatedOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 32,
          x2: 15,
          y2: 20
        },
        legend: {
          y: 5,
          data: this.legend
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.sumActivated.xAxis
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: this.sumActivated.series
      }
    },

    // 激活数量前5
    topOptions () {
      let topFive = _.map(this.activated.series, (item) => {
        let sum = _.reduce(item.data, (prev, next) => {
          return prev + next
        }, 0)
        return {
          name: item.name,
          count: sum
        }
      })
      topFive = _.sortBy(topFive, ['count'])
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          x: 100,
          y: 5,
          x2: 15,
          y2: 20
        },
        xAxis: {
          type: 'value',
          minInterval: 1,
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: _.map(topFive, 'name')
        },
        series: [
          {
            name: this.$t('operation.overview.product_trend.activated', {period: this.period}),
            type: 'bar',
            barMaxWidth: 16, // 柱条的最大宽度
            itemStyle: {
              normal: {
                color (params) {
                  return CHART_COLORS[params.dataIndex]
                }
              }
            },
            data: _.map(topFive, 'count')
          }
        ]
      }
    }
  },

  watch: {
    // 因为使用了 Vuex 中的产品列表，这里需要监听产品列表的
    // 变化去触发初始化
    releasedProducts () {
      this.init()
    }
  },

  ready () {
    this.init()
  },

  methods: {
    init () {
      if (this.releasedProducts.length) {
        this.getTrend()
      }
    },

    /**
     * 获取产品激活趋势数据
     * 遍历产品列表，获取每种产品的激活趋势数据
     * @author shengzhi
     */
    getTrend () {
      let series = []
      let xAxis = []
      let sumSeries = []
      let sumXAxis = []

      this.doubled = 0
      this.latest = 0
      this.loaded = 0
      this.releasedProducts.forEach((product, index) => {
        // 数据日期范围
        let range = createDayRange(1, this.period * 2)

        api.statistics.getProductTrend(product.id, range.start, range.end).then((res) => {
          // 日期数据补全，缺失的日期数据全部补0
          let activatedData = patchLostDates(res.data, range.start, this.period * 2, ['activated', 'total_activated'])
          let obj = {
            name: truncate(product.name),
            type: 'line',
            data: []
          }
          let sumObj = {
            name: truncate(product.name),
            type: 'line',
            data: []
          }

          this.doubled = _.reduce(_.map(res.data, 'activated'), (prev, next) => {
            return prev + next
          }, this.doubled)

          // 最新的数据在后半段
          for (let i = 0; i < this.period; i++) {
            let pos = i + this.period
            this.latest += activatedData[pos].activated
            obj.data.push(activatedData[pos].activated)
            sumObj.data.push(activatedData[pos].total_activated)

            if (!index) {
              xAxis.push(formatDate(activatedData[pos].day, 'MM-dd', true))
              sumXAxis.push(formatDate(activatedData[pos].day, 'MM-dd', true))
            }
          }
          series.push(obj)
          sumSeries.push(sumObj)
          this.loaded++
        })
      })

      this.activated.series = series
      this.activated.xAxis = xAxis
      this.sumActivated.series = sumSeries
      this.sumActivated.xAxis = sumXAxis
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.top
  h3
    font-size 13px
    text-indent 100px
    text-align left
    margin 10px 0 5px
    height 20px
    color gray
</style>
