<template>
  <div class="main device-details">
    <div class="main-title">
      <h2>设备详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <info-card :info="deviceSummary"></info-card>
          <div v-stretch="182">
            <info-list :info="deviceInfo"></info-list>
          </div>
        </div>
        <div class="col-8 device-map with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div id="device-map" class="mt10 ml30" style="height: 220px"></div>
        </div>
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
import InfoCard from 'components/InfoCard'
import InfoList from 'components/InfoList'
import Breadcrumb from 'components/Breadcrumb'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Device',

  mixins: [globalMixins],

  components: {
    Tab,
    Breadcrumb,
    InfoCard,
    InfoList
  },

  data () {
    return {
      deviceSummary: {},
      deviceInfo: {
        mac: {},
        onlineLong: {},
        isActive: {},
        model: {},
        sn: {},
        id: {}
      },
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
      this.getDeviceInfo()

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
          // alert(`http://webapi.amap.com/maps?v=1.3&key=${config.AMAP_KEY}&callback=init`)
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
          // this.device = res.data
          // console.log(res.data)

          this.deviceInfo.mac = {
            label: 'MAC',
            value: res.data.mac
          }
          // TODO 接口字段缺失
          this.deviceInfo.onlineLong = {
            label: '累计在线时长',
            value: '100小时'
          }
          this.deviceInfo.isActive = {
            label: '激活状态',
            value: res.data.is_active ? `已激活 ${res.data.active_date}` : '未激活'
          }
          // TODO 接口字段缺失
          this.deviceInfo.model = {
            label: '型号',
            value: '暂无信息'
          }
          // TODO 接口字段缺失
          this.deviceInfo.sn = {
            label: '序列号',
            value: '暂无信息'
          }
          this.deviceInfo.id = {
            label: '设备ID',
            value: res.data.id
          }

          api.product.getProduct(res.data.product_id).then((r) => {
            if (r.status === 200) {
              this.deviceSummary = {
                title: res.data.name || r.data.name,
                online: res.is_online,
                time: res.last_login
              }
            }
          }).catch((r) => {
            this.handleError(r)
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
