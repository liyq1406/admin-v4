<template>
  <div class="main">
    <panel>
      <div class="product-card">
        <div class="thumb"><img :src="deviceThumb"/></div>
        <div class="info">
          <h2>{{ currentProduct.name }} <a href="#" @click.prevent="editProduct" class="fa fa-edit"></a></h2>
          <div class="desc">{{ currentProduct.description }}</div>

          <!-- Start: 产品信息统计 -->
          <div class="row">
            <div class="col-6">
              <statistic :total="statistic.devices.sum.total" :change="statistic.devices.sum.change" title="设备总数" tooltip="设备总数说明" color="gray" :has-chart="true" align="left" :titletop="true">
                <interval-icon color="gray" :height="22"></interval-icon>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="statistic.devices.activated.total" :change="statistic.devices.activated.change" title="激活设备数" tooltip="激活设备总数说明" color="green" :has-chart="true" align="left" :titletop="true">
                <interval-icon color="green" :height="22"></interval-icon>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="statistic.devices.online.total" :change="statistic.devices.online.change" title="在线设备数" tooltip="在线设备总数说明" color="blue" :has-chart="true" :titletop="true">
                <interval-icon color="blue" :height="22"></interval-icon>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="statistic.users.total" :change="statistic.users.change" title="用户总数" tooltip="用户总数说明" color="orange" :has-chart="true" :titletop="true">
                <interval-icon color="orange" :height="22"></interval-icon>
              </statistic>
            </div>
          </div>
          <!-- End: 产品信息统计 -->
        </div>
      </div>
    </panel>

    <div class="panel mt20 no-split-line">
      <div class="panel-hd">
        <h2 class="col-4">产品趋势</h2>
      </div>
      <div class="panel-bd">
        <div class="tab-s2 tab-s2-full mb5">
          <div class="actions">
            <radio-button-group :items="locales.data.PERIODS" :value.sync="trends.activated.period" @select="getActivatedTrends(trendTabs.curr+1)"></radio-button-group>
          </div>
          <ul>
            <li v-for="label in trendTabs.labels" :class="{'active':trendTabs.curr===$index}" @click="getActivatedTrends($index+1)">{{ label }}</li>
          </ul>
        </div>
        <div class="row">
          <div class="col-offset-12 col-12 row">
            <div class="col-12">
              <statistic :total="trends.activated.today.total" :change="trends.activated.today.change" title="今日增长" tooltip="今日增长" color="green" :inline="true"></statistic>
            </div>
            <div class="col-12">
              <statistic :total="trends.activated.avg.total" :title="trends.activated.period+'天平均增长'" :tooltip="trends.activated.period+'天平均增长'" color="orange" :inline="true"></statistic>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-24">
            <time-line :data="trends.activated.data" :margin="customMargin"></time-line>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="panel mt20">
      <div class="panel-hd bordered">
        <h2 class="col-4">产品活跃度</h2>
        <div class="fr col-20 products-trends-head">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="trends.active.period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-14">
            <time-line :data="trends.products.data" type="smooth" :margin="customMargin"></time-line>
          </div>
          <div class="col-10">
            <pie :data="proportion.devices.activated.data"></pie>
          </div>
        </div>
      </div>
    </div> -->

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
// import Mock from 'mockjs'
import store from 'store/index'
import { removeProduct, updateProduct, getCurrProduct } from 'store/actions/products'
import Select from 'components/Select'
import Modal from 'components/Modal'
import Panel from 'components/Panel'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Statistic from 'components/Statistic2'
import Tooltip from 'components/Tooltip'
import TimeLine from 'components/g2-charts/TimeLine'
import Interval from 'components/g2-charts/Interval'
import IntervalIcon from 'components/g2-charts/IntervalIcon'
import Pie from 'components/g2-charts/Pie'
import ChinaMap from 'components/g2-charts/ChinaMap'
import defaultDeviceThumb from 'assets/images/device_thumb.png'
import { globalMixins } from 'src/mixins'
import { productSummaryMixin } from './mixins'
// import moment from 'moment'
import _ from 'lodash'
import { createDayRange, beautify } from 'helpers/utils'

