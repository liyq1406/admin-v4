<template>
  <div>
    <div class="filter-bar">
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-multiple-picker :periods="periods" @timechange="onTimeChange"></date-time-multiple-picker>
        </div>
      </div>
    </div>
    <div class="panel">
      <time-line :data="trendData"></time-line>
    </div>
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getAlerts" @search-activate="searching=!searching"  @press-enter="getAlerts">
                  <button slot="search-button" @click="getAlerts" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <v-select width="90px" size="small" :label="visibility.label">
                <span slot="label" class="mr10">明细</span>
                <select v-model="visibility" @change="getAlerts">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <x-table :headers="headers" :tables="tableData" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Table from 'components/Table'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import { globalMixins } from 'src/mixins'
import { formatDate, uniformDate } from 'src/filters'
import _ from 'lodash'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    'x-table': Table,
    'v-select': Select,
    Pager,
    RadioButtonGroup,
    TimeLine,
    SearchBox,
    DateTimeMultiplePicker
  },

  data () {
    return {
      alerts: [],
      visibilityOptions: [
        { label: '全部等级', value: 'all' },
        { label: '通知', value: '通知' },
        { label: '轻微', value: '轻微' },
        { label: '中等', value: '中等' },
        { label: '重度', value: '重度' }
      ],
      visibility: {},
      key: '',
      loadingData: false,
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      periods: [7, 30, 90],
      startTime: null,
      endTime: null,
      alertSummary: {
        unread: 0,
        add_today: 0,
        device: 0,
        message: 0
      },
      trends: {
        light: [],
        medium: [],
        serious: []
      },
      headers: [{
        key: 'content',
        title: '告警内容'
      }, {
        key: 'time',
        title: '时间',
        sortType: -1
      }, {
        key: 'duration',
        title: '持续时长'
      }, {
        key: 'level',
        title: '告警等级'
      }, {
        key: 'state',
        title: '状态'
      }]
    }
  },

  computed: {
    // 查询条件
    queryCondition () {
      var condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          product_id: {
            $in: [this.$route.params.product_id]
          },
          create_date: {
            $gte: this.startTime,
            $lte: this.endTime
          }
        }
      }

      // 关键字搜索
      if (this.key.length > 0) {
        condition.query.alert_name = { $like: this.key }
      }

      // 显示指定告警类型
      if (this.visibility.value && this.visibility.value !== 'all') {
        condition.query.tags = { $in: [this.visibility.value] }
      }

      return condition
    },

    // 分页信息
    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },

    // 表格信息
    tableData () {
      var result = []
      this.alerts.map((item) => {
        let levelCls = ({
          '中等': 'text-label-warning',
          '重度': 'text-label-danger'
        })[item.tags] || ''

        let alert = {
          content: item.alert_name,
          mac: item.mac,
          time: formatDate(item.create_date),
          duration: this.prettyDuration(item.lasting),
          id: item.from,
          level: `<div class="level level1 text-label ${levelCls}">${item.tags}</div>`,
          state: item.is_read ? '已处理' : '未处理',
          prototype: item
        }
        result.push(alert)
      })
      return result
    },

    // 趋势数据
    trendData () {
      return this.trends.light.concat(this.trends.medium).concat(this.trends.serious)
    }
  },

  route: {
    data () {
      this.visibility = this.visibilityOptions[0]
    }
  },

  methods: {
    /**
     * 将毫秒数格式化为合适显示的时间段
     */
    prettyDuration (n) {
      let hours = (n / 3600000).toFixed(1)
      if (hours > 1) {
        return `${hours}小时`
      } else {
        return `${Math.floor(n / 60000)}分钟`
      }
    },

    /**
     * 处理当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getAlerts()
    },

    /**
     * 处理每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getAlerts(true)
    },

    /**
     * 获取告警趋势图表数据
     * @author weijie
     */
    getTagTrend () {
      if (this.startTime === null || this.endTime === null) return
      let start = uniformDate(this.startTime)
      let end = uniformDate(this.endTime)
      const TAGS = {
        light: '轻微',
        medium: '中等',
        serious: '重度'
      }

      for (var key in TAGS) {
        ((tag) => {
          api.alert.getDeviceTagTrend(this.$route.params.product_id, this.$route.params.device_id, TAGS[tag], start, end).then((res) => {
            if (res.status === 200) {
              // 模拟数据开始
              // res.data = [
              //   {day: '2016-07-19', hours: [{hour: '00', message: 10}, {hour: '01', message: 20}]},
              //   {day: '2016-07-20', hours: [{hour: '00', message: 30}, {hour: '01', message: 25}]}
              // ]
              // 模拟数据结束

              this.trends[tag] = res.data.map((item) => {
                // 算出某天告警总数
                let sum = _.map(item.hours, 'message').reduce((prev, next) => {
                  return prev + next
                }, 0)
                return {
                  date: item.day,
                  val: sum,
                  name: TAGS[tag]
                }
              })
            }
          }).catch((res) => {
            this.handleError(res)
          })
        })(key)
      }
    },

    /**
     * 处理时间选择
     * @author shengzhi
     */
    onTimeChange (start, end) {
      this.startTime = start
      this.endTime = end
      this.getTagTrend()
      this.getAlerts()
    },

    /**
     * 获取告警历史
     * @author weijie
     */
    getAlerts () {
      if (this.startTime === null || this.endTime === null) return
      this.loadingData = true

      api.alert.getAlerts(this.queryCondition).then((res) => {
        this.loadingData = false
        if (res.status === 200) {
          this.total = res.data.count
          this.alerts = res.data.list.map((item) => {
            // 计算已读告警持续时间
            let begin = new Date(formatDate(item.create_date))
            // 默认为未读，从当前时间算起
            let end = new Date()
            // 如果是已读，则从已读时间算起
            if (item.is_read) {
              end = new Date(formatDate(item.read_time))
            }
            // 持续时间
            item.lasting = end.getTime() - begin.getTime()
            return item
          })
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    }
  }
}
</script>
