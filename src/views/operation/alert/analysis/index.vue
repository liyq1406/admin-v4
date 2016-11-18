<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.alert.analysis.title')}}</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-multiple-picker :periods="periods" @timechange="onTimeChange" :default-period="defaultPeriod"></date-time-multiple-picker>
        </div>
      </div>
      <div class="filter-group">
        <div class="filter-group-item">
          <x-select :label="selectedProduct.name" width="110px" size="small">
            <span slot="label">{{ $t('operation.alert.analysis.product')}}</span>
            <select v-model="selectedProduct" @change="onProductSelect">
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </x-select>
        </div>
      </div>
    </div>

    <div class="mb20 mt20">
      <chart :options="trendOptions" :loading="loadingTrend"></chart>
    </div>

    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :total="summary.unread.total" :change="summary.unread.change" :title="summary.unread.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.today.total" :change="summary.today.change" :title="summary.today.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.week.total" :change="summary.week.change" :title="summary.week.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.month.total" :change="summary.month.change" :title="summary.month.title" align="left"></statistic>
      </div>
    </div>

    <!-- <nav class="tab">
      <ul>
        <li v-for="item in tabItems">
          <a @click="onTabSelect(item)" :class="{'active':currTag===item}">{{ item }}</a>
        </li>
      </ul>
    </nav> -->
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-10">
            <chart :options="tagOptions" :loading="loadingTagData" height="320px"></chart>
          </div>
          <div class="col-13 col-offset-1 data-table-wrap">
            <div class="data-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>{{currTag}}</th>
                    <th class="wp20">{{ $t('operation.alert.analysis.number')}}</th>
                    <th class="wp15">{{ $t('operation.alert.analysis.percent')}}</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="ruleData.length > 0">
                    <tr v-for="item in ruleData">
                      <td>
                        <a v-if="tabItems.length && currTag!==tabItems[0]" v-link="{ path: '/operation/alerts/analysis/' + item.id + '/' + this.selectedProduct.id }" class="hl-red">{{item.name}}</a>
                        <span v-else>{{item.name}}</span>
                      </td>
                      <td>{{item.value || 0}}</td>
                      <td>{{calPercentage(item.value, ruleData) | toPercentage}}</td>
                    </tr>
                  </template>
                  <tr v-if="ruleData.length === 0">
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
import api from 'api'
import Chart from 'components/Chart/index'
import formatDate from 'filters/format-date'
import { patchLostDates } from 'utils'

