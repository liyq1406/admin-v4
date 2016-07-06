<template>
  <div>
    <panel>
      <div class="row user-card">
        <div class="col-4 total-box">
          <statistic :info="statistic.users.total.info" title="总用户数" color="gray" :has-chart="true">
          </statistic>
        </div>
        <div class="col-20">
          <div class="row statistic">
            <div class="col-6">
              <statistic :info="statistic.users.registered.info" title="今日新增" tooltip="今日新增说明" color="green" :has-chart="true">
                <interval :data="statistic.users.registered.data" :options="statistic.users.registered.options"></interval>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :info="statistic.users.registeredPercentage.info" title="新增用户占比" tooltip="新增用户占比说明" color="blue" :has-chart="true">
                <interval :data="statistic.users.registeredPercentage.data" :options="statistic.users.registeredPercentage.options"></interval>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :info="statistic.users.online.info" title="今日在线用户" tooltip="今日在线用户说明" color="orange" :has-chart="true">
                <interval :data="statistic.users.online.data" :options="statistic.users.online.options"></interval>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :info="statistic.users.onlinePercentage.info" title="在线用户占比" tooltip="在线用户占比说明" :has-chart="true">
                <interval :data="statistic.users.onlinePercentage.data" :options="statistic.users.onlinePercentage.options"></interval>
              </statistic>
            </div>
          </div>
        </div>
      </div>
    </panel>

    <div class="row">
      <div class="col-8">
        <panel title="用户金字塔模型">
          <pyramid :data="userTypes.data" :options="userTypes.options"></pyramid>
        </panel>
      </div>
      <div class="col-16">
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
      </div>
    </div>

    <panel title="用户趋势分析">
      <div class="left-actions" slot="left-actions">
        <button-group :items="locales.data.PERIODS" :value.sync="trends.users.period"><span slot="label" class="label">{{ $t("common.recent") }}</span></button-group>
        <button-group :items="locales.data.USER_FILTERS" :value.sync="trends.users.filter"></button-group>
      </div>
      <div class="row">
        <div class="col-18">
          <line :data="trends.users.data" :options="trends.users.options"></line>
        </div>
        <div class="col-6 mt40">
          <div class="tac">
            <statistic :info="trends.users.today.info" title="今日增长" tooltip="今日增长" color="green" :inline="true"></statistic>
          </div>
          <div class="tac">
            <statistic :info="trends.users.avg.info" title="7天平均增长" tooltip="7天平均增长" color="orange" :inline="true"></statistic>
          </div>
        </div>
      </div>
    </panel>

    <panel title="用户活跃时间点分析">
      <div class="left-actions" slot="left-actions">
        <button-group :items="locales.data.ACTIVE_PERIODS" :value.sync="timePoint.period"><span slot="label" class="label">{{ $t("common.recent") }}</span></button-group>
      </div>
      <line :data="timePoint.data" :options="timePoint.options"></line>
    </panel>

    <div class="row">
      <div class="col-12">
        <panel title="用户参与度-单次app使用时长">
          <div class="right-actions mt20" slot="right-actions">
            <button class="btn btn-ghost btn-sm">对比日期</button><button class="btn btn-ghost btn-sm ml5"><i class="fa fa-download"></i>下载</button>
          </div>
          <line :data="duration.data" :options="duration.options"></line>
        </panel>
      </div>
      <div class="col-12">
        <panel title="用户参与度-app使用频率">
          <div class="right-actions mt20" slot="right-actions">
            <button class="btn btn-ghost btn-sm">对比日期</button><button class="btn btn-ghost btn-sm ml5"><i class="fa fa-download"></i>下载</button>
          </div>
          <line :data="times.data" :options="times.options"></line>
        </panel>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <panel title="性别占比">
          <interval :data="sex.data" :options="sex.options"></interval>
        </panel>
      </div>
      <div class="col-12">
        <panel title="年龄占比">
          <interval :data="age.data" :options="age.options"></interval>
        </panel>
      </div>
    </div>

    <panel title="终端分布-系统">
      <interval :data="os.data" :options="os.options"></interval>
    </panel>

    <panel title="终端分布-机型">
      <div class="row">
        <div class="col-16">
          <pie :data="phones.data" :options="phones.options"></line>
        </div>
        <div class="col-6">
          <div class="top-phones mt40">
            <h3>机型占比TOP10</h3>
            <interval :data="phones.top.data" :options="phones.top.options"></interval>
          </div>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
