<template lang="jade">
  div
    .panel
      .panel-hd
        radio-group(:items="periods", :value.sync="period", @select="drawUserTrends")
          span.label(slot="label") 最近
        h2 趋势
      .panel-bd
        .row
          .col-13
            #trendChart(style="height:320px;")
          .col-7
            .statistics-info
              .item
                .cont
                  .num {{total}}
                  .label 用户总数
              .item
                .cont
                  .num {{add}}
                  .label {{period}}天新增用户
              .item.no-border
                .cont
                  .num {{active}}
                  .label 活跃用户
              .item.no-border
                .cont
                  .num {{online}}
                  .label 当前在线

    .panel
      .panel-hd
        radio-group(:items="regions", :value.sync="region", @select="drawUserRegion")
        h2 区域分布
      .panel-bd
        .row
          #regionChart(style="height:320px; overflow:hidden;")

          table.table.table-bordered.table-stripe
            thead
              tr
                th 地区
                th 活跃用户
                th 用户数
                th 占比
            tbody
              tr(v-for="item in regionData")
                td {{item.name}}
                td {{item.value}}
                td 2378
                td {{(item.value * 100 / 2378).toFixed(2)}}%
</template>

<script>
  var RadioGroup = require('../../components/radio-group.vue');
  var api = require('../../api');
  var config = require('../../consts/config');
  var _ = require('lodash');
  var dateFormat = require('date-format');
  var echarts = require('echarts/echarts');
  require('echarts/chart/line');
  require('echarts/chart/map');
  var ecConfig = require('echarts/config');

  module.exports = {
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
        periods: config.periods,
        region: 'world',
        regions: config.regions,
        regionData: []
      };
    },

    ready: function () {
      this.getUserSummary();
      this.drawUserTrends();
      this.drawUserRegion();
    },

    methods: {
      getUserSummary: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.statistics.getUserSummary().then(function (data) {
            self.total = data.total;
            self.online = data.online;
          }).catch(function (error) {
            self.handleError(error)
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
                data:['新增用户', '活跃用户']
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
                name: '活跃用户',
                type: 'line',
                data: activeTrends
              }, {
                name: '新增用户',
                type: 'line',
                data: addTrends
              }]
            };
            var trendChart = echarts.init(document.getElementById('trendChart'));
            trendChart.setOption(trendOptions);
            window.onresize = trendChart.resize;
          }).catch(function (error) {
            self.handleError(error)
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
              for(var country in data) {
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
                      value = 0
                    }
                    return '用户数<br/>' + params.name + ': ' + value;
                  }
                },
                dataRange: {
                  min: 0,
                  max: worldMax,
                  text:['高','低'],
                  realtime: false,
                  calculable: true,
                  color: ['orangered','yellow','lightskyblue']
                },
                series: [{
                  type: 'map',
                  mapType: 'world',
                  roam: 'move',
                  mapLocation: {
                    y: 10
                  },
                  data: worldData
                }]
              };
              regionChart.setOption(regionOptions);
            } else {
              var curIndx = 0;
              var option;
              var mapType = [
                'china',
                // 23个省
                '广东', '青海', '四川', '海南', '陕西',
                '甘肃', '云南', '湖南', '湖北', '黑龙江',
                '贵州', '山东', '江西', '河南', '河北',
                '山西', '安徽', '福建', '浙江', '江苏',
                '吉林', '辽宁', '台湾',
                // 5个自治区
                '新疆', '广西', '宁夏', '内蒙古', '西藏',
                // 4个直辖市
                '北京', '天津', '上海', '重庆',
                // 2个特别行政区
                '香港', '澳门'
              ];

              var chinaData = [];
              var chinaMax = 0;
              for(var province in data['China']) {
                if (province !== 'register') {
                  chinaData.push({
                    name: province,
                    value: data['China'][province].register
                  });

                  for(var city in data['China'][province]) {
                    if (city != 'register') {
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

              regionChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){
                var len = mapType.length;
                var mt = mapType[curIndx % len];
                if (mt == 'china') {
                  // 全国选择时指定到选中的省份
                  var selected = param.selected;
                  for (var i in selected) {
                    if (selected[i]) {
                      mt = i;
                      while (len--) {
                        if (mapType[len] == mt) {
                          curIndx = len;
                        }
                      }
                      break;
                    }
                  }
                }
                else {
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
                      value = 0
                    }
                    return '用户数<br/>' + params.name + ': ' + value;
                  }
                },
                legend: {
                  orient: 'vertical',
                  x:'right',
                  data:['用户数']
                },
                dataRange: {
                  min: 0,
                  max: chinaMax,
                  color:['orange','yellow'],
                  text:['高','低'],           // 文本，默认为数值文本
                  calculable: true
                },
                series: [{
                  name: '用户数',
                  type: 'map',
                  mapType: 'china',
                  selectedMode: 'single',
                  itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
                  },
                  data: chinaData
                }]
              };
              regionChart.setOption(option, true);
            }
          }).catch(function (error) {
            self.handleError(error)
          });
        });
      },
    }
  };
</script>
