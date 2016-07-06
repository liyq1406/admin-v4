<template>
  <div class="x-china-map"></div>
</template>

<script>
import G2 from 'g2'
import mapData from './map-data.json'
import _ from 'lodash'

export default {
  name: 'ChinaMap',

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
    }
  },

  watch: {
    // 监听数据变化，渲染图表
    data () {
      this.render()
    }
  },

  methods: {
    render () {
      var Stat = G2.Stat
      var userData = this.data
      // 默认配置
      var defaults = {
        container: this.$el,
        // forceFit: true,
        width: 600,
        height: 500,
        plotCfg: {
          margin: [30, 0]
        }
      }

      var chart = new G2.Chart(_.merge({}, defaults, this.options.props))

      chart.source(userData)
      chart.axis(false)
      chart.polygon().position(Stat.map.region('name', mapData)).color('value')
      chart.point().position(Stat.map.center('name', mapData))
        .color('#fff')
        .label('name', {offset: 0, label: {fill: '#000', 'font-size': 10}})
        .size(0)
      chart.render()

      // var userData = [
      //   {name: '北京', value: Math.round(Math.random() * 1000)},
      //   {name: '天津', value: Math.round(Math.random() * 1000)},
      //   {name: '上海', value: Math.round(Math.random() * 1000)},
      //   {name: '重庆', value: Math.round(Math.random() * 1000)},
      //   {name: '河北', value: Math.round(Math.random() * 1000)},
      //   {name: '河南', value: Math.round(Math.random() * 1000)},
      //   {name: '云南', value: Math.round(Math.random() * 1000)},
      //   {name: '辽宁', value: Math.round(Math.random() * 1000)},
      //   {name: '黑龙江', value: Math.round(Math.random() * 1000)},
      //   {name: '湖南', value: Math.round(Math.random() * 1000)},
      //   {name: '安徽', value: Math.round(Math.random() * 1000)},
      //   {name: '山东', value: Math.round(Math.random() * 1000)},
      //   {name: '新疆', value: Math.round(Math.random() * 1000)},
      //   {name: '江苏', value: Math.round(Math.random() * 1000)},
      //   {name: '浙江', value: Math.round(Math.random() * 1000)},
      //   {name: '江西', value: Math.round(Math.random() * 1000)},
      //   {name: '湖北', value: Math.round(Math.random() * 1000)},
      //   {name: '广西', value: Math.round(Math.random() * 1000)},
      //   {name: '甘肃', value: Math.round(Math.random() * 1000)},
      //   {name: '山西', value: Math.round(Math.random() * 1000)},
      //   {name: '内蒙古', value: Math.round(Math.random() * 1000)},
      //   {name: '陕西', value: Math.round(Math.random() * 1000)},
      //   {name: '吉林', value: Math.round(Math.random() * 1000)},
      //   {name: '福建', value: Math.round(Math.random() * 1000)},
      //   {name: '贵州', value: Math.round(Math.random() * 1000)},
      //   {name: '广东', value: Math.round(Math.random() * 1000)},
      //   {name: '青海', value: Math.round(Math.random() * 1000)},
      //   {name: '西藏', value: Math.round(Math.random() * 1000)},
      //   {name: '四川', value: Math.round(Math.random() * 1000)},
      //   {name: '宁夏', value: Math.round(Math.random() * 1000)},
      //   {name: '海南', value: Math.round(Math.random() * 1000)},
      //   {name: '台湾', value: Math.round(Math.random() * 1000)},
      //   {name: '香港', value: Math.round(Math.random() * 1000)},
      //   {name: '澳门', value: Math.round(Math.random() * 1000)}
      // ]
      // var chart = new G2.Chart({
      //   container: this.$el,
      //   forceFit: true,
      //   height: 500,
      //   plotCfg: {
      //     margin: [50, 200]
      //   }
      // })
      // chart.source(userData)
      // var gmap = new G2.Plugin.GMap({
      //   chart: chart,
      //   mapData: mapData,
      //   style: {
      //     stroke: '#999',
      //     fill: '#fff'
      //   }
      // })
      // gmap.draw()
      // chart.tooltip({
      //   crosshairs: false
      // })
      // chart.legend('value', false)
      // chart.point().position(G2.Stat.map.center('name', mapData)).size('value', 25).opacity(0.5).shape('circle').label('name')
      // chart.render()
    }
  }
}
</script>

<style lang="stylus">
@import '../../assets/stylus/common'

.x-china-map
  display inline-block
  max-width 600px
  text-align center
  margin 0 auto
</style>
