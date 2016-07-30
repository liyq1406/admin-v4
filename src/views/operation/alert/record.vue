<template>
  <div class="main">
    <div class="main-title">
      <h2>告警记录</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <v-select :label="currentProduct.name" width="110px" size="small">
            <span slot="label">产品</span>
            <select v-model="currentProduct" @change="">
              <!-- <option :value="currentProduct">{{ currentProduct.name }}</option> -->
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-range-picker></date-time-range-picker>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="periods" :value.sync="period" @select="getDate"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="with-loading">
          <time-line :data="alertTrends" :type="'smooth'"></time-line>
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :info="alertSummary.unread" :title="alertSummary.unread.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.today" :title="alertSummary.today.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.week" :title="alertSummary.week.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.month" :title="alertSummary.month.title" align="left"></statistic>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')">
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <h3>明细</h3>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>告警设备</th>
                <th>时间</th>
                <th>持续时长</th>
                <th>告警内容</th>
                <th>地点</th>
                <th>告警等级</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="alerts.length > 0">
                <tr v-for="alert in alerts">
                  <td><a v-link="{'path': '/operation/alerts/detail/'+alert.id}">{{ alert.device_mac || 123 }}</a></td>
                  <td>{{ alert.create_date | formatDate }}</td>
                  <td>{{ alert.duration }}</td>
                  <td>{{ alert.content }}</td>
                  <td>{{ alert.area}}</td>
                  <td>{{ alert.level}}</td>
                  <td>{{ alert.alert_value}}</td>
                </tr>
              </template>
              <tr v-if="alerts.length === 0 && !loadingData">
                <td colspan="7" class="tac">
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
// import _ from 'lodash'
import api from 'api'
import * as config from 'consts/config'
import locales from 'consts/locales/index'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import Statistic from 'components/Statistic'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import DateTimeSinglePicker from 'components/DateTimeSinglePicker'
import dateFormat from 'date-format'
import TimeLine from 'components/g2-charts/TimeLine'
import { globalMixins } from 'src/mixins'
import Mock from 'mockjs'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    Pager,
    Modal,
    RadioButtonGroup,
    TimeLine,
    Statistic,
    DateTimeRangePicker,
    DateTimeSinglePicker,
    'v-select': Select,
    SearchBox
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      currentProduct: {},
      key: '',
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
      periods: [
        {
          value: 1,
          label: '24h'
        },
        {
          value: 7,
          label: '7天'
        },
        {
          value: 30,
          label: '30天'
        }
      ],
      product_id: '',
      alertTypes: locales[Vue.config.lang].data.ALERT_TYPES,
      informTypes: locales[Vue.config.lang].data.INFORM_TYPES,
      alertSummary: {
        unread: {
          title: '待处理告警',
          total: 0,
          change: 0
        },
        today: {
          title: '今日告警',
          total: 0,
          change: 0
        },
        week: {
          title: '7天告警数',
          totoal: 0,
          change: 0
        },
        month: {
          title: '30天告警数',
          total: 0,
          change: 0
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

    beginTime () {
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
    // TODO
    this.alertTrends = Mock.mock({
      'list|14': [{
        'date|+1': [
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21)
        ],
        'count|+1': [6, 8, 9, 5, 9, 12, 9]
      }]
    }).list
  },

  route: {
    data () {
      // this.getAlerts()
      // this.getAlertTrends()
      // this.getAlertSummary()
      this.getFirstProduct()
      this.getSummary()
    }
  },

  // 监听属性变动
  watch: {
    products () {
      this.getFirstProduct()
    }
    // period () {
    //   this.getAlertTrends()
    //   this.getAlertSummary()
    // }
  },

  methods: {
    // 获取第一个产品
    getFirstProduct () {
      this.currentProduct = this.products[0] || {}
    },

    // 获取数据
    getDate () {
      console.log(123)
      console.log(this.beginTime)
    },

    // 获取告警概览
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
          this.alertSummary.unread.total = res.data.unread
          this.alertSummary.today.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // 获取7天数据
      api.statistics.getAlertSummary(weekBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.week.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // 获取30天数据
      api.statistics.getAlertSummary(monthBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.month.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
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
    }
    //
    // /**
    //  * 获取告警信息列表
    //  */
    // getAlerts () {
    //   this.loadingData = true
    //   api.alert.getAlerts(this.queryCondition).then((res) => {
    //     if (res.status === 200) {
    //       // TODO
    //       this.alerts = res.data.list
    //       this.total = res.data.count
    //       this.loadingData = false
    //     }
    //   }).catch((res) => {
    //     this.handleError(res)
    //     this.loadingData = false
    //   })
    // },
    //
    // // 告警统计信息
    // getAlertSummary () {
    //   api.statistics.getAlertSummary(this.past, this.today).then((res) => {
    //     if (res.status === 200) {
    //       this.alertSummary.unread.total = res.data.unread
    //       this.alertSummary.add_today.total = res.data.add_today
    //       this.alertSummary.device.total = res.data.device
    //       this.alertSummary.message.total = res.data.message
    //     }
    //   }).catch((res) => {
    //     this.handleError(res)
    //   })
    // },
    //
    // /**
    //  * 获取告警趋势
    //  */
    // getAlertTrends () {
    //   api.statistics.getAlertTrend(this.past, this.today).then((res) => {
    //     if (res.status === 200) {
    //     }
    //   }).catch((res) => {
    //     this.handleError(res)
    //   })
    // }
  }
}
</script>
