<template>
  <div class="main">
    <div class="main-title">
      <h2>修改工单</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16 alert-max form">
            <form  v-form name="addValidation" @submit.prevent="onEdit">
              <div class="form-row row">
                <label class="form-control col-5 alert-label">设备SN:</label>
                <div class="controls col-19">
                  <div v-placeholder="'请输入设备序列号'" class="input-text-wrap">
                    <input v-model="editModal.product_sn" type="text" v-form-ctrl name="product_sn" minlength="2" maxlength="32" lazy required class="input-text"/>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.product_sn.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.product_sn.$error.required">请输入设备SN</span></div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">选择产品:</label>
                <div class="controls col-19">
                  <x-select :label="selectedProduct.name" :width="'120px'">
                    <select v-model="selectedProduct">
                      <option v-for="product in products" :value="product">{{ product.name }}</option>
                    </select>
                  </x-select>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修类型:</label>
                <div class="controls col-19">
                  <x-select :label="selectedType" :width="'120px'">
                    <select v-model="selectedType">
                      <option v-for="type in types" :value="type">{{ type }}</option>
                    </select>
                  </x-select>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修内容:</label>
                <div class="controls col-19">
                  <div v-placeholder="'请输入维修内容'" class="input-text-wrap">
                    <input v-length-tip="{max: 32, model:editModal.instructions }" v-model="editModal.instructions" type="text" v-form-ctrl name="instructions" minlength="0" maxlength="32" lazy required class="input-text"/>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.instructions.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.instructions.$error.required">请输入维修内容</span></div>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">维修说明:</label>
                <div class="controls col-19">
                  <div v-placeholder="'请输入维修说明'" class="input-text-wrap">
                    <textarea v-length-tip="{max: 240, model:editModal.discription }" v-model="editModal.remark" type="text" v-form-ctrl name="remark" minlength="2" maxlength="32" lazy required class="input-text"></textarea>
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
                  <x-select :label="selectedBranch.name" :width="'120px'">
                    <select v-model="selectedBranch" @change="getBranchStaffsList">
                      <option v-for="branch in branchs" :value="branch">{{ branch.name }}</option>
                    </select>
                  </x-select>
                </div>
              </div>

              <div class="form-row row">
                <label class="form-control col-5 alert-label">处理人员:</label>
                <div class="controls col-19">
                  <x-select :label="selectedBranchStarff.name" :width="'120px'">
                    <select v-model="selectedBranchStarff">
                      <option v-for="staff in branchStaffs" :value="staff">{{ staff.name }}</option>
                    </select>
                  </x-select>
                </div>
              </div>

              <div class="form-actions mt20 border-top row">
                <div class="col-offset-5 col-19">
                  <button type="submit" :disabled="editing" :class="{'disabled':editing}"  class="btn btn-primary mt5 ml20 submit-btn">提交</button>
                  <button @click.prevent.stop="delRepair" :disabled="editing" :class="{'disabled':editing}"  class="btn btn-default mt5 ml20 submit-btn">删除</button>
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
  import Breadcrumb from 'components/Breadcrumb'
  import Select from 'components/Select'
  import ImageUploader from 'components/ImageUploader'
  import { globalMixins } from 'src/mixins'
  import api from 'api'

  export default {
    name: 'add-warranty',

    mixins: [globalMixins],

    vuex: {
      getters: {
        products: ({ products }) => products.released
      }
    },

    components: {
      Breadcrumb,
      ImageUploader,
      'x-select': Select
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
          label: '全部',
          link: `/operation/plugins/warranty/${this.$route.params.app_id}/work-orders/repair/${this.$route.params.id}`
        }, {
          label: '添加工单'
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
        api.warranty.getWarrantyLabel(this.$route.params.app_id).then((res) => {
          this.types = res.data.label
        }).catch((res) => {
          this.handleError(res)
        })
      },
      // 获取网点列表
      getBranchList () {
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
        console.log(888)
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
        var result = window.confirm('确认删除该维修工单吗?')
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
        console.log(this.addValidation.$invalid)
        if (this.editing) return

        // if (this.$addValidation.invalid) {
        //   this.$validate(true)
        //   return
        // }
        if (this.addValidation.$valid) {
          this.editModal.product_id = this.selectedProduct.id
          this.editModal.label = this.selectedType
          this.editModal.images = this.images
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
          })
        }
      }
    }
  }
</script>
<style lang='stylus' scoped>
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
