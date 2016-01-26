<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        radio-group(:items="periods", :value.sync="period")
          span.label(slot="label") {{ $t("common.recent") }}
        h2 {{ $t("alert.service") }}
      .panel-bd
        .row
          .col-13
            #trendChart(style="height:320px;")
          .col-7
            .statistics-info
              .item
                .cont
                  .num {{alertSummary.device}}
                  .label {{ $t("alert.statistic.device") }}
              .item
                .cont
                  .num {{alertSummary.message}}
                  .label {{ $t("alert.statistic.message") }}
              .item.no-border
                .cont
                  .num {{alertSummary.unread}}
                  .label {{ $t("alert.statistic.unread") }}
              .item.no-border
                .cont
                  .num {{alertSummary.add_today}}
                  .label {{ $t("alert.statistic.add_today") }}

    .panel
      .panel-hd
        h2 {{ $t("alert.info") }}
      .panel-bd
        //- 数据
        table.table.table-stripe.table-bordered
          thead
            tr
              th {{ $t("alert.info_list.product_name") }}
              th {{ $t("alert.info_list.content") }}
              th {{ $t("alert.info_list.create_date") }}
              th {{ $t("alert.info_list.is_read") }}
              th.tac {{ $t("common.action") }}
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
                  span.hl-gray(v-if="alert.is_read") {{ $t("common.read") }}
                  span(v-else) {{ $t("common.unread") }}
                td.tac
                  button.btn.btn-link.btn-sm(@click="showAlert(alert)") {{ $t("common.details") }}
            tr(v-if="loadingData")
              td.tac(colspan="5")
                .tips-null
                  i.fa.fa-refresh.fa-spin
                  span {{ $t("common.data_loading") }}
            tr(v-if="alerts.length === 0 && !loadingData")
              td.tac(colspan="5")
                .tips-null
                  span {{ $t("common.no_records") }}
        pager(v-if="!loadingData", :total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getAlerts")

  // 查看告警信息浮层
  modal(:show.sync="showModal")
    h3(slot="header") {{ $t("alert.info") }}
    //- 数据
    table.table.table-stripe.table-bordered(slot="body")
      tbody
        tr
          td {{ $t("alert.info_list.product_name") }}
          td {{model.product_name}}
        tr
          td {{ $t("alert.info_list.alert_name") }}
          td {{model.alert_name}}
        tr
          td {{ $t("alert.info_list.content") }}
          td {{model.content}}
        tr
          td {{ $t("alert.info_list.tags") }}
          td
            template(v-if="model.tags")
              span.text-label(v-for="tag in model.tags | toTags", :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}") {{tag}}
        tr
          td {{ $t("alert.info_list.type") }}
          td
            span {{ infoTypes[model.type - 1] }}
        tr
          td {{ $t("alert.info_list.notify_type") }}
          td
            span {{ alertTypes[model.notify_type - 1] }}
        tr
          td {{ $t("alert.info_list.alert_value") }}
          td {{model.alert_value}}
        tr
          td {{ $t("alert.info_list.from") }}
          td {{model.from}}
        tr
          td {{ $t("alert.info_list.to") }}
          td {{model.to}}
        tr
          td {{ $t("alert.info_list.create_date") }}
          td {{model.create_date | formatDate}}
    .modal-footer(slot="footer")
      button.btn.btn-primary(@click.prevent.stop="showModal = false") {{ $t("common.ok") }}
</template>

<script>
  var Vue = require('vue');
  var api = require('../../api');
  var locales = require('../../consts/locales');
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
        periods: locales[Vue.config.lang].periods,
        product_id: '',
        alertTypes: locales[Vue.config.lang].alertTypes,
        infoTypes: locales[Vue.config.lang].infoTypes,
        alertSummary: {
          unread: 0,
          add_today: 0,
          device: 0,
          message: 0
        },
        alertTrends: [],
        today: dateFormat('yyyy-MM-dd', new Date()),
        loadingData: false
      };
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
                data: [self.$t('alert.counts')]
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
                name: self.$t('alert.counts'),
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
