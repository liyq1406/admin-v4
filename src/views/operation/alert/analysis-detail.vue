<template>
  <div class="main">
    <div class="main-title">
      <h2>告警分析</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <v-select label="空气净化器" width="110px" size="small">
            <span slot="label">产品：空气净化器</span>
          </v-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
        </div>
        <div class="filter-group-item">
          <date-time-range-picker></date-time-range-picker>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <c-table :headers="headers" :tables="tables" :page="page"></c-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import locales from 'consts/locales/index'
import api from 'api'
import Modal from 'components/Modal'
import Select from 'components/Select'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import Statistic from 'components/Statistic'
import TimeLine from 'components/g2-charts/TimeLine'
// import Pie from 'components/g2-charts/Pie'
import Table from 'components/Table'
import dateFormat from 'date-format'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
// import { pluginMixins } from '../mixins'

// import Mock from 'mockjs'

export default {
  name: 'Overview',

  mixins: [globalMixins],

  components: {
    Modal,
    // Pie,
    'v-select': Select,
    RadioButtonGroup,
    DateTimeRangePicker,
    'c-table': Table,
    Statistic,
    TimeLine
  },

  data () {
    return {
      alerts: [{
        content: '设备下线',
        level: 1
      }, {
        content: 'PM2.5超过指标',
        level: 3
      }, {
        content: 'PM2.5超过指标',
        level: 3
      }, {
        content: 'PM2.5超过指标',
        level: 3
      }, {
        content: 'PM2.5超过指标',
        level: 3
      }, {
        content: 'AQI过低',
        level: 2
      }, {
        content: 'AQI过低',
        level: 2
      }, {
        content: 'AQI过低',
        level: 2
      }, {
        content: '滤网失效',
        level: 3
      }, {
        content: '滤网失效',
        level: 3
      }],
      today: dateFormat('yyyy-MM-dd', new Date()),
      customPieMargin: [20, 0, 0, 0],
      feedbacks: [
        {
          name: '使用帮助',
          value: 50
        },
        {
          name: '产品咨询',
          value: 30
        },
        {
          name: '投诉建议',
          value: 20
        },
        {
          name: '产品故障',
          value: 10
        }
      ],
      summary: {
        pending: {
          total: 23,
          title: '待处理'
        },
        avg: {
          total: 14,
          unit: '%',
          title: '平均处理时间率'
        },
        weekAdded: {
          total: 145,
          change: -14,
          title: '7天新增'
        },
        monthAdded: {
          total: 345,
          change: 40,
          title: '30天新增'
        }
      },
      // 趋势
      trends: {
        data: [],
        options: {}
      },
      // 时间间隔
      period: 7,
      // 待选时间间隔
      // periods: locales.data.PERIODS,
      // 数据是否加载中
      loadingData: false,
      headers: [
        {
          key: 'mac',
          title: '告警设备 (MAC) '
        },
        {
          key: 'time',
          title: '上报时间',
          sortType: -1
        },
        {
          key: 'duration',
          title: '持续时长'
        },
        {
          key: 'addr',
          title: '所在地'
        },
        {
          key: 'state',
          title: '状态'
        }
      ],
      tables: [{
        mac: 123,
        time: '2016-01-01 16:21:13',
        duration: '1.1h',
        addr: '湖北, 武汉',
        state: '待处理'
      },
      {
        mac: 123,
        time: '2016-01-01 16:21:13',
        duration: '1.1h',
        addr: '湖北, 武汉',
        state: '待处理'
      },
      {
        mac: 123,
        time: '2016-01-01 16:21:13',
        duration: '1.1h',
        addr: '湖北, 武汉',
        state: '待处理'
      }]
    }
  },

  ready () {
  },

  computed: {
  },

  methods: {
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

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'
</style>
