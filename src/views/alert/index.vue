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
                th 是否已读
                th.tac 操作
            tbody
              tr(v-for="alert in alerts")
                td {{alert.product_name}}
                td
                  template(v-if="alert.tags")
                    span.text-label(v-for="tag in alert.tags | toTags", :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}") {{tag}}
                  | {{alert.content}}
                td {{alert.create_date}}
                td
                  span.hl-gray(v-if="alert.is_read") 已读
                  span(v-else) 未读
                td.tac
                  button.btn.btn-link.btn-sm(@click="showAlert(alert)") 查看
              tr(v-if="alerts.length === 0")
                td.tac(colspan="5")
                  i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                  .tips-null(v-else) 暂无数据记录
          pager(:total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getAlerts")

    // 查看告警信息浮层
    modal(:show.sync="showModal")
      h3(slot="header") 告警信息
      //- 数据
      table.table.table-stripe.table-bordered(slot="body")
        tbody
          tr
            td 产品名称
            td {{model.product_name}}
          tr
            td 告警名称
            td {{model.alert_name}}
          tr
            td 告警内容
            td {{model.content}}
          tr
            td 标签
            td
              template(v-if="model.tags")
                span.text-label(v-for="tag in model.tags | toTags", :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}") {{tag}}
          tr
            td 消息类型
            td
              span(v-if="model.type === 1") 通知与预警
          tr
            td 通知类型
            td
              span(v-if="model.notify_type === 1") 通知类型
              span(v-if="model.notify_type === 2") 告警类型
          tr
            td 告警状态值
            td {{model.alert_value}}
          tr
            td 消息发送者
            td {{model.from}}
          tr
            td 消息接受者
            td {{model.to}}
          tr
            td 上报时间
            td {{model.create_date}}
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
        alerts: [],
        total: 0,
        pageCount: 10,
        currentPage: 1,
        showModal: false,
        model: {
          id: '',
          type: 1,
          product_name: '',
          alert_name: '',
          alert_value: '',
          notify_type: 1,
          from: '',
          to: [],
          content: '',
          create_date: '',
          is_read: false,
          tags: ''
        },
        period: 7,
        periods: [
          { label: '7天', value: 7 },
          { label: '30天', value: 30 },
          { label: '90天', value: 90 }
        ],
        product_id: '',
        alertTrends: []
      }
    },

    computed: {
      queryCondition: function () {
        return {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount
        };
      }
    },

    filters: {
      toTags: function (value) {
        return value.length ? value.split(',') : [];
      }
    },

    ready: function () {
      // this.drawTrendsChart()
      var self = this;
      this.getAlarmTrends().then(function (data) {
        self.alertTrends = data;
        self.drawTrendsChart();
      });
    },

    route: {
      data: function () {
        this.getAlerts();
      }
    },

    methods: {
      showAlert: function (alert) {
        this.model = alert;
        this.showModal = true;
        api.corp.refreshToken().then(function () {
          api.alert.setAlertRead([alert.id]).then(function () {
            alert.is_read = true;
          });
        });
      },

      getAlerts: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.alert.getAlerts(self.queryCondition).then(function (data) {
            self.alerts = data.list;
            self.total = data.count;
          });
        });
      },

      getAlarmTrends: function () {
        var self = this;

        return api.corp.refreshToken().then(function () {
          return api.statistics.getAlarmTrend(self.product_id);
        });
      },

      drawTrendsChart: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.statistics.getAlarmTrend(self.product_id).then(function (data) {
            var dates = data.map(function (item) {
              return dateFormat('MM-dd', new Date(item.day));
            });
            var countTrends = data.map(function (item) {
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
                data: countTrends
              }]
            };
            var trendChart = echarts.init(document.getElementById('trendChart'));
            trendChart.setOption(trendOptions);
            window.onresize = trendChart.resize;
          });
        });
      }
    }
  };
</script>
