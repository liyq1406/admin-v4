<template>
  <div>
    <panel title="产品趋势" class="mb20">
      <div class="left-actions blockdiv" slot="left-actions">
        <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="period" @select="activatedSelect"><span slot="label" class="label"></span></radio-button-group>
        <div class="tab-s2 mt10 mb5">
          <ul>
            <li v-for="item in locales.data.PRODUCT_FILTERS" @click="trendTabIndex=$index" :class="{'active':trendTabIndex===$index}">{{ item.label }}</li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-14" v-if="trendTabIndex === 0">
          <time-line :data="activatedData"></time-line>
        </div>
        <div class="col-14" v-else>
          <time-line :data="totalData"></time-line>
        </div>
        <div class="col-9">
          <div class="row">
            <div class="col-24 col-offset-1 tac pd15">
              <statistic :info="avg.info" :title="avgTitle" :tooltip="avgTooltip" color="orange" :inline="true"></statistic>
            </div>
          </div>
          <div class="top">
            <h3>{{period}}天激活TOP{{topAdded.data.length}}</h3>
            <template v-if="repaintTopFive">
              <interval :data="topAdded.data" :options="topAdded.options"></interval>
            </template>
          </div>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import Panel from 'components/Panel'
import TimeLine from 'components/g2-charts/TimeLine'
import Interval from 'components/g2-charts/Interval'
import RadioButtonGroup from 'components/RadioButtonGroup'
import { globalMixins } from 'src/mixins'
import Statistic from 'components/Statistic'
import {getActivatedTrend} from './api-product'
import { uniformDate } from 'src/filters'
import _ from 'lodash'

export default {
  name: 'producttrend',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Panel,
    RadioButtonGroup,
    TimeLine,
    Interval,
    Statistic
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      repaintTopFive: true, // 添加该变量为了处理g2的bug： changeData时g2会将传入数组根据source时的数组结构重新排序。所以总过v-if重绘
      trendTabIndex: 0,
      period: 7,
      activatedData: [], // 激活设备数据
      totalData: [], // 累计设备数据
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
    }
  },

  watch: {
    products () {
      if (this.products.length > 0) {
        this.getActivatedProductsTrend(this.products, 7)
      }
    }
  },

  ready () {
  },
  methods: {
    // 将所有产品数据合并成一个数组
    combineRecv (recv) {
      let res = []
      recv.forEach((item) => {
        item.data.forEach((prodData) => {
          let temp = {}
          temp.date = uniformDate(prodData.day)
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
        product.product = item.product
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
      this.repaintTopFive = true
      return products

      // if (window.G2) {
      //   var prodFrame = new window.G2.Frame(products)
      //   prodFrame = window.G2.Frame.sort(prodFrame, 'count')
      //   console.log(prodFrame)
      //   // console.log(typeof prodFrame)
      //   this.topAdded.data = prodFrame
      // }
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
            product: item.name,
            data: res.activated
          })
          recv.total.push({
            product: item.name,
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
      this.repaintTopFive = false
      this.getActivatedProductsTrend(this.products, this.period)
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
</style>
