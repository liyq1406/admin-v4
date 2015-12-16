<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          radio-group(:items="periods", :value.sync="period", @select="drawTrendsChart")
            span.label(slot="label") 最近
          h2 告警服务
        .panel-bd
          .row
            .col-13
              #trendChart(style="height:320px;")
            .col-7
              .statistics-info
                .item
                  .cont
                    .num 3620
                    .label 总设备量
                .item
                  .cont
                    .num 0
                    .label 在线设备
                .item.no-border
                  .cont
                    .num 13
                    .label 告警消息
                .item.no-border
                  .cont
                    .num 13
                    .label 7天新增

      .panel
        .panel-hd
          h2 告警信息
        .panel-bd
          //- 数据
          table.table.table-stripe.table-bordered
            thead
              tr
                th 产品名称
                th 告警内容
                th 上报时间
                th.tac 操作
            tbody
              tr(v-for="info in infos | limitBy pageCount (currentPage-1)*pageCount")
                td {{info.name}}
                td
                  span.text-label.text-label-danger(v-if="info.level === 1") 严重
                  span.text-label.text-label-info(v-if="info.level === 2") 轻微
                  span.text-label(v-if="info.level === 3") 通知
                  | {{info.content}}
                td {{info.time}}
                td.tac
                  button.btn.btn-link.btn-sm(@click="showInfo(info)") 查看
              tr(v-if="infos.length === 0")
                td.tac(colspan="4")
                  i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                  .tips-null(v-else) 暂无数据记录
          pager(:total="infos.length", :current.sync="currentPage", :page-count="pageCount")

    // 添加设备浮层
    modal(:show.sync="showModal")
      h3(slot="header") 告警信息
      //- 数据
      table.table.table-stripe.table-bordered(slot="body")
        tbody
          tr
            td 产品名称
            td {{model.name}}
          tr
            td 告警规则
            td {{model.rule}}
          tr
            td 告警内容
            td
              span.text-label.text-label-danger(v-if="model.level === 1") 严重
              span.text-label.text-label-info(v-if="model.level === 2") 轻微
              span.text-label(v-if="model.level === 3") 通知
              | {{model.content}}
          tr
            td 告警状态值
            td {{model.state}}
          tr
            td 上报时间
            td {{model.time}}
          tr
            td 备注
            td {{model.remark}}
      .modal-footer(slot="footer")
        button.btn.btn-primary(@click.prevent.stop="showModal = false") 确定
</template>

