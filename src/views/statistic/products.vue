<template>
  <div>
    <div class="panel">
      <div class="panel-hd">
        <h2>{{ $t("statistic.trends") }}</h2>
        <div class="leftbox">
          <v-select :options="productsOptions" :value.sync="productId" size="small" width="160px" @select="getProductData"></v-select>
          <radio-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div class="col-13">
            <div id="trendChart" style="height:320px"></div>
          </div>
          <div class="col-7">
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
          <radio-group :items="regions" :value.sync="region" @select="drawProducRegion"></radio-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div id="regionChart" style="height:320px; overflow:hidden;"></div>
          <table class="table table-bordered table-stripe">
            <thead>
              <tr>
                <th>{{ $t("statistic.district") }}</th>
                <th>{{ $t("statistic.products.activated") }}</th>
                <th>{{ $t("statistic.percentage") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in regionData">
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
  import locales from '../../consts/locales/index'
  import api from '../../api'
  import dateFormat from 'date-format'
  import echarts from 'echarts/echarts'
  require('echarts/chart/line')
  require('echarts/chart/map')
  import ecConfig from 'echarts/config'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'ProductStatistic',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'radio-group': RadioGroup,
      'v-select': Select
    },

    data () {
      return {
        productSummary: {
          total: 0,
          activated: 0,
          active: 0,
          online: 0
        },
        productId: '',
        productsOptions: [],
        period: 7,
        periods: locales[Vue.config.lang].periods,
        region: 'world',
        regions: locales[Vue.config.lang].regions,
        productRegion: {},
        regionData: [],
        showTooltip: false
      }
    },

    ready () {
      this.getProducts().then((res) => {
        // 产品下拉框数据
        res.data.forEach((item) => {
          this.productsOptions.push({
            label: item.name,
            value: item.id
          })
        })

        if (this.productId.length === 0) {
          this.productId = res.data[0].id
        }

        this.getProductData()
      })
    },

    // 监听属性变动
    watch: {
      period () {
        this.getProductSummary()
        this.drawProductTrends()
      }
    },

    methods: {
      getProductData () {
        this.getProductSummary()
        this.drawProductTrends()
        this.drawProducRegion()
      },

      getProducts () {
        return api.product.all()
      },

      getProductSummary () {
        api.statistics.getProductSummary(this.productId).then((res) => {
          if (res.status === 200) {
            this.productSummary = res.data
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      drawProductTrends () {
        var today = new Date()
        var past = today.getTime() - this.period * 24 * 3600 * 1000
        var start_day = dateFormat('yyyy-MM-dd', new Date(past))
        var end_day = dateFormat('yyyy-MM-dd', today)

        api.statistics.getProductTrend(this.productId, start_day, end_day).then((res) => {
          var dates = res.data.map((item) => {
            return dateFormat('MM-dd', new Date(item.day))
          })
          // var totalTrends = data.map((item) => {
            // return item.total
          // })
          var activatedTrends = res.data.map((item) => {
            return item.activated
          })
          var activeTrends = res.data.map((item) => {
            return item.active
          })

          // 趋势图表
          var trendOptions = {
            noDataLoadingOption: {
              text: this.$t('common.no_data'),
              effect: '',
              effectOption: {
                backgroundColor: '#FFF'
              },
              textStyle: {
                fontSize: 14,
                color: '#999'
              }
            },
            calculable: true,
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              x: 50,
              y: 32,
              x2: 15
            },
            legend: {
              x: 'right',
              y: 10,
              data: [this.$t('statistic.products.active'), this.$t('statistic.products.activated')]
            },
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: dates
            }],
            yAxis: [{
              type: 'value'
            }],
            series: [{
              name: this.$t('statistic.products.active'),
              type: 'line',
              data: activeTrends
            }, {
              name: this.$t('statistic.products.activated'),
              type: 'line',
              data: activatedTrends
            }]
          }
          var trendChart = echarts.init(document.getElementById('trendChart'))
          trendChart.setOption(trendOptions)
          window.onresize = trendChart.resize
        }).catch((res) => {
          this.handleError(res)
        })
      },

      drawProducRegion () {
        var self = this
        api.statistics.getProductRegion(this.productId).then((res) => {
          var regionOptions
          var regionChart = echarts.init(document.getElementById('regionChart'))
          if (this.region === 'world') {
            var worldData = []
            var worldMax = 0
            for (var country in res.data) {
              worldData.push({
                name: country,
                value: res.data[country].activated
              })

              if (res.data[country].activated > worldMax) {
                worldMax = res.data[country].activated
              }
            }
            this.regionData = worldData

            regionOptions = {
              tooltip: {
                trigger: 'item',
                formatter (params) {
                  var value = (params.value + '').split('.')
                  if (value[0] === '-') {
                    value = 0
                  }
                  return self.$t('statistic.products.active') + '<br/>' + params.name + ': ' + value
                }
              },
              dataRange: {
                min: 0,
                max: worldMax,
                text: [this.$t('common.high'), this.$t('common.low')],
                realtime: false,
                calculable: true,
                color: ['orangered', 'yellow', 'lightskyblue']
              },
              series: [{
                type: 'map',
                mapType: 'world',
                roam: 'move',
                mapLocation: {
                  y: 10
                },
                nameMap: require('../../consts/world-names'),
                data: worldData
              }]
            }
            regionChart.setOption(regionOptions)
          } else {
            var curIndx = 0
            var option
            var mapType = locales[Vue.config.lang].mapType

            var chinaData = []
            var chinaMax = 0
            for (var province in res.data['China']) {
              if (province !== 'activated') {
                chinaData.push({
                  name: province,
                  value: res.data['China'][province].activated
                })

                for (var city in res.data['China'][province]) {
                  if (city !== 'activated') {
                    chinaData.push({
                      name: city,
                      value: res.data['China'][province][city].activated
                    })
                  }

                  if (res.data['China'][province][city].activated > chinaMax) {
                    chinaMax = res.data['China'][province][city].activated
                  }
                }
              }

              if (res.data['China'][province].activated > chinaMax) {
                chinaMax = res.data['China'][province].activated
              }
            }
            this.regionData = chinaData

            regionChart.on(ecConfig.EVENT.MAP_SELECTED, (param) => {
              var len = mapType.length
              var mt = mapType[curIndx % len]
              if (mt === 'china') {
                // 全国选择时指定到选中的省份
                var selected = param.selected
                for (var i in selected) {
                  if (selected[i]) {
                    mt = i
                    while (len--) {
                      if (mapType[len] === mt) {
                        curIndx = len
                      }
                    }
                    break
                  }
                }
              } else {
                curIndx = 0
                mt = 'china'
              }
              option.series[0].mapType = mt
              regionChart.setOption(option, true)
            })
            option = {
              tooltip: {
                trigger: 'item',
                formatter (params) {
                  var value = (params.value + '').split('.')
                  if (value[0] === '-') {
                    value = 0
                  }
                  return self.$t('statistic.products.active') + '<br/>' + params.name + ': ' + value
                }
              },
              legend: {
                orient: 'vertical',
                x: 'right',
                data: [this.$t('statistic.products.active')]
              },
              dataRange: {
                min: 0,
                max: chinaMax,
                color: ['orange', 'yellow'],
                text: [this.$t('common.high'), this.$t('common.low')],           // 文本，默认为数值文本
                calculable: true
              },
              series: [{
                name: this.$t('statistic.products.active'),
                type: 'map',
                mapType: 'china',
                selectedMode: 'single',
                itemStyle: {
                  normal: { label: { show: true } },
                  emphasis: { label: { show: true } }
                },
                nameMap: require('../../consts/china-names'),
                data: chinaData
              }]
            }
            regionChart.setOption(option, true)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }
    }
  }
</script>
