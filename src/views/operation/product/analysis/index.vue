<template>
  <div class="main">
    <div class="main-title">
      <div class="col-4">
        <h2>{{ $t('operation.product.analysis.title') }}</h2>
      </div>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-multiple-picker :periods="periods" @timechange="onTimeChange"></date-time-multiple-picker>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-group-item">
          <radio-button-group :items="dimensions" :value.sync="dimension" color="red"></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel mt20">
      <div class="panel-bd" v-if="dimension==='duration'">
        <chart :options="durationOptions" :loading="loadingData" height="300px"></chart>
      </div>
      <div class="panel-bd" v-if="dimension==='times'">
        <chart :options="timesOptions" :loading="loadingData" height="300px"></chart>
      </div>
      <div class="panel-bd" v-if="dimension==='period'">
        <chart :options="periodOptions" :loading="loadingData" height="300px"></chart>
      </div>
    </div>
    <distributing></distributing>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from '../mixins'
import Chart from 'components/Chart/index'
import formatDate from 'filters/format-date'
import Distributing from './components/Distributing'

export default {
  name: 'Portrait',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, setCurrProductMixin],

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  components: {
    Distributing,
    Chart
  },

  data () {
    return {
      loadingData: false,
      durationData: [],
      timesData: [],
      periodData: [],
      periods: [7, 30, 90],
      dimension: 'duration',
      dimensions: [{
        label: this.$t('operation.product.analysis.duration_per'),
        value: 'duration'
      }, {
        label: this.$t('operation.product.analysis.using_count'),
        value: 'times'
      }, {
        label: this.$t('operation.product.analysis.time_distribution'),
        value: 'period'
      }],
      startTime: null,
      endTime: null
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
    },

    // 使用次数图表配置
    timesOptions () {
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
          data: _.map(this.timesData, 'name')
        },
        yAxis: {
          minInterval: 1
        },
        series: [{
          name: this.$t('operation.product.analysis.count'),
          type: 'bar',
          barMaxWidth: 30,
          data: _.map(this.timesData, 'value')
        }]
      }
    },

    // 单次图表配置
    periodOptions () {
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
          data: _.map(this.periodData, 'name')
        },
        yAxis: {
          minInterval: 1
        },
        series: [{
          name: this.$t('operation.product.analysis.count'),
          type: 'bar',
          barMaxWidth: 30,
          data: _.map(this.periodData, 'value')
        }]
      }
    }
  },

  watch: {
    dimension () {
      this.getActionData()
    },

    currentProduct () {
      if (this.currentProduct.id) {
        this.getActionData()
      }
    }
  },

  methods: {
    /**
     * 处理时间选择
     * @author shengzhi
     */
    onTimeChange (start, end) {
      this.startTime = start
      this.endTime = end
      this.getActionData()
    },

    /**
     * 获取产品分析数据
     */
    getActionData () {
      if (this.startTime === null || this.endTime === null) return

      const API_FUNCTIONS = {
        duration: 'getActionDuration',
        times: 'getActionTimes',
        period: 'getActionPeriod'
      }
      let fn = api.statistics[API_FUNCTIONS[this.dimension]]
      let start = formatDate(this.startTime, 'yyyy-MM-dd', true)
      let end = formatDate(this.endTime, 'yyyy-MM-dd', true)
      this.loadingData = true
      fn(this.$route.params.id, start, end).then((res) => {
        if (res.status === 200) {
          let arr = []
          for (let key in res.data) {
            arr.push({
              name: key,
              value: res.data[key]
            })
          }
          this[`${this.dimension}Data`] = _.sortBy(arr, (item) => {
            return parseInt(item.name.split('-')[0])
          })
        }
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    }
  }
}
</script>
