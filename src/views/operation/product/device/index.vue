<template>
  <div class="main device-details">
    <!-- <div class="breadcrumb"><a v-link="{path: '/products/' + $route.params.product_id + '/devices' }"><i class="fa fa-arrow-circle-left"></i>{{ $t('ui.device.management') }}</a></div> -->
    <div class="main-title">
      <h3>设备详情</h3>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="row">
      <div class="col-18">
        <div class="device-status">
          <div class="thumb"><img src="../../../../assets/images/device_thumb.png"/></div>
          <div class="info">
            <h2>加湿器</h2>
            <div class="desc">
              <span class="hl-green"></span>
            </div>
          </div>
        </div>
        <ul class="device-details">
          <li v-if="device.name">
            <div class="label">设备名称:</div>
            <div class="info">{{ device.name }}</div>
          </li>
          <li>
            <div class="label">ID:</div>
            <div class="info">{{ device.id }}</div>
          </li>
          <li>
            <div class="label">MAC:</div>
            <div class="info">{{ device.mac }}</div>
          </li>
          <li>
            <div class="label">{{ $t('ui.device.is_active') }}:</div>
            <div class="info">{{ device.is_active ? $t('ui.device.active') : $t('ui.device.not_active') }}</div>
          </li>
          <li>
            <div class="label">{{ $t('ui.device.active_date') }}:</div>
            <div class="info">{{ device.active_date | formatDate }}</div>
          </li>
          <li>
            <div class="label">{{ $t('ui.device.is_online') }}:</div>
            <div class="info"><span v-if="device.is_online" class="hl-green">{{ $t('common.online') }}</span><span v-else class="hl-red">{{ $t('common.offline') }}</span></div>
          </li>
          <li>
            <div class="label">{{ $t('ui.device.firmware_version') }}:</div>
            <div class="info"><span>{{ device.firmware_version }}</span></div>
          </li>
          <li>
            <div class="label">所属经销商</div>
            <div class="info"><span>华南-广州总部</span></div>
          </li>
        </ul>
      </div>
      <div class="col-6 device-map with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div id="device-map" class="mt20" style="height: 192px"></div>
      </div>
    </div>
    <tab :nav="secondaryNav"></tab>
    <router-view transition="view" transition-mode="out-in" class="view"></router-view>
  </div>
</template>

<script>
import api from 'api'
import * as config from 'consts/config'
import Tab from 'components/Tab'
import PicTxt from 'components/PicTxt'
import Breadcrumb from 'components/Breadcrumb'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Device',

  mixins: [globalMixins],

  components: {
    Tab,
    Breadcrumb,
    PicTxt
  },

  data () {
    return {
      device: {},
      secondaryNav: [],
      breadcrumbNav: [{
        label: '全部',
        link: `/operation/products/${this.$route.params.product_id}/devices`
      }, {
        label: '设备详情'
      }]
    }
  },

  route: {
    data (transition) {
      var deviceDetailRoot = `/operation/products/${this.$route.params.product_id}/devices/${this.$route.params.device_id}`
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

  ready () {
    // 将回调绑定在全局供高德地图加载后调用
    window.init = this.initMap
    api.device.getGeography(this.$route.params.product_id, this.$route.params.device_id).then((res) => {
      if (res.status === 200) {
        this.mapCenter = [res.data.lon, res.data.lat]
        if (typeof window.AMap === 'undefined') {
          var mapApi = document.createElement('script')
          alert(`http://webapi.amap.com/maps?v=1.3&key=${config.AMAP_KEY}&callback=init`)
          mapApi.src = `http://webapi.amap.com/maps?v=1.3&key=${config.AMAP_KEY}&callback=init`
          document.getElementsByTagName('body')[0].appendChild(mapApi)
        } else {
          this.initMap()
        }
        // this.points = [res.data]
      }
    }).catch((res) => {
      // this.showNotice({
      //   type: 'error',
      //   content: '暂无该设备的定位数据'
      // })
    })
  },

  methods: {
    /**
     * 地图初始化
     */
    initMap () {
      // 地图初始化
      this.map = new AMap.Map('device-map', {
        resizeEnable: true,
        zoom: 15
      })
      this.map.setCenter(this.mapCenter)

      this.marker = new AMap.Marker({
        map: this.map,
        position: this.mapCenter,
        icon: 'static/images/marker.png',
        offset: {x: -11, y: -28}
      })
    },

    // 获取设备信息
    getDeviceInfo () {
      api.device.getInfo(this.$route.params.product_id, this.$route.params.device_id).then((res) => {
        if (res.status === 200) {
          this.device = res.data
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
