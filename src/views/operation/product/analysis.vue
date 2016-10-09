<template>
  <div class="main">
    <div class="main-title">
      <div class="col-4">
        <h2>产品分析</h2>
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
        <interval :data="durationData" :options="chartOptions"></interval>
      </div>
      <div class="panel-bd" v-if="dimension==='times'">
        <interval :data="timesData" :options="chartOptions"></interval>
      </div>
      <div class="panel-bd" v-if="dimension==='period'">
        <interval :data="periodData" :options="chartOptions"></interval>
      </div>
    </div>
    <distributing></distributing>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from './mixins'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import ChinaHeatMap from 'components/g2-charts/ChinaHeatMap'
import Interval from 'components/g2-charts/Interval'
import { uniformDate } from 'filters/format-date'
import Distributing from './distributing'
import _ from 'lodash'

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
    DateTimeMultiplePicker,
    RadioButtonGroup,
    Interval,
    ChinaHeatMap,
    Distributing
  },

  data () {
    return {
      chartOptions: {
        legend: false,
        stack: true,
        props: {
          height: 300,
          plotCfg: {
            margin: [10, 20, 30, 50]
          }
        },
        defs: {
          'type': {
            type: 'cat',
            alias: '时间'
          },
          'val': {
            alias: '数量',
            min: 0
          }
        },
        position: 'type*val',
        color: 'type'
      },
      durationData: [],
      timesData: [],
      periodData: [],
      periods: [7, 30, 90],
      dimension: 'duration',
      dimensions: [{
        label: '单次时长',
        value: 'duration'
      }, {
        label: '使用次数',
        value: 'times'
      }, {
        label: '时段分布',
        value: 'period'
      }],
      startTime: null,
      endTime: null
    }
  },

  watch: {
    dimension () {
      this.getActionData()
    },

    currentProduct () {
      if (this.currentProduct.id) {
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
      let start = uniformDate(this.startTime)
      let end = uniformDate(this.endTime)
      fn(this.$route.params.id, start, end).then((res) => {
        if (res.status === 200) {
          let arr = []
          for (let key in res.data) {
            arr.push({
              type: key,
              val: res.data[key]
            })
          }
          this[`${this.dimension}Data`] = _.sortBy(arr, (item) => {
            return parseInt(item.type.split('-')[0])
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
