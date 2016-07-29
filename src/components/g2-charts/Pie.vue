<template>
  <div class="x-pie">
    <div v-if="!data || data.length===0" class="default" :style="{height: noDataHeight, lineHeight: noDataHeight}">没有数据</div>
  </div>
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
    },
    height: {
      type: Number,
      default: 300
    },
    margin: {
      default () {
        return [30, 0, 0, 0]
      }
    }
  },

  data () {
    return {
      chart: null
    }
  },

  computed: {
    noDataHeight () {
      if (this.height) {
        return this.height.toString() + 'px'
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
      if (this.data.length <= 0) {
        return
      }
      // 默认配置
      var defaults = {
        container: this.$el, // 容器
        forceFit: true, // 强制宽度自适应
        height: this.height, // 高度
        plotCfg: {
          margin: this.margin// 边距
        }
      }
      var legendDefaults = {
        position: 'top',
        itemWrap: true
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
        .color('name').label('name', {
          custom: true, // 表示使用自定义文本
          renderer: function formatter (text, item) {
            // var point = item.point // 每个弧度对应的点
            // var percent = point['..percent'] // ..proportion 字段由Stat.summary.proportion统计函数生成
            return ''
          },
          labelLine: false,
          offset: 0})
        // .label('name*..percent', (name, percent) => {
        //   percent = (percent * 100).toFixed(2) + '%'
        //   return name + ' ' + percent
        // })

      chart.render()

      chart.on('itemselected', (e) => {
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

<style lang="stylus">
.x-pie
  .default
    height 300px
    width 100%
    line-height 300px
    display inline-block
    text-align center
</style>
