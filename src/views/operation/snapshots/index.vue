<template>
  <div class="main">
    <div class="main-title">
      <h2>快照分析</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select width="130px" :label="selectedRule.label" size="small">
            <span slot="label">规则：</span>
            <select v-model="selectedRule" @change="">
              <option v-for="rule in ruleOptions" :value="rule">{{ rule.label }}</option>
            </select>
          </x-select>
        </div>
        <div class="filter-group-item mutiple-select ml20">
          <input v-model="statisticsType.avg" type="checkbox" value="avg" @click="toggleSelectedType('avg')">
          <label>平均</label>
          <input v-model="statisticsType.sum" type="checkbox" value="sum" @click="toggleSelectedType('sum')">
          <label>求和</label>
          <input v-model="statisticsType.max" type="checkbox" value="max" @click="toggleSelectedType('max')">
          <label>最大</label>
          <input v-model="statisticsType.min" type="checkbox" value="min" @click="toggleSelectedType('min')">
          <label>最小</label>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="dimensions" :value.sync="dimension"></radio-button-group>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-group-item fr">
          <date-time-range-picker @timechange="timechange"></date-time-range-picker>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="row min-height">
          <div class="col-24">
            <chart :options="chartOptions" :loading="loading"></chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'
  import Select from 'components/select'
  import RadioButtonGroup from 'components/RadioButtonGroup'
  import DateTimeRangePicker from 'components/DateTimeRangePicker'
  import Chart from 'components/Chart/index'

  export default {
    name: 'Products',

    mixins: [globalMixins],

    vuex: {
      getters: {
        releasedProduct: ({ products }) => products.released
      }
    },

    components: {
      'x-select': Select,
      RadioButtonGroup,
      DateTimeRangePicker,
      Chart
    },

    data () {
      return {
        loading: false,
        selectedRule: {
          id: 0,
          label: '请选择统计规则'
        },
        statisticsRules: [],
        dimension: 'hour',
        xAxis: [],
        series: []
      }
    },

    computed: {
      ruleOptions () {
        let res = []
        res.push({
          id: 0,
          label: '请选择统计规则'
        })
        if (this.statisticsRules && this.statisticsRules.length) {
          this.statisticsRules.forEach((item) => {
            res.push({
              id: item.id,
              label: item.name
            })
          })
        }
        return res
      },
      statisticsType () {
        return {
          avg: true,
          sum: true,
          max: false,
          min: false
        }
      },
      dimensions () {
        return [{
          label: '小时',
          value: 'hour'
        }, {
          label: '天',
          value: 'day'
        }, {
          label: '周',
          value: 'week'
        }, {
          label: '月',
          value: 'month'
        }, {
          label: '年',
          value: 'year'
        }]
      },
      chartOptions () {
        return {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            x: 50,
            y: 5,
            x2: 15,
            y2: 20
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: this.xAxis
          }],
          yAxis: [{
            type: 'value',
            minInterval: 1
          }],
          series: this.series
        }
      }
    },

    route: {
      data () {}
    },

    methods: {
      toggleSelectedType (type) {
        console.log(type)
      },
      timechange (startDate, endDate) {
      }
    }
  }
</script>

<style lang="stylus">
.mutiple-select
  line-height 26px
  input, label
    vertical-align middle
  label
    margin-right 10px
</style>
