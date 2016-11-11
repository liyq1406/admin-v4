<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>{{ $t('operation.product.alert.title') }}</h2>
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
import formatDate from 'filters/format-date'
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
        name: this.$t('operation.product.alert.danger'),
        data: []
      },
      normal: {
        name: this.$t('operation.product.alert.info'),
        data: []
      },
      light: {
        name: this.$t('operation.product.alert.warning'),
        data: []
      },
      loadingData: false,
      alertSummary: {
        unhandle: {
          total: '',
          change: '',
          title: this.$t('operation.product.alert.untreated')
        },
        message: {
          total: '',
          change: '',
          title: this.$t('operation.product.alert.today_add')
        },
        thirtyday: {
          total: '',
          change: '',
          title: this.$t('operation.product.alert.thirty_add')
        },
        sevenday: {
          total: '',
          change: '',
          title: this.$t('operation.product.alert.sevent_add')
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
      return formatDate(new Date(), 'yyyy-MM-dd', true)
    },

    beginTime () {
      var past = new Date().getTime() - this.period * 24 * 3600 * 1000
      return formatDate(past, 'yyyy-MM-dd', true)
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
      const MILLISECONDS_PER_DAY = 24 * 3600 * 1000
      var todayTime = formatDate(new Date(), 'yyyy-MM-dd', true)
      var initTime = formatDate(new Date(0), 'yyyy-MM-dd', true)
      var weekBeginTime = new Date().getTime() - 7 * MILLISECONDS_PER_DAY
      weekBeginTime = formatDate(weekBeginTime, 'yyyy-MM-dd', true)
      var monthBeginTime = new Date().getTime() - 30 * MILLISECONDS_PER_DAY
      monthBeginTime = formatDate(monthBeginTime, 'yyyy-MM-dd', true)
      var now = new Date().getTime() - MILLISECONDS_PER_DAY
      now = formatDate(now, 'yyyy-MM-dd', true)
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
