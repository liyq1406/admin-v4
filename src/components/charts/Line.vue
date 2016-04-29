<template>
  <div class="line-chart" :style="chartStyle"></div>
</template>

<script>
  import echarts from 'echarts/echarts'
  import 'echarts/chart/line'
  import _ from 'lodash'

  export default {
    name: 'LineChart',

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
            x: 50,
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