export default {
  name: 'Analysis',
  components: {
    Chart
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      tags: [],
      defaultPeriod: 7, // 默认日期间隔
      periods: [1, 7, 30], // 可选时间间隔
      scale: 'day', // 时间衡量
      selectedProduct: {}, // 当前选择产品
      startTime: null, // 起始时间
      endTime: null, // 结束时间
      trend: {
        xAxis: [],
        series: []
      },
      trendCount: 0,
      ruleCount: 0,
      ruleTotal: 0,
      summary: {
        unread: {
          title: this.$t('operation.alert.analysis.untreated'),
          total: 0,
          change: 0
        },
        today: {
          title: this.$t('operation.alert.analysis.today_add'),
          total: 0,
          change: 0
        },
        week: {
          title: this.$t('operation.alert.analysis.sevent_add'),
          total: 0,
          change: 0
        },
        month: {
          title: this.$t('operation.alert.analysis.thirty_add'),
          total: 0,
          change: 0
        }
      },
      tabItems: [],
      currTag: '',
      tagData: {}
    }
  },

  computed: {
    // 是否正在加载趋势数据
    loadingTrend () {
      return this.trendCount < this.tags.length
    },

    // 是否正在加载标签数据
    loadingTagData () {
      return this.ruleCount < this.ruleTotal
    },

    // 图例
    legend () {
      return _.map(this.trend.series, 'name')
    },

    // 趋势图表配置
    trendOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 80,
          y: 32,
          x2: 15,
          y2: 30
        },
        legend: {
          y: 5,
          data: this.legend
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: this.trend.xAxis
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        series: this.trend.series
      }
    },

    // 规则数据
    ruleData () {
      let result = []

      if (!this.currTag) {
        return []
      }

      if (this.currTag === this.tabItems[0]) {
        result = _.map(this.trend.series, (item) => {
          let sum = _.sum(item.data)
          return {
            name: item.name,
            value: sum
          }
        })
        // this.trend.series.forEach()
        // for (var key in this.tagData) {
        //   let sum = _.sum(_.map(this.tagData[key], 'value'))
        //   result.push({
        //     name: key,
        //     value: sum
        //   })
        // }
      } else {
        result = this.tagData[this.currTag]
      }

      // 由大到小排序
      result = _.reverse(_.sortBy(result, ['value']))
      return result
    },

    // 告警图表配置
    tagOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          y: 10,
          data: _.map(this.ruleData, 'name')
        },
        series: [{
          name: this.$t('operation.alert.analysis.number'),
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.ruleData,
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

  watch: {
    products () {
      this.getTags()
    }
  },

  route: {
    data () {
      this.getTags()
    }
  },

  methods: {
    getTags () {
      api.alert.getAlertTags().then((res) => {
        if (res.status === 200) {
          this.tags = res.data.tags
          this.init()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * 初始化
     */
    init () {
      // 选项卡数据
      this.tabItems = [this.locales.common.all].concat(this.tags)

      // 当前标签
      this.currTag = this.tabItems[0]

      // 初始化标签数据
      this.initTagData()

      if (this.products.length) {
        this.selectedProduct = this.products[0]
        this.getUnread()
        this.getStatistic()
        this.getTagTrend()
        this.getTagRuleTrend()
      }
    },

    /**
     * 初始化标签数据
     */
    initTagData () {
      let data = {}
      this.tags.forEach((tag) => {
        data[tag] = []
      })
      this.tagData = data
    },

    /**
     * 获取统计数据
     * @author shengzhi
     * @param {String} begin 起始日期
     * @param {String} end 结束日期
     * @return {Promise}
     */
    _getSummary (begin, end) {
      return api.statistics.getProductAlertSummary(this.selectedProduct.id, begin, end)
    },

    /**
     * 获取待处理告警
     */
    getUnread () {
      if (!this.products.length) return

      let beginTime = formatDate(this.startTime, 'yyyy-MM-dd', true)
      let endTime = formatDate(this.endTime, 'yyyy-MM-dd', true)

      this._getSummary(beginTime, endTime).then((res) => {
        if (res.status === 200) {
          this.summary.unread.total = res.data.unread
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取今日、7天和30天的统计数据
     */
    getStatistic () {
      if (!this.products.length) return

      const MILLISECONDS_PER_DAY = 24 * 3600 * 1000
      var weekBeginTime = new Date().getTime() - 7 * MILLISECONDS_PER_DAY
      weekBeginTime = formatDate(weekBeginTime, 'yyyy-MM-dd', true)
      var monthBeginTime = new Date().getTime() - 30 * MILLISECONDS_PER_DAY
      monthBeginTime = formatDate(monthBeginTime, 'yyyy-MM-dd', true)
      var now = new Date().getTime() - MILLISECONDS_PER_DAY
      now = formatDate(now, 'yyyy-MM-dd', true)

      // 获取7天数据
      this._getSummary(weekBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.summary.today.total = res.data.add_today
          this.summary.week.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 获取30天数据
      this._getSummary(monthBeginTime, now).then((res) => {
        if (res.status === 200) {
          this.summary.month.total = res.data.message
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取告警趋势图表数据
     * @author weijie
     */
    getTagTrend () {
      if (!this.products.length) return

      if (this.startTime === null || this.endTime === null) return

      let begin = formatDate(this.startTime, 'yyyy-MM-dd', true)
      let beginHour = this.startTime.getHours()
      let end = formatDate(this.endTime, 'yyyy-MM-dd', true)
      let endHour = this.endTime.getHours()

      if (this.scale !== 'hour') {
        beginHour = 0
        endHour = 24
      }

      let xAxis = []
      let series = []
      const TAGS = this.tags

      this.trendCount = 0
      for (let i = 0, len = TAGS.length; i < len; i++) {
        ((index) => {
          api.alert.getTagTrend(this.selectedProduct.id, TAGS[index], begin, end, beginHour, endHour).then((res) => {
            if (res.status !== 200) {
              return
            }
            if (this.scale === 'hour') {
              let data = []
              _.forEach(res.data, (item) => {
                var i = 0
                while (i < item.hours.length) {
                  data.push({
                    day: item.day + ' ' + item.hours[i].hour + ':00',
                    value: item.hours[i].message
                  })
                  i++
                }
              })

              let yesterday = new Date().getTime() - 24 * 3600 * 1000
              yesterday = formatDate(yesterday, 'yyyy-MM-dd hh', true) + ':00'
              data = patchLostDates(data, yesterday, 24, ['value'], 'hour')
              if (!xAxis.length) {
                xAxis = _.map(data, 'day')
              }
              series.push({
                name: TAGS[index],
                type: 'line',
                data: _.map(data, 'value')
              })
            } else {
              let data = res.data.map((item) => {
                // 算出某天告警总数
                let sum = _.sum(_.map(item.hours, 'message'))
                return {
                  day: item.day,
                  value: sum
                }
              })
              data = patchLostDates(data, begin, end, ['value'])
              if (!xAxis.length) {
                xAxis = _.map(data, 'day')
              }
              series.push({
                name: TAGS[index],
                type: 'line',
                data: _.map(data, 'value')
              })
            }
            this.trendCount++
            this.trend.series = series
            this.trend.xAxis = xAxis
          }).catch((res) => {
            this.handleError(res)
          })
        })(i)
      }
    },

    /**
     * 处理产品选择
     */
    onProductSelect () {
      this.getUnread()
      this.getStatistic()
      this.getTagTrend()
      this.getTagRuleTrend()
    },

    /**
     * 处理时间选择
     * @author shengzhi
     * @param {Date} start 开始时间
     * @param {Date} end  结束时间
     * @return null
     */
    onTimeChange (start, end) {
      this.startTime = start
      this.endTime = end
      if (end.getTime() - start.getTime() > 3600 * 1000 * 24) {
        this.scale = 'day'
      } else {
        this.scale = 'hour'
      }

      this.getUnread()
      this.getTagTrend()
      this.getTagRuleTrend()
    },

    /**
     * 处理选项卡切换
     * @author shengzhi
     * @param {String} tab 选项卡名称
     * @return {void}
     */
    onTabSelect (tab) {
      this.currTag = tab
    },

    /**
     * 获取标签规则趋势数据
     * 获取产品的告警规则列表，选出其中的带有严重、轻微和通知规则，每个告警规则调用接口获取趋势数据
     */
    getTagRuleTrend () {
      if (!this.products.length) return

      if (this.startTime === null || this.endTime === null) return

      let begin = formatDate(this.startTime, 'yyyy-MM-dd', true)
      let beginHour = this.startTime.getHours()
      let end = formatDate(this.endTime, 'yyyy-MM-dd', true)
      let endHour = this.endTime.getHours()

      if (this.scale !== 'hour') {
        beginHour = 0
        endHour = 24
      }

      this.ruleCount = 0
      this.ruleTotal = 0
      // 获取产品的告警规则列表
      api.alert.getRules(this.selectedProduct.id).then((res) => {
        // 按 tag 分组
        let ruleGroups = _.groupBy(res.data, 'tag')

        // 选出只在 this.locales.data.RULE_CANDIDATE_TAGS 中定义的标签规则
        ruleGroups = _.pick(ruleGroups, this.tags)

        return ruleGroups
      }).then((groups) => {
        if (!groups.length) {
          this.initTagData()
        }
        for (var key in groups) {
          let data = []
          let rules = groups[key]
          this.ruleTotal += rules.length
          for (let i = 0, len = rules.length; i < len; i++) {
            ((index) => {
              // 每个告警规则调用接口获取趋势数据
              api.alert.getTagRuleTrend(this.selectedProduct.id, rules[i].tag, rules[i].id, begin, end, beginHour, endHour).then((res) => {
                this.ruleCount++
                if (!res.data.length) return

                let sum = 0
                _.forEach(res.data, (item) => {
                  sum += _.sum(_.map(item.hours, 'message'))
                })
                data.push({
                  name: rules[i].name,
                  value: sum,
                  id: rules[i].id
                })
              })
            })(i)
          }
          this.tagData[key] = data
        }
      })
    },

    /**
     * 计算占比
     * @author shengzhi
     * @param {Number} val 数据
     * @param {Array} items 所有数据
     */
    calPercentage (val, items) {
      let result = 0
      let sum = _.sum(_.map(items, 'value'))

      if (sum) {
        result = val / sum
      }

      return result
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '../../../../assets/stylus/common'

// 选项卡
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
