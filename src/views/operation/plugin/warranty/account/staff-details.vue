<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.warranty.staff_details.main_title') }}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <div class="account-info ml10">
            <info-card :thumb-hidden="true">
              <h3>{{ detail.name }} <a href="#" @click.prevent="editAccount" class="fa fa-edit"></a></h3>
              <div class="desc"><span :class="{'on-line':detail.status=== 1, 'off-line':detail.status!==1}" v-text="detail.status=== 1? $t('common.enable') : $t('common.outage')"></span><span>{{ $t('common.create_time') }}：{{ detail.create_time | formatDate }}</span>
              </div>
            </info-card>
          </div>
          <div v-stretch="121">
            <info-list :info="accountInfo"></info-list>
          </div>
        </div>
      </div>
    </div>
    <!-- start 编辑客服 -->
    <modal :show.sync="showEditModal" width="600px">
      <h3 slot="header">{{ $t('operation.warranty.staff_details.edit') }}</h3>
      <div slot="body" class="form">
        <form autocomplete="off" v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editStaffHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t('operation.warranty.staff.fields.name') }}:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.name" type="text" v-form-ctrl name="name" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('operation.warranty.staff.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('operation.warranty.staff.fields.name')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t('common.email') }}:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.email" type="email" v-form-ctrl name="email" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.email.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.email.$error.required">{{ $t('common.validation.required', {field: $t('common.email')}) }}</span></div>
              <div v-if="editValidation.email.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.email.$error.required">{{ $t('common.validation.required', {field: $t('common.email')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t('common.phone') }}:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.phone" type="text" :pattern="patterns.PHONE" v-form-ctrl name="phone" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.phone.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">{{ $t('common.validation.required', {field: $t('common.phone')}) }}</span></div>
              <div v-if="editValidation.phone.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">{{ $t('common.validation.required', {field: $t('common.phone')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t('common.password') }}:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.password" type="text" v-form-ctrl name="password" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.password.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.password.$error.required">{{ $t('common.validation.required', {field: $t('common.password')}) }}</span></div>
              <div v-if="editValidation.password.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.password.$error.required">{{ $t('common.validation.required', {field: $t('common.password')}) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" v-model="editModal.status">{{ $t('common.enable') }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t('operation.warranty.staff_details.del') }}
            </label>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
import { pluginMixins } from '../../mixins'
import { warrantyMixins } from '../mixins'
import api from 'api'
import * as config from 'consts/config'

export default {
  name: 'OrderDetails',

  mixins: [pluginMixins, warrantyMixins],

  data () {
    return {
      token: JSON.parse(window.localStorage.pluginsToken)[this.$route.params.app_id].token,
      showEditModal: false,
      editModal: false,
      editValidation: '',
      editCustomOptions: [{
        label: this.$t('common.enable'),
        value: 0
      }, {
        label: this.$t('common.outage'),
        value: 1}
      ],
      editStaff: {
        name: '',
        passwd: '',
        tel: '',
        email: '',
        status: {
          label: this.$t('common.enable'),
          value: 0
        }
      },
      delChecked: false,
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      detail: {},
      editing: false,
      breadcrumbNav: [{
        label: this.$t('operation.warranty.branch.main_title'),
        link: `/operation/plugins/warranty/${this.$route.params.app_id}/accounts`
      }, {
        label: this.$t('operation.warranty.branch_details.main_title'),
        link: `/operation/plugins/warranty/${this.$route.params.app_id}/accounts/${this.$route.params.account_id}`
      }, {
        label: this.$t('operation.warranty.staff_details.main_title')
      }]
    }
  },

  components: {
  },

  computed: {
    accountInfo () {
      return {
        email: {
          label: this.$t('common.email'),
          value: this.detail.email
        },
        phone: {
          label: this.$t('common.phone'),
          value: this.detail.phone
        },
        password: {
          label: this.$t('common.password'),
          value: this.detail.password
        }
      }
    }
  },

  ready () {
    this.getBranchStaffsList()
  },
  methods: {
    // 获取维修点员工信息
    getBranchStaffsList () {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      var condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          _id: this.$route.params.id
        }
      }
      api.warranty.getBranchStaffsList(this.$route.params.app_id, condition).then((res) => {
        this.detail = res.data.list[0] || {}
      }).catch((err) => {
        this.handleError(err)
        this.loadingData = false
      })
    },

    editAccount () {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      var condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          _id: this.$route.params.id
        }
      }
      api.warranty.getBranchStaffsList(this.$route.params.app_id, condition).then((res) => {
        this.editModal = res.data.list[0] || {}
      }).catch((err) => {
        this.handleError(err)
        this.loadingData = false
      })
      this.showEditModal = true
    },
    // 编辑网点表单钩子
    editStaffHook (form) {
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
    // 取消编辑
    onEditCancel () {
      this.resetEdit()
      // this.product = this.originEditModel
    },
    // 提交编辑表单
    onEditSubmit () {
      // token 不存在，无权限访问
      if (!this.token) {
        this.showNoTokenError()
        return
      }

      if (this.delChecked && !this.editing) { // 删除
        this.editing = true
        api.warranty.deleteStaff(this.$route.params.app_id, this.$route.params.id).then((res) => {
          this.editing = false
          this.showEditModal = false
          this.$route.router.replace('/operation/plugins/warranty/' + this.$route.params.app_id + '/accounts/' + this.$route.params.account_id)
        }).catch((err) => {
          this.handleError(err)
          this.editing = false
        })
      } else if (this.editValidation.$valid && !this.editing) { // 更新
        this.editing = true
        api.warranty.UpdateBranchStaffs(this.$route.params.app_id, this.$route.params.id, this.editModal).then((res) => {
          if (res.status === 200) {
            this.resetEdit()
            this.getBranchStaffsList()
          }
        }).catch((err) => {
          this.handleError(err)
          this.editing = false
        })
      }
    }
  }
}
</script>
