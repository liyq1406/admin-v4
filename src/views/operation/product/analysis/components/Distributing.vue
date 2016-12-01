<template>
  <div class="panel">
    <div class="panel-hd panel-hd-full bordered">
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
          <percent-table :headers="columns" :rows="distributeData" @theader-percent="sort"></percent-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'components/chart/index'
import {numToPercent} from 'utils'
import { toPercentage } from 'filters/format-date'
import PROVINCE_MAP from 'consts/mapping/provinces'
import api from 'api'

export default {
  name: 'ProductDistribution',
  components: {
    // ChinaMap,
    Chart
  },

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  data () {
    return {
      showWorld: true,
      loadingData: false,
      data: [],
      worldData: [],
      chinaDataPer: [],
      worldDataPer: [],
      // provinces: [],
      columns: [
        {
          key: 'region',
          title: this.$t('operation.product.overview.distribution.region')
        },
        {
          key: 'count',
          title: this.$t('operation.product.overview.distribution.device_count')
        },
        {
          key: 'percent',
          title: this.$t('operation.product.overview.distribution.percent')
        }
      ]
    }
  },

  computed: {
    distributeData () {
      var result = []
      let dataPer
      if (this.showWorld) {
        dataPer = this.worldDataPer
      } else {
        dataPer = this.chinaDataPer
      }
      dataPer.map((item) => {
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
            data: this.worldData
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
          data: this.data
        }]
      }
      res.toolbox.feature.myTool1.onclick = () => {
        this.showWorld = true
      }
      return res
    },

    max () {
      let ret = 0
      if (this.data.length) {
        ret = _.max(_.map(this.data, 'value'))
      }
      return ret
    }
  },

  watch: {
    currentProduct () {
      if (this.currentProduct.id) {
        this.getProductsDistribution()
      }
    }
  },

  ready () {
    this.getProductsDistribution()
    // this.getProvinces()
  },

  methods: {
    toPercentage,

    /**
     * 排序
     */
    sort (header) {
      this.columns.forEach((item) => {
        if (item.key === 'percent') {
          item.sortType = header.sortType * -1
        }
      })
    },

    // getProvinces () {
    //   this.$http.get('/static/data/map/china.json').then((res) => {
    //     this.provinces = _.map(res.data.features, (item) => {
    //       return item.properties.name
    //     })
    //   })
    // },
    worldMapSelect (name) {
      if (name === 'China') {
        this.showWorld = false
      }
    },

    getProductsDistribution () {
      var prodRegions = []
      this.loadingData = true
      api.statistics.getProductRegion(this.$route.params.id).then((res) => {
        // 英文索引数据
        // 去掉'activated'和'online'，使之只包含省份数据
        let enData = _.omit(res.data['China'], ['activated', 'online'])

        // 中文索引数据
        // 去掉'activated'和'online'，使之只包含省份数据
        let cnData = _.omit(res.data['中国'], ['activated', 'online'])

        let cn2Data = _.omit(res.data['china'], ['activated', 'online'])

        prodRegions.push(enData)
        prodRegions.push(cnData)
        prodRegions.push(cn2Data)
        this.combineData(prodRegions)
        this.loadingData = false
        this.genWorldData(res.data)
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    genWorldData (data) {
      let res = []
      for (let i in data) {
        if (i !== 'china' && i !== 'unknown' && i !== '中国' && i !== 'China') {
          res.push({
            name: i,
            value: data[i].activated
          })
        }
      }
      var chinaDatas = {
        name: 'China',
        value: 0
      }
      data['China'] && data['China'].activated && (chinaDatas.value += data['China'].activated - 0)
      data['china'] && data['china'].activated && (chinaDatas.value += data['china'].activated - 0)
      data['中国'] && data['中国'].activated && (chinaDatas.value += data['中国'].activated - 0)
      res.push(chinaDatas)
      res = numToPercent(res, 'value')
      let worldDataPer = _.clone(res)
      worldDataPer.sort((a, b) => {
        return b.value - a.value
      })
      this.worldDataPer = worldDataPer.slice(0, 10)
      this.worldData = res
    },
    combineData (data) {
      let regions = {}
      data.forEach((item) => {
        for (var i in item) {
          let key = i
          if (PROVINCE_MAP.hasOwnProperty(i)) {
            key = PROVINCE_MAP[i]
          }

          if (typeof regions[key] !== 'undefined') {
            regions[key] += item[i].activated
          } else {
            regions[key] = item[i].activated
          }
        }
      })
      this.fillMapData(regions)
    },
    fillMapData (regions) {
      var mapDataArr = []
      for (let i in regions) {
        if (regions[i] !== 0) {
          mapDataArr.push({
            name: i,
            value: regions[i]
          })
        }
      }

      // 由大到小排序
      mapDataArr.sort((a, b) => {
        return b.value - a.value
      })

      if (mapDataArr.length > 10) {
        this.chinaDataPer = numToPercent(mapDataArr.slice(0, 10), 'value')
      } else {
        this.chinaDataPer = numToPercent(mapDataArr, 'value')
      }

      mapDataArr = numToPercent(mapDataArr, 'value')
      this.data = mapDataArr
    }
  }
}
</script>
