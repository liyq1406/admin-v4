<template>
  <div class="panel">
    <div class="panel-hd panel-hd-full bordered">
      <h2>产品分布</h2>
    </div>
    <div class="panel-bd">
      <div class="row">
        <div class="col-13 tac">
          <china-map :data="data"></china-map>
        </div>
        <div class="col-9 col-offset-2 data-table-wrap mt20 mb20">
          <percent-table :headers="headers" :tables="tables" @theader-percent="sort"></percent-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mapData from 'components/g2-charts/map-data.json'
import ChinaMap from 'components/g2-charts/ChinaMap'
import PercentTable from 'components/PercentTable'
import Panel from 'components/Panel'
import { globalMixins } from 'src/mixins'
import {getProductRegion} from './api-product'
import {numToPercent} from 'utils'
import _ from 'lodash'

export default {
  name: 'distribution',

  mixins: [globalMixins],

  components: {
    Panel,
    ChinaMap,
    PercentTable
  },

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  data () {
    return {
      data: [],
      dataPer: [],
      headers: [
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
    tables () {
      var result = []
      this.dataPer.map((item) => {
        var distribute = {
          region: item.name,
          count: item.value,
          percent: item.percent * 100,
          prototype: item
        }
        result.push(distribute)
      })
      return result
    }
  },

  watch: {
    currentProduct () {
      if (this.currentProduct.id) {
        this.getProductsDistribution(this.currentProduct)
      }
    }
  },

  ready () {
    if (this.currentProduct.id) {
      this.getProductsDistribution(this.currentProduct)
    }
  },

  methods: {
    sort (header) {
      this.headers.forEach((item) => {
        if (item.key === 'percent') {
          item.sortType = header.sortType * -1
        }
      })
    },
    getProductsDistribution (products) {
      getProductRegion(products.id).then((res) => {
        this.combineData(res)
      }).catch((res) => {
        this.handleError(res)
      })
    },
    combineData (data) {
      let regions = {}
      for (var i in data) {
        if (i !== 'activated' && i !== 'online') {
          if (!_.isNumber(regions[i])) {
            regions[i] = 0
          }
          regions[i] += data[i].activated
        }
      }
      this.fillMapData(regions)
    },
    fillMapData (regions) {
      var mapDataArr = []
      for (let i in regions) {
        mapDataArr.push({
          name: i,
          value: regions[i]
        })
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

      var regionData = []
      var features = mapData.features

      for (var i = 0; i < features.length; i++) {
        var name = features[i].properties.name
        regionData.push({
          'name': name,
          'value': 0
        })
      }
      this.data = _.unionBy(mapDataArr, regionData, 'name')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
.border-top-style
  border-top 1px solid #e5e5e5
  margin-top 10px
</style>
