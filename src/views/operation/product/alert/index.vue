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
    <alert-trends :product-id="productID"></alert-trends>
    <alert-table :product-id="productID"></alert-table>
  </div>
</template>

<script>
// import Vue from 'vue'
import api from 'api'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from '../mixins'
import Statistic from 'components/Statistic'
import dateFormat from 'date-format'
import AlertTable from './alert-table'
import AlertTrends from './alert-trends'

export default {
  name: 'Alert',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, setCurrProductMixin],

  components: {
    Statistic,
    AlertTable,
    AlertTrends
  },

  data () {
    return {
      alertChartData: [],
      records: [],
      deviceID: '',
      productID: null,
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
      loadingData: false,
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
      this.productID = this.$route.params.id
      this.getSummary()
    }
  },

  watch: {
    currentProduct () {
      this.productID = this.currentProduct.id
      this.getSummary()
    }
  },

  methods: {
    // 获取告警概览@author weijie
    getSummary () {
      var todayTime = new Date().getTime()
      todayTime = dateFormat('yyyy-MM-dd', new Date(todayTime))
      var initTime = new Date(0)
      initTime = dateFormat('yyyy-MM-dd', new Date(initTime))
      var weekBeginTime = new Date().getTime() - 7 * 24 * 3600 * 1000
      weekBeginTime = dateFormat('yyyy-MM-dd', new Date(weekBeginTime))
      var monthBeginTime = new Date().getTime() - 30 * 24 * 3600 * 1000
      monthBeginTime = dateFormat('yyyy-MM-dd', new Date(monthBeginTime))
      var now = new Date().getTime() - 1 * 24 * 3600 * 1000
      now = dateFormat('yyyy-MM-dd', new Date(now))
      // 获取当天数据
      api.statistics.getProductAlertSummary(this.productID, initTime, todayTime).then((res) => {
        if (res.status === 200) {
          this.alertSummary.unhandle.total = res.data.unread
          this.alertSummary.message.total = res.data.add_today
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // 获取7天数据
      api.statistics.getProductAlertSummary(this.productID, weekBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.sevenday.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // 获取30天数据
      api.statistics.getProductAlertSummary(this.productID, monthBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.thirtyday.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
