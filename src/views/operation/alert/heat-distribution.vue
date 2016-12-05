<template>
  <div class="main">
    <div class="main-title">
      <h2>热力分布</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select :label="currentProduct.name" width="110px" size="small">
            <span slot="label">产品</span>
            <select v-model="currentProduct" @change="getRegion">
              <!-- <option :value="currentProduct">{{ currentProduct.name }}</option> -->
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </x-select>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-11">
            <chart :options="regionOptions" :loading="loadingData" height="450px" type="china-map"></chart>
          </div>
          <div class="col-12 col-offset-1 data-table-wrap mt20 mb20">
            <div class="data-table">
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
                      <td>{{data.percent | toPercentage }}</td>
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
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import * as config from 'consts/config'
import Chart from 'components/chart/index'
import convertData from 'components/chart/convert-data'
import formatDate from 'filters/format-date'
import {numToPercent} from 'utils'

export default {
  name: 'Alerts',
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
      currentProduct: {},
      statistics: [],
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      alertTrends: [],
      today: formatDate(new Date(), 'yyyy-MM-dd', true),
      loadingData: false,
      dataPer: [],
      regionData: []
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
          name: '设备数量',
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
    }
  },

  route: {
    data () {
      this.getFirstProduct()
    }
  },

  // 监听属性变动
  watch: {
    products () {
      this.getFirstProduct()
      // if (this.products.length > 0) {
      //   this.getRegion()
      // }
    }
    // period () {
    //   this.getAlertTrends()
    //   this.getAlertSummary()
    // }
  },

  methods: {
    // 获取第一个产品@author weijie
    getFirstProduct () {
      this.currentProduct = this.products[0] || {}
      if (this.products.length > 0) {
        this.getRegion()
      }
    },
    // 获取区域分布
    getRegion () {
      api.alert.getAreaTrend(this.currentProduct.id).then((res) => {
        if (res.status === 200) {
          var CNData = res.data['中国']
          var resData = []
          var regions = []
          for (let i in CNData) {
            if (i !== '通知' && i !== '严重' && i !== '轻微') {
              regions.push({
                name: i,
                value: CNData[i].通知 || 0 + CNData[i].轻微 || 0 + CNData[i].严重 || 0
              })
              for (let j in CNData[i]) {
                if (j !== '通知' && j !== '严重' && j !== '轻微') {
                  let temp = {
                    name: j,
                    value: CNData[i][j].通知 || 0 + CNData[i][j].轻微 || 0 + CNData[i][j].严重 || 0
                  }
                  resData.push(temp)
                }
              }
            }
          }
          // regions = resData
          this.sortRegion(regions)
          this.regionData = resData
        }
      }).catch((res) => {
        this.handleError(res)
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
