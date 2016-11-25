<template>
  <div class="panel mt20">
    <div class="panel-hd panel-hd-full bordered">
      <h2>{{ title }}</h2>
    </div>
    <div class="row mt20">
      <div :class="[firstcol]">
        <chart :options="fisrtModelOptions" :loading="fisrtLoading"></chart>
      </div>
      <div v-if="secondConfig.id" :class="[secondcol]">
        <chart :options="secondModelOptions" :loading="secondLoading"></chart>
      </div>
      <div v-if="thirdConfig.id" :class="[thirdcol]">
        <chart :options="thirdModelOptions" :loading="thirdLoading"></chart>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'components/Chart/index'
import echartOptions from './echart-options'
import api from 'api'

export default {
  name: 'ProductModel',
  components: {
    Chart
  },

  props: {
    title: {
      type: String,
      default: '自定义图表'
    },
    /**
     * dataSource 格式如下
     * [{
     *   index: 1,
     *   id: ''
     * }..]
     */
    dataSource: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      fisrtLoading: false,
      secondLoading: false,
      thirdLoading: false,
      datapoints: [],
      inited: false,
      noNameCount: 0,
      dataSourceList: [],
      firstConfig: {},
      secondConfig: {},
      thirdConfig: {},
      firstData: {
        dp_index: -1,
        title: '',
        data: []
      },
      secondData: {
        dp_index: -1,
        title: '',
        data: []
      },
      thirdData: {
        dp_index: -1,
        title: '',
        data: []
      }
    }
  },

  computed: {
    compFirstData () {
      let res = {
        title: this.firstData.title,
        data: []
      }
      let dp = _.find(this.datapoints, (item) => {
        return item.index === this.firstData.dp_index
      })
      let symbol = dp && dp.symbol || ''
      this.firstData.data.forEach((item) => {
        let temp = {}
        temp.value = item.value
        if (item.name.min) {
          if (item.name.max) {
            temp.name = `${item.name.min}${symbol}-${item.name.max}${symbol}`
          } else {
            temp.name = `>${item.name.min}${symbol}`
          }
        } else {
          temp.name = `<${item.name.max}${symbol}`
        }
        res.data.push(temp)
      })
      return res
    },
    compSecondData () {
      let res = {
        title: this.secondData.title,
        data: []
      }
      let dp = _.find(this.datapoints, (item) => {
        return item.index === this.secondData.dp_index
      })
      let symbol = dp && dp.symbol || ''
      this.secondData.data.forEach((item) => {
        let temp = {}
        temp.value = item.value
        if (item.name.min) {
          if (item.name.max) {
            temp.name = `${item.name.min}${symbol}-${item.name.max}${symbol}`
          } else {
            temp.name = `>${item.name.min}${symbol}`
          }
        } else {
          temp.name = `<${item.name.max}${symbol}`
        }
        res.data.push(temp)
      })
      return res
    },
    compThirdData () {
      let res = {
        title: this.thirdData.title,
        data: []
      }
      let dp = _.find(this.datapoints, (item) => {
        return item.index === this.thirdData.dp_index
      })
      let symbol = dp && dp.symbol || ''
      this.thirdData.data.forEach((item) => {
        let temp = {}
        temp.value = item.value
        if (item.name.min) {
          if (item.name.max) {
            temp.name = `${item.name.min}${symbol}-${item.name.max}${symbol}`
          } else {
            temp.name = `>${item.name.min}${symbol}`
          }
        } else {
          temp.name = `<${item.name.max}${symbol}`
        }
        res.data.push(temp)
      })
      return res
    },
    firstcol () {
      if (this.firstConfig.chart === 1) {
        return 'col-8'
      }
      if (this.firstConfig.chart > 1 && !this.secondConfig.chart) {
        return 'col-24'
      }
      if (this.firstConfig.chart > 1 && this.secondConfig.chart > 1) {
        return 'col-12'
      }
      if (this.firstConfig.chart > 1 && this.secondConfig.chart === 1) {
        return 'col-16'
      }
      return 'col-8'
    },
    secondcol () {
      if (this.firstConfig.chart === 1 && this.secondConfig.chart === 1) {
        return 'col-8'
      }
      if (this.firstConfig.chart === 1 && this.secondConfig.chart > 1) {
        return 'col-16'
      }
      if (this.firstConfig.chart > 1 && this.secondConfig.chart === 1) {
        return 'col-8'
      }
      if (this.firstConfig.chart > 1 && this.secondConfig.chart > 1) {
        return 'col-12'
      }
      return 'col-8'
    },
    thirdcol () {
      if (this.firstConfig.chart === 1 && this.secondConfig.chart === 1) {
        return 'col-8'
      }
      return ''
    },
    fisrtModelOptions () {
      let res = _.cloneDeep(echartOptions.pie)
      if (this.firstConfig.chart === 1) {
        res.legend.data = _.map(this.compFirstData.data, 'name')
        res.series[0].data = this.compFirstData.data
        res.title.text = this.compFirstData.title
      }
      return res
    },
    secondModelOptions () {
      let res = _.cloneDeep(echartOptions.pie)
      if (this.secondConfig.chart === 1) {
        res.legend.data = _.map(this.compSecondData.data, 'name')
        res.series[0].data = this.compSecondData.data
        res.title.text = this.compSecondData.title
      }
      return res
    },
    thirdModelOptions () {
      let res = _.cloneDeep(echartOptions.pie)
      if (this.thirdConfig.chart === 1) {
        res.legend.data = _.map(this.compThirdData.data, 'name')
        res.series[0].data = this.compThirdData.data
        res.title.text = this.compThirdData.title
      }
      return res
    }
  },

  watch: {
    dataSource () {
      this.searchDataSourceConfig()
    }
  },

  ready () {
    this.searchDataSourceConfig()
    this.getDataSourceList()
    this.getDatapoints()
  },

  methods: {
    searchDataSourceConfig () {
      if (!this.dataSource || !this.dataSource.length || !this.dataSourceList.length) {
        return
      }
      let length = this.dataSource.length
      for (let i = 0; i < length; i++) {
        let finded = _.find(this.dataSourceList, (ds) => {
          return ds.id === this.dataSource[i].id
        })
        if (finded) {
          if (this.dataSource[i].index === 1) {
            this.firstConfig = finded
          }
          if (this.dataSource[i].index === 2) {
            this.secondConfig = finded
          }
          if (this.dataSource[i].index === 3) {
            this.thirdConfig = finded
          }
          this.getStatictisValue(finded, this.dataSource[i].index)
        }
      }
    },
    getDataSourceList () {
      api.custom.dataSource.get().then((res) => {
        if (res) {
          this.dataSourceList = res
          this.searchDataSourceConfig()
        } else {
          this.dataSourceList = []
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    getStatictisValue (config, index) {
      if (config.chart === 1) { // 饼图
        if (config.data_from === 1) { // 数据统计
          this.deviceStatisticAnalytics(config, index)
        } else if (config.data_from === 2) { // 数据端点
          this.deviceDatapointAnalytics(config, index)
        }
      }
    },
    deviceDatapointAnalytics (config, index) {
      let params = {
        datapoint: config.dp_index,
        data_range: {}
      }

      if (config.pie_classify && config.pie_classify.length) {
        for (let i = 0; i < config.pie_classify.length; i++) {
          params.data_range[i] = {
            compare_operators: {}
          }
          if (config.pie_classify[i].min) {
            params.data_range[i].compare_operators['$gte'] = config.pie_classify[i].min
          }
          if (config.pie_classify[i].max) {
            params.data_range[i].compare_operators['$lte'] = config.pie_classify[i].max
          }
        }
      }
      if (index === 1) {
        this.fisrtLoading === true
      } else if (index === 2) {
        this.secondLoading === true
      } else {
        this.thirdLoading === true
      }
      api.statistics.deviceDatapointAnalytics(config.product_id, params).then((res) => {
        if (res.status === 200) {
          this.dealResult(res.data, config, index)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    dealResult (res, config, index) {
      let data = []
      for (let i in config.pie_classify) {
        let temp = {
          name: {
            min: config.pie_classify[i].min,
            max: config.pie_classify[i].max
          },
          value: res[i] || 0
        }
        data.push(temp)
      }
      if (index === 1) {
        this.fisrtLoading === false
        this.firstData.data = data
        this.firstData.dp_index = config.dp_index
        this.firstData.title = config.title
      } else if (index === 2) {
        this.secondLoading === false
        this.secondData.data = data
        this.secondData.dp_index = config.dp_index
        this.secondData.title = config.title
      } else {
        this.thirdLoading === false
        this.thirdData.title = config.title
        this.thirdData.dp_index = config.dp_index
        this.thirdData.data = data
      }
    },
    deviceStatisticAnalytics (config, index) {
      let time = {}
      if (config.period === 5 && config.custom_time) { // 自定义
        time.start = config.custom_time.start || 0
        time.end = config.custom_time.end || 0
      } else {
        let res = this.getPeriodTime(config.period)
        time.start = res.start || 0
        time.end = res.end || 0
      }
      time.start = time.start + 8 * 3600 * 1000
      time.end = time.end + 8 * 3600 * 1000
      let params = {
        datapoint: config.dp_index,
        mode: config.rule_type,
        fineness: config.fineness,
        date_start: new Date(time.start),
        date_end: new Date(time.end),
        data_range: {}
      }
      if (config.pie_classify && config.pie_classify.length) {
        for (let i = 0; i < config.pie_classify.length; i++) {
          params.data_range[i] = {
            compare_operators: {}
          }
          if (config.pie_classify[i].min) {
            params.data_range[i].compare_operators['$gte'] = config.pie_classify[i].min
          }
          if (config.pie_classify[i].max) {
            params.data_range[i].compare_operators['$lte'] = config.pie_classify[i].max
          }
        }
      }
      api.statistics.deviceStatisticAnalytics(config.snapshot_id, config.rule_id, params).then((res) => {
        if (res.status === 200) {
          this.dealResult(res.data, config, index)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    getPeriodTime (period) {
      let res = {
        start: 0,
        end: 0
      }
      let curTime = +new Date()
      res.end = curTime
      switch (period) {
        case 1: // 24小时
          res.start = curTime - 3600 * 1000 * 24
          break
        case 2: // 7天
          res.start = curTime - 3600 * 1000 * 24 * 6
          break
        case 3: // 30天
          res.start = curTime - 3600 * 1000 * 24 * 29
          break
        case 4: // 至今
          res.start = +new Date(0)
          break
        default:
          break
      }
      return res
    },
    /**
     * 获取数据端点
     * @author shengzhi
     */
    getDatapoints () {
      // 获取产品数据端点列表
      api.product.getDatapoints(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
