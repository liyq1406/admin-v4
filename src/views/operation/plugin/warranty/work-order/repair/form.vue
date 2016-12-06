<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ mainTitle }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16 alert-max form">
            <validator name="validation">
              <form autocomplete="off" @submit.prevent="onSubmit">
                <!-- 序列号 -->
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.sn') }}:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('operation.warranty.repair_form.placeholders.sn')" class="input-text-wrap">
                      <input v-model="model.product_sn" type="text" name="model.product_sn" v-validate:productsn="{required: true, minlength: 2, maxlength: 32}" lazy class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.productsn.touched && $validation.productsn.required">{{ $t('common.validation.required', {field: $t('operation.warranty.repair_form.fields.sn')}) }}</span>
                      <span v-if="$validation.productsn.touched && $validation.productsn.minlength">{{ $t('common.validation.minlength', [$t('operation.warranty.repair_form.fields.sn'), 2]) }}</span>
                      <span v-if="$validation.productsn.touched && $validation.productsn.maxlength">{{ $t('common.validation.maxlength', [$t('operation.warranty.repair_form.fields.sn'), 32]) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 产品 -->
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.select_product') }}:</label>
                  <div class="controls col-19">
                    <x-select v-if="products.length" :label="selectedProduct.name" :width="'120px'">
                      <select v-model="selectedProduct">
                        <option v-for="product in products" :value="product">{{ product.name }}</option>
                      </select>
                    </x-select>
                    <div v-else class="non-tip">{{ $t('operation.warranty.repair_form.no_product') }}</div>
                  </div>
                </div>

                <!-- 维修类型 -->
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.type') }}:</label>
                  <div class="controls col-19">
                    <x-select v-if="types.length" :label="selectedType" :width="'120px'">
                      <select v-model="selectedType">
                        <option v-for="type in types" :value="type">{{ type }}</option>
                      </select>
                    </x-select>
                    <div v-else class="non-tip">{{ $t('operation.warranty.repair_form.no_type') }}</div>
                  </div>
                </div>

                <!-- 维修内容 -->
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.instructions') }}:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('operation.warranty.repair_form.placeholders.instructions')" class="input-text-wrap">
                      <input v-length-tip="{max: 32, model:model.instructions }" v-model="model.instructions" type="text" name="instructions" v-validate:instructions="{required: true, maxlength: 32}" lazy required class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.instructions.touched && $validation.instructions.required">{{ $t('common.validation.required', {field: $t('operation.warranty.repair_form.fields.instructions')}) }}</span>
                      <span v-if="$validation.instructions.touched && $validation.instructions.maxlength">{{ $t('common.validation.maxlength', [$t('operation.warranty.repair_form.fields.instructions'), 32]) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 维修说明 -->
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.remark') }}:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('operation.warranty.repair_form.placeholders.remark')" class="input-text-wrap">
                      <textarea v-length-tip="{max: 240, model:model.remark }" v-model="model.remark" type="text" v-validate:remark="{required: true, maxlength: 240}" name="remark" lazy required class="input-text"></textarea>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.remark.touched && $validation.remark.required">{{ $t('common.validation.required', {field: $t('operation.warranty.repair_form.fields.remark')}) }}</span>
                      <span v-if="$validation.remark.touched && $validation.remark.maxlength">{{ $t('common.validation.maxlength', [$t('operation.warranty.repair_form.fields.remark'), 240]) }}</span>
                    </div>
                  </div>
                </div>

                <!-- 维修照片 -->
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.image') }}:</label>
                  <div class="controls col-19">
                    <image-uploader :images="images"></image-uploader>
                  </div>
                </div>

                <!-- 网点 -->
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.branch_select') }}:</label>
                  <div class="controls col-19">
                    <x-select v-if="branches.length" :label="selectedBranch.name" :width="'120px'">
                      <select v-model="selectedBranch" @change="getBranchStaffsList">
                        <option v-for="branch in branches" :value="branch">{{ branch.name }}</option>
                      </select>
                    </x-select>
                    <div v-else class="non-tip">{{ $t('operation.warranty.repair_form.no_branch') }}</div>
                  </div>
                </div>

                <!-- 处理人员 -->
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.staff') }}:</label>
                  <div class="controls col-19">
                    <x-select v-if="staffs.length" :label="selectedStarff.name" :width="'120px'">
                      <select v-model="selectedStarff">
                        <option v-for="staff in staffs" :value="staff">{{ staff.name }}</option>
                      </select>
                    </x-select>
                    <div v-else class="non-tip">{{ $t('operation.warranty.repair_form.no_staff') }}</div>
                  </div>
                </div>

                <div class="form-actions mt20 border-top row">
                  <div class="col-offset-5 col-19">
                    <button type="submit" :disabled="adding || !hasProduct" :class="{'disabled':adding || !hasProduct}"  class="btn btn-primary mt5 ml20 submit-btn">{{ $t('common.ok') }}</button>
                  </div>
                </div>
              </form>
            </validator>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { warrantyMixins } from '../../mixins'
import api from 'api'
import Promise from 'promise'

export default {
  name: 'RepairForm',

  mixins: [warrantyMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      token: JSON.parse(window.localStorage.pluginsToken)[this.$route.params.app_id].token,
      branches: [], // 网点列表
      staffs: [], // 维修人员列表
      images: [''], // 图片
      types: [], // 类型列表
      selectedProduct: {}, // 选中的产品
      selectedStarff: {}, // 选中的维修人员
      selectedType: '',
      model: {
        product_sn: '',
        instructions: '',
        remark: ''
      }
    }
  },

  computed: {
    // 表单数据
    formData () {
    },

    // 是否编辑表单
    isEdit () {
      return !!this.$route.params.id
    },

    // 大标题
    mainTitle () {
      let tit = this.isEdit ? 'edit_title' : 'add_title'
      return this.$t(`operation.warranty.repair_form.${tit}`)
    },

    // 面包屑
    breadcrumbNav () {
      return [{
        label: this.$t('common.all'),
        link: `/operation/plugins/warranty/${this.$route.params.app_id}/work-orders/repair`
      }, {
        label: this.mainTitle
      }]
    }
  },

  route: {
    data () {
      this.fetchData()
    }
  },

  watch: {
    products () {

    }
  },

  methods: {
    fetchData () {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      // 获取标签
      let getTags = api.warranty.getWarrantyLabel(this.$route.params.app_id)

      // 获取网点
      let params = {
        filter: ['_id', 'name'],
        limit: 100
      }
      let getBranches = api.warranty.getBranchList(this.$route.params.app_id, params)

      Promise.all([
        getTags,
        getBranches
      ]).then((res) => {
        this.types = res[0].data.label
        this.branches = res[1].data.list

        if (this.isEdit) {

        } else {
        }
      })
    },

    /**
     * 获取标签
     */
    getTags () {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      api.warranty.getWarrantyLabel(this.$route.params.app_id).then((res) => {
        this.types = res.data.label
      }).catch((res) => {
        this.handleError(res)
      })
    },

    selectProduct () {
    },

    /**
     * 处理表单提交
     */
    onSubmit () {}
  }
}
</script>

<style lang="stylus">
.non-tip
  line-height 32px
  color red
.alert-label
  line-height 32px
  padding-left 20px
  box-sizing border-box
.alert-max
  max-width 700px
.border-top
  border-top 1px solid #DDDDDD
  padding-top 20px
  margin-left -20px
.submit-btn
  width 120px
</style>
