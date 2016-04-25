<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/warranty/accounts/'}"><i class="fa fa-arrow-circle-left"></i>网点列表</a></div>
      <div class="panel">
        <!-- Start: 网点详情 -->
        <div class="panel-hd">
          <h2>网点详情</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li class="row">
              <div class="col-8">创建日期:</div>
              <div class="col-16">{{ info.create_time }}</div>
            </li>
          </ul>
        </div>
        <!-- End: 网点详情 -->

        <!-- Start: 网点信息 -->
        <div class="panel-hd">
          <div class="actions">
            <button @click="showEditModal = true" class="btn btn-ghost mr10"><i class="fa fa-edit"></i>编辑网点</button>
            <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>添加客服</button>
          </div>
          <h2>网点信息</h2>
        </div>
        <div class="panel-bd">
          <ul class="info-details">
            <li>
              <div class="label">网点名称:</div>
              <div class="info">{{ info.name }}</div>
            </li>
            <li>
              <div class="label">负责人:</div>
              <div class="info">{{ info.director }}</div>
            </li>
            <li>
              <div class="label">联系电话:</div>
              <div class="info">{{ info.phone }}</div>
            </li>
            <li>
              <div class="label">所在地区:</div>
              <div class="info">{{ info.province + info.city + info.district }}</div>
            </li>
            <li>
              <div class="label">详细地址:</div>
              <div class="info">{{ info.address }}</div>
            </li>
          </ul>
          <!-- End: 网点信息 -->

          <!-- Start: 操作栏 -->
          <div class="action-bar">
            <search-box :placeholder="'请输入用户名'">
              <label>查找客服</label>
              <button slot="search-button" class="btn btn-primary">搜索</button>
            </search-box>
          </div>
          <!-- End: 操作栏 -->

          <!-- Start: 过滤器 -->
          <div class="status-bar">
            <div class="status">{{{ $t('common.total_results', {count:total}) }}}
            </div>
            <v-select width="120px" size="small" :label="statusOptions[status.value].label">
              <label slot="label">状态</label>
              <select v-model="status" :status.sync="">
                <option v-for="option in statusOptions" :value="option">{{option.label}}</option>
              </select>
            </v-select>
          </div>
          <!-- End: 过滤器 -->

          <!-- Start: 客服人员列表 -->
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>姓名</th>
                <th>手机</th>
                <th>邮箱</th>
                <th>最后一次登陆</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="staff in staffs">
                <td>
                  <a v-link="{path: '/warranty/accounts/' + $route.params.account_id + '/staffs/1'}" class="hl-red">{{ staff.name }}</a>
                </td>
                <td>{{ staff.phone }}</td>
                <td>{{ staff.email }}</td>
                <td>{{ staff.create_time }}</td>
                <td v-if="staff.status-0 === 0">
                  <span class="hl-gray">已停用</span>
                </td>
                <td v-else>正常</td>
              </tr>
              <tr v-if="loadingData">
                <td colspan="5" class="tac">
                  <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
                </td>
              </tr>
              <tr v-if="staffs.length === 0">
                <td colspan="5" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                  <div v-else class="tips-null">{{ $t("common.no_records") }}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- End: 客服人员列表 -->

          <!-- Start: 分页信息 -->
          <!-- <pager :total="51" :current.sync="0" :page-count="10"></pager> -->
          <pager v-if="!loadingStaffs && total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getBranchList"></pager>
          <!-- End: 分页信息 -->
        </div>
      </div>
    </div>

    <!-- start: 添加客服 -->
    <modal :show.sync="showAddModal" width="600px">
      <h3 slot="header">添加客服</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addStaffHook">
          <div class="form-row row">
            <label class="form-control col-6">姓名:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="addModel.name" type="text" v-form-ctrl name="staff" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.staff.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.staff.$error.required">*必须</span></div>
              <div v-if="addValidation.staff.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.staff.$error.required">*必须</span></div>
            </div>
          </div>

          <div class="form-row row">
            <label class="form-control col-6">邮箱地址:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="addModel.email" type="email" v-form-ctrl name="email" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.email.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.email.$error.required">*必须</span></div>
              <div v-if="addValidation.email.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.email.$error.required">*必须</span></div>
            </div>
          </div>

          <div class="form-row row">
            <label class="form-control col-6">联系电话:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="addModel.phone" type="text" pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" v-form-ctrl name="phone" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.phone.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.phone.$error.required">*必须</span></div>
              <div v-if="addValidation.phone.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.phone.$error.required">*必须</span></div>
            </div>
          </div>

          <div class="form-row row">
            <label class="form-control col-6">登陆密码:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="addModel.password" type="text" v-form-ctrl name="password" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.password.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.password.$error.required">*必须</span></div>
              <div v-if="addValidation.password.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.password.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" v-model="addModel.status">启用
                </label>
              </div>
            </div>
          </div>
          <!-- <v-select :label="addCustomOptions[addModel.status].label" width="120px">
            <label slot="label">状态</label>
            <select v-model="addModel.status" name="status">
              <option v-for="customOption in addCustomOptions" :value="customOption.value">{{customOption.label}}</option>
            </select>
          </v-select> -->

          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="false" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- end -->

    <!-- start 编辑网点 -->
    <modal :show.sync="showEditModal" width="600px">
      <h3 slot="header">编辑网点</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit">
          <div class="form-row row">
            <label class="form-control col-6">网点:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.name" type="text" v-form-ctrl name="branch" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.branch.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.branch.$error.required">*必须</span></div>
              <div v-if="editValidation.branch.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.branch.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">负责人:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.charge" type="text" v-form-ctrl name="charge" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.charge.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.charge.$error.required">*必须</span></div>
              <div v-if="editValidation.charge.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.charge.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">联系号码:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.tel" type="text" pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" v-form-ctrl name="tel" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.tel.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.tel.$error.required">*必须</span></div>
              <div v-if="editValidation.tel.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.tel.$error.required">*必须</span></div>
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
            <label class="form-control col-6">详细地址:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModal.addr" type="text" v-form-ctrl name="addr" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.addr.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.addr.$error.required">*必须</span></div>
              <div v-if="editValidation.addr.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.addr.$error.required">*必须</span></div>
            </div>
          </div>

          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>删除网点
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- end  -->

  </section>
