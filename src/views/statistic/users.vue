<template lang="jade">
div
  .panel
    .panel-hd
      h2 {{ $t("statistic.trends") }}
      .leftbox
        radio-group(:items="periods", :value.sync="period")
          span.label(slot="label") {{ $t("common.recent") }}
    .panel-bd
      .row
        .col-13
          #trendChart(style="height:320px;")
        .col-7
          .statistics-info
            .item
              .cont
                .num {{total}}
                .label {{ $t("statistic.users.total") }}
            .item
              .cont
                .num {{add}}
                .label {{ $t("statistic.users.newbie_period", {period:period}) }}
            .item.no-border
              .cont
                .num {{active}}
                .label {{ $t("statistic.users.active") }}
            .item.no-border
              .cont
                .num {{online}}
                .label {{ $t("statistic.users.online") }}

  .panel
    .panel-hd
      h2 {{ $t("statistic.regions") }}
      .leftbox
        radio-group(:items="regions", :value.sync="region", @select="drawUserRegion")
    .panel-bd
      .row
        #regionChart(style="height:320px; overflow:hidden;")

        table.table.table-bordered.table-stripe
          thead
            tr
              th {{ $t("statistic.district") }}
              th {{ $t("statistic.users.registered") }}
              th {{ $t("statistic.percentage") }}
          tbody
            tr(v-for="item in regionData")
              td {{ wroldNames[item.name] || chinaNames[item.name] || item.name}}
              td {{item.value}}
              td {{(item.value * 100 / total).toFixed(2)}}%
</template>

<script>
  import Vue from 'vue';
  import RadioGroup from '../../components/radio-group.vue';
  import api from '../../api';
  import locales from '../../consts/locales';
  import dateFormat from 'date-format';
  import echarts from 'echarts/echarts';
  require('echarts/chart/line');
  require('echarts/chart/map');
  import ecConfig from 'echarts/config';

  module.exports = {
    name: 'UsersStatistic',

    components: {
      'radio-group': RadioGroup
    },

    data: function () {
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
      };
    },

    ready: function () {
      this.getUserSummary();
      this.drawUserTrends();
      this.drawUserRegion();
    },

    watch: {
      period: function () {
        this.drawUserTrends();
      }
    },

    methods: {
      getUserSummary: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.statistics.getUserSummary().then(function (data) {
            self.total = data.total;
            self.online = data.online;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      drawUserTrends: function () {
        var self = this;
        var today = new Date();
        var past = today.getTime() - this.period * 24 * 3600 * 1000;
        var start_day = dateFormat('yyyy-MM-dd', new Date(past));
        var end_day = dateFormat('yyyy-MM-dd', today);

        api.corp.refreshToken().then(function () {
          api.statistics.getUserTrend(start_day, end_day).then(function (data) {
            var dates = data.map(function (item) {
              return dateFormat('MM-dd', new Date(item.day));
            });
            /*
            var totalTrends = data.map(function (item) {
              return item.total;
            });*/
            var addTrends = data.map(function (item) {
              return item.add;
            });
            var activeTrends = data.map(function (item) {
              return item.active;
            });

            if (addTrends.length > 0) {
              self.add = addTrends.reduce(function (prev, next) {
                return prev + next;
              });
            }

            // 趋势图表
            var trendOptions = {
              noDataLoadingOption: {
                text: self.$t('common.no_data'),
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
                data: [self.$t('statistic.users.newbie', {period: self.period}), self.$t('statistic.users.active')]
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
                name: self.$t('statistic.users.active'),
                type: 'line',
                data: activeTrends
              }, {
                name: self.$t('statistic.users.newbie', {period: self.period}),
                type: 'line',
                data: addTrends
              }]
            };
            var trendChart = echarts.init(document.getElementById('trendChart'));
            trendChart.setOption(trendOptions);
            window.onresize = trendChart.resize;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      drawUserRegion: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.statistics.getUserRegion().then(function (data) {
            var regionOptions;
            var regionChart = echarts.init(document.getElementById('regionChart'));
            if (self.region === 'world') {
              var worldData = [];
              var worldMax = 0;
              for (var country in data) {
                worldData.push({
                  name: country,
                  value: data[country].register
                });

                if (data[country].register > worldMax) {
                  worldMax = data[country].register;
                }
              }
              self.regionData = worldData;

              regionOptions = {
                tooltip: {
                  trigger: 'item',
                  formatter: function (params) {
                    var value = (params.value + '').split('.');
                    if (value[0] === '-') {
                      value = 0;
                    }
                    return self.$t('statistic.users.active') + '<br/>' + params.name + ': ' + value;
                  }
                },
                dataRange: {
                  min: 0,
                  max: worldMax,
                  text: [self.$t('common.high'), self.$t('common.low')],
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
                  nameMap: self.wroldNames,
                  data: worldData
                }]
              };
              regionChart.setOption(regionOptions);
            } else {
              var curIndx = 0;
              var option;
              var mapType = locales[Vue.config.lang].mapType;

              var chinaData = [];
              var chinaMax = 0;
              for (var province in data['China']) {
                if (province !== 'register') {
                  chinaData.push({
                    name: province,
                    value: data['China'][province].register
                  });

                  for (var city in data['China'][province]) {
                    if (city !== 'register') {
                      chinaData.push({
                        name: city,
                        value: data['China'][province][city].register
                      });

                      if (data['China'][province][city].register > chinaMax) {
                        chinaMax = data['China'][province][city].register;
                      }
                    }
                  }

                  if (data['China'][province].register > chinaMax) {
                    chinaMax = data['China'][province].register;
                  }
                }
              }
              self.regionData = chinaData;

              regionChart.on(ecConfig.EVENT.MAP_SELECTED, function (param) {
                var len = mapType.length;
                var mt = mapType[curIndx % len];
                if (mt === 'china') {
                  // 全国选择时指定到选中的省份
                  var selected = param.selected;
                  for (var i in selected) {
                    if (selected[i]) {
                      mt = i;
                      while (len--) {
                        if (mapType[len] === mt) {
                          curIndx = len;
                        }
                      }
                      break;
                    }
                  }
                } else {
                  curIndx = 0;
                  mt = 'china';
                }
                option.series[0].mapType = mt;
                regionChart.setOption(option, true);
              });
              option = {
                tooltip: {
                  trigger: 'item',
                  formatter: function (params) {
                    var value = (params.value + '').split('.');
                    if (value[0] === '-') {
                      value = 0;
                    }
                    return self.$t('statistic.users.active') + '<br/>' + params.name + ': ' + value;
                  }
                },
                legend: {
                  orient: 'vertical',
                  x: 'right',
                  data: [self.$t('statistic.users.active')]
                },
                dataRange: {
                  min: 0,
                  max: chinaMax,
                  color: ['orange', 'yellow'],
                  text: [self.$t('common.high'), self.$t('common.low')],           // 文本，默认为数值文本
                  calculable: true
                },
                series: [{
                  name: self.$t('statistic.users.active'),
                  type: 'map',
                  mapType: 'china',
                  selectedMode: 'single',
                  itemStyle: {
                    normal: { label: { show: true } },
                    emphasis: { label: { show: true } }
                  },
                  nameMap: self.chinaNames,
                  data: chinaData
                }]
              };
              regionChart.setOption(option, true);
            }
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      }
    }
  };
</script>
