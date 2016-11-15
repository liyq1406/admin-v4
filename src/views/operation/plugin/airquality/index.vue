<template>
  <div class="main">
    <div class="main-title">
      <h2>环境数据</h2>
    </div>
    <chart :options="mapOptions" :loading="loadingData" type="bmap" height="450px"></chart>
    <div class="panel mt20">
      <div class="panel-bd">
        <x-table :headers="columns" :tables="tables" :loading="loadingData" :page="page" @theader-update-time="sortBySomeKey" @page-count-update="pageCountUpdate" @current-page-change="currentPageChange">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group">
              <div class="filter-group-item">
                <span class="label">{{ $t('common.display') }}：</span>
                <!-- <x-select width="90px" size="small" :label="selectedOption.label">
                  <span slot="label">{{ $t('common.display') }}：</span>
                  <select v-model="selectedOption" @change="">
                    <option v-for="option in options" :value="option">{{ option.label }}</option>
                  </select>
                </x-select> -->
              </div>
              <div class="filter-group-item">
                <date-time-range-picker @timechange="timechange"></date-time-range-picker>
              </div>
              <div class="filter-group-item">
                <area-select :province.sync="area.province" :city.sync="area.city" :show-district="false" @province-change="getList" @city-change="getList" select-size="small"></area-select>
              </div>
            </div>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import * as config from 'consts/config'
import Chart from 'components/Chart/index'
import 'echarts/extension/bmap/bmap'
import formatDate from 'filters/format-date'

import api from 'api'

