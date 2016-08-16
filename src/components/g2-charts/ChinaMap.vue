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

  data () {
    return {
      chart: null
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
      var userData = this.data
      var width = this.$el.clientWidth || this.$el.parentNode.clientWidth
      width = width * 0.8
      var height = width * (6 / 7) * 0.8
      // 默认配置
      var defaults = {
        container: this.$el,
        // forceFit: true,
        width: width,
        height: height,
        plotCfg: {
          margin: [30, 10, 0, 0]
        }
      }

      var chart = new window.G2.Chart(_.merge({}, defaults, this.options.props))
      this.chart = chart
      chart.source(userData)
      chart.axis(false)
      chart.polygon().position(Stat.map.region('name', mapData)).color('value', '#BBE1E4-#58BFC6')
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
