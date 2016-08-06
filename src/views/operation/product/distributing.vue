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
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <!-- <div class="filter-group-item">
          <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
        </div> -->
        <div class="filter-group-item">
          <radio-button-group :items="locales.data.PERIODS" :value.sync="period"><span slot="label" class="label"></span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-11">
            <china-heat-map :data="regionData"></china-heat-map>
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
                  <tr>
                    <td>广东</td>
                    <td>289</td>
                    <td>14%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-bd">
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
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import SearchBox from 'components/SearchBox'
import ChinaHeatMap from 'components/g2-charts/ChinaHeatMap'
import Table from 'components/Table'
import { globalMixins } from 'src/mixins'
import RadioButtonGroup from 'components/RadioButtonGroup'

export default {
  name: 'Distributing',

  mixins: [globalMixins],

  components: {
    'search-box': SearchBox,
    'c-table': Table,
    ChinaHeatMap,
    RadioButtonGroup
  },

  data () {
    return {
      query: '',
      total: 1321,
      currentPage: 1,
      countPerPage: 5,
      distributes: [
        {
          region: '广东',
          mild: '2918 (3.74%)',
          moderate: '2918 (3.74%)',
          severe: '2918 (3.74%)',
          activated: 6513
        },
        {
          region: '广东',
          mild: '2918 (3.74%)',
          moderate: '2918 (3.74%)',
          severe: '2918 (3.74%)',
          activated: 6513
        }
      ],
      headers: [
        {
          key: 'region',
          title: '地区'
        },
        {
          key: 'mild',
          title: '轻度',
          class: 'tac'
        },
        {
          key: 'moderate',
          title: '中度',
          class: 'tac'
        },
        {
          key: 'severe',
          title: '重度',
          class: 'tac'
        },
        {
          key: 'activated',
          title: '激活设备',
          class: 'tac'
        }
      ],
      period: 7,
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

  ready () {
    this.getRegion(this.$route.params.id)
  },

  methods: {
    getRegion (pruductId) {
      api.statistics.getProductRegion(pruductId).then((res) => {
        if (res.status === 200) {
          var CNData = res.data['中国']
          var resData = []
          for (let i in CNData) {
            if (i !== 'activated' && i !== 'online') {
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
          this.regionData = resData
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>
