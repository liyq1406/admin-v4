<template>
  <div>
    <div class="row">
      <div class="col-24">
        <!-- Start: 产品简介-->
        <div class="panel">
          <div class="product-card">
            <div class="thumb"><img src="../../assets/images/device_thumb.png"/></div>
            <div class="info">
              <div class="col-11 summary">
                <h3>{{ product.name }}<a href="#" @click.prevent="editProduct" class="fa fa-edit"></a></h3>
                <p><em>{{ $t("overview.desc") }}:</em><span>{{ product.description }}</span></p>
                <p><em>{{ $t("overview.pid") }}:</em><span>{{ product.id }}</span></p>
                <p><em>{{ $t("overview.key") }}:</em><span><a href="#" @click.prevent="showProductKey" class="hl-red">{{ $t("overview.show_key") }}</a></span></p>
                <div class="actions">
                  <button @click="showAddModal = true" class="btn btn-primary"><i class="fa fa-plus"></i>{{ $t("overview.add_device") }}</button>
                  <label :class="{'disabled':importing}" class="btn btn-primary btn-upload">
                    <input type="file" v-el:mac-file="v-el:mac-file" name="macFile" @change.prevent="batchImport"/><i class="fa fa-reply-all"></i>{{ importing ? $t("common.handling") : $t("overview.import_devices") }}
                  </label>
                </div>
              </div>
              <div class="col-13">
                <div class="row status">
                  <div class="col-7">
                    <div class="status-item">
                      <em>{{ productSummary.online }}</em>
                      <span>{{ $t("overview.statistic.online") }}</span>
                    </div>
                  </div>
                  <div class="col-8">
                    <div class="status-item">
                      <em>{{ productSummary.activated }}</em>
                      <span>{{ $t("overview.statistic.activated") }}</span>
                    </div>
                  </div>
                  <div class="col-9">
                    <div class="status-item">
                      <em>{{ productSummary.total }}</em>
                      <span>{{ $t("overview.statistic.total") }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Start: 产品简介-->
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <!-- Start: 趋势-->
        <div class="panel">
          <div class="panel-hd">
            <radio-group :items="periods" :value.sync="period" @select="getProductTrends"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
            <h2>{{ $t("overview.trends") }}</h2>
          </div>
          <div class="panel-bd">
            <div id="trendChart" style="height:320px"></div>
          </div>
        </div>
        <!-- End: 趋势-->
      </div>
      <div class="col-12">
        <!-- Start: 设备分布-->
        <div class="panel">
          <div class="panel-hd">
            <radio-group :items="regions" :value.sync="region" @select="getProductRegion"></radio-group>
            <h2>{{ $t("overview.regions") }}</h2>
          </div>
          <div class="panel-bd">
            <div id="regionChart" style="height:320px; overflow:hidden;"></div>
          </div>
        </div>
        <!-- End: 设备分布-->
      </div>
    </div>
    <modal :show.sync="showEditModal">
      <h3 slot="header">{{ $t("overview.editForm.header") }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row">
            <label class="form-control">{{ $t("product.fields.name") }}:</label>
            <div class="controls">
              <div v-placeholder="$t('product.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel.name" type="text" v-form-ctrl name="name" maxlength="32" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('product.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('product.fields.name')}) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('product.fields.name'), 32]) }}</span><span v-if="editValidation.name.$error.customValidator">{{ $t('validation.format', {field: $t('product.fields.name')}) }}</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("product.fields.desc") }}:</label>
            <div class="controls">
              <div v-placeholder="$t('product.placeholders.desc')" class="input-text-wrap">
                <textarea v-model="editModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted && editValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('validation.required', {field: $t('product.fields.desc')}) }}</span></div>
              <div v-if="editValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('validation.required', {field: $t('product.fields.desc')}) }}</span><span v-if="editValidation.description.$error.maxlength">{{ $t('validation.maxlength', [ $t('product.fields.desc'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("product.fields.link_type") }}:</label>
            <div class="controls">
              <div class="select">
                <v-select :label="deviceTypes[editModel.link_type-1]">
                  <select v-model="editModel.link_type" v-form-ctrl name="link_type">
                    <option v-for="type in deviceTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row without-label">
            <div class="controls">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_registerable" v-model="editModel.is_registerable"/>{{ $t("product.fields.is_registerable") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row without-label" v-show="editModel.link_type===5">
            <div class="controls">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_active_register" v-model="editModel.is_active_register"/>允许动态注册设备
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("overview.editForm.del") }}
            </label>
            <label class="del-check">
              <input type="checkbox" name="is_release" v-model="editModel.is_release"/>{{ $t("product.fields.is_release") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 添加设备浮层-->
    <modal :show.sync="showAddModal">
      <h3 slot="header">{{ $t("overview.add_device") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row">
            <label class="form-control">{{ $t("overview.addForm.mac") }}:</label>
            <div class="controls">
              <div v-placeholder="$t('overview.addForm.mac_placeholder')" class="input-text-wrap">
                <input v-model="addModel.mac" type="text" v-form-ctrl name="mac" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.mac.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.mac.$error.required">{{ $t('validation.required', {field: $t('overview.addForm.mac')}) }}</span></div>
              <div v-if="addValidation.mac.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.mac.$error.required">{{ $t('validation.required', {field: $t('overview.addForm.mac')}) }}</span></div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <modal :show.sync="showKeyModal">
      <h3 slot="header">{{ $t("overview.key") }}</h3>
      <div slot="body" class="product-key tac">{{ productKey }}</div>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import RadioGroup from '../../components/RadioGroup'
  import Modal from '../../components/Modal'
  import Select from '../../components/Select'
  import api from '../../api'
  import _ from 'lodash'
  import dateFormat from 'date-format'
  import echarts from 'echarts/echarts'
  require('echarts/chart/line')
  require('echarts/chart/map')
  import ecConfig from 'echarts/config'
  import locales from '../../consts/locales/index'
  import store from '../../store/index'
  import { removeProduct, updateProduct, setCurrProduct } from '../../store/actions/products'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Overview',

    layout: 'admin',

    mixins: [globalMixins],

    store,

    vuex: {
      actions: {
        removeProduct,
        updateProduct,
        setCurrProduct
      }
    },

    components: {
      'radio-group': RadioGroup,
      'modal': Modal,
      'v-select': Select
    },

    data () {
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
      }
    },

    ready () {
      this.getProductTrends()
      this.getProductRegion()
    },

    route: {
      data () {
        this.originAddModel = _.clone(this.addModel)
        this.getProductTrends()
        this.getProductRegion()
        this.getSummary()
        this.getProduct()
      }
    },

    methods: {
      // 获取当前产品
      getProduct () {
        api.product.getProduct(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.product = res.data
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      // 获取产品统计信息
      getSummary () {
        api.statistics.getProductSummary(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.productSummary = res.data
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      // 获取产品趋势
      getProductTrends () {
        var today = new Date()
        var past = today.getTime() - this.period * 24 * 3600 * 1000
        var start_day = dateFormat('yyyy-MM-dd', new Date(past))
        var end_day = dateFormat('yyyy-MM-dd', today)

        api.statistics.getProductTrend(this.$route.params.id, start_day, end_day).then((res) => {
          this.trends = res.data
          var dates = res.data.map((item) => {
            return dateFormat('MM-dd', new Date(item.day))
          })
          var activatedTrends = res.data.map((item) => {
            return item.activated
          })
          var activeTrends = res.data.map((item) => {
            return item.active
          })

          // 趋势图表
          var trendOptions = {
            noDataLoadingOption: {
              text: this.$t('common.no_data'),
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
              data: [this.$t('overview.active_devices'), this.$t('overview.activated_devices')]
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
              name: this.$t('overview.active_devices'),
              type: 'line',
              data: activeTrends
            }, {
              name: this.$t('overview.activated_devices'),
              type: 'line',
              data: activatedTrends
            }]
          }
          var trendChart = echarts.init(document.getElementById('trendChart'))
          trendChart.setOption(trendOptions)
          window.onresize = trendChart.resize
        }).catch((res) => {
          this.handleError(res)
        })
      },

      // 获取产品区域
      getProductRegion () {
        var self = this
        api.statistics.getProductRegion(this.$route.params.id).then((res) => {
          var regionOptions
          var regionChart = echarts.init(document.getElementById('regionChart'))
          if (this.region === 'world') {
            var worldData = []
            var worldMax = 0
            for (var country in res.data) {
              worldData.push({
                name: country,
                value: res.data[country].activated
              })

              if (res.data[country].activated > worldMax) {
                worldMax = res.data[country].activated
              }
            }

            regionOptions = {
              tooltip: {
                trigger: 'item',
                formatter (params) {
                  var value = (params.value + '').split('.')
                  if (value[0] === '-') {
                    value = 0
                  }
                  return self.$t('overview.statistic.total') + '<br/>' + params.name + ': ' + value
                }
              },
              dataRange: {
                min: 0,
                max: worldMax,
                text: [this.$t('common.high'), this.$t('common.low')],
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
            }
            regionChart.setOption(regionOptions)
          } else {
            var curIndx = 0
            var option
            var mapType = locales[Vue.config.lang].mapType

            var chinaData = []
            var chinaMax = 0
            for (var province in res.data['China']) {
              if (province !== 'activated') {
                chinaData.push({
                  name: province,
                  value: res.data['China'][province].activated
                })

                for (var city in res.data['China'][province]) {
                  if (city !== 'activated') {
                    chinaData.push({
                      name: city,
                      value: res.data['China'][province][city].activated
                    })
                  }

                  if (res.data['China'][province][city].activated > chinaMax) {
                    chinaMax = res.data['China'][province][city].activated
                  }
                }
              }

              if (res.data['China'][province].activated > chinaMax) {
                chinaMax = res.data['China'][province].activated
              }
            }

            regionChart.on(ecConfig.EVENT.MAP_SELECTED, (param) => {
              var len = mapType.length
              var mt = mapType[curIndx % len]
              if (mt === 'china') {
                // 全国选择时指定到选中的省份
                var selected = param.selected
                for (var i in selected) {
                  if (selected[i]) {
                    mt = i
                    while (len--) {
                      if (mapType[len] === mt) {
                        curIndx = len
                      }
                    }
                    break
                  }
                }
              } else {
                curIndx = 0
                mt = 'china'
              }
              option.series[0].mapType = mt
              regionChart.setOption(option, true)
            })
            option = {
              tooltip: {
                trigger: 'item',
                formatter (params) {
                  var value = (params.value + '').split('.')
                  if (value[0] === '-') {
                    value = 0
                  }
                  return self.$t('overview.statistic.total') + '<br/>' + params.name + ': ' + value
                }
              },
              legend: {
                orient: 'vertical',
                x: 'right',
                data: [this.$t('overview.statistic.total')]
              },
              dataRange: {
                min: 0,
                max: chinaMax,
                color: ['orange', 'yellow'],
                text: [this.$t('common.high'), this.$t('common.low')],           // 文本，默认为数值文本
                calculable: true
              },
              series: [{
                name: this.$t('overview.statistic.total'),
                type: 'map',
                mapType: 'china',
                selectedMode: 'single',
                roam: 'move',
                itemStyle: {
                  normal: { label: { show: true } },
                  emphasis: { label: { show: true } }
                },
                nameMap: require('../../consts/china-names'),
                data: chinaData
              }]
            }
            regionChart.setOption(option, true)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      // 查看产品密钥
      showProductKey () {
        api.product.getProductKey(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.productKey = res.data.key
            this.showKeyModal = true
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      setRegion (value) {
        this.region = value
      },

      // 添加表单钩子
      addFormHook (form) {
        this.addForm = form
      },

      // 编辑表单钩子
      editFormHook (form) {
        this.editForm = form
      },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.showEditModal = false
        this.delChecked = false
        this.editModel = this.originEditModel
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      // 添加操作
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true

          api.device.add(this.$route.params.id, this.addModel).then(() => {
            api.statistics.getProductSummary(this.$route.params.id).then((res) => {
              if (res.status === 200) {
                this.productSummary = res.data
              }
              this.resetAdd()
            })
          }).catch((res) => {
            this.handleError(res)
            this.resetAdd()
          })
        }
      },

      // 初始化产品编辑表单
      editProduct () {
        this.showEditModal = true
        this.editModel = _.clone(this.product)
        this.originEditModel = _.clone(this.product)
      },

      // 取消编辑
      onEditCancel () {
        this.resetEdit()
        // this.product = this.originEditModel
      },

      // 提交更新
      onEditSubmit () {
        if (this.delChecked && !this.editing) {
          this.editing = true
          api.product.deleteProduct(this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.removeProduct(this.product)
              this.$route.router.go('/dashboard')
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (this.editValidation.$valid && !this.editing) {
          this.editing = true
          if (this.editModel.link_type === 5) {
            api.product.updateProduct(this.editModel).then(() => {
              api.product.getProduct(this.$route.params.id).then((res) => {
                if (res.status === 200) {
                  this.product = res.data
                  this.resetEdit()
                  this.updateProduct(this.product)
                  this.setCurrProduct(this.product)
                }
              })
            }).catch((res) => {
              this.handleError(res)
              this.editing = false
            })
          } else {
            var model = {
              name: this.editModel.name,
              description: this.editModel.description,
              link_type: this.editModel.link_type,
              is_registerable: this.editModel.is_registerable,
              is_release: this.editModel.is_release,
              id: this.editModel.id
            }
            api.product.updateProduct(model).then(() => {
              api.product.getProduct(this.$route.params.id).then((res) => {
                if (res.status === 200) {
                  this.product = res.data
                  this.resetEdit()
                  this.updateProduct(this.product)
                  this.setCurrProduct(this.product)
                }
              })
            }).catch((res) => {
              this.handleError(res)
              this.editing = false
            })
          }
        }
      },

      // 批量导入
      batchImport () {
        var file = this.$els.macFile.files[0]
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          if (!/text\/\w+/.test(file.type)) {
            this.showNotice({
              type: 'error',
              content: file.name + this.$t('upload.type_tips')
            })
            return false
          }
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('upload.read_err')
            })
          }
          this.importing = true
          // 读取完成
          reader.onloadend = (evt) => {
            if (evt.target.readyState === window.FileReader.DONE) {
              var macArr = evt.target.result.replace(' ', '').replace(/\r\n/g, '\n').split('\n')
              var a = []
              macArr.forEach((element, index) => {
                if (element !== '') {
                  a.push(element)
                }
              })
              macArr = a
              api.device.batchImport(this.$route.params.id, macArr).then((res) => {
                if (res.status === 200) {
                  this.showNotice({
                    type: 'success',
                    content: this.$t('upload.success_msg')
                  })
                }
                this.getSummary().then((res) => {
                  if (res.status === 200) {
                    this.productSummary = res.data
                  }
                })
                this.importing = false
              }).catch((res) => {
                this.handleError(res)
                this.importing = false
              })
            }
          }
          reader.readAsText(file)
        } else {
          this.showNotice({
            type: 'error',
            content: this.$t('upload.compatiblity')
          })
        }
      }
    }
  }
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
        border-left 1px solid #E4E4E4
        box-sizing border-box
        margin-left 10px

        em
        span
          display block

        em
          font-style normal
          font-size 32px
          color red

      :first-child
        .status-item
          border none
          margin-left 0

  .product-key
    font-size 20px

  .trend-null
    height 300px
    line-height 320px
    text-align center
    background #FFF
    margin-bottom 20px
</style>
