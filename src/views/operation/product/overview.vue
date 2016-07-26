<template>
  <div class="main">
    <panel>
      <div class="product-card">
        <div class="thumb"><img src="../../../assets/images/device_thumb.png"/></div>
        <div class="info">
          <h2>{{ product.name }} <a href="#" @click.prevent="editProduct" class="fa fa-edit"></a></h2>
          <div class="desc">{{ product.description }}</div>
          <div class="row statistic changetop">
            <div class="col-6">
              <statistic :info="statistic.devices.total.info" title="设备总数" tooltip="设备总数说明" color="green" :has-chart="true" align="left" :titletop="true">
                <interval :data="statistic.devices.total.data" :options="statistic.devices.total.options"></interval>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :info="statistic.devices.activated.info" title="激活设备数" tooltip="激活设备总数说明" color="blue" :has-chart="true" align="left" :titletop="true">
                <interval :data="statistic.devices.activated.data" :options="statistic.devices.activated.options"></interval>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :info="statistic.devices.online.info" title="在线设备数" tooltip="在线设备总数说明" color="orange" :has-chart="true" :titletop="true">
                <interval :data="statistic.devices.online.data" :options="statistic.devices.online.options"></interval>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :info="statistic.users.info" title="用户总数" tooltip="用户总数说明" :has-chart="true" :titletop="true">
                <interval :data="statistic.users.data" :options="statistic.users.options"></interval>
              </statistic>
            </div>
          </div>
        </div>
      </div>
    </panel>

    <div class="panel mt20">
      <div class="panel-hd bordered">
        <h2 class="col-4">产品趋势</h2>
        <div class="fr col-20 products-trends-head">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="trends.products.period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-14">
            <time-line :data="trends.users.data" type="smooth"></time-line>
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
      </div>
    </div>

    <div class="panel mt20">
      <div class="panel-hd bordered">
        <h2 class="col-4">产品活跃度</h2>
        <div class="fr col-20 products-trends-head">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="trends.products.period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-14">
            <time-line :data="trends.products.data" type="smooth"></time-line>
          </div>
          <div class="col-10">
            <pie :data="proportion.devices.activated.data"></pie>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import locales from 'consts/locales/index'
