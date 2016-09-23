<template>
  <div class="x-time-line">
    <div v-if="data && !rendered" class="default"></div>
  </div>
</template>

<script>
import { uniformDate } from 'src/filters'
import _ from 'lodash'
import getMessageQueue from 'src/utils/mq.js'

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
    // day 表示按天显示
    // hour 表示按小时显示
    scale: {
      type: String,
      default: 'day'
    },
    margin: {
      default () {
        return [50, 20, 30, 50]
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
    min () {
      let temp = []
      this.data.forEach((item) => {
        temp.push(item.val)
      })
      return Math.min(...temp)
    },
    max () {
      let temp = []
      this.data.forEach((item) => {
        temp.push(item.val)
      })
      return Math.max(...temp)
    },
    tickCount () {
      let range = this.max - this.min
      if (range === 0) {
        return 1
      } else if (range <= 5) {
        return parseInt(range)
      } else {
        return 5
      }
    },
    // 最长一条线的长度
    maxLineLenght () {
      if (this.data.length > 0 && this.data[0].name) {
        let group = _.groupBy(this.data, (item) => {
          return item.name
        })
        let lengthArr = []
        for (let key in group) {
          lengthArr.push(group[key].length)
        }
        return Math.max(...lengthArr)
      }
      return this.data.length || 0
    }
  },

  watch: {
    // 监听数据变化，渲染图表
    data () {
      if (this.chart) {
        if (this.maxLineLenght > 30 && this.point) {
          this.point.size(0)
        } else if (this.point) {
          this.point.size(4)
        }
        let data = this.format(this.data)
        let defs = this.getConfig()
        this.chart.source(data, defs)
        this.chart.repaint()
      } else {
        // 检查组件dom是否就绪
        if (this._isReady) {
          this.render()
        }
      }
    }
  },

  ready () {
    if (!this.chart) {
      this.render()
    }
  },

  methods: {
    /**
     * 格式化日期对象
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    format (data) {
      if (this.scale === 'day') {
        data.map((item) => {
          item.date = uniformDate(new Date(item.date))
        })
      }
      return data
    },
    render () {
      if (!this.data || this.data.length <= 0) {
        return
      }

      var data = this.format(this.data)

      // 默认配置
      var defaults = {
        container: this.$el, // 容器
        forceFit: true, // 强制宽度自适应
        height: 250, // 高度
        plotCfg: {
          margin: this.margin// 边距
        }
      }

      var chart = new window.G2.Chart(defaults)
      this.chart = chart

      chart.legend({
        position: 'top',
        itemWrap: true
      })

      let defs = this.getConfig()

      chart.source(data, defs)

      // x 轴配置
      chart.axis('date', {
        title: null
      })
      // y 轴配置
      chart.axis('val', {
        title: null
      })

      let line = chart.line().position('date*val').size(2)
      let point = null
      if (this.maxLineLenght <= 30) {
        point = chart.point().position('date*val').shape('name', ['circle', 'rect', 'diamond']).size(4)
        this.point = point
      } else {
        point = chart.point().position('date*val').shape('name', ['circle', 'rect', 'diamond']).size(0)
        this.point = point
      }

      if (data[0].hasOwnProperty('name')) {
        line.color('name')
        if (this.point) {
          point.color('name')
        }
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

      let mq = getMessageQueue()
      mq.push(chart, this, function () {
        this.rendered = true
      })
    },
    getConfig () {
      let defs = {
        date: {
          alias: '日期',
          type: 'time',
          mask: 'mm-dd'
        },
        val: {
          type: 'linear',
          tickCount: this.tickCount
        }
      }
      if (this.scale === 'hour') {
        defs.date.mask = 'HH:MM'
      } else if (this.scale === 'day-hour') {
        defs.date.mask = 'mm-dd HH:MM'
      }

      return defs
    }
  }
}
</script>

<style lang="stylus">
.x-time-line
  .default
    height 250px
    width 100%
    line-height 250px
    display inline-block
    text-align center
</style>