export default {
  name: 'Overview',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins, productSummaryMixin],

  store,

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    },
    actions: {
      removeProduct,
      updateProduct,
      getCurrProduct
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
    IntervalIcon,
    ChinaMap,
    Pie,
    'v-select': Select
  },

  data () {
    return {
      deviceThumb: defaultDeviceThumb,
      trendTabs: {
        curr: 0,
        labels: ['激活设备', '累计激活']
      },
      customMargin: [30, 10, 30, 30],
      deviceTypes: locales[Vue.config.lang].data.DEVICE_TYPES,
      delChecked: false,
      // product: {},
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
          total: 0,
          change: 0,
          data: []
        },
        // 设备
        devices: {
          // 总数
          sum: {
            options: {},
            total: 0,
            change: 0,
            data: []
          },
          // 激活设备
          activated: {
            options: {},
            total: 0,
            change: 0,
            data: []
          },
          // 在线设备
          online: {
            options: {},
            total: 0,
            change: 0,
            data: []
          }
        }
      },

      // 趋势
      trends: {
        // 产品激活
        activated: {
          period: 7,
          options: {},
          data: [],
          today: {
            total: 0,
            change: 0
          },
          avg: {
            total: 0,
            change: 0
          }
        },

        // 产品活跃
        active: {
          period: 7,
          options: {},
          data: []
        }
      }
    }
  },

  route: {
    data () {
      this.getCurrProduct(this.$route.params.id)
      this.getActivatedTrends(1)

      // getProductSummary 方法来自 productSummaryMixin
      this.getProductSummary()
    }
  },

  computed: {

  },

  ready () {
    // alert(this.isProduct1)
    // 配色
    // const COLORS = {
    //   'gray': '#383838',
    //   'green': '#4CBF5E',
    //   'blue': '#307FC1',
    //   'orange': '#F69052'
    // }
    // 产品
    // const PRODUCTS = ['空气净化器', 'WI-FI智能灯']

    /**
     * 生成日期数组，用于模拟横轴日期数据
     * @param  {Number} n 数量
     * @return {Array}    日期数组
     */
    // var genDates = (n) => {
    //   var result = []
    //   for (var i = n; i >= 1; i--) {
    //     result.push(moment().subtract(i, 'days').format('MM-DD'))
    //   }
    //   return result
    // }

    // 顶部4个统计 -----------------------------------------------------

    // 图表基本配置
    // var statisticOptions = {
    //   props: {
    //     height: 30,
    //     plotCfg: {
    //       margin: [0, 0, 0, 0]
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
    //     }
    //   },
    //   axis: false,
    //   legend: false,
    //   tooltip: false,
    //   position: 'date*count'
    // }
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
    // this.statistic.users = {
    //   info: this.statistic.users.info,
    //   data: Mock.mock({
    //     'list|20': [{
    //       'date|+1': genDates(20),
    //       'count|+1': [127, 106, 157, 64, 124, 157, 64, 124, 58, 127, 106, 58, 74, 88, 157, 64, 124, 58, 74, 88]
    //     }]
    //   }).list,
    //   options: _.merge({}, statisticOptions, {color: COLORS['gray']})
    // }
    // this.statistic.devices.total = {
    //   info: this.statistic.devices.total.info,
    //   data: Mock.mock(tplStatData).list,
    //   options: _.merge({}, statisticOptions, {color: COLORS['green']})
    // }
    // this.statistic.devices.activated = {
    //   info: this.statistic.devices.activated.info,
    //   data: Mock.mock(tplStatData).list,
    //   options: _.merge({}, statisticOptions, {color: COLORS['blue']})
    // }
    // this.statistic.devices.online = {
    //   info: this.statistic.devices.online.info,
    //   data: Mock.mock(tplStatData).list,
    //   options: _.merge({}, statisticOptions, {color: COLORS['orange']})
    // }

    // 产品信息占比 -----------------------------------------------------
    // this.proportion.devices.activated = {
    //   data: [
    //     {name: '已激活设备数', value: 29887},
    //     {name: '未激活设备数', value: 28538}
    //   ]
    // }
    // this.proportion.devices.online = {
    //   data: [
    //     {name: '当前离线', value: 25682},
    //     {name: '当前在线', value: 4205}
    //   ]
    // }

    // 产品趋势分析 -----------------------------------------------------

    // 趋势图表配置
    this.trends.activated.options = {
      props: {
        plotCfg: {
          margin: [60, 0, 50, 60]
        }
      },
      defs: {
        'date': {
          type: 'time',
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
    // this.trends.products.data = Mock.mock({
    //   'list|7': [{
    //     'date|+1': genDates(7),
    //     'count|+1': [24, 14, 25, 34, 17, 29, 33],
    //     'product': PRODUCTS[0]
    //   }]
    // }).list

    // var tplPoductTrends = {
    //   'change|-200-200': 0,
    //   'total|10-1000': 1000
    // }
    // 今日
    this.trends.activated.today = {
      change: 2,
      total: 24
    }
    // 平均
    this.trends.activated.avg = {
      change: 6,
      total: 28
    }

    // 产品活跃时间点 -----------------------------------------------------
    // var timePointOptions = {
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
    // var timePointData = []
    // timePointData = timePointData.concat(Mock.mock({
    //   'list|24': [{
    //     'date|+1': 0,
    //     'count|+1': [234, 245, 232, 239, 227, 234, 248, 262, 254, 268, 308, 345, 446, 487, 436, 460, 435, 355, 368, 327, 293, 276, 244, 245],
    //     'product': PRODUCTS[0]
    //   }]
    // }).list)
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
    // this.timePoint.data = timePointData
    // this.timePoint.options = timePointOptions

    // 产品使用次数 -----------------------------------------------------
    // var timesOptions = {
    //   stack: true,
    //   props: {
    //     plotCfg: {
    //       margin: [40, 0, 80, 60]
    //     }
    //   },
    //   defs: {
    //     'times': {
    //       type: 'cat',
    //       alias: '使用次数'
    //     },
    //     'count': {
    //       alias: '数量',
    //       min: 0
    //     },
    //     'product': {
    //       alias: '产品'
    //     }
    //   },
    //   position: 'times*count',
    //   color: 'product'
    // }
    // var timesData = []
    // timesData = timesData.concat(Mock.mock({
    //   'list|6': [{
    //     'times|+1': ['1', '2-10', '10-15', '16-20', '20-25', '25以上'],
    //     'count|+1': [1457, 867, 678, 324, 223, 109],
    //     'product': PRODUCTS[0]
    //   }]
    // }).list)
    // timesData = timesData.concat(Mock.mock({
    //   'list|6': [{
    //     'times|+1': ['1', '2-10', '10-15', '16-20', '20-25', '25以上'],
    //     'count|+1': [5752, 2345, 1762, 867, 432, 245],
    //     'product': PRODUCTS[1]
    //   }]
    // }).list)
    // PRODUCTS.forEach((item) => {
    //   timesData = timesData.concat(Mock.mock({
    //     'list|6': [{
    //       'times|+1': ['1', '2-10', '10-15', '16-20', '20-25', '25以上'],
    //       'count|100-200': 10,
    //       'product': item
    //     }]
    //   }).list)
    // })
    // this.times.data = timesData
    // this.times.options = timesOptions

    // this.trends.users.data = Mock.mock({
    //   'list|16': [{
    //     'date|+1': [
    //       new Date(2016, 7, 17),
    //       new Date(2016, 7, 18),
    //       new Date(2016, 7, 19),
    //       new Date(2016, 7, 20),
    //       new Date(2016, 7, 21),
    //       new Date(2016, 7, 22),
    //       new Date(2016, 7, 23),
    //       new Date(2016, 7, 24)
    //     ],
    //     'count|+1': [38, 19, 33, 29, 33, 29, 10, 12]
    //   }]
    // }).list

    // var tplUserTrends = {
    //   'change|-200-200': 0,
    //   'total|10-1000': 1000
    // }
    // 今日
    // this.trends.users.today = {
    //   info: {
    //     change: 8,
    //     total: 32
    //   }
    // }
    // // 平均
    // this.trends.users.avg = {
    //   info: {
    //     change: 12,
    //     total: 43
    //   }
    // }

    // this.trends.activated.data = Mock.mock({
    //   'list|16': [{
    //     'date|+1': [
    //       new Date(2016, 7, 17),
    //       new Date(2016, 7, 18),
    //       new Date(2016, 7, 19),
    //       new Date(2016, 7, 20),
    //       new Date(2016, 7, 21),
    //       new Date(2016, 7, 22),
    //       new Date(2016, 7, 23),
    //       new Date(2016, 7, 24)
    //     ],
    //     'count|+1': [6, 8, 9, 3, 9, 3, 6, 38]
    //   }]
    // }).list
  },

  methods: {
    /**
     * 获取产品激活趋势
     * @param  {Number} type 类型
     */
    getActivatedTrends (type) {
      this.trendTabs.curr = type - 1
      let range = createDayRange(0, this.trends.activated.period)
      api.statistics.getProductTrend(this.$route.params.id, range.start, range.end).then((res) => {
        if (res.status === 200) {
          let trendData = beautify(res.data, this.trends.activated.period)
          this.trends.activated.data = trendData.map((item) => {
            return {
              date: item.day,
              count: item.activated,
              product: this.currentProduct.name
            }
          })
        }
      })
    },

    // 获取当前产品
    // getProduct () {
    //   api.product.getProduct(this.$route.params.id).then((res) => {
    //     if (res.status === 200) {
    //       this.product = res.data
    //     }
    //   }).catch((res) => {
    //     this.handleError(res)
    //   })
    // },

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
        this.editModel.name = this.currentProduct.name
        this.editModel.description = this.currentProduct.description
        this.editModel.link_type = this.currentProduct.link_type
        this.editModel.is_registerable = this.currentProduct.is_registerable
        this.editModel.is_active_register = this.currentProduct.is_active_register
        this.editModel.is_release = this.currentProduct.is_release
        this.editModel.id = this.$route.params.id
        this.editModel.is_allow_multi_admin = this.currentProduct.is_allow_multi_admin
        this.originEditModel = _.clone(this.editModel)

        // TODO: 优化逻辑
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
              this.removeProduct(this.currentProduct)
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
                // this.product = res.data
                this.resetEdit()
                this.updateProduct(res.data)
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
                // this.product = res.data
                this.resetEdit()
                this.updateProduct(res.data)
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
                console.log('Update rule')
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
  padding-top 15px

  .x-statistic
    padding 5px 0
    margin-right 30px

    & > .info
      font-size 36px
      margin 7px 0

    & > .change
      top 5px

    .chart
      size 85px 20px

  .col-6 + .col-6
    .x-statistic
      &:after
        left -30px

  .thumb
    float left
    size 200px

    img
      size 200px
      display block

  .info
    margin-left 240px

    h2
      margin 10px 0 0
      font-size 16px
      font-weight normal

      .fa
        margin-left 5px

    .desc
      min-height 20px
      margin-bottom 15px
      font-size 12px
      color gray-light

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
