<template>
  <div class="demo-map" transition="demo-map">
    <chart :options="mapOptions" :loading="loadingData" type="bmap" height="100%"></chart>
    <div class="demo-map-sidebar">
      <div class="sidebar-mask"></div>
      <div class="sidebar-tab">
        <div class="sidebar-tab__item active">设备总量城市TOP10</div>
        <!-- <div class="sidebar-tab__item">详细地理位置</div> -->
      </div>
      <div class="demo-map-cities-wrap">
        <div class="demo-map-cities">
          <ul>
            <li v-for="(cityIndex, city) in cityData" :class="{'top10': cityIndex < 10}">
              <div class="num"><span>{{ cityIndex + 1 }}</span></div>
              <div class="name">{{ city.name }}</div>
              <div class="percentage">
                <span class="progress" :style="progressStyle(city.value)"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <button class="btn btn-sm btn-dismiss" @click.prevent.stop="dismiss"><i class="fa fa-compress"></i></button>
  </div>
</template>

<script>
import Chart from 'components/chart/index'
// import 'echarts/extension/bmap/bmap'
// import formatDate from 'filters/format-date'
import MAP_STYLE from './map-style'
import api from 'api'
import * as http from 'src/http'
import Promise from 'promise'

let MAX_SYMBOL_SIZE = 50
let MIN_SYMBOL_SIZE = 8

