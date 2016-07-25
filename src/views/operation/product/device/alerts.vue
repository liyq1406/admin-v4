<template>
  <div>
    <div class="filter-bar">
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-range-picker></date-time-range-picker>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel">
      <time-line :data="alertChartData"></time-line>
    </div>
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <v-select label="全部等级" width='110px' size="small">
                  <span slot="label">告警历史</span>
                </v-select>
              </div>
            </div>
            <div class="filter-group fr">
              <dropdown></dropdown>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page"></c-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
import locales from 'consts/locales/index'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Table from 'components/Table'
import Select from 'components/Select'
import Mock from 'mockjs'
import Dropdown from 'components/Dropdown'
import dateFormat from 'date-format'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    'pager': Pager,
    'modal': Modal,
    'c-table': Table,
    'v-select': Select,
    RadioButtonGroup,
    TimeLine,
    Dropdown,
    DateTimeRangePicker
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
        unread: 0,
        add_today: 0,
        device: 0,
        message: 0
      },
      alertTrends: [],
      today: dateFormat('yyyy-MM-dd', new Date()),
      loadingData: false,
      alertChartData: [],
      headers: [
        {
          key: 'content',
          title: '告警内容'
        },
        {
          key: 'time',
          title: '时间',
          sortType: -1
        },
        {
          key: 'duration',
          title: '时长'
        },
        {
          key: 'addr',
          title: '地点'
        },
        {
          key: 'level',
          title: '告警等级'
        },
        {
          key: 'state',
          title: '状态'
        }
      ]
    }
  },

  computed: {
    queryCondition () {
      return {
        limit: this.countPerPage,
        // query: {
        //   'from': {
        //     '$in': [this.$route.params.device_id]
        //   }
        // },
        offset: (this.currentPage - 1) * this.countPerPage
      }
    },

    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },
    tables () {
      var result = []
      this.alerts.map((item) => {
        var alert = {
          content: '设备下线',
          time: '2016-01-01 16:21:13',
          duration: '1.2h',
          addr: '湖北, 武汉',
          level: '<div class="level level1 text-label-warning" style="width: 55px">中等</div>',
          state: '待处理',
          prototype: item
        }
        result.push(alert)
      })
      return result
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  ready () {
    // TODO
    this.alertChartData = Mock.mock({
      'list|21': [{
        'date|+1': [
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21),
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21),
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21)
        ],
        'count|+1': [6, 8, 9, 3, 9, 3, 9, 6, 38, 19, 33, 29, 33, 29, 16, 81, 91, 31, 19, 13, 19],
        '产品|+1': ['轻度', '轻度', '轻度', '轻度', '轻度', '轻度', '轻度', '中度', '中度', '中度', '中度', '中度', '中度', '中度',
        '重度', '重度', '重度', '重度', '重度', '重度', '重度']
      }]
    }).list
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
          this.alertSummary = res.data
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

<style lang="stylus">
@import '../../../../assets/stylus/common'
</style>
