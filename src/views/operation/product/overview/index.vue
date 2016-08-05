<template>
  <div class="main">
    <panel>
      <div class="product-card">
        <div class="thumb"><img :src="deviceThumb"/></div>
        <div class="info">
          <h2>{{ currentProduct.name }} <a href="#" @click.prevent="editProduct" class="fa fa-edit"></a></h2>
          <div class="desc">{{ currentProduct.description }}</div>

          <!-- Start: 产品信息统计 -->
          <div class="row">
            <div class="col-6">
              <statistic :total="statistic.devices.sum.total" :change="statistic.devices.sum.change" title="设备总数" tooltip="设备总数说明" color="gray" :has-chart="true" align="left" :titletop="true">
                <interval-icon color="gray" :height="22"></interval-icon>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="statistic.devices.activated.total" :change="statistic.devices.activated.change" title="激活设备数" tooltip="激活设备总数说明" color="green" :has-chart="true" align="left" :titletop="true">
                <interval-icon color="green" :height="22"></interval-icon>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="statistic.devices.online.total" :change="statistic.devices.online.change" title="在线设备数" tooltip="在线设备总数说明" color="blue" :has-chart="true" :titletop="true">
                <interval-icon color="blue" :height="22"></interval-icon>
              </statistic>
            </div>
            <div class="col-6">
              <statistic :total="statistic.users.total" :change="statistic.users.change" title="用户总数" tooltip="用户总数说明" color="orange" :has-chart="true" :titletop="true">
                <interval-icon color="orange" :height="22"></interval-icon>
              </statistic>
            </div>
          </div>
          <!-- End: 产品信息统计 -->
        </div>
      </div>
    </panel>

    <product-trend></product-trend>
    <product-active></product-active>
    <product-distribution></product-distribution>

    <!-- 编辑产品浮层-->
    <modal :show.sync="showEditModal">
      <h3 slot="header">{{ $t("ui.overview.editForm.header") }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.product.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.product.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel.name" type="text" v-form-ctrl name="name" maxlength="32" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.name')}) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.product.fields.name'), 32]) }}</span><span v-if="editValidation.name.$error.customValidator">{{ $t('ui.validation.format', {field: $t('ui.product.fields.name')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.product.fields.desc") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.product.placeholders.desc')" class="input-text-wrap">
                <textarea v-model="editModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted && editValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.desc')}) }}</span></div>
              <div v-if="editValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.desc')}) }}</span><span v-if="editValidation.description.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.product.fields.desc'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.product.fields.link_type") }}:</label>
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
                  <input type="checkbox" name="is_registerable" v-model="editModel.is_registerable"/>{{ $t("ui.product.fields.is_registerable") }}
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
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.overview.editForm.del") }}
            </label>
            <label class="del-check">
              <input type="checkbox" name="is_release" v-model="editModel.is_release"/>{{ $t("ui.product.fields.is_release") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
import Vue from 'vue'
import locales from 'consts/locales/index'
import api from 'api'
import store from 'store/index'
import { removeProduct, updateProduct, getCurrProduct } from 'store/actions/products'
import Select from 'components/Select'
import Modal from 'components/Modal'
import Panel from 'components/Panel'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Statistic from 'components/Statistic2'
import Tooltip from 'components/Tooltip'
import TimeLine from 'components/g2-charts/TimeLine'
import Interval from 'components/g2-charts/Interval'
import IntervalIcon from 'components/g2-charts/IntervalIcon'
import Pie from 'components/g2-charts/Pie'
import ChinaMap from 'components/g2-charts/ChinaMap'
import defaultDeviceThumb from 'assets/images/device_thumb.png'
import { globalMixins } from 'src/mixins'
import { productSummaryMixin } from '../mixins'
import _ from 'lodash'
import { createDayRange, beautify } from 'helpers/utils'
import ProductTrend from './product-trend'
import ProductActive from './product-active'
import ProductDistribution from './product-distribution'

export default {
  name: 'Overview',

  layouts: ['topbar', 'sidebar'],

  mixins: [globalMixins, productSummaryMixin],

  store,

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    },
    actions: {
      removeProduct,
      updateProduct,
      getCurrProduct
    }
  },

  components: {
    Modal,
    Panel,
    RadioButtonGroup,
    Statistic,
    Tooltip,
    TimeLine,
    Interval,
    IntervalIcon,
    ChinaMap,
    Pie,
    ProductTrend,
    ProductActive,
    ProductDistribution,
    'v-select': Select
  },

  data () {
    return {
      deviceThumb: defaultDeviceThumb,
      trendTabs: {
        curr: 0,
        labels: ['激活设备', '累计激活']
      },
      customMargin: [30, 10, 30, 30],
      deviceTypes: locales[Vue.config.lang].data.DEVICE_TYPES,
      delChecked: false,
      // product: {},
      showEditModal: false,
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
      originEditModel: {},
      editValidation: {},
      // 统计
      statistic: {
        // 用户总数
        users: {
          options: {},
          total: 0,
          change: 0,
          data: []
        },
        // 设备
        devices: {
          // 总数
          sum: {
            options: {},
            total: 0,
            change: 0,
            data: []
          },
          // 激活设备
          activated: {
            options: {},
            total: 0,
            change: 0,
            data: []
          },
          // 在线设备
          online: {
            options: {},
            total: 0,
            change: 0,
            data: []
          }
        }
      }
    }
  },

  route: {
    data () {
      this.getCurrProduct(this.$route.params.id)
      // this.getActivatedTrends(1)

      // getProductSummary 方法来自 productSummaryMixin
      this.getProductSummary()
    }
  },

  computed: {

  },

  ready () {
  },

  methods: {
    /**
     * 获取产品激活趋势
     * @param  {Number} type 类型
     */
    getActivatedTrends (type) {
      this.trendTabs.curr = type - 1
      let range = createDayRange(0, this.trends.activated.period)
      api.statistics.getProductTrend(this.$route.params.id, range.start, range.end).then((res) => {
        if (res.status === 200) {
          let trendData = beautify(res.data, this.trends.activated.period)
          this.trends.activated.data = trendData.map((item) => {
            return {
              date: item.day,
              count: item.activated,
              product: this.currentProduct.name
            }
          })
        }
      })
    },

    // 获取当前产品
    // getProduct () {
    //   api.product.getProduct(this.$route.params.id).then((res) => {
    //     if (res.status === 200) {
    //       this.product = res.data
    //     }
    //   }).catch((res) => {
    //     this.handleError(res)
    //   })
    // },

    // 编辑表单钩子
    editFormHook (form) {
      this.editForm = form
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

    // 初始化产品编辑表单
    editProduct () {
      api.snapshot.getRule(this.$route.params.id).then((res) => {
        // console.log(res.data.list[0] && res.data.list[0].rule)
        this.showEditModal = true
        // this.editModel = _.clone(this.product)
        this.editModel.ifsnapshot = false
        this.editModel.name = this.currentProduct.name
        this.editModel.description = this.currentProduct.description
        this.editModel.link_type = this.currentProduct.link_type
        this.editModel.is_registerable = this.currentProduct.is_registerable
        this.editModel.is_active_register = this.currentProduct.is_active_register
        this.editModel.is_release = this.currentProduct.is_release
        this.editModel.id = this.$route.params.id
        this.editModel.is_allow_multi_admin = this.currentProduct.is_allow_multi_admin
        this.originEditModel = _.clone(this.editModel)

        // TODO: 优化逻辑
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
              this.removeProduct(this.currentProduct)
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
                // this.product = res.data
                this.resetEdit()
                this.updateProduct(res.data)
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
                // this.product = res.data
                this.resetEdit()
                this.updateProduct(res.data)
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
                console.log('Update rule')
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
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.product-card
  clearfix()
  padding-top 15px

  .x-statistic
    padding 5px 0
    margin-right 30px

    & > .info
      font-size 36px
      margin 7px 0

    & > .change
      top 5px

    .chart
      size 85px 20px

  .col-6 + .col-6
    .x-statistic
      &:after
        left -30px

  .thumb
    float left
    size 200px

    img
      size 200px
      display block

  .info
    margin-left 240px

    h2
      margin 10px 0 0
      font-size 16px
      font-weight normal

      .fa
        margin-left 5px

    .desc
      min-height 20px
      margin-bottom 15px
      font-size 12px
      color gray-light

// 产品趋势
.product-trends
  .stats
    width 400px

.products-trends-head
  line-height 28px
  display inline-block
  text-align right

/*.changetop
  .change
    top -55px!important  */
</style>
