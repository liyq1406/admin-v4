<template>
  <div class="main">
    <div class="main-title">
      <h2>大客户管理</h2>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <h2>用户趋势</h2>
      </div>
      <div class="panel-bd">
        <div class="filter-bar filter-bar-head">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
            </div>
            <div class="filter-group-item">
              <date-time-range-picker></date-time-range-picker>
            </div>
            <div class="filter-group-item">
              <radio-button-group :items="locales.data.PERIODS" :value.sync="7"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
            </div>
          </div>
        </div>
        <time-line :data="trends" :type="'smooth'"></time-line>
      </div>
    </div>
    <div class="row statistic-group">
      <div class="col-6">
        <statistic :info="majorSummary.monthIncrease" :title="majorSummary.monthIncrease.title" :has-target="true" align="left">
          <div>{{majorSummary.monthIncrease.target.title}}:{{majorSummary.monthIncrease.target.value}} <i class="change-reduse">({{majorSummary.monthIncrease.target.change}})</i></div>
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.number" :title="majorSummary.number.title" :has-target="true" align="left">
          <div>{{majorSummary.monthIncrease.target.title}}:{{majorSummary.monthIncrease.target.value}} <i class="change-reduse">({{majorSummary.monthIncrease.target.change}})</i></div>
        </statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.completion" :title="majorSummary.completion.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="majorSummary.percent" :title="majorSummary.percent.title" align="left"></statistic>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Statistic from 'components/Statistic'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Mock from 'mockjs'

export default {
  name: 'MajorClients',

  mixins: [globalMixins],

  components: {
    Statistic,
    RadioButtonGroup,
    DateTimeRangePicker,
    TimeLine
  },

  data () {
    return {
      majorSummary: {
        monthIncrease: {
          total: 38,
          change: 21,
          title: '月新增数',
          target: {
            title: '年目标',
            value: 39292,
            change: -245
          }
        },
        number: {
          total: 318,
          title: '年大客户数'
        },
        completion: {
          total: 54,
          unit: '%',
          change: 23,
          title: '年大客户目标完成率'
        },
        percent: {
          total: 38,
          unit: '%',
          change: 24,
          title: '大客户占比'
        }
      },
      trends: null
    }
  },
  ready () {
    this.trends = Mock.mock({
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
  }
}
</script>
