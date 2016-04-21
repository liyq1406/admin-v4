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
              <div class="col-16"></div>
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
              <div class="info"></div>
            </li>
            <li>
              <div class="label">负责人:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">联系电话:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">所在地区:</div>
              <div class="info"></div>
            </li>
            <li>
              <div class="label">详细地址:</div>
              <div class="info"></div>
            </li>
          </ul>
          <!-- End: 网点信息 -->

          <!-- Start: 操作栏 -->
          <div class="action-bar">
            <v-select width=120px :label="statusOptions[status.value].label">
              <label slot="label">状态</label>
              <select v-model="status">
                <option v-for="option in statusOptions" :value="option">{{option.label}}</option>
              </select>
            </v-select>
            <search-box :placeholder="'支持用户名、邮箱、昵称'">
              <label>查找客服</label>
              <button slot="search-button" class="btn btn-primary">搜索</button>
            </search-box>
          </div>
          <!-- End: 操作栏 -->

          <!-- Start: 客服人员列表 -->
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>姓名</th>
                <th>手机</th>
                <th>邮箱</th>
                <th>产品型号</th>
                <th>最后一次登陆</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="n in 1">
                <tr>
                  <td>
                    <a v-link="{path: '/warranty/accounts/1/staffs/1'}" class="hl-red">张三</a>
                  </td>
                  <td>13800138000</td>
                  <td>foo@bar.com</td>
                  <td>S-Model-510</td>
                  <td>2016-04-15 16:54:30</td>
                  <td>正常</td>
                </tr>
                <tr>
                  <td>
                    <a v-link="{path: '/warranty/accounts/' + $route.params.account_id + '/staffs/1'}" class="hl-red">张三</a>
                  </td>
                  <td>13800138000</td>
                  <td>foo@bar.com</td>
                  <td>S-Model-510</td>
                  <td>2016-04-15 16:54:30</td>
                  <td>
                    <span class="hl-gray">已停用</span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <!-- End: 客服人员列表 -->

          <!-- Start: 分页信息 -->
          <div class="row">
            <div class="col-8">{{{ $t('common.total_results', {count:total}) }}}</div>
            <div class="col-16">
              <pager :total="51" :current.sync="0" :page-count="10"></pager>
            </div>
          </div>
          <!-- End: 分页信息 -->
        </div>
      </div>
    </div>

    <!-- start: 添加客服 -->
    <modal :show.sync="showAddModal" width="600px">
      <h3 slot="header">添加客服</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit">
          <div class="form-row">
            <label class="form-control">姓名:</label>
            <div class="controls">
              <div class="input-text-wrap">
                <input v-model="addStaff.name" type="text" v-form-ctrl name="staff" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.staff.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.staff.$error.required">*必须</span></div>
              <div v-if="addValidation.staff.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.staff.$error.required">*必须</span></div>
            </div>
          </div>

          <div class="form-row">
            <label class="form-control">邮箱地址:</label>
            <div class="controls">
              <div class="input-text-wrap">
                <input v-model="addStaff.email" type="email" v-form-ctrl name="email" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.email.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.email.$error.required">*必须</span></div>
              <div v-if="addValidation.email.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.email.$error.required">*必须</span></div>
            </div>
          </div>

          <div class="form-row">
            <label class="form-control">联系电话:</label>
            <div class="controls">
              <div class="input-text-wrap">
                <input v-model="addStaff.tel" type="text" pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" v-form-ctrl name="tel" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.tel.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.tel.$error.required">*必须</span></div>
              <div v-if="addValidation.tel.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.tel.$error.required">*必须</span></div>
            </div>
          </div>

          <div class="form-row">
            <label class="form-control">登陆密码:</label>
            <div class="controls">
              <div class="input-text-wrap">
                <input v-model="addStaff.passwd" type="text" v-form-ctrl name="passwd" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.passwd.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.passwd.$error.required">*必须</span></div>
              <div v-if="addValidation.passwd.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.passwd.$error.required">*必须</span></div>
            </div>
          </div>

          <v-select :label="addCustomOptions[addStaff.status.value].label" width="120px">
            <label slot="label">状态</label>
            <select v-model="addStaff.status">
              <option v-for="customOption in addCustomOptions" :value="customOption">{{customOption.label}}</option>
            </select>
          </v-select>

          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="true" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
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
          <div class="form-row">
            <label class="form-control">网点:</label>
            <div class="controls">
              <div class="input-text-wrap">
                <input v-model="editModal.name" type="text" v-form-ctrl name="branch" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.branch.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.branch.$error.required">*必须</span></div>
              <div v-if="editValidation.branch.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.branch.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">负责人:</label>
            <div class="controls">
              <div class="input-text-wrap">
                <input v-model="editModal.charge" type="text" v-form-ctrl name="charge" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.charge.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.charge.$error.required">*必须</span></div>
              <div v-if="editValidation.charge.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.charge.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">联系号码:</label>
            <div class="controls">
              <div class="input-text-wrap">
                <input v-model="editModal.tel" type="text" pattern="^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$" v-form-ctrl name="tel" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.tel.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.tel.$error.required">*必须</span></div>
              <div v-if="editValidation.tel.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.tel.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">邮箱地址:</label>
            <div class="controls">
              <div class="input-text-wrap">
                <input v-model="editModal.email" type="email" v-form-ctrl name="email" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.email.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.email.$error.required">*必须</span></div>
              <div v-if="editValidation.email.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.email.$error.required">*必须</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">详细地址:</label>
            <div class="controls">
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
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
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
  import _ from 'lodash'

  export default {
    name: 'AccountDetails',

    layout: 'admin',

    mixins: [globalMixins],

    data () {
      return {
        showAddModal: false,
        showEditModal: false,
        editModal: {
          name: '',
          charge: '',
          tel: '',
          email: '',
          area: {},
          addr: ''
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
        addStaff: {
          name: '',
          passwd: '',
          tel: '',
          email: '',
          status: {
            label: '启用',
            value: 0
          }
        },
        delChecked: false
      }
    },

    components: {
      'v-select': Select,
      'search-box': SearchBox,
      'pager': Pager,
      'modal': Modal
    },

    methods: {
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
      },
      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },
      // 添加操作
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
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
