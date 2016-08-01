<template>
  <div>
    <panel title="产品趋势" class="mb20">
      <div class="left-actions blockdiv" slot="left-actions">
        <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="trends.products.activated.period" @select="activatedSelect"><span slot="label" class="label"></span></radio-button-group>
        <div class="tab-s2 mt20 mb5">
          <ul>
            <li v-for="item in locales.data.PRODUCT_FILTERS" @click="trendTabIndex=$index" :class="{'active':trendTabIndex===$index}">{{ item.label }}</li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-14" v-if="trendTabIndex === 0">
          <time-line :data="trends.products.activated.data" :type="'smooth'"></time-line>
        </div>
        <div class="col-14" v-else>
          <time-line :data="trends.products.activated.totalData" :type="'smooth'"></time-line>
        </div>
        <div class="col-9">
          <div class="row">
            <div class="col-24 col-offset-1 tac pd15">
              <statistic :info="trends.products.activated.avg.info" title="7天平均增长" tooltip="7天平均增长" color="orange" :inline="true"></statistic>
            </div>
          </div>
          <div class="top">
            <h3>7天激活TOP5</h3>
            <interval :data="trends.products.activated.topAdded.data" :options="trends.products.activated.topAdded.options"></interval>
          </div>
          <!-- <div class="top">
            <h3>今日在线TOP3</h3>
            <interval :data="trends.products.topOnline.data" :options="trends.products.topOnline.options"></interval>
          </div> -->
        </div>
      </div>
    </panel>

    <panel>
      <div class="panel-hd bordered">
        <h2 class="col-4">产品活跃度</h2>
        <div class="fr col-20 products-trends-head">
          <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="trends.products.active.period"  @select="activeSelect"><span slot="label" class="label"></span></radio-button-group>
        </div>
      </div>
      <div class="row">
        <div class="col-14">
          <time-line :data="trends.products.active.data" type="smooth"></time-line>
        </div>
        <div class="col-10">
          <pie :data="activated.data"></pie>
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
import Pie from 'components/g2-charts/Pie'
import { globalMixins } from 'src/mixins'
import Statistic from 'components/Statistic'
import {getActiveTrend, getActivatedTrend} from './statistics'

export default {
  name: 'productline',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Panel,
    RadioButtonGroup,
    TimeLine,
    Interval,
    Pie,
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
      // 趋势
      trends: {
        // 产品
        products: {
          activated: {
            period: 7,
            data: [],
            totalData: [],
            avg: {
              options: {},
              info: {
                change: '--',
                total: '--'
              }
            },
            topAdded: {
              options: {
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
                legend: false
              },
              data: []
            }
          },
          active: {
            period: 7,
            data: []
          }
        }
      },
      // 产品信息占比
      activated: {
        data: []
      }
    }
  },

  watch: {
    products () {
      if (this.products.length > 0) {
        this.getActivatedProductsTrend(this.products, 7)
        this.getActiveProductsTrend(this.products, 7)
      }
    }
  },

  ready () {
  },
  methods: {
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

      // 排序选出top5
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
        products = products.slice(0, 5)
      }
      this.trends.products.activated.topAdded.data = products
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
            this.trends.products.activated.data = this.combineRecv(recv.activated)
            // 计算激活top5
            this.countTopFive(recv.activated)
          }
          if (recv.total.length === prodLength) {
            this.trends.products.activated.totalData = this.combineRecv(recv.total)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      })
    },
    getActiveProductsTrend (products, duration) {
      var prodLength = products.length
      var recv = {
        active: [],
        add: []
      }
      products.forEach((item) => {
        getActiveTrend(item.id, duration).then((res) => {
          recv.active.push({
            product: item.name,
            data: res.active
          })
          recv.add.push({
            product: item.name,
            data: res.add
          })

          if (recv.active.length === prodLength) {
            this.trends.products.active.data = this.combineRecv(recv.active)
          }
          if (recv.add.length === prodLength) {
            this.countRecv(recv.add)
            // this.trends.products.active.data = this.combineRecv(recv)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      })
    },
    countRecv (recv) {
      var countActivated = 0
      var countAdd = 0
      recv.forEach((item) => {
        item.data.forEach((i) => {
          countActivated += i.activated
          countAdd += i.add
        })
      })

      this.activated.data = [
        {
          name: '未激活设备',
          value: Math.abs(countAdd - countActivated)
        },
        {
          name: '激活设备',
          value: countActivated
        }
      ]
    },
    activatedSelect () {
      this.getActivatedProductsTrend(this.products, this.trends.products.activated.period)
    },
    activeSelect () {
      console.log('activeSelect')
      this.getActiveProductsTrend(this.products, this.trends.products.active.period)
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