</template>

<script>
  import { globalMixins } from '../../../mixins'
  import Select from '../../../components/Select'
  import SearchBox from '../../../components/SearchBox'
  import Pager from '../../../components/Pager'
  import Modal from '../../../components/Modal'
  import api from '../../../api'
  import _ from 'lodash'

  export default {
    name: 'AccountDetails',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
        info: {},
        staffs: [],
        showAddModal: false,
        showEditModal: false,
        editModal: {
          // name: '',
          // charge: '',
          // tel: '',
          // email: '',
          // area: {},
          // addr: ''
        },
        status: {
          label: '全部',
          value: 0
        },
        statusOptions: [{
          label: '全部',
          value: 0
        }, {
          label: '停用',
          value: 1
        }, {
          label: '正常',
          value: 2}
        ],
        addCustomOptions: [{
          label: '启用',
          value: 0
        }, {
          label: '停用',
          value: 1}
        ],
        queryType: '',
        addValidation: {},
        editValidation: {},
        addModel: {
          name: '',
          username: '',
          branch_id: '',
          creator: '',
          password: '',
          phone: '',
          email: '',
          create_time: '',
          status: 1
        },
        total: 0,
        currentPage: 1,
        pageCount: 10,
        delChecked: false,
        quary: {},
        loadingData: false,
        loadingStaffs: false,
        originAddModel: {}
      }
    },

    components: {
      'v-select': Select,
      'search-box': SearchBox,
      'pager': Pager,
      'modal': Modal
    },

    ready () {
      this.getBranchList()
      this.getBranchStaffsList()
    },

    computed: {
      queryCondition () {
        var condition = {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: {},
          query: {}
        }

        // if (this.curProvince.hasOwnProperty('value')) {
        //   condition.query.province = this.curProvince.name
        // }
        // if (this.curCity.hasOwnProperty('name')) {
        //   condition.query.city = this.curCity.name
        // }
        // if (this.curDistrict.hasOwnProperty('name')) {
        //   condition.query.district = this.curDistrict.name
        // }
        // if (this.key !== '') {
        //   condition.query._id = this.key
        // }

        return condition
      }
    },
    route: {
      data () {
        this.originAddModel = _.clone(this.addModel)
      }
    },
    methods: {
      // 获取网点信息
      getBranchList () {
        var condition = {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: {},
          query: {
            _id: this.$route.params.id
          }
        }
        api.warranty.getBranchList(condition).then((res) => {
          this.info = res.data.list[0]
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      // 获取维修点员工列表
      getBranchStaffsList () {
        // if (typeof querying !== 'undefined') {
        //   this.currentPage = 1
        // }
        this.loadingData = true
        api.warranty.getBranchStaffsList(this.queryCondition).then((res) => {
          this.staffs = res.data.list
          this.total = res.data.count
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      // 添加网点表单钩子
      addStaffHook (form) {
        this.addForm = form
      },
      // 编辑网点表单钩子
      editStaffHook (form) {
        this.editForm = form
      },
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
      // 取消编辑
      onEditCancel () {
        this.resetEdit()
        // this.product = this.originEditModel
      },
      // 添加操作
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          this.addModel.status = this.addModel.status - 0
          this.addModel.branch_id = this.$route.params.id
          api.warranty.AddBranchStaffs(this.addModel).then((res) => {
            this.adding = false
            this.showAddModal = false
            this.getBranchStaffsList()
            this.resetAdd()
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
          console.log('ready to send post')
        }
      },

      onEditSubmit () {

      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'
</style>
