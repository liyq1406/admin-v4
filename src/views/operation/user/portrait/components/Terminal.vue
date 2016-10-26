<template>
  <div class="row sex-box">
    <chart :options="terminalOptions" :loading="loadingData"></chart>
  </div>
</template>
<script>
  import Chart from 'components/Chart/index'
  import api from 'api'

  export default {
    name: 'terminal',

    components: {
      Chart
    },

    data () {
      return {
        loadingData: false,
        data: {
          ios: 0,
          android: 0,
          others: 0
        }
      }
    },

    computed: {
      // 终端图表配置
      terminalOptions () {
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            x: 50,
            y: 20,
            x2: 15,
            y2: 40
          },
          xAxis: {
            type: 'value',
            minInterval: 1,
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['系统']
          },
          series: [{
            name: 'iOS',
            type: 'bar',
            stack: '系统',
            barMaxWidth: 40, // 柱条的最大宽度
            data: this.data['ios']
          }, {
            name: 'Android',
            type: 'bar',
            stack: '系统',
            barMaxWidth: 40, // 柱条的最大宽度
            data: this.data['android']
          }, {
            name: '其他',
            type: 'bar',
            stack: '系统',
            barMaxWidth: 40, // 柱条的最大宽度
            data: this.data['others']
          }]
        }
      }
    },

    ready () {
      this.getData()
    },

    methods: {
      /**
       * 获取数据
       * @return {[type]} [description]
       */
      getData () {
        this.loadingData = true
        api.statistics.getUserOs().then((res) => {
          res.data.forEach((item) => {
            if (item.operate_system in this.data) {
              this.data[item.operate_system] = [item.total]
            }
          })
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      }
    }
  }
</script>
