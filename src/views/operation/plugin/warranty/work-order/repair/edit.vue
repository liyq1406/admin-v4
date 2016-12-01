<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.warranty.repair_form.edit_title') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16 alert-max form">
            <validator name="validation">
              <form autocomplete="off" @submit.prevent="onEdit">
                <div class="form-row row">
                  <label class="form-control col-5 alert-label">{{ $t('operation.warranty.repair_form.fields.sn') }}:</label>
                  <div class="controls col-19">
                    <div class="input-text-wrap">
                      <input v-model="editModal.product_sn" type="text" name="product_sn" :placeholder="$t('operation.warranty.repair_form.placeholders.sn')" v-validate:productsn="{required: true, minlength: 2, maxlength: 32}" lazy required class="input-text"/>
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
                    <div class="input-text-wrap">
                      <input v-length-tip="{max: 32, model:editModal.instructions }" v-model="editModal.instructions" :placeholder="$t('operation.warranty.repair_form.placeholders.instructions')" type="text" name="instructions" v-validate:instructions="{required: true, maxlength: 32}" lazy required class="input-text"/>
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
                    <div class="input-text-wrap">
                      <textarea v-length-tip="{max: 240, model:editModal.discription }" v-model="editModal.remark" type="text" :placeholder="$t('operation.warranty.repair_form.placeholders.remark')" name="remark" v-validate:remark="{required: true, maxlength: 240}" lazy required class="input-text"></textarea>
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
                    <button type="submit" :disabled="editing" :class="{'disabled':editing}"  class="btn btn-primary mt5 ml20 submit-btn" @click.prevent.stop="onEdit">{{ $t('common.ok') }}</button>
                    <!-- <button @click.prevent.stop="delRepair" :disabled="editing" :class="{'disabled':editing}"  class="btn btn-default mt5 ml20 submit-btn">删除</button> -->
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
        // this.getInfo()
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
        editing: false,
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
          link: `/operation/plugins/warranty/${this.$route.params.app_id}/work-orders/repair/${this.$route.params.id}`
        }, {
          label: this.$t('operation.warranty.repair_form.edit_title')
        }],
        editModal: {
          product_sn: '',
          instructions: '',
          remark: ''
        },
        deviceTypes: [],
        images: ['']
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
        this.selectedType = this.types[0] || {}
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
          this.getInfo()
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
      // 获取工单信息
      getInfo () {
        // token 不存在，无权限访问
        if (!this.token) {
          this.showNoTokenError()
          return
        }

        var params = {
          filter: [],
          limit: 1,
          offset: 0,
          order: {},
          query: {
            _id: this.$route.params.id
          }
        }
        api.warranty.getOrderWorkList(this.$route.params.app_id, params).then((res) => {
          var info = res.data.list[0]
          this.editModal.product_sn = info.product_sn
          this.products.forEach((product) => {
            if (info.product_id === product.id) {
              this.selectedProduct = product
            }
          })
          this.selectedType = info.label[0]
          this.editModal.instructions = info.instructions
          this.editModal.remark = info.remark
          this.images = info.images
          this.branchs.forEach((branch) => {
            if (branch.id === info.branch_id) {
              this.selectedBranch = branch
            }
          })
          this.branchStaffs.forEach((branchStaff) => {
            if (branchStaff.id === info.branch_id && branchStaff.name === info.assigned_name) {
              this.selectedBranchStarff = branchStaff
            }
          })
          console.log(info)
        }).catch((err) => {
          this.handleError(err)
        })
      },
      // 删除工单
      delRepair () {
        // token 不存在，无权限访问
        if (!this.token) {
          this.showNoTokenError()
          return
        }

        var result = window.confirm(this.$t('operation.warranty.repair_form.del_confirm'))
        if (result === true) {
          this.editing = true
          api.warranty.delRepairDetailList(this.$route.params.app_id, this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.$route.router.go('/operation/plugins/warranty/' + this.$route.params.app_id + '/work-orders/repair')
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },
      // addFormHook (form) {
      //   this.editModal.form = form
      // },
      // 提交添加
      onEdit () {
        // token 不存在，无权限访问
        if (!this.token) {
          this.showNoTokenError()
          return
        }

        if (this.editing) return
        this.editModal.product_sn = this.editModal.product_sn.trim()
        this.editModal.remark = this.editModal.remark.trim()
        this.editModal.instructions = this.editModal.instructions.trim()
        if (this.$validation.invalid) {
          this.$validate(true)
          return
        }
        this.editModal.product_id = this.selectedProduct.id
        this.editModal.label = this.selectedType
        this.editModal.images = this.images
        if (this.dealerID) {
          this.editModal.dealer_id = this.dealerID
        }
        this.editModal.branch_id = this.selectedBranch._id
        this.editModal.assigned_id = this.selectedBranchStarff._id
        this.editModal.assigned_name = this.selectedBranchStarff.name
        this.editModal.status = 0
        this.editing = true
        api.warranty.editRepairDetailList(this.$route.params.app_id, this.$route.params.id, this.editModal).then((res) => {
          this.editing = false
          this.$route.router.go('/operation/plugins/warranty/' + this.$route.params.app_id + '/work-orders/repair/' + this.$route.params.id)
        }).catch((err) => {
          this.handleError(err)
          this.editing = false
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
  pediting-left 20px
  box-sizing border-box
.alert-max
  max-width 700px
.border-top
  border-top 1px solid #DDDDDD
  pediting-top 20px
  margin-left -20px
.submit-btn
  width 120px
</style>
