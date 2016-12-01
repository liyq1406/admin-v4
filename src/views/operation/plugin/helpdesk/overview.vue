<template>
  <div class="main">
    <div class="main-title">
      <h2>用户反馈 </h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select :label="product.label" width="110px" size="small">
            <span slot="label">产品</span>
            <select v-model="product" @change="productSelect">
              <option v-for="selectProduct in selectOptions" :value="selectProduct">{{ selectProduct.label }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item fr">
          <date-time-multiple-picker @timechange="timeFilter" :periods="periods" :default-period="defaultPeriod"></date-time-multiple-picker>
        </div>
      </div>
    </div>
    <div class="panel mt20">
      <div class="panel-hd panel-hd-full bordered">
        <h2>趋势</h2>
      </div>
      <div class="panel-bd">
        <chart :options="trendOptions" :loading="loadingData"></chart>
      </div>
    </div>
    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :total="summary.all.total" :title="summary.all.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.untreatedTotal.total" :title="summary.untreatedTotal.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.weekAdded.total" :title="summary.weekAdded.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.monthAdded.total" :title="summary.monthAdded.title" align="left"></statistic>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd panel-hd-full bordered">
        <h2>分布</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-9">
            <chart :options="distributeOptions" height="320px"></chart>
          </div>
          <div class="col-14 col-offset-1 data-table-wrap" style="min-height: 350px">
            <div class="data-table" v-if="feedbacks.length > 0">
              <table class="table">
                <thead>
                  <tr>
                    <th>标题</th>
                    <th>未处理</th>
                    <th>已处理</th>
                    <th>全部</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in feedbacks">
                    <td>{{item.label}}</td>
                    <td>{{item.untreatedCount}} ({{item.untreatedPercent || ''}} %)</td>
                    <td>{{item.treatedCount}} ({{item.treatedPercent || ''}} %)</td>
                    <td>{{item.Count}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import locales from 'consts/locales/index'
import api from 'api'
import Chart from 'components/chart/index'
import formatDate from 'filters/format-date'
import { pluginMixins } from '../mixins'
import { getLastYearDate, patchLostDates } from 'utils'

export default {
  name: 'Overview',

  mixins: [pluginMixins],

  components: {
    Chart
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      product: {
        label: '全部'
      },
      defaultPeriod: 30,
      feedbacks: [],
      summary: {
        all: {
          total: 0,
          title: '反馈数'
        },
        untreatedTotal: {
          total: 0,
          title: '待处理'
        },
        weekAdded: {
          total: 0,
          title: '7天新增'
        },
        monthAdded: {
          total: 0,
          title: '30天新增'
        }
      },
      // 时间间隔
      periods: [7, 30, 90],
      // 数据是否加载中
      loadingData: false,
      trend: {
        series: [],
        xAxis: []
      },
      distData: [],
      // trendData: [],
      startTime: null,
      endTime: null
    }
  },

  computed: {
    // 推送历史图表配置
    trendOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 20,
          x2: 15,
          y2: 30
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.trend.xAxis
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: this.trend.series
        // series: [{
        //   name: '数量',
        //   type: 'line',
        //   data: this.trendSeries
        // }]
      }
    },

    // 分布图表配置
    distributeOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          y: 10,
          data: _.map(this.distData, 'name')
        },
        series: [{
          name: '数量',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.distData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },

    selectOptions () {
      if (this.products.length > 0) {
        var res = [{
          id: '',
          label: '全部'
        }]
        this.products.forEach((item) => {
          let temp = {
            id: item.id,
            label: item.name
          }
          res.push(temp)
        })
        return res
      } else {
        return []
      }
    },
    groupQueryCondition () {
      var params = null
      if (this.product && this.product.id) {
        if (!params) {
          params = {}
          params.query = {}
        }
        params.query.product_id = this.product.id
      }

      if (this.startTime && this.endTime) {
        if (!params) {
          params = {}
          params.query = {}
        }
        params.query.create_time = {$gte: {'@date': this.startTime}, $lte: {'@date': this.endTime}}
      }

      return params
    }
  },

  ready () {
    // REVIEW 路由切换到用户反馈概览，页面就退出到登录页 插件接口显示token失效 #guohao
  },

  watch: {
    products () {
      if (this.products.length > 0) {
        this.getFeedbackList()
      }
    }
  },

  methods: {
    getFeedbackList () {
      this.loadingData = true
      api.helpdesk.getFeedbackGroup(this.$route.params.app_id, this.groupQueryCondition).then((res) => {
        if (res.status !== 200) return
        this.summary.all.total = res.data.total
        this.summary.untreatedTotal.total = res.data.untreatedTotal
        this.summary.weekAdded.total = res.data.sevenCount
        this.summary.monthAdded.total = res.data.thirtyCount
        this.feedbacks = res.data.labelGroupCount
        if (res.data.labelGroupCount.length > 0) {
          let dataRes = []
          res.data.labelGroupCount.forEach((item) => {
            let temp = {}
            temp.name = item.label || ''
            temp.value = item.Count
            dataRes.push(temp)
          })
          this.distData = dataRes
        } else {
          this.distData = []
        }

        // 趋势数据
        let data = _.map(res.data.dayGroupCount, (item) => {
          return {
            day: item.day,
            value: item.Count,
            name: !item.label || item.label === '' ? '用户反馈' : item.label
          }
        })
        let series = []
        let flag = false
        data = _.groupBy(data, 'name')
        for (var key in data) {
          let obj = {
            name: key,
            type: 'line'
          }
          // 缺失日期数据补0
          let patched = patchLostDates(data[key], this.startTime, this.endTime, ['value'])
          if (!flag) {
            this.trend.xAxis = _.map(patched, (item) => {
              return formatDate(item.day, 'MM-dd', true)
            })
            flag = true
          }
          obj['data'] = _.map(patched, 'value')
          series.push(obj)
        }
        this.trend.series = series
        // let dataRes = []
        // res.data.dayGroupCount.forEach((item) => {
        //   let temp = {}
        //   temp.val = item.Count
        //   temp.date = item.day
        //   temp.name = !item.label || item.label === '' ? '用户反馈' : item.label
        //   dataRes.push(temp)
        // })
        // this.trendData = dataRes
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    timeFilter (start, end) {
      var cur = new Date()
      if (end.getTime() >= cur.getTime()) {
        end = cur
      }

      if (start.getTime() > end.getTime()) {
        return
      }

      let lastYear = getLastYearDate(end)

      if (start.getTime() < lastYear.getTime()) {
        start = lastYear
      }

      this.startTime = start
      this.endTime = end
      this.getFeedbackList()
    },
    productSelect (item) {
      this.getFeedbackList()
    }
  }
}
</script>
