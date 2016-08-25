<template>
  <div class="x-china-heat-map">
    <div v-if="show" class="map-item"></div>
    <div v-if="data && data.length===0" class="default">没有数据</div>
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
      show: true,
      rendering: false
    }
  },

  ready () {
    if (!this.chart) {
      if (this.rendering || this.data.length <= 0) {
        return
      }
      this.rendering = true
      setTimeout(this.render, 500)
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
        if (this.rendering || this.data.length <= 0) {
          return
        }
        this.rendering = true
        setTimeout(this.render, 500)
      }
    }
  },

  methods: {
    render () {
      var el = this.$el.firstElementChild

      if (!el || el.className !== 'map-item') {
        return
      }
      if (!this.data || this.data.length <= 0) {
        return
      }

      let cloneData = _.clone(this.data)

      var Stat = window.G2.Stat

      for (let i = 0; i < cloneData.length; i++) {
        let item = cloneData[i]
        let coordinates = {}
        if (item.city) {
          coordinates = Parser(item.city)
        } else {
          coordinates = Parser(item.province)
        }
        if (coordinates && coordinates.latitude && coordinates.longitude) {
          item.latitude = coordinates.latitude
          item.longitude = coordinates.longitude
        } else {
          cloneData.splice(i, 1) // 不能直接操纵数组，会引发watch操作
          i--
        }
      }

      var width = el.clientWidth || 500

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

      chart.source(cloneData)

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
        .size(20) // 调整热力图一个点可以影响的范围
        .label('city', {label: {opacity: 0}}) // 设置文本但是不显示，使得tooltip可以显示对应的字段
      chart.render()
      this.chart = chart
      this.rendering = false
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
  .map-item
    width 100%
  .default
    height 450px
    width 100%
    line-height 450px
    display inline-block
    text-align center
</style>