import api from 'api'
import Mock from 'mockjs'
import store from 'store/index'
import { removeProduct, updateProduct } from 'store/actions/products'
import Select from 'components/Select'
import Modal from 'components/Modal'
import Panel from 'components/Panel'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Statistic from 'components/Statistic'
import Tooltip from 'components/Tooltip'
import TimeLine from 'components/g2-charts/TimeLine'
import Interval from 'components/g2-charts/Interval'
import Pie from 'components/g2-charts/Pie'
import ChinaMap from 'components/g2-charts/ChinaMap'
import { globalMixins } from 'src/mixins'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'Overview',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  store,

  vuex: {
    actions: {
      removeProduct,
      updateProduct
      // setCurrProduct
    }
  },

  components: {
    Modal,
    Panel,
    RadioButtonGroup,
    Statistic,
    Tooltip,
    TimeLine,
    Interval,
    ChinaMap,
    Pie,
    'v-select': Select
  },

  data () {
    return {
      deviceTypes: locales[Vue.config.lang].data.DEVICE_TYPES,
      delChecked: false,
      product: {},
      showEditModal: false,
      editModel: {
        is_allow_multi_admin: false,
        ifsnapshot: false,
        name: '',
        description: '',
        link_type: '',
        is_registerable: false,
        is_active_register: false,
        is_release: false,
        id: ''
      },
      originEditModel: {},
      editValidation: {},
      // 统计
      statistic: {
        // 用户总数
        users: {
          options: {},
          info: {},
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

      // 占比
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

      // 用户反馈
      feedback: {
        options: {},
        data: [],
        today: {
          info: {}
        },
        unread: {
          info: {}
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

      // 产品活跃时间点
      timePoint: {
        options: {},
        period: 1,
        data: []
      },

      // 产品使用时长
      duration: {
        options: {},
        period: 7,
        data: []
      },

      // 产品使用次数
      times: {
        options: {},
        period: 7,
        data: []
      }
    }
  },

  // computed: {
  //   isProduct1 () {
  //     return this.currentProduct.id === '1607d2ae72fd4a001607d2ae72fd4a01'
  //   }
  // },

  route: {
    data () {
      this.getProduct()
    }
  },

  ready () {
    // alert(this.isProduct1)
    // 配色
    const COLORS = {
      'gray': '#383838',
      'green': '#4CBF5E',
      'blue': '#307FC1',
      'orange': '#F69052'
    }
    // 反馈类型
    const FEEDBACK_TYPES = ['维保', '故障', '个人意见']
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
    //   'total|100000-1000000': 100000
    // }
    var tplStatData = {
      'list|20': [{
        'date|+1': genDates(20),
        'count|10-200': 10
      }]
    }
    this.statistic.users = {
      info: {
        change: 34,
        total: 2682
      },
      data: Mock.mock({
        'list|20': [{
          'date|+1': genDates(20),
          'count|+1': [127, 106, 157, 64, 124, 157, 64, 124, 58, 127, 106, 58, 74, 88, 157, 64, 124, 58, 74, 88]
        }]
      }).list,
      options: _.merge({}, statisticOptions, {color: COLORS['gray']})
    }
    this.statistic.devices.total = {
      info: {
        change: 139,
        total: 25836
      },
      data: Mock.mock(tplStatData).list,
      options: _.merge({}, statisticOptions, {color: COLORS['green']})
    }
    this.statistic.devices.activated = {
      info: {
        change: 53,
        total: 10334
      },
      data: Mock.mock(tplStatData).list,
      options: _.merge({}, statisticOptions, {color: COLORS['blue']})
    }
    this.statistic.devices.online = {
      info: {
        change: 8,
        total: 1689
      },
      data: Mock.mock(tplStatData).list,
      options: _.merge({}, statisticOptions, {color: COLORS['orange']})
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

    // 用户反馈 -----------------------------------------------------
    var feedbackOptions = {
      stack: true,
      props: {
        plotCfg: {
          margin: [60, 0, 80, 60]
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
          alias: '反馈类型'
        }
      },
      position: 'date*count',
      color: 'type'
    }
    var feedbackData = []
    feedbackData = feedbackData.concat(Mock.mock({
      'list|7': [{
        'date|+1': genDates(7),
        'count|+1': [12, 18, 9, 15, 16, 18, 11],
        'type': FEEDBACK_TYPES[0]
      }]
    }).list)
    feedbackData = feedbackData.concat(Mock.mock({
      'list|7': [{
        'date|+1': genDates(7),
        'count|+1': [23, 47, 32, 18, 27, 45, 33],
        'type': FEEDBACK_TYPES[1]
      }]
    }).list)
    feedbackData = feedbackData.concat(Mock.mock({
      'list|7': [{
        'date|+1': genDates(7),
        'count|+1': [2, 4, 5, 3, 7, 9, 4],
        'type': FEEDBACK_TYPES[2]
      }]
    }).list)
    this.feedback.data = feedbackData
    this.feedback.options = feedbackOptions

    // var tplFeedback = {
    //   'change|-200-200': 0,
    //   'total|10-1000': 1000
    // }
    // 今日
    this.feedback.today = {
      info: {
        change: 2,
        total: 23
      }
    }
    // 未读
    this.feedback.unread = {
      info: {
        change: 7,
        total: 44
      }
    }

    // 产品趋势分析 -----------------------------------------------------

    // 趋势图表配置
    var productTrendsOptions = {
      props: {
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
        'product': {
          alias: '产品'
        }
      },
      position: 'date*count',
      color: 'product'
    }
    this.trends.products.data = Mock.mock({
      'list|7': [{
        'date|+1': genDates(7),
        'count|+1': [24, 14, 25, 34, 17, 29, 33],
        'product': PRODUCTS[0]
      }]
    }).list
    this.trends.products.options = productTrendsOptions

    // var tplPoductTrends = {
    //   'change|-200-200': 0,
    //   'total|10-1000': 1000
    // }
    // 今日
    this.trends.products.today = {
      info: {
        change: 2,
        total: 24
      }
    }
    // 平均
    this.trends.products.avg = {
      info: {
        change: 6,
        total: 28
      }
    }

    // 产品活跃时间点 -----------------------------------------------------
    var timePointOptions = {
      props: {
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
        'product': {
          alias: '产品'
        }
      },
      position: 'date*count',
      color: 'product'
    }
    var timePointData = []
    timePointData = timePointData.concat(Mock.mock({
      'list|24': [{
        'date|+1': 0,
        'count|+1': [234, 245, 232, 239, 227, 234, 248, 262, 254, 268, 308, 345, 446, 487, 436, 460, 435, 355, 368, 327, 293, 276, 244, 245],
        'product': PRODUCTS[0]
      }]
    }).list)
    // timePointData = timePointData.concat(Mock.mock({
    //   'list|24': [{
    //     'date|+1': 0,
    //     'count|+1': [1362, 854, 427, 320, 197, 184, 187, 176, 167, 188, 197, 204, 248, 262, 254, 288, 308, 654, 867, 1590, 1901, 2104, 1887, 1603],
    //     'product': PRODUCTS[1]
    //   }]
    // }).list)
    // PRODUCTS.forEach((item) => {
    //   timePointData = timePointData.concat(Mock.mock({
    //     'list|24': [{
    //       'date|+1': 0,
    //       'count|+1': 10,
    //       'product': item
    //     }]
    //   }).list)
    // })
    this.timePoint.data = timePointData
    this.timePoint.options = timePointOptions

    // 产品使用时长 -----------------------------------------------------
    var durationOptions = {
      horizontal: true,
      stack: true,
      props: {
        plotCfg: {
          margin: [40, 0, 80, 80]
        }
      },
      defs: {
        'duration': {
          type: 'cat',
          alias: '使用次数'
        },
        'count': {
          alias: '数量',
          min: 0
        },
        'product': {
          alias: '产品'
        }
      },
      position: 'duration*count',
      color: 'product'
    }
    var durationData = []
    durationData = durationData.concat(Mock.mock({
      'list|6': [{
        'duration|+1': ['8小时以上', '6-7小时', '4-5小时', '3-4小时', '2-3小时', '1小时内'],
        'count|+1': [109, 223, 324, 678, 867, 1457],
        'product': PRODUCTS[0]
      }]
    }).list)
    durationData = durationData.concat(Mock.mock({
      'list|6': [{
        'duration|+1': ['8小时以上', '6-7小时', '4-5小时', '3-4小时', '2-3小时', '1小时内'],
        'count|+1': [245, 432, 867, 1762, 2345, 5752],
        'product': PRODUCTS[1]
      }]
    }).list)
    // PRODUCTS.forEach((item) => {
    //   durationData = durationData.concat(Mock.mock({
    //     'list|6': [{
    //       'duration|+1': ['8小时以上', '6-7小时', '4-5小时', '3-4小时', '2-3小时', '1小时内'],
    //       'count|100-200': 10,
    //       'product': item
    //     }]
    //   }).list)
    // })
    this.duration.data = durationData
    this.duration.options = durationOptions

    // 产品使用次数 -----------------------------------------------------
    var timesOptions = {
      stack: true,
      props: {
        plotCfg: {
          margin: [40, 0, 80, 60]
        }
      },
      defs: {
        'times': {
          type: 'cat',
          alias: '使用次数'
        },
        'count': {
          alias: '数量',
          min: 0
        },
        'product': {
          alias: '产品'
        }
      },
      position: 'times*count',
      color: 'product'
    }
    var timesData = []
    timesData = timesData.concat(Mock.mock({
      'list|6': [{
        'times|+1': ['1', '2-10', '10-15', '16-20', '20-25', '25以上'],
        'count|+1': [1457, 867, 678, 324, 223, 109],
        'product': PRODUCTS[0]
      }]
    }).list)
    timesData = timesData.concat(Mock.mock({
      'list|6': [{
        'times|+1': ['1', '2-10', '10-15', '16-20', '20-25', '25以上'],
        'count|+1': [5752, 2345, 1762, 867, 432, 245],
        'product': PRODUCTS[1]
      }]
    }).list)
    // PRODUCTS.forEach((item) => {
    //   timesData = timesData.concat(Mock.mock({
    //     'list|6': [{
    //       'times|+1': ['1', '2-10', '10-15', '16-20', '20-25', '25以上'],
    //       'count|100-200': 10,
    //       'product': item
    //     }]
    //   }).list)
    // })
    this.times.data = timesData
    this.times.options = timesOptions

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

    this.trends.products.data = Mock.mock({
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
        'count|+1': [6, 8, 9, 3, 9, 3, 6, 38]
      }]
    }).list
  },

  methods: {
    // 获取当前产品
    getProduct () {
      api.product.getProduct(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.product = res.data
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 编辑表单钩子
    editFormHook (form) {
      this.editForm = form
    },

    // 关闭编辑浮层并净化编辑表单
    resetEdit () {
      this.editing = false
      this.showEditModal = false
      this.delChecked = false
      setTimeout(() => {
        this.editModel = this.originEditModel
      }, 1000)
    },

    // 初始化产品编辑表单
    editProduct () {
      api.snapshot.getRule(this.$route.params.id).then((res) => {
        // console.log(res.data.list[0] && res.data.list[0].rule)
        this.showEditModal = true
        // this.editModel = _.clone(this.product)
        this.editModel.ifsnapshot = false
        this.editModel.name = this.product.name
        this.editModel.description = this.product.description
        this.editModel.link_type = this.product.link_type
        this.editModel.is_registerable = this.product.is_registerable
        this.editModel.is_active_register = this.product.is_active_register
        this.editModel.is_release = this.product.is_release
        this.editModel.id = this.$route.params.id
        this.editModel.is_allow_multi_admin = this.product.is_allow_multi_admin
        this.originEditModel = _.clone(this.editModel)
        if (res.data.list.length) {
          if (res.data.list[0].rule === 0) {
            this.editModel.ifsnapshot = false
          } else {
            this.editModel.ifsnapshot = true
          }
        } else {
          this.editModel.ifsnapshot = false
        }
      })
    },

    // 取消编辑
    onEditCancel () {
      this.resetEdit()
      // this.product = this.originEditModel
    },

    // 提交更新
    onEditSubmit () {
      if (this.delChecked && !this.editing) {
        this.editing = true
        var result = window.confirm('确认删除该产品吗?')
        if (result === true) {
          api.product.deleteProduct(this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.removeProduct(this.product)
              this.$route.router.go('/dashboard')
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else {
          this.editing = false
        }
      } else if (this.editValidation.$valid && !this.editing) {
        this.editing = true
        if (this.editModel.link_type === 5) {
          api.product.updateProduct(this.editModel).then(() => {
            api.product.getProduct(this.$route.params.id).then((res) => {
              if (res.status === 200) {
                this.product = res.data
                this.resetEdit()
                this.updateProduct(this.product)
                // this.setCurrProduct(this.product)
              }
            })
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else {
          var model = {
            name: this.editModel.name,
            description: this.editModel.description,
            link_type: this.editModel.link_type,
            is_registerable: this.editModel.is_registerable,
            is_release: this.editModel.is_release,
            is_allow_multi_admin: this.editModel.is_allow_multi_admin,
            id: this.editModel.id
          }
          api.product.updateProduct(model).then(() => {
            api.product.getProduct(this.$route.params.id).then((res) => {
              if (res.status === 200) {
                this.product = res.data
                this.resetEdit()
                this.updateProduct(this.product)
                this.setCurrProduct(this.product)
              }
            })
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
        if (this.editModel.ifsnapshot) {
          var index = []
          for (let i = 0; i < 45; i++) {
            index.push(i)
          }
          var params = {
            rule: 3,
            interval: 30,
            storage: {
              // limit: 0,
              expire: 86400
            },
            datapoint: index
          }
          api.snapshot.getRule(this.$route.params.id).then((res) => {
            if (res.data.list.length === 0) {
              console.log(params)
              // console.log(res)
              api.snapshot.createRule(this.$route.params.id, params).then((res) => {
              })
            } else {
              var index = []
              for (let i = 0; i < 45; i++) {
                index.push(i)
              }
              var newParams = {
                _id: res.data.list[0].id,
                rule: 3,
                interval: 30,
                storage: {
                  // limit: 0,
                  expire: 86400
                },
                datapoint: index
              }
              api.snapshot.updateRule(this.$route.params.id, newParams).then((res) => {
                console.log(111)
              })
            }
          })
        } else {
          api.snapshot.getRule(this.$route.params.id).then((res) => {
            if (res.data.list.length === 0) {
              console.log(11)
            } else {
              var index = []
              for (let i = 0; i < 45; i++) {
                index.push(i)
              }
              var morNewParams = {
                _id: res.data.list[0].id,
                rule: 0,
                interval: 30,
                storage: {
                  // limit: 0,
                  expire: 86400
                },
                datapoint: index
              }
              api.snapshot.updateRule(this.$route.params.id, morNewParams).then((res) => {
                console.log(111)
              })
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'

.product-card
  clearfix()
  padding 35px 0 20px

  .x-statistic
    & > .info
      font-size 36px
      margin 7px 0

    & > .chart
      size 120px 30px

  .thumb
    float left
    size 200px

    img
      size 200px
      display block

  .info
    margin-left 220px

    h2
      margin 0
      font-size 24px
      font-weight normal

    .desc
      margin-bottom 10px
      color gray-light

.with-stats
  .stats
    absolute right -10px top -40px
    width 330px
    z-index 10

// 产品趋势
.product-trends
  .stats
    width 400px

.products-trends-head
  line-height 28px
  display inline-block
  text-align right

/*.changetop
  .change
    top -55px!important  */
</style>
