<template>
  <div>
    <panel>
      <div class="row user-card">
        <div class="col-6 total-box">
          <statistic :info="statistic.users.total.info" title="总用户数" color="gray" :has-chart="true">
          </statistic>
        </div>
        <div class="col-6">
          <statistic :info="statistic.users.registered.info" title="今日新增" color="green" :has-chart="true">
            <interval :data="statistic.users.registered.data" :options="statistic.users.registered.options"></interval>
          </statistic>
        </div>
        <div class="col-6">
          <statistic :info="statistic.users.registeredPercentage.info" title="今日活跃用户" color="blue" :has-chart="true">
            <interval :data="statistic.users.registeredPercentage.data" :options="statistic.users.registeredPercentage.options"></interval>
          </statistic>
        </div>
        <div class="col-6">
          <statistic :info="statistic.users.online.info" title="过去7天活跃用户数" color="orange" :has-chart="true">
            <interval :data="statistic.users.online.data" :options="statistic.users.online.options"></interval>
          </statistic>
        </div>
      </div>
    </panel>

    <panel title="用户区域分布">
      <div class="row">
        <div class="col-18 tac">
          <china-map :data="regions.users.data" :options="regions.users.options"></china-map>
        </div>
        <div class="col-6">
          <div class="top-regions">
            <h3>用户区域分布TOP10</h3>
            <interval :data="regions.users.top.data" :options="regions.users.top.options"></interval>
          </div>
        </div>
      </div>
    </panel>

    <div class="panel">
      <div class="panel-hd">
        <h2>用户趋势</h2>
      </div>
      <div class="panel-bd">
        <div class="filter-bar">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <date-time-range-picker></date-time-range-picker>
            </div>
            <div class="filter-group-item">
              <radio-button-group :items="locales.data.PERIODS" :value.sync="trends.users.period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
            </div>
          </div>
        </div>
        <line :data="trends.users.data" :options="trends.users.options"></line>
      </div>
    </div>

    <div class="panel">
      <div class="panel-hd">
        <h2>用户趋势明细</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>时间段</th>
                <th>用户新增数</th>
                <th>新增占比</th>
                <th>活跃用户数</th>
                <th>活跃占比</th>
                <th>累计用户</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in 10">
                <td>2015-03-01</td>
                <td>1123</td>
                <td>4%</td>
                <td>1114</td>
                <td>3%</td>
                <td>11142314</td>
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
// import G2 from 'g2'
import Mock from 'mockjs'
import Panel from 'components/Panel'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Statistic from 'components/Statistic'
import Tooltip from 'components/Tooltip'
import Line from 'components/g2-charts/Line'
import Interval from 'components/g2-charts/Interval'
import ChinaMap from 'components/g2-charts/ChinaMap'
import mapData from 'components/g2-charts/map-data.json'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import { globalMixins } from 'src/mixins'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'Dashboard',

  mixins: [globalMixins],

  components: {
    Panel,
    RadioButtonGroup,
    Statistic,
    Tooltip,
    Line,
    Interval,
    ChinaMap,
    DateTimeRangePicker
  },

  data () {
    return {
      // 统计
      statistic: {
        // 用户总数
        users: {
          total: {
            options: {},
            info: {}
          },
          // 新增用户
          registered: {
            options: {},
            info: {},
            data: []
          },
          // 新增用户占比
          registeredPercentage: {
            options: {},
            info: {},
            data: []
          },
          // 在线用户
          online: {
            options: {},
            info: {},
            data: []
          },
          // 在线用户占比
          onlinePercentage: {
            options: {},
            info: {},
            data: []
          }
        }
      },

      // 用户类型
      userTypes: {
        options: {},
        data: []
      },

      // 区域分布
      regions: {
        users: {
          options: {},
          data: [],
          top: {
            options: {},
            data: []
          }
        }
      },

      trends: {
        // 用户
        users: {
          period: 7,
          filter: 'added',
          options: {},
          data: []
        }
      }
    }
  },

  ready () {
    // 配色
    const COLORS = {
      'gray': '#383838',
      'green': '#4CBF5E',
      'blue': '#307FC1',
      'orange': '#F69052'
    }
    // 产品
    // const PRODUCTS = ['产品1', '产品2', '产品3']

    /**
     * 生成日期数组，用于模拟横轴日期数据
     * @param  {Number} n 数量
     * @return {Array}    日期数组
     */
    var genDates = (n) => {
      var result = []
      for (let i = n; i >= 1; i--) {
        result.push(moment().subtract(i, 'days').format('MM-DD'))
      }
      return result
    }

    // 顶部4个统计 -----------------------------------------------------

    // 图表基本配置
    var statisticOptions = {
      props: {
        height: 30,
        plotCfg: {
          margin: [0, 0, 0, 0]
        }
      },
      defs: {
        'date': {
          type: 'cat',
          alias: '日期'
        },
        'count': {
          alias: '数量',
          min: 0
        }
      },
      axis: false,
      legend: false,
      tooltip: false,
      position: 'date*count'
    }
    // var tplStatInfo = {
    //   'change|-200-2000': 2000,
    //   'total|1000-3000': 100000
    // }
    var tplStatData = {
      'list|20': [{
        'date|+1': genDates(20),
        'count|10-200': 10
      }]
    }
    this.statistic.users.total = {
      info: {
        change: 32,
        total: 3172
      },
      options: _.merge({}, statisticOptions, {color: COLORS['gray']})
    }
    this.statistic.users.registered = {
      info: {
        change: 1,
        total: 32
      },
      data: Mock.mock(tplStatData).list,
      options: _.merge({}, statisticOptions, {color: COLORS['green']})
    }
    this.statistic.users.registeredPercentage = {
      info: {
        change: 1,
        total: 0.775
      },
      data: Mock.mock(tplStatData).list,
      options: _.merge({}, statisticOptions, {color: COLORS['blue']})
    }
    this.statistic.users.online = {
      info: {
        change: 33,
        total: 1387
      },
      data: Mock.mock(tplStatData).list,
      options: _.merge({}, statisticOptions, {color: COLORS['orange']})
    }
    this.statistic.users.onlinePercentage = {
      info: {
        change: 88,
        total: 0.43
      },
      data: Mock.mock(tplStatData).list,
      options: _.merge({}, statisticOptions, {color: COLORS['gray']})
    }

    // 用户类型 -----------------------------------------------------
    var userTypesOptions = {
      legend: false,
      axis: false,
      props: {
        height: 380,
        plotCfg: {
          margin: [40, 20, 40, 20]
        }
      },
      defs: {
        'type': {
          type: 'cat',
          alias: '类型'
        },
        'count': {
          alias: '数量',
          min: 0
        }
      },
      position: 'type*count',
      color: 'type'
    }
    this.userTypes.data = Mock.mock({
      'list|3': [{
        'type|+1': ['普通用户', '活跃用户', '忠诚用户'],
        'count|+1': [1505, 997, 498]
      }]
    }).list
    this.userTypes.options = userTypesOptions

    // 用户区域分布 -----------------------------------------------------

    // var regionData = []
    // var features = mapData.features
    // for (let i = 0; i < features.length; i++) {
    //   let name = features[i].properties.name
    //   regionData.push({
    //     'name': name,
    //     'value': Math.round(Math.random() * 250)
    //   })
    // }
    // this.regions.users.data = regionData
    this.regions.users.options = {
      props: {
        width: 420,
        height: 380
      }
    }

    var regionData = []
    var features = mapData.features
    var mapDataArr = [{
      name: '广东',
      value: 457
    }, {
      name: '上海',
      value: 340
    }, {
      name: '北京',
      value: 287
    }, {
      name: '浙江',
      value: 240
    }, {
      name: '江苏',
      value: 221
    }, {
      name: '广西',
      value: 180
    }, {
      name: '福建',
      value: 180
    }, {
      name: '重庆',
      value: 177
    }, {
      name: '山东',
      value: 165
    }, {
      name: '四川',
      value: 154
    }, {
      name: '湖南',
      value: 154
    }, {
      name: '安徽',
      value: 112
    }, {
      name: '黑龙江',
      value: 112
    }, {
      name: '河北',
      value: 112
    }, {
      name: '云南',
      value: 87
    }, {
      name: '江西',
      value: 87
    }, {
      name: '辽宁',
      value: 65
    }, {
      name: '湖北',
      value: 33
    }, {
      name: '山西',
      value: 22
    }, {
      name: '青海',
      value: 8
    }]
    for (var i = 0; i < features.length; i++) {
      var name = features[i].properties.name
      regionData.push({
        'name': name,
        // 'value': Math.round(Math.random() * 1000)
        'value': 0
      })
    }
    this.regions.users.data = _.unionBy(mapDataArr, regionData, 'name')
    // Top10
    // var regionsUsersTopOptions = {
    //   props: {
    //     plotCfg: {
    //       margin: [0, 0, 0, 60]
    //     }
    //   },
    //   defs: {
    //     'name': {
    //       type: 'cat',
    //       alias: '省份'
    //     },
    //     'value': {
    //       alias: '数量',
    //       min: 0
    //     }
    //   },
    //   position: 'name*value'
    // }
    // var regionUserTopData = _.slice(_.orderBy(regionData, ['value'], ['asc']), regionData.length - 11, regionData.length - 1)
    // this.regions.users.top = {
    //   data: regionUserTopData,
    //   options: _.merge({}, regionsUsersTopOptions, {
    //     props: {
    //       height: 300
    //     },
    //     color: 'name',
    //     horizontal: true,
    //     // axis: false,
    //     legend: false
    //   })
    // }
    var regionsProductTopOptions = {
      props: {
        plotCfg: {
          margin: [0, 0, 0, 80]
        }
      },
      defs: {
        'name': {
          type: 'cat',
          alias: '省份'
        },
        'value': {
          alias: '数量',
          min: 0
        }
      },
      position: 'name*value'
    }
    var regionUserTopData = _.slice(_.orderBy(this.regions.users.data, ['value'], ['asc']), this.regions.users.data.length - 10, this.regions.users.data.length)
    this.regions.users.top = {
      data: regionUserTopData,
      options: _.merge({}, regionsProductTopOptions, {
        props: {
          height: 300
        },
        color: 'name',
        horizontal: true,
        // axis: false,
        legend: false
      })
    }

    // 用户趋势分析 -----------------------------------------------------

    // 趋势图表配置
    var userTrendsOptions = {
      props: {
        height: 300,
        plotCfg: {
          margin: [60, 0, 50, 60]
        }
      },
      defs: {
        'date': {
          type: 'cat',
          alias: '日期'
        },
        'count': {
          alias: '数量',
          min: 0
        },
        'type': {
          alias: '新增用户'
        }
      },
      position: 'date*count',
      color: 'type'
    }
    this.trends.users.data = Mock.mock({
      'list|7': [{
        'date|+1': genDates(7),
        'count|+1': [26, 38, 19, 33, 29, 33, 29],
        'type': '新增用户'
      }]
    }).list
    this.trends.users.options = userTrendsOptions
  },

  methods: {
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'

.user-card
  .x-statistic
    & > .info
      font-size 36px
      margin 7px 0

    & > .chart
      size 120px 30px

  .total-box
    .x-statistic
      position relative

      & > .info
        font-size 44px
        margin 20px 0 0

      & > .tit
        absolute left 50% top 100px
        margin-left -24px

.top-regions
.top-phones
  h3
    text-align center
    font-size 14px
    color gray
</style>
