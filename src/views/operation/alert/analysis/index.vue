<template>
  <div class="main">
    <div class="main-title">
      <h2>告警分析</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select :label="currentProduct.name" width="110px" size="small">
            <span slot="label">产品</span>
            <select v-model="currentProduct" @change="changProduct">
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-multiple-picker @timechange = "getSpecial" :periods="periods" :default-period="defaultPeriod"></date-time-multiple-picker>
        </div>
      </div>
    </div>
    <div v-if="showHour" class="min-height">
      <time-line :data="trendData" :scale="scale"></time-line>
    </div>
    <div v-else class="min-height">
      <time-line :data="trendData" :scale="scale"></time-line>
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

    <nav class="tab">
      <ul>
        <li v-for="item in tabItems">
          <a @click="selectLevel($index)" :class="{'active':currIndex===$index}">{{ item }}</a>
        </li>
      </ul>
    </nav>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-10">
            <chart :options="labelOptions" :loading="loadingTagTrend" height="320px"></chart>
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
                      <td><a v-if="showlink===true" v-link="{ path: '/operation/alerts/analysis/' + item.id + '/' + this.currentProduct.id }" :class="{'hl-red': showlink}">{{item.name}}</a><i v-else>{{item.name}}</i></td>
                      <td>{{item.value || 0}}</td>
                      <td>{{ item.percent | toPercentage }}</td>
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
import Chart from 'components/Chart/index'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import TimeLine from 'components/g2-charts/TimeLine'
import { globalMixins } from 'src/mixins'
import formatDate from 'filters/format-date'
import Statistic from 'components/Statistic'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import _ from 'lodash'
import locales from 'consts/locales/index'
import Vue from 'vue'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    Pager,
    RadioButtonGroup,
    Statistic,
    'x-select': Select,
    DateTimeMultiplePicker,
    SearchBox,
    TimeLine,
    Chart
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      // 轻微告警规则列表
      lightRules: [],
      // 通知告警规则列表
      normalRules: [],
      // 严重告警规则列表
      seriousRules: [],
      recvDataCount: 0,
      showHour: true,
      tempTrendData: [],
      trendPieData: [],
      trendData: [],
      currentProduct: {},
      tabItems: ['全部'].concat(locales[Vue.config.lang].data.RULE_CANDIDATE_TAGS),
      currIndex: 0,
      levelTitle: '告警',
      key: '',
      statistics: [],
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      startTimePick: '',
      endTimePick: '',
      periods: [1, 7, 30],
      warningLevel: [],
      showlink: false,
      defaultPeriod: 7,
      alertSummary: {
        unread: {
          title: '待处理告警',
          total: '--',
          change: 0
        },
        today: {
          title: '今日告警',
          total: '--',
          change: 0
        },
        week: {
          title: '7天告警数',
          total: '--',
          change: 0
        },
        month: {
          title: '30天告警数',
          total: '--',
          change: 0
        }
      },
      serious: {
        name: locales[Vue.config.lang].data.ALERT_LEVELS.red,
        data: []
      },
      normal: {
        name: locales[Vue.config.lang].data.ALERT_LEVELS.blue,
        data: []
      },
      light: {
        name: locales[Vue.config.lang].data.ALERT_LEVELS.orange,
        data: []
      },
      scale: 'hour', // 折线图默认以小时显示
      loadingTagTrendCount: 0,
      loadingTagTrend: false,
      loadingAlertList: false
    }
  },

  computed: {
    queryCondition () {
      return {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage
      }
    },

    // 告警图表配置
    labelOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          y: 10,
          data: _.map(this.warningLevel, 'name')
        },
        series: [{
          name: '数量',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.warningLevel,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    }
  },

  ready () {
    if (this.products.length > 0) {
      this.getFirstProduct()
      this.getSummary()
      this.getTagTrend()
      this.getAlertList()
    }
  },

  route: {
    data () {
    }
  },
  // 监听属性变动
  watch: {
    products () {
      if (this.products.length > 0) {
        this.getFirstProduct() // 设置产品列表第一个为当前产品
        this.getSummary()
        this.getTagTrend()
        this.getAlertList()
      }
    }
  },

  methods: {
    // 切换产品时执行
    changProduct () {
      this.getSummary()
      this.getTagTrend()
      this.trendPieData = []
      this.lightRules = []
      this.normalRules = []
      this.seriousRules = []
      this.currIndex = 0
      this.getAlertList()
      this.warningLevel = []
    },
    // 获取第一个产品@author weijie
    getFirstProduct () {
      this.currentProduct = this.products[0] || {}
    },
    getUnreadCount (start, end) {
      let beginTime = formatDate(start, 'yyyy-MM-dd', true)
      let endTime = formatDate(end, 'yyyy-MM-dd', true)
      api.statistics.getProductAlertSummary(this.currentProduct.id, beginTime, endTime).then((res) => {
        if (res.status === 200) {
          this.alertSummary.unread.total = res.data.unread
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 获取告警概览@author weijie
    getSummary () {
      const MILLISECONDS_PER_DAY = 24 * 3600 * 1000
      var weekBeginTime = new Date().getTime() - 7 * MILLISECONDS_PER_DAY
      weekBeginTime = formatDate(weekBeginTime, 'yyyy-MM-dd', true)
      var monthBeginTime = new Date().getTime() - 30 * MILLISECONDS_PER_DAY
      monthBeginTime = formatDate(monthBeginTime, 'yyyy-MM-dd', true)
      var now = new Date().getTime() - MILLISECONDS_PER_DAY
      now = formatDate(now, 'yyyy-MM-dd', true)

      // 获取7天数据
      api.statistics.getProductAlertSummary(this.currentProduct.id, weekBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.unread.total = res.data.unread
          this.alertSummary.today.total = res.data.add_today
          this.alertSummary.week.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // 获取30天数据
      api.statistics.getProductAlertSummary(this.currentProduct.id, monthBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.alertSummary.month.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 获取单个标签趋势数据
    getSingleTag (productId, tag, begin, end, beginHour, endHour) {
      api.alert.getTagTrend(productId, tag, begin, end, beginHour, endHour).then((res) => {
        this.loadingTagTrendCount++
        if (this.loadingTagTrendCount === 3) {
          this.loadingTagTrend = false
        }
        if (res.status === 200) {
          if (tag === this.locales.data.ALERT_LEVELS.blue) {
            this.light = res.data
            this.pushDayArr(this.light, tag)
            this.pushAllArr(this.light, tag)
          } else if (tag === this.locales.data.ALERT_LEVELS.orange) {
            this.normal = res.data
            this.pushDayArr(this.normal, tag)
            this.pushAllArr(this.normal, tag)
          } else if (tag === this.locales.data.ALERT_LEVELS.red) {
            this.serious = res.data
            this.pushDayArr(this.serious, tag)
            this.pushAllArr(this.serious, tag)
          }
        }
      }).catch((res) => {
        this.loadingTagTrendCount++
        if (this.loadingTagTrendCount === 3) {
          this.loadingTagTrend = false
        }
        this.handleError(res)
      })
    },

    // 获取告警趋势图表数据
    getTagTrend () {
      if (this.loadingTagTrend) {
        return
      }
      this.loadingTagTrend = true
      this.loadingTagTrendCount = 0
      this.recvDataCount = 0
      this.warningLevel = []
      this.trendPieData = []
      let beginHour = null
      let endHour = null
      if (this.endTimePick.getTime() - this.startTimePick.getTime() <= 3600 * 1000 * 24) {
        beginHour = this.startTimePick.getHours()
        endHour = this.endTimePick.getHours()
      } else {
        beginHour = '00'
        endHour = '24'
      }
      let begin = formatDate(this.startTimePick, 'yyyy-MM-dd', true)
      let end = formatDate(this.endTimePick, 'yyyy-MM-dd', true)

      locales[Vue.config.lang].data.RULE_CANDIDATE_TAGS.forEach((item) => {
        this.getSingleTag(this.currentProduct.id, item, begin, end, beginHour, endHour)
      })
    },

    // 处理标签每日数据
    pushDayArr (arr, tag) {
      if (this.recvDataCount === 0) {
        this.tempTrendData = []
      }
      this.recvDataCount++
      var rearr = []
      if (this.scale === 'hour') {
        arr.forEach((item) => {
          var i = 0
          while (i < item.hours.length) {
            rearr.push({
              date: item.day + ' ' + item.hours[i].hour + ':00:00',
              val: item.hours[i].message,
              name: tag
            })
            i++
          }
        })
      } else {
        arr.forEach((item) => {
          var i = 0
          var sum = 0
          while (i < item.hours.length) {
            sum = sum + item.hours[i].message
            i++
          }
          rearr.push({
            date: item.day,
            val: sum,
            name: tag
          })
        })
      }

      if (rearr.length > 0) {
        rearr.forEach((newobj) => {
          this.tempTrendData.push(newobj)
        })
      }

      // 数据接收完毕
      if (this.recvDataCount === 3) {
        if (this.scale === 'hour') {
          this.showHour = true
        } else {
          this.showHour = false
        }
        this.trendData = this.tempTrendData
      }
    },

    // 处理标签总饼图概览数据
    pushAllArr (arr, tag) {
      let total = 0
      let j = 0
      while (j < arr.length) {
        let sum = 0
        let i = 0
        while (i < arr[j].hours.length) {
          sum += arr[j].hours[i].message
          i++
        }
        total += sum
        j++
      }
      if (total !== 0) {
        this.trendPieData.push({
          name: tag,
          value: total
        })
      }

      // 数据接收完毕
      if (this.recvDataCount === 3) {
        this.trendPieData = this.numToPercent(this.trendPieData, 'value')
        if (this.currIndex === 0) {
          this.selectLevel(this.currIndex)
        }
      }
    },

    // 处理单个标签下的饼图数据
    sortArr (arr, tag) {
      let beginHour = null
      let endHour = null
      if (this.endTimePick.getTime() - this.startTimePick.getTime() <= 3600 * 1000 * 24) {
        beginHour = this.startTimePick.getHours()
        endHour = this.endTimePick.getHours()
      } else {
        beginHour = '00'
        endHour = '24'
      }
      let begin = formatDate(this.startTimePick, 'yyyy-MM-dd', true)
      let end = formatDate(this.endTimePick, 'yyyy-MM-dd', true)

      // 遍历处理每个标签数组里对应的告警规则数据
      var count = 0
      arr.forEach((item) => {
        if (item.length === 0) {
          arr.remove(item)
        } else {
          // 每个告警规则调用接口获取趋势数据
          api.alert.getTagRuleTrend(this.currentProduct.id, item.tag, item.id, begin, end, beginHour, endHour).then((res) => {
            if (res.status === 200) {
              var i = 0
              var sum = 0
              var total = 0
              res.data.forEach((alert) => {
                sum = 0
                i = 0
                while (i < alert.hours.length) {
                  sum = sum + alert.hours[i].message
                  i++
                }
                total = total + sum
              })
              item.value = total
              count++
              if (count === arr.length) {
                // 处理数组，去除不必要的属性，只留下name与value属性
                this.handleArr(arr, tag)
              }
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      })
    },
    handleArr (arr, tag) {
      // 如果数据为0,不处理
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].value) {
          arr.splice(i, 1)
          i--
        }
      }

      // 由大到小排序
      arr.sort((a, b) => {
        if (a.value > b.value) {
          return -1
        } else if (a.value < b.value) {
          return 1
        } else {
          return 0
        }
      })

      if (arr.length > 10) {
        this.numToPercent(arr.slice(0, 10), 'value')
      } else {
        this.numToPercent(arr, 'value')
      }

      this.selectLevel(this.currIndex)
    },

    numToPercent (arr, field) {
      var total = 0
      arr.forEach((item) => {
        total += item[field]
      })

      arr.map((item) => {
        item.percent = item[field] / total
      })
      return arr
    },
    // 获取告警规则列表
    getAlertList () {
      if (this.loadingAlertList) {
        return
      }
      this.loadingAlertList = true
      this.lightRules = []
      this.normalRules = []
      this.seriousRules = []
      api.alert.getRules(this.currentProduct.id).then((res) => {
        this.loadingAlertList = false
        if (res.status === 200) {
          res.data.forEach((item) => {
            if (item.tag === locales[Vue.config.lang].data.ALERT_LEVELS.blue) {
              this.lightRules.push({
                name: item.name,
                id: item.id,
                tag: locales[Vue.config.lang].data.ALERT_LEVELS.blue
              })
            } else if (item.tag === locales[Vue.config.lang].data.ALERT_LEVELS.orange) {
              this.normalRules.push({
                name: item.name,
                id: item.id,
                tag: locales[Vue.config.lang].data.ALERT_LEVELS.orange
              })
            } else if (item.tag === locales[Vue.config.lang].data.ALERT_LEVELS.red) {
              this.seriousRules.push({
                name: item.name,
                id: item.id,
                tag: locales[Vue.config.lang].data.ALERT_LEVELS.red
              })
            }
          })
          this.sortArr(this.lightRules, locales[Vue.config.lang].data.ALERT_LEVELS.blue)
          this.sortArr(this.normalRules, locales[Vue.config.lang].data.ALERT_LEVELS.orange)
          this.sortArr(this.seriousRules, locales[Vue.config.lang].data.ALERT_LEVELS.red)
        }
      }).catch((res) => {
        this.loadingAlertList = false
        this.handleError(res)
      })
    },

    getSpecial (start, end) {
      this.startTimePick = start
      this.endTimePick = end
      if (end.getTime() - start.getTime() > 3600 * 1000 * 24) {
        this.scale = 'day'
      } else {
        this.scale = 'hour'
      }

      if (this.products.length > 0) {
        if (!this.currentProduct.id) {
          this.getFirstProduct()
        }
        this.getTagTrend()
        this.getAlertList()
        this.getUnreadCount(start, end)
      }
    },

    selectLevel (index) {
      this.currIndex = index
      switch (index) {
        case 0:
          this.warningLevel = this.trendPieData
          this.showlink = false
          this.levelTitle = '全部'
          break
        case 1:
          this.warningLevel = this.seriousRules
          this.showlink = true
          this.levelTitle = locales[Vue.config.lang].data.ALERT_LEVELS.red
          break
        case 2:
          this.warningLevel = this.normalRules
          this.showlink = true
          this.levelTitle = locales[Vue.config.lang].data.ALERT_LEVELS.orange
          break
        case 3:
          this.warningLevel = this.lightRules
          this.showlink = true
          this.levelTitle = locales[Vue.config.lang].data.ALERT_LEVELS.blue
          break
        default:

      }
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '../../../../assets/stylus/common'
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
.min-height
  height 250px
  overflow hidden
</style>
