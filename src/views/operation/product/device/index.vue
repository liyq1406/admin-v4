<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>设备详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card :info="deviceSummary" :pic="'/static/images/device_thumb.png'"></info-card>
          <div v-stretch="182">
            <info-list :info="deviceInfo"></info-list>
          </div>
        </div>
        <div class="col-8 device-map with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="mt10 ml30">
            <x-map :location="deviceLocation" height="220px"></x-map>
            <div class="device-ip mt5">
              <span v-show="!currVirtualDevice.ip"> 未激活 </span>
              <span v-show="currVirtualDevice.ip">ip: {{ currVirtualDevice.ip }} </span>
              <span v-show="province">{{province}} {{city}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
import api from 'api'
import Tab from 'components/Tab'
import InfoCard from 'components/InfoCard'
import InfoList from 'components/InfoList'
import Breadcrumb from 'components/Breadcrumb'
import Map from 'components/Map'
import { globalMixins } from 'src/mixins'
import store from 'store'
import { getCurrProduct, setCurrDevice, setCurrVirtualDevice } from 'store/actions/products'
import { formatDate } from 'src/filters'

export default {
  name: 'Device',

  mixins: [globalMixins],

  components: {
    Tab,
    Breadcrumb,
    InfoCard,
    InfoList,
    'x-map': Map
  },

  store,

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr,
      currDevice: ({ products }) => products.currDevice,
      currVirtualDevice: ({ products }) => products.currVirtualDevice
    },
    actions: {
      getCurrProduct,
      setCurrDevice,
      setCurrVirtualDevice
    }
  },

  data () {
    return {
      province: '',
      city: '',
      deviceLocation: [],
      secondaryNav: [],
      breadcrumbNav: [{
        label: '全部',
        link: `/operation/products/${this.$route.params.product_id}/devices`
      }, {
        label: '设备详情'
      }]
    }
  },

  computed: {
    // 设备简介
    deviceSummary () {
      return {
        title: this.currDevice.name || this.currentProduct.name,
        online: this.currDevice.is_online,
        time: formatDate(this.currDevice.last_login)
      }
    },

    // 设备信息
    deviceInfo () {
      let activeInfo = this.currDevice.is_active ? `已激活 ${formatDate(this.currDevice.active_date)}` : '未激活'
      let onlineLongInfo = this.currVirtualDevice.online_count

      if (typeof onlineLongInfo !== 'undefined') {
        onlineLongInfo = onlineLongInfo > 3600 ? `${(onlineLongInfo / 3600).toFixed(1)}小时` : `${onlineLongInfo}秒`
      } else {
        onlineLongInfo = '-'
      }

      return {
        mac: {
          label: 'MAC',
          value: this.currDevice.mac || '-'
        },
        onlineLong: {
          label: '累计在线时长',
          value: onlineLongInfo
        },
        isActive: {
          label: '激活状态',
          value: activeInfo
        },
        model: {
          label: '型号',
          value: this.currentProduct.mode || '-'
        },
        firmware_mod: {
          label: '固件版本',
          value: this.currDevice.firmware_mod || '-'
        },
        id: {
          label: '设备ID',
          value: this.currDevice.id || '-'
        },
        sn: {
          label: 'sn',
          value: this.currDevice.sn || '-'
        }
      }
    }
  },

  route: {
    activate () {
      this.getCurrProduct(this.$route.params.product_id)
      this.getDeviceGeography()
      this.getDeviceInfo()
      this.getVDevice()
    },

    data (transition) {
      let deviceDetailRoot = `/operation/products/${this.$route.params.product_id}/devices/${this.$route.params.device_id}`

      return {
        secondaryNav: [{
          label: '设备状态',
          link: { path: `${deviceDetailRoot}/info` }
        }, {
          label: '历史数据',
          link: { path: `${deviceDetailRoot}/history` }
        }, {
          label: '告警信息',
          link: { path: `${deviceDetailRoot}/alerts` }
        }, {
          label: '远程诊断',
          link: { path: `${deviceDetailRoot}/diagnose` }
        }, {
          label: '用户信息',
          link: { path: `${deviceDetailRoot}/users` }
        }, {
          label: '维保记录',
          link: { path: `${deviceDetailRoot}/warranty` }
        }, {
          label: '经销商',
          link: { path: `${deviceDetailRoot}/dealers` }
        }]
      }
    }
  },

  methods: {
    /**
     * 获取虚拟设备数据
     * @author shengzhi
     */
    getVDevice () {
      api.product.getVDevice(this.$route.params.product_id, this.$route.params.device_id).then((res) => {
        if (res.status === 200) {
          this.setCurrVirtualDevice(res.data)
          // this.deviceInfo.onlineLong.value = '100小时'
        }
      }).catch((res) => {
        // this.handleError(res)
      })
    },

    /**
     * 获取设备信息
     * @author shengzhi
     */
    getDeviceInfo () {
      api.device.getInfo(this.$route.params.product_id, this.$route.params.device_id).then((res) => {
        if (res.status === 200) {
          this.setCurrDevice(res.data)
          // this.device = res.data
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取设备的地理坐标
     * @author shengzhi
     */
    getDeviceGeography () {
      api.device.getGeography(this.$route.params.product_id, this.$route.params.device_id).then((res) => {
        let {province, city} = res.data
        this.province = province
        this.city = city
        if (res.status === 200) {
          this.deviceLocation = [res.data.lon, res.data.lat]
        }
      })
    }
  }
}
</script>
