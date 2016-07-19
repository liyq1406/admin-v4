<template>
  <div class="x-pie"></div>
</template>

<script>
// import G2 from 'g2'
import _ from 'lodash'

export default {
  name: 'Pie',

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
    this.render()
  },

  watch: {
    // 监听数据变化，渲染图表
    data () {
      console.log('watch change')
      if (this.chart) {
        this.chart.changeData(this.data)
      } else {
        this.render()
      }
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
          margin: 0 // 边距
        }
      }
      var legendDefaults = {
        position: 'bottom'
      }
      var chart = new window.G2.Chart(_.merge({}, defaults, this.options.props))
      this.chart = chart
      chart.source(this.data)
      chart.coord('theta', {
        radius: 0.7 // 设置饼图的大小
      })

      if (this.options.legend === false) {
        chart.legend(false)
      } else {
        chart.legend(_.merge({}, legendDefaults, this.options.legend))
      }

      chart.intervalStack()
        .position(window.G2.Stat.summary.percent('value'))
        .color('name')
        .label('name*..percent', (name, percent) => {
          percent = (percent * 100).toFixed(2) + '%'
          return name + ' ' + percent
        })

      chart.render()

      chart.on('itemselected', (e) => {
        console.log(e.data._origin)
        this.$emit('itemselected', e.data._origin)
      })

      var geom = chart.getGeoms()[0] // 获取所有的图形
      var items = geom.getData() // 获取图形对应的数据
      geom.setSelected(items[0]) // 设置选中

      // var defs = this.options.defs
      // var defaultLegendOptions = {
      //   position: 'top'
      // }
      //
      // for (var key in defs) {
      //   // 不显示坐标轴标题
      //   chart.axis(key, {
      //     title: null
      //   })
      //
      //   // 设置横轴点
      //   if (defs[key].hasOwnProperty('type') && defs[key].type === 'cat') {
      //     defs[key].values = _.uniq(_.map(this.options.data, key))
      //   }
      // }
      //
      // chart.axis(this.options.axis || true)
      // chart.legend(_.merge(defaultLegendOptions, this.options.legend))
      // chart.tooltip(this.options.tooltip || true)

      // chart.source(this.options.data, defs)
      // chart.line().position(`${this.options.fields[0]}*${this.options.fields[1]}`).color(this.options.fields[2]).size(this.options.size || 2)
      // chart.render()
    }
  }
}
</script>
