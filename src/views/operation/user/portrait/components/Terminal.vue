<template>
  <div class="row sex-box">
    <chart :options="terminalOptions" :loading="loadingData"></chart>
  </div>
</template>
<script>
  import Chart from 'components/chart/index'
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
            data: [this.$t('operation.user.portrait.terminal.title')]
          },
          series: [{
            name: 'iOS',
            type: 'bar',
            stack: this.$t('operation.user.portrait.terminal.system'),
            barMaxWidth: 40, // 柱条的最大宽度
            data: this.data['ios']
          }, {
            name: 'Android',
            type: 'bar',
            stack: this.$t('operation.user.portrait.terminal.system'),
            barMaxWidth: 40, // 柱条的最大宽度
            data: this.data['android']
          }, {
            name: this.$t('operation.user.portrait.terminal.other'),
            type: 'bar',
            stack: this.$t('operation.user.portrait.terminal.system'),
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
