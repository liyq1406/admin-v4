<template>
  <div class="panel mt20 mb20">
    <div class="panel-hd">
      <h2>产品趋势</h2>
    </div>
    <div class="tab-s2 tab-s2-full mt10 mb5">
      <div class="actions">
        <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="period" @select="activatedSelect"><span slot="label" class="label"></span></radio-button-group>
      </div>
      <ul>
        <li v-for="item in locales.data.PRODUCT_FILTERS" @click="trendTabIndex=$index" :class="{'active':trendTabIndex===$index}">{{ item.label }}</li>
      </ul>
    </div>
    <div class="row min-height">
      <div class="col-14" v-if="trendTabIndex === 0">
        <chart :options="activatedOptions" :loading="loadingTrend"></chart>
        <!-- <div class="chart-box" v-chart="activatedOptions" :loading="loadingData"></div> -->
      </div>
      <div class="col-14" v-else>
        <!-- <div class="chart-box" v-chart="sumActivatedOptions" :loading="loadingData"></div> -->
      </div>
      <div class="col-9 col-offset-1">
        <div class="row">
          <div class="col-20 col-offset-4">
            <statistic :info="avg.info" :title="avgTooltip" :tooltip="avgTooltip" color="orange" :titletop="true"></statistic>
          </div>
        </div>
        <div class="top">
          <h3>{{period}}天激活TOP{{topAdded.data.length}}</h3>
          <!-- <div class="chart-box" v-chart="topOptions" height="120px" :loading="loadingData"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Panel from 'components/Panel'
// import TimeLine from 'components/g2-charts/TimeLine'
// import Interval from 'components/g2-charts/Interval'
import Chart from 'components/Chart/index'
import RadioButtonGroup from 'components/RadioButtonGroup'
import { globalMixins } from 'src/mixins'
import Statistic from 'components/Statistic'
import {getActivatedTrend} from './api-product'
import formatDate from 'filters/format-date'
import truncate from 'filters/truncate'
import _ from 'lodash'

