<template>
  <div class="main">
    <div class="main-title">
      <h2>告警分析详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="left-actions blockdiv clearfix mt10" slot="left-actions">
      <div class="filter-group fl ml20">
        <div class="filter-group-item">
          <!-- <v-select label="空气净化器" width="110px" size="small">
            <span slot="label">产品：空气净化器</span>
          </v-select> -->
          <div class="lh28">
            <span v-for="tag in alert.tag | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ alert.tag }}</span><span class="ml10">{{alert.name}}</span></div>
        </div>
      </div>
      <div class="filter-group fr mr20">
        <div class="filter-group-item inlinediv mr10">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="period" @select="getList()"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
        <div class="filter-group-item inlinediv">
          <date-time-range-picker @timechange = "getSpecial"></date-time-range-picker>
        </div>
      </div>
    </div>
    <div class="panel mt10">
      <div class="filter-bar filter-bar-head filter-bar-lr">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getList()" @search-deactivate="getList()" @search="getList()" @press-enter="getList()">
              <v-select width="90px" :label="queryType.label" size="small">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
              <button slot="search-button" @click="getList()" class="btn btn-primary"><i class="fa fa-search"></i></button>
            </search-box>
          </div>
        </div>
        <h3>告警列表</h3>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <c-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @page-count-update="pageCountUpdate" @current-page-change="currentPageChange"></c-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import locales from 'consts/locales/index'
