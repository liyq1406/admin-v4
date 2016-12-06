<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.warranty.repair_form.add_title') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16 alert-max form">
            <validator name="validation">
              <form autocomplete="off" @submit.prevent="onSubmit">
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.sn') }}:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('operation.warranty.repair_form.placeholders.sn')" class="input-text-wrap">
                      <input v-model="addModal.product_sn" type="text" name="product_sn" v-validate:productsn="{required: true, minlength: 2, maxlength: 32}" lazy required class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.productsn.touched && $validation.productsn.required">{{ $t('common.validation.required', {field: $t('operation.warranty.repair_form.fields.sn')}) }}</span>
                      <span v-if="$validation.productsn.touched && $validation.productsn.minlength">{{ $t('common.validation.minlength', [$t('operation.warranty.repair_form.fields.sn'), 2]) }}</span>
                      <span v-if="$validation.productsn.touched && $validation.productsn.maxlength">{{ $t('common.validation.maxlength', [$t('operation.warranty.repair_form.fields.sn'), 32]) }}</span>
                    </div>
                  </div>
                </div>

                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.select_product') }}:</label>
                  <div class="controls col-19">
                    <x-select  v-if="products.length" :label="selectedProduct.name" :width="'120px'">
                      <select v-model="selectedProduct">
                        <option v-for="product in products" :value="product">{{ product.name }}</option>
                      </select>
                    </x-select>
                    <div v-else class="non-tip">{{ $t('operation.warranty.repair_form.no_product') }}</div>
                  </div>
                </div>

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

                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.instructions') }}:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('operation.warranty.repair_form.placeholders.instructions')" class="input-text-wrap">
                      <input v-length-tip="{max: 32, model:addModal.instructions }" v-model="addModal.instructions" type="text" name="instructions" v-validate:instructions="{required: true, maxlength: 32}" lazy required class="input-text"/>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.instructions.touched && $validation.instructions.required">{{ $t('common.validation.required', {field: $t('operation.warranty.repair_form.fields.instructions')}) }}</span>
                      <span v-if="$validation.instructions.touched && $validation.instructions.maxlength">{{ $t('common.validation.maxlength', [$t('operation.warranty.repair_form.fields.instructions'), 32]) }}</span>
                    </div>
                  </div>
                </div>

                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.remark') }}:</label>
                  <div class="controls col-19">
                    <div v-placeholder="$t('operation.warranty.repair_form.placeholders.remark')" class="input-text-wrap">
                      <textarea v-length-tip="{max: 240, model:addModal.discription }" v-model="addModal.remark" type="text" v-validate:remark="{required: true, maxlength: 240}" name="remark" lazy required class="input-text"></textarea>
                    </div>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation.remark.touched && $validation.remark.required">{{ $t('common.validation.required', {field: $t('operation.warranty.repair_form.fields.remark')}) }}</span>
                      <span v-if="$validation.remark.touched && $validation.remark.maxlength">{{ $t('common.validation.maxlength', [$t('operation.warranty.repair_form.fields.remark'), 240]) }}</span>
                    </div>
                  </div>
                </div>

                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.image') }}:</label>
                  <div class="controls col-19">
                    <image-uploader :images="images"></image-uploader>
                  </div>
                </div>

                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.branch_select') }}:</label>
                  <div class="controls col-19">
                    <x-select v-if="branchs.length" :label="selectedBranch.name" :width="'120px'">
                      <select v-model="selectedBranch" @change="getBranchStaffsList">
                        <option v-for="branch in branchs" :value="branch">{{ branch.name }}</option>
                      </select>
                    </x-select>
                    <div v-else class="non-tip">{{ $t('operation.warranty.repair_form.no_branch') }}</div>
                  </div>
                </div>

                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.staff') }}:</label>
                  <div class="controls col-19">
                    <x-select v-if="branchStaffs.length" :label="selectedBranchStarff.name" :width="'120px'">
                      <select v-model="selectedBranchStarff">
                        <option v-for="staff in branchStaffs" :value="staff">{{ staff.name }}</option>
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

  export default {
    name: 'add-warranty',

    mixins: [warrantyMixins],

    vuex: {
      getters: {
        products: ({ products }) => products.released
      }
    },

    components: {
    },

    route: {
      data () {
        this.init()
        this.getTags()
        this.getBranchList()
      }
    },

    watch: {
      products () {
        this.init()
      },
      types () {
        this.getFirstType()
      }
    },

    data () {
      return {
        dealerID: window.localStorage.getItem('dealerId'),
        token: JSON.parse(window.localStorage.pluginsToken)[this.$route.params.app_id].token,
        adding: false,
        branchStaffs: [],
        selectedBranchStarff: {},
        branchs: [],
        selectedBranch: {},
        types: [],
        selectedType: '',
        selectedProduct: {},
        addValidation: {},
        breadcrumbNav: [{
          label: this.$t('common.all'),
          link: `/operation/plugins/warranty/${this.$route.params.app_id}/work-orders/repair`
        }, {
          label: this.$t('operation.warranty.repair_form.add_title')
        }],
        addModal: {
        },
        deviceTypes: [
          {
            label: '空气净化器',
            value: 0
          }
        ],
        images: ['']
      }
    },
    computed: {
      hasProduct () {
        var result = false
        if (this.selectedProduct.id) {
          result = true
        } else {
          result = false
        }
        return result
      }
    },
    methods: {
      init () {
        this.selectedProduct = this.products[0] || {}
        // if (this.products.length > 0) {
        //   this.getOrderWorkList()
        // }
      },
      getFirstType () {
        this.selectedType = this.types[0] || ''
      },
      // 获取标签
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
      // 获取网点列表
      getBranchList () {
        // token 不存在，无权限访问
        if (!this.token) {
          this.showNoTokenError()
          return
        }

        var params = {
          filter: ['_id', 'name'],
          limit: 100
        }
        api.warranty.getBranchList(this.$route.params.app_id, params).then((res) => {
          this.branchs = res.data.list
          this.selectedBranch = this.branchs[0] || {}
          this.getBranchStaffsList()
        }).catch((err) => {
          this.handleError(err)
        })
      },
      // 获取网点对应维修人员列表
      getBranchStaffsList () {
        // token 不存在，无权限访问
        if (!this.token) {
          this.showNoTokenError()
          return
        }

        var params = {
          filter: ['_id', 'name'],
          limit: 100,
          query: {
            branch_id: this.selectedBranch._id
          }
        }
        api.warranty.getBranchStaffsList(this.$route.params.app_id, params).then((res) => {
          this.branchStaffs = res.data.list
          this.selectedBranchStarff = this.branchStaffs[0] || {}
        }).catch((err) => {
          this.handleError(err)
        })
      },
      // addFormHook (form) {
      //   this.addModal.form = form
      // },
      // 提交添加
      onSubmit () {
        // token 不存在，无权限访问
        if (!this.token) {
          this.showNoTokenError()
          return
        }

        if (this.adding) return

        this.addModal.product_sn = this.addModal.product_sn.trim()
        this.addModal.remark = this.addModal.remark.trim()
        this.addModal.instructions = this.addModal.instructions.trim()
        if (this.$validation.invalid) {
          this.$validate(true)
          return
        }
        if (this.dealerID) {
          this.addModal.dealer_id = this.dealerID
        }
        this.addModal.heavy_buyer_id = '12312323'
        this.addModal.product_id = this.selectedProduct.id
        this.addModal.label = this.selectedType
        this.addModal.images = this.images
        this.addModal.branch_id = this.selectedBranch._id
        this.addModal.assigned_id = this.selectedBranchStarff._id
        this.addModal.assigned_name = this.selectedBranchStarff.name
        this.addModal.status = 0
        this.adding = true
        api.warranty.addRepairDetailList(this.$route.params.app_id, this.addModal).then((res) => {
          this.adding = false
          this.$route.router.go('/operation/plugins/warranty/' + this.$route.params.app_id + '/work-orders/repair')
        }).catch((err) => {
          this.adding = false
          this.handleError(err)
        })
      }
    }
  }
</script>
<style lang='stylus' scoped>
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
