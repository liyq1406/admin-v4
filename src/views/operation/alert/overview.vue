<template>
  <div class="main">
    <div class="main-title">
      <h3>告警记录</h3>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <date-time-range-picker></date-time-range-picker>
            </div>
            <div class="filter-group-item mr20">
              <radio-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
            </div>
          </div>
        </div>
        <div class="with-loading">
          <line-chart :series="alertSeries" :x-axis-data="alertXAxisData" v-ref:alert-chart></line-chart>
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="row statistic-group">
      <div class="col-6">
        <statistic :info="alertSummary.device" :title="$t('ui.alert.statistic.device')" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.message" :title="$t('ui.alert.statistic.message')" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.unread" :title="$t('ui.alert.statistic.unread')" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.add_today" :title="$t('ui.alert.statistic.add_today')" align="left"></statistic>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t("ui.alert.info") }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t("ui.alert.info_list.product_name") }}</th>
                <th>{{ $t("ui.alert.info_list.content") }}</th>
                <th>{{ $t("ui.alert.info_list.create_date") }}</th>
                <th>{{ $t("ui.alert.info_list.is_read") }}</th>
                <th class="tac">{{ $t("common.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="alerts.length > 0">
                <tr v-for="alert in alerts">
                  <td>{{ alert.product_name }}</td>
                  <td>
                    <template v-if="alert.tags"><span v-for="tag in alert.tags | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ tag }}</span></template>{{ alert.content }}
                  </td>
                  <td>{{ alert.create_date | formatDate }}</td>
                  <td><span v-if="alert.is_read" class="hl-gray">{{ $t("common.read") }}</span><span v-else>{{ $t("common.unread") }}</span></td>
                  <td class="tac">
                    <button @click="showAlert(alert)" class="btn btn-link btn-mini">{{ $t("common.details") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="alerts.length === 0 && !loadingData">
                <td colspan="5" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getAlerts"></pager>
      </div>
    </div>
    <!-- 查看告警信息浮层-->
    <modal :show.sync="showModal">
      <h3 slot="header">{{ $t("ui.alert.info") }}</h3>
      <table slot="body" class="table table-stripe table-bordered">
        <tbody>
          <tr>
            <td>{{ $t("ui.alert.info_list.product_name") }}</td>
            <td>{{ model.product_name }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.alert_name") }}</td>
            <td>{{ model.alert_name }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.content") }}</td>
            <td>{{ model.content }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.tags") }}</td>
            <td>
              <template v-if="model.tags"><span v-for="tag in model.tags | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ tag }}</span></template>
            </td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.type") }}</td>
            <td><span>{{ informTypes[model.type - 1] }}</span></td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.notify_type") }}</td>
            <td><span>{{ alertTypes[model.notify_type - 1] }}</span></td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.alert_value") }}</td>
            <td>{{ model.alert_value }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.from") }}</td>
            <td>{{ model.from }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.to") }}</td>
            <td>{{ model.to }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.create_date") }}</td>
            <td>{{ model.create_date | formatDate }}</td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="modal-footer">
        <button @click.prevent.stop="showModal = false" class="btn btn-primary">{{ $t("common.ok") }}</button>
      </div>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import api from 'api'
import * as config from 'consts/config'
import locales from 'consts/locales/index'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import Statistic from 'components/Statistic'
import RadioGroup from 'components/RadioGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import DateTimeSinglePicker from 'components/DateTimeSinglePicker'
import dateFormat from 'date-format'
import LineChart from 'components/charts/Line'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    Pager,
    Modal,
    RadioGroup,
    LineChart,
    Statistic,
    DateTimeRangePicker,
    DateTimeSinglePicker
  },

  data () {
    return {
      alerts: [],
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      showModal: false,
      model: {
        id: '',
        type: 1,
        product_name: '',
        alert_name: '',
        alert_value: '',
        notify_type: 1,
        from: '',
        to: [],
        content: '',
        create_date: '',
        is_read: false,
        tags: ''
      },
      period: 7,
      periods: locales[Vue.config.lang].data.PERIODS,
      product_id: '',
      alertTypes: locales[Vue.config.lang].data.ALERT_TYPES,
      informTypes: locales[Vue.config.lang].data.INFORM_TYPES,
      alertSummary: {
        unread: {
          total: 0,
          change: 1
        },
        add_today: {
          total: 0,
          change: -9
        },
        device: {
          totoal: 0,
          change: 2
        },
        message: {
          total: 0,
          change: 22
        }
      },
      alertTrends: [],
      today: dateFormat('yyyy-MM-dd', new Date()),
      loadingData: false
    }
  },

  computed: {
    queryCondition () {
      return {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage
      }
    },

    past () {
      var past = new Date().getTime() - this.period * 24 * 3600 * 1000
      return dateFormat('yyyy-MM-dd', new Date(past))
    },

    // 告警图表数据
    alertSeries () {
      var result = [{
        name: this.$t('ui.alert.counts'),
        type: 'line',
        data: []
      }]

      for (var i = 0; i < this.period; i++) {
        var index = _.findIndex(this.alertTrends, (item) => {
          return item.day === this.alertXAxisData[i]
        })
        result[0].data[i] = index >= 0 ? this.alertTrends[index].message : 0
      }

      return result
    },

    // 告警图表横轴数据
    alertXAxisData () {
      var today = new Date()
      var result = []

      for (var i = this.period - 1; i >= 0; i--) {
        result[i] = dateFormat('MM-dd', new Date(today - (this.period - i - 1) * 24 * 3600 * 1000))
      }
      return result
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  ready () {
    // 监听窗口尺寸变化
    window.onresize = () => {
      this.$refs.alertChart.chart.resize()
    }
  },

  route: {
    data () {
      this.getAlerts()
      this.getAlertTrends()
      this.getAlertSummary()
    }
  },

  // 监听属性变动
  watch: {
    period () {
      this.getAlertTrends()
      this.getAlertSummary()
    }
  },

  methods: {
    /**
     * 获取单条告警信息并弹出浮层显示
     * @param  {Object} alert 目标告警信息
     */
    showAlert (alert) {
      this.model = alert
      this.showModal = true
      api.alert.setAlertRead([alert.id]).then((res) => {
        if (res.status === 200) {
          alert.is_read = true
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取告警信息列表
     */
    getAlerts () {
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.alerts = res.data.list
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    // 告警统计信息
    getAlertSummary () {
      api.statistics.getAlertSummary(this.past, this.today).then((res) => {
        if (res.status === 200) {
          this.alertSummary.unread.total = res.data.unread
          this.alertSummary.add_today.total = res.data.add_today
          this.alertSummary.device.total = res.data.device
          this.alertSummary.message.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取告警趋势
     */
    getAlertTrends () {
      api.statistics.getAlertTrend(this.past, this.today).then((res) => {
        if (res.status === 200) {
          this.alertTrends = res.data.map((item) => {
            item.day = dateFormat('MM-dd', new Date(item.day))
            return item
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
