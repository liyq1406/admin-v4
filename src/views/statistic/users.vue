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
          <div class="col-13">
            <div id="trendChart" style="height:320px"></div>
          </div>
          <div class="col-7">
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
          <radio-group :items="regions" :value.sync="region" @select="drawUserRegion"></radio-group>
        </div>
      </div>
      <div class="panel-bd">
        <div class="row">
          <div id="regionChart" style="height:320px; overflow:hidden;"></div>
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
  import echarts from 'echarts/echarts'
  require('echarts/chart/line')
  require('echarts/chart/map')
  import ecConfig from 'echarts/config'

  export default {
    name: 'UsersStatistic',

    components: {
      'radio-group': RadioGroup
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
        regionData: [],
        wroldNames: require('../../consts/world-names'),
        chinaNames: require('../../consts/china-names')
      }
    },

    ready () {
      this.getUserSummary()
      this.drawUserTrends()
      this.drawUserRegion()
    },

    watch: {
      period () {
        this.drawUserTrends()
      }
    },

    methods: {
      getUserSummary () {
        api.statistics.getUserSummary().then((res) => {
          if (res.status === 200) {
            this.total = res.data.total
            this.online = res.data.online
          }
        }).catch((error) => {
          this.handleError(error)
        })
      },

      drawUserTrends () {
        var today = new Date()
        var past = today.getTime() - this.period * 24 * 3600 * 1000
        var start_day = dateFormat('yyyy-MM-dd', new Date(past))
        var end_day = dateFormat('yyyy-MM-dd', today)

        api.statistics.getUserTrend(start_day, end_day).then((res) => {
          var dates = res.data.map((item) => {
            return dateFormat('MM-dd', new Date(item.day))
          })
          /*
          var totalTrends = data.map((item) => {
            return item.total
          })*/
          var addTrends = res.data.map((item) => {
            return item.add
          })
          var activeTrends = res.data.map((item) => {
            return item.active
          })

          if (addTrends.length > 0) {
            this.add = addTrends.reduce((prev, next) => {
              return prev + next
            })
          }

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
              data: [this.$t('statistic.users.newbie', {period: this.period}), this.$t('statistic.users.active')]
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
              name: this.$t('statistic.users.active'),
              type: 'line',
              data: activeTrends
            }, {
              name: this.$t('statistic.users.newbie', {period: this.period}),
              type: 'line',
              data: addTrends
            }]
          }
          var trendChart = echarts.init(document.getElementById('trendChart'))
          trendChart.setOption(trendOptions)
          window.onresize = trendChart.resize
        }).catch((error) => {
          this.handleError(error)
        })
      },

      drawUserRegion () {
        var self = this
        api.statistics.getUserRegion().then((res) => {
          var regionOptions
          var regionChart = echarts.init(document.getElementById('regionChart'))
          if (this.region === 'world') {
            var worldData = []
            var worldMax = 0
            for (var country in res.data) {
              worldData.push({
                name: country,
                value: res.data[country].register
              })

              if (res.data[country].register > worldMax) {
                worldMax = res.data[country].register
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
                  return self.$t('statistic.users.active') + '<br/>' + params.name + ': ' + value
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
                nameMap: this.wroldNames,
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
              if (province !== 'register') {
                chinaData.push({
                  name: province,
                  value: res.data['China'][province].register
                })

                for (var city in res.data['China'][province]) {
                  if (city !== 'register') {
                    chinaData.push({
                      name: city,
                      value: res.data['China'][province][city].register
                    })

                    if (res.data['China'][province][city].register > chinaMax) {
                      chinaMax = res.data['China'][province][city].register
                    }
                  }
                }

                if (res.data['China'][province].register > chinaMax) {
                  chinaMax = res.data['China'][province].register
                }
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
                  return self.$t('statistic.users.active') + '<br/>' + params.name + ': ' + value
                }
              },
              legend: {
                orient: 'vertical',
                x: 'right',
                data: [this.$t('statistic.users.active')]
              },
              dataRange: {
                min: 0,
                max: chinaMax,
                color: ['orange', 'yellow'],
                text: [this.$t('common.high'), this.$t('common.low')],           // 文本，默认为数值文本
                calculable: true
              },
              series: [{
                name: this.$t('statistic.users.active'),
                type: 'map',
                mapType: 'china',
                selectedMode: 'single',
                itemStyle: {
                  normal: { label: { show: true } },
                  emphasis: { label: { show: true } }
                },
                nameMap: this.chinaNames,
                data: chinaData
              }]
            }
            regionChart.setOption(option, true)
          }
        }).catch((error) => {
          this.handleError(error)
        })
      }
    }
  }
</script>
