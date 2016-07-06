<template>
  <div class="x-line"></div>
</template>

<script>
import G2 from 'g2'
import _ from 'lodash'

export default {
  name: 'Line',

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
        position: 'top'
      }
      var tooltipDefaults = {}

      var chart = new G2.Chart(_.merge({}, defaults, this.options.props))
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
      var line = chart.line().position(this.options.position).shape('smooth').size(this.options.size || 2)
      if (this.options.color) {
        line.color(this.options.color)
      }
      chart.render()
    }
  }
}
</script>

<style lang="stylus">
</style>
