<template>
  <div class="panel">
    <div class="panel-hd bordered panel-hd-full">
      <h2>{{ $t('operation.product.analysis.hot.title') }}</h2>
    </div>
    <div class="panel-bd">
      <div class="row">
        <div class="col-13 tac" v-if="showWorld">
          <chart :options="worldDistributeOptions" @world-map-select="worldMapSelect" :loading="loadingData" height="450px" type="world-map"></chart>
        </div>
        <div class="col-13 tac" v-if="!showWorld">
          <chart :options="distributeOptions" :loading="loadingData" height="450px" type="china-map"></chart>
        </div>
        <div class="col-9 col-offset-2 data-table-wrap mt20 mb20">
          <percent-table :headers="headers" :rows="rows" @theader-percent="sort"></percent-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Chart from 'components/chart/index'
import {numToPercent} from 'utils'
export default {
  name: 'Distributing',

  components: {
    Chart
  },

  data () {
    return {
      showWorld: true,
      countrys: [],
      chinaProvinces: [],
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
          title: this.$t('operation.product.analysis.hot.percent')
        }
      ]
    }
  },

  computed: {
    distributeData () {
      let dataPer
      if (this.showWorld) {
        dataPer = this.worldDataPer
      } else {
        dataPer = this.chinaDataPer
      }
      return dataPer
    },
    // 区域地图配置
    worldDistributeOptions () {
      return {
        title: {
          // text: '',
          left: 'center',
          top: 'top'
        },
        tooltip: {
          trigger: 'item',
          formatter: function (obj) {
            let data = obj.data
            let valStr = '-'
            if (data && 'value' in data) {
              let percentage = Math.round(data.percent * Math.pow(10, 4)) / Math.pow(10, 2)
              valStr = `${data.value} (${percentage}%)`
            }
            return `${obj.seriesName} <br/>${data.name} : ${valStr}`
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            // dataView: {readOnly: false},
            // restore: {},
            // saveAsImage: {}
          }
        },
        visualMap: {
          min: 0,
          max: this.max,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            name: '设备数量',
            type: 'map',
            mapType: 'world',
            roam: true,
            itemStyle: {
              emphasis: {label: {show: true}}
            },
            data: this.worldDataPer
          }
        ]
      }
    },

    distributeOptions () {
      let res = {
        tooltip: {
          trigger: 'item',
          formatter (obj) {
            let data = obj.data
            let valStr = '-'
            if (data && 'value' in data) {
              let percentage = Math.round(data.percent * Math.pow(10, 4)) / Math.pow(10, 2)
              valStr = `${data.value} (${percentage}%)`
            }
            return `${obj.seriesName} <br/>${data.name} : ${valStr}`
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          right: '30',
          top: '30',
          feature: {
            myTool1: {
              show: true,
              title: '返回上一级',
              icon: 'image:///static/images/left-arrow.png',
              onclick: function () {}
            }
          }
        },
        visualMap: {
          min: 0,
          max: this.max,
          left: 10,
          bottom: 20,
          text: ['高', '低'],
          calculable: true
        },
        series: [{
          name: '设备数量',
          type: 'map',
          mapType: 'china',
          roam: false,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#FFF',
              borderColor: '#666'
            }
          },
          data: this.chinaDataPer
        }]
      }
      res.toolbox.feature.myTool1.onclick = () => {
        this.showWorld = true
      }
      return res
    },

    // 最大值
    max () {
      let ret = 0
      let data
      if (this.showWorld) {
        data = this.worldDataPer
      } else {
        data = this.chinaDataPer
      }
      if (data.length) {
        ret = _.max(_.map(data, 'value'))
      }
      return ret
    },
    rows () {
      var result = []
      let cated = this.distributeData.slice(0, 10)
      cated.forEach((item) => {
        if (!item.value) return
        var distribute = {
          region: item.name,
          count: item.value,
          percent: Math.round(item.percent * 100),
          prototype: item
        }
        result.push(distribute)
      })
      if (result.length) {
        result.sort((a, b) => {
          return b.count - a.count
        })
      }
      return result
    },
    worldDataPer () {
      let worldRes = []
      for (let i in this.regionDataRaw) {
        let findCountry = _.find(this.countrys, (item) => {
          return item.code === i
        })
        if (!findCountry) {
          continue
        }
        worldRes.push({
          name: findCountry.name,
          value: this.regionDataRaw[i].sale_total
        })
      }
      worldRes = numToPercent(worldRes, 'value')
      return worldRes
    },
    chinaDataPer () {
      let chinaRes = []
      if (!this.regionDataRaw[1]) {
        return
      }
      for (let i in this.regionDataRaw[1]) {
        let findProvinces = _.find(this.chinaProvinces, (item) => {
          return item.code === i
        })
        if (!findProvinces) {
          continue
        }
        chinaRes.push({
          name: findProvinces.name,
          value: this.regionDataRaw[1][i].sale_total
        })
      }
      chinaRes = numToPercent(chinaRes, 'value')
      return chinaRes
    }
  },

  route: {
    data () {
    }
  },

  ready () {
    this.getRegion()
    this.getChinaCityCode()
    this.getWorldCountry()
  },

  methods: {
    getChinaCityCode () {
      this.$http.get('/static/data/areas/zh-cn/1.json').then((res) => {
        this.chinaProvinces = res.data.states
      })
    },
    getWorldCountry () {
      this.$http.get('/static/data/areas/en-us/countryList.json').then((res) => {
        this.countrys = res.data
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
          this.regionDataRaw = res.data
        }
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    worldMapSelect (name) {
      if (name === 'China') {
        this.showWorld = false
      }
    }
  }
}
</script>
