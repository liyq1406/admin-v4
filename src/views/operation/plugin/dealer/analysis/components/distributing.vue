<template>
  <div class="panel">
    <div class="panel-hd bordered panel-hd-full">
      <h2>{{ $t('operation.product.analysis.hot.title') }}</h2>
    </div>
    <div class="panel-bd">
      <div class="row">
        <div class="col-11">
          <chart :options="regionOptions" :loading="loadingData" type="china-map" height="450px"></chart>
        </div>
        <div class="col-12 col-offset-1 data-table-wrap mt20 mb20">
          <percent-table :headers="headers" :tables="tables" @theader-percent="sort"></percent-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Chart from 'components/Chart/index'
import convertData from 'components/chart/convert-data'
import {numToPercent} from 'utils'
export default {
  name: 'Distributing',

  components: {
    Chart
  },

  data () {
    return {
      states: [],
      regionDataRaw: {},
      loadingData: false,
      headers: [
        {
          key: 'region',
          title: this.$t('operation.product.analysis.hot.region')
        },
        {
          key: 'count',
          title: this.$t('operation.product.analysis.hot.device_count')
        },
        {
          key: 'percent',
          title: this.$t('operation.product.analysis.hot.percent'),
          sortType: -1
        }
      ]
    }
  },

  computed: {
    // 区域地图配置
    regionOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter (params) {
            return params.name + ' : ' + params.value[2]
          }
        },
        visualMap: {
          min: 0,
          max: this.max,
          calculable: true,
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d']
          },
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'china',
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#FFF',
              borderColor: '#666'
            },
            emphasis: {
              areaColor: '#EEE'
            }
          }
        },
        series: [{
          name: this.$t('operation.product.analysis.hot.device_count'),
          type: 'scatter',
          coordinateSystem: 'geo',
          data: convertData(this.regionData),
          symbolSize: 12,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            emphasis: {
              borderColor: '#fff',
              borderWidth: 1
            }
          }
        }]
      }
    },

    // 最大值
    max () {
      let ret = 0
      if (this.regionData.length) {
        ret = _.max(_.map(this.regionData, 'value'))
      }
      return ret
    },

    // 分页信息
    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },
    tables () {
      var result = []
      this.dataPer.forEach((item) => {
        if (!item.value) return
        var distribute = {
          region: item.name,
          count: item.value,
          percent: Math.round(item.percent * 100),
          prototype: item
        }
        result.push(distribute)
      })
      return result
    },
    regionData () {
      let res = []
      for (let i in this.regionDataRaw) {
        let findState = _.find(this.states, (item) => {
          return item.code === i
        })
        if (!findState) {
          continue
        }
        if (i === '11' /* 北京 */ || i === '31' /* 上海 */ || i === '50' /* 重庆 */ || i === '12' /* 天津 */ || i === '81' /* 香港 */ || i === '82' /* 澳门 */) {
          res.push({
            name: findState.name,
            value: this.regionDataRaw[i].sale_total
          })
        } else {
          for (let j in this.regionDataRaw[i]) {
            let findCity = _.find(findState.citys || [], (item) => {
              return item.code === j
            })
            if (findCity) {
              res.push({
                name: findCity.name,
                value: this.regionDataRaw[i][j].sale_total
              })
            }
          }
        }
      }
      return res
    },
    dataPer () {
      let res = []
      for (let i in this.regionDataRaw) {
        let findState = _.find(this.states, (item) => {
          return item.code === i
        })
        if (!findState) {
          continue
        }
        res.push({
          name: findState.name,
          value: this.regionDataRaw[i].sale_total
        })
      }
      res.sort((a, b) => {
        if (a.value > b.value) {
          return -1
        } else if (a.value < b.value) {
          return 1
        } else {
          return 0
        }
      })

      if (res.length > 10) {
        res = numToPercent(res.slice(0, 10), 'value')
      } else {
        res = numToPercent(res, 'value')
      }
      return res
    }
  },

  route: {
    data () {
    }
  },

  ready () {
    this.getRegion()
    this.getChinaCityCode()
  },

  methods: {
    getChinaCityCode () {
      this.$http.get('/static/data/areas/zh-cn/1.json').then((res) => {
        this.states = res.data.states
      })
    },
    sort (header) {
      this.headers.forEach((item) => {
        if (item.key === 'percent') {
          item.sortType = header.sortType * -1
        }
      })
    },
    getRegion (pruductId) {
      this.loadingData = true
      api.statistics.getDealeSaleRegion().then((res) => {
        if (res.status === 200) {
          // 只取中国区数据
          this.regionDataRaw = res.data.distribution[1] // 1表示中国区代码
        }
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    }
  }
}
</script>
