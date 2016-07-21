<template>
  <div class="main">
    <div class="main-title">
      <h2>告警分析</h2>
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
    <div class="panel no-split-line">
      <div class="panel-bd">
        <div class="with-loading">
          <time-line :data="alertTrends" :type="'smooth'"></time-line>
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-hd panel-hd-full">
        <h2>级别分布</h2>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-10">
            <pie :data="warningLevel" @itemselected='pieSelected'></pie>
          </div>
          <div class="col-13 col-offset-1 data-table-wrap">
            <div class="data-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>{{curLevel}}告警</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>滤芯异常</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>PM2.5超过指标</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>CO2超过指标</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>CO1超过指标</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>温度超过指标</td>
                    <td>14%</td>
                  </tr>
                  <tr>
                    <td>湿度超高</td>
                    <td>14%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>告警信息</th>
                <th>上报数据</th>
                <th>上报时间</th>
                <th>设备信息</th>
                <th>所在地</th>
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
import Pie from 'components/g2-charts/Pie'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import dateFormat from 'date-format'
import TimeLine from 'components/g2-charts/TimeLine'
import { globalMixins } from 'src/mixins'
import Mock from 'mockjs'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    Pager,
    RadioButtonGroup,
    'v-select': Select,
    SearchBox,
    Pie,
    TimeLine
  },

  data () {
    return {
      key: '',
      curLevel: '',
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

  computed: {
    queryCondition () {
      return {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage
      }
    },

    past () {
      var past = new Date().getTime() - this.period * 24 * 3600 * 1000
      return dateFormat('yyyy-MM-dd', new Date(past))
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  ready () {
    // TODO
    this.alertTrends = Mock.mock({
      'list|14': [{
        'date|+1': [
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21)
        ],
        'count|+1': [6, 8, 9, 3, 9, 3, 9]
      }]
    }).list
  },

  route: {
    data () {
    }
  },

  methods: {
    pieSelected (data) {
      this.curLevel = data.name
    }
  }
}
</script>
