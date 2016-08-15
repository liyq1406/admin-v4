<template>
  <div class="x-annulus">
    <div v-if="data && data.length===0 && !rendered" class="default" :style="{height: noDataHeight, lineHeight: noDataHeight}">没有数据</div>
  </div>
</template>

<script>
export default {
  name: 'Annulus',

  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    height: {
      type: Number,
      default: 250
    },
    margin: {
      default () {
        return [0, 0, 20, 0]
      }
    }
  },

  data () {
    return {
      chart: null,
      rendered: false
    }
  },

  computed: {
    noDataHeight () {
      if (this.height) {
        return this.height.toString() + 'px'
      }
    },

    // 总数
    sum () {
      return this.data.reduce((prev, curr) => {
        return prev + curr.val
      }, 0)
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

      var frag = document.createElement('div')
      frag.innerHTML = `<div style="position: absolute;width: 100px;top: 85px;left: 50%; margin-left:-50px;text-align: center;color: #999;"><p style="font-size: 10px; margin: 5px 0">产品配额</p><p style="font-size: 20px; margin: 5px 0; color: black">${this.sum}</p>`
      this.$el.appendChild(frag)
      // function formatter (text, item) {
      //   var point = item.point // 每个弧度对应的点
      //   var percent = point['..percent'] // ..proportion 字段由Stat.summary.proportion统计函数生成
      //   percent = (percent * 100).toFixed(2) + '%'
      //   return percent
      // }
      var Stat = window.G2.Stat
      var chart = new window.G2.Chart(defaults)
      // 以 year 为维度划分分面
      // chart.facet(['year'])
      chart.source(this.data)
      chart.legend('bottom')
      chart.coord('theta', {
        radius: 0.7,
        inner: 0.7
      })
      chart.tooltip({
        title: null
      })
      chart.intervalStack().position(Stat.summary.percent('val')).color('name')
      chart.render()
    }
  }
}
</script>

<style lang="stylus">
.x-annulus
  .default
    height 250px
    width 100%
    line-height 250px
    display inline-block
    text-align center
</style>
