<template>
  <div class="x-china-map"></div>
</template>

<script>
// import G2 from 'g2'
import mapData from './map-data.json'
import _ from 'lodash'

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

  watch: {
    // 监听数据变化，渲染图表
    data () {
      this.render()
    }
  },

  methods: {
    render () {
      var Stat = window.G2.Stat
      var userData = this.data
      var width = this.$el.clientWidth || this.$el.parentNode.clientWidth
      console.log(width)
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
      chart.axis(false)
      chart.polygon().position(Stat.map.region('name', mapData)).color('value')
      chart.point().position(Stat.map.center('name', mapData))
        .color('#fff')
        .label('name', {offset: 0, label: {fill: '#000', 'font-size': 10}})
        .size(0)
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
