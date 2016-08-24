<template>
  <div class="main">
    <div class="main-title">
      <h2>产品统计</h2>
    </div>
    <div class="panel no-split-line mt20">
      <div class="panel-hd panel-hd-full bordered">
        <h2>{{ $t("ui.statistic.trends") }}</h2>
        <div class="leftbox">
          <radio-button-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
          <x-select size="small" width="160px" placeholder="请选择产品" :label="product.name">
            <select v-model="product" @change="getProductData">
              <option v-for="option in productsOptions" :value="option">{{ option.name }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-15 with-loading">
            <line-chart :series="productTrendSeries" :x-axis-data="productXAxisData" v-ref:trend-chart></line-chart>
            <div class="icon-loading" v-show="loadingProductTrends">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
          </div>
          <div class="col-9">
            <div class="statistics-info">
              <div class="item">
                <div class="cont">
                  <div class="num">{{ productSummary.total }}</div>
                  <div class="label">{{ $t("ui.statistic.products.total") }}</div>
                </div>
              </div>
              <div class="item">
                <div class="cont">
                  <div class="num">{{ productSummary.activated }}</div>
                  <div class="label">{{ $t("ui.statistic.products.activated") }}</div>
                </div>
              </div>
              <div class="item no-border">
                <div class="cont">
                  <div class="num">{{ productSummary.online }}</div>
                  <div class="label">{{ $t("ui.statistic.products.online") }}</div>
                </div>
              </div>
              <div class="item no-border">
                <div class="cont">
                  <div class="num">0</div>
                  <div class="label"><span>{{ $t("ui.statistic.products.active") }}</span>
                    <x-tooltip>
                      <span>{{ $t('ui.statistic.products.active_tips') }}</span>
                      <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
                    </x-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd panel-hd-full bordered">
        <h2>{{ $t("ui.statistic.regions") }}</h2>
        <div class="leftbox">
          <radio-button-group :items="regions" :value.sync="region" @select="getProductRegion"></radio-button-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-24 with-loading">
            <map-chart :type="region" v-ref:region-chart :series-data="regionsData" :tooltip-label="$t('ui.statistic.products.active')"></map-chart>
            <div class="icon-loading" v-show="loadingProductRegions">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
          </div>
          <table class="table table-bordered table-stripe">
            <thead>
              <tr>
                <th>{{ $t("ui.statistic.district") }}</th>
                <th>{{ $t("ui.statistic.products.activated") }}</th>
                <th>{{ $t("ui.statistic.percentage") }}({{ region==='china' ? '国内' : '全球' }})</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in regionsData | limitBy countPerPage (currentPage-1)*countPerPage">
                <td>{{ item.name }}</td>
                <td>{{ item.value }}</td>
                <td>{{ productTotal > 0 ? (item.value * 100 / productTotal).toFixed(2) : 0 }}%</td>
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
  import RadioButtonGroup from 'components/RadioButtonGroup'
  import Select from 'components/Select'
  import LineChart from 'components/charts/Line'
  import MapChart from 'components/charts/Map'
  import Pager from 'components/Pager'
  import Tooltip from 'components/Tooltip'
  import locales from 'consts/locales/index'
  import api from 'api'
  import * as config from 'consts/config'
  import dateFormat from 'date-format'
  import { globalMixins } from 'src/mixins'
  import _ from 'lodash'

  export default {
    name: 'ProductStatistic',

    mixins: [globalMixins],

    components: {
      RadioButtonGroup,
      'x-select': Select,
      LineChart,
      MapChart,
      Pager,
      'x-tooltip': Tooltip
    },

    data () {
      return {
        // 产品统计
        productSummary: {
          total: 0,
          activated: 0,
          active: 0,
          online: 0
        },
        productTotal: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        product: {},
        productsOptions: [],
        period: 7,
        periods: locales[Vue.config.lang].data.PERIODS,
        region: 'china',
        regions: locales[Vue.config.lang].data.REGIONS,
        productTrends: [],
        regionsData: [],
        loadingProductTrends: false,
        loadingProductRegions: false
      }
    },

    computed: {
      // 产品趋势图表横轴数据
      productXAxisData () {
        return this._genXAxis(this.period)
      },

      // 产品趋势图表数据
      productTrendSeries () {
        var result = [{
          name: this.$t('ui.statistic.products.active'),
          type: 'line',
          data: []
        }, {
          name: this.$t('ui.statistic.products.activated'),
          type: 'line',
          data: []
        }]

        for (var i = 0; i < this.period; i++) {
          var index = _.findIndex(this.productTrends, (item) => {
            return item.day === this.productXAxisData[i]
          })
          result[0].data[i] = index >= 0 ? this.productTrends[index].active : 0
          result[1].data[i] = index >= 0 ? this.productTrends[index].activated : 0
        }

        return result
      }
    },

    ready () {
      api.product.all().then((res) => {
        if (res.status === 200 && res.data.length > 0) {
          this.productsOptions = res.data
          this.product = res.data[0]
          this.getProductData()
          // 假数据
          // this.productTrends = [{day: '04-26', activated: 10, active: 8}]
          // this.userTrends = [{day: '04-26', add: 10, active: 8}]
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 监听窗口尺寸变化
      window.onresize = () => {
        this.$refs.trendChart.chart.resize()
        this.$refs.regionChart.chart.resize()
      }
    },

    // 监听属性变动
    watch: {
      period () {
        this.getProductSummary()
        this.getProductTrend()
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
       * 获取产品信息
       */
      getProductData () {
        this.getProductSummary()
        this.getProductTrend()
        this.getProductRegion()
      },

      /**
       * 获取产品统计信息
       */
      getProductSummary () {
        api.statistics.getProductSummary(this.product.id).then((res) => {
          if (res.status === 200) {
            this.productSummary = res.data
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 获取产品趋势
       */
      getProductTrend () {
        var today = new Date()
        var past = today.getTime() - this.period * 24 * 3600 * 1000
        var startDay = dateFormat('yyyy-MM-dd', new Date(past))
        var endDay = dateFormat('yyyy-MM-dd', today)

        this.loadingProductTrends = true
        api.statistics.getProductTrend(this.product.id, startDay, endDay).then((res) => {
          if (res.status === 200) {
            this.productTrends = res.data.map((item) => {
              item.day = dateFormat('MM-dd', new Date(item.day))
              return item
            })
            this.loadingProductTrends = false
          }
        }).catch((res) => {
          this.loadingProductTrends = false
          this.handleError(res)
        })
      },

      /**
       * 获取产品区域分布
       */
      getProductRegion () {
        this.loadingProductRegions = true
        api.statistics.getProductRegion(this.product.id).then((res) => {
          var regionsData = []
          var sum = 0
          if (this.region === 'world') {
            var chinaData = {
              name: 'China',
              value: 0
            }
            for (let country in res.data) {
              sum += res.data[country].activated
              if (/[\u4e00-\u9fa5]+/.test(country.slice(0, 1)) || country === 'China') {
                chinaData.value += res.data[country].activated
              } else {
                regionsData.push({
                  name: country,
                  value: res.data[country].activated
                })
              }
            }
            regionsData.push(chinaData)
            this.productTotal = sum
          } else if (this.region === 'china') {
            var chinaRegions = res.data['中国'] || res.data['China'] || {}

            for (var province in chinaRegions) {
              if (province !== 'activated' && province !== 'online') {
                sum += chinaRegions[province].activated
                regionsData.push({
                  name: province,
                  value: chinaRegions[province].activated
                })

                for (var city in chinaRegions[province]) {
                  if (city !== 'activated' && city !== 'online') {
                    sum += chinaRegions[province][city].activated
                    regionsData.push({
                      name: city,
                      value: chinaRegions[province][city].activated
                    })
                  }
                }
              }
            }
            this.productTotal = sum
          }
          this.regionsData = regionsData
          this.loadingProductRegions = false
        }).catch((res) => {
          this.loadingProductRegions = false
          this.handleError(res)
        })
      }
    }
  }
</script>
