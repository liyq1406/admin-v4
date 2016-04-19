<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <button @click="getSnapshot" class="btn btn-success fr"><i class="fa fa-plus "></i>刷新数据</button>
      </div>
      <div class="chartwrap">
        <div id="trendChart" style="height:480px"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from '../../../../mixins'
  // import api from '../../../../api'
  import echarts from 'echarts/echarts'
  import 'echarts/chart/line'

  export default {
    name: 'BasicInfo',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
        dates: [],
        environmentTems: [],
        waterboxTems: [],
        fake: [{
          lastUpdate: 1,
          '34': 2,
          '43': 4
        }, {
          lastUpdate: 2,
          '34': 2,
          '43': 4
        }, {
          lastUpdate: 3,
          '34': 2,
          '43': 4
        }, {
          lastUpdate: 4,
          '34': 2,
          '43': 4
        }, {
          lastUpdate: 5,
          '34': 2,
          '43': 4
        }, {
          lastUpdate: 40,
          '34': 2,
          '43': 4
        }]
      }
    },
    ready () {
      // console.log(1111)
      // console.log(this.$route.params.product_id)
      // console.log(this.$route.params.device_id)
      this.init()
      this.getSnapshot()
      this.drawProductTrends()
    },

    methods: {
      init () {
        var now = Date.parse(new Date())
        for (let i = 71; i >= 0; i--) {
          this.waterboxTems.push(0)
          this.environmentTems.push(0)
          var date = new Date(now - i * 3600 * 1000)
          var hour = date.getHours()
          this.dates.push(`${hour > 9 ? hour : `0${hour}`}:00`)
        }
      },
      // 获取快照数据
      getSnapshot (offset, limit, begintime, endtime) {
        offset = offset || 0
        limit = limit || 1000
        endtime = Date.parse(new Date())
        begintime = endtime - 72 * 60 * 60 * 1000
        console.log(this.begintime)
        var params = {
          offset: offset,
          limit: limit,
          date: {
            begin: begintime,
            end: endtime
          }
        }
        console.log(params)
        this._handleData(this.fake)
        // api.snapshot.getSnapshot(this.$route.params.product_id, this.$route.params.device_id, params).then((res) => {
        //   // 处理数据
        //   this._handleData(res.data.snapshot)
        // }).catch((res) => {
        //   this.handleError(res)
        // })
      },

      _handleData (data) {
        // var now = Date.parse(new Date()) / 1000
        // const SECONDS_PER_HOUR = 3600
        var now = 40
        const SECONDS_PER_HOUR = 2
        var itemToAdd = {}
        var i = 0
        data.forEach((item, index) => {
          var a = Math.floor((now - item.lastUpdate) / SECONDS_PER_HOUR)
          if (index) {
            if (a !== i) {
              this.environmentTems[71 - a] = itemToAdd['43']
              this.waterboxTems[71 - a] = itemToAdd['34']
              itemToAdd = item
              i = a
            }
          } else {
            itemToAdd = item
            i = 0
          }
        })
      },

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
