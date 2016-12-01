<template>
  <div class="panel mt20 mb20">
    <div class="panel-hd panel-hd-full bordered">
      <h2>{{ $t('operation.overview.model_analysis.title') }}</h2>
    </div>
    <div class="row">
      <div class="col-8">
        <chart :options="modelOptions"></chart>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'components/chart/index'
import api from 'api'
import truncate from 'filters/truncate'

export default {
  name: 'ProductModel',
  components: {
    Chart
  },

  vuex: {
    getters: {
      releasedProducts: ({ products }) => products.released
    }
  },

  data () {
    return {
      active: { // 激活设备数据
        series: [],
        xAxis: []
      },
      activated: 0,
      total: 0,
      productsDevices: [],
      inited: false,
      noNameCount: 0
    }
  },

  computed: {
    modelOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: _.map(this.productsDevices, 'name')
        },
        series: [{
          name: this.$t('common.count'),
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.productsDevices,
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
      if (this.releasedProducts.length && !this.inited) {
        this.inited = true
        this.productsDevices = []
        this.noNameCount = 0
        this.releasedProducts.forEach((item) => {
          this.getProductSummary(item)
        })
      }
    },
    getProductSummary (product) {
      api.statistics.getProductSummary(product.id).then((res) => {
        if (res.status === 200) {
          this.productsDevices.push({
            name: truncate(product.mode || this.$t('operation.overview.model_analysis.other') + ++this.noNameCount, 24),
            value: res.data.total
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
</style>
