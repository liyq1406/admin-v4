<template>
  <div class="main">
    <div class="main-title">
      <h2>使用分析</h2>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <h2>用户活跃时间点分析</h2>
      </div>
      <div class="panel-bd">
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <date-time-single-picker :show-time="false"></date-time-single-picker>
            </div>
          </div>
        </div>
        <time-line :data="trends.active"></time-line>
      </div>
      <div class="panel-hd">
        <h2>用户活跃时间明细</h2>
      </div>
      <div v-stretch='200' class="panel-bd">
        <div class="data-table">
          <table class="table">
            <thead>
              <tr>
                <th>时间段</th>
                <th>用户活跃数</th>
                <th>用户占比</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 12">
                <td>1-2</td>
                <td>128</td>
                <td>25%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <h2>用户参与度-日使用频率</h2>
      </div>
      <div class="panel-bd">
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <date-time-single-picker :show-time="false" :label="'对比时间'"></date-time-single-picker>
            </div>
          </div>
        </div>
        <time-line :data="trends.frequency"></time-line>
      </div>

      <div class="panel-bd">
        <div class="data-table">
          <table class="table">
            <thead>
              <tr>
                <th>使用频率</th>
                <th>用户活跃数</th>
                <th>用户占比</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 12">
                <td>1-2</td>
                <td>128</td>
                <td>25%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import api from 'api'
import { globalMixins } from 'src/mixins'
import DateTimeSinglePicker from 'components/DateTimeSinglePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Mock from 'mockjs'

export default {
  name: 'Portrait',

  mixins: [globalMixins],

  components: {
    TimeLine,
    DateTimeSinglePicker
  },

  data () {
    return {
      trends: {
        active: null,
        frequency: null
      }
    }
  },

  ready () {
    this.trends.active = Mock.mock({
      'list|14': [{
        'date|+1': [
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21),
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21)
        ],
        'count|+1': [6, 8, 9, 3, 9, 3, 9, 6, 38, 19, 33, 29, 33, 29],
        '产品|+1': ['电饭锅1', '电饭锅1', '电饭锅1', '电饭锅1', '电饭锅1', '电饭锅1', '电饭锅1', '电饭锅2', '电饭锅2', '电饭锅2', '电饭锅2', '电饭锅2', '电饭锅2', '电饭锅2']
      }]
    }).list

    this.trends.frequency = Mock.mock({
      'list|12': [{
        'duration|+1': ['1-3', '4-10', '11-15', '16-20', '20-30', '30以上', '1-3', '4-10', '11-15', '16-20', '20-30', '30以上'],
        'count|+1': [6, 8, 9, 3, 9, 3, 16, 18, 19, 31, 91, 13],
        'date|+1': ['2016年7月21日', '2016年7月21日', '2016年7月21日', '2016年7月21日', '2016年7月21日', '2016年7月21日', '2016年7月22日', '2016年7月22日', '2016年7月22日', '2016年7月22日', '2016年7月22日', '2016年7月22日']
      }]
    }).list
  },

  methods: {
  }
}
</script>
