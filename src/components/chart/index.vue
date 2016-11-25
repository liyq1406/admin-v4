<template>
  <div class="chart-box" :style="chartStyles"></div>
</template>

<script>
import EventListener from 'utils/event-listener'
import { CHART_COLORS } from 'consts/config'
import { importEcharts } from 'store/actions/system'

export default {
  name: 'Chart',

  vuex: {
    getters: {
      echartsStatus: ({ system }) => system.echartsStatus
    },
    actions: {
      importEcharts
    }
  },

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
    },

    echartsStatus (val, oldVal) {
      if (oldVal === 1 && val === 2) {
        this.init()
      }
    }
  },

  ready () {
    if (window.echarts && this.echartsStatus === 2) {
      this.init()
    } else {
      if (this.echartsStatus === 0) {
        this.importEcharts()
      }
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
      if (this.type === 'china-map' || this.type === 'bmap') {
        this.$http.get('/static/data/map/china.json').then((res) => {
          window.echarts.registerMap('china', res.data)
          this.initEchart()
        })
      } else if (this.type === 'world-map') {
        this.$http.get('/static/data/map/world.json').then((res) => {
          window.echarts.registerMap('world', res.data)
          this.initEchart()
        })
      } else {
        this.initEchart()
      }
    },
    initEchart () {
      this.chart = window.echarts.init(this.$el)
      if (this.type === 'world-map') {
        this.bindMapSelectEvent()
      }
      this.bindEvent()
      this._render()
    },

    bindMapSelectEvent () {
      this.chart.on('click', (params) => {
        this.$emit('world-map-select', params.name)
      })
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
