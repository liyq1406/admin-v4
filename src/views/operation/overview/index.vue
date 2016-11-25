<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>{{ $t('operation.overview.main_title') }}</h2>
    </div>
    <div class="row statistic mt10">
      <div class="col-6">
        <statistic
          :total="statistic.devices.total.count" :change="statistic.devices.total.change" :title="$t('operation.overview.total.count')" :tooltip="$t('operation.overview.total.tooltip')" color="gray" :titletop="true"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.devices.activated.count" :change="statistic.devices.activated.change" :title="$t('operation.overview.activated.count')" :tooltip="$t('operation.overview.activated.tooltip')" color="green" :titletop="true"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.devices.online.count" :change="statistic.devices.online.change" change-unit="%" :title="$t('operation.overview.online.count')" :tooltip="$t('operation.overview.online.tooltip')" color="blue" :titletop="true"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.users.count" :change="statistic.users.change" :title="$t('operation.overview.users.count')" :tooltip="$t('operation.overview.users.tooltip')" color="orange" :titletop="true"></statistic>
      </div>
    </div>
    <div class="row">
      <div class="col-24">
        <product-trend></product-trend>
        <product-active></product-active>
        <!-- <product-distribution></product-distribution> -->
        <product-world-distribution></product-world-distribution>
        <user-trend></user-trend>
        <product-model></product-model>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import ProductTrend from './components/ProductTrend'
import ProductActive from './components/ProductActive'
// import ProductDistribution from './components/ProductDistribution'
import ProductWorldDistribution from './components/ProductWorldDistribution'
import UserTrend from './components/UserTrend'
import ProductModel from './components/ProductModel'

export default {
  name: 'Dashboard',

  layouts: ['topbar', 'sidebar'],
  components: {
    // IntervalIcon,
    ProductTrend,
    ProductActive,
    ProductWorldDistribution,
    ProductModel,
    UserTrend
  },

  data () {
    return {
      // 统计
      statistic: {
        // 用户总数
        users: {
          count: 0,
          change: 0
        },
        // 设备
        devices: {
          // 总数
          total: {
            count: 0,
            change: 0
          },
          // 激活设备
          activated: {
            count: 0,
            change: 0
          },
          // 在线设备
          online: {
            count: 0,
            change: 0
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
          this.statistic.devices.activated.count = res.data.total.activated
          this.statistic.devices.total.count = res.data.total.total
          this.statistic.devices.online.count = res.data.total.online
          this.statistic.devices.online.change = Math.round(res.data.total.online / res.data.total.total * 10000) / 100
          this.statistic.devices.total.change = res.data.total.today_add
          this.statistic.devices.activated.change = res.data.total.today_activated || 0
          this.statistic.users.count = res.data.user.user
          this.statistic.users.change = res.data.user.today_add || 0
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
