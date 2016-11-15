<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>{{ $t('operation.product.overview.main_title') }}</h2>
    </div>
    <div class="panel">
      <div class="product-card">
        <div class="thumb"><img :src="deviceThumb"/></div>
        <div class="info">
          <h2>{{ currentProduct.name }}</h2>
          <div class="desc">{{ currentProduct.description }}</div>

          <!-- Start: 产品信息统计 -->
          <div class="row">
            <div class="col-6">
              <statistic :total="statisticsDisplay[1].total" :change="statisticsDisplay[1].change" :title="statisticsDisplay[1].title" :tooltip="statisticsDisplay[1].tooltip" color="gray" align="left" :titletop="true" :animated="false"></statistic>
            </div>
            <div class="col-6">
              <statistic :total="statisticsDisplay[2].total" :change="statisticsDisplay[2].change" :title="statisticsDisplay[2].title" :tooltip="statisticsDisplay[2].tooltip" color="green" align="left" :titletop="true" :animated="false"></statistic>
            </div>
            <div class="col-6">
              <statistic :total="statisticsDisplay[3].total" :change="statisticsDisplay[3].change" :title="statisticsDisplay[3].title" :tooltip="statisticsDisplay[3].tooltip" color="blue" :titletop="true"
              :animated="false"></statistic>
            </div>
            <div class="col-6">
              <statistic :total="statisticsDisplay[4].total" :change="statisticsDisplay[4].change" :title="statisticsDisplay[4].title" :tooltip="statisticsDisplay[4].tooltip" color="orange" :titletop="true"
              :animated="false"></statistic>
            </div>
          </div>
          <!-- End: 产品信息统计 -->
        </div>
      </div>
    </div>

    <product-trend v-if="isShowTrend"></product-trend>
    <product-active v-if="isShowActive"></product-active>
    <product-distribution v-if="isShowDistribution"></product-distribution>
  </div>
</template>

<script>
import { removeProduct, updateProduct } from 'store/actions/products'
import { setCurrProductMixin } from '../mixins'
import ProductTrend from './components/ProductTrend'
import ProductActive from './components/ProductActive'
import ProductDistribution from './components/ProductDistribution'
import api from 'api'
import customConfig from 'consts/custom-config'
import toFixed from 'filters/to-fixed'

