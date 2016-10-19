<template>
  <div class="row sex-box">
    <chart :options="sexOptions" :loading="loadingData"></chart>
  </div>
</template>

<script>
import PercentTable from 'components/PercentTable'
import Chart from 'components/Chart/index'
import api from 'api'

export default {
  name: 'Sex',

  components: {
    PercentTable,
    Chart
  },

  data () {
    return {
      loadingData: false,
      data: {
        '男性': 0,
        '女性': 0
      }
    }
  },

  computed: {
    // 性别图表配置
    sexOptions () {
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
          data: ['性别']
        },
        series: [{
          name: '男性',
          type: 'bar',
          stack: '性别',
          barMaxWidth: 40, // 柱条的最大宽度
          data: this.data['男性']
        }, {
          name: '女性',
          type: 'bar',
          stack: '性别',
          barMaxWidth: 40, // 柱条的最大宽度
          data: this.data['女性']
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
      api.statistics.getUserSex().then((res) => {
        this.data['男性'] = [res.data.male_total]
        this.data['女性'] = [res.data.female_total]
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    }
  }
}
</script>
