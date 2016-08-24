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
          <date-time-multiple-picker @timechange = "getSpecial" :periods="periods"></date-time-multiple-picker>
        </div>
      </div>
    </div>
    <div v-if="showHour">
      <time-line :data="trendData" :scale="scale"></time-line>
    </div>
    <div v-else>
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

    <div class="panel">
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
                      <td><a v-if="this.showlink===true" v-link="{ path: '/operation/alerts/analysis/' + item.id + '/' + this.currentProduct.id }">{{item.name}}</a><i v-else>{{item.name}}</i></td>
                      <td>{{item.value || 0}}</td>
                      <td>{{ item.percent | toPercentDecimal 2 }}</td>
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
import Statistic from 'components/Statistic'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'

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
    Pie,
    TimeLine
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
      tabItems: ['全部', '轻微', '通知', '严重'],
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
      },
      scale: 'hour' // 折线图默认以小时显示
    }
  },

  computed: {
    queryCondition () {
      return {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage
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

      api.statistics.getProductAlertSummary(this.currentProduct.id).then((res) => {
        if (res.status === 200) {
          this.alertSummary.unread.total = res.data.unread
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // TODO 接口字段缺失 需要产品下统计概览数据 显示获取的全局的数据
      // 获取当天数据
      api.statistics.getAlertSummary(todayBeginTime, now).then((res) => {
        if (res.status === 200) {
          // this.alertSummary.unread.total = res.data.unread
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
    getSingleTag (productId, tag, begin, end, beginHour, endHour) {
      // 获取标签'轻微'的趋势
      api.alert.getTagTrend(productId, tag, begin, end, beginHour, endHour).then((res) => {
        if (res.status === 200) {
          if (tag === '轻微') {
            this.light = res.data
            this.pushDayArr(this.light)
            this.pushAllArr(this.light, tag)
          } else if (tag === '通知') {
            this.normal = res.data
            this.pushDayArr(this.normal)
            this.pushAllArr(this.normal, tag)
          } else {
            this.serious = res.data
            this.pushDayArr(this.serious)
            this.pushAllArr(this.serious, tag)
          }
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 获取告警趋势图表数据
    getTagTrend () {
      this.recvDataCount = 0
      this.warningLevel = []
      this.trendPieData = []
      let begin = uniformDate(this.startTimePick)
      let beginHour = this.startTimePick.getHours()
      let end = uniformDate(this.endTimePick)
      let endHour = this.endTimePick.getHours()

      // 获取标签'轻微'的趋势
      this.getSingleTag(this.currentProduct.id, '轻微', begin, end, beginHour, endHour)

      // 获取标签'通知'的趋势
      this.getSingleTag(this.currentProduct.id, '通知', begin, end, beginHour, endHour)

      // 获取标签'严重'的趋势
      this.getSingleTag(this.currentProduct.id, '严重', begin, end, beginHour, endHour)
    },

    // 处理标签每日数据
    pushDayArr (arr) {
      if (this.recvDataCount === 0) {
        this.tempTrendData = []
      }
      this.recvDataCount++
      var rearr = []
      var name = ''
      if (arr === this.normal) {
        name = '通知'
      } else if (arr === this.serious) {
        name = '严重'
      } else {
        name = '轻微'
      }
      if (this.scale === 'hour') {
        arr.forEach((item) => {
          var i = 0
          while (i < item.hours.length) {
            rearr.push({
              date: item.day + ' ' + item.hours[i].hour + ':00:00',
              val: item.hours[i].message,
              name: name
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
            name: name
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
    sortArr (arr) {
      let begin = uniformDate(this.startTimePick)
      let beginHour = this.startTimePick.getHours()
      let end = uniformDate(this.endTimePick)
      let endHour = this.endTimePick.getHours()

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
                this.handleArr(arr)
              }
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      })
    },
    // 处理数组，去除不必要的属性，只留下name与value属性
    handleArr (arr) {
      arr.forEach((item) => {
        delete item.tag
      })
      this.sortRegion(arr)
    },

    sortRegion (arr) {
      // 如果数据为0,不处理
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].value) {
          arr = arr.splice(i, 1)
        }
      }
      console.log(arr)
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
      this.lightRules = []
      this.normalRules = []
      this.seriousRules = []
      api.alert.getRules(this.currentProduct.id).then((res) => {
        if (res.status === 200) {
          res.data.forEach((item) => {
            if (item.tag === '轻微') {
              this.lightRules.push({
                name: item.name,
                id: item.id,
                tag: '轻微'
              })
            } else if (item.tag === '通知') {
              this.normalRules.push({
                name: item.name,
                id: item.id,
                tag: '通知'
              })
            } else {
              this.seriousRules.push({
                name: item.name,
                id: item.id,
                tag: '严重'
              })
            }
          })
          this.sortArr(this.lightRules)
          this.sortArr(this.normalRules)
          this.sortArr(this.seriousRules)
        }
      }).catch((res) => {
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
      }
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
          this.warningLevel = this.lightRules
          this.showlink = true
          this.levelTitle = '轻微'
          break
        case 2:
          this.warningLevel = this.normalRules
          this.showlink = true
          this.levelTitle = '通知'
          break
        case 3:
          this.warningLevel = this.seriousRules
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
</style>
