<template>
  <div class="x-china-heat-map"></div>
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

  ready () {
    if (!this.chart) {
      this.render()
    }
  },

  watch: {
    // 监听数据变化，渲染图表
    data () {
      if (this.chart) {
        this.chart.changeData(this.data)
      } else {
        this.render()
      }
    }
  },

  methods: {
    render () {
      if (!this.data || this.data.length <= 0) {
        return
      }
      var Stat = window.G2.Stat

      this.data.forEach((item) => {
        var coordinates = {}
        if (item.city) {
          console.log(Parser(item.city))
        } else {
          coordinates = Parser(item.province)
        }
        console.log(coordinates)
        item.latitude = coordinates.latitude
        item.longitude = coordinates.longitude
      })
      console.log(this.data)
      /* eslint-disable */
      var userData = [{"province":"北京市","city":"延庆","latitude":40,"longitude":115.95,"out-temperature":23.9},{"province":"北京市","city":"密云","latitude":40,"longitude":116.83,"out-temperature":26.2}]
      /* eslint-enable */

      var width = this.$el.clientWidth || this.$el.parentNode.clientWidth
      var height = width * (6 / 7)
      var mt = (width - height) / 2
      // 默认配置
      var defaults = {
        container: this.$el,
        // forceFit: true,
        width: width,
        height: height,
        plotCfg: {
          margin: [mt, 0]
        }
      }

      var chart = new window.G2.Chart(_.merge({}, defaults, this.options.props))

      chart.source(userData)

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
          'title': 'city',
          value: 'out-temperature'
        }
      })
      chart.heatmap().position(Stat.map.location('longitude*latitude')).color('temperature')
        .size(15) // 调整热力图一个点可以影响的范围
        .label('city', {label: {opacity: 0}}) // 设置文本但是不显示，使得tooltip可以显示对应的字段
      chart.render()
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/common'

.x-china-map
  display inline-block
  max-width 600px
  text-align center
  margin 0 auto
</style>