// import api from 'api'
// import G2 from 'g2'
import Mock from 'mockjs'
import Panel from 'components/Panel'
import ButtonGroup from 'components/ButtonGroup'
import Statistic from 'components/Statistic'
import Tooltip from 'components/Tooltip'
import Line from 'components/g2-charts/Line'
import Interval from 'components/g2-charts/Interval'
import Pie from 'components/g2-charts/Pie'
import ChinaMap from 'components/g2-charts/ChinaMap'
import Pyramid from 'components/g2-charts/Pyramid'
import mapData from 'components/g2-charts/map-data.json'
import { globalMixins } from 'src/mixins'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'Dashboard',

  layout: 'admin',

  mixins: [globalMixins],

  components: {
    Panel,
    ButtonGroup,
    Statistic,
    Tooltip,
    Line,
    Interval,
    ChinaMap,
    Pyramid,
    Pie
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

      // 用户活跃时间点
      timePoint: {
        options: {},
        period: 1,
        data: []
      },

      // 用户参与度-单次app使用时长
      duration: {
        options: {},
        data: []
      },

      // 用户参与度-app使用频率
      times: {
        options: {},
        data: []
      },

      // 性别占比
      sex: {
        options: {},
        data: []
      },

      // 年龄占比
      age: {
        options: {},
        data: []
      },

      // 操作系统
      os: {
        options: {},
        data: []
      },

      phones: {
        options: {},
        data: [],
        top: {
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
    // 时长分段
    const DURATION_TYPES = ['1-10秒', '10-60秒', '1-3分', '3-10分', '10-30分', '30分钟以上']
    // 时长日期
    const DURATION_DATES = ['06-02', '04-03']
    // 频率分段
    const TIMES_TYPES = ['1-2', '3-5', '6-10', '11-15', '16-20', '20+']
    // 频率日期
    const TIMES_DATES = ['06-02', '04-03']
    // 年龄段
    const AGE_TYPES = ['19岁以下', '20-29岁', '30-39岁', '40-49岁', '50岁以上']
    // 系统类型
    const OS_TYPES = ['Android', 'iOS']

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

    // var tplUserTrends = {
    //   'change|-200-200': 0,
    //   'total|10-1000': 1000
    // }
    // 今日
    this.trends.users.today = {
      info: {
        change: 3,
        total: 32
      }
    }
    // 平均
    this.trends.users.avg = {
      info: {
        change: 2.4,
        total: 32.7
      }
    }

    // 用户活跃时间点 -----------------------------------------------------
    var timePointOptions = {
      props: {
        height: 300,
        plotCfg: {
          margin: [40, 0, 50, 60]
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
      position: 'date*count'
    }
    this.timePoint.data = Mock.mock({
      'list|24': [{
        'date|+1': 0,
        'count|+1': [7, 1, 1, 3, 2, 1, 11, 10, 17, 22, 29, 33, 29, 33, 29, 38, 19, 33, 29, 33, 29, 38, 19, 11]
      }]
    }).list
    this.timePoint.options = timePointOptions

    // 用户参与度-单次app使用时长 -----------------------------------------------------
    var durationOptions = {
      props: {
        height: 300,
        plotCfg: {
          margin: [60, 0, 40, 60]
        }
      },
      defs: {
        'duration': {
          type: 'cat',
          alias: '时长'
        },
        'count': {
          alias: '用户数',
          min: 0
        },
        'date': {
          alias: '日期'
        }
      },
      position: 'duration*count',
      color: 'date'
    }
    var durationData = []
    DURATION_DATES.forEach((item) => {
      durationData = durationData.concat(Mock.mock({
        'list|6': [{
          'duration|+1': DURATION_TYPES,
          'count|+1': [0, 0, 1, 0, 1, 167],
          'date': item
        }]
      }).list)
    })
    this.duration.data = durationData
    this.duration.options = durationOptions

    // 用户参与度-app使用频率 -----------------------------------------------------
    var timesOptions = {
      props: {
        height: 300,
        plotCfg: {
          margin: [60, 0, 40, 60]
        }
      },
      defs: {
        'times': {
          type: 'cat',
          alias: '频率'
        },
        'count': {
          alias: '用户数',
          min: 0
        },
        'date': {
          alias: '日期'
        }
      },
      position: 'times*count',
      color: 'date'
    }
    var timesData = []
    TIMES_DATES.forEach((item) => {
      timesData = timesData.concat(Mock.mock({
        'list|6': [{
          'times|+1': TIMES_TYPES,
          'count|+1': [0, 0, 1, 0, 33, 144],
          'date': item
        }]
      }).list)
    })
    this.times.data = timesData
    this.times.options = timesOptions

    // 性别占比 -----------------------------------------------------
    var sexOptions = {
      horizontal: true,
      stack: true,
      props: {
        height: 300,
        plotCfg: {
          margin: [40, 20, 80, 60]
        }
      },
      defs: {
        'sex': {
          type: 'cat',
          alias: '性别'
        },
        'count': {
          alias: '数量',
          min: 0
        }
      },
      position: 'sex*count',
      color: 'sex'
    }
    this.sex.data = Mock.mock({
      'list|2': [{
        'sex|+1': ['女性', '男性'],
        'count|1600-2200': 10
      }]
    }).list
    this.sex.options = sexOptions

    // 年龄占比 -----------------------------------------------------
    var ageOptions = {
      props: {
        height: 300,
        plotCfg: {
          margin: [40, 0, 50, 50]
        }
      },
      defs: {
        'age': {
          type: 'cat',
          alias: '年龄'
        },
        'count': {
          alias: '数量',
          min: 0
        }
      },
      position: window.G2.Stat.summary.percent('age*count')
    }
    this.age.data = Mock.mock({
      'list|5': [{
        'age|+1': AGE_TYPES,
        'count|+1': [120, 703, 635, 88, 7]
      }]
    }).list
    this.age.options = ageOptions

    // 终端分布-系统 -----------------------------------------------------
    var osOptions = {
      horizontal: true,
      stack: true,
      props: {
        height: 200,
        plotCfg: {
          margin: [40, 20, 80, 100]
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
        'os': {
          alias: '系统'
        }
      },
      position: 'date*count',
      color: 'os'
    }
    var osData = []
    OS_TYPES.forEach((item) => {
      osData = osData.concat(Mock.mock({
        'list|1': [{
          'date|+1': ['06-03(昨日)'],
          'count|100-200': 10,
          'os': item
        }]
      }).list)
    })
    this.os.data = osData
    this.os.options = osOptions

    // 终端分布-机型 -----------------------------------------------------
    var phonesData = []
    let PHONE_TYPES = ['iphone6', 'iphone6s', 'iphone6sp', 'iphone6sp', 'iphone5s', '三星S6', '三星S5', 'OPPO_R9', '魅族3S', '三星GalaxyA9', '三星GalaxyC7000', '小米4s', '小米4']
    for (let i = 0; i < PHONE_TYPES.length; i++) {
      let name = PHONE_TYPES[i]
      phonesData.push({
        'name': name,
        'value': Math.round(Math.random() * 1000)
      })
    }
    this.phones.data = phonesData
    this.phones.options = {
      props: {
        height: 480,
        plotCfg: {
          margin: 0
        }
      },
      legend: false
    }

    // Top10
    var phonesTopOptions = {
      props: {
        plotCfg: {
          margin: [0, 0, 0, 160]
        }
      },
      defs: {
        'name': {
          type: 'cat',
          alias: '机型'
        },
        'value': {
          alias: '数量',
          min: 0
        }
      },
      position: 'name*value'
    }
    var phonesTopData = _.slice(_.orderBy(phonesData, ['value'], ['asc']), phonesData.length - 11, phonesData.length - 1)
    this.phones.top = {
      data: phonesTopData,
      options: _.merge({}, phonesTopOptions, {
        props: {
          height: 360
        },
        color: 'name',
        horizontal: true,
        // axis: false,
        legend: false
      })
    }
  },

  methods: {
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/common'

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
