<template>
  <div class="panel mt20 mb20">
    <div class="panel-hd panel-hd-full bordered">
      <h2>自定义分析</h2>
    </div>
    <div class="row">
      <div class="col-8">
        <chart :options="modelOptions1"></chart>
      </div>
      <div class="col-8">
        <chart :options="modelOptions2"></chart>
      </div>
      <div class="col-8">
        <chart :options="modelOptions3"></chart>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'components/Chart/index'

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
      chartData1: [],
      chartData2: [],
      chartData3: [],
      inited: false,
      noNameCount: 0
    }
  },

  computed: {
    modelOptions1 () {
      return {
        title: {
          text: '各型号出货量占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: _.map(this.chartData1, 'name'),
          left: 'left',
          orient: 'vertical'
        },
        series: [{
          name: this.$t('common.count'),
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.chartData1,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },
    modelOptions2 () {
      return {
        title: {
          text: 'PV功率占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: _.map(this.chartData2, 'name'),
          left: 'left',
          orient: 'vertical'
        },
        series: [{
          name: this.$t('common.count'),
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.chartData2,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },
    modelOptions3 () {
      return {
        title: {
          text: '设备年均发电量分布',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: _.map(this.chartData3, 'name'),
          left: 'left',
          orient: 'vertical'
        },
        series: [{
          name: this.$t('common.count'),
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.chartData3,
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
      // 假数据
      this.chartData1 = [{
        name: '7.7kwh',
        value: 15000
      }, {
        name: '15.4kWh',
        value: 4000
      }]
      this.chartData2 = [{
        name: '<4kw',
        value: 4000
      }, {
        name: '4~6kw',
        value: 7000
      }, {
        name: '>6kw',
        value: 5000
      }]
      this.chartData3 = [{
        name: '<200kwh',
        value: 1990
      }, {
        name: '200~500kwh',
        value: 5880
      }, {
        name: '>500kwh',
        value: 10000
      }]
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
