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
            <select v-model="currentProduct" @change="getAlerts">
              <!-- <option :value="currentProduct">{{ currentProduct.name }}</option> -->
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-range-picker @timechange = "getAlertsSpecial"></date-time-range-picker>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="periods" :value.sync="period" @select="getAlerts"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <!-- <div class="panel">
      <div class="panel-bd">
        <div class="with-loading">
          <time-line :data="alertTrends"></time-line>
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>
    </div> -->
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
        <x-table :headers="headers" :selecting="selecting" @selected-change="selectChange" @tbody-content="getInfo" :tables="tables" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @theader-create-date="sortBy">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getAlerts" @search-deactivate="getAlerts" @search="getAlerts" @press-enter="getAlerts">
                  <v-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" @click="getAlerts" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <v-select width="90px" size="small" :label="visibility.label">
                <span slot="label">{{ $t('common.display') }}：</span>
                <select v-model="visibility" @change="getAlerts">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div slot="left-foot" v-show="showBatchBtn" class="row mt10">
            <label>标记为:</label>
            <button class="btn btn-ghost" @click="setDeal">已处理</button>
            <button class="btn btn-ghost" @click="setUnDeal">未处理</button>
          </div>
        </x-table>
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
import Table from 'components/Table'
import TimeLine from 'components/g2-charts/TimeLine'
import { globalMixins } from 'src/mixins'
import Mock from 'mockjs'
import { formatDate } from 'src/filters'
import dateFormat from 'date-format'

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
    'x-table': Table,
    SearchBox
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      currentProduct: {
        id: ''
      },
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
          total: 0,
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
      loadingData: false,
      startTimePick: '',
      endTimePick: '',
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: '设备ID', value: 'from' },
        { label: '告警内容', value: 'alert_name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      visibility: {
        label: '全部等级',
        value: 'all'
      },
      visibilityOptions: [
        { label: '全部等级', value: 'all' },
        { label: '通知', value: '通知' },
        { label: '轻微', value: '轻微' },
        { label: '重度', value: '重度' }
      ],
      headers: [{
        key: 'content',
        title: '告警内容'
      }, {
        key: 'mac',
        title: '设备MAC'
      }, {
        key: 'id',
        title: '设备ID'
      }, {
        key: 'create_date',
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
      }],
      showBatchBtn: false,
      dealList: [],
      selecting: true
    }
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

    // 分页信息
    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },

    // 查询条件
    queryCondition () {
      var condition = {}
      if (this.period === '') {
        condition = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {
            product_id: {
              $in: [this.currentProduct.id]
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
            product_id: {
              $in: [this.currentProduct.id]
            },
            create_date: {
              $lte: this.endTime + 'T00:00:00.000Z',
              $gte: this.beginTime + 'T00:00:00.000Z'
            }
          }
        }
      }
      // var condition = {
      //   limit: this.countPerPage,
      //   offset: (this.currentPage - 1) * this.countPerPage,
      //   order: {},
      //   query: {
      //     product_id: {
      //       $in: [this.currentProduct.id]
      //     },
      //     create_date: {
      //       $lte: this.endTime + 'T00:00:00.000Z',
      //       $gte: this.beginTime + 'T00:00:00.000Z'
      //     }
      //   }
      // }
      // if (this.key !== '') {
      //   condition.query.id = {$in: [this.key]}
      // }
      if (this.key.length > 0) {
        this.currentPage = 1
        condition.query[this.queryType.value] = this.queryType.value === 'from' ? { $in: [Number(this.key)] } : { $like: this.key }
      }

      switch (this.visibility.value) {
        case '通知':
          condition.query['tags'] = { $in: ['通知'] }
          break
        case '轻微':
          condition.query['tags'] = { $in: ['轻微'] }
          break
        case '重度':
          condition.query['tags'] = { $in: ['重度'] }
          break
        default:
      }

      this.headers.forEach((item) => {
        if (item.sortType) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
    },

    tables () {
      var result = []
      this.alerts.map((item) => {
        let levelCls = ({
          '中等': 'text-label-warning',
          '重度': 'text-label-danger'
        })[item.tags] || ''

        let alert = {
          content: '<a>' + item.alert_name + '</a>',
          mac: item.mac,
          create_date: formatDate(item.create_date),
          duration: item.lasting + 'h',
          id: item.from,
          level: `<div class="level level1 text-label ${levelCls}">${item.tags}</div>`,
          state: item.is_read ? '已处理' : '未处理',
          prototype: item
        }
        result.push(alert)
      })
      return result
    },

    TimePick () {
      var condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          product_id: {
            $in: [this.currentProduct.id]
          },
          create_date: {
            $gte: this.startTimePick,
            $lte: this.endTimePick
          }
        }
      }
      if (this.key !== '') {
        condition.query.id = {$in: [this.key]}
      }

      return condition
    },

    selectedProduct () {
      var product = this.currentProduct
      return product
    },

    beginTime () {
      var past = new Date().getTime() - this.period * 24 * 3600 * 1000
      return dateFormat('yyyy-MM-dd', new Date(past))
    },
    endTime () {
      var end = new Date().getTime()
      return dateFormat('yyyy-MM-dd', new Date(end))
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
      this.getFirstProduct()
      this.getSummary()
    }
  },

  // 监听属性变动
  watch: {
    products () {
      this.getFirstProduct()
      if (this.products.length > 0) {
        this.getAlerts()
      }
    }
  },

  methods: {
    // 获取第一个产品@author weijie
    getFirstProduct () {
      this.currentProduct = this.products[0] || {}
      // setTimeout(() => {
      //   this.getTagTrend()
      // }, 3000)
    },

    // 获取数据@author weijie
    getDate () {
      // console.log(123)
      console.log(this.beginTime)
      console.log(this.endTime)
      // this.getTagTrend()
    },

    // 获取告警概览@author weijie
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
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getAlerts()
    },

    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getAlerts()
    },

    /**
     * 按某个属性排序
     * @author shengzhi
     * @param  {Object} header 表头
     * @param  {Number} 索引
     */
    sortBy (header, index) {
      header.sortType = header.sortType * -1
      this.headers.$set(index, header)
      this.getAlerts()
    },
    getAlertsSpecial (start, end) {
      this.period = ''
      this.startTimePick = start
      this.endTimePick = end
      console.log(start + end)
      this.getAlerts()
    },
    // 获取消息列表@author weijie
    getAlerts () {
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        if (res.status === 200) {
          // console.log(res.data.list)
          // this.alerts = res.data.list
          this.total = res.data.count
          this.alerts = res.data.list.map((item) => {
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
        this.handleError(res)
        this.loadingData = false
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
    selectChange (table) {
      console.log(table)
      var result = []
      table.forEach((item) => {
        result.push(item.prototype)
      })
      // this.dealList = []
      this.dealList = result
      if (table.length > 0) {
        this.showBatchBtn = true
      } else {
        this.showBatchBtn = false
      }
    },
    // 标记为已处理
    setDeal () {
      var params = []
      this.dealList.forEach((item) => {
        params.push(item.id)
      })
      // var params = [this.$route.params.id]
      api.alert.setAlertRead(params).then((res) => {
        if (res.status === 200) {
          this.getAlerts()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 标记为未处理
    setUnDeal () {
      var params = []
      this.dealList.forEach((item) => {
        params.push(item.id)
      })
      // var params = [this.$route.params.id]
      api.alert.setAlertUnread(params).then((res) => {
        if (res.status === 200) {
          this.getAlerts()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 跳转详情信息
    getInfo (table, header, index) {
      console.log(table)
      this.$route.router.go('/operation/alerts/detail/' + table.prototype.id)
      // this.$route.router.go('/operation/alerts/record')
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
