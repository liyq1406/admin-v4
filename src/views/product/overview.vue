<template lang="jade">
div
  .row
    .col-20
      // Start: 产品简介
      .panel
        .product-card
          .thumb
            img(src="../../assets/images/device_thumb.png")
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
                label.btn.btn-primary.btn-upload(:class="{'disabled':importing}")
                  input(type="file", v-el:mac-file, name="macFile", @change.prevent="batchImport")
                  i.fa.fa-reply-all
                  | {{importing ? '处理中...' : '导入设备'}}
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
          #trendChart(style="height:320px", v-if="trends.length")
          .trend-null(v-else) 暂无数据
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
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit", hook="editFormHook")
        .form-row
          label.form-control 产品名称：
          .controls
            .input-text-wrap(v-placeholder="'请输入产品名称'")
              input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.name.$pristine")
              span(v-if="editValidation.name.$error.required") 请输入产品名称
            .form-tips.form-tips-error(v-if="editValidation.name.$dirty")
              span(v-if="editValidation.name.$error.required") 请输入产品名称
              span(v-if="editValidation.name.$error.maxlength") 产品名称最大不能超过32位
        .form-row
          label.form-control 产品描述：
          .controls
            .input-text-wrap(v-placeholder="'请输入产品描述'")
              textarea.input-text(v-model="editModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required, lazy)
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
                option(v-for="type in deviceTypes", :value="$index+1", :selected="$index===0") {{type}}
        .form-row.without-label
          .controls
            .checkbox-group
              label.checkbox
                input(type="checkbox", name="is_registerable", v-model="editModel.is_registerable")
                | 允许用户注册设备
        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | 删除产品
          label.del-check
            input(type="checkbox", name="is_release", v-model="editModel.is_release")
            | 发布产品
          button.btn.btn-default(@click.prevent.stop="onEditCancel") 取消
          button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? '处理中...' : '确定'")

  // 添加设备浮层
  modal(:show.sync="showAddModal")
    h3(slot="header") 添加设备
    .form(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFormHook")
        .form-row
          label.form-control MAC地址：
          .controls
            .input-text-wrap(v-placeholder="'请输入MAC地址'")
              input.input-text(v-model="addModel.mac", type="text", v-form-ctrl, name="mac", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.mac.$pristine")
              span(v-if="addValidation.mac.$error.required") 请输入MAC地址
            .form-tips.form-tips-error(v-if="addValidation.mac.$dirty")
              span(v-if="addValidation.mac.$error.required") 请输入MAC地址
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onAddCancel") 取消
          button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? '处理中...' : '确定'")

  modal(:show.sync="showKeyModal")
    h3(slot="header") 产品密钥
    .product-key.tac(slot="body") {{productKey}}
</template>

<script>
  var RadioGroup = require('../../components/radio-group.vue');
  var Modal = require('../../components/modal.vue');
  var productsStore = require('../../stores/products');
  var api = require('../../api');
  var _ = require('lodash');
  var dateFormat = require('date-format');
  var echarts = require('echarts/echarts');
  require('echarts/chart/line');
  require('echarts/chart/map');
  var ecConfig = require('echarts/config');
  var config = require('../../consts/config');

  module.exports = {
    name: 'Overview',

    components: {
      'radio-group': RadioGroup,
      'modal': Modal
    },

    props: {
      products: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },

    data: function () {
      return {
        deviceTypes: config.deviceTypes,
        product: {},
        trends: [],
        productSummary: {
          online: 0,
          activated: 0,
          total: 0
        },
        period: 7,
        periods: config.periods,
        region: 'world',
        regions: config.regions,
        showEditModal: false,
        showAddModal: false,
        showKeyModal: false,
        editModel: {},
        addModel: {
          mac: ''
        },
        originAddModel: {},
        originEditModel: {},
        editValidation: {},
        addValidation: {},
        delChecked: false,
        productKey: '',
        adding: false,
        editing: false,
        importing: false
        // trendChart: {},
        // regionChart: {}
      };
    },

    ready: function () {
      this.getProductTrends();
      this.getProductRegion();
    },

    route: {
      data: function () {
        this.originAddModel = _.clone(this.addModel);
        this.getProductTrends();
        this.getProductRegion();

        return {
          productSummary: this.getSummary(),
          product: this.getProduct()
        };
      }
    },

    methods: {
      // 获取当前产品
      getProduct: function () {
        var self = this;
        return api.corp.refreshToken(this).then(function () {
          return api.product.getProduct(self.$route.params.id);
        });
      },

      // 获取产品统计信息
      getSummary: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.statistics.getProductSummary(self.$route.params.id);
        });
      },

      // 获取产品趋势
      getProductTrends: function () {
        var self = this;
        var today = new Date();
        var past = today.getTime() - this.period * 24 * 3600 * 1000;
        var start_day = dateFormat('yyyy-MM-dd', new Date(past));
        var end_day = dateFormat('yyyy-MM-dd', today);

        api.corp.refreshToken().then(function () {
          api.statistics.getProductTrend(self.$route.params.id, start_day, end_day).then(function (data) {
            self.trends = data;
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
                data: ['活跃设备', '激活设备']
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

      // 获取产品区域
      getProductRegion: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.statistics.getProductRegion(self.$route.params.id).then(function (data) {
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

              regionOptions = {
                tooltip: {
                  trigger: 'item',
                  formatter: function (params) {
                    var value = (params.value + '').split('.');
                    if (value[0] === '-') {
                      value = 0;
                    }
                    return '设备数<br/>' + params.name + ': ' + value;
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
                    return '设备数<br/>' + params.name + ': ' + value;
                  }
                },
                legend: {
                  orient: 'vertical',
                  x: 'right',
                  data: ['设备数']
                },
                dataRange: {
                  min: 0,
                  max: chinaMax,
                  color: ['orange', 'yellow'],
                  text: ['高', '低'],           // 文本，默认为数值文本
                  calculable: true
                },
                series: [{
                  name: '设备数',
                  type: 'map',
                  mapType: 'china',
                  selectedMode: 'single',
                  roam: 'move',
                  itemStyle: {
                    normal: {label: {show: true}},
                    emphasis: {label: {show: true}}
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
      },

      // 查看产品密钥
      showProductKey: function () {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.product.getProductKey(self.$route.params.id).then(function (data) {
            self.productKey = data.key;
            self.showKeyModal = true;
          }).catch(function (error) {
            self.handleError(error);
          });
        });
      },

      setRegion: function (value) {
        this.region = value;
        if (__DEBUG__) {
          console.log('region: ' + this.region);
        }
      },

      // 添加表单钩子
      addFormHook: function (form) {
        this.addForm = form;
      },

      // 编辑表单钩子
      editFormHook: function (form) {
        this.editForm = form;
      },

      // 关闭添加浮层并净化添加表单
      resetAdd: function () {
        var self = this;
        this.adding = false;
        this.showAddModal = false;
        this.addModel = _.clone(this.originAddModel);
        this.$nextTick(function () {
          self.addForm.setPristine();
        });
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit: function () {
        this.editing = false;
        this.showEditModal = false;
        this.delChecked = false;
        this.editModel = this.originEditModel;
      },

      // 取消添加
      onAddCancel: function () {
        this.resetAdd();
      },

      // 添加操作
      onAddSubmit: function () {
        var self = this;
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true;
          api.corp.refreshToken().then(function () {
            api.device.add(self.$route.params.id, self.addModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.getSummary().then(function (data) {
                self.productSummary = data;
              });
              self.resetAdd();
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      // 初始化产品编辑表单
      editProduct: function () {
        this.showEditModal = true;
        this.editModel = _.clone(this.product);
        this.originEditModel = _.clone(this.product);
      },

      // 取消编辑
      onEditCancel: function () {
        this.resetEdit();
        // this.product = this.originEditModel;
      },

      // 提交更新
      onEditSubmit: function () {
        var self = this;

        if (this.delChecked && !this.editing) {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.product.deleteProduct(self.$route.params.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.resetEdit();
              productsStore.deleteProduct(self.product);
              self.$route.router.go('/');
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        } else if (this.editValidation.$valid && !this.editing) {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.product.updateProduct(self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.getProduct().then(function (data) {
                self.product = data;
              });
              self.resetEdit();
              self.$dispatch('edit-product-name');
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        }
      },

      // 批量导入
      batchImport: function () {
        var self = this;
        var file = this.$els.macFile.files[0];
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new FileReader();
          if (!/text\/\w+/.test(file.type)) {
            alert(file.name + '不是文本文件不能上传');
            return false;
          }
          reader.onerror = function (evt) {
            alert('文件读取失败。');
          };
          this.importing = true;
          // 读取完成
          reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
              var macArr = evt.target.result.replace(' ', '').replace(/\r\n/g, '\n').split('\n');
              var a = [];
              macArr.forEach(function (element, index) {
                if (element !== '') {
                  a.push(element);
                }
              });
              macArr = a;
              api.corp.refreshToken().then(function () {
                api.device.batchImport(self.$route.params.id, macArr).then(function (status) {
                  if (status === 200) {
                    alert('设备导入成功!');
                  }
                  self.getSummary().then(function (data) {
                    self.productSummary = data;
                  });
                  self.importing = false;
                }).catch(function (error) {
                  self.handleError(error);
                  self.importing = false;
                });
              });
            }
          };
          reader.readAsText(file);
        } else {
          alert('您的浏览器过于低级，不支持 HTML5 上传');
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
        min-height 30px

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
        vertical-align middle

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

  .trend-null
    height 300px
    line-height 320px
    text-align center
    background #FFF
    margin-bottom 20px
</style>
