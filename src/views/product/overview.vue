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
          <div class="panel-bd with-loading">
            <line-chart :series="productTrendSeries" :x-axis-data="productXAxisData" v-ref:trend-chart></line-chart>
            <div class="icon-loading" v-show="loadingProductTrends">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
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
          <div class="panel-bd with-loading">
            <map-chart :type="region" v-ref:region-chart :series-data="regionsData"></map-chart>
            <div class="icon-loading" v-show="loadingProductRegions">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
          </div>
        </div>
        <!-- End: 设备分布-->
      </div>
    </div>
    <!-- 编辑产品浮层-->
    <modal :show.sync="showEditModal">
      <h3 slot="header">{{ $t("overview.editForm.header") }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("product.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('product.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel.name" type="text" v-form-ctrl name="name" maxlength="32" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('product.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('product.fields.name')}) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('product.fields.name'), 32]) }}</span><span v-if="editValidation.name.$error.customValidator">{{ $t('validation.format', {field: $t('product.fields.name')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("product.fields.desc") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('product.placeholders.desc')" class="input-text-wrap">
                <textarea v-model="editModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted && editValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('validation.required', {field: $t('product.fields.desc')}) }}</span></div>
              <div v-if="editValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('validation.required', {field: $t('product.fields.desc')}) }}</span><span v-if="editValidation.description.$error.maxlength">{{ $t('validation.maxlength', [ $t('product.fields.desc'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("product.fields.link_type") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :label="deviceTypes[editModel.link_type-1]">
                  <select v-model="editModel.link_type" v-form-ctrl name="link_type">
                    <option v-for="type in deviceTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_registerable" v-model="editModel.is_registerable"/>{{ $t("product.fields.is_registerable") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row" v-show="editModel.link_type===5">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_active_register" v-model="editModel.is_active_register"/>允许动态注册设备
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="ifsnapshot" v-model="editModel.ifsnapshot"/>开启快照功能
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_allow_multi_admin" v-model="editModel.is_allow_multi_admin"/>允许设备多个管理员
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
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("overview.addForm.mac") }}:</label>
            <div class="controls col-18">
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
  import LineChart from '../../components/charts/Line'
  import MapChart from '../../components/charts/Map'
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
      'v-select': Select,
      'line-chart': LineChart,
      'map-chart': MapChart
    },

    data () {
      return {
        deviceTypes: locales[Vue.config.lang].deviceTypes,
        product: {},
        // trends: [],
        productSummary: {
          online: 0,
          activated: 0,
          total: 0
        },
        period: 7,
        periods: locales[Vue.config.lang].periods,
        region: 'world',
        regions: locales[Vue.config.lang].regions,
        productTrends: [],
        regionsData: [],
        loadingProductTrends: false,
        loadingProductRegions: false,
        showEditModal: false,
        showAddModal: false,
        showKeyModal: false,
        editModel: {
          is_allow_multi_admin: false,
          ifsnapshot: false,
          name: '',
          description: '',
          link_type: '',
          is_registerable: false,
          is_active_register: false,
          is_release: false,
          id: ''
        },
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

    computed: {
      // 产品趋势图表横轴数据
      productXAxisData () {
        return this._genXAxis(this.period)
      },

      // 产品趋势图表数据
      productTrendSeries () {
        var result = [{
          name: this.$t('statistic.products.active'),
          type: 'line',
          data: []
        }, {
          name: this.$t('statistic.products.activated'),
          type: 'line',
          data: []
        }]

        for (var i = 0; i < this.period; i++) {
          var index = _.findIndex(this.productTrends, (item) => {
            return item.day === this.productXAxisData[i]
          })
          result[0].data[i] = index >= 0 ? this.productTrends[index].active : 0
          result[1].data[i] = index >= 0 ? this.productTrends[index].activated : 0
        }

        return result
      }
    },

    ready () {
      this.getProductTrends()
      this.getProductRegion()

      // 监听窗口尺寸变化
      window.onresize = () => {
        this.$refs.trendChart.chart.resize()
        this.$refs.regionChart.chart.resize()
      }
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
      /**
       * 生成横轴点
       * @return {Boolean} [description]
       */
      _genXAxis (period) {
        var today = new Date()
        var result = []

        for (var i = period - 1; i >= 0; i--) {
          result[i] = dateFormat('MM-dd', new Date(today - (period - i - 1) * 24 * 3600 * 1000))
        }
        return result
      },

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

        this.loadingProductTrends = true
        api.statistics.getProductTrend(this.$route.params.id, start_day, end_day).then((res) => {
          if (res.status === 200) {
            this.productTrends = res.data.map((item) => {
              item.day = dateFormat('MM-dd', new Date(item.day))
              return item
            })
            this.loadingProductTrends = false
          }
        }).catch((res) => {
          this.loadingProductTrends = false
          this.handleError(res)
        })
      },

      /**
       * 获取产品区域分布
       */
      getProductRegion () {
        this.loadingProductRegions = true
        api.statistics.getProductRegion(this.$route.params.id).then((res) => {
          // console.log(res.data)
          var regionsData = []
          if (this.region === 'world') {
            for (var country in res.data) {
              regionsData.push({
                name: country,
                value: res.data[country].activated
              })
            }
          } else if (this.region === 'china') {
            for (var province in res.data['China']) {
              if (province !== 'activated') {
                regionsData.push({
                  name: province,
                  value: res.data['China'][province].activated
                })

                for (var city in res.data['China'][province]) {
                  if (city !== 'activated') {
                    regionsData.push({
                      name: city,
                      value: res.data['China'][province][city].activated
                    })
                  }
                }
              }
            }
          }
          this.regionsData = regionsData
          this.loadingProductRegions = false
        }).catch((res) => {
          this.loadingProductRegions = false
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
        setTimeout(() => {
          this.editModel = this.originEditModel
        }, 1000)
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
        api.snapshot.getRule(this.$route.params.id).then((res) => {
          // console.log(res.data.list[0] && res.data.list[0].rule)
          this.showEditModal = true
          // this.editModel = _.clone(this.product)
          this.editModel.ifsnapshot = false
          this.editModel.name = this.product.name
          this.editModel.description = this.product.description
          this.editModel.link_type = this.product.link_type
          this.editModel.is_registerable = this.product.is_registerable
          this.editModel.is_active_register = this.product.is_active_register
          this.editModel.is_release = this.product.is_release
          this.editModel.id = this.$route.params.id
          this.editModel.is_allow_multi_admin = this.product.is_allow_multi_admin
          this.originEditModel = _.clone(this.editModel)
          if (res.data.list.length) {
            if (res.data.list[0].rule === 0) {
              this.editModel.ifsnapshot = false
            } else {
              this.editModel.ifsnapshot = true
            }
          } else {
            this.editModel.ifsnapshot = false
          }
        })
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
          var result = window.confirm('确认删除该产品吗?')
          if (result === true) {
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
          } else {
            this.editing = false
          }
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
              is_allow_multi_admin: this.editModel.is_allow_multi_admin,
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
          if (this.editModel.ifsnapshot) {
            var index = []
            for (let i = 0; i < 45; i++) {
              index.push(i)
            }
            var params = {
              rule: 3,
              interval: 30,
              storage: {
                // limit: 0,
                expire: 86400
              },
              datapoint: index
            }
            api.snapshot.getRule(this.$route.params.id).then((res) => {
              if (res.data.list.length === 0) {
                console.log(params)
                // console.log(res)
                api.snapshot.createRule(this.$route.params.id, params).then((res) => {
                  console.log(111)
                })
              } else {
                var index = []
                for (let i = 0; i < 45; i++) {
                  index.push(i)
                }
                var newParams = {
                  _id: res.data.list[0].id,
                  rule: 3,
                  interval: 30,
                  storage: {
                    // limit: 0,
                    expire: 86400
                  },
                  datapoint: index
                }
                api.snapshot.updateRule(this.$route.params.id, newParams).then((res) => {
                  console.log(111)
                })
              }
            })
          } else {
            api.snapshot.getRule(this.$route.params.id).then((res) => {
              if (res.data.list.length === 0) {
                console.log(11)
              } else {
                var index = []
                for (let i = 0; i < 45; i++) {
                  index.push(i)
                }
                var morNewParams = {
                  _id: res.data.list[0].id,
                  rule: 0,
                  interval: 30,
                  storage: {
                    // limit: 0,
                    expire: 86400
                  },
                  datapoint: index
                }
                api.snapshot.updateRule(this.$route.params.id, morNewParams).then((res) => {
                  console.log(111)
                })
              }
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
