<template>
  <div class="main">
    <div class="main-title">
      <h2>用户反馈</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <v-select :label="product.name" width="110px" size="small">
            <span slot="label">产品</span>
            <select v-model="product" @change="getFeedbackList">
              <option v-for="prod in products" :value="prod">{{prod.name}}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="filter-group fr">
        <!-- <div class="filter-group-item">
          <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
        </div> -->
        <div class="filter-group-item">
          <date-time-range-picker></date-time-range-picker>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="period"><span slot="label" class="label"></span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel mt20">
      <div class="panel-hd panel-hd-full bordered">
        <h2>趋势</h2>
      </div>
      <div class="panel-bd">
        <time-line :data="trends.data" :type="'smooth'"></time-line>
      </div>
    </div>
    <div class="row statistic-group mb30">
      <div class="col-6">
        <statistic :info="summary.pending" :title="summary.pending.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="summary.avg" :title="summary.avg.title" align="left"></statistic>
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
            <pie :data="feedbacks" :height="400" :margin="customPieMargin"></pie>
          </div>
          <div class="col-14 col-offset-1 data-table-wrap" style="min-height: 400px">
            <div class="data-table">
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
                  <tr>
                    <td>使用帮助</td>
                    <td>128 (25%)</td>
                    <td>9283 (75%)</td>
                    <td>12800</td>
                  </tr>
                  <tr>
                    <td>产品咨询</td>
                    <td>128 (25%)</td>
                    <td>9283 (75%)</td>
                    <td>12800</td>
                  </tr>
                  <tr>
                    <td>投诉建议</td>
                    <td>128 (25%)</td>
                    <td>9283 (75%)</td>
                    <td>12800</td>
                  </tr>
                  <tr>
                    <td>产品故障</td>
                    <td>128 (25%)</td>
                    <td>9283 (75%)</td>
                    <td>12800</td>
                  </tr>
                  <tr>
                    <td>退货申请</td>
                    <td>128 (25%)</td>
                    <td>9283 (75%)</td>
                    <td>12800</td>
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
import Select from 'components/Select'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import Statistic from 'components/Statistic'
import TimeLine from 'components/g2-charts/TimeLine'
import Pie from 'components/g2-charts/Pie'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../mixins'

export default {
  name: 'Overview',

  mixins: [globalMixins, pluginMixins],

  components: {
    'v-select': Select,
    Pie,
    RadioButtonGroup,
    DateTimeRangePicker,
    Statistic,
    TimeLine
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      product: {
        name: ''
      },
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
      loadingData: false
    }
  },

  ready () {
    if (this.products.length > 0) {
      this.product = this.products[0]
      this.getFeedbackList()
    }
  },

  watch: {
    products () {
      if (this.products.length > 0) {
        this.product = this.products[0]
        this.getFeedbackList()
      }
    }
  },

  methods: {
    getFeedbackList () {
      var params = {
        query: {
          product_id: this.product.id
        }
      }
      api.helpdesk.getFeedbackList(this.$route.params.app_id, params).then((res) => {
        if (res.status === 200) {
          console.log(res.data)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
</style>
