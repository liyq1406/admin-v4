<template>
  <div class="row sex-box">
    <chart :options="sexOptions" :loading="loadingData"></chart>
  </div>
</template>

<script>
import Chart from 'components/Chart/index'
import api from 'api'

export default {
  name: 'Sex',

  components: {
    Chart
  },

  data () {
    return {
      loadingData: false,
      data: {
        [this.$t('operation.user.portrait.sex.male')]: 0,
        [this.$t('operation.user.portrait.sex.female')]: 0
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
          data: [this.$t('operation.user.portrait.sex.title')]
        },
        series: [{
          name: this.$t('operation.user.portrait.sex.male'),
          type: 'bar',
          stack: this.$t('operation.user.portrait.sex.title'),
          barMaxWidth: 40, // 柱条的最大宽度
          data: this.data[this.$t('operation.user.portrait.sex.male')]
        }, {
          name: this.$t('operation.user.portrait.sex.female'),
          type: 'bar',
          stack: this.$t('operation.user.portrait.sex.title'),
          barMaxWidth: 40, // 柱条的最大宽度
          data: this.data[this.$t('operation.user.portrait.sex.female')]
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
        this.data[this.$t('operation.user.portrait.sex.male')] = [res.data.male_total]
        this.data[this.$t('operation.user.portrait.sex.female')] = [res.data.female_total]
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    }
  }
}
</script>
