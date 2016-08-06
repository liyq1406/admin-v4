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
      <time-line :data="trendData" :type="'smooth'"></time-line>
    </div>
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
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
            <div class="filter-group">
              <v-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="visibility" @change="getList()">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></c-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
// import locales from 'consts/locales/index'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Table from 'components/Table'
import Select from 'components/Select'
// import Mock from 'mockjs'
import Dropdown from 'components/Dropdown'
import dateFormat from 'date-format'
import { globalMixins } from 'src/mixins'
import SearchBox from 'components/SearchBox'
import { formatDate, uniformDate } from 'src/filters'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    'c-table': Table,
    'v-select': Select,
    Pager,
    Modal,
    RadioButtonGroup,
    TimeLine,
    Dropdown,
    SearchBox,
    DateTimeMultiplePicker
  },

  data () {
    return {
      key: '',
      deviceID: '',
      productID: '',
      // startTimePick: '',
      // endTimePick: '',
      records: [],
      visibility: {
        label: '全部等级',
        value: 'all'
      },
      visibilityOptions: [
        { label: '全部等级', value: 'all' },
        { label: '通知', value: '通知' },
        { label: '轻微', value: '轻微' },
        { label: '严重', value: '严重' }
      ],
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: '设备ID', value: 'from' },
        { label: '告警内容', value: 'alert_name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
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
      periods: [7, 30, 90],
      startTime: 0,
      endTime: 0,
      product_id: '',
      // alertTypes: locales[Vue.config.lang].data.ALERT_TYPES,
      // informTypes: locales[Vue.config.lang].data.INFORM_TYPES,
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
          title: '持续时长'
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
        condition.query[this.queryType.value] = this.queryType.value === 'from' ? { $in: [Number(this.key)] } : { $like: this.key }
      }

      // 显示指定告警类型
      if (this.visibility.value !== 'all') {
        condition.query.tags = { $in: [this.visibility.value] }
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

    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
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
        if (item.tags === '通知') {
          levelCls = 'text-label-warning'
        } else if (item.tags === '严重') {
          levelCls = 'text-label-danger'
        }
        var alert = {
          content: item.alert_name,
          time: formatDate(item.create_date),
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

  ready () {
    this.getList()
    // TODO
    // this.alertChartData = Mock.mock({
    //   'list|21': [{
    //     'date|+1': [
    //       new Date(2016, 7, 15),
    //       new Date(2016, 7, 16),
    //       new Date(2016, 7, 17),
    //       new Date(2016, 7, 18),
    //       new Date(2016, 7, 19),
    //       new Date(2016, 7, 20),
    //       new Date(2016, 7, 21),
    //       new Date(2016, 7, 15),
    //       new Date(2016, 7, 16),
    //       new Date(2016, 7, 17),
    //       new Date(2016, 7, 18),
    //       new Date(2016, 7, 19),
    //       new Date(2016, 7, 20),
    //       new Date(2016, 7, 21),
    //       new Date(2016, 7, 15),
    //       new Date(2016, 7, 16),
    //       new Date(2016, 7, 17),
    //       new Date(2016, 7, 18),
    //       new Date(2016, 7, 19),
    //       new Date(2016, 7, 20),
    //       new Date(2016, 7, 21)
    //     ],
    //     'count|+1': [6, 8, 9, 3, 9, 3, 9, 6, 38, 19, 33, 29, 33, 29, 16, 81, 91, 31, 19, 13, 19],
    //     '产品|+1': ['轻度', '轻度', '轻度', '轻度', '轻度', '轻度', '轻度', '中度', '中度', '中度', '中度', '中度', '中度', '中度',
    //     '重度', '重度', '重度', '重度', '重度', '重度', '重度']
    //   }]
    // }).list
  },

  route: {
    data () {
      // this.getAlerts()
      // this.getAlertTrends()
      // this.getAlertSummary()
      this.getTagTrend()
      this.getList()
    }
  },

  // 监听属性变动
  // watch: {
  //   period () {
  //     // this.getAlertTrends()
  //     // this.getAlertSummary()
  //     this.getTagTrend()
  //     this.getList()
  //   }
  // },

  methods: {
    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getList()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getList()
    },

    // 获取趋势与列表
    getData () {
      this.getTagTrend()
      this.getList()
    },
    // 获取告警趋势图表数据
    getTagTrend () {
      var begin
      var end
      if (this.period === '') {
        var startTimePick = uniformDate(this.startTimePick)
        var endTimePick = uniformDate(this.endTimePick)
        begin = startTimePick
        end = endTimePick
      } else {
        begin = this.beginTime
        end = this.endTime
      }
      // 获取标签'轻微'的趋势
      api.alert.getTagTrend(this.$route.params.product_id, '轻微', begin, end).then((res) => {
        if (res.status === 200) {
          this.light = res.data
          this.pushArr(this.light)
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 获取标签'通知'的趋势
      api.alert.getTagTrend(this.$route.params.product_id, '通知', begin, end).then((res) => {
        if (res.status === 200) {
          this.normal = res.data
          this.pushArr(this.normal)
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 获取标签'严重'的趋势
      api.alert.getTagTrend(this.$route.params.product_id, '严重', begin, end).then((res) => {
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
    },

    /**
     * 处理时间选择
     * @author shengzhi
     */
    onTimeChange (start, end) {
      this.startTime = start.getTime()
      this.endTime = end.getTime()
      this.getTagTrend()
      this.getList()
    },

    // 获取告警历史@author weijie
    getList () {
      this.loadingData = true
      // 先获取当前告警详情设备ID
      api.alert.getAlerts(this.queryCondition).then((res) => {
        if (res.status === 200) {
          // this.total = res.data.count
          // this.deviceID = res.data.list[0].from
          // this.productID = res.data.list[0].product_id
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
        }
      }).catch((res) => {
        this.loadingData = false
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
    },

    /**
     * 获取告警信息列表
     */
    getAlerts () {
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        if (res.status === 200) {
          // TODO
          // this.alerts = res.data.list
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
