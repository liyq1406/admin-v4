<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>{{ $t('operation.product.device.detail.title') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card :info="deviceSummary" :pic="(currentProduct.pics && currentProduct.pics.length) ? currentProduct.pics[0] : ''"></info-card>
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
              <span v-show="!currVirtualDevice.ip">{{ $t('operation.product.device.detail.not_actived') }}</span>
              <span v-show="currVirtualDevice.ip">{{ currVirtualDevice.ip }} </span>
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
import Map from 'components/Map'
import { globalMixins } from 'src/mixins'
import { getCurrProduct, setCurrDevice, setCurrVirtualDevice } from 'store/actions/products'
import formatDate from 'filters/format-date'

export default {
  name: 'Device',

  mixins: [globalMixins],

  components: {
    Tab,
    'x-map': Map
  },

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
        label: this.$t('common.all'),
        link: `/operation/products/${this.$route.params.product_id}/devices`
      }, {
        label: this.$t('operation.product.device.detail.title')
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
      let activeInfo = this.currDevice.is_active ? this.$t('operation.product.device.detail.actived') + ' ' + formatDate(this.currDevice.active_date) : this.$t('operation.product.device.detail.not_actived')
      let onlineLongInfo = this.currVirtualDevice.online_count

      if (typeof onlineLongInfo !== 'undefined') {
        onlineLongInfo = onlineLongInfo > 3600 ? `${(onlineLongInfo / 3600).toFixed(1)}小时` : `${onlineLongInfo}秒`
      } else {
        onlineLongInfo = '-'
      }

      return {
        mac: {
          label: this.$t('operation.product.device.detail.mac'),
          value: this.currDevice.mac || '-'
        },
        onlineLong: {
          label: this.$t('operation.product.device.detail.online_long'),
          value: onlineLongInfo
        },
        isActive: {
          label: this.$t('operation.product.device.detail.active_status'),
          value: activeInfo
        },
        model: {
          label: this.$t('operation.product.device.detail.mode'),
          value: this.currentProduct.mode || '-'
        },
        firmware_mod: {
          label: this.$t('operation.product.device.detail.version'),
          value: this.currDevice.firmware_mod || '-'
        },
        id: {
          label: this.$t('operation.product.device.detail.device_id'),
          value: this.currDevice.id || '-'
        },
        sn: {
          label: this.$t('operation.product.device.detail.sn'),
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
          label: this.$t('operation.product.device.detail.secondary.device'),
          link: { path: `${deviceDetailRoot}/info` }
        }, {
          label: this.$t('operation.product.device.detail.secondary.history'),
          link: { path: `${deviceDetailRoot}/history` }
        }, {
          label: this.$t('operation.product.device.detail.secondary.alert'),
          link: { path: `${deviceDetailRoot}/alerts` }
        }, {
          label: this.$t('operation.product.device.detail.secondary.remote'),
          link: { path: `${deviceDetailRoot}/diagnose` }
        }, {
          label: this.$t('operation.product.device.detail.secondary.users'),
          link: { path: `${deviceDetailRoot}/users` }
        // 暂时隐藏
        // }, {
        //   label: this.$t('operation.product.device.detail.secondary.warranty'),
        //   link: { path: `${deviceDetailRoot}/warranty` }
        // }, {
        //   label: this.$t('operation.product.device.detail.secondary.dealers'),
        //   link: { path: `${deviceDetailRoot}/dealers` }
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
        this.setCurrVirtualDevice({})
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
