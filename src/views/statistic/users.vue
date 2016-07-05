<template>
  <div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t("ui.statistic.trends") }}</h2>
        <div class="leftbox">
          <radio-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-15 with-loading">
            <line-chart :series="userTrendSeries" :x-axis-data="userXAxisData" v-ref:trend-chart></line-chart>
            <div class="icon-loading" v-show="loadingUserTrends">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
          </div>
          <div class="col-9">
            <div class="statistics-info">
              <div class="item">
                <div class="cont">
                  <div class="num">{{ total }}</div>
                  <div class="label">{{ $t("ui.statistic.users.total") }}</div>
                </div>
              </div>
              <div class="item">
                <div class="cont">
                  <div class="num">{{ add }}</div>
                  <div class="label">{{ $t("ui.statistic.users.newbie_period", {period:period}) }}</div>
                </div>
              </div>
              <div class="item no-border">
                <div class="cont">
                  <div class="num">{{ active }}</div>
                  <div class="label">{{ $t("ui.statistic.users.active") }}</div>
                </div>
              </div>
              <div class="item no-border">
                <div class="cont">
                  <div class="num">{{ online }}</div>
                  <div class="label">{{ $t("ui.statistic.users.online") }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t("ui.statistic.regions") }}</h2>
        <div class="leftbox">
          <radio-group :items="regions" :value.sync="region" @select="getUserRegion"></radio-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-24 with-loading">
            <map-chart :type="region" v-ref:region-chart :series-data="regionsData" :tooltip-label="$t('ui.statistic.users.registered')"></map-chart>
            <div class="icon-loading" v-show="loadingUserRegions">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
          </div>
          <table class="table table-bordered table-stripe">
            <thead>
              <tr>
                <th>{{ $t("ui.statistic.district") }}</th>
                <th>{{ $t("ui.statistic.users.registered") }}</th>
                <th>{{ $t("ui.statistic.percentage") }}({{ region==='china' ? '国内' : '全球' }})</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in regionsData | limitBy countPerPage (currentPage-1)*countPerPage">
                <td>{{ item.name }}</td>
                <td>{{ item.value }}</td>
                <td>{{ userTotal > 0 ? (item.value * 100 / userTotal).toFixed(2) : 0 }}%</td>
              </tr>
            </tbody>
          </table>
          <pager v-if="regionsData.length > countPerPage" :total="regionsData.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import RadioGroup from 'components/RadioGroup'
  import api from 'api'
  import * as config from 'consts/config'
  import locales from 'consts/locales/index'
  import dateFormat from 'date-format'
  import LineChart from 'components/charts/Line'
  import MapChart from 'components/charts/Map'
  import Pager from 'components/Pager'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'UsersStatistic',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      RadioGroup,
      LineChart,
      MapChart,
      Pager
    },

    data () {
      return {
        total: 0,
        online: 0,
        active: 0,
        productRegion: {},
        userTotal: 0,
        period: 7,
        periods: locales[Vue.config.lang].data.PERIODS,
        region: 'china',
        regions: locales[Vue.config.lang].data.REGIONS,
        userTrends: [],
        regionsData: [],
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        loadingUserTrends: false,
        loadingUserRegions: false
      }
    },

    computed: {
      // 用户趋势图表横轴数据
      userXAxisData () {
        return this._genXAxis(this.period)
      },

      // 用户趋势图表数据
      userTrendSeries () {
        var result = [{
          name: this.$t('ui.statistic.users.active'),
          type: 'line',
          data: []
        }, {
          name: this.$t('ui.statistic.users.newbie'),
          type: 'line',
          data: []
        }]

        for (var i = 0; i < this.period; i++) {
          var index = _.findIndex(this.userTrends, (item) => {
            return item.day === this.userXAxisData[i]
          })
          result[0].data[i] = index >= 0 ? this.userTrends[index].active : 0
          result[1].data[i] = index >= 0 ? this.userTrends[index].add : 0
        }

        return result
      },

      add () {
        var result = 0
        for (var i = 0; i < this.period; i++) {
          if (this.userTrends[i]) {
            result += this.userTrends[i].add
          }
        }
        return result
      }
    },

    ready () {
      this.getUserSummary()
      this.getUserTrend()
      this.getUserRegion()
    },

    watch: {
      period () {
        this.getUserTrend()
      }
    },

    methods: {
      /**
       * 生成横轴点
       * @return {Boolean} [description]
       */
      _genXAxis (period) {
        var today = new Date()
        var result = []

        for (var i = period - 1; i >= 0; i--) {
          result[i] = dateFormat('MM-dd', new Date(today - (period - i - 1) * 24 * 3600 * 1000))
        }
        return result
      },

      /**
       * 获取用户统计信息
       */
      getUserSummary () {
        api.statistics.getUserSummary().then((res) => {
          if (res.status === 200) {
            this.total = res.data.total
            this.online = res.data.online
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 获取用户趋势
       */
      getUserTrend () {
        var today = new Date()
        var past = today.getTime() - this.period * 24 * 3600 * 1000
        var startDay = dateFormat('yyyy-MM-dd', new Date(past))
        var endDay = dateFormat('yyyy-MM-dd', today)

        this.loadingUserTrends = true
        api.statistics.getUserTrend(startDay, endDay).then((res) => {
          if (res.status === 200) {
            this.userTrends = res.data.map((item) => {
              item.day = dateFormat('MM-dd', new Date(item.day))
              return item
            })
            this.loadingUserTrends = false
          }
        }).catch((res) => {
          this.loadingUserTrends = false
          this.handleError(res)
        })
      },

      /**
       * 获取用户区域分布
       */
      getUserRegion () {
        this.loadingUserRegions = true
        api.statistics.getUserRegion().then((res) => {
          var regionsData = []
          var sum = 0
          if (this.region === 'world') {
            var chinaData = {
              name: 'China',
              value: 0
            }
            for (let country in res.data) {
              sum += res.data[country].register
              if (/[\u4e00-\u9fa5]+/.test(country.slice(0, 1)) || country === 'China') {
                chinaData.value += res.data[country].register
              } else {
                regionsData.push({
                  name: country,
                  value: res.data[country].register
                })
              }
            }
            regionsData.push(chinaData)
            this.userTotal = sum
          } else if (this.region === 'china') {
            var chinaRegions = res.data['中国'] || res.data['China'] || {}

            for (let province in chinaRegions) {
              if (province !== 'register') {
                sum += chinaRegions[province].register
                regionsData.push({
                  name: province,
                  value: chinaRegions[province].register
                })

                for (let city in chinaRegions[province]) {
                  if (city !== 'register') {
                    sum += chinaRegions[province][city].register
                    regionsData.push({
                      name: city,
                      value: chinaRegions[province][city].register
                    })
                  }
                }
              }
            }
            this.userTotal = sum
          }
          this.regionsData = regionsData
          this.loadingUserRegions = false
        }).catch((res) => {
          this.loadingUserRegions = false
          this.handleError(res)
        })
      }
    }
  }
</script>
