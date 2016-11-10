<template>
  <div class="panel mt20 mb20">
    <div class="panel-hd panel-hd-full bordered">
      <h2>{{ $t('operation.overview.model_analysis.title') }}</h2>
    </div>
    <div class="row">
      <div class="col-8">
        <chart :options="modelOptions" :loading="loading"></chart>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Chart from 'components/Chart/index'
import api from 'api'

export default {
  name: 'ProductModel',

  mixins: [globalMixins],

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
      loading: false,
      productsDevices: []
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
      if (this.releasedProducts.length) {
        this.productsDevices = []
        this.releasedProducts.forEach((item) => {
          this.getProductSummary(item)
        })
      }
    },
    getProductSummary (product) {
      let i = 0
      api.statistics.getProductSummary(product.id).then((res) => {
        if (res.status === 200) {
          this.productsDevices.push({
            name: product.mode || this.$t('operation.overview.model_analysis.other') + i++,
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
