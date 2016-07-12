<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <button @click="getSnapshot" class="btn btn-success fr"><i class="fa fa-plus "></i>刷新数据</button>
      </div>
      <div class="chartwrap with-loading">
        <line-chart :series="trendSeries" :x-axis-data="xAxisData" height="480px"  v-ref:trend-chart></line-chart>
        <div class="icon-loading" v-show="loadingProductTrends">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import api from 'api'
  import LineChart from 'components/charts/Line'

  export default {
    name: 'BasicInfo',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'line-chart': LineChart
    },

    data () {
      return {
        // fake: [{
        //   snapshot_date: '2016-04-29T13:30:31.111Z',
        //   '34': 2,
        //   '43': 4
        // }, {
        //   snapshot_date: '2016-04-29T13:30:31.111Z',
        //   '34': 2,
        //   '43': 4
        // }, {
        //   snapshot_date: '2016-04-28T03:30:31.111Z',
        //   '34': 2,
        //   '43': 4
        // }, {
        //   snapshot_date: '2016-04-28T08:30:31.111Z',
        //   '34': 2,
        //   '43': 4
        // }, {
        //   snapshot_date: '2016-04-28T12:30:31.111Z',
        //   '34': 2,
        //   '43': 4
        // }, {
        //   snapshot_date: '2016-04-28T14:30:31.111Z',
        //   '34': 2,
        //   '43': 4
        // }],
        snapshots: []
      }
    },

    computed: {
      // 趋势图表横轴数据
      xAxisData () {
        var result = []
        var now = Date.parse(new Date())
        for (let i = 71; i >= 0; i--) {
          var date = new Date(now - i * 3600 * 1000)
          var hour = date.getHours() + 1
          result.push(`${hour > 9 ? hour : `0${hour}`}:00`)
        }
        return result
      },

      // 趋势图表数据
      trendSeries () {
        var result = [{
          name: '水箱温度',
          type: 'line',
          data: []
        }, {
          name: '环境温度',
          type: 'line',
          data: []
        }]
        var now = Date.parse(new Date()) / 1000
        // 当前未满一小时默认取满一小时
        now = (Math.floor(now / 3600) + 1) * 3600
        const SECONDS_PER_HOUR = 3600
        var itemToAdd = {}
        var i = 0

        for (let i = 71; i >= 0; i--) {
          result[0].data.push(0)
          result[1].data.push(0)
        }

        this.snapshots.forEach((item, index) => {
          // 去掉经过后台处理的时间的T和Z字符
          var snapshotDate = item.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '')
          // 获取经过的小时数的整数部分将同个小时内的数据分为同一组
          var a = Math.floor((now - Date.parse(new Date(snapshotDate)) / 1000) / SECONDS_PER_HOUR) + 1
          if (index) {
            if (a !== i) {
              // 当商改变说明此数据为下一个小时的数据
              // 将每个小时最后的数据附近图表数据数组
              result[0].data[71 - a] = Number(itemToAdd['34']) || 0
              result[1].data[71 - a] = Number(itemToAdd['43']) || 0
              itemToAdd = item
              // 将1重置为当前数据的时间
              i = a
            }
          } else {
            // 数组内第一个元素处理
            // 将第一个元素存进暂存对象内
            itemToAdd = item
            // 初始经过0个小时
            i = 0
          }
        })

        return result
      }
    },

    ready () {
      this.getSnapshot()
      // this.snapshots = this.fake

      // 监听窗口尺寸变化
      window.onresize = () => {
        this.$refs.trendChart.chart.resize()
      }
    },

    methods: {
      /**
       * 获取快照数据
       */
      getSnapshot (offset, limit, begintime, endtime) {
        offset = 0
        limit = limit || 1000
        endtime = Date.parse(new Date())
        // 取当前开始到3天前的时间
        begintime = endtime - 72 * 60 * 60 * 1000
        // console.log(this.begintime)
        var params = {
          offset: offset,
          limit: limit,
          date: {
            begin: begintime,
            end: endtime
          }
        }
        api.snapshot.getSnapshot(this.$route.params.product_id, this.$route.params.device_id, params).then((res) => {
          if (res.status === 200) {
            this.snapshots = res.data.list.sort((a, b) => {
              return new Date(a.snapshot_date) - new Date(b.snapshot_date)
            })
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      _handleData (data) {
        var now = Date.parse(new Date()) / 1000
        // 当前未满一小时默认取满一小时
        now = (Math.floor(now / 3600) + 1) * 3600
        const SECONDS_PER_HOUR = 3600
        var itemToAdd = {}
        var i = 0
        data.forEach((item, index) => {
          // 去掉经过后台处理的时间的T和Z字符
          var snapshotDate = item.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '')
          // 获取经过的小时数的整数部分将同个小时内的数据分为同一组
          var a = Math.floor((now - Date.parse(new Date(snapshotDate)) / 1000) / SECONDS_PER_HOUR) + 1
          if (index) {
            if (a !== i) {
              // 当商改变说明此数据为下一个小时的数据
              // 将每个小时最后的数据附近图表数据数组
              this.environmentTems[71 - a] = Number(itemToAdd['43']) || 0
              this.waterboxTems[71 - a] = Number(itemToAdd['34']) || 0
              itemToAdd = item
              // 将1重置为当前数据的时间
              i = a
            }
          } else {
            // 数组内第一个元素处理
            // 将第一个元素存进暂存对象内
            itemToAdd = item
            // 初始经过0个小时
            i = 0
          }
        })
      }
    }
  }
</script>
