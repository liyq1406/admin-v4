<template lang="jade">
  div
    .row
      .col-20
        // Start: 产品简介
        .panel
          .product-card
            .thumb
              img(src="../../assets/images/dummies/thumb.jpg")
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
                  button.btn.btn-primary.btn-upload
                    input(type="file", v-el:mac-file, name="macFile", @change.prevent="batchImport")
                    i.fa.fa-reply-all
                    | 导入设备
              .col-11.status
                .status-item
                  em {{* productSummary.online}}
                  span 当前在线
                .status-item
                  em {{* productSummary.activated}}
                  span 激活数
                .status-item
                  em {{* productSummary.total}}
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
            #trendChart(style="height:320px")
        // End: 趋势

      .col-10
        // Start: 设备分布
        .panel
          .panel-hd
            radio-group(:items="regions", :value.sync="region", @select="getProductRegion")
            h2 设备分布
          .panel-bd
            #regionChart(style="height:320px; overflow:hidden;")
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
  require('echarts/chart/map');
  var ecConfig = require('echarts/config');

  module.exports = {
    components: {
      'radio-group': RadioGroup,
      'modal': Modal
    },

    data: function () {
      return {
        product: {},
        productSummary: {
          online: 0,
          activated: 0,
          total: 0
        },
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
        showEditModal: false,
        showAddModal: false,
        showKeyModal: false,
        editModel: {},
        addModel: {},
        originModel: {},
        editValidation: {},
        addValidation: {},
        delChecked: false,
        productKey: '',
        adding: false,
        editing: false
        // trendChart: {},
        // regionChart: {}
      }
    },

    ready: function () {
      // this.getProductTrends();
      // this.getProductRegion();
    },

    route: {
      data: function () {
        this.getProductTrends();
        this.getProductRegion();

        return {
          productSummary: this.getSummary(),
          product: this.getProduct()
        };
      }
    },

    methods: {
      getProduct: function () {
        var self = this;
        return api.corp.refreshToken(this).then(function () {
          return api.product.getProduct(self.$route.params.id);
        });
      },

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

        api.corp.refreshToken().then(function () {
          api.statistics.getProductTrend(self.$route.params.id, start_day, end_day).then(function (data) {
            var dates = data.map(function (item) {
              return dateFormat('MM-dd', new Date(item.day));
            });
            var activatedTrends = data.map(function (item) {
              return item.activated;
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
                data:['活跃设备', '激活设备']
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
          });
        });

      },

      getProductRegion: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.statistics.getProductRegion(self.$route.params.id).then(function (data) {
            var regionOptions;
            var regionChart = echarts.init(document.getElementById('regionChart'));
            if (self.region === 'world') {
              var worldData = [];
              var worldMax = 0;
              for(var country in data) {
                worldData.push({
                  name: country,
                  value: data[country].activated
                });

                if (data[country].activated > worldMax) {
                  worldMax = data[country].activated;
                }
              }

              regionOptions = {
                tooltip: {
                  trigger: 'item',
                  formatter: function (params) {
                    var value = (params.value + '').split('.');
                    if (value[0] === '-') {
                      value = 0
                    }
                    return '设备数<br/>' + params.name + ': ' + value;
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
                if (province !== 'activated') {
                  chinaData.push({
                    name: province,
                    value: data['China'][province].activated
                  });

                  for(var city in data['China'][province]) {
                    if (city != 'activated') {
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
                    return '设备数<br/>' + params.name + ': ' + value;
                  }
                },
                legend: {
                  orient: 'vertical',
                  x:'right',
                  data:['设备数']
                },
                dataRange: {
                  min: 0,
                  max: chinaMax,
                  color:['orange','yellow'],
                  text:['高','低'],           // 文本，默认为数值文本
                  calculable: true
                },
                series: [{
                  name: '设备数',
                  type: 'map',
                  mapType: 'china',
                  selectedMode: 'single',
                  roam: 'move',
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
            api.product.updateProduct(self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.showEditModal = false;
            });
          });
        }
      },

      onAddCancel: function () {
        this.adding = false;
        this.showAddModal = false;
      },

      onAddSubmit: function () {
        var self = this;
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true;
          api.corp.refreshToken().then(function () {
            api.device.add(self.$route.params.id, self.addModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.addModel = {};
              self.showAddModal = false;
              self.adding = false;
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      batchImport: function () {
        var self = this;
        var file = this.$els.macFile.files[0];
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new FileReader();
          if(!/text\/\w+/.test(file.type)){
            alert(file.name + '不是文本文件不能上传');
            return false;
          }
          reader.onerror = function (evt) {
            alert('文件读取失败。')
          }
          // 读取完成
          reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
              var macArr = evt.target.result.split('\n');
              console.log(macArr);
              api.corp.refreshToken().then(function () {
                api.device.batchImport(self.$route.params.id, macArr).then(function (status) {
                  if (status === 200) {
                    alert('设备导入成功!')
                  }
                }).catch(function (error) {
                  self.handleError(error);
                });
              });
            }
          };
          reader.readAsText(file);
        } else {
          alert('您的浏览器过于低级，不支持 HTML5 上传');
        }
      },

      handleError: function (error) {
        if (__DEBUG__) {
          console.log(error);
        }

        if (error.code === 4001001) {
          alert('Mac地址不合法');
        } else if (error.code === 4001021) {
          alert('该设备 MAC 地址已存在');
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
