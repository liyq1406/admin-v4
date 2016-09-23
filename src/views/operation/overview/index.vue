<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>概览</h2>
    </div>
    <div class="row statistic mt10">
      <div class="col-6">
        <statistic :total="statistic.devices.total.count" :change="statistic.devices.total.change" title="设备总数" tooltip="企业的设备总量" color="gray" :titletop="true">
          <!-- <interval-icon color="gray"></interval-icon> -->
        </statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.devices.activated.count" :change="statistic.devices.activated.change" title="激活数" tooltip="已联网激活的设备数量" color="green" :titletop="true">
          <!-- <interval-icon color="green"></interval-icon> -->
        </statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.devices.online.count" :change="statistic.devices.online.change" change-unit="%" title="在线量" tooltip="当前在线的设备数量" color="blue" :titletop="true">
          <!-- <interval-icon color="blue"></interval-icon> -->
        </statistic>
      </div>
      <div class="col-6">
        <statistic :total="statistic.users.count" :change="statistic.users.change" title="用户总数" tooltip="企业的用户数量" color="orange" :titletop="true">
          <!-- <interval-icon color="orange"></interval-icon> -->
        </statistic>
      </div>
    </div>
    <div class="row">
      <div class="col-24">
        <product-trend></product-trend>
        <product-active></product-active>
        <template v-if="loadDistribution">
          <product-distribution></product-distribution>
        </template>
        <template v-if="loadUserTrend">
          <user-trend></user-trend>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Statistic from 'components/Statistic2'
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
    Statistic,
    // IntervalIcon,
    ProductTrend,
    ProductActive,
    ProductDistribution,
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
      },
      loadUserTrend: false,
      loadDistribution: false
    }
  },

  ready () {
    this.getSummary()
    setTimeout(() => {
      this.loadDistribution = true
      setTimeout(() => {
        this.loadUserTrend = true
      }, 500)
    }, 500)
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
