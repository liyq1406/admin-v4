<template>
  <div class="echart-line" :style="chartStyle"></div>
</template>

<script>
import _ from 'lodash'
import { loadScript } from 'src/utils'

export default {
  name: 'Line',

  props: {
    // 宽度
    width: {
      type: String,
      default: '100%'
    },

    // 高度
    height: {
      type: String,
      default: '320px'
    },

    // 数据集
    series: {
      type: Array,
      default () {
        return []
      }
    },

    // 横轴数据
    xAxisData: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      chart: null
    }
  },

  computed: {
    // 图表样式
    chartStyle () {
      return {
        width: this.width,
        height: this.height
      }
    },

    // 图例
    legends () {
      return this.series.length > 0 ? _.map(this.series, 'name') : []
    },

    // 图表配置
    option () {
      return {
        noDataLoadingOption: {
          text: this.$t('common.no_data'),
          effect: '',
          effectOption: {
            backgroundColor: '#FFF'
          },
          textStyle: {
            fontSize: 14,
            color: '#999'
          }
        },
        calculable: true,
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 90,
          y: 32,
          x2: 15
        },
        legend: {
          x: 'right',
          y: 10,
          data: this.legends
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData
        }],
        yAxis: [{
          type: 'value'
        }],
        series: this.series
      }
    }
  },

  ready () {
    if (typeof window.echarts === 'undefined') {
      let url = '/static/vendor/echarts/echarts.common.min.js'
      loadScript(url, this.init)
      // let script = document.createElement('script')
      // script.onload = () => {
      //   this.init()
      // }
      // script.src = '/static/vendor/echarts/echarts.common.min.js'
      // document.getElementsByTagName('body')[0].appendChild(script)
    } else {
      this.init()
    }
  },

  watch: {
    series () {
      this.chart && this.chart.setOption(this.option, true)
    }
  },

  methods: {
    init () {
      this.chart = window.echarts.init(this.$el)
      this.chart.setOption(this.option)
    }
  }
}
</script>
