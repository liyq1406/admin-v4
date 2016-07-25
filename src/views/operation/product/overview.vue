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

    <div class="row">
      <div class="col-12 with-stats">
        <panel title="告警信息">
          <div class="stats row">
            <div class="col-11 tac">
              <statistic :info="proportion.alerts.today.info" title="今日告警" color="gray" :inline="true" align="center"></statistic>
            </div>
            <div class="col-11 col-offset-2 tac">
              <statistic :info="proportion.alerts.unread.info" title="未读告警" color="orange" :inline="true" align="center"></statistic>
            </div>
          </div>
          <pie :data="proportion.alerts.data"></pie>
        </panel>
      </div>
      <div class="col-12 with-stats">
        <panel title="用户反馈">
          <div class="stats row">
            <div class="col-10 tac">
              <statistic :info="feedback.today.info" title="今日反馈" color="gray" :inline="true" align="center"></statistic>
            </div>
            <div class="col-12 col-offset-2 tac">
              <statistic :info="feedback.unread.info" title="未读反馈" color="orange" :inline="true" align="center"></statistic>
            </div>
          </div>
          <interval :data="feedback.data" :options="feedback.options"></interval>
        </panel>
      </div>
    </div>

    <div class="row with-stats product-trends">
      <div class="col-24">
        <panel title="产品趋势分析">
          <div class="left-actions" slot="left-actions">
            <radio-button-group :items="locales.data.PERIODS" :value.sync="trends.products.period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
            <radio-button-group :items="locales.data.PRODUCT_FILTERS" :value.sync="trends.products.filter"></radio-button-group>
          </div>
          <div class="stats row">
            <div class="col-11 tac">
              <statistic :info="trends.products.today.info" title="今日增长" tooltip="今日增长" color="green" :inline="true" align="center"></statistic>
            </div>
            <div class="col-11 col-offset-2 tac">
              <statistic :info="trends.products.avg.info" title="7天平均增长" tooltip="7天平均增长" color="orange" :inline="true" align="center"></statistic>
            </div>
          </div>
          <line :data="trends.products.data" :options="trends.products.options"></line>
        </panel>
      </div>
    </div>

    <div class="row">
      <div class="col-24">
        <panel title="产品活跃时间点">
          <div class="left-actions" slot="left-actions">
            <radio-button-group :items="locales.data.ACTIVE_PERIODS" :value.sync="timePoint.period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
          </div>
          <line :data="timePoint.data" :options="timePoint.options"></line>
        </panel>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <panel title="产品使用时长">
          <div class="left-actions" slot="left-actions">
            <radio-button-group :items="locales.data.AVG_PERIODS" :value.sync="duration.period"><span slot="label" class="label">平均</span></radio-button-group>
          </div>
          <interval :data="duration.data" :options="duration.options"></interval>
        </panel>
      </div>
      <div class="col-12">
        <panel title="产品使用次数">
          <div class="left-actions" slot="left-actions">
            <radio-button-group :items="locales.data.AVG_PERIODS" :value.sync="times.period"><span slot="label" class="label">平均</span></radio-button-group>
          </div>
          <interval :data="times.data" :options="times.options"></interval>
        </panel>
      </div>
    </div>

    <!-- 编辑产品浮层-->
    <modal :show.sync="showEditModal">
      <h3 slot="header">{{ $t("ui.overview.editForm.header") }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.product.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.product.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel.name" type="text" v-form-ctrl name="name" maxlength="32" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.name')}) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.product.fields.name'), 32]) }}</span><span v-if="editValidation.name.$error.customValidator">{{ $t('ui.validation.format', {field: $t('ui.product.fields.name')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.product.fields.desc") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.product.placeholders.desc')" class="input-text-wrap">
                <textarea v-model="editModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted && editValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.desc')}) }}</span></div>
              <div v-if="editValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.desc')}) }}</span><span v-if="editValidation.description.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.product.fields.desc'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.product.fields.link_type") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :label="deviceTypes[editModel.link_type-1]">
                  <select v-model="editModel.link_type" v-form-ctrl name="link_type">
                    <option v-for="type in deviceTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_registerable" v-model="editModel.is_registerable"/>{{ $t("ui.product.fields.is_registerable") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row" v-show="editModel.link_type===5">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_active_register" v-model="editModel.is_active_register"/>允许动态注册设备
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="ifsnapshot" v-model="editModel.ifsnapshot"/>开启快照功能
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_allow_multi_admin" v-model="editModel.is_allow_multi_admin"/>允许设备多个管理员
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.overview.editForm.del") }}
            </label>
            <label class="del-check">
              <input type="checkbox" name="is_release" v-model="editModel.is_release"/>{{ $t("ui.product.fields.is_release") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
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
import Line from 'components/g2-charts/Line'
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
    Line,
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
        alerts: {
          data: [],
          today: {
            info: {}
          },
          unread: {
            info: {}
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

    // 告警信息占比 -----------------------------------------------------
    this.proportion.alerts.data = [
      {name: '轻度告警', value: 5679},
      {name: '中度告警', value: 2887},
      {name: '重度告警', value: 1047}
    ]
    // var tplAlert = {
    //   'change|-200-200': 0,
    //   'total|10-1000': 1000
    // }
    // 今日
    this.proportion.alerts.today = {
      info: {
        change: 9,
        total: 57
      }
    }
    // 未读
    this.proportion.alerts.unread = {
      info: {
        change: 23,
        total: 104
      }
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

.changetop
  .change
    top -55px!important    
</style>
