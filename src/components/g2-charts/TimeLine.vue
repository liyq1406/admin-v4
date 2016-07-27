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
    // line 折线图
    // smooth 曲线图
    type: {
      type: String,
      default: 'line'
    },
    margin: {
      default () {
        return [50, 50, 30, 30]
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

      // 默认配置
      var defaults = {
        container: this.$el, // 容器
        forceFit: true, // 强制宽度自适应
        height: 300, // 高度
        plotCfg: {
          margin: this.margin// 边距
        }
      }

      var chart = new window.G2.Chart(defaults)
      this.chart = chart

      chart.legend({
        position: 'top'
      })

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
      var color = fields[2] || null

      chart.source(this.data, defs)

      var line = chart.line().position(position).size(2)
      if (color) {
        line.color(color)
      }

      switch (this.type) {
        case 'line':
          break
        case 'smooth':
          line.shape('smooth')
          break
        default:
          break
      }

      chart.render()
    }
  }
}
</script>

<style lang="stylus">
</style>
