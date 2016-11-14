<template>
  <div class="main">
    <div class="main-title">
      <h2>客服详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15 mb20 no-split-line">
      <div class="panel-bd row">
        <div class="col-16">
          <div class="account-info ml10">
            <info-card :thumb-hidden="true">
              <h3>{{ detail.name }} <a href="#" @click.prevent="editAccount" class="fa fa-edit"></a></h3>
              <div class="desc"><span :class="{'on-line':detail.status=== 1, 'off-line':detail.status!==1}" v-text="detail.status=== 1?'启用':'停用'"></span><span>创建时间：{{ detail.create_time | formatDate }}</span>
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
      <h3 slot="header">编辑客服</h3>
      <div slot="body" class="form">
        <form autocomplete="off" v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editStaffHook">
          <div class="form-row row">
            <label class="form-control col-6">姓名:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.name" type="text" v-form-ctrl name="name" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">*必须</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">邮箱地址:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.email" type="email" v-form-ctrl name="email" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.email.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.email.$error.required">*必须</span></div>
              <div v-if="editValidation.email.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.email.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">联系号码:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.phone" type="text" :pattern="patterns.PHONE" v-form-ctrl name="phone" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.phone.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">*必须</span></div>
              <div v-if="editValidation.phone.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.phone.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">登陆密码:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.password" type="text" v-form-ctrl name="password" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.password.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.password.$error.required">*必须</span></div>
              <div v-if="editValidation.password.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.password.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" v-model="editModal.status">启用
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>删除客服
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
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../mixins'
import { warrantyMixins } from '../mixins'
import InfoCard from 'components/InfoCard'
import InfoList from 'components/InfoList'
import api from 'api'
import * as config from 'consts/config'

export default {
  name: 'OrderDetails',

  mixins: [globalMixins, pluginMixins, warrantyMixins],

  data () {
    return {
      token: JSON.parse(window.localStorage.pluginsToken)[this.$route.params.app_id].token,
      showEditModal: false,
      editModal: false,
      editValidation: '',
      editCustomOptions: [{
        label: '启用',
        value: 0
      }, {
        label: '停用',
        value: 1}
      ],
      editStaff: {
        name: '',
        passwd: '',
        tel: '',
        email: '',
        status: {
          label: '启用',
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
        label: '网点管理',
        link: `/operation/plugins/warranty/${this.$route.params.app_id}/accounts`
      }, {
        label: '网点详情',
        link: `/operation/plugins/warranty/${this.$route.params.app_id}/accounts/${this.$route.params.account_id}`
      }, {
        label: '客服详情'
      }]
    }
  },

  components: {
    InfoCard,
    InfoList
  },

  computed: {
    accountInfo () {
      return {
        email: {
          label: '邮箱地址',
          value: this.detail.email
        },
        phone: {
          label: '联系电话',
          value: this.detail.phone
        },
        password: {
          label: '登陆密码',
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
