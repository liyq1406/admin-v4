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
          <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
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
        <time-line :data="trends.data" :type="'smooth'"></time-line>
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
      <div class="panel-hd panel-hd-full">
        <h2>分布</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-7">
            <pie :data="feedbacks" :height="400"></pie>
          </div>
          <div class="col-16 col-offset-1 data-table-wrap" style="min-height: 400px">
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
// import api from 'api'
import Modal from 'components/Modal'
import Select from 'components/Select'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import Statistic from 'components/Statistic'
import TimeLine from 'components/g2-charts/TimeLine'
import Pie from 'components/g2-charts/Pie'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../mixins'

import Mock from 'mockjs'

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
    TimeLine
  },

  data () {
    return {
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
    this.trends.data = Mock.mock({
      'list|16': [{
        'date|+1': [
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20)
        ],
        'count|+1': [6, 8, 9, 3, 9, 3, 9, 6, 38, 19, 33, 29, 33, 29, 10, 12],
        '产品|+1': ['产品咨询', '产品咨询', '产品咨询', '产品咨询', '故障反馈', '故障反馈', '故障反馈', '故障反馈', '使用建议', '使用建议', '使用建议', '使用建议', '使用指南', '使用指南', '使用指南', '使用指南']
      }]
    }).list
  },

  methods: {
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
</style>
