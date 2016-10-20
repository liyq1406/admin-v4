<template>
  <div class="panel">
    <div class="panel-hd panel-hd-full bordered">
      <h2>产品分布</h2>
    </div>
    <div class="panel-bd">
      <div class="row">
        <div class="col-13 tac">
          <chart :options="distributeOptions" :loading="loadingData" height="450px" type="china-map"></chart>
        </div>
        <div class="col-9 col-offset-2 data-table-wrap mt20 mb20">
          <percent-table :headers="columns" :tables="distributeData" @theader-percent="sort"></percent-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'components/Chart/index'
import { globalMixins } from 'src/mixins'
import {numToPercent} from 'utils'
import { toPercentage } from 'filters/format-date'
import PercentTable from 'components/PercentTable'
import api from 'api'
import _ from 'lodash'

export default {
  name: 'ProductDistribution',

  mixins: [globalMixins],

  components: {
    // ChinaMap,
    PercentTable,
    Chart
  },

  vuex: {
    getters: {
      releasedProducts: ({ products }) => products.released
    }
  },

  data () {
    return {
      loaded: 0,
      loadingData: false,
      data: [],
      dataPer: [],
      // provinces: [],
      columns: [
        {
          key: 'region',
          title: '地域'
        },
        {
          key: 'count',
          title: '设备数量'
        },
        {
          key: 'percent',
          title: '占比',
          sortType: -1
        }
      ]
    }
  },

  computed: {
    distributeData () {
      var result = []
      this.dataPer.map((item) => {
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

    distributeOptions () {
      return {
        tooltip: {
          trigger: 'item',
          formatter (obj) {
            let data = obj.data
            let valStr = '-'
            if ('value' in data) {
              let percentage = Math.round(data.percent * Math.pow(10, 4)) / Math.pow(10, 2)
              valStr = `${data.value} (${percentage}%)`
            }
            return `${obj.seriesName} <br/>${data.name} : ${valStr}`
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
    releasedProducts () {
      this.init()
    }
  },

  ready () {
    this.init()
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

    init () {
      if (this.releasedProducts.length) {
        this.getProductsDistribution()
      }
    },

    // getProvinces () {
    //   this.$http.get('/static/china.json').then((res) => {
    //     this.provinces = _.map(res.data.features, (item) => {
    //       return item.properties.name
    //     })
    //   })
    // },

    getProductsDistribution () {
      var prodRegions = []
      this.loaded = 0
      this.releasedProducts.forEach((product) => {
        api.statistics.getProductRegion(product.id).then((res) => {
          this.loaded++
          prodRegions.push(res.data['China'])
          prodRegions.push(res.data['中国'])
          if (this.loaded === this.releasedProducts.length) {
            this.combineData(prodRegions)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      })
    },
    combineData (data) {
      let regions = {}
      data.forEach((item) => {
        for (var i in item) {
          if (i !== 'activated' && i !== 'online') {
            if (!_.isNumber(regions[i])) {
              regions[i] = 0
            }
            regions[i] += item[i].activated
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
        if (a.value > b.value) {
          return -1
        } else if (a.value < b.value) {
          return 1
        } else {
          return 0
        }
      })

      if (mapDataArr.length > 10) {
        this.dataPer = numToPercent(mapDataArr.slice(0, 10), 'value')
      } else {
        this.dataPer = numToPercent(mapDataArr, 'value')
      }

      mapDataArr = numToPercent(mapDataArr, 'value')
      this.data = mapDataArr
    }
  }
}
</script>
