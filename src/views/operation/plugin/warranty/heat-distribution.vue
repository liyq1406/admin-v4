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
      <div class="filter-group fl">
        <div class="filter-group-item">
          <v-select label="空气净化器" width='110px' size="small">
            <span slot="label">产品</span>
          </v-select>
        </div>
        <div class="filter-group-item">
          <v-select label="维修" size="small">
          </v-select>
        </div>
      </div>
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
          <div class="col-11">
            <china-heat-map></china-heat-map>
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
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
// import api from 'api'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import RadioButtonGroup from 'components/RadioButtonGroup'
import ChinaHeatMap from 'components/g2-charts/ChinaHeatMap'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import dateFormat from 'date-format'
import LineChart from 'components/charts/Line'
import { globalMixins } from 'src/mixins'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    Pager,
    RadioButtonGroup,
    LineChart,
    'v-select': Select,
    SearchBox,
    ChinaHeatMap
  },

  data () {
    return {
      key: '',
      statistics: [],
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      alertTrends: [],
      today: dateFormat('yyyy-MM-dd', new Date()),
      loadingData: false,
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

  route: {
    data () {
    }
  },

  methods: {
  }
}
</script>
