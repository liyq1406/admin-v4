<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>{{ $t('operation.product.overview.main_title') }}</h2>
    </div>
    <panel>
      <div class="product-card">
        <div class="thumb"><img :src="deviceThumb"/></div>
        <div class="info">
          <h2>{{ currentProduct.name }}</h2>
          <div class="desc">{{ currentProduct.description }}</div>

          <!-- Start: 产品信息统计 -->
          <div class="row">
            <div class="col-6">
              <statistic :total="statistic.devices.sum.total" :change="statistic.devices.sum.change" :title="statistic.devices.sum.title" :tooltip="statistic.devices.sum.tooltip" color="gray" align="left" :titletop="true">
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="statistic.devices.activated.total" :change="statistic.devices.activated.change" :title="" :tooltip="" color="green" align="left" :titletop="true">
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="statistic.devices.online.total" :change="statistic.devices.online.change" :title="" :tooltip="" color="blue" :titletop="true">
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="statistic.users.total.total" :change="statistic.users.total.change" :title="" :tooltip="" color="orange" :titletop="true">
              </statistic>
            </div>
          </div>
          <!-- End: 产品信息统计 -->
        </div>
      </div>
    </panel>

    <product-trend v-if="isShowTrend"></product-trend>
    <product-active v-if="isShowActive"></product-active>
    <product-distribution v-if="isShowDistribution"></product-distribution>
  </div>
</template>

<script>
import { removeProduct, updateProduct } from 'store/actions/products'
import Panel from 'components/Panel'
import Statistic from 'components/Statistic2'
import Tooltip from 'components/Tooltip'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from '../mixins'
import ProductTrend from './components/ProductTrend'
import ProductActive from './components/ProductActive'
import ProductDistribution from './components/ProductDistribution'
import api from 'api'
import config from 'consts/custom-config'

export default {
  name: 'Overview',

  layouts: ['topbar', 'sidebar'],

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, setCurrProductMixin],

  vuex: {
    actions: {
      removeProduct,
      updateProduct
    }
  },

  components: {
    Panel,
    Statistic,
    Tooltip,
    // IntervalIcon,
    ProductTrend,
    ProductActive,
    ProductDistribution
  },

  data () {
    return {
      isShowTrend: true,
      isShowActive: true,
      isShowDistribution: true,
      // 统计
      statistic: {
        users: {
          total: {
            total: 0,
            change: 0
          },
          online: {
            total: 0,
            change: 0
          }
        },
        // 设备
        devices: {
          // 总数
          sum: {
            total: 0,
            change: 0
          },
          // 激活设备
          activated: {
            total: 0,
            change: 0
          },
          // 在线设备
          online: {
            total: 0,
            change: 0
          }
        }
      }
    }
  },

  computed: {
    deviceThumb () {
      let pics = this.currentProduct.pics
      return (pics && pics.length && pics[0]) ? pics[0] : '/static/images/device_thumb.png'
    }
  },

  route: {
    data () {
      this.getCurrProduct(this.$route.params.id)
      this.getConfig()
      this.getProductSummary()
    }
  },
  ready () {
    this.initTranslate()
  },
  methods: {
    getConfig () {
      let key = config.genKey(this.$route.params.id)
      api.customization.getCorpCustomization(key).then((res) => {
        if (res.status === 200) {
          if (res.data) {
            this.parseConfig(JSON.parse(res.data[key]))
          } else {
            this.setDefaultConfig()
          }
        }
      }).catch((res) => {
        this.setDefaultConfig()
        this.handleError(res)
      })
    },
    setDefaultConfig () {},
    parseConfig (config) {
      this.isShowTrend = config.trend
      this.isShowActive = config.active
      this.isShowDistribution = config.distribution
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
