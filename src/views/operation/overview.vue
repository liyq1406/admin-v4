<template>
  <div class="main">
    <div class="row statistic">
      <div class="col-6">
        <panel>
          <statistic :info="statistic.users.info" title="设备总数" tooltip="设备总数说明" :has-chart="true" align="center" :titletop="true">
            <interval :data="statistic.users.data" :options="statistic.users.options"></interval>
          </statistic>
        </panel>
      </div>
      <div class="col-6">
        <panel>
          <statistic :info="statistic.devices.total.info" title="激活数" tooltip="激活数说明" color="green" :has-chart="true" align="center" :titletop="true">
            <interval :data="statistic.devices.total.data" :options="statistic.devices.total.options"></interval>
          </statistic>
        </panel>
      </div>
      <div class="col-6">
        <panel>
          <statistic :info="statistic.devices.activated.info" title="在线量" tooltip="在线量说明" color="blue" :has-chart="true" align="center" :titletop="true">
            <interval :data="statistic.devices.activated.data" :options="statistic.devices.activated.options"></interval>
          </statistic>
        </panel>
      </div>
      <div class="col-6">
        <panel>
          <statistic :info="statistic.devices.online.info" title="用户总数" tooltip="用户总数说明" color="orange" :has-chart="true" align="center" :titletop="true">
            <interval :data="statistic.devices.online.data" :options="statistic.devices.online.options"></interval>
          </statistic>
        </panel>
      </div>
    </div>
    <div class="row">
      <div class="col-24">
        <panel title="产品趋势">
          <div class="left-actions blockdiv" slot="left-actions">
            <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="trends.products.period"><span slot="label" class="label"></span></radio-button-group>
            <!-- <radio-button-group :hasline="true" :items="locales.data.PRODUCT_FILTERS" :value.sync="trends.products.filter"></radio-button-group> -->
            <div class="tab-s2 mt20 mb5">
              <ul>
                <li v-for="item in locales.data.PRODUCT_FILTERS" @click="currIndex=$index" :class="{'active':currIndex===$index}">{{ item.label }}</li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col-14">
              <time-line :data="trends.products.data" :type="'smooth'"></time-line>
            </div>
            <div class="col-10">
              <div class="row">
                <div class="col-24 col-offset-1 tac pd15">
                  <statistic :info="trends.products.avg.info" title="7天平均增长" tooltip="7天平均增长" color="orange" :inline="true"></statistic>
                </div>
              </div>
              <div class="top">
                <h3>今日新增TOP3</h3>
                <interval :data="trends.products.topAdded.data" :options="trends.products.topAdded.options"></interval>
              </div>
              <div class="top">
                <h3>今日在线TOP3</h3>
                <interval :data="trends.products.topOnline.data" :options="trends.products.topOnline.options"></interval>
              </div>
            </div>
          </div>
        </panel>

        <panel title="产品活跃度">
          <div class="row border-top-style">
            <div class="col-14">
              <time-line :data="trends.products.data" type="smooth"></time-line>
            </div>
            <div class="col-10">
              <pie :data="proportion.devices.online.data"></pie>
            </div>
          </div>
        </panel>

        <panel title="产品分布">
          <div class="row border-top-style">
            <div class="col-11 tac">
              <china-map :data="regions.products.data"></china-map>
            </div>
            <div class="col-12 col-offset-1 data-table-wrap mt20 mb20">
              <div class="data-table">
                <table class="table">
                  <thead>
                    <tr>
                      <th>地域</th>
                      <th>设备数量</th>
                      <th>占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>广东</td>
                      <td>289</td>
                      <td>14%</td>
                    </tr>
                    <tr>
                      <td>广西</td>
                      <td>1769</td>
                      <td>86%</td>
                    </tr>
                    <tr>
                      <td>广东</td>
                      <td>289</td>
                      <td>14%</td>
                    </tr>
                    <tr>
                      <td>广西</td>
                      <td>1769</td>
                      <td>86%</td>
                    </tr>
                    <tr>
                      <td>湖南</td>
                      <td>1769</td>
                      <td>86%</td>
                    </tr>
                    <tr>
                      <td>湖北</td>
                      <td>1769</td>
                      <td>86%</td>
                    </tr>
                    <tr>
                      <td>江西</td>
                      <td>1769</td>
                      <td>86%</td>
                    </tr>
                    <tr>
                      <td>江苏</td>
                      <td>1769</td>
                      <td>86%</td>
                    </tr>
                    <tr>
                      <td>广东</td>
                      <td>289</td>
                      <td>14%</td>
                    </tr>
                    <tr>
                      <td>广西</td>
                      <td>1769</td>
                      <td>86%</td>
                    </tr>
                    <tr>
                      <td>湖南</td>
                      <td>1769</td>
                      <td>86%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </panel>

        <panel title="用户趋势">
          <div class="left-actions blockdiv" slot="left-actions">
            <radio-button-group style="float:right" :items="locales.data.PERIODS" :value.sync="trends.users.period"><span slot="label" class="label"></span></radio-button-group>
            <!-- <radio-button-group :hasline="true" :items="locales.data.USER_FILTERS" :value.sync="trends.users.filter"></radio-button-group> -->
            <div class="tab-s2 mt20 mb5">
              <ul>
                <li v-for="item in locales.data.USER_FILTERS" @click="currIndex2=$index" :class="{'active':currIndex2===$index}">{{ item.label }}</li>
              </ul>
            </div>
          </div>
          <div class="row">
            <div class="col-14 mb20">
              <time-line :data="trends.users.data" type="smooth" :margin="customMargin"></time-line>
            </div>
            <div class="col-10 mt40">
              <div class="tac">
                <statistic :info="trends.users.today.info" title="今日增长" tooltip="今日增长" color="green" :inline="true"></statistic>
              </div>
              <div class="tac">
                <statistic :info="trends.users.avg.info" title="7天平均增长" tooltip="7天平均增长" color="orange" :inline="true"></statistic>
              </div>
            </div>
          </div>
        </panel>
      </div>
    </div>
  </div>