export default {
  name: 'airquality',

  mixins: [globalMixins],

  components: {
    Chart
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      intervalId: 0,
      geoCoordMap: {},
      // 总数
      total: 0,
      // 每页数量
      countPerPage: config.COUNT_PER_PAGE,
      // 当前页
      currentPage: 1,
      // 正在加载数据
      loadingData: false,
      cityData: [],
      loadingCityData: false,
      selectedOption: { label: this.$t('common.all'), value: 'all' },
      options: [
        { label: this.$t('common.all'), value: 'all' },
        { label: 'AQI', value: 'aqi' },
        { label: 'co', value: 'co' },
        { label: 'co', value: 'no2' }
      ],
      area: {
        province: {},
        city: {}
      },
      time: {
        startDate: new Date((+new Date()) - 7 * 1000 * 60 * 60 * 24),
        endDate: new Date()
      },
      columns: [
        {
          key: 'update_time',
          title: '时间',
          sortType: -1
        },
        {
          key: 'location',
          title: '地点'
        },
        {
          key: 'pm25',
          title: '室外pm2.5',
          class: 'tac'
        },
        {
          key: 'pm10',
          title: 'pm10',
          class: 'tac'
        },
        {
          key: 'pm25',
          title: 'pm25',
          class: 'tac'
        },
        {
          key: 'so2',
          title: 'so2',
          class: 'tac'
        },
        {
          key: 'no2',
          title: 'no2',
          class: 'tac'
        },
        {
          key: 'co',
          title: 'co',
          class: 'tac'
        },
        {
          key: 'o3',
          title: 'o3',
          class: 'tac'
        }
      ],
      dataList: [
        // {
        //   _id: '123',
        //   update_time: '2016-08-30T08:00:00.000Z',
        //   aqi: 'aqi',
        //   co: 'co',
        //   no2: 'no2',
        //   o3: 'o3',
        //   pm10: 'pm10',
        //   pm25: 'pm25',
        //   so2: 'so2',
        //   location: {
        //     country: 'CN',
        //     id: 'TUZHQFX485K9',
        //     name: '亚东',
        //     position: '亚东,日喀则,西藏,中国'
        //   }
        // }
      ]
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
          center: [104.114129, 37.550339],
          zoom: 5,
          roam: true,
          mapStyle: {
            styleJson: [{
              'featureType': 'water',
              'elementType': 'all',
              'stylers': {
                'color': '#AEE1F5'
              }
            }, {
              'featureType': 'land',
              'elementType': 'all',
              'stylers': {
                'color': '#f3f3f3'
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
                'color': '#fefefe'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'geometry.fill',
              'stylers': {
                'color': '#fefefe'
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
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'arterial',
              'elementType': 'labels',
              'stylers': {
                'visibility': 'off'
              }
            }, {
              'featureType': 'boundary',
              'elementType': 'all',
              'stylers': {
                'color': '#fefefe'
              }
            }, {
              'featureType': 'building',
              'elementType': 'all',
              'stylers': {
                'color': '#d1d1d1'
              }
            }, {
              'featureType': 'label',
              'elementType': 'labels.text.fill',
              'stylers': {
                'color': '#999999'
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
    },

    // 分页信息
    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },

    // 查询条件
    queryCondition () {
      var condition = {
        filter: ['_id', 'update_time', 'aqi', 'co', 'location', 'no2', 'o3', 'pm10', 'pm25', 'so2'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          'update_time': {
            $gte: {
              '@date': formatDate(this.time.startDate, 'yyyy-MM-dd', true) + ' 00:00:00.000Z'
            },
            $lte: {
              '@date': formatDate(this.time.endDate, 'yyyy-MM-dd', true) + ' 23:59:59.999Z'
            }
          }
        }
      }

      this.columns.map((item) => {
        if (item.sortType) {
          condition.order[item.key] = (item.sortType === 1 ? '1' : '-1')
        }
      })

      if (this.queryAreaStr) {
        condition.query['location.position'] = {
          $regex: this.queryAreaStr,
          $options: 'i'
        }
      }

      return condition
    },

    queryAreaStr () {
      let result = ''
      if (this.area.province.proID) {
        result = this.area.province.name
      }
      if (this.area.city.proID) {
        result = this.area.city.name
      }
      result = result.substr(0, 2)
      return result
    },
    tables () {
      var result = []
      this.dataList.forEach((item) => {
        var table = {
          _id: item._id,
          update_time: formatDate(item.update_time),
          aqi: item.aqi,
          co: item.co,
          no2: item.no2,
          o3: item.o3,
          pm10: item.pm10,
          pm25: item.pm25,
          so2: item.so2,
          location: item.location.position,
          prototype: item
        }
        result.push(table)
      })
      return result
    }
  },

  route: {
    data () {
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
      this.getList()

      this.intervalId = setInterval(() => {
        this.getCityData()
        this.getList()
      }, 60000)
    }
  },

  destroyed () {
    clearInterval(this.intervalId)
  },

  methods: {
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
      let date = new Date().getTime() - 20 * 60 * 1000
      let condition = {
        filter: ['location', 'pm25'],
        limit: 1000,
        // offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          'update_time': {
            $gte: {
              '@date': formatDate(date, 'yyyy-MM-dd hh:mm:ss.SSS', true) + 'Z'
            }
          }
        }
      }
      this.loadingCityData = true
      api.airquality.getAirQualitys(this.$route.params.app_id, condition).then((res) => {
        console.log(res.data)
        this.cityData = _.map(res.data.list, (item) => {
          return {
            name: item.location.name,
            value: item.pm25 - 0
          }
        })
        this.loadingCityData = false
      }).catch((res) => {
        this.loadingCityData = false
        // this.handleError(res)
      })
    },

    /**
     * 获取列表
     */
    getList () {
      this.loadingData = true
      api.airquality.getAirQualitys(this.$route.params.app_id, this.queryCondition).then((res) => {
        this.dataList = res.data.list
        this.total = res.data.count
        this.loadingData = false
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },

    timechange (startDate, endDate) {
      let time = {
        startDate: startDate,
        endDate: endDate
      }
      this.time = time
      this.getList()
    },
    /**
     * 每页显示的数量改变
     * 国辉
     * @param  {[type]} count 每页显示数量
     * @return {[type]}       [description]
     */
    pageCountUpdate (count) {
      this.countPerPage = count
      this.getList()
    },
    /**
     * 当前页码改变
     * 国辉
     * @param  {[type]} number [description]
     * @return {[type]}        [description]
     */
    currentPageChange (number) {
      this.currentPage = number
      this.getList()
    },
    /**
     * 按某个属性排序
     * 国辉
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    sortBySomeKey (header, index) {
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.columns.$set(index, header)
      this.getList()
    }
  }
}
</script>

<style lang="stylus">
.anchorBL
  display none !important
</style>
