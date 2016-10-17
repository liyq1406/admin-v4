<template>
  <div class="chart-box" :style="chartStyles"></div>
</template>

<script>
import EventListener from 'utils/event-listener'
import echarts from 'echarts'

export default {
  name: 'Chart',

  // props: ['height', 'loading', 'options'],

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
    }
  },

  data () {
    return {
      chart: null
    }
  },

  computed: {
    chartStyles () {
      return {
        height: this.height
      }
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
    this._render()
  },

  destroyed () {
    this.chart.dispose()
    if (this.resizeEvent) {
      this.resizeEvent.remove()
    }
  },

  methods: {
    _render () {
      if (!this.chart) {
        this.chart = echarts.init(this.$el)

        this.resizeEvent = EventListener.listen(window, 'resize', (e) => {
          this.chart.resize()
        })
      }

      if (this.loading) {
        this.chart.showLoading()
      }

      this.chart.setOption(this.options, true)
    }
  }
}
</script>

<style lang="stylus">
.chart-box
  width 100%
</style>
