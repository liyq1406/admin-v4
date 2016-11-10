<template>
  <div class="chart-box" :style="chartStyles"></div>
</template>

<script>
import EventListener from 'utils/event-listener'
import echarts from 'echarts'
import { CHART_COLORS } from 'consts/config'

export default {
  name: 'Chart',

  props: {
    // 高度
    height: {
      type: String,
      default: '250px'
    },

    // 是否正在加载
    loading: {
      type: Boolean,
      default: false
    },

    // 图表配置
    options: {
      type: Object,
      default () {
        return {
          series: []
        }
      }
    },

    // 图表类型
    type: {
      type: String,
      default: 'line'
    }
  },

  data () {
    return {
      chart: null
    }
  },

  computed: {
    // 图表样式
    chartStyles () {
      return {
        height: this.height
      }
    },

    // 选项
    opts () {
      let result = {
        color: CHART_COLORS
      }
      return _.merge(result, this.options)
    }
  },

  watch: {
    loading (val, oldVal) {
      if (this.chart) {
        if (val) {
          this.chart.showLoading()
        } else {
          this.chart.hideLoading()
        }
      }
    },

    options (val) {
      this._render()
    }
  },

  ready () {
    if (this.type === 'china-map' || this.type === 'bmap') {
      this.$http.get('/static/data/map/china.json').then((res) => {
        echarts.registerMap('china', res.data)
        this.init()
      })
    } else {
      this.init()
    }
  },

  destroyed () {
    if (this.chart) {
      this.chart.dispose()
    }
    if (this.resizeEvent) {
      this.resizeEvent.remove()
    }
  },

  methods: {
    init () {
      this.chart = echarts.init(this.$el)
      this.bindEvent()
      this._render()
    },

    bindEvent () {
      this.resizeEvent = EventListener.listen(window, 'resize', (e) => {
        this.chart.resize()
      })
    },

    _render () {
      if (!this.chart) return
      this.$nextTick(() => {
        if (this.loading) {
          this.chart.showLoading()
        }

        this.chart.setOption(this.opts, true)
      })
    }
  }
}
</script>

<style lang="stylus">
.chart-box
  position relative
  width 100%
</style>
