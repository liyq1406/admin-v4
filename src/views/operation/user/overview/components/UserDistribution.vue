<template>
  <div class="panel">
    <div class="panel-hd panel-hd-full bordered">
      <h2>{{ $t('operation.user.overview.distribution.title') }}</h2>
    </div>
    <div class="panel-bd">
      <div class="row">
        <div class="col-13 tac">
          <chart :options="distributeOptions" :loading="loadingData" type="china-map" height="450px"></chart>
        </div>
        <div class="col-9 col-offset-2 data-table-wrap mt20 mb20">
          <percent-table :headers="headers" :tables="tables" @theader-percent="sort"></percent-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'components/Chart/index'
import PercentTable from 'components/PercentTable'
import Panel from 'components/Panel'
import { globalMixins } from 'src/mixins'
import {getUserRegion} from '../api-user'
import {numToPercent} from 'utils'

export default {
  name: 'distribution',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins],

  components: {
    Panel,
    PercentTable,
    Chart
  },

  data () {
    return {
      loadingData: false,
      data: [],
      dataPer: [],
      headers: [
        {
          key: 'region',
          title: this.$t('operation.user.overview.distribution.region')
        },
        {
          key: 'count',
          title: this.$t('operation.user.overview.distribution.user_count')
        },
        {
          key: 'percent',
          title: this.$t('operation.user.overview.distribution.percent'),
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
          text: [this.$t('common.high'), this.$t('common.low')],
          calculable: true
        },
        series: [{
          name: this.$t('operation.user.overview.distribution.device_count'),
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

  ready () {
    this.getUserDistribution()
  },
  methods: {
    sort (header) {
      this.headers.forEach((item) => {
        if (item.key === 'percent') {
          item.sortType = header.sortType * -1
        }
      })
    },
    getUserDistribution () {
      this.loadingData = true
      getUserRegion().then((res) => {
        this.combineData(res)
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    combineData (data) {
      let regions = {}
      for (var i in data) {
        if (i !== 'register') {
          regions[i] = data[i].register
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

      mapDataArr = numToPercent(mapDataArr, 'value')
      this.data = mapDataArr
      // var regionData = []
      // var features = mapData.features
      //
      // for (var i = 0; i < features.length; i++) {
      //   var name = features[i].properties.name
      //   regionData.push({
      //     'name': name,
      //     'value': 0,
      //     'percent': 0
      //   })
      // }
      //
      // this.data = _.unionBy(mapDataArr, regionData, 'name')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'
.border-top-style
  border-top 1px solid #e5e5e5
  margin-top 10px
</style>
