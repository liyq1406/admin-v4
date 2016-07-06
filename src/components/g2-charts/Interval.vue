<template>
  <div class="x-interval"></div>
</template>

<script>
// import G2 from 'g2'
import _ from 'lodash'

export default {
  name: 'Interval',

  props: {
    // 数据
    data: {
      type: Array,
      default () {
        return []
      }
    },

    // 配置项
    options: {
      type: Object,
      default () {
        return {}
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
      // 默认配置
      var defaults = {
        container: this.$el, // 容器
        forceFit: true, // 强制宽度自适应
        height: 400, // 高度
        plotCfg: {
          margin: [40, 40, 80, 60] // 边距
        }
      }
      var axisDefaults = {
        title: null
      }
      var legendDefaults = {
        position: 'bottom'
      }
      var tooltipDefaults = {}

      var chart = new window.G2.Chart(_.merge({}, defaults, this.options.props))
      var defs = this.options.defs

      for (let key in defs) {
        // 设置横轴点
        if (defs[key].hasOwnProperty('type') && defs[key].type === 'cat') {
          defs[key].values = _.uniq(_.map(this.data, key))
        }
      }

      if (this.options.axis === false) {
        chart.axis(false)
      } else {
        for (let key in defs) {
          chart.axis(key, this.options.axis ? _.merge({}, axisDefaults, this.options.axis[key]) : axisDefaults)
        }
      }

      if (this.options.legend === false) {
        chart.legend(false)
      } else {
        chart.legend(_.merge({}, legendDefaults, this.options.legend))
      }

      if (this.options.tooltip === false) {
        chart.tooltip(false)
      } else {
        chart.tooltip(_.merge({}, tooltipDefaults, this.options.tooltip))
      }

      chart.source(this.data, defs)
      if (this.options.horizontal) {
        chart.coord('rect').transpose()
      }

      var interval
      var pos = this.options.position

      if (this.options.stack) {
        interval = chart.intervalStack()
        pos = window.G2.Stat.summary.mean(pos)
      } else {
        interval = chart.interval()
      }

      interval = interval.position(pos)

      if (this.options.color) {
        interval.color(this.options.color)
      }
      chart.render()
    }
  }
}
</script>

<style lang="stylus">
</style>
