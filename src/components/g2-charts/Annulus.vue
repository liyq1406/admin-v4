<template>
  <div class="x-annulus">
    <slot>
      <div class="quota" v-show="!rendering">
        <div class="quota-tit">{{ title }}</div>
        <div class="quota-sum">{{ sum }}</div>
      </div>
    </slot>
    <div v-if="data && data.length===0" class="default" :style="{height: noDataHeight, lineHeight: noDataHeight}">没有数据</div>
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
    },
    title: {
      type: String,
      default: '产品配额'
    }
  },

  data () {
    return {
      chart: null,
      rendering: false
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
      if (!this.rendering) {
        this.rendering = true
        window.setTimeout(() => {
          this.render()
          this.rendering = false
        }, 500)
      }
    }
  },

  watch: {
    // 监听数据变化，渲染图表
    data () {
      if (this.chart) {
        this.chart.changeData(this.data)
      } else {
        if (!this.rendering) {
          this.rendering = true
          window.setTimeout(() => {
            this.render()
            this.rendering = false
          }, 500)
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

      // function formatter (text, item) {
      //   var point = item.point // 每个弧度对应的点
      //   var percent = point['..percent'] // ..proportion 字段由Stat.summary.proportion统计函数生成
      //   percent = (percent * 100).toFixed(2) + '%'
      //   return percent
      // }
      var Stat = window.G2.Stat
      var chart = new window.G2.Chart(defaults)
      this.chart = chart
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

  .quota
    position absolute
    width 100px
    top 85px
    left 50%
    margin-left -50px
    text-align center
    color #999

  .quota-tit
    font-size 10px
    margin 5px 0

  .quota-sum
    font-size 20px
    margin 5px 0
    color black
</style>
