import EventListener from 'utils/event-listener'
import echarts from 'echarts'

/**
 * Echarts 图表
 * @type {Object}
 */
export var chart = {
  deep: true,

  params: ['loading', 'height'],

  paramWatchers: {
    loading (val, oldVal) {
      if (val) {
        this.chart.showLoading()
      } else {
        this.chart.hideLoading()
      }
    }
  },

  bind () {
    this.vm.$nextTick(() => {
      this.el.style.height = this.params.height || '250px'
      this.chart = echarts.init(this.el)

      if (this.params.loading) {
        this.chart.showLoading()
      }

      this.resizeEvent = EventListener.listen(window, 'resize', (e) => {
        this.chart.resize()
      })
    })
  },

  update (val, oldVal) {
    this.vm.$nextTick(() => {
      this.chart.dispose()
      this.chart = echarts.init(this.el)
      this.chart.setOption(val)
    })
  },

  unbind () {
    this.chart.dispose()
    if (this.resizeEvent) {
      this.resizeEvent.remove()
    }
  }
}
