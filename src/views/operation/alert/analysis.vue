<template>
  <div class="main">
    <div class="main-title">
      <h2>告警分析</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <v-select :label="currentProduct.name" width="110px" size="small">
            <span slot="label">产品</span>
            <select v-model="currentProduct" @change="getTagTrend">
              <!-- <option :value="currentProduct">{{ currentProduct.name }}</option> -->
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="filter-group fr">
        <!-- <div class="filter-group-item">
          <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
        </div> -->
        <div class="filter-group-item">
          <date-time-range-picker @timechange = "getSpecial"></date-time-range-picker>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="periods" :value.sync="period" @change="getTagTrend"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="">
      <time-line :data="trendData" :type="'smooth'"></time-line>
    </div>

    <div class="row statistic-group mb30 bt">
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
    <!-- <div class="panel no-split-line">
      <div class="panel-bd">
        <div class="with-loading">
          <time-line :data="alertTrends" :type="'smooth'"></time-line>
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>
    </div> -->

    <div class="panel">
      <!-- <div class="panel-hd panel-hd-full">
        <h2>级别分布</h2>
      </div> -->
      <div class="panel-bd">
        <nav class="tab">
          <ul>
            <li v-for="item in tabItems">
              <a @click="selectLevel($index)" :class="{'active':currIndex===$index}">{{ item }}</a>
            </li>
          </ul>
        </nav>
        <div class="row">
          <div class="col-10">
            <pie :data="warningLevel"></pie>
          </div>
          <div class="col-13 col-offset-1 data-table-wrap">
            <div class="data-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>{{levelTitle}}</th>
                    <th>数量</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="warningLevel.length > 0">
                    <tr v-for="item in warningLevel">
                      <td><a v-if="this.showlink===true" v-link="{ path: '/operation/alerts/analysis/' + item.id }">{{item.name}}</a><i v-else>{{item.name}}</i></td>
                      <td>{{item.value}}</td>
                      <td>{{ item.value/pieTotal |toPercentDecimal2 }}</td>
                    </tr>
                  </template>
                  <tr v-if="warningLevel.length === 0">
                    <td colspan="3"  class="tac">
                      <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
