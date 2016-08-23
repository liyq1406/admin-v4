<template>
  <div>
    <panel title="用户分布">
      <div class="row border-top-style">
        <div class="col-13 tac">
          <china-map :data="data"></china-map>
        </div>
        <div class="col-9 col-offset-2 data-table-wrap mt20 mb20">
          <div class="data-table" v-if="dataPer.length > 0">
            <table class="table">
              <thead>
                <tr>
                  <th>地域</th>
                  <th>用户数量</th>
                  <th>占比</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in dataPer">
                  <template v-if="data.value">
                    <td>{{data.name}}</td>
                    <td>{{data.value}}</td>
                    <td>{{data.percent | toPercentDecimal2}}</td>
                  </template>
                </tr>
                <tr v-if="dataPer.length === 0">
                  <td colspan="6" class="tac">
                    <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </panel>
  </div>
</template>

<script>
import mapData from 'components/g2-charts/map-data.json'
import ChinaMap from 'components/g2-charts/ChinaMap'
import Panel from 'components/Panel'
import { globalMixins } from 'src/mixins'
import {getUserRegion} from './api-user'
import {numToPercent} from 'helpers/utils'
import _ from 'lodash'

export default {
  name: 'distribution',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Panel,
    ChinaMap
  },

  data () {
    return {
      data: [],
      dataPer: []
    }
  },

  ready () {
    this.getUserDistribution()
  },
  methods: {
    getUserDistribution () {
      getUserRegion().then((res) => {
        this.combineData(res)
      }).catch((res) => {
        this.handleError(res)
      })
    },
    combineData (data) {
      let regions = {}
      for (var i in data) {
        if (i !== 'register') {
          regions[i] = data[i].register
        }
      }
      regions = {'上海': 1580, '广东': 5898, '浙江': 3561}
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
