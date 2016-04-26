<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb">
        <a v-link="{path: '/warranty/accounts/' + $route.params.account_id}">
          <i class="fa fa-arrow-circle-left"></i>网点详情
        </a>
      </div>
      <div class="panel">
        <div class="panel-hd">
          <h2>客服详情</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">创建日期:</div>
              <div class="info">{{ detail.create_time }}</div>
            </li>
          </ul>
        </div>

        <!-- start: 客服信息 -->
        <div class="panel-hd">
          <div class="actions">
            <button @click="editAccount" class="btn btn-ghost"><i class="fa fa-edit"></i>编辑客服</button>
          </div>
          <h2>客服信息</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">姓名:</div>
              <div class="info">{{ detail.name }}</div>
            </li>
            <li>
              <div class="label">邮箱地址:</div>
              <div class="info">{{ detail.email }}</div>
            </li>
            <li>
              <div class="label">联系电话:</div>
              <div class="info">{{ detail.phone }}</div>
            </li>
            <li>
              <div class="label">登陆密码:</div>
              <div class="info">{{ detail.create_time }}</div>
            </li>
            <li>
              <div class="label">状态:</div>
              <div class="info" v-if = "detail.status=== 1 ">启用</div>
              <div class="info" v-else>停用</div>
            </li>
          </ul>
        </div>
        <!-- end: 客服信息-->
      </div>
      <!-- start 编辑客服 -->
      <modal :show.sync="showEditModal" width="600px">
        <h3 slot="header">编辑客服</h3>
        <div slot="body" class="form">
          <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editStaffHook">
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
                  <input v-model="editModal.phone" type="text" pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" v-form-ctrl name="phone" required lazy class="input-text"/>
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
              <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </modal>

    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../../mixins'
  import Modal from '../../../components/Modal'
  import Select from '../../../components/Select'
  import api from '../../../api'
  // import _ from 'lodash'

  export default {
    name: 'OrderDetails',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
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
        pageCount: 10,
        detail: {},
        editing: false
      }
    },

    components: {
      'modal': Modal,
      'v-select': Select
    },

    ready () {
      this.getBranchStaffsList()
    },
    methods: {
      // 获取维修点员工信息
      getBranchStaffsList () {
        // if (typeof querying !== 'undefined') {
        //   this.currentPage = 1
        // }
        var condition = {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: {},
          query: {
            _id: this.$route.params.id
          }
        }
        api.warranty.getBranchStaffsList(condition).then((res) => {
          this.detail = res.data.list[0]
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      editAccount () {
        var condition = {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: {},
          query: {
            _id: this.$route.params.id
          }
        }
        api.warranty.getBranchStaffsList(condition).then((res) => {
          this.editModal = res.data.list[0]
        }).catch((res) => {
          this.handleError(res)
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
        if (this.delChecked && !this.editing) { // 删除
          this.editing = true
          console.log(this.$route.params.id)
          api.warranty.deleteStaff(this.$route.params.id).then((res) => {
            console.log(111)
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true
          api.warranty.UpdateBranchStaffs(this.$route.params.id, this.editModal).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getBranchStaffsList()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'
</style>
