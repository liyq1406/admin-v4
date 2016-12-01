<template>
  <div class="demo-map" transition="demo-map">
    <chart :options="mapOptions" :loading="loadingData" type="bmap" height="100%"></chart>
    <div class="demo-map-sidebar">
      <div class="sidebar-mask"></div>
      <div class="sidebar-tab">
        <div class="sidebar-tab__item active">设备总量城市TOP10</div>
        <div class="sidebar-tab__item">详细地理位置</div>
      </div>
      <div class="demo-map-cities-wrap">
        <div class="demo-map-cities">
          <ul>
            <li class="top10" v-for="n in 50">
              <div class="num"><span>1</span></div>
              <div class="name">北京</div>
              <div class="percentage">
                <span class="progress" style="width: 80%"></span>
              </div>
            </li>
            <li>
              <div class="num"><span>2</span></div>
              <div class="name">广州</div>
              <div class="percentage">
                <span class="progress" style="width: 30%"></span>
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
// import api from 'api'

export default {
  name: 'DeviceMap',

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
    mapOptions () {
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
            styleJson: [{
              'featureType': 'water',
              'elementType': 'all',
              'stylers': {
                'color': '#222931'
              }
            }, {
              'featureType': 'land',
              'elementType': 'all',
              'stylers': {
                'color': '#2F3844'
              }
            }, {
              'featureType': 'railway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'highway',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry',
              'stylers': {
                'visibility': 'off'
                // 'color': '#586B7E'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry.fill',
              'stylers': {
                'visibility': 'off'
                // 'color': '#586B7E'
              }
            }, {
              'featureType': 'poi',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'green',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'subway',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'manmade',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'local',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
                // 'color': '#d1d1d1'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'boundary',
              'elementType': 'geometry',
              'stylers': {
                'color': '#586B7E',
                'weight': '1',
                'lightness': -20
              }
            }, {
              'featureType': 'building',
              'elementType': 'all',
              'stylers': {
                'visibility': 'off'
                // 'color': '#d1d1d1'
              }
            }, {
              'featureType': 'label',
              'elementType': 'labels.text.fill',
              'stylers': {
                'visibility': 'off'
                // 'color': '#999999'
              }
            }]
          }
        },
        series: [{
          name: 'pm2.5',
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: this._convertData(this.cityData),
          symbolSize: function (val) {
            return Math.sqrt(val[2]) * 1.8
          },
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
              color: this._getColor()
            }
          }
        }, {
          name: 'Top 5',
          type: 'effectScatter',
          coordinateSystem: 'bmap',
          data: this._convertData(this.cityData.sort(function (a, b) {
            return b.value - a.value
          }).slice(0, 7)),
          symbolSize: function (val) {
            return Math.sqrt(val[2]) * 1.8
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
              color: this._getColor(),
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
    this.$http.get('/static/data/map/coordinates.json').then((res) => {
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
     * 关闭演示地图
     */
    dismiss () {
      this.show = false
      this.$emit('dismiss', this.show)
    },

    /**
     * 获取颜色
     */
    _getColor () {
      return function (params) {
        // let colors = ['#B3C24F', '#F3D55E', '#FFB15A', '#EF8050', '#DE5753', '#8C3348']
        let colors = ['#B3C24F', '#FDCD46', '#FFB15A', '#EF8050', '#DE5753', '#C6202E']
        let val = params.value[2]
        let level = 0

        if (val >= 35 && val < 70) {
          level = 1
        } else if (val >= 70 && val < 100) {
          level = 2
        } else if (val >= 100 && val < 150) {
          level = 3
        } else if (val >= 150 && val < 200) {
          level = 4
        } else if (val >= 200) {
          level = 5
        }

        return colors[level]
      }
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
     * 获取城市 pm2.5 数据
     */
    getCityData () {
      // 往前推20分钟才能查出最近的一个记录
      // let date = new Date().getTime() - 20 * 60 * 1000
      // let condition = {
      //   filter: ['location', 'pm25'],
      //   limit: 1000,
      //   // offset: (this.currentPage - 1) * this.countPerPage,
      //   order: {},
      //   query: {
      //     'update_time': {
      //       $gte: {
      //         '@date': formatDate(date, 'yyyy-MM-dd hh:mm:ss.SSS', true) + 'Z'
      //       }
      //     }
      //   }
      // }
      // this.loadingCityData = true
      // api.airquality.getAirQualitys(this.$route.params.app_id, condition).then((res) => {
      //   console.log(res.data)
      //   this.cityData = _.map(res.data.list, (item) => {
      //     return {
      //       name: item.location.name,
      //       value: item.pm25 - 0
      //     }
      //   })
      //   this.loadingCityData = false
      // }).catch((res) => {
      //   this.loadingCityData = false
      //   // this.handleError(res)
      // })
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

    .sidebar-tab__item
      float left
      width 160px
      text-align center
      font-size 14px
      background #2B333B
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
        background transparent

  .sidebar-mask
    absolute left top
    size 100%
    background #21262D
    opacity 0.7

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