export default {
  name: 'Overview',

  layouts: ['topbar', 'sidebar'],

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [setCurrProductMixin],

  vuex: {
    actions: {
      removeProduct,
      updateProduct
    }
  },

  components: {
    // IntervalIcon,
    ProductTrend,
    ProductActive,
    ProductDistribution
  },

  data () {
    return {
      configLoaded: false,
      quatas: {},
      dpQuatasValues: {
        1: NaN,
        2: NaN,
        3: NaN,
        4: NaN
      },
      isShowTrend: true,
      isShowActive: true,
      isShowDistribution: true,
      // 统计
      statistic: {
        users: {
          total: {
            total: 0,
            change: 0,
            title: '',
            tooltip: ''
          },
          online: {
            total: 0,
            change: 0,
            title: '',
            tooltip: ''
          }
        },
        // 设备
        devices: {
          // 总数
          sum: {
            total: 0,
            change: 0,
            title: '',
            tooltip: ''
          },
          // 激活设备
          activated: {
            total: 0,
            change: 0,
            title: '',
            tooltip: ''
          },
          // 在线设备
          online: {
            total: 0,
            change: 0,
            title: '',
            tooltip: ''
          }
        }
      }
    }
  },

  computed: {
    deviceThumb () {
      let pics = this.currentProduct.pics
      return (pics && pics.length && pics[0]) ? pics[0] : '/static/images/device_thumb.png'
    },
    statisticsDisplay () {
      let res = {
        1: {},
        2: {},
        3: {},
        4: {}
      }
      for (let i in res) {
        res[i] = this.getQuatasValue(this.quatas[i], i)
        if (!isNaN(this.dpQuatasValues[i])) {
          res[i].total = this.dpQuatasValues[i]
        }
      }

      return res
    }
  },

  route: {
    data () {
      this.getCurrProduct(this.$route.params.id)
      this.resetConfig()
      this.getConfig()
      this.getProductSummary()
    }
  },
  ready () {
    this.initTranslate()
  },
  methods: {
    resetConfig () {
      this.configLoaded = false
      for (let i in this.dpQuatasValues) {
        this.dpQuatasValues[i] = NaN
      }
      this.isShowTrend = true
      this.isShowActive = true
      this.isShowDistribution = true
      for (let i in this.statistic.users) {
        this.statistic.users[i].total = this.statistic.users[i].change = 0
        this.statistic.users[i].title = this.statistic.users[i].tooltip = ''
      }
      for (let i in this.statistic.devices) {
        this.statistic.devices[i].total = this.statistic.devices[i].change = 0
        this.statistic.devices[i].title = this.statistic.devices[i].tooltip = ''
      }
    },
    getQuatasValue (quata, index) {
      let res = {}
      if (!this.configLoaded) {
        return {}
      }
      if (quata) {
        if (quata.dataFrom === customConfig.DATAFROM.preset) {
          res = this.getPresetValue(quata.preset)
        } else {
          res = this.getDatapoinitValue(quata.datapoint, index)
        }
        if (res) {
          res.title = quata.name
          res.tooltip = ''
        }
      } else {
        res = this.getDefaltPresetValue(parseInt(index))
      }
      return res
    },
    getDefaltPresetValue (index) {
      let res = {}
      switch (index) {
        case 1:
          res = this.statistic.devices.sum
          break
        case 2:
          res = this.statistic.devices.activated
          break
        case 3:
          res = this.statistic.devices.online
          break
        case 4:
          res = this.statistic.users.total
          break
        default:
          break
      }
      return _.clone(res)
    },
    getPresetValue (index) {
      let res = {}
      switch (index) {
        case customConfig.PRESET.devices_count:
          res = this.statistic.devices.sum
          break
        case customConfig.PRESET.devices_active:
          res = this.statistic.devices.activated
          break
        case customConfig.PRESET.devices_online:
          res = this.statistic.devices.online
          break
        case customConfig.PRESET.users_count:
          res = this.statistic.users.total
          break
        case customConfig.PRESET.users_online:
          res = this.statistic.users.online
          break
        default:
          break
      }
      return _.clone(res)
    },
    getConfig () {
      let key = customConfig.genKey(this.$route.params.id)
      api.customization.getCorpCustomization(key).then((res) => {
        if (res.status === 200) {
          if (res.data) {
            this.parseConfig(JSON.parse(res.data[key]))
          }
        }
        this.configLoaded = true
      }).catch((res) => {
        this.handleError(res)
        this.configLoaded = true
      })
    },
    parseConfig (config) {
      this.isShowTrend = config.trend
      this.isShowActive = config.active
      this.isShowDistribution = config.distribution
      this.quatas = config.quatas
      for (let i in this.quatas) {
        if (this.quatas[i].dataFrom === customConfig.DATAFROM.datapoint) {
          this.getStatictisValue(this.quatas[i].datapoint, i)
        }
      }
    },
    getStatictisValue (datapoint, i) {
      let index = i
      let time = {}
      if (datapoint.period === 5 && datapoint.custom_time) { // 自定义
        time.start = datapoint.custom_time.start || 0
        time.end = datapoint.custom_time.end || 0
      } else {
        let res = this.getPeriodTime(datapoint.period)
        time.start = res.start || 0
        time.end = res.end || 0
      }
      // 增加8小时
      time.start = time.start + 8 * 3600 * 1000
      time.end = time.end + 8 * 3600 * 1000
      let params = {
        index: datapoint.datapoint_index,
        date_start: new Date(time.start),
        date_end: new Date(time.end),
        fineness: datapoint.fineness,
        mode: [datapoint.statistics_type]
      }
      api.statistics.getProductSnapshotStatistic(datapoint.snapshot_id, datapoint.statistics_rule_id, params).then((res) => {
        if (res.status === 200 && res.data.product_id) {
          let val = NaN
          switch (params.mode[0]) {
            case 1: // 最大
              val = res.data.max
              break
            case 2: // 最小
              val = res.data.min
              break
            case 3: // 平均
              val = res.data.avg
              break
            case 4: // 求和
              val = res.data.sum
              break
            default:
              break
          }
          val = Number(val)
          if (!isNaN(val)) {
            this.dpQuatasValues[index] = toFixed(val)
          }
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    getDatapoinitValue (datapoint, index) {
      if (typeof this.dpQuatasValues[index] === 'number' && !isNaN(this.dpQuatasValues[index])) {
        return {
          total: this.dpQuatasValues[index],
          change: 0
        }
      } else {
        return {
          total: 0,
          change: 0
        }
      }
    },
    getPeriodTime (period) {
      let res = {
        start: 0,
        end: 0
      }
      let curTime = +new Date()
      res.end = curTime
      switch (period) {
        case 1: // 24小时
          res.start = curTime - 3600 * 1000 * 24
          break
        case 2: // 7天
          res.start = curTime - 3600 * 1000 * 24 * 6
          break
        case 3: // 30天
          res.start = curTime - 3600 * 1000 * 24 * 29
          break
        case 4: // 至今
          res.start = +new Date(0)
          break
        default:
          break
      }
      return res
    },
    initTranslate () {
      this.statistic.users.total.title = this.$t('operation.product.overview.users.count')
      this.statistic.users.total.tooltip = this.$t('operation.product.overview.users.tooltip')
      this.statistic.devices.sum.title = this.$t('operation.product.overview.total.count')
      this.statistic.devices.sum.tooltip = this.$t('operation.product.overview.total.tooltip')
      this.statistic.devices.activated.title = this.$t('operation.product.overview.activated.count')
      this.statistic.devices.activated.tooltip = this.$t('operation.product.overview.activated.tooltip')
      this.statistic.devices.online.title = this.$t('operation.product.overview.online.count')
      this.statistic.devices.online.tooltip = this.$t('operation.product.overview.online.tooltip')
    },
    getProductSummary () {
      api.statistics.getProductSummary(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.statistic.devices.activated.total = res.data.activated
          this.statistic.devices.sum.total = res.data.total
          this.statistic.devices.online.total = res.data.online
          this.statistic.devices.sum.change = res.data.today_add_device || 0
          this.statistic.devices.activated.change = res.data.today_activated_device || 0
          this.statistic.users.total.total = res.data.total_user
          this.statistic.users.total.change = res.data.today_add_user || 0
          this.statistic.users.online.total = res.data.user_online || 0
          this.statistic.users.online.change = res.data.today_add_user_online || 0
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.product-card
  clearfix()
  padding-top 15px

  .x-statistic
    padding 5px 0
    margin-right 30px

    & > .info
      font-size 36px
      margin 10px 0

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
    margin-left 232px

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
