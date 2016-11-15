<template>
  <div class="panel mt20 mb20">
    <div class="panel-hd panel-hd-full bordered">
      <div class="actions">
        <!-- <radio-button-group :items="locales.data.PERIODS" :value.sync="period" @select="getTrend"></radio-button-group> -->
        <date-time-multiple-picker :periods="periods" @timechange="onTimeChange" :default-period="defaultPeriod"></date-time-multiple-picker>
      </div>
      <h2>{{ $t('operation.product.overview.active.title') }}</h2>
    </div>
    <div class="row">
      <div class="col-14">
        <chart :options="activeOptions" :loading="loadingTrend"></chart>
      </div>
      <div class="col-8 col-offset-2">
        <chart :options="activatedOptions" :loading="loadingSummary"></chart>
        <!-- <pie :data="activeProportion"></pie> -->
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'components/Chart/index'
import { createDayRange, patchLostDates } from 'utils'
import api from 'api'
import formatDate from 'filters/format-date'
export default {
  name: 'ProductActive',
  components: {
    Chart
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
      active: { // 激活设备数据
        series: [],
        xAxis: []
      },
      periods: [7, 30, 90],
      defaultPeriod: 7,
      beforeTime: 1,
      activated: 0,
      total: 0,
      loadingTrend: false,
      loadingSummary: false
    }
  },

  computed: {
    activatedData () {
      return [{
        name: this.$t('operation.product.overview.active.not_active_device'),
        value: this.total - this.activated
      }, {
        name: this.$t('operation.product.overview.active.active_device'),
        value: this.activated
      }]
    },

    // 激活设备图表配置
    activeOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 10,
          x2: 15,
          y2: 20
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.active.xAxis
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: this.active.series
      }
    },

    activatedOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: _.map(this.activatedData, 'name')
        },
        series: [{
          name: this.$t('common.count'),
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.activatedData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    }
  },

  watch: {
    currentProduct () {
      if (this.currentProduct.id) {
        this.getTrend()
        this.getSummary()
      }
    }
  },

  ready () {
    this.getTrend()
    this.getSummary()
  },

  methods: {
    /**
     * 时间组件时间改变回调
     */
    onTimeChange (start, end) {
      this.period = parseInt((end - start) / 1000 / 60 / 60 / 24) + 1
      this.beforeTime = parseInt((new Date() - end) / 1000 / 60 / 60 / 24)
      this.getTrend()
    },
    /**
     * 获取产品激活趋势数据
     * 遍历产品列表，获取每种产品的激活趋势数据
     * @author shengzhi
     */
    getTrend () {
      let series = []
      let xAxis = []

      // 数据日期范围
      let range = createDayRange(this.beforeTime, this.period)

      this.loadingTrend = true
      api.statistics.getProductTrend(this.$route.params.id, range.start, range.end).then((res) => {
        // 日期数据补全，缺失的日期数据全部补0
        let activeData = patchLostDates(res.data, range.start, this.period, ['active'])
        let obj = {
          name: this.$t('common.count'),
          type: 'line',
          data: []
        }

        for (let i = 0; i < this.period; i++) {
          obj.data.push(activeData[i].active)
          xAxis.push(formatDate(activeData[i].day, 'MM-dd', true))
        }
        series.push(obj)
        this.loadingTrend = false
      })

      this.active.series = series
      this.active.xAxis = xAxis
    },

    /**
     * 获取统计数据
     */
    getSummary () {
      this.loadingSummary = true
      api.statistics.getProductSummary(this.$route.params.id).then((res) => {
        if (res.status !== 200) return
        this.activated = res.data.activated
        this.total = res.data.total
        this.loadingSummary = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingSummary = false
      })
    }
  }
}
</script>
