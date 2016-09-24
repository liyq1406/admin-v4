<template>
  <div class="x-pie">
    <div v-if="(data && data.length===0 && !rendered)" class="default" :style="{height: noDataHeight, lineHeight: noDataHeight}"></div>
  </div>
</template>

<script>
// import G2 from 'g2'
import _ from 'lodash'
import getMessageQueue from 'src/utils/mq.js'

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
      chart: null,
      rendered: false // 解决第二次传入空数组，空图标和没有数据同时存在的问题
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
        // 检查组件dom是否就绪
        if (this._isReady) {
          this.render()
        }
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

      let mq = getMessageQueue()
      mq.push(chart, this, function () {
        var geom = this.chart.getGeoms()[0] // 获取所有的图形
        var items = geom.getData() // 获取图形对应的数据
        geom.setSelected(items[0]) // 设置选中
      })

      chart.on('itemselected', (e) => {
        this.$emit('itemselected', e.data._origin)
      })
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
