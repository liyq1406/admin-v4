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

    <div class="panel">
      <div class="panel-hd">
        <h3 style="font-weight: normal">级别分布</h3>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')">
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <h3>明细</h3>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>地区</th>
                <th>轻度</th>
                <th>中度</th>
                <th>重度</th>
                <th>激活设备</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="statistics.length > 0">
                <tr v-for="alert in statistics">
                  <td>{{ alert.product_name }}</td>
                  <td>
                    <template v-if="alert.tags"><span v-for="tag in alert.tags | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ tag }}</span></template>{{ alert.content }}
                  </td>
                  <td>{{ alert.create_date | formatDate }}</td>
                  <td><span v-if="alert.is_read" class="hl-gray">{{ $t("common.read") }}</span><span v-else>{{ $t("common.unread") }}</span></td>
                  <td class="tac">
                    <button @click="showAlert(alert)" class="btn btn-link btn-mini">{{ $t("common.details") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="statistics.length === 0 && !loadingData">
                <td colspan="5" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getAlerts"></pager>
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
      ],
      warningLevel: [
        {
          name: '重度',
          value: 50
        },
        {
          name: '中度',
          value: 30
        },
        {
          name: '轻度',
          value: 20
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
