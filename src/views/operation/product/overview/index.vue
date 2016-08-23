<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>概览</h2>
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
              <statistic :total="385234" :change="statistic.devices.sum.change" title="设备总数" tooltip="当前产品的设备总量" color="gray" :has-chart="true" align="left" :titletop="true">
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="234832" :change="statistic.devices.activated.change" title="激活设备数" tooltip="已联网激活的设备数量" color="green" :has-chart="true" align="left" :titletop="true">
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="56891" :change="statistic.devices.online.change" title="在线设备数" tooltip="当前在线的设备数量" color="blue" :has-chart="true" :titletop="true">
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="23710" :change="8" title="用户总数" tooltip="当前产品的用户数量" color="orange" :has-chart="true" :titletop="true">
              </statistic>
            </div>
          </div>
          <!-- End: 产品信息统计 -->
        </div>
      </div>
    </panel>

    <product-trend></product-trend>
    <product-active></product-active>
    <product-distribution></product-distribution>
  </div>
</template>

<script>
import store from 'store/index'
import { removeProduct, updateProduct } from 'store/actions/products'
import Panel from 'components/Panel'
import Statistic from 'components/Statistic2'
import Tooltip from 'components/Tooltip'
import defaultDeviceThumb from 'assets/images/device_thumb.png'
import { globalMixins } from 'src/mixins'
import { productSummaryMixin, setCurrProductMixin } from '../mixins'
import ProductTrend from './product-trend'
import ProductActive from './product-active'
import ProductDistribution from './product-distribution'

export default {
  name: 'Overview',

  layouts: ['topbar', 'sidebar'],

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, productSummaryMixin, setCurrProductMixin],

  store,

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
      deviceThumb: defaultDeviceThumb,
      trendTabs: {
        curr: 0,
        labels: ['激活设备', '累计激活']
      },
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
      }
    }
  },

  route: {
    data () {
      this.getCurrProduct(this.$route.params.id)

      // getProductSummary 方法来自 productSummaryMixin
      this.getProductSummary()
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
