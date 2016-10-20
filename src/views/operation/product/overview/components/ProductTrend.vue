<template>
  <div class="panel mt20 mb20">
    <div class="panel-hd">
      <h2>产品趋势</h2>
    </div>
    <div class="tab-s2 tab-s2-full mt10 mb5">
      <div class="actions">
        <radio-button-group :items="locales.data.PERIODS" :value.sync="period" @select="getTrend"></radio-button-group>
      </div>
      <ul>
        <li v-for="item in locales.data.PRODUCT_FILTERS" @click="tabIndex = $index" :class="{'active': tabIndex === $index}">{{ item.label }}</li>
      </ul>
    </div>
    <div class="row mt10">
      <div class="col-offset-12 col-12 row">
        <div class="col-12">
          <statistic :total="today.count" :change="today.change" title="今日增长" tooltip="今日增长" color="green" :titletop="true">
        </div>
        <div class="col-12">
          <statistic :total="avg.count" :change="avg.change" :title="avgTitle" :tooltip="avgTooltip" color="orange" :titletop="true">
        </div>
      </div>
    </div>
    <div class="row min-height">
      <div class="col-24" v-if="tabIndex === 0">
        <chart :options="activatedOptions" :loading="loadingTrend"></chart>
      </div>
      <div class="col-24" v-else>
        <chart :options="sumActivatedOptions" :loading="loadingTrend"></chart>
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
import formatDate from 'filters/format-date'
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
      currentProduct: ({ products }) => products.curr
    }
  },

  data () {
    return {
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
      latest: 0, // 时间段数据总和
      loadingTrend: false
    }
  },

  computed: {
    avgTitle () {
      return this.period + '天平均增长'
    },

    avgTooltip () {
      return this.period + '天平均增长'
    },

    avg () {
      return {
        count: parseInt((this.latest * 2 - this.doubled) / this.period), // (后段 - 前段) / 时间段
        change: 0
      }
    },

    today () {
      return {
        count: 0,
        change: 0
      }
    },

    // 激活设备图表配置
    activatedOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 5,
          x2: 15,
          y2: 20
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
          y: 5,
          x2: 15,
          y2: 20
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
    }
  },

  watch: {
    currentProduct () {
      if (this.currentProduct.id) {
        this.getTrend()
      }
    }
  },

  ready () {
    this.getTrend()
  },

  methods: {
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
      // 数据日期范围
      let range = createDayRange(1, this.period * 2)

      this.loadingTrend = true
      api.statistics.getProductTrend(this.$route.params.id, range.start, range.end).then((res) => {
        // 日期数据补全，缺失的日期数据全部补0
        let activatedData = patchLostDates(res.data, range.start, this.period * 2, ['activated', 'total_activated'])
        let obj = {
          name: '数量',
          type: 'line',
          data: []
        }
        let sumObj = {
          name: '数量',
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

          xAxis.push(formatDate(activatedData[pos].day, 'MM-dd', true))
          sumXAxis.push(formatDate(activatedData[pos].day, 'MM-dd', true))
        }
        series.push(obj)
        sumSeries.push(sumObj)
        this.loadingTrend = false
      })

      this.activated.series = series
      this.activated.xAxis = xAxis
      this.sumActivated.series = sumSeries
      this.sumActivated.xAxis = sumXAxis
    }
  }
}
</script>
