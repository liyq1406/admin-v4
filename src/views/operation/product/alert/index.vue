<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>告警信息</h2>
    </div>
    <div class="row statistic-group mb20">
      <div class="col-6">
        <statistic :info="alertSummary.unhandle" :title="alertSummary.unhandle.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.message" :title="alertSummary.message.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.sevenday" :title="alertSummary.sevenday.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.thirtyday" :title="alertSummary.thirtyday.title" align="left"></statistic>
      </div>
    </div>
    <alert-trends></alert-trends>
    <alert-table></alert-table>
  </div>
</template>

<script>
// import Vue from 'vue'
import api from 'api'
// import * as config from 'consts/config'
// import locales from 'consts/locales/index'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
import store from 'store'
import { getCurrProduct } from 'store/actions/products'
import Statistic from 'components/Statistic'
// import Mock from 'mockjs'
import { uniformDate } from 'src/filters'
import dateFormat from 'date-format'
import AlertTable from './alert-table'
import AlertTrends from './alert-trends'

export default {
  name: 'Alert',

  mixins: [globalMixins],

  store,

  vuex: {
    actions: {
      getCurrProduct
    }
  },

  components: {
    Statistic,
    AlertTable,
    AlertTrends
  },

  data () {
    return {
      // TODO
      alertChartData: [],
      records: [],
      deviceID: '',
      productID: '',
      trendData: [],
      serious: {
        name: '严重',
        data: []
      },
      normal: {
        name: '通知',
        data: []
      },
      light: {
        name: '轻微',
        data: []
      },
      // alerts: [{
      //   content: '设备下线',
      //   level: 1
      // }, {
      //   content: 'PM2.5超过指标',
      //   level: 3
      // }, {
      //   content: 'PM2.5超过指标',
      //   level: 3
      // }, {
      //   content: 'PM2.5超过指标',
      //   level: 3
      // }, {
      //   content: 'PM2.5超过指标',
      //   level: 3
      // }, {
      //   content: 'AQI过低',
      //   level: 2
      // }, {
      //   content: 'AQI过低',
      //   level: 2
      // }, {
      //   content: 'AQI过低',
      //   level: 2
      // }, {
      //   content: '滤网失效',
      //   level: 3
      // }, {
      //   content: '滤网失效',
      //   level: 3
      // }],
      loadingData: false,
      productName: '',
      alertSummary: {
        unhandle: {
          total: '',
          change: '',
          title: '待处理告警'
        },
        message: {
          total: '',
          change: '',
          title: '今日告警'
        },
        thirtyday: {
          total: '',
          change: '',
          title: '30天告警数'
        },
        sevenday: {
          total: '',
          change: '',
          title: '7天告警数'
        }
      }
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  computed: {
    endTime () {
      var end = new Date().getTime()
      return dateFormat('yyyy-MM-dd', new Date(end))
    },

    beginTime () {
      var past = new Date().getTime() - this.period * 24 * 3600 * 1000
      return dateFormat('yyyy-MM-dd', new Date(past))
    }
  },

  route: {
    data () {
      this.getCurrProduct(this.$route.params.id)
      this.getSummary()
      // this.getTagTrend()
    }
  },

  methods: {
    // 获取告警概览@author weijie
    getSummary () {
      var todayBeginTime = new Date().getTime() - 1 * 24 * 3600 * 1000
      todayBeginTime = dateFormat('yyyy-MM-dd', new Date(todayBeginTime))
      var weekBeginTime = new Date().getTime() - 7 * 24 * 3600 * 1000
      weekBeginTime = dateFormat('yyyy-MM-dd', new Date(weekBeginTime))
      var monthBeginTime = new Date().getTime() - 30 * 24 * 3600 * 1000
      monthBeginTime = dateFormat('yyyy-MM-dd', new Date(monthBeginTime))
      var now = new Date().getTime()
      now = dateFormat('yyyy-MM-dd', new Date(now))
      // 获取当天数据
      api.statistics.getAlertSummary(todayBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.unhandle.total = res.data.unread
          this.alertSummary.message.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // 获取7天数据
      api.statistics.getAlertSummary(weekBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.sevenday.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // 获取30天数据
      api.statistics.getAlertSummary(monthBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.thirtyday.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 获取告警趋势图表数据
    getTagTrend () {
      var begin
      var end
      if (this.period === '') {
        var startTime = uniformDate(this.startTime)
        var endTime = uniformDate(this.endTime)
        begin = startTime
        end = endTime
      } else {
        begin = this.beginTime
        end = this.endTime
      }
      // 获取标签'轻微'的趋势
      api.alert.getTagTrend(this.$route.params.id, '轻微', begin, end).then((res) => {
        if (res.status === 200) {
          this.light = res.data
          this.pushArr(this.light)
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 获取标签'通知'的趋势
      api.alert.getTagTrend(this.$route.params.id, '通知', begin, end).then((res) => {
        if (res.status === 200) {
          this.normal = res.data
          this.pushArr(this.normal)
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 获取标签'严重'的趋势
      api.alert.getTagTrend(this.$route.params.id, '严重', begin, end).then((res) => {
        if (res.status === 200) {
          this.serious = res.data
          this.pushArr(this.serious)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 处理标签数据
    pushArr (arr) {
      var rearr = []
      arr.data.forEach((item) => {
        var i = 0
        var sum = 0
        while (i < item.hours.length) {
          sum += item.hours[i].message
          i++
        }
        rearr.push({
          day: item.day,
          data: sum,
          product: item.name
        })
      })
      this.trendData = rearr
      // arr.data.forEach((item) => {
      //   var dayTotal = 0
      //   item.hours.forEach((message) => {
      //     dayTotal = dayTotal + message.message
      //   })
      //   this.trendData.push({
      //     day: item.day,
      //     data: dayTotal,
      //     product: item.name
      //   })
      // })
    }
  }
}
</script>
