<template>
  <div class="main">
    <div class="main-title">
      <h2>添加工单</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16 alert-max form">
            <form autocomplete="off"  v-form name="addValidation" @submit.prevent="onSubmit">
              <div class="form-row row">
                <label class="form-control col-5 alert-label">设备SN:</label>
                <div class="controls col-19">
                  <div v-placeholder="'请输入设备序列号'" class="input-text-wrap">
                    <input v-model="addModal.product_sn" type="text" v-form-ctrl name="product_sn" minlength="2" maxlength="32" lazy required class="input-text"/>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.product_sn.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.product_sn.$error.required">请输入设备SN</span></div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">选择产品:</label>
                <div class="controls col-19">
                  <x-select  v-if="products.length" :label="selectedProduct.name" :width="'120px'">
                    <select v-model="selectedProduct">
                      <option v-for="product in products" :value="product">{{ product.name }}</option>
                    </select>
                  </x-select>
                  <div v-else class="non-tip">暂无产品，请先添加产品</div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修类型:</label>
                <div class="controls col-19">
                  <x-select v-if="types.length" :label="selectedType" :width="'120px'">
                    <select v-model="selectedType">
                      <option v-for="type in types" :value="type">{{ type }}</option>
                    </select>
                  </x-select>
                  <div v-else class="non-tip">暂无维修类型，请先添加标签</div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修内容:</label>
                <div class="controls col-19">
                  <div v-placeholder="'请输入维修内容'" class="input-text-wrap">
                    <input v-length-tip="{max: 32, model:addModal.instructions }" v-model="addModal.instructions" type="text" v-form-ctrl name="instructions" minlength="0" maxlength="32" lazy required class="input-text"/>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.instructions.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.instructions.$error.required">请输入维修内容</span></div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修说明:</label>
                <div class="controls col-19">
                  <div v-placeholder="'请输入维修说明'" class="input-text-wrap">
                    <textarea v-length-tip="{max: 240, model:addModal.discription }" v-model="addModal.remark" type="text" v-form-ctrl name="remark" minlength="2" maxlength="32" lazy required class="input-text"></textarea>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.remark.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.remark.$error.required">请输入维修说明</span></div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修照片:</label>
                <div class="controls col-19">
                  <image-uploader :images="images"></image-uploader>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">网点选择:</label>
                <div class="controls col-19">
                  <x-select v-if="branchs.length" :label="selectedBranch.name" :width="'120px'">
                    <select v-model="selectedBranch">
                      <option v-for="branch in branchs" :value="branch">{{ branch.name }}</option>
                    </select>
                  </x-select>
                  <div v-else class="non-tip">暂无网点，请先添加网点</div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">处理人员:</label>
                <div class="controls col-19">
                  <x-select v-if="branchStaffs.length" :label="selectedBranchStarff.name" :width="'120px'">
                    <select v-model="selectedBranchStarff">
                      <option v-for="staff in branchStaffs" :value="staff">{{ staff.name }}</option>
                    </select>
                  </x-select>
                  <div v-else class="non-tip">暂无客服，请先添加客服</div>
                </div>
              </div>

              <div class="form-actions mt20 border-top row">
                <div class="col-offset-5 col-19">
                  <button type="submit" :disabled="adding" :class="{'disabled':adding}"  class="btn btn-primary mt5 ml20 submit-btn">提交</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ImageUploader from 'components/ImageUploader'
  import { globalMixins } from 'src/mixins'
  import { warrantyMixins } from '../../mixins'
  import api from 'api'

  export default {
    name: 'add-warranty',

    mixins: [globalMixins, warrantyMixins],

    vuex: {
      getters: {
        products: ({ products }) => products.released
      }
    },

    components: {
      ImageUploader
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
          label: '全部',
          link: `/operation/plugins/warranty/${this.$route.params.app_id}/work-orders/repair`
        }, {
          label: '添加工单'
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
        if (this.$addValidation.invalid) {
          this.$validate(true)
          return
        }
        if (this.addValidation.$valid) {
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
            this.handleError(err)
          })
        }
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
