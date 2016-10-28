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
          <!-- <div class="data-table">
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
                    <td>{{data.percent | toPercentage}}</td>
                  </template>
                </tr>
                <tr v-if="dataPer.length === 0">
                  <td colspan="6" class="tac">
                    <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> -->
          <percent-table :headers="headers" :tables="tables" @theader-percent="sort"></percent-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Chart from 'components/Chart/index'
import convertData from 'components/Chart/convert-data'
import { globalMixins } from 'src/mixins'
import {numToPercent} from 'utils'
import PercentTable from 'components/PercentTable'
import _ from 'lodash'

export default {
  name: 'Distributing',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins],

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  components: {
    PercentTable,
    Chart
  },

  data () {
    return {
      dataPer: [],
      regionData: [],
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
    }
  },

  watch: {
    currentProduct () {
      if (this.currentProduct.id) {
        this.getRegion(this.currentProduct.id)
      }
    }
  },

  route: {
    data () {
    }
  },

  ready () {
    if (this.currentProduct.id) {
      this.getRegion(this.currentProduct.id)
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
    getRegion (pruductId) {
      this.loadingData = true
      api.statistics.getProductRegion(pruductId).then((res) => {
        if (res.status === 200) {
          var CNData = res.data['中国']
          var resData = []
          var regions = []
          for (let i in CNData) {
            if (i !== 'activated' && i !== 'online') {
              regions.push({
                name: i,
                value: CNData[i].activated
              })
              for (let j in CNData[i]) {
                if (j !== 'activated' && j !== 'online') {
                  let temp = {
                    name: j,
                    value: CNData[i][j].activated || 0
                  }
                  resData.push(temp)
                }
              }
            }
          }
          this.sortRegion(regions)
          this.regionData = resData
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    sortRegion (regions) {
      // 由大到小排序
      regions.sort((a, b) => {
        if (a.value > b.value) {
          return -1
        } else if (a.value < b.value) {
          return 1
        } else {
          return 0
        }
      })

      if (regions.length > 10) {
        this.dataPer = numToPercent(regions.slice(0, 10), 'value')
      } else {
        this.dataPer = numToPercent(regions, 'value')
      }
    }
  }
}
</script>
