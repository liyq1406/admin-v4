<template>
  <div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <div class="filter-group-item mr20">
          <radio-button-group :items="dimensions" :value.sync="dimension"></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel mt20">
      <div class="panel-bd">
        <chart :options="durationOptions" :loading="loadingData" height="300px"></chart>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from 'components/Chart/index'
// import api from 'api'

export default {
  name: 'Age',

  components: {
    Chart
  },
  data () {
    return {
      dimensions: [{
        label: this.$t('common.unit.time.day'),
        value: 'day'
      }, {
        label: this.$t('common.unit.time.month'),
        value: 'month'
      }, {
        label: this.$t('common.unit.time.year'),
        value: 'year'
      }],
      durationData: [],
      dimension: 'day'
    }
  },

  computed: {
    // 单次图表配置
    durationOptions () {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          x: 80,
          y: 20,
          x2: 15,
          y2: 20
        },
        xAxis: {
          data: _.map(this.durationData, 'name')
        },
        yAxis: {
          minInterval: 1
        },
        series: [{
          name: this.$t('operation.product.analysis.count'),
          type: 'bar',
          barMaxWidth: 30,
          data: _.map(this.durationData, 'value')
        }]
      }
    }
  },
  ready () {
  },

  methods: {}
}
</script>
