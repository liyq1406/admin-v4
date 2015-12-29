<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          radio-group(:items="periods", :value.sync="period")
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
                    .num {{alertSummary.device}}
                    .label 告警设备
                .item
                  .cont
                    .num {{alertSummary.message}}
                    .label 告警消息
                .item.no-border
                  .cont
                    .num {{alertSummary.unread}}
                    .label 未读消息
                .item.no-border
                  .cont
                    .num {{alertSummary.add_today}}
                    .label 今日新增

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
              template(v-if="alerts.length > 0 && !loadingData")
                tr(v-for="alert in alerts")
                  td {{alert.product_name}}
                  td
                    template(v-if="alert.tags")
                      span.text-label(v-for="tag in alert.tags | toTags", :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}") {{tag}}
                    | {{alert.content}}
                  td {{alert.create_date | formatDate}}
                  td
                    span.hl-gray(v-if="alert.is_read") 已读
                    span(v-else) 未读
                  td.tac
                    button.btn.btn-link.btn-sm(@click="showAlert(alert)") 查看
              tr(v-if="loadingData")
                td.tac(colspan="5")
                  .tips-null
                    i.fa.fa-refresh.fa-spin
                    span 数据加载中...
              tr(v-if="alerts.length === 0 && !loadingData")
                td.tac(colspan="5")
                  .tips-null
                    span 暂无数据记录
          pager(v-if="!loadingData", :total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getAlerts")

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
    name: 'Alerts',

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
        alertSummary: {
          unread: 0,
          add_today: 0,
          device: 0,
          message: 0
        },
        alertTrends: [],
        today: dateFormat('yyyy-MM-dd', new Date()),
        loadingData: false
      }
    },

    computed: {
      queryCondition: function () {
        return {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount
        };
      },

      past: function () {
        var past = new Date().getTime() - this.period * 24 * 3600 * 1000;
        return dateFormat('yyyy-MM-dd', new Date(past));
      }
    },

    filters: {
      toTags: function (value) {
        return value.length ? value.split(',') : [];
      }
    },

    ready: function () {
      this.drawTrendsChart();
      // var self = this;
      // this.getAlertSummary();
    },

    route: {
      data: function () {
        this.getAlerts();
        this.getAlertSummary();
        this.drawTrendsChart();
      }
    },

    // 监听属性变动
    watch: {
      period: function () {
        this.getAlertSummary();
        this.drawTrendsChart();
      }
    },

    methods: {
      /**
       * 获取单条告警信息并弹出浮层显示
       * @param  {Object} alert 目标告警信息
       */
      showAlert: function (alert) {
        var self = this;
        this.model = alert;
        this.showModal = true;
        api.corp.refreshToken().then(function () {
          api.alert.setAlertRead([alert.id]).then(function () {
            alert.is_read = true;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      /**
       * 获取告警信息列表
       */
      getAlerts: function () {
        var self = this;

        this.loadingData = true;
        api.corp.refreshToken().then(function () {
          api.alert.getAlerts(self.queryCondition).then(function (data) {
            self.alerts = data.list;
            self.total = data.count;
            self.loadingData = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingData = false;
          });
        });
      },

      // 告警统计信息
      getAlertSummary: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.statistics.getAlertSummary(self.past, self.today).then(function (data) {
            self.alertSummary = data;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      // 趋势图表
      drawTrendsChart: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.statistics.getAlertTrend(self.past, self.today).then(function (data) {
            var dates = data.map(function (item) {
              return dateFormat('MM-dd', new Date(item.day));
            });
            var alertCounts = data.map(function (item) {
              return item.message;
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
                data: alertCounts
              }]
            };
            var trendChart = echarts.init(document.getElementById('trendChart'));
            trendChart.setOption(trendOptions);
            window.onresize = trendChart.resize;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      }
    }
  };
</script>
