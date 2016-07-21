<template>
  <div class="main">
    <div class="main-title">
      <h2>热力分布</h2>
    </div>
    <!-- TODO -->
    <div class="mb10 ml15">
      <a style="color: red">全部</a>
      <i class="arrow">&gt;</i>
      <a style="color: red">国家: 中国 <i class="fa fa-sort-down" style="color: black"></i></a>
      <i class="arrow">&gt;</i>
      <a style="color: red">省份: 广东 <i class="fa fa-sort-down" style="color: black"></i></a>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <div class="filter-group-item">
          <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-10">
            <china-heat-map></china-heat-map>
          </div>
          <div class="col-13 col-offset-1 data-table-wrap" style="min-height: 500px">
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
                  <tr>
                    <td>广西</td>
                    <td>1769</td>
                    <td>86%</td>
                  </tr>
                  <tr>
                    <td>广东</td>
                    <td>289</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>广西</td>
                    <td>1769</td>
                    <td>86%</td>
                  </tr>
                  <tr>
                    <td>湖南</td>
                    <td>1769</td>
                    <td>86%</td>
                  </tr>
                  <tr>
                    <td>湖北</td>
                    <td>1769</td>
                    <td>86%</td>
                  </tr>
                  <tr>
                    <td>江西</td>
                    <td>1769</td>
                    <td>86%</td>
                  </tr>
                  <tr>
                    <td>江苏</td>
                    <td>1769</td>
                    <td>86%</td>
                  </tr>
                  <tr>
                    <td>广东</td>
                    <td>289</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>广西</td>
                    <td>1769</td>
                    <td>86%</td>
                  </tr>
                  <tr>
                    <td>湖南</td>
                    <td>1769</td>
                    <td>86%</td>
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
// import api from 'api'
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
      periods: [
        {
          value: 1,
          label: '24h'
        },
        {
          value: 7,
          label: '7天'
        },
        {
          value: 30,
          label: '30天'
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
  },

  methods: {
  }
}
</script>
