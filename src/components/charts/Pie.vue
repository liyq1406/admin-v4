<template>
  <div class="pie-chart" :style="chartStyle"></div>
</template>

<script>
  import echarts from 'echarts/echarts'
  import 'echarts/chart/pie'
  import _ from 'lodash'

  export default {
    name: 'PieChart',

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
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },

    data () {
      return {
        // 图表样式
        chartStyle: {
          width: this.width,
          height: this.height
        },

        // Echart图表对象，暴露给父对象
        chart: {}
      }
    },

    computed: {
      // 图例
      legends () {
        return this.series.length > 0 ? _.map(this.series, 'name') : []
      },

      // 图表配置
      options () {
        return {
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['种类1', '种类2', '种类3', '种类4', '种类5']
          },
          calculable: true,
          series: this.series
        }
      }
    },

    watch: {
      series () {
        if (Object.keys(this.chart).length) {
          this.chart.setOption(this.options, true)
        }
      }
    },

    ready () {
      this.chart = echarts.init(this.$el)
      this.chart.setOption(this.options, true)
    }
  }
</script>
