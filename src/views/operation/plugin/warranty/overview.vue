<template>
  <div class="main">
    <div class="main-title">
      <h2>概览</h2>
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
        <!-- <div class="filter-group-item">
          <date-time-range-picker></date-time-range-picker>
        </div> -->
        <div class="filter-group-item">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
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
    <div class="statistic-group mb30">
      <div style="display:inline-block;width:19.5%;border-right: 1px solid #d9d9d9">
        <statistic :info="summary.repairPercent" :title="summary.repairPercent.title" :showchange="true" align="left"></statistic>
      </div>
      <div style="display:inline-block;width:19.5%;border-right: 1px solid #d9d9d9">
        <statistic :info="summary.time" :title="summary.time.title" :showchange="true" align="left"></statistic>
      </div>
      <div style="display:inline-block;width:19.5%;border-right: 1px solid #d9d9d9">
        <statistic :info="summary.maintain" :title="summary.maintain.title" align="left"></statistic>
      </div>
      <div style="display:inline-block;width:19.5%;border-right: 1px solid #d9d9d9">
        <statistic :info="summary.avgYear" :title="summary.avgYear.title" align="left"></statistic>
      </div>
      <div style="display:inline-block;width:19.5%">
        <statistic :info="summary.percent" :title="summary.percent.title" :showchange="true" align="left"></statistic>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd panel-hd-full bordered">
        <h2>维修等级与原因</h2>
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
                    <th>维修等级</th>
                    <th>维修原因</th>
                    <th>数量</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowspan="2">一级(33%)</td>
                    <td>电源故障</td>
                    <td>182</td>
                    <td>58.30%</td>
                  </tr>
                  <tr>
                    <td>风机故障</td>
                    <td>96</td>
                    <td>24.87%</td>
                  </tr>
                  <tr>
                    <td rowspan="2">二级(29%)</td>
                    <td>其他问题</td>
                    <td>23</td>
                    <td>10.74%</td>
                  </tr>
                  <tr>
                    <td>噪音问题</td>
                    <td>17</td>
                    <td>4.94%</td>
                  </tr>
                  <tr>
                    <td rowspan="2">三级(48%)</td>
                    <td>屏幕故障</td>
                    <td>8</td>
                    <td>0.94%</td>
                  </tr>
                  <tr>
                    <td>通讯故障</td>
                    <td>3</td>
                    <td>0.21%</td>
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
          name: '电源故障',
          value: 58.30
        },
        {
          name: '风机故障',
          value: 24.87
        },
        {
          name: '其他问题',
          value: 10.74
        },
        {
          name: '噪音问题',
          value: 4.94
        },
        {
          name: '屏幕故障',
          value: 0.94
        },
        {
          name: '通讯故障',
          value: 0.21
        }
      ],
      summary: {
        repairPercent: {
          total: 17,
          change: 2,
          unit: '%',
          title: '维修率'
        },
        time: {
          total: 23,
          change: 2,
          unit: '分',
          title: '维修平均响应时间'
        },
        maintain: {
          total: 95,
          unit: '%',
          title: '保养完成率'
        },
        avgYear: {
          total: 2,
          unit: '年',
          title: '延保平均年限'
        },
        percent: {
          total: 34,
          change: '124',
          unit: '%',
          title: '延保率'
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
          new Date(2016, 7, 20)
        ],
        'count|+1': [6, 8, 9, 3, 9, 3, 9, 6, 38, 19, 33, 29],
        '产品|+1': ['新增维修', '新增维修', '新增维修', '新增维修', '新增延保', '新增延保', '新增延保', '新增延保', '新增保养', '新增保养', '新增保养', '新增保养']
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
