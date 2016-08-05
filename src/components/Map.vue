<template>
  <div id="map" :style="mapStyle"></div>
</template>

<script>
import * as config from 'consts/config'

export default {
  props: {
    // 坐标
    location: {
      type: Array,
      default () {
        return []
      }
    },

    // 地图高度
    height: {
      type: String,
      default: '100%'
    }
  },

  data () {
    return {
      map: {},
      marker: {},
      mapStyle: {
        height: this.height
      }
    }
  },

  ready () {
    window.initMap = this.initMap
    if (typeof window.AMap === 'undefined') {
      var mapApi = document.createElement('script')
      mapApi.src = `http://webapi.amap.com/maps?v=1.3&key=${config.AMAP_KEY}&callback=initMap`
      document.getElementsByTagName('body')[0].appendChild(mapApi)
    }
  },

  watch: {
    location () {
      this.initMap()
    }
  },

  methods: {
    /**
     * 地图初始化
     * @author shengzhi
     */
    initMap () {
      // 地图实例
      this.map = new AMap.Map('map', {
        resizeEnable: true,
        zoom: 15
      })

      if (this.location.length === 0) return

      this.map.setCenter(this.location)
      this.marker = new AMap.Marker({
        map: this.map,
        position: this.location,
        icon: 'static/images/marker.png',
        offset: {x: -11, y: -28}
      })
    }
  }
}
</script>

<style lang="stylus">

</style>
