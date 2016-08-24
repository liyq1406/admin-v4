<template>
  <div class="panel no-split-line">
    <div class="panel-hd panel-hd-full bordered">
      <h2>产品分布</h2>
    </div>
    <div class="panel-bd">
      <div class="row">
        <div class="col-13 tac">
          <china-map :data="data"></china-map>
        </div>
        <div class="col-9 col-offset-2 data-table-wrap mt20 mb20">
          <!-- TODO 占比改成柱状图形式 #guohui -->
          <div class="data-table" v-if="dataPer.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>地域</th>
                  <th>设备数量</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in dataPer">
                  <template v-if="data.value">
                    <td>{{data.name}}</td>
                    <td>{{data.value}}</td>
                    <td>
                      <percentage-bar :percentage="toPercentDecimal2(data.percent)"></percentage-bar>
                      <!-- {{data.percent | toPercentDecimal2}} -->
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mapData from 'components/g2-charts/map-data.json'
import ChinaMap from 'components/g2-charts/ChinaMap'
import PercentageBar from 'components/PercentageBar'
import { globalMixins } from 'src/mixins'
import {getProductRegion} from './api-product'
import {numToPercent} from 'utils'
import { toPercentDecimal2 } from 'src/filters'
import _ from 'lodash'

export default {
  name: 'distribution',

  mixins: [globalMixins],

  components: {
    PercentageBar,
    ChinaMap
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      data: [],
      dataPer: []
    }
  },

  watch: {
    products () {
      if (this.products.length > 0) {
        this.getProductsDistribution(this.products)
      }
    }
  },

  ready () {
  },
  methods: {
    toPercentDecimal2,

    getProductsDistribution (products) {
      var prodRegions = []
      products.forEach((item) => {
        getProductRegion(item.id).then((res) => {
          prodRegions.push(res)
          if (prodRegions.length === products.length) {
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