import * as config from 'consts/config'
import api from 'api'
import Modal from 'components/Modal'
import Select from 'components/Select'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import Statistic from 'components/Statistic'
import TimeLine from 'components/g2-charts/TimeLine'
import Breadcrumb from 'components/Breadcrumb'
import SearchBox from 'components/SearchBox'
// import Pie from 'components/g2-charts/Pie'
import Table from 'components/Table'
import dateFormat from 'date-format'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
// import { pluginMixins } from '../mixins'
import { formatDate } from 'src/filters'

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
    Breadcrumb,
    TimeLine,
    SearchBox
  },

  data () {
    return {
      singleAlert: {},
      alert: {
        tag: '',
        name: ''
      },
      startTimePick: '',
      endTimePick: '',
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      records: [],
      key: '',
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: '设备ID', value: 'from' },
        { label: '告警内容', value: 'alert_name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
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
          title: '设备MAC'
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
      // tables: [{
      //   mac: 123,
      //   time: '2016-01-01 16:21:13',
      //   duration: '1.1h',
      //   addr: '湖北, 武汉',
      //   state: '待处理'
      // },
      // {
      //   mac: 123,
      //   time: '2016-01-01 16:21:13',
      //   duration: '1.1h',
      //   addr: '湖北, 武汉',
      //   state: '待处理'
      // },
      // {
      //   mac: 123,
      //   time: '2016-01-01 16:21:13',
      //   duration: '1.1h',
      //   addr: '湖北, 武汉',
      //   state: '待处理'
      // }],
      breadcrumbNav: [{
        label: '告警分析',
        link: '/operation/alerts/analysis'
      }, {
        label: '当前'
      }],
      product: {},
      total: 0
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  ready () {
    this.getProduct()
    this.getAlertList()
    this.getList()
  },

  computed: {
    // queryCondition () {
    //   return {
    //     limit: this.countPerPage,
    //     offset: (this.currentPage - 1) * this.countPerPage
    //     if (this.key !== '') {
    //       condition.query.id = {$regex: this.key, $options: 'i'}
    //     }
    //   }
    // },

    queryCondition () {
      var condition = {}
      if (this.period === '') {
        condition = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {
            id: {
              $in: [this.$route.params.id]
            },
            create_date: {
              $gte: this.startTimePick,
              $lte: this.endTimePick
            }
          }
        }
      } else {
        condition = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {
            id: {
              $in: [this.$route.params.id]
            },
            create_date: {
              $lte: this.endTime + 'T00:00:00.000Z',
              $gte: this.beginTime + 'T00:00:00.000Z'
            }
          }
        }
      }
      if (this.key.length > 0) {
        condition.query[this.queryType.value] = this.queryType.value === 'from' ? { $in: [Number(this.key)] } : { $like: this.key }
      }
      return condition
    },

    beginTime () {
      var past = new Date().getTime() - this.period * 24 * 3600 * 1000
      return dateFormat('yyyy-MM-dd', new Date(past))
    },
    endTime () {
      var end = new Date().getTime()
      return dateFormat('yyyy-MM-dd', new Date(end))
    },
    tables () {
      // var result = []
      // this.alerts.map((item) => {
      //   var levelCls = ''
      //   console.log(item.level)
      //   if (item.level === 2) {
      //     levelCls = 'text-label-warning'
      //   } else if (item.level === 3) {
      //     levelCls = 'text-label-danger'
      //   }
      //   var alert = {
      //     content: item.content || '设备下线',
      //     time: '2016-01-01 16:21:13',
      //     duration: '1.1h',
      //     addr: '湖北, 武汉',
      //     level: `<div class="level level1 text-label ${levelCls}">${item.level === 1 ? '轻微' : item.level === 2 ? '中等' : '严重'}</div>`,
      //     state: '待处理',
      //     prototype: item
      //   }
      //   result.push(alert)
      // })
      // return result
      var result = []
      this.records.map((item) => {
        var levelCls = ''
        console.log(item.level)
        if (item.tags === '通知') {
          levelCls = 'text-label-warning'
        } else if (item.tags === '严重') {
          levelCls = 'text-label-danger'
        }
        var alert = {
          mac: item.mac,
          time: item.create_date,
          duration: item.lasting + 'h',
          level: `<div class="level level1 text-label ${levelCls}">${item.tags === '轻微' ? '轻微' : item.tags === '中等' ? '中等' : '严重'}</div>`,
          state: item.is_read ? '已处理' : '未处理',
          prototype: item
        }
        result.push(alert)
      })
      return result
    }
  },

  methods: {
    currentPageChange (number) {
      this.currentPage = number
      this.getList()
    },
    pageCountUpdate (count) {
      this.countPerPage = count
      this.getList()
    },
    // 获取选中产品信息
    getProduct () {
      api.product.getProduct(this.$route.params.product_id).then((res) => {
        // console.log(res.data)
        this.product = res.data
        this.breadcrumbNav[1].label = this.product.name
      }).catch((res) => {
        this.handleError(res)
      })
    },
    getSpecial (start, end) {
      this.period = ''
      this.startTimePick = start
      this.endTimePick = end
      this.getList()
    },
    // 获取告警规则列表
    getAlertList () {
      api.alert.getRules(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          res.data.forEach((item) => {
            if (this.$route.params.id === item.id) {
              this.alert.name = item.name
              this.alert.tag = item.tag
            }
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 获取告警历史@author weijie
    getList () {
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.total = res.data.count
          // console.log(res.data.list)
          // this.alerts = res.data.list
          this.records = res.data.list.map((item) => {
            // 计算已读告警持续时间
            if (item.is_read) {
              let beginTime = new Date(formatDate(item.create_date))
              let endTime = new Date(formatDate(item.read_time))
              let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
              // console.log(lasting.toFixed(1))
              item.lasting = lasting.toFixed(1)
            } else {
              // 计算未读告警持续时间
              let beginTime = new Date(formatDate(item.create_date))
              let endTime = new Date()
              let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
              // console.log(lasting.toFixed(1))
              item.lasting = lasting.toFixed(1)
            }
            return item
          })
          this.loadingData = false
        }
      }).catch((res) => {
        this.loadingData = false
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

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'
.filter-bar-lr
  border 1px solid #d9d9d9
.inlinediv
  display inline-block!important
.lh28
  line-height 28px
.nobgnobrt
  background-color none
  border-top none!important
</style>
