<template>
  <div class="main">
    <div class="main-title">
      <h2>热力分布</h2>
    </div>
    <!-- TODO -->
    <!-- <div class="mb10 ml15">
      <a style="color: red">全部</a>
      <i class="arrow">&gt;</i>
      <a style="color: red">国家: 中国 <i class="fa fa-sort-down" style="color: black"></i></a>
      <i class="arrow">&gt;</i>
      <a style="color: red">省份: 广东 <i class="fa fa-sort-down" style="color: black"></i></a>
    </div> -->
    <!-- <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <div class="filter-group-item">
          <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="period"><span slot="label" class="label"></span></radio-button-group>
        </div>
      </div>
    </div> -->
    <div class="panel">
      <div class="panel-hd bordered">
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-11">
            <china-heat-map :data="regionData"></china-heat-map>
          </div>
          <div class="col-12 col-offset-1 data-table-wrap mt20 mb20">
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
                      <td>{{data.percent | toPercentDecimal2}}</td>
                    </template>
                  </tr>  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="panel-bd">
        <div class="data-table">
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa- fa-share-square-o"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" @cancel="" placeholder="请输入搜索内容" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                  <label>{{ $t('ui.user.search_user') }}</label>
                </search-box>
              </div>
            </div>
            <h3>明细</h3>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page"></c-table>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import api from 'api'
import ChinaHeatMap from 'components/g2-charts/ChinaHeatMap'
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from './mixins'
import {numToPercent} from 'helpers/utils'

export default {
  name: 'Distributing',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, setCurrProductMixin],

  components: {
    ChinaHeatMap
  },

  data () {
    return {
      dataPer: [],
      regionData: []
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
      this.distributes.map((item) => {
        var distribute = {
          region: item.region,
          mild: item.mild,
          moderate: item.moderate,
          severe: item.severe,
          activated: item.activated,
          prototype: item
        }
        result.push(distribute)
      })
      return result
    }
  },

  route: {
    data () {
      this.getRegion(this.$route.params.id)
    }
  },

  ready () {
  },

  methods: {
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
                    value: CNData[i][j].activated
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
