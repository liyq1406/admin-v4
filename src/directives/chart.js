import EventListener from 'utils/event-listener'
import echarts from 'echarts'

// 图表默认高度
const DEFAULT_HEIGHT = '250px'

/**
 * Echarts 图表指令
 * @type {Object}
 */
let chart = {
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
      this.el.style.height = this.params.height || DEFAULT_HEIGHT
      this.el.style.width = '300px'
      console.log('111111')
      console.log(this.el.parentNode.clientWidth)
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
      console.log('2222222')
      console.log(this.el.parentNode.clientWidth)
      // this.chart.dispose()
      // this.chart = echarts.init(this.el)
      this.chart.setOption(val)
    })
  },

  unbind () {
    console.log('33333333')
    this.chart.dispose()
    if (this.resizeEvent) {
      this.resizeEvent.remove()
    }
  }
}

export default chart
