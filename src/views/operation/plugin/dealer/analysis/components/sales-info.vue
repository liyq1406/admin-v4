<template>
  <div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <div class="filter-group-item mr20">
          <date-time-multiple-picker :periods="periods" @timechange="onTimeChange" :default-period="defaultPeriod"></date-time-multiple-picker>
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
import api from 'api'
import formatDate from 'filters/format-date'
import { patchLostDates } from 'utils'

export default {
  name: 'Age',

  components: {
    Chart
  },
  data () {
    return {
      durationData: [],
      periods: [7, 30, 90],
      defaultPeriod: 7,
      period: 7
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
          data: _.map(this.durationData, 'day')
        },
        yAxis: {
          minInterval: 1
        },
        series: [{
          name: this.$t('operation.product.analysis.count'),
          type: 'bar',
          barMaxWidth: 30,
          data: _.map(this.durationData, 'sale_total')
        }]
      }
    }
  },
  ready () {
  },

  methods: {
    onTimeChange (start, end) {
      this.period = parseInt((end - start) / 1000 / 60 / 60 / 24) + 1
      let startDay = formatDate(start, 'yyyy-MM-dd')
      let endDay = formatDate(end, 'yyyy-MM-dd')
      this.getDealerSaleTrend(startDay, endDay)
    },
    getDealerSaleTrend (startDay, endDay) {
      api.statistics.getDealerSaleTrend(startDay, endDay).then((res) => {
        if (res.status === 200) {
          this.durationData = patchLostDates(res.data, startDay, this.period, ['sale_total'])
        }
      })
    }
  }
}
</script>
