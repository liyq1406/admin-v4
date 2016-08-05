<template>
  <div class="map-box">
    <div id="map" :style="mapStyle"></div>
  </div>
</template>

<script>
import * as config from 'consts/config'
import { globalMixins } from 'src/mixins'

export default {

  mixins: [globalMixins],

  props: {
    // 坐标
    location: {
      type: Array,
      default () {
        return []
      }
    },
    // 地址
    addr: {
      type: String,
      default: ''
    },
    // IP
    ip: {
      type: String,
      default: '123'
    },
    // 缩放级别
    zoom: {
      type: Number,
      default: 14
    },
    // 地图高度
    height: {
      type: String,
      default: '100%'
    }
  },

  data () {
    return {
      ready: false,
      loading: true,
      map: {},
      marker: {},
      mapStyle: {
        height: this.height
      }
    }
  },

  watch: {
    location () {
      this.setCenter()
    }
  },

  ready () {
    this.init()
  },

  methods: {
    /**
     * 总初始化
     * @return {[type]} [description]
     */
    init () {
      if (!window.AMap) {
        window.initMap = this.initMap
        var mapApi = document.createElement('script')
        mapApi.src = `http://webapi.amap.com/maps?v=1.3&key=${config.AMAP_KEY}&callback=initMap`
        document.getElementsByTagName('body')[0].appendChild(mapApi)
      } else {
        this.initMap()
      }
    },

    /**
     * 根据传入的参数重置location
     */
    resetLocation () {
      // 如果当前已经有location
      if (this.location.length) {
        this.zoom = 15
        this.setCenter()
        return
      }
      AMap.service(['AMap.Geocoder', 'AMap.CitySearch'], () => { // 回调函数
        if (this.addr) {
          // 实例化Geocoder
          this.geocoder = new AMap.Geocoder()
          // 地理编码
          this.geocoder.getLocation(this.addr, (status, res) => {
            if (status === 'complete' && res.info === 'OK') {
              var lng = res.geocodes[0].location.lng
              var lat = res.geocodes[0].location.lat
              this.location = [lng, lat]
            } else {
              this.showNotice({
                type: 'error',
                content: '找不到' + this.addr
              })
            }
          })
        } else if (this.ip) {
          // 实例化CitySearch
          this.CitySearch = new AMap.CitySearch()
          this.CitySearch.getCityByIp(this.ip, (status, res) => {
            if (status === 'complete' && res.info === 'OK') {
              this.addr = res.city
              this.resetLocation()
              this.zoom = 10
            } else {
              console.log('ip无效')
            }
          })
        }
      })
    },
    /**
     * 设置坐标
     */
    setCenter (location) {
      location = location || this.location
      if (!this.ready || !location.length) return
      this.map.setCenter(location)
    },
    /**
     * 地图初始化
     * @author shengzhi
     */
    initMap () {
      // 地图实例
      this.ready = true
      this.map = new AMap.Map('map', {
        resizeEnable: true,
        zoom: this.zoom
      })
      this.resetLocation()
    }
  }
}
</script>

<style lang="stylus" scpoed>

  .map-box
    width 100%
    height 100%
</style>
