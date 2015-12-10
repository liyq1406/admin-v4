<template lang="jade">
  div
    .panel
      .panel-hd
        radio-group(:items="periods", :value.sync="period", @select="getUserTrends")
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
                  .label 新增用户
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
        radio-group(:items="regions", :value.sync="region", @select="getUserRegion")
        h2 区域分布
      .panel-bd
        .row
          #regionChart(style="height:320px; overflow:hidden;")

          h3.table-caption 明细
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
                td 10000
                td {{item.value / 10000}}
</template>

<script>
  var RadioGroup = require('../../components/radio-group.vue');
  var api = require('../../api');
  var _ = require('lodash');
  var dateFormat = require('date-format');
  var echarts = require('echarts/echarts');
  require('echarts/chart/line');
  require('echarts/chart/map');
  var ecConfig = require('echarts/config');
  var zrEvent = require('zrender/src/tool/event');

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
        activated: 0,
        productRegion: {},
        period: 7,
        periods: [
          { label: '7天', value: 7 },
          { label: '30天', value: 30 },
          { label: '90天', value: 90 }
        ],
        region: 'world',
        regions: [
          { label: '全球', value: 'world'},
          { label: '国内', value: 'china' }
        ],
        regionData: []
      };
    },

    ready: function () {
      this.getUserTrends();
      this.getUserRegion();
    },

    route: {
      data: function (transition) {
        var self = this;
        this.getUserTrends();
        this.getUserRegion();

        api.corp.refreshToken().then(function () {
          api.statistics.getUserSummary().then(function (data) {
            self.total = data.total;
            self.online = data.online;
            transition.next();
          });
        });
      }
    },

    methods: {
      getUserTrends: function () {
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
              calculable: true,
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
          });
        });
      },

      getUserRegion: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.statistics.getUserRegion().then(function (data) {
            var regionOptions;
            var regionChart = echarts.init(document.getElementById('regionChart'));
            if (self.region === 'world') {
              var worldData = [];
              for(var country in data) {
                worldData.push({
                  name: country,
                  value: data[country].register
                });
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
                  max: 100,
                  text:['High','Low'],
                  realtime: false,
                  calculable: true,
                  color: ['orangered','yellow','lightskyblue']
                },
                series: [{
                  type: 'map',
                  mapType: 'world',
                  roam: true,
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
                    }
                  }
                }
              }
              self.regionData = chinaData;

              document.getElementById('regionChart').onmousewheel = function (e){
                var event = e || window.event;
                curIndx += zrEvent.getDelta(event) > 0 ? (-1): 1;
                if (curIndx < 0) {
                    curIndx = mapType.length - 1;
                }
                var mt = mapType[curIndx % mapType.length];
                option.series[0].mapType = mt;
                regionChart.setOption(option, true);

                zrEvent.stop(event);
              };

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
                  max: 1000,
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
          });
        });
      },
    }
  };
</script>
