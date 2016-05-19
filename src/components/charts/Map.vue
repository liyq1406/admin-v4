<template>
  <div class="map-chart" :style="chartStyle"></div>
</template>

<script>
  import echarts from 'echarts/echarts'
  import 'echarts/chart/line'
  import 'echarts/chart/map'
  import ecConfig from 'echarts/config'
  import worldNames from '../../consts/mapping/world-names'
  import chinaNames from '../../consts/mapping/china-names'

  export default {
    name: 'MapChart',

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

      // 地图类型
      type: {
        type: String,
        default: 'world'
      },

      // 数据集
      seriesData: {
        type: Array,
        default () {
          return []
        }
      },

      tooltipLabel: {
        type: String,
        default: ''
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
      // 数据当中的最大值
      max () {
        var result = this.seriesData.reduce((prev, next) => {
          return next.value > prev.value ? next : prev
        }, { value: 100 }).value
        result = Math.ceil(result / 100) * 100
        return result
      },

      options () {
        var self = this
        var result = {
          tooltip: {
            trigger: 'item',
            formatter (params) {
              var value = (params.value + '').split('.')
              if (value[0] === '-') {
                value = 0
              }
              return self.tooltipLabel + '<br/>' + params.name + ': ' + value
            }
          },
          // legend: {
          //   orient: 'vertical',
          //   x: 'right',
          //   data: [this.$t('ui.statistic.products.active')]
          // },
          dataRange: {
            min: 0,
            max: this.max,
            color: ['orange', 'yellow', 'lightskyblue'],
            text: [this.$t('common.high'), this.$t('common.low')],           // 文本，默认为数值文本
            realtime: false,
            calculable: true
          },
          series: []
        }

        if (this.type === 'world') {
          result.series.push({
            type: 'map',
            mapType: this.type,
            roam: 'move',
            mapLocation: {
              y: 10
            },
            nameMap: worldNames,
            data: this.seriesData
          })
        } else {
          result.series.push({
            // name: this.$t('ui.statistic.products.active'),
            type: 'map',
            mapType: this.type,
            selectedMode: 'single',
            itemStyle: {
              normal: { label: { show: true } },
              emphasis: { label: { show: true } }
            },
            nameMap: chinaNames,
            data: this.seriesData
          })
        }

        return result
      }
    },

    watch: {
      options () {
        if (Object.keys(this.chart).length) {
          this.chart.setOption(this.options, true)
        }
      }
    },

    ready () {
      var mt
      this.chart = echarts.init(this.$el)
      this.chart.setOption(this.options, true)

      this.chart.on(ecConfig.EVENT.MAP_SELECTED, (param) => {
        if (this.type === 'china') {
          // 全国选择时指定到选中的省份
          var selected = param.selected
          for (var i in selected) {
            if (selected[i]) {
              // 需要处理直辖市带'市'字出错
              mt = i.replace('市', '')
              break
            }
          }
          this.type = mt
        } else {
          this.type = 'china'
        }
      })
    }
  }
</script>
