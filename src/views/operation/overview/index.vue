<template>
  <div class="main">
    <div class="row statistic">
      <div class="col-6">
        <panel>
          <statistic :info="statistic.devices.total.info" title="设备总数" tooltip="设备总数说明" :has-chart="true" align="center" :titletop="true">
            <interval-icon color="gray"></interval-icon>
          </statistic>
        </panel>
      </div>
      <div class="col-6">
        <panel>
          <statistic :info="statistic.devices.activated.info" title="激活数" tooltip="激活数说明" color="green" :has-chart="true" align="center" :titletop="true">
            <interval-icon color="green"></interval-icon>
          </statistic>
        </panel>
      </div>
      <div class="col-6">
        <panel>
          <statistic :info="statistic.devices.online.info" title="在线量" tooltip="在线量说明" color="blue" :has-chart="true" align="center" :titletop="true">
            <interval-icon color="blue"></interval-icon>
          </statistic>
        </panel>
      </div>
      <div class="col-6">
        <panel>
          <statistic :info="statistic.users.info" title="用户总数" tooltip="用户总数说明" color="orange" :has-chart="true" align="center" :titletop="true">
            <interval-icon color="orange"></interval-icon>
          </statistic>
        </panel>
      </div>
    </div>
    <div class="row">
      <div class="col-24">
        <product-trend></product-trend>
        <product-active></product-active>
        <product-distribution></product-distribution>
        <user-trend></user-trend>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Panel from 'components/Panel'
import Statistic from 'components/Statistic'
// import Tooltip from 'components/Tooltip'
import IntervalIcon from 'components/g2-charts/IntervalIcon'
import { globalMixins } from 'src/mixins'
import ProductTrend from './product-trend'
import ProductActive from './product-active'
import ProductDistribution from './product-distribution'
import UserTrend from './user-trend'

export default {
  name: 'Dashboard',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Panel,
    Statistic,
    // Tooltip,
    IntervalIcon,
    ProductTrend,
    ProductActive,
    ProductDistribution,
    UserTrend
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      // 统计
      statistic: {
        // 用户总数
        users: {
          options: {},
          info: {
            total: '0',
            change: ''
          },
          data: []
        },
        // 设备
        devices: {
          // 总数
          total: {
            options: {},
            info: {
              total: '',
              change: ''
            },
            data: []
          },
          // 激活设备
          activated: {
            options: {},
            info: {
              total: '',
              change: ''
            },
            data: []
          },
          // 在线设备
          online: {
            options: {},
            info: {
              total: '',
              change: ''
            },
            data: []
          }
        }
      }
    }
  },

  ready () {
    this.getSummary()
  },

  methods: {
    getSummary () {
      api.statistics.getSummary().then((res) => {
        if (res.status === 200) {
          this.statistic.devices.activated.info.total = res.data.total.activated
          this.statistic.devices.total.info.total = res.data.total.total
          this.statistic.devices.online.info.total = res.data.total.online
          this.statistic.devices.total.info.change = res.data.total.today_add
          this.statistic.devices.activated.info.change = res.data.total.today_activated || 0
          this.statistic.users.info.total = res.data.user.total
          this.statistic.users.info.change = res.data.user.today_add || 0
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'

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
.pd15
  .x-statistic-left
    padding-left 15px!important
</style>
