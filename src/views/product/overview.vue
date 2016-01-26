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
                em {{ $t("overview.desc") }}:
                span {{ product.description }}
              p
                em {{ $t("overview.pid") }}:
                span {{ product.id }}
              p
                em {{ $t("overview.key") }}:
                span
                  a.hl-red(href="#", @click.prevent="showProductKey") {{ $t("overview.show_key") }}
              .actions
                button.btn.btn-primary(@click="showAddModal = true")
                  i.fa.fa-plus
                  | {{ $t("overview.add_device") }}
                label.btn.btn-primary.btn-upload(:class="{'disabled':importing}")
                  input(type="file", v-el:mac-file, name="macFile", @change.prevent="batchImport")
                  i.fa.fa-reply-all
                  | {{importing ? $t("common.handling") : $t("overview.import_devices")}}
            .col-11.status
              .status-item
                em {{productSummary.online}}
                span {{ $t("overview.statistic.online") }}
              .status-item
                em {{productSummary.activated}}
                span {{ $t("overview.statistic.activated") }}
              .status-item
                em {{productSummary.total}}
                span {{ $t("overview.statistic.total") }}
      // Start: 产品简介

  .row
    .col-10
      // Start: 趋势
      .panel
        .panel-hd
          radio-group(:items="periods", :value.sync="period", @select="getProductTrends")
            span.label(slot="label") {{ $t("common.recent")}}
          h2 {{ $t("overview.trends")}}
        .panel-bd
          #trendChart(style="height:320px", v-if="trends.length")
          .trend-null(v-else) {{ $t("common.no_data")}}
      // End: 趋势

    .col-10
      // Start: 设备分布
      .panel
        .panel-hd
          radio-group(:items="regions", :value.sync="region", @select="getProductRegion")
          h2 {{ $t("overview.regions")}}
        .panel-bd
          #regionChart(style="height:320px; overflow:hidden;")
      // End: 设备分布

  modal(:show.sync="showEditModal")
    h3(slot="header") {{ $t("overview.editForm.header")}}
    .form(slot="body")
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit", hook="editFormHook")
        .form-row
          label.form-control {{ $t("product.fields.name")}}:
          .controls
            .input-text-wrap(v-placeholder="$t('product.placeholders.name')")
              input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", maxlength="32", required, custom-validator="noSpacesPrefixAndSuffix", lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.name.$pristine")
              span(v-if="editValidation.name.$error.required") {{ $t('validation.required', {field: $t('product.fields.name')}) }}
            .form-tips.form-tips-error(v-if="editValidation.name.$dirty")
              span(v-if="editValidation.name.$error.required") {{ $t('validation.required', {field: $t('product.fields.name')}) }}
              span(v-if="editValidation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('product.fields.name'), 32]) }}
              span(v-if="editValidation.name.$error.customValidator") {{ $t('validation.format', {field: $t('product.fields.name')}) }}
        .form-row
          label.form-control {{ $t("product.fields.desc")}}:
          .controls
            .input-text-wrap(v-placeholder="$t('product.placeholders.desc')")
              textarea.input-text(v-model="editModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required, lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.description.$pristine")
              span(v-if="editValidation.description.$error.required") {{ $t('validation.required', {field: $t('product.fields.desc')}) }}
            .form-tips.form-tips-error(v-if="editValidation.description.$dirty")
              span(v-if="editValidation.description.$error.required") {{ $t('validation.required', {field: $t('product.fields.desc')}) }}
              span(v-if="editValidation.description.$error.maxlength") {{ $t('validation.maxlength', [ $t('product.fields.desc'), 250]) }}
        .form-row
          label.form-control {{ $t("product.fields.link_type")}}:
          .controls
            .select
              select(v-model="editModel.link_type", v-form-ctrl, name="link_type")
                option(v-for="type in deviceTypes", :value="$index+1", :selected="$index===0") {{type}}
        .form-row.without-label
          .controls
            .checkbox-group
              label.checkbox
                input(type="checkbox", name="is_registerable", v-model="editModel.is_registerable")
                | {{ $t("product.fields.is_registerable")}}
        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | {{ $t("overview.editForm.del")}}
          label.del-check
            input(type="checkbox", name="is_release", v-model="editModel.is_release")
            | {{ $t("product.fields.is_release")}}
          button.btn.btn-default(@click.prevent.stop="onEditCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")

  // 添加设备浮层
  modal(:show.sync="showAddModal")
    h3(slot="header") {{ $t("overview.add_device")}}
    .form(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFormHook")
        .form-row
          label.form-control {{ $t("overview.addForm.mac")}}:
          .controls
            .input-text-wrap(v-placeholder="$t('overview.addForm.mac_placeholder')")
              input.input-text(v-model="addModel.mac", type="text", v-form-ctrl, name="mac", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.mac.$pristine")
              span(v-if="addValidation.mac.$error.required") {{ $t('validation.required', {field: $t('overview.addForm.mac')}) }}
            .form-tips.form-tips-error(v-if="addValidation.mac.$dirty")
              span(v-if="addValidation.mac.$error.required") {{ $t('validation.required', {field: $t('overview.addForm.mac')}) }}
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onAddCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? $t('common.handling') : $t('common.ok')")

  modal(:show.sync="showKeyModal")
    h3(slot="header") {{ $t("overview.key")}}
    .product-key.tac(slot="body") {{productKey}}
</template>

<script>
  var Vue = require('vue');
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
  var locales = require('../../consts/locales');

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
        deviceTypes: locales[Vue.config.lang].deviceTypes,
        product: {},
        trends: [],
        productSummary: {
          online: 0,
          activated: 0,
          total: 0
        },
        period: 7,
        periods: locales[Vue.config.lang].periods,
        region: 'world',
        regions: locales[Vue.config.lang].regions,
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
                data: [self.$t('overview.active_devices'), self.$t('overview.activated_devices')]
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
                name: self.$t('overview.active_devices'),
                type: 'line',
                data: activeTrends
              }, {
                name: self.$t('overview.activated_devices'),
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
                    return self.$t('overview.statistic.total') + '<br/>' + params.name + ': ' + value;
                  }
                },
                dataRange: {
                  min: 0,
                  max: worldMax,
                  text: [self.$t('common.high'), self.$t('common.low')],
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
              var mapType = locales[Vue.config.lang].mapType;

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
                    return self.$t('overview.statistic.total') + '<br/>' + params.name + ': ' + value;
                  }
                },
                legend: {
                  orient: 'vertical',
                  x: 'right',
                  data: [self.$t('overview.statistic.total')]
                },
                dataRange: {
                  min: 0,
                  max: chinaMax,
                  color: ['orange', 'yellow'],
                  text: [self.$t('common.high'), self.$t('common.low')],           // 文本，默认为数值文本
                  calculable: true
                },
                series: [{
                  name: self.$t('overview.statistic.total'),
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
            alert(file.name + self.$t('upload.type_tips'));
            return false;
          }
          reader.onerror = function (evt) {
            alert(self.$t('upload.read_err'));
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
                    alert(self.$t('upload.success_msg'));
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
          alert(self.$t('upload.compatiblity'));
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
