<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="chartwrap">
        <div id="trendChart" style="height:480px"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from '../../../../mixins'
  import echarts from 'echarts/echarts'
  require('echarts/chart/line')

  export default {
    name: 'BasicInfo',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
        dates: [
          '3-01',
          '3-02',
          '3-03',
          '3-04',
          '3-05',
          '3-06',
          '3-07'
        ],
        environmentTems: [
          '19',
          '25',
          '15',
          '35',
          '22',
          '16',
          '10'
        ],
        waterboxTems: [
          '48',
          '42',
          '49',
          '53',
          '54',
          '46',
          '48'
        ]
      }
    },
    ready () {
      this.drawProductTrends()
    },

    methods: {
      drawProductTrends () {
          // 趋势图表
        var trendOptions = {
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
          // 鼠标移动显示提示
          tooltip: {
            trigger: 'axis'
          },
          // 图表边距
          grid: {
            x: 50,
            y: 32,
            x2: 15
          },
          // 图表上方显示线条对应数据
          legend: {
            x: 'right',
            y: 10,
            data: ['水箱温度', '环境温度']
          },
          // X轴
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: this.dates
          }],
          // Y轴
          yAxis: [{
            type: 'value'
          }],
          // 每条数据详情
          series: [{
            name: '水箱温度',
            type: 'line',
            data: this.waterboxTems
          }, {
            name: '环境温度',
            type: 'line',
            data: this.environmentTems
          }]
        }
        var trendChart = echarts.init(document.getElementById('trendChart'))
        trendChart.setOption(trendOptions)
        window.onresize = trendChart.resize
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
  .chartwrap
    padding 20px 0
</style>
