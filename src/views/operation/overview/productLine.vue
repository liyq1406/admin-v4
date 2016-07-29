<template>
  <div>
    <panel title="产品趋势" class="mb20">
      <div class="left-actions blockdiv" slot="left-actions">
        <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="trends.products.period"><span slot="label" class="label"></span></radio-button-group>
        <div class="tab-s2 mt20 mb5">
          <ul>
            <li v-for="item in locales.data.PRODUCT_FILTERS" @click="trendTabIndex=$index" :class="{'active':trendTabIndex===$index}">{{ item.label }}</li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="col-14">
          <time-line :data="trends.products.data" :type="'smooth'"></time-line>
        </div>
        <div class="col-9">
          <div class="row">
            <div class="col-24 col-offset-1 tac pd15">
              <statistic :info="trends.products.avg.info" title="7天平均增长" tooltip="7天平均增长" color="orange" :inline="true"></statistic>
            </div>
          </div>
          <div class="top">
            <h3>7天激活TOP5</h3>
            <interval :data="trends.products.topAdded.data" :options="trends.products.topAdded.options"></interval>
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
          <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="trends.products.period"><span slot="label" class="label"></span></radio-button-group>
        </div>
      </div>
      <div class="row">
        <div class="col-14">
          <time-line :data="trends.products.data" type="smooth"></time-line>
        </div>
        <div class="col-10">
          <pie :data="activated.data"></pie>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import api from 'api'
import Mock from 'mockjs'
import Panel from 'components/Panel'
import TimeLine from 'components/g2-charts/TimeLine'
import Interval from 'components/g2-charts/Interval'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Pie from 'components/g2-charts/Pie'
import { globalMixins } from 'src/mixins'
import _ from 'lodash'
import Statistic from 'components/Statistic'

export default {
  name: 'Dashboard',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
    Panel,
    RadioButtonGroup,
    TimeLine,
    Interval,
    Pie,
    Statistic
  },

  data () {
    return {
      trendTabIndex: 0,
      // 趋势
      trends: {
        // 产品
        products: {
          options: {},
          period: 7,
          filter: 'added',
          data: [],
          today: {
            options: {},
            info: {}
          },
          avg: {
            options: {},
            info: {
              change: '--',
              total: '--'
            }
          },
          topAdded: {
            options: {},
            data: []
          },
          topOnline: {
            options: {},
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
        this.products.forEach((item) => {
          this.getProductTrend(item.id, '2016-7-22', '2016-7-29')
        })
        // this.getProductTrend()
      }
    }
  },

  ready () {
    // 产品趋势分析 -----------------------------------------------------
    const PRODUCTS = ['空气净化器', 'WI-FI智能灯']

    // var tplPoductTrends = {
    //   'change|-200-200': 0,
    //   'total|10-1000': 1000
    // }
    // 今日
    this.trends.products.today = {
      info: {
        change: 5,
        total: 139
      }
    }

    // Top3
    var productTrendsTopOptions = {
      props: {
        plotCfg: {
          margin: [0, 0, 0, 180]
        }
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
      position: 'product*count'
    }
    // var tplProductTrendsTopData = {
    //   'list|2': [{
    //     'count|10-20': 10,
    //     'product|+1': PRODUCTS
    //   }]
    // }
    this.trends.products.topAdded = {
      data: [],
      options: _.merge({}, productTrendsTopOptions, {
        props: {
          height: 90
        },
        color: 'product',
        horizontal: true,
        // axis: false,
        legend: false
      })
    }
    this.trends.products.topOnline = {
      data: Mock.mock({
        'list|2': [{
          'count|+1': [807, 4709],
          'product|+1': PRODUCTS
        }]
      }).list,
      options: _.merge({}, productTrendsTopOptions, {
        props: {
          height: 80
        },
        color: 'product',
        horizontal: true,
        // axis: false,
        legend: false
      })
    }

    // this.activated = {
    //   data: [
    //     {name: '已激活设备数', value: 29887},
    //     {name: '未激活设备数', value: 28538}
    //   ]
    // }
  },
  methods: {
    getProductTrend (productIdid, startDay, endDay) {
      this.createDurationTime()
      api.statistics.getProductTrend(productIdid, startDay, endDay).then((res) => {
        console.log(res)
      }).catch((res) => {
        this.handleError(res)
      })
    },
    createDurationTime (duration) {
      var curTime = new Date()
      var startTime = curTime
      // var curStr = cur.getFullYear().toString() + '-' + (cur.getMonth() + 1).toString() + '-' + cur.getDate().toString()
      switch (duration) {
        case 7:
          startTime = new Date(curTime.getTime() - 3600 * 1000 * 24 * 7)
          break
        case 30:
          startTime = new Date(curTime.getTime() - 3600 * 1000 * 24 * 30)
          break
        case 90:
          startTime = new Date(curTime.getTime() - 3600 * 1000 * 24 * 90)
          break
        default:
          startTime = new Date(curTime.getTime() - 3600 * 1000 * 24 * 7)
          break
      }

      var startDay = startTime.getFullYear().toString() + '-' + (startTime.getMonth() + 1).toString() + '-' + startTime.getDate().toString()
      var endDay = curTime.getFullYear().toString() + '-' + (curTime.getMonth() + 1).toString() + '-' + curTime.getDate().toString()

      return [startDay, endDay]
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
    text-indent 180px
    margin 10px 0 5px
    color gray
</style>
