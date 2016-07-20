<template>
  <div class="main">
    <div class="main-title">
      <h2>用户反馈</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <v-select label="空气净化器" width="110px" size="small">
            <span slot="label">产品</span>
          </v-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <button class="btn btn-ghost btn-sm"><a class="fa fa- fa-share-square-o"></a></button>
        </div>
        <div class="filter-group-item">
          <date-time-range-picker></date-time-range-picker>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd panel-hd-full">
        <h2>趋势</h2>
      </div>
      <div class="panel-bd">
        <div class="with-loading">
          <line :data="trends.data" :options="trends.options"></line>
          <!-- <line-chart :series="alertSeries" :x-axis-data="alertXAxisData" v-ref:alert-chart></line-chart> -->
          <!-- <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div> -->
        </div>
      </div>
    </div>
    <div class="row statistic-group">
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
      <div class="panel-bd">

      </div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
// import locales from 'consts/locales/index'
// import api from 'api'
import Modal from 'components/Modal'
import Select from 'components/Select'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import Statistic from 'components/Statistic'
import Line from 'components/g2-charts/Line'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../mixins'

import Pie from 'components/g2-charts/Pie'

export default {
  name: 'Overview',

  mixins: [globalMixins, pluginMixins],

  components: {
    Modal,
    Pie,
    'v-select': Select,
    RadioButtonGroup,
    DateTimeRangePicker,
    Statistic,
    Line
  },

  data () {
    return {
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
    // 趋势图表配置
    // var productTrendsOptions = {
    //   props: {
    //     plotCfg: {
    //       margin: [60, 0, 50, 60]
    //     }
    //   },
    //   defs: {
    //     'date': {
    //       type: 'cat',
    //       alias: '日期'
    //     },
    //     'count': {
    //       alias: '数量',
    //       min: 0
    //     },
    //     'product': {
    //       alias: '产品'
    //     }
    //   },
    //   position: 'date*count',
    //   color: 'product'
    // }
    // var trendsData = []
    // PRODUCTS.forEach((item) => {
    //   proTrendsData = proTrendsData.concat(Mock.mock({
    //     'list|7': [{
    //       'date|+1': genDates(7),
    //       'count|100-200': 10,
    //       'product': item
    //     }]
    //   }).list)
    // })

    // proTrendsData = proTrendsData.concat(Mock.mock({
    //   'list|7': [{
    //     'date|+1': genDates(7),
    //     'count|+1': [24, 14, 25, 34, 17, 29, 33],
    //     'product': PRODUCTS[0]
    //   }]
    // }).list)
    // proTrendsData = proTrendsData.concat(Mock.mock({
    //   'list|7': [{
    //     'date|+1': genDates(7),
    //     'count|+1': [204, 156, 275, 236, 154, 198, 185],
    //     'product': PRODUCTS[1]
    //   }]
    // }).list)
    // this.trends.products.data = proTrendsData
    // this.trends.products.options = productTrendsOptions
  },

  methods: {
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
</style>