</template>

<script>
// import api from 'api'
import Mock from 'mockjs'
import Panel from 'components/Panel'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Statistic from 'components/Statistic'
import Tooltip from 'components/Tooltip'
import TimeLine from 'components/g2-charts/TimeLine'
import Interval from 'components/g2-charts/Interval'
import Pie from 'components/g2-charts/Pie'
import ChinaMap from 'components/g2-charts/ChinaMap'
import { globalMixins } from 'src/mixins'
import mapData from 'components/g2-charts/map-data.json'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'Dashboard',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Panel,
    RadioButtonGroup,
    Statistic,
    Tooltip,
    TimeLine,
    Interval,
    ChinaMap,
    Pie
  },

  data () {
    return {
      customMargin: [30, 10, 30, 30],
      currIndex: 0,
      currIndex2: 0,
      // 统计
      statistic: {
        // 用户总数
        users: {
          options: {},
          info: {
            changeunit: '%'
          },
          data: []
        },
        // 设备
        devices: {
          // 总数
          total: {
            options: {},
            info: {},
            data: []
          },
          // 激活设备
          activated: {
            options: {},
            info: {},
            data: []
          },
          // 在线设备
          online: {
            options: {},
            info: {},
            data: []
          }
        }
      },

      // 趋势
      trends: {
        // 产品
        products: {
          options: {},
          period: 7,
          filter: 'added',
          data: [],
          today: {
            options: {},
            info: {}
          },
          avg: {
            options: {},
            info: {}
          },
          topAdded: {
            options: {},
            data: []
          },
          topOnline: {
            options: {},
            data: []
          }
        },

        // 用户
        users: {
          period: 7,
          filter: 'added',
          options: {},
          data: [],
          today: {
            options: {},
            info: {}
          },
          avg: {
            options: {},
            info: {}
          }
        }
      },

      // 产品信息占比
      proportion: {
        devices: {
          activated: {
            data: []
          },
          online: {
            data: []
          }
        }
      },

      // 区域分布
      regions: {
        products: {
          period: 7,
          data: [],
          top: {
            options: {},
            data: []
          }
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
    const PRODUCTS = ['空气净化器', 'WI-FI智能灯']

    /**
     * 生成日期数组，用于模拟横轴日期数据
     * @param  {Number} n 数量
     * @return {Array}    日期数组
     */
    var genDates = (n) => {
      var result = []
      for (var i = n; i >= 1; i--) {
        result.push(moment().subtract(i, 'days').format('MM-DD'))
      }
      return result
    }

    // 顶部4个统计 -----------------------------------------------------

    // 图表基本配置
    var statisticOptions = {
      props: {
        height: 40,
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
    //   'total|100000-1000000': 100000
    // }
    // var tplStatData = {
    //   'list|20': [{
    //     'date|+1': genDates(20),
    //     'count|10-200': 10
    //   }]
    // }
    this.statistic.users = {
      info: {
        change: 32,
        total: 3172
      },
      data: Mock.mock({
        'list|20': [{
          'date|+1': genDates(20),
          'count|+1': [139, 106, 157, 64, 124, 157, 64, 124, 58, 139, 106, 58, 74, 88, 157, 64, 124, 58, 74, 88]
        }]
      }).list,
      options: _.merge({}, statisticOptions, {color: COLORS['gray']})
    }
    this.statistic.devices.total = {
      info: {
        change: 139,
        total: 58425
      },
      data: Mock.mock({
        'list|20': [{
          'date|+1': genDates(20),
          'count|+1': [139, 106, 58, 74, 88, 157, 64, 124, 58, 74, 88, 139, 106, 157, 64, 124, 157, 64, 124, 58]
        }]
      }).list,
      options: _.merge({}, statisticOptions, {color: COLORS['green']})
    }
    this.statistic.devices.activated = {
      info: Mock.mock({
        change: 67,
        total: 29887
      }),
      data: Mock.mock({
        'list|20': [{
          'date|+1': genDates(20),
          'count|+1': [58, 74, 88, 139, 106, 157, 64, 124, 157, 64, 124, 58, 139, 106, 58, 74, 88, 157, 64, 124]
        }]
      }).list,
      options: _.merge({}, statisticOptions, {color: COLORS['blue']})
    }
    this.statistic.devices.online = {
      info: Mock.mock({
        change: 5,
        total: 4205,
        changeunit: '%'
      }),
      data: Mock.mock({
        'list|20': [{
          'date|+1': genDates(20),
          'count|+1': [157, 64, 124, 58, 139, 106, 58, 74, 88, 157, 64, 124, 58, 74, 88, 139, 106, 157, 64, 124]
        }]
      }).list,
      options: _.merge({}, statisticOptions, {color: COLORS['orange']})
    }

    // 产品趋势分析 -----------------------------------------------------
    var proTrendsData = []
    // PRODUCTS.forEach((item) => {
    //   proTrendsData = proTrendsData.concat(Mock.mock({
    //     'list|7': [{
    //       'date|+1': genDates(7),
    //       'count|100-200': 10,
    //       'product': item
    //     }]
    //   }).list)
    // })
    proTrendsData = Mock.mock({
      'list|16': [{
        'date|+1': [
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21),
          new Date(2016, 7, 22),
          new Date(2016, 7, 23),
          new Date(2016, 7, 24),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21),
          new Date(2016, 7, 22),
          new Date(2016, 7, 23),
          new Date(2016, 7, 24)
        ],
        'count|+1': [6, 8, 9, 3, 9, 3, 9, 6, 38, 19, 33, 29, 33, 29, 10, 12],
        '产品|+1': ['空气净化器', '空气净化器', '空气净化器', '空气净化器', '空气净化器', '空气净化器', '空气净化器', '空气净化器', 'WIFI指示灯', 'WIFI指示灯', 'WIFI指示灯', 'WIFI指示灯', 'WIFI指示灯', 'WIFI指示灯', 'WIFI指示灯', 'WIFI指示灯']
      }]
    }).list
    this.trends.products.data = proTrendsData

    // var tplPoductTrends = {
    //   'change|-200-200': 0,
    //   'total|10-1000': 1000
    // }
    // 今日
    this.trends.products.today = {
      info: {
        change: 5,
        total: 139
      }
    }
    // 平均
    this.trends.products.avg = {
      info: {
        change: 7,
        total: 104
      }
    }

    // Top3
    var productTrendsTopOptions = {
      props: {
        plotCfg: {
          margin: [0, 0, 0, 180]
        }
      },
      defs: {
        'product': {
          type: 'cat',
          alias: '产品'
        },
        'count': {
          alias: '数量',
          min: 0
        }
      },
      position: 'product*count'
    }
    // var tplProductTrendsTopData = {
    //   'list|2': [{
    //     'count|10-20': 10,
    //     'product|+1': PRODUCTS
    //   }]
    // }
    this.trends.products.topAdded = {
      data: Mock.mock({
        'list|2': [{
          'count|+1': [24, 115],
          'product|+1': PRODUCTS
        }]
      }).list,
      options: _.merge({}, productTrendsTopOptions, {
        props: {
          height: 90
        },
        color: 'product',
        horizontal: true,
        // axis: false,
        legend: false
      })
    }
    this.trends.products.topOnline = {
      data: Mock.mock({
        'list|2': [{
          'count|+1': [807, 4709],
          'product|+1': PRODUCTS
        }]
      }).list,
      options: _.merge({}, productTrendsTopOptions, {
        props: {
          height: 80
        },
        color: 'product',
        horizontal: true,
        // axis: false,
        legend: false
      })
    }

    // 产品区域分布 -----------------------------------------------------

    // var regionData = []
    // var features = mapData.features
    // var dataArr = [4576, 3405, 2876, 2406, 2217, 1807, 1777, 1654, 1540, 1440, 1120, 879, 654, 332, 224, 87, 32]
    // for (var i = 0; i < features.length; i++) {
    //   var name = features[i].properties.name
    //   regionData.push({
    //     'name': name,
    //     // 'value': Math.round(Math.random() * 1000)
    //     'value': dataArr[i] || 0
    //   })
    // }
    var regionData = []
    var features = mapData.features
    var mapDataArr = [{
      name: '广东',
      value: 4576
    }, {
      name: '上海',
      value: 3405
    }, {
      name: '北京',
      value: 2876
    }, {
      name: '浙江',
      value: 2406
    }, {
      name: '江苏',
      value: 2217
    }, {
      name: '广西',
      value: 1807
    }, {
      name: '福建',
      value: 1807
    }, {
      name: '重庆',
      value: 1777
    }, {
      name: '山东',
      value: 1654
    }, {
      name: '四川',
      value: 1540
    }, {
      name: '湖南',
      value: 1540
    }, {
      name: '安徽',
      value: 1120
    }, {
      name: '黑龙江',
      value: 1120
    }, {
      name: '河北',
      value: 1120
    }, {
      name: '云南',
      value: 879
    }, {
      name: '江西',
      value: 879
    }, {
      name: '辽宁',
      value: 654
    }, {
      name: '湖北',
      value: 332
    }, {
      name: '山西',
      value: 224
    }, {
      name: '青海',
      value: 87
    }]
    for (var i = 0; i < features.length; i++) {
      var name = features[i].properties.name
      regionData.push({
        'name': name,
        // 'value': Math.round(Math.random() * 1000)
        'value': 0
      })
    }
    this.regions.products.data = _.unionBy(mapDataArr, regionData, 'name')

    // Top10
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
    var regionProductTopData = _.slice(_.orderBy(this.regions.products.data, ['value'], ['asc']), this.regions.products.data.length - 10, this.regions.products.data.length)
    this.regions.products.top = {
      data: regionProductTopData,
      options: _.merge({}, regionsProductTopOptions, {
        props: {
          height: 400
        },
        color: 'name',
        horizontal: true,
        // axis: false,
        legend: false
      })
    }

    // 产品信息占比 -----------------------------------------------------
    this.proportion.devices.activated = {
      data: [
        {name: '已激活设备数', value: 29887},
        {name: '未激活设备数', value: 28538}
      ]
    }
    this.proportion.devices.online = {
      data: [
        {name: '当前离线', value: 25682},
        {name: '当前在线', value: 4205}
      ]
    }

    // 用户趋势分析 -----------------------------------------------------

    this.trends.users.data = Mock.mock({
      'list|16': [{
        'date|+1': [
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21),
          new Date(2016, 7, 22),
          new Date(2016, 7, 23),
          new Date(2016, 7, 24)
        ],
        'count|+1': [38, 19, 33, 29, 33, 29, 10, 12]
      }]
    }).list

    // var tplUserTrends = {
    //   'change|-200-200': 0,
    //   'total|10-1000': 1000
    // }
    // 今日
    this.trends.users.today = {
      info: {
        change: 8,
        total: 32
      }
    }
    // 平均
    this.trends.users.avg = {
      info: {
        change: 12,
        total: 43
      }
    }
  },

  methods: {
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/stylus/common'

.statistic
  .x-panel
    padding 0

.top
  h3
    font-size 14px
    text-indent 180px
    margin 10px 0 5px
    color gray
.blockdiv
  display block!important
  margin-top 10px
  /*border-bottom 1px solid #e5e5e5*/
.border-top-style
  border-top 1px solid #e5e5e5
  margin-top 10px
.pd15
  .x-statistic-left
    padding-left 15px!important
</style>