export default {
  name: 'producttrend',

  mixins: [globalMixins],

  components: {
    Panel,
    RadioButtonGroup,
    Chart,
    // TimeLine,
    // Interval,
    Statistic
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      loadingData: false,
      requested: false,
      repaintTopFive: true, // 添加该变量为了处理g2的bug： changeData时g2会将传入数组根据source时的数组结构重新排序。所以总过v-if重绘
      trendTabIndex: 0,
      period: 30,
      loaded: 0,
      activatedData: [], // 激活设备数据
      activated: {
        series: [],
        xAxis: []
      }, // 激活设备数据
      totalData: [], // 累计设备数据
      sumActivated: {
        series: [],
        xAxis: []
      }, // 累计设备数据
      avg: { // 平均设备数据
        options: {},
        info: {
          change: '--',
          total: '--'
        }
      },
      topAdded: { // top5
        options: { // 柱状图图标配置
          props: {
            plotCfg: {
              margin: [0, 0, 0, 100]
            },
            height: 100
          },
          defs: {
            'product': {
              type: 'cat',
              alias: '产品'
            },
            'count': {
              alias: '数量',
              min: 0
            }
          },
          position: 'product*count',
          color: 'product',
          horizontal: true,
          legend: false,
          sort: 'count'
        },
        data: [] // 激活设备数据
      }
    }
  },

  computed: {
    avgTitle () {
      return this.period + '天平均增长'
    },
    avgTooltip () {
      return this.period + '天平均增长'
    },

    loadingTrend () {
      return this.loaded !== this.products.length
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
      let COLORS = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
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
            name: `${this.period}天激活数`,
            type: 'bar',
            barMaxWidth: 16, // 柱条的最大宽度
            itemStyle: {
              normal: {
                color (params) {
                  return COLORS[params.dataIndex]
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
    products () {
      this.init()
    }
  },

  ready () {
    this.init()
  },

  methods: {
    init () {
      if (this.products.length > 0 && !this.requested) {
        this.requested = true
        this.getActivatedProductsTrend(this.products, this.period)
        this.getTrend()
      }
    },

    /**
     * 获取产品趋势
     * @author shengzhi
     */
    getTrend () {
      let series = []
      let xAxis = []
      let sumSeries = []
      let sumXAxis = []

      this.loaded = 0
      this.products.forEach((item, index) => {
        getActivatedTrend(item.id, this.period).then((res) => {
          let obj = {
            name: truncate(item.name),
            type: 'line',
            data: []
          }
          let sumObj = {
            name: truncate(item.name),
            type: 'line',
            data: []
          }
          _.forEach(res.activated, (o) => {
            obj.data.push(o.count)
            if (!index) {
              xAxis.push(formatDate(o.day, 'MM-dd', true))
            }
          })
          _.forEach(res.total, (o) => {
            sumObj.data.push(o.count)
            if (!index) {
              sumXAxis.push(formatDate(o.day, 'MM-dd', true))
            }
          })
          series.push(obj)
          sumSeries.push(sumObj)
          this.loaded++
        })
      })
      this.activated.series = series
      this.activated.xAxis = xAxis
      this.sumActivated.series = sumSeries
      this.sumActivated.xAxis = sumXAxis
    },

    // 将所有产品数据合并成一个数组
    combineRecv (recv) {
      let res = []
      recv.forEach((item) => {
        item.data.forEach((prodData) => {
          let temp = {}
          temp.date = formatDate(prodData.day, 'yyyy-MM-dd', true)
          temp.val = prodData.count
          temp.name = item.product
          res.push(temp)
        })
      })
      return res
    },
    // 计算top5产品
    countTopFive (recv) {
      var products = []
      recv.forEach((item) => {
        var product = {
          product: '',
          count: 0
        }
        item.data.forEach((i) => {
          product.count += i.count
        })
        product.product = item.product.length > 6 ? (item.product.substring(0, 5) + '...') : item.product
        products.push(product)
      })

      // 由小到大排序
      products.sort((a, b) => {
        if (a.count > b.count) {
          return 1
        } else if (a.count < b.count) {
          return -1
        } else {
          return 0
        }
      })

      if (products.length > 5) {
        products = products.slice(products.length - 5)
      }
      this.repaintTopFive = false
      setTimeout(() => {
        this.repaintTopFive = true
      }, 0)
      return products
    },
    getActivatedProductsTrend (products, duration) {
      var prodLength = products.length
      var recv = {
        activated: [],
        total: []
      }
      products.forEach((item) => {
        getActivatedTrend(item.id, duration).then((res) => {
          recv.activated.push({
            product: item.name.length > 11 ? (item.name.substring(0, 10) + '...') : item.name,
            data: res.activated
          })
          recv.total.push({
            product: item.name.length > 11 ? (item.name.substring(0, 10) + '...') : item.name,
            data: res.total
          })

          if (recv.activated.length === prodLength) {
            this.activatedData = this.combineRecv(recv.activated)
            // 计算激活top5
            this.topAdded.data = this.countTopFive(recv.activated)
            // 计算平均值
            this.avg.info.total = this.countAvg(this.activatedData, duration)
            // 计算上个取值周期的平均值
            this.getLastDurationData(products, [duration, duration])
          }
          if (recv.total.length === prodLength) {
            this.totalData = this.combineRecv(recv.total)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      })
    },
    activatedSelect () {
      // this.repaintTopFive = false
      this.getActivatedProductsTrend(this.products, this.period)
      this.getTrend()
    },
    // 获取上一个取值周期的所有数据，为了计算平均增长
    getLastDurationData (products, duration) {
      if (products.length <= 0 || !Array.isArray(duration) || duration[0] === undefined || !duration[1] === undefined) {
        return
      }

      var prodLength = products.length
      var recv = {
        activated: []
      }
      products.forEach((item) => {
        getActivatedTrend(item.id, duration).then((res) => {
          recv.activated.push({
            product: item.name,
            data: res.activated
          })

          if (recv.activated.length === prodLength) {
            var activatedData = this.combineRecv(recv.activated)
            // 计算平均值
            if (!_.isNumber(this.avg.info.total)) {
              this.avg.info.total = 0
            }
            this.avg.info.change = this.avg.info.total - this.countAvg(activatedData, duration[0])
          }
        }).catch((res) => {
          this.handleError(res)
        })
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
@import '../../../assets/stylus/common'

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
/*.min-height
  height 250px
  overflow hidden*/
</style>
