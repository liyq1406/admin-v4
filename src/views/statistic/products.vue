<template lang="jade">
div
  .panel
    .panel-hd
      h2 趋势
      .leftbox
        v-select(:options="productsOptions", :value.sync="productId", @select="getProductData")
        radio-group(:items="periods", :value.sync="period")
          span.label(slot="label") 最近
    .panel-bd
      .row
        .col-13
          #trendChart(style="height:320px;")
        .col-7
          .statistics-info
            .item
              .cont
                .num {{productSummary.total}}
                .label 总设备量
            .item
              .cont
                .num {{productSummary.activated}}
                .label 激活数
            .item.no-border
              .cont
                .num {{productSummary.online}}
                .label 当前在线
            .item.no-border
              .cont
                .num 0
                .label
                  span 活跃设备
                  .tips
                    i.fa.fa-question-circle(@mouseover="showTooltip = true", @mouseout="showTooltip = false")
                    .tooltip(v-show="showTooltip") 指日活跃设备
  .panel
    .panel-hd
      h2 区域分布
      .leftbox
        radio-group(:items="regions", :value.sync="region", @select="drawProducRegion")
    .panel-bd
      .row
        #regionChart(style="height:320px; overflow:hidden;")

        table.table.table-bordered.table-stripe
          thead
            tr
              th 地区
              th 活跃设备
              th 设备量
              th 占比
          tbody
            tr(v-for="item in regionData")
              td {{item.name}}
              td {{item.value}}
              td {{productSummary.total}}
              td {{(item.value * 100 / productSummary.total).toFixed(2)}}%
</template>

<script>
  var RadioGroup = require('../../components/radio-group.vue');
  var Select = require('../../components/select.vue');
  var config = require('../../consts/config');
  var api = require('../../api');
  var dateFormat = require('date-format');
  var echarts = require('echarts/echarts');
  require('echarts/chart/line');
  require('echarts/chart/map');
  var ecConfig = require('echarts/config');

  module.exports = {
    name: 'ProductStatistic',

    components: {
      'radio-group': RadioGroup,
      'v-select': Select
    },

    data: function () {
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
        periods: config.periods,
        region: 'world',
        regions: config.regions,
        productRegion: {},
        regionData: [],
        showTooltip: false
      };
    },

    ready: function () {
      var self = this;

      this.getProducts().then(function (data) {
        // 产品下拉框数据
        data.forEach(function (item) {
          self.productsOptions.push({
            label: item.name,
            value: item.id
          });
        });

        if (self.productId.length === 0) {
          self.productId = data[0].id;
        }

        self.getProductData();
      });
    },

    // 监听属性变动
    watch: {
      period: function () {
        this.getProductSummary();
        this.drawProductTrends();
      }
    },

    methods: {
      getProductData: function () {
        this.getProductSummary();
        this.drawProductTrends();
        this.drawProducRegion();
      },

      getProducts: function () {
        return api.corp.refreshToken().then(function () {
          return api.product.getProducts();
        });
      },

      getProductSummary: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.statistics.getProductSummary(self.productId).then(function (data) {
            self.productSummary = data;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      drawProductTrends: function () {
        var self = this;
        var today = new Date();
        var past = today.getTime() - this.period * 24 * 3600 * 1000;
        var start_day = dateFormat('yyyy-MM-dd', new Date(past));
        var end_day = dateFormat('yyyy-MM-dd', today);

        api.corp.refreshToken().then(function () {
          api.statistics.getProductTrend(self.productId, start_day, end_day).then(function (data) {
            var dates = data.map(function (item) {
              return dateFormat('MM-dd', new Date(item.day));
            });
            // var totalTrends = data.map(function (item) {
              // return item.total;
            // });
            var activatedTrends = data.map(function (item) {
              return item.activated;
            });
            var activeTrends = data.map(function (item) {
              return item.active;
            });

            // 趋势图表
            var trendOptions = {
              noDataLoadingOption: {
                text: '暂无数据',
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
                data: ['总设备量', '活跃设备', '激活设备']
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
                name: '活跃设备',
                type: 'line',
                data: activeTrends
              }, {
                name: '激活设备',
                type: 'line',
                data: activatedTrends
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

      drawProducRegion: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.statistics.getProductRegion(self.productId).then(function (data) {
            var regionOptions;
            var regionChart = echarts.init(document.getElementById('regionChart'));
            if (self.region === 'world') {
              var worldData = [];
              var worldMax = 0;
              for (var country in data) {
                worldData.push({
                  name: country,
                  value: data[country].activated
                });

                if (data[country].activated > worldMax) {
                  worldMax = data[country].activated;
                }
              }
              console.log(worldData);
              self.regionData = worldData;

              regionOptions = {
                tooltip: {
                  trigger: 'item',
                  formatter: function (params) {
                    var value = (params.value + '').split('.');
                    if (value[0] === '-') {
                      value = 0;
                    }
                    return '活跃设备<br/>' + params.name + ': ' + value;
                  }
                },
                dataRange: {
                  min: 0,
                  max: worldMax,
                  text: ['高', '低'],
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
              };
              regionChart.setOption(regionOptions);
            } else {
              var curIndx = 0;
              var option;
              var mapType = config.mapType;

              var chinaData = [];
              var chinaMax = 0;
              for (var province in data['China']) {
                if (province !== 'activated') {
                  chinaData.push({
                    name: province,
                    value: data['China'][province].activated
                  });

                  for (var city in data['China'][province]) {
                    if (city !== 'activated') {
                      chinaData.push({
                        name: city,
                        value: data['China'][province][city].activated
                      });
                    }

                    if (data['China'][province][city].activated > chinaMax) {
                      chinaMax = data['China'][province][city].activated;
                    }
                  }
                }

                if (data['China'][province].activated > chinaMax) {
                  chinaMax = data['China'][province].activated;
                }
              }
              console.log(chinaData);
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
                    return '活跃设备<br/>' + params.name + ': ' + value;
                  }
                },
                legend: {
                  orient: 'vertical',
                  x: 'right',
                  data: ['活跃设备']
                },
                dataRange: {
                  min: 0,
                  max: chinaMax,
                  color: ['orange', 'yellow'],
                  text: ['高', '低'],           // 文本，默认为数值文本
                  calculable: true
                },
                series: [{
                  name: '活跃设备',
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
