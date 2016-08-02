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
          <time-line :data="activatedData" :type="'smooth'"></time-line>
        </div>
        <div class="col-14" v-else>
          <time-line :data="totalData" :type="'smooth'"></time-line>
        </div>
        <div class="col-9">
          <div class="row">
            <div class="col-24 col-offset-1 tac pd15">
              <statistic :info="avg.info" title="7天平均增长" tooltip="7天平均增长" color="orange" :inline="true"></statistic>
            </div>
          </div>
          <div class="top">
            <h3>7天激活TOP5</h3>
            <interval :data="topAdded.data" :options="topAdded.options"></interval>
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
          temp.day = prodData.day
          temp['数量'] = prodData.count
          temp['产品'] = item.product
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

      this.topAdded.data = products

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
            this.countTopFive(recv.activated)
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
      this.getActivatedProductsTrend(this.products, this.period)
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
    text-indent 80px
    text-align left
    margin 10px 0 5px
    color gray
</style>
