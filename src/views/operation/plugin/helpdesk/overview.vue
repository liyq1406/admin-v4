<template>
  <div class="main">
    <div class="main-title">
      <h2>用户反馈 </h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select :label="product.label" width="110px" size="small">
            <span slot="label">产品</span>
            <select v-model="product" @change="productSelect">
              <option v-for="selectProduct in selectOptions" :value="selectProduct">{{ selectProduct.label }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item fr">
          <date-time-multiple-picker @timechange="timeFilter" :periods="periods" :default-period="defaultPeriod"></date-time-multiple-picker>
        </div>
      </div>
    </div>
    <div class="panel mt20">
      <div class="panel-hd panel-hd-full bordered">
        <h2>趋势</h2>
      </div>
      <div class="panel-bd min-height">
        <template v-if="repaint">
          <time-line :data="lineData"></time-line>
        </template>
      </div>
    </div>
    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :info="summary.total" :title="summary.total.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="summary.untreatedTotal" :title="summary.untreatedTotal.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="summary.weekAdded" :title="summary.weekAdded.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="summary.monthAdded" :title="summary.monthAdded.title" align="left"></statistic>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd panel-hd-full bordered">
        <h2>分布</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-9">
            <pie :data="pieData" :height="350" :margin="customPieMargin"></pie>
          </div>
          <div class="col-14 col-offset-1 data-table-wrap" style="min-height: 350px">
            <div class="data-table" v-if="feedbacks.length > 0">
              <table class="table">
                <thead>
                  <tr>
                    <th>标题</th>
                    <th>未处理</th>
                    <th>已处理</th>
                    <th>全部</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in feedbacks">
                    <td>{{item.label}}</td>
                    <td>{{item.untreatedCount}} ({{item.untreatedPercent || ''}} %)</td>
                    <td>{{item.treatedCount}} ({{item.treatedPercent || ''}} %)</td>
                    <td>{{item.Count}}</td>
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
// import Vue from 'vue'
// import locales from 'consts/locales/index'
import api from 'api'
import Statistic from 'components/Statistic'
import TimeLine from 'components/g2-charts/TimeLine'
import Pie from 'components/g2-charts/Pie'
import Select from 'components/Select'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../mixins'
import {getLastYearDate} from 'utils'

export default {
  name: 'Overview',

  mixins: [globalMixins, pluginMixins],

  components: {
    'x-select': Select,
    Pie,
    DateTimeMultiplePicker,
    Statistic,
    TimeLine
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      repaint: true,
      product: {
        label: '全部'
      },
      defaultPeriod: 30,
      customPieMargin: [20, 0, 0, 0],
      feedbacks: [],
      summary: {
        total: {
          total: 0,
          title: '反馈数'
        },
        untreatedTotal: {
          total: 0,
          title: '待处理'
        },
        weekAdded: {
          total: 0,
          title: '7天新增'
        },
        monthAdded: {
          total: 0,
          title: '30天新增'
        }
      },
      // 时间间隔
      periods: [7, 30, 90],

      // 数据是否加载中
      loadingData: false,
      pieData: [],
      lineData: [],
      startTime: null,
      endTime: null
    }
  },

  computed: {
    selectOptions () {
      if (this.products.length > 0) {
        var res = [{
          id: '',
          label: '全部'
        }]
        this.products.forEach((item) => {
          let temp = {
            id: item.id,
            label: item.name
          }
          res.push(temp)
        })
        return res
      } else {
        return []
      }
    },
    groupQueryCondition () {
      var params = null
      if (this.product && this.product.id !== '') {
        if (!params) {
          params = {}
          params.query = {}
        }
        params.query.product_id = this.product.id
      }

      if (this.startTime && this.endTime) {
        if (!params) {
          params = {}
          params.query = {}
        }
        params.query.create_time = {$gte: {'@date': this.startTime}, $lte: {'@date': this.endTime}}
      }

      return params
    }
  },

  ready () {
    // REVIEW 路由切换到用户反馈概览，页面就退出到登录页 插件接口显示token失效 #guohao
  },

  watch: {
    products () {
      if (this.products.length > 0) {
        this.getFeedbackList()
      }
    }
  },

  methods: {
    getFeedbackList () {
      api.helpdesk.getFeedbackGroup(this.$route.params.app_id, this.groupQueryCondition).then((res) => {
        if (res.status === 200) {
          this.summary.total.total = res.data.total
          this.summary.untreatedTotal.total = res.data.untreatedTotal
          this.summary.weekAdded.total = res.data.sevenCount
          this.summary.monthAdded.total = res.data.thirtyCount
          this.feedbacks = res.data.labelGroupCount
          if (res.data.labelGroupCount.length > 0) {
            let dataRes = []
            res.data.labelGroupCount.forEach((item) => {
              let temp = {}
              temp.name = item.label || ''
              temp.value = item.Count
              dataRes.push(temp)
            })
            this.pieData = dataRes
          } else {
            this.pieData = []
          }
          // 日统计
          if (res.data.dayGroupCount.length > 0) {
            // TODO @guohao 自动补0
            let dataRes = []
            res.data.dayGroupCount.forEach((item) => {
              let temp = {}
              temp.val = item.Count
              temp.date = item.day
              temp.name = !item.label || item.label === '' ? '用户反馈' : item.label
              dataRes.push(temp)
            })
            this.lineData = dataRes
          } else {
            this.lineData = []
          }
          this.repaint = false
          setTimeout(() => {
            this.repaint = true
          }, 0)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    timeFilter (start, end) {
      var cur = new Date()
      if (end.getTime() >= cur.getTime()) {
        end = cur
      }

      if (start.getTime() > end.getTime()) {
        return
      }

      let lastYear = getLastYearDate(end)

      if (start.getTime() < lastYear.getTime()) {
        start = lastYear
      }

      this.startTime = start
      this.endTime = end
      this.getFeedbackList()
    },
    productSelect (item) {
      this.getFeedbackList()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
.min-height
  height 300px
</style>
