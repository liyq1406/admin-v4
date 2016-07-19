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
          <div class="alert-overview-share-btn fr">
            <a class="fa fa- fa-share-square-o"></a>
          </div>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="with-loading">
          <line-chart :series="alertSeries" :x-axis-data="alertXAxisData" v-ref:alert-chart></line-chart>
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
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
import _ from 'lodash'
// import api from 'api'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import RadioButtonGroup from 'components/RadioButtonGroup'
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
    SearchBox
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
    },

    // 告警图表数据
    alertSeries () {
      var result = [{
        name: this.$t('ui.alert.counts'),
        type: 'line',
        data: []
      }]

      for (var i = 0; i < this.period; i++) {
        var index = _.findIndex(this.alertTrends, (item) => {
          return item.day === this.alertXAxisData[i]
        })
        result[0].data[i] = index >= 0 ? this.alertTrends[index].message : 0
      }

      return result
    },

    // 告警图表横轴数据
    alertXAxisData () {
      var today = new Date()
      var result = []

      for (var i = this.period - 1; i >= 0; i--) {
        result[i] = dateFormat('MM-dd', new Date(today - (this.period - i - 1) * 24 * 3600 * 1000))
      }
      return result
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  ready () {
    // 监听窗口尺寸变化
    window.onresize = () => {
      this.$refs.alertChart.chart.resize()
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

<style lang="stylus">
.alert-overview-filter-bar-head
  border-top solid 1px #CCCCCC
  border-bottom solid 1px #CCCCCC
  background-color #F2F2F2
.alert-overview-filter-bar
  background-color #F2F2F2
  border-top solid 1px #CCCCCC
  border-left solid 1px #CCCCCC
  border-right solid 1px #CCCCCC
  height 45px
  margin-top 15px
.alert-overview-share-btn
  width 24px
  display inline-block
  line-height 24px
  border solid 1px #BCBCBC
  vertical-align middle
  font-size 18px
  text-align center
</style>
