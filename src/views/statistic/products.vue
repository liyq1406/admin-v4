<template>
  <div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t("statistic.trends") }}</h2>
        <div class="leftbox">
          <v-select size="small" width="160px" placeholder="请选择产品" :label="product.name">
            <select v-model="product" @change="getProductData">
              <option v-for="option in productsOptions" :value="option">{{ option.name }}</option>
            </select>
          </v-select>
          <radio-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
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
                  <div class="label">{{ $t("statistic.products.total") }}</div>
                </div>
              </div>
              <div class="item">
                <div class="cont">
                  <div class="num">{{ productSummary.activated }}</div>
                  <div class="label">{{ $t("statistic.products.activated") }}</div>
                </div>
              </div>
              <div class="item no-border">
                <div class="cont">
                  <div class="num">{{ productSummary.online }}</div>
                  <div class="label">{{ $t("statistic.products.online") }}</div>
                </div>
              </div>
              <div class="item no-border">
                <div class="cont">
                  <div class="num">0</div>
                  <div class="label"><span>{{ $t("statistic.products.active") }}</span>
                    <div class="tips"><i @mouseover="showTooltip = true" @mouseout="showTooltip = false" class="fa fa-question-circle"></i>
                      <div v-show="showTooltip" class="tooltip">{{ $t("statistic.products.active_tips") }}</div>
                    </div>
                  </div>
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
          <radio-group :items="regions" :value.sync="region" @select="getProductRegion"></radio-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-24 with-loading">
            <map-chart :type="region" v-ref:region-chart :series-data="regionsData" :tooltip-label="$t('statistic.products.active')"></map-chart>
            <div class="icon-loading" v-show="loadingProductRegions">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
          </div>
          <table class="table table-bordered table-stripe">
            <thead>
              <tr>
                <th>{{ $t("statistic.district") }}</th>
                <th>{{ $t("statistic.products.activated") }}</th>
                <th>{{ $t("statistic.percentage") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in regionsData">
                <td>{{ item.name }}</td>
                <td>{{ item.value }}</td>
                <td>{{ (item.value * 100 / productSummary.total).toFixed(2) }}%</td>
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
  import Select from '../../components/Select'
  import LineChart from '../../components/charts/Line'
  import MapChart from '../../components/charts/Map'
  import locales from '../../consts/locales/index'
  import api from '../../api'
  import dateFormat from 'date-format'
  import { globalMixins } from '../../mixins'
  import _ from 'lodash'

  export default {
    name: 'ProductStatistic',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'radio-group': RadioGroup,
      'v-select': Select,
      'line-chart': LineChart,
      'map-chart': MapChart
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
        product: {},
        productsOptions: [],
        period: 7,
        periods: locales[Vue.config.lang].periods,
        region: 'world',
        regions: locales[Vue.config.lang].regions,
        productTrends: [],
        regionsData: [],
        loadingProductTrends: false,
        loadingProductRegions: false,
        showTooltip: false
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
          name: this.$t('statistic.products.active'),
          type: 'line',
          data: []
        }, {
          name: this.$t('statistic.products.activated'),
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
        var start_day = dateFormat('yyyy-MM-dd', new Date(past))
        var end_day = dateFormat('yyyy-MM-dd', today)

        this.loadingProductTrends = true
        api.statistics.getProductTrend(this.product.id, start_day, end_day).then((res) => {
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
          // console.log(res.data)
          var regionsData = []
          if (this.region === 'world') {
            for (var country in res.data) {
              regionsData.push({
                name: country,
                value: res.data[country].activated
              })
            }
          } else if (this.region === 'china') {
            for (var province in res.data['China']) {
              if (province !== 'activated') {
                regionsData.push({
                  name: province,
                  value: res.data['China'][province].activated
                })

                for (var city in res.data['China'][province]) {
                  if (city !== 'activated') {
                    regionsData.push({
                      name: city,
                      value: res.data['China'][province][city].activated
                    })
                  }
                }
              }
            }
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