import api from 'api'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Pie from 'components/g2-charts/Pie'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import dateFormat from 'date-format'
import TimeLine from 'components/g2-charts/TimeLine'
import { globalMixins } from 'src/mixins'
import { uniformDate } from 'src/filters'
import Mock from 'mockjs'
import Statistic from 'components/Statistic'
import DateTimeRangePicker from 'components/DateTimeRangePicker'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    Pager,
    RadioButtonGroup,
    Statistic,
    'v-select': Select,
    DateTimeRangePicker,
    SearchBox,
    Pie,
    TimeLine
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      trendPieData: [],
      trendData: [],
      currentProduct: {},
      tabItems: ['全部', '轻度', '中度', '重度'],
      currIndex: 0,
      levelTitle: '告警',
      key: '',
      statistics: [],
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      alertTrends: [],
      today: dateFormat('yyyy-MM-dd', new Date()),
      loadingData: false,
      startTimePick: '',
      endTimePick: '',
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
      warningLevel: [],
      showlink: false,
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
      }
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
    beginTime () {
      var past = new Date().getTime() - this.period * 24 * 3600 * 1000
      return dateFormat('yyyy-MM-dd', new Date(past))
    },
    endTime () {
      var end = new Date().getTime()
      return dateFormat('yyyy-MM-dd', new Date(end))
    },

    pieTotal () {
      var all = 0
      this.trendPieData.forEach((item) => {
        all = all + item.value
      })
      return 100
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
        'count|+1': [6, 8, 9, 3, 9, 3, 9]
      }]
    }).list
  },

  route: {
    data () {
      this.getFirstProduct()
      this.getSummary()
      if (this.products.length > 0) {
        this.getTagTrend()
      }
    }
  },
  // 监听属性变动
  watch: {
    products () {
      this.getFirstProduct()
      if (this.products.length > 0) {
        this.getTagTrend()
      }
    }
  },

  methods: {
    // 获取第一个产品@author weijie
    getFirstProduct () {
      this.currentProduct = this.products[0] || {}
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

    // 获取单个标签趋势数据
    getSingleTag (productId, tag, begin, end) {
      // 获取标签'轻微'的趋势
      api.alert.getTagTrend(productId, tag, begin, end).then((res) => {
        if (res.status === 200) {
          if (tag === '轻微') {
            this.pushDayArr(this.light)
            this.pushAllArr(this.light)
          } else if (tag === '通知') {
            this.pushDayArr(this.normal)
            this.pushAllArr(this.normal)
          } else {
            this.pushDayArr(this.serious)
            this.pushAllArr(this.serious)
          }
        }
      }).catch((res) => {
        this.handleError(res)
      })
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
      this.getSingleTag(this.currentProduct.id, '轻微', begin, end)

      // 获取标签'通知'的趋势
      this.getSingleTag(this.currentProduct.id, '通知', begin, end)

      // 获取标签'严重'的趋势
      this.getSingleTag(this.currentProduct.id, '严重', begin, end)
    },

    // 处理标签每日数据
    pushDayArr (arr) {
      arr.data.forEach((item) => {
        var dayTotal = 0
        item.hours.forEach((message) => {
          dayTotal = dayTotal + message.message
        })
        this.trendData.push({
          day: item.day,
          data: dayTotal,
          product: item.name
        })
      })
    },

    // 处理标签总饼图概览数据
    pushAllArr (arr) {
      // this.trendPieData = []
      var total = 0
      arr.data.forEach((item) => {
        var dayTotal = 0
        item.hours.forEach((message) => {
          dayTotal = dayTotal + message.message
        })
        total = total + dayTotal
      })
      this.trendPieData.push({
        name: arr.name,
        value: total
      })
      this.warningLevel = this.trendPieData
    },

    // 处理单个标签下的饼图数据
    sortArr (arr) {
      arr.data.forEach((item) => {
      })
    },

    getSpecial (start, end) {
      this.period = ''
      this.startTimePick = start
      this.endTimePick = end
      this.getTagTrend()
    },

    selectLevel (index) {
      this.currIndex = index
      switch (index) {
        case 0:
          this.warningLevel = this.trendPieData
          this.showlink = false
          this.levelTitle = '告警'
          break
        case 1:
          this.warningLevel = [
            {
              id: 123,
              name: '异常下线',
              value: 10
            },
            {
              id: 123,
              name: '温度过高',
              value: 30
            },
            {
              id: 123,
              name: '风机异常',
              value: 20
            }
          ]
          this.showlink = true
          this.levelTitle = '轻微'
          break
        case 2:
          this.warningLevel = [
            {
              id: 123,
              name: '湿度超高',
              value: 10
            },
            {
              id: 123,
              name: '风机异常',
              value: 20
            }
          ]
          this.showlink = true
          this.levelTitle = '通常'
          break
        case 3:
          this.warningLevel = [
            {
              id: 123,
              name: '滤芯异常',
              value: 10
            },
            {
              id: 123,
              name: 'PM2.5超过指标',
              value: 30
            },
            {
              id: 123,
              name: 'CO2超过指标',
              value: 20
            },
            {
              id: 123,
              name: '电源异常',
              value: 20
            }
          ]
          this.showlink = true
          this.levelTitle = '严重'
          break
        default:

      }
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '../../../assets/stylus/common'
// tab
// 选项卡
.bt
  border-top 1px solid #d9d9d9
.tab
  margin 15px 0
  padding 0 15px
  border-bottom 1px solid default-border-color

  ul
    reset-list()
    font-size 0

  li
    display inline-block
    font-size 13px

    a
      display block
      padding 0 20px
      line-height 28px
      color gray

      &:hover
        text-decoration none
        color gray-darker

      &.active
        height 28px
        background-color #fff
        border 1px solid default-border-color
        border-bottom none!important
        position relative
        bottom -1px
        font-weight bold
</style>
