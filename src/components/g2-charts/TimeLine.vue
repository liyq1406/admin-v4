<template>
  <div class="x-single-line"></div>
</template>

<script>
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
    options: {
      type: Object,
      default () {
        return {}
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
      if (this.data.length <= 0) {
        return
      }
      // 默认配置
      var defaults = {
        container: this.$el, // 容器
        forceFit: true, // 强制宽度自适应
        height: 400, // 高度
        plotCfg: {
          margin: 100 // 边距
        }
      }
      // var legendDefaults = {
      //   position: 'bottom'
      // }
      var chart = new window.G2.Chart(defaults)
      this.chart = chart

      var fields = []
      var defs = {}
      for (var i in this.data[0]) {
        if (this.data[0][i] instanceof Date) {
          defs[i] = {
            alias: '日期',
            type: 'time',
            mask: 'mm-dd'
          }
        }
        fields.push(i)
      }

      var position = fields[0] + '*' + fields[1]
      chart.source(this.data, defs)
      chart.line().position(position).size(2)
      chart.render()
    }
  }
}
</script>

<style lang="stylus">
</style>
