<template>
  <div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t("statistic.trends") }}</h2>
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
                  <div class="label">{{ $t("statistic.users.total") }}</div>
                </div>
              </div>
              <div class="item">
                <div class="cont">
                  <div class="num">{{ add }}</div>
                  <div class="label">{{ $t("statistic.users.newbie_period", {period:period}) }}</div>
                </div>
              </div>
              <div class="item no-border">
                <div class="cont">
                  <div class="num">{{ active }}</div>
                  <div class="label">{{ $t("statistic.users.active") }}</div>
                </div>
              </div>
              <div class="item no-border">
                <div class="cont">
                  <div class="num">{{ online }}</div>
                  <div class="label">{{ $t("statistic.users.online") }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t("statistic.regions") }}</h2>
        <div class="leftbox">
          <radio-group :items="regions" :value.sync="region" @select="getUserRegion"></radio-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-24 with-loading">
            <map-chart :type="region" v-ref:region-chart :series-data="regionsData" :tooltip-label="$t('statistic.users.registered')"></map-chart>
            <div class="icon-loading" v-show="loadingUserRegions">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
          </div>
          <table class="table table-bordered table-stripe">
            <thead>
              <tr>
                <th>{{ $t("statistic.district") }}</th>
                <th>{{ $t("statistic.users.registered") }}</th>
                <th>{{ $t("statistic.percentage") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in regionData">
                <td>{{ wroldNames[item.name] || chinaNames[item.name] || item.name }}</td>
                <td>{{ item.value }}</td>
                <td>{{ (item.value * 100 / total).toFixed(2) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import RadioGroup from '../../components/RadioGroup'
  import api from '../../api'
  import locales from '../../consts/locales/index'
  import dateFormat from 'date-format'
  import LineChart from '../../components/charts/Line'
  import MapChart from '../../components/charts/Map'
  import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'UsersStatistic',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'radio-group': RadioGroup,
      'line-chart': LineChart,
      'map-chart': MapChart
    },

    data () {
      return {
        total: 0,
        online: 0,
        add: 0,
        active: 0,
        productRegion: {},
        period: 7,
        periods: locales[Vue.config.lang].periods,
        region: 'world',
        regions: locales[Vue.config.lang].regions,
        userTrends: [],
        regionsData: [],
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
          name: this.$t('statistic.users.active'),
          type: 'line',
          data: []
        }, {
          name: this.$t('statistic.users.newbie'),
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
        var start_day = dateFormat('yyyy-MM-dd', new Date(past))
        var end_day = dateFormat('yyyy-MM-dd', today)

        this.loadingUserTrends = true
        api.statistics.getUserTrend(start_day, end_day).then((res) => {
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
          // console.log(res.data)
          var regionsData = []
          if (this.region === 'world') {
            for (let country in res.data) {
              regionsData.push({
                name: country,
                value: res.data[country].active
              })
            }
          } else if (this.region === 'china') {
            for (let province in res.data['China']) {
              if (province !== 'register') {
                regionsData.push({
                  name: province,
                  value: res.data['China'][province].register
                })

                for (let city in res.data['China'][province]) {
                  if (city !== 'register') {
                    regionsData.push({
                      name: city,
                      value: res.data['China'][province][city].register
                    })
                  }
                }
              }
            }
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