export default {
  name: 'DemoMap',

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  components: {
    Chart
  },

  data () {
    return {
      loadingData: false,
      cityData: []
    }
  },

  computed: {
    // 总量
    total () {
      let result = 0

      if (this.cityData.length) {
        result = _.sumBy(this.cityData, 'value')
      }

      return result
    },

    // 地图配置
    mapOptions () {
      let self = this
      return {
        tooltip: {
          trigger: 'item',
          formatter (params) {
            return `${params.seriesName}<br >${params.name} : ${params.value[2]}`
          }
        },
        bmap: {
          center: [115.114129, 37.550339],
          zoom: 5,
          roam: true,
          mapStyle: {
            styleJson: MAP_STYLE
          }
        },
        series: [{
          name: '设备数量',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: this._convertData(this.cityData.sort(function (a, b) {
            return b.value - a.value
          }).slice(10)),
          symbolSize (val) {
            let result

            if (self.total) {
              result = MAX_SYMBOL_SIZE * val[2] / self.total
            }

            if (result < MIN_SYMBOL_SIZE) {
              result = MIN_SYMBOL_SIZE
            }

            return result
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              color: '#C0C3C7'
            }
          }
        }, {
          name: 'Top10',
          type: 'effectScatter',
          // type: 'scatter',
          coordinateSystem: 'bmap',
          data: this._convertData(this.cityData.sort(function (a, b) {
            return b.value - a.value
          }).slice(0, 10)),
          symbolSize (val) {
            let result

            if (self.total) {
              result = MAX_SYMBOL_SIZE * val[2] / self.total
            }

            if (result < MIN_SYMBOL_SIZE) {
              result = MIN_SYMBOL_SIZE
            }

            return result
          },
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true
            }
          },
          itemStyle: {
            normal: {
              color: 'rgba(255, 206, 91, .7)',
              shadowBlur: 10,
              shadowColor: '#F37F58'
            }
          },
          zlevel: 1
        }]
      }
    }
  },

  ready () {
    http.get('/static/data/map/coordinates.json').then((res) => {
      let geoCoordMap = {}
      let cities = res.data.municipalities

      _.forEach(res.data.provinces, (item) => {
        cities = cities.concat(item.cities)
      })
      cities = cities.concat(res.data.other)

      _.forEach(cities, (item) => {
        let arr = item.g.split(',')
        geoCoordMap[item.n] = [arr[0], arr[1]]
      })
      this.geoCoordMap = geoCoordMap
    })
    this.getCityData()
  },

  methods: {
    /**
     * 获取城市数据
     */
    getCityData () {
      let getMapping = http.get('/static/data/map/cities.json')
      let getRegion = api.statistics.getProductRegion(this.$route.params.id)
      Promise.all([getMapping, getRegion]).then(values => {
        let mapping = values[0].data
        let regionData = values[1].data
        let cnKeys = ['中国', 'China', 'china']
        let cnData = {}
        let result = []

        // 获取城市数据
        cnKeys.forEach((key) => {
          if (regionData.hasOwnProperty(key)) {
            let contury = regionData[key]
            for (let provinceName in contury) {
              let cities = contury[provinceName]
              if (typeof cities === 'number') {
                continue
              }

              for (let cityName in cities) {
                let city = cities[cityName]
                if (typeof city === 'number' || !city.activated) {
                  continue
                }

                if (cnData[cityName]) {
                  cnData[cityName] += city.activated
                } else {
                  cnData[cityName] = city.activated
                }
              }
            }
          }
        })

        // 遍历映射表，生成城市数据
        mapping.forEach((city) => {
          let val1 = cnData[city.name] || 0
          let val2 = cnData[city.pinyin] || 0
          let val = val1 + val2
          if (val) {
            result.push({
              name: city.name,
              value: val1 + val2
            })
          }
        })

        return result
      }).then((data) => {
        // 排序
        this.cityData = _.reverse(_.sortBy(data, 'value'))
      })
    },

    /**
     * 关闭演示地图
     */
    dismiss () {
      this.show = false
      this.$emit('dismiss', this.show)
    },

    /**
     * 转换地图数据
     */
    _convertData (data) {
      var res = []
      for (var i = 0; i < data.length; i++) {
        var geoCoord = this.geoCoordMap[data[i].name]
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          })
        }
      }
      return res
    },

    /**
     * 计算占比
     */
    progressStyle (val) {
      let percentage = 0

      if (this.total) {
        percentage = val / this.total * 100
        percentage = percentage.toFixed(2)
      }

      return {
        width: `${percentage}%`
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../../assets/stylus/common'

.demo-map
  fixed left top
  size 100%
  background #222931
  z-index 10100

  .btn-dismiss
    absolute right 10px bottom 10px
    border 1px solid #CC4237
    background transparent
    font-size 16px
    color #CC4237
    z-index 10

.demo-map-transition
  opacity 1
  transition opacity 0.3s ease, transform 0.3s ease

// 浮层动画
.demo-map-enter
.demo-map-leave
  opacity 0
  transform scale(0.8)

.demo-map-sidebar
  absolute right top
  size 320px 100%
  border-left 1px solid #1D1E1F
  color #AEB6BC

  .sidebar-tab
    position relative
    height 44px
    clearfix()
    z-index 1
    background #2B333B

    .sidebar-tab__item
      float left
      /*width 160px*/
      width 320px
      text-align center
      font-size 14px
      height 44px
      line-height 40px
      border-left 1px solid #1D1E1F
      border-right 1px solid #1D1E1F
      border-top 3px solid #2B333B
      box-sizing border-box

      & + .sidebar-tab__item
        border-left none

      &:first-child
        border-left none

      &:last-child
        border-right none

      &.active
        padding-top 4px
        border-top-color #FFCE5B
        background #1F262D

  .sidebar-mask
    absolute left top
    size 100%
    background #20262D
    /*opacity 0.7*/

.demo-map-cities-wrap
  absolute left top 50px right bottom 50px
  overflow hidden
  z-index 1

.demo-map-cities
  size 350px 100%
  overflow-y auto

  ul
    width 320px
    padding 0 20px
    box-sizing border-box

  li
    border-bottom 1px dashed #28333A
    padding 15px 0
    clearfix()

    .num
    .name
    .percentage
      float left

    .num
      width 40px

      span
        height 20px
        display inline-block
        padding 0 5px
        color #FFF
        background #737980

    .name
      size 90px 20px
      line-height 20px

    .percentage
      size 150px 20px

      .progress
        display inline-block
        height 5px
        border-radius 0 3px 3px 0
        background #FFCE5B
        position relative

        &:after
          absolute left -11px top -3px
          content ''
          size 11px
          border-radius 6px
          background #FFCE5B

  .top10
    .num
      span
        background #E8AD37

.anchorBL
  display none !important
</style>
