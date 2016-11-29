<template>
  <div class="map-box">
    <div id="map" :style="mapStyle"></div>
  </div>
</template>

<script>
import * as config from 'consts/config'
export default {
  name: 'XMap',
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
      map: null,
      mapStyle: {
        height: this.height
      }
    }
  },

  watch: {
    location () {
      if (this.map) {
        this.setMarker()
      }
    },

    addr () {
      if (this.map) {
        this.location = []
        this.getLocation()
      }
    }
  },

  ready () {
    let func = 'init_' + (new Date().getTime())
    window[func] = this.initMap
    if (typeof google === 'undefined') {
      var elem = document.createElement('script')
      elem.async = true
      elem.defer = 'defer'
      elem.src = `http://maps.google.cn/maps/api/js?libraries=geometry&key=${config.GOOGLE_MAP_KEY}&callback=${func}`
      document.getElementsByTagName('body')[0].appendChild(elem)
    } else {
      this.initMap()
    }
  },

  methods: {
    /**
     * 获取地理坐标
     */
    getLocation () {
      // 如果当前已经有location
      if (this.location.length) {
        this.setMarker()
        return
      }

      // 如果传递了地址信息
      if (this.addr) {
        let geocoder = new google.maps.Geocoder()
        geocoder.geocode({
          address: this.addr
        }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            let loc = results[0].geometry.location
            this.location = [loc.lng(), loc.lat()]
          } else {
            // 错误处理
            // console.log(results)
          }
        })
      }
    },

    /**
     * 设置地图标记
     */
    setMarker () {
      let lat = this.location[1]
      let lng = this.location[0]

      if (!lat || !lng) return

      let marker = new google.maps.Marker({
        map: this.map,
        position: {lat: lat, lng: lng},
        icon: '/static/images/map/marker.png'
      })
      this.map.setCenter(new google.maps.LatLng(lat, lng))

      return marker
    },

    /**
     * 地图初始化
     * @author shengzhi
     */
    initMap () {
      // 地图初始化配置
      let options = {
        center: new google.maps.LatLng(36.6847961226, 105.0293195608),
        zoom: this.zoom,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false
      }

      // 初始化
      this.map = new google.maps.Map(document.getElementById('map'), options)
      this.getLocation()
    }
  }
}
</script>

<style lang="stylus" scpoed>
  .map-box
    width 100%
    height 100%
</style>