<script>
  var api = require('../../api');
  var Pager = require('../../components/pager.vue');
  var Modal = require('../../components/modal.vue');
  var RadioGroup = require('../../components/radio-group.vue');
  var dateFormat = require('date-format');
  var echarts = require('echarts/echarts');
  require('echarts/chart/line');

  module.exports = {
    documentTitle: "告警服务",

    components: {
      'pager': Pager,
      'modal': Modal,
      'radio-group': RadioGroup
    },

    data: function () {
      return {
        infos: [],
        pageCount: 10,
        currentPage: 1,
        showModal: false,
        model: {},
        period: 7,
        periods: [
          { label: '7天', value: 7 },
          { label: '30天', value: 30 },
          { label: '90天', value: 90 }
        ],
        product_id: '',
        alarmTrends: []
      }
    },

    computed: {
      filteredAlarmTrends: function () {
        return this.alarmTrends.slice(-this.period);
      }
    },

    ready: function () {
      // this.drawTrendsChart()
      var self = this;
      this.getAlarmTrends().then(function (data) {
        self.alarmTrends = data;
        self.drawTrendsChart();
      });
    },

    route: {
      data: function () {
        return {
          infos: [{
            name: '空气净化器',
            rule: '设备上线',
            level: 3,
            content: '设备上线了',
            state: 'online',
            scope: '厂商',
            remark: '设备连接通知',
            time: '2015-12-10 15:42:09'
          }, {
            name: '空气净化器',
            rule: '风机转速过高',
            level: 1,
            content: '风机转速过高',
            state: '500',
            scope: '厂商',
            remark: '警告',
            time: '2015-12-09 12:12:29'
          }, {
            name: '空气净化器',
            rule: '风机转速异常',
            level: 2,
            content: '风机转速异常',
            state: '300',
            scope: '厂商',
            remark: '警告',
            time: '2015-12-09 11:16:08'
          }, {
            name: '空气净化器',
            rule: '设备离线',
            level: 3,
            content: '设备下线了',
            state: '下线',
            scope: '厂商',
            remark: '下线',
            time: '2015-12-07 22:19:09'
          }, {
            name: '空气净化器',
            rule: '设备上线',
            level: 3,
            content: '设备上线了',
            state: '上线',
            scope: '厂商',
            remark: '上线',
            time: '2015-12-07 15:42:09'
          }, {
            name: '空气净化器',
            rule: '定时模式开启',
            level: 3,
            content: '已开启定时模式',
            state: '10',
            scope: '厂商',
            remark: '提示',
            time: '2015-12-06 16:33:32'
          }, {
            name: '空气净化器',
            rule: '滤芯检测异常',
            level: 2,
            content: '滤芯检测异常，已连续使用30天',
            state: '30',
            scope: '厂商',
            remark: '1',
            time: '2015-12-06 11:31:01'
          }, {
            name: '空气净化器',
            rule: '设备初始化',
            level: 3,
            content: '设备已被初始化',
            state: 'reset',
            scope: '厂商',
            remark: '2',
            time: '2015-12-05 9:21:03'
          }, {
            name: '空气净化器',
            rule: '设备离线',
            level: 3,
            content: '设备下线了',
            state: '下线',
            scope: '厂商',
            remark: '下线',
            time: '2015-12-04 12:57:09'
          }, {
            name: '空气净化器',
            rule: '设备上线',
            level: 3,
            content: '设备上线了',
            state: '上线',
            scope: '厂商',
            remark: '上线',
            time: '2015-12-04 15:56:09'
          }, {
            name: '空气净化器',
            rule: '设备离线',
            level: 3,
            content: '设备下线了',
            state: '下线',
            scope: '厂商',
            remark: '下线',
            time: '2015-12-04 15:42:09'
          }, {
            name: '空气净化器',
            rule: '开启节能模式',
            level: 3,
            content: '设备已开启节能模式',
            state: 'power',
            scope: '用户',
            remark: 'power',
            time: '2015-12-04 15:35:09'
          }, {
            name: '空气净化器',
            rule: '设备上线',
            level: 3,
            content: '设备上线了',
            state: '上线',
            scope: '厂商',
            remark: '上线',
            time: '2015-12-04 12:12:09'
          }]
        }
      }
    },

    methods: {
      showInfo: function (info) {
        this.model = info;
        this.showModal = true;
      },

      getAlarmTrends: function () {
        var self = this;

        return api.corp.refreshToken().then(function () {
          return api.statistics.getAlarmTrend(self.product_id);
        });
      },

      drawTrendsChart: function () {
        var self = this;
        var dates = this.filteredAlarmTrends.map(function (item) {
          return item.day;
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
            data:['告警数量']
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
            name: '告警数量',
            type: 'line',
            data: self.filteredAlarmTrends
          }]
        };
        var trendChart = echarts.init(document.getElementById('trendChart'));
        trendChart.setOption(trendOptions);
        window.onresize = trendChart.resize;
      }
      /*
      drawTrendsChart: function () {
        var self = this;
        var today = new Date();
        var past = today.getTime() - this.period * 24 * 3600 * 1000;
        var start_day = dateFormat('yyyy-MM-dd', new Date(past));
        var end_day = dateFormat('yyyy-MM-dd', today);

        api.corp.refreshToken().then(function () {
          api.statistics.getAlarmTrend(self.product_id, start_day, end_day).then(function (data) {
            var dates = data.map(function (item) {
              return dateFormat('MM-dd', new Date(item.day));
            });
            var alarmTrends = data.map(function (item) {
              return item.count;
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
                data:['告警数量']
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
                name: '告警数量',
                type: 'line',
                data: alarmTrends
              }]
            };
            var trendChart = echarts.init(document.getElementById('trendChart'));
            trendChart.setOption(trendOptions);
            window.onresize = trendChart.resize;
          });
        });
      }*/
    }

  };
</script>
