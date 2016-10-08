<template>
  <div class="panel">
    <div class="panel-hd bordered panel-hd-full">
      <h2>热力分布</h2>
    </div>
    <div class="panel-bd">
      <div class="row">
        <div class="col-11">
          <china-heat-map :data="regionData"></china-heat-map>
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
import ChinaHeatMap from 'components/g2-charts/ChinaHeatMap'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from './mixins'
import {numToPercent} from 'utils'
import PercentTable from 'components/PercentTable'

export default {
  name: 'Distributing',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, setCurrProductMixin],

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  components: {
    ChinaHeatMap,
    PercentTable
  },

  data () {
    return {
      dataPer: [],
      regionData: [],
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
                    province: i,
                    city: j,
                    value: CNData[i][j].activated || 0
                  }
                  resData.push(temp)
                }
              }
            }
          }
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
