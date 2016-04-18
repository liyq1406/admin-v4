<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <radio-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
          <h2>{{ $t("alert.service") }}</h2>
        </div>
        <div class="panel-bd">
          <div class="row">
            <div class="col-15">
              <div id="trendChart" style="height:320px;"></div>
            </div>
            <div class="col-9">
              <div class="statistics-info">
                <div class="item">
                  <div class="cont">
                    <div class="num">{{ alertSummary.device }}</div>
                    <div class="label">{{ $t("alert.statistic.device") }}</div>
                  </div>
                </div>
                <div class="item">
                  <div class="cont">
                    <div class="num">{{ alertSummary.message }}</div>
                    <div class="label">{{ $t("alert.statistic.message") }}</div>
                  </div>
                </div>
                <div class="item no-border">
                  <div class="cont">
                    <div class="num">{{ alertSummary.unread }}</div>
                    <div class="label">{{ $t("alert.statistic.unread") }}</div>
                  </div>
                </div>
                <div class="item no-border">
                  <div class="cont">
                    <div class="num">{{ alertSummary.add_today }}</div>
                    <div class="label">{{ $t("alert.statistic.add_today") }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t("alert.info") }}</h2>
        </div>
        <div class="panel-bd">
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t("alert.info_list.product_name") }}</th>
                <th>{{ $t("alert.info_list.content") }}</th>
                <th>{{ $t("alert.info_list.create_date") }}</th>
                <th>{{ $t("alert.info_list.is_read") }}</th>
                <th class="tac">{{ $t("common.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="alerts.length > 0 && !loadingData">
                <tr v-for="alert in alerts">
                  <td>{{ alert.product_name }}</td>
                  <td>
                    <template v-if="alert.tags"><span v-for="tag in alert.tags | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ tag }}</span></template>{{ alert.content }}
                  </td>
                  <td>{{ alert.create_date | formatDate }}</td>
                  <td><span v-if="alert.is_read" class="hl-gray">{{ $t("common.read") }}</span><span v-else="v-else">{{ $t("common.unread") }}</span></td>
                  <td class="tac">
                    <button @click="showAlert(alert)" class="btn btn-link btn-sm">{{ $t("common.details") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="loadingData">
                <td colspan="5" class="tac">
                  <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
                </td>
              </tr>
              <tr v-if="alerts.length === 0 && !loadingData">
                <td colspan="5" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
          <pager v-if="!loadingData" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getAlerts"></pager>
        </div>
      </div>
    </div>
    <!-- 查看告警信息浮层-->
    <modal :show.sync="showModal">
      <h3 slot="header">{{ $t("alert.info") }}</h3>
      <table slot="body" class="table table-stripe table-bordered">
        <tbody>
          <tr>
            <td>{{ $t("alert.info_list.product_name") }}</td>
            <td>{{ model.product_name }}</td>
          </tr>
          <tr>
            <td>{{ $t("alert.info_list.alert_name") }}</td>
            <td>{{ model.alert_name }}</td>
          </tr>
          <tr>
            <td>{{ $t("alert.info_list.content") }}</td>
            <td>{{ model.content }}</td>
          </tr>
          <tr>
            <td>{{ $t("alert.info_list.tags") }}</td>
            <td>
              <template v-if="model.tags"><span v-for="tag in model.tags | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ tag }}</span></template>
            </td>
          </tr>
          <tr>
            <td>{{ $t("alert.info_list.type") }}</td>
            <td><span>{{ infoTypes[model.type - 1] }}</span></td>
          </tr>
          <tr>
            <td>{{ $t("alert.info_list.notify_type") }}</td>
            <td><span>{{ alertTypes[model.notify_type - 1] }}</span></td>
          </tr>
          <tr>
            <td>{{ $t("alert.info_list.alert_value") }}</td>
            <td>{{ model.alert_value }}</td>
          </tr>
          <tr>
            <td>{{ $t("alert.info_list.from") }}</td>
            <td>{{ model.from }}</td>
          </tr>
          <tr>
            <td>{{ $t("alert.info_list.to") }}</td>
            <td>{{ model.to }}</td>
          </tr>
          <tr>
            <td>{{ $t("alert.info_list.create_date") }}</td>
            <td>{{ model.create_date | formatDate }}</td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="modal-footer">
        <button @click.prevent.stop="showModal = false" class="btn btn-primary">{{ $t("common.ok") }}</button>
      </div>
    </modal>
  </section>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api'
  import locales from '../../consts/locales/index'
  import Pager from '../../components/Pager'
  import Modal from '../../components/Modal'
  import RadioGroup from '../../components/RadioGroup'
  import dateFormat from 'date-format'
  import echarts from 'echarts/echarts'
  import 'echarts/chart/line'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Alerts',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'pager': Pager,
      'modal': Modal,
      'radio-group': RadioGroup
    },

    data () {
      return {
        alerts: [],
        total: 0,
        pageCount: 10,
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
        periods: locales[Vue.config.lang].periods,
        product_id: '',
        alertTypes: locales[Vue.config.lang].alertTypes,
        infoTypes: locales[Vue.config.lang].infoTypes,
        alertSummary: {
          unread: 0,
          add_today: 0,
          device: 0,
          message: 0
        },
        alertTrends: [],
        today: dateFormat('yyyy-MM-dd', new Date()),
        loadingData: false
      }
    },

    computed: {
      queryCondition () {
        return {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount
        }
      },

      past () {
        var past = new Date().getTime() - this.period * 24 * 3600 * 1000
        return dateFormat('yyyy-MM-dd', new Date(past))
      }
    },

    filters: {
      toTags (value) {
        return value.length ? value.split(',') : []
      }
    },

    ready () {
      this.drawTrendsChart()
      // var this = this
      // this.getAlertSummary()
    },

    route: {
      data () {
        this.getAlerts()
        this.getAlertSummary()
        this.drawTrendsChart()
      }
    },

    // 监听属性变动
    watch: {
      period () {
        this.getAlertSummary()
        this.drawTrendsChart()
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
            this.alertSummary = res.data
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      // 趋势图表
      drawTrendsChart () {
        api.statistics.getAlertTrend(this.past, this.today).then((res) => {
          var dates = res.data.map((item) => {
            return dateFormat('MM-dd', new Date(item.day))
          })
          var alertCounts = res.data.map((item) => {
            return item.message
          })

          // 趋势图表
          var trendOptions = {
            noDataLoadingOption: {
              text: this.$t('common.no_data'),
              effect: '',
              effectOption: {
                backgroundColor: '#FFF'
              },
              textStyle: {
                fontSize: 14,
                color: '#999'
              }
            },
            calculable: true,
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              x: 50,
              y: 32,
              x2: 15
            },
            legend: {
              x: 'right',
              y: 10,
              data: [this.$t('alert.counts')]
            },
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: dates
            }],
            yAxis: [{
              type: 'value'
            }],
            series: [{
              name: this.$t('alert.counts'),
              type: 'line',
              data: alertCounts
            }]
          }
          var trendChart = echarts.init(document.getElementById('trendChart'))
          trendChart.setOption(trendOptions)
          window.onresize = trendChart.resize
        }).catch((res) => {
          this.handleError(res)
        })
      }
    }
  }
</script>
