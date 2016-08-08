<template>
  <div class="x-china-heat-map">
    <div v-if="show" id="map-item"></div>
  </div>
</template>

<script>
// import G2 from 'g2'
import mapData from './map-data.json'
import _ from 'lodash'
import Parser from 'components/charts/resource/cityCenterParser'

export default {
  name: 'ChinaMap',

  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    },

    data: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      chart: null,
      show: true
    }
  },

  ready () {
    if (!this.chart) {
      this.render()
    }
  },

  watch: {
    // 监听数据变化，渲染图表
    data () {
      if (this.chart) {
        this.show = false
        setTimeout(() => {
          this.show = true
        }, 0)
        setTimeout(() => {
          this.render()
        }, 0)
      } else {
        this.render()
      }
    }
  },

  methods: {
    render () {
      var el = document.getElementById('map-item')

      if (!this.data || this.data.length <= 0) {
        return
      }
      var Stat = window.G2.Stat

      this.data.forEach((item) => {
        var coordinates = {}
        if (item.city) {
          coordinates = Parser(item.city)
        } else {
          coordinates = Parser(item.province)
        }
        item.latitude = coordinates.latitude
        item.longitude = coordinates.longitude
      })

      var width = el.clientWidth || el.parentNode.clientWidth
      var height = width * (6 / 7)
      var mt = (width - height) / 2
      // 默认配置
      var defaults = {
        container: el,
        // forceFit: true,
        width: width,
        height: height,
        plotCfg: {
          margin: [mt, 0]
        }
      }

      var chart = new window.G2.Chart(_.merge({}, defaults, this.options.props))

      this.chart = chart

      chart.source(this.data)

      // 绘制地图的背景
      new window.G2.Plugin.GMap({
        chart: chart,
        mapData: mapData,
        style: {
          stroke: '#999',
          fill: '#fff'
        }
      }).draw()

      chart.tooltip({
        map: {
          title: 'city',
          value: 'coordinates'
        }
      })
      chart.heatmap().position(Stat.map.location('longitude*latitude')).color('value')
        .size(15) // 调整热力图一个点可以影响的范围
        .label('city', {label: {opacity: 0}}) // 设置文本但是不显示，使得tooltip可以显示对应的字段
      chart.render()
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/common'

.x-china-heat-map
  display inline-block
  max-width 600px
  min-width 500px
  height 450px
  text-align center
  margin 0 auto
</style>
