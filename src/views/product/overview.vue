<template lang="jade">
  div
    .row
      .col-20
        // Start: 产品简介
        .panel
          .product-card
            .thumb
              img(src="../../assets/images/dummies/180x180.png")
            .info
              .col-9.summary
                h3
                  | {{ product.name }}
                  a.fa.fa-edit(href="#", @click.prevent="editProduct")
                p
                  em 产品描述：
                  span {{ product.description }}
                p
                  em 产品PID：
                  span {{ product.id }}
                p
                  em 产品密钥：
                  span
                    a.hl-red(href="#", @click.prevent="showProductKey") 查看密钥
                .actions
                  button.btn.btn-primary(@click="showAddModal = true")
                    i.fa.fa-plus
                    | 添加设备
                  a.btn.btn-primary(href="#")
                    i.fa.fa-reply-all
                    | 导入设备
              .col-11.status
                .status-item
                  em {{productSummary.online}}
                  span 当前在线
                .status-item
                  em {{productSummary.activated}}
                  span 激活数
                .status-item
                  em {{productSummary.total}}
                  span 设备数
        // Start: 产品简介

    .row
      .col-10
        // Start: 趋势
        .panel
          .panel-hd
            radio-group(:items="periods", :value.sync="period", @select="getProductTrends")
              span.label(slot="label") 最近
            h2 趋势
          .panel-bd
            #trendChart(style="height:300px")
            pre {{productTrends | json}}
        // End: 趋势

      .col-10
        // Start: 设备分布
        .panel
          .panel-hd
            radio-group(:items="regions", :value.sync="region", @select="getProductRegion")
            h2 设备分布
          .panel-bd
            #regionChart(style="width:100%; height:300px")
            pre {{productRegion | json}}
        // End: 设备分布

    modal(:show.sync="showEditModal")
      h3(slot="header") 编辑产品
      .form(slot="body")
        form(v-form, name="editValidation", @submit.prevent="onEditSubmit")
          .form-row
            label.form-control 产品名称：
            .controls
              .input-text-wrap(v-placeholder="'请输入产品名称'")
                input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", maxlength="32", required)
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.name.$pristine")
                span(v-if="editValidation.name.$error.required") 请输入产品名称
              .form-tips.form-tips-error(v-if="editValidation.name.$dirty")
                span(v-if="editValidation.name.$error.required") 请输入产品名称
                span(v-if="editValidation.name.$error.maxlength") 产品名称最大不能超过32位
          .form-row
            label.form-control 产品描述：
            .controls
              .input-text-wrap(v-placeholder="'请输入产品描述'")
                textarea.input-text(v-model="editModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required)
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.description.$pristine")
                span(v-if="editValidation.description.$error.required") 请输入产品描述
              .form-tips.form-tips-error(v-if="editValidation.description.$dirty")
                span(v-if="editValidation.description.$error.required") 请输入产品描述
                span(v-if="editValidation.description.$error.maxlength") 产品描述最大不能超过250字
          .form-row
            label.form-control 设备类型：
            .controls
              .select
                select(v-model="editModel.link_type", v-form-ctrl, name="link_type")
                  option(value="1", selected) wifi设备
                  option(value="2") Zigbee网关
                  option(value="3") 蓝牙设备
          .form-actions
            label.del-check
              input(type="checkbox", name="del", v-model="delChecked")
              | 删除产品
            button.btn.btn-default(@click.prevent.stop="onEditCancel") 取消
            button.btn.btn-primary(type="submit") 确定

    modal(:show.sync="showAddModal")
      h3(slot="header") 添加设备
      .form(slot="body")
        form(v-form, name="addValidation", @submit.prevent="onAddSubmit", v-el="addForm")
          .form-row
            label.form-control MAC地址：
            .controls
              .input-text-wrap(v-placeholder="'请输入MAC地址'")
                input.input-text(v-model="addModel.mac", type="text", v-form-ctrl, name="mac", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.mac.$pristine")
                span(v-if="addValidation.mac.$error.required") 请输入MAC地址
              .form-tips.form-tips-error(v-if="addValidation.mac.$dirty")
                span(v-if="addValidation.mac.$error.required") 请输入MAC地址
          .form-actions
            button.btn.btn-default(@click.prevent.stop="onAddCancel") 取消
            button.btn.btn-primary(type="submit") 确定

    modal(:show.sync="showKeyModal")
      h3(slot="header") 产品密钥
      .product-key.tac(slot="body") {{productKey}}
</template>

<script>
  var RadioGroup = require('../../components/radio-group.vue');
  var Select = require('../../components/select.vue');
  var Modal = require('../../components/modal.vue');
  var productsStore = require('../../stores/products');
  var api = require('../../api');
  var _ = require('lodash');
  var dateFormat = require('date-format');
  var echarts = require('echarts/echarts');
  require('echarts/chart/line');
  // require('echarts/chart/wordCloud');
  // var regionChart = echarts.init(document.getElementById('regionChart'));

  module.exports = {
    components: {
      'radio-group': RadioGroup,
      'modal': Modal
    },

    props: {
      product: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },

    data: function () {
      return {
        productSummary: {
          online: 0,
          activated: 0,
          total: 0
        },
        productTrends: [],
        productRegion: {},
        period: 7,
        periods: [
          { label: '7天', value: 7 },
          { label: '30天', value: 30 },
          { label: '90天', value: 90 }
        ],
        region: 'global',
        regions: [
          { label: '全球', value: 'global'},
          { label: '国内', value: 'domestic' }
        ],
        showEditModal: false,
        showAddModal: false,
        showKeyModal: false,
        editModel: {},
        addModel: {},
        originModel: {},
        editValidation: {},
        addValidation: {},
        delChecked: false,
        productKey: ''
        // trendChart: {},
        // regionChart: {}
      }
    },

    computed: {
      trendLabels: function () {
        var gap = Math.floor(this.period / 6);
        var labels = [];
        var getPast = function (gap) {
          var today = new Date();
          var past = new Date(today.getTime() - gap * 24 * 3600 * 1000);
          return dateFormat('MM/dd', past);
        };

        for(var i=6; i>=0; i--) {
          labels.push(getPast(gap * i));
        }

        return labels;
      }
    },

    ready: function () {
      this.getProductTrends();
    },

    route: {
      data: function () {
        this.getProductTrends();
        this.getProductRegion();

        return {
          productSummary: this.getSummary()
        };
      }
    },

    methods: {
      getSummary: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.statistics.getProductSummary(self.$route.params.id);
        });
      },

      getProductTrends: function () {
        var self = this;
        var today = new Date();
        var past = today.getTime() - this.period * 24 * 3600 * 1000;
        var start_day = dateFormat('yyyy-MM-dd', new Date(past));
        var end_day = dateFormat('yyyy-MM-dd', today);

        // return [{start_day:start_day, end_day:end_day, period:this.period}];

        api.corp.refreshToken().then(function () {
          api.statistics.getProductTrend(self.$route.params.id, start_day, end_day).then(function (data) {
            var option;
            self.productTrends = data;

            // 假数据
            var activatedDevices = [{
              "day":"2015-12-04",
              "activated":2005,
              "active":1599,
              "send_times":20991,
              "send_bytes":350189,
              "recv_times":15990,
              "recv_bytes":248796
            }];

            // 趋势图表
            var trendOptions = {
              tooltip : {
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
                data:['活跃设备', '激活设备']
              },
              calculable : true,
              xAxis: [{
                type: 'category',
                boundaryGap: false,
                data: self.trendLabels
              }],
              yAxis: [{
                type: 'value'
              }],
              series: [{
                name: '活跃设备',
                type: 'line',
                data: [12099,13299,10199,13499,9099,23990,21990]
              }, {
                name: '激活设备',
                type: 'line',
                data: [22099,20099,23199,9099,24409,28990,26990]
              }]
            };
            // this.productTrends
            var trendChart = echarts.init(document.getElementById('trendChart'));
            trendChart.setOption(trendOptions);
            // option = {
              // series: data
            // };
            // trendChart.setOption(option);
          });
        });

      },

      getProductRegion: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.statistics.getProductRegion(self.$route.params.id).then(function (data) {
            self.productRegion = data;
          });
        });
      },

      showProductKey: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.product.getProductKey(self.$route.params.id).then(function (data) {
            self.productKey = data.key;
            self.showKeyModal = true;
          });
        });
      },

      setRegion: function (value) {
        this.region = value;
        console.log("region: " + this.region);
      },

      editProduct: function () {
        this.showEditModal = true;
        this.editModel = this.product;
        this.originModel = _.clone(this.product);
      },

      onEditCancel: function () {
        this.showEditModal = false;
        this.editModel = {};
        this.product = this.originModel;
      },

      onEditSubmit: function () {
        var self = this;

        if (this.delChecked) {
          api.corp.refreshToken().then(function () {
            api.product.deleteProduct(self.$route.params.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.showEditModal = false;
              productsStore.deleteProduct(self.product);
              self.$route.router.go('/');
            });
          });
        } else if (this.editValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.product.updateProduct(self.$route.params.id, self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.showEditModal = false;
            });
          });
        }
      },

      onAddCancel: function () {
        this.showAddModal = false;
      },

      onAddSubmit: function () {
        var self = this;
        if (this.addValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.device.add(self.$route.params.id, self.addModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.addModel = {};
              self.showAddModal = false;
            }).catch(function (error) {
              console.log(error);
            });
          });
        }
      }
    }
  };
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'

  .product-card
    clearfix()
    padding 40px 0

    .thumb
      float left
      size 180px

      img
        size 180px
        display block

    .info
      margin-left 210px

    .summary
      h3
        margin 0 0 15px
        font-size 20px

        .fa
          margin-left 5px

      p
        margin 0
        line-height 28px

        em
          display inline-block
          font-style normal
          width 72px

    .actions
      margin-top 15px

      .btn
        margin-right 10px

    .status
      clearfix()
      text-align right
      margin-top 50px

      .status-item
        float left
        width 30.33%
        border-left 1px solid #E4E4E4
        box-sizing border-box
        margin-left 3%

        &:first-child
          border none

        em
        span
          display block
          padding-right 10px

        em
          font-style normal
          font-size 35px
          color red

  .product-key
    font-size 20px
</style>
