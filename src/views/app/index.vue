<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t("nav_aside.apps") }}</h2>
        </div>
        <div class="panel-bd">
          <div class="action-bar">
            <div class="action-group">
              <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("app.create_app") }}</button>
            </div>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t("app.fields.id") }}</th>
                <th>{{ $t("app.fields.name") }}</th>
                <th class="tac">Access Key Secret</th>
                <th>{{ $t("app.fields.type") }}</th>
                <th>{{ $t("app.fields.create_time") }}</th>
                <th class="tac">{{ $t("common.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="apps.length > 0 && !loadingData">
                <tr v-for="app in apps">
                  <td>{{ app.id }}</td>
                  <td>{{ app.name }}</td>
                  <td class="tac">
                    <button @click="viewAccessKeys(app)" class="btn btn-link btn-mini">{{ $t('common.details') }}</button>
                  </td>
                  <td>{{ app.type | typeLabel }}</td>
                  <td>{{ app.create_time | formatDate }}</td>
                  <td v-if="app.type===4" class="tac">
                    <button v-link="{ path: '/apps/wechat/'+app.id }" class="btn-link btn-mini">{{ '查看' }}</button>
                  </td>
                  <td v-else class="tac">
                    <button @click="onEditApp(app)" class="btn btn-link btn-mini">{{ $t("common.edit") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="loadingData">
                <td colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
                </td>
              </tr>
              <tr v-if="apps.length === 0 && !loadingData">
                <td colspan="6" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Start: 查看密钥浮层-->
    <modal :show.sync="showKeyModal">
      <h3 slot="header">Access Key Secret</h3>
      <div slot="body" class="form">
        <div slot="body" class="secret-key tac">{{ key.secret }}</div>
      </div>
    </modal>
    <!-- End: 查看密钥浮层-->

    <!-- Start: 新增添加应用浮层-->
    <modal :show.sync="showAddModal" @close="onAddCancel">
      <h3 slot="header">{{ $t("app.create_app") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addAppHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("app.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('app.placeholders.name')" class="input-text-wrap">
                <input v-model="addModel.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span>
              </div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span>
                <span v-if="addValidation.name.$error.minlength">{{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}</span>
                <span v-if="addValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('app.fields.name'), 32]) }}</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("app.fields.type") }}:</label>
            <div class="controls col-18">
              <div class="radio-group radio-group-v">
                <!-- 功能完成后改成下面的代码 -->
                <!-- <label v-for="type in appTypes" class="radio">
                  <input type="radio" v-model="addModel.type" name="type" :value="$index+1" :disabled="($index > 3 && isAppExist($index+1)) || type.disabled"/>
                  <span :class="{'hl-gray': ($index > 3 && isAppExist($index+1)) || type.disabled}">{{ type.label }}</span>
                </label> -->
                <label v-for="type in appTypes" class="radio">
                  <template v-if="$index<=3">
                    <input type="radio" v-model="addModel.type" name="type" :value="$index+1" :disabled="type.disabled"/>
                    <span :class="{'hl-gray': type.disabled}">{{ type.label }}</span>
                  </template>
                  <template v-if="debug && $index>3">
                    <input type="radio" v-model="addModel.type" name="type" :value="$index+1" :disabled="isAppExist($index+1) || type.disabled"/>
                    <span :class="{'hl-gray': isAppExist($index+1) || type.disabled}">{{ type.label }}</span>
                  </template>
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 新增添加应用浮层-->

    <!-- Start: 编辑iOS应用浮层-->
    <modal :show.sync="showEditModal" @close="onEditCancel">
      <h3 slot="header">{{ $t("app.edit_app") }} ({{ editModel.type | typeLabel }})</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit(editModel)" hook="editAppHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("app.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('app.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span><span v-if="editValidation.name.$error.minlength">{{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('app.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("app.inform") }}:</label>
            <div class="controls col-18">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="apn_enable" v-model="editModel.apn_enable"/>{{ $t("app.fields.apn_enable") }}
                </label>
              </div>
            </div>
          </div>
          <div v-show="editModel.apn_enable" class="form-row row">
            <label class="form-control col-6">{{ $t("app.apn_file") }}:</label>
            <div class="controls col-18">
              <div class="row">
                <div class="col-10">
                  <label :class="{'disabled':uploading}" class="btn btn-success btn-upload">
                    <input type="file" v-el:edit-apn-file="v-el:edit-apn-file" name="apnFile" @change.prevent="uploadApn('editModel', 'editApnFile', $event)" :disabled="uploading"/><i class="fa fa-reply-all"></i>{{ uploading ? $t('app.uploading') : $t('app.upload') }}
                  </label>
                </div>
                <div class="col-14">
                  <div v-if="editModel.apn_license_url" class="file-url">url: {{ editModel.apn_license_url }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="editModel.apn_enable" class="form-row row">
            <label class="form-control col-6">{{ $t("app.fields.apn_license_pwd") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('app.placeholders.apn_license_pwd')" class="input-text-wrap">
                <input v-model="editModel.apn_license_pwd" type="text" v-form-ctrl name="apn_license_pwd" class="input-text"/>
              </div>
            </div>
          </div>
          <div v-show="editModel.apn_enable" class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="apn_license_production" v-model="editModel.apn_license_production"/>{{ $t("app.is_release") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("app.del_app") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 编辑iOS应用浮层-->

    <!-- Start: 编辑安卓应用浮层-->
    <modal :show.sync="showEditModal2" @close="onEditCancel2">
      <h3 slot="header">{{ '编辑应用' }} ({{ editModel2.type | typeLabel }})</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation2" @submit.prevent="onEditSubmit(editModel2)" hook="editAppHook2">
          <div class="form-row row">
            <label class="form-control col-7">{{ '应用名称' }}:</label>
            <div class="controls col-17">
              <div v-placeholder="$t('app.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel2.name" type="text" name="name" minlength="2" maxlength="32" v-form-ctrl required lazy class="input-text"/>
              </div>
              <div v-if="editValidation2.$submitted && editValidation2.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation2.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span></div>
              <div v-if="editValidation2.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation2.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span><span v-if="editValidation2.name.$error.minlength">{{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}</span><span v-if="editValidation2.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('app.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">{{ $t("app.inform") }}:</label>
            <div class="controls col-17">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="gcm_enable" v-model="editModel2.android.gcm_enable"/>{{ '启用GooglePlay服务' }}
                </label>
              </div>
            </div>
          </div>
          <div v-show="editModel2.android.gcm_enable" class="form-row row">
            <label class="form-control col-7">Server API Key:</label>
            <div class="controls col-17">
              <div v-placeholder="$t('app.placeholders.apn_license_pwd')" class="input-text-wrap">
                <input v-model="editModel2.android.gcm_api_key" type="text" v-form-ctrl name="gcm_api_key" class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("app.del_app") }}
            </label>
            <button @click.prevent.stop="onEditCancel2" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 编辑安卓应用浮层-->

    <!-- Start: 编辑Web应用浮层 -->
    <modal :show.sync="showEditModal3" @close="onEditCancel3">
      <h3 slot="header">{{ $t("app.edit_app") }} ({{ editModel3.type | typeLabel }})</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation3" @submit.prevent="onEditSubmit(editModel3)" hook="editAppHook3">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("app.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('app.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel3.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation3.$submitted && editValidation3.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation3.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span></div>
              <div v-if="editValidation3.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation3.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span><span v-if="editValidation3.name.$error.minlength">{{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}</span><span v-if="editValidation3.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('app.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("app.fields.url") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('app.placeholders.url')" class="input-text-wrap">
                <input v-model="editModel3.web.url" type="text" v-form-ctrl name="url" minlength="2" lazy class="input-text"/>
              </div>
              <div v-if="editValidation3.$submitted && editValidation3.url.$pristine" class="form-tips form-tips-error"><span v-if="editValidation3.url.$error.required">{{ $t('validation.required', {field: $t('app.fields.url')}) }}</span></div>
              <div v-if="editValidation3.url.$dirty" class="form-tips form-tips-error"><span v-if="editValidation3.url.$error.required">{{ $t('validation.required', {field: $t('app.fields.url')}) }}</span><span v-if="editValidation3.url.$error.minlength">{{ $t('validation.minlength', [ $t('app.fields.url'), 2]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox"><input type="checkbox" name="web_enable" v-model="editModel3.web.web_enable"/>启用</label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("app.del_app") }}
            </label>
            <button @click.prevent.stop="onEditCancel3" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 编辑Web应用浮层 -->

    <!-- Start: 编辑延保管理应用浮层 -->
    <modal :show.sync="showEditModal5" @close="onEditCancel5">
      <h3 slot="header">{{ $t("app.edit_app") }} ({{ editModel5.type | typeLabel }})</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation5" @submit.prevent="onEditSubmit(editModel5)" hook="editAppHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("app.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('app.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel5.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation5.$submitted && editValidation5.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation5.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span></div>
              <div v-if="editValidation5.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation5.name.$error.required">{{ $t('validation.required', {field: $t('app.fields.name')}) }}</span><span v-if="editValidation5.name.$error.minlength">{{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}</span><span v-if="editValidation5.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('app.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("app.del_app") }}
            </label>
            <button @click.prevent.stop="onEditCancel5" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 编辑延保管理应用浮层 -->
  </section>
</template>

<script>
  import Vue from 'vue'
  import locales from '../../consts/locales/index'
  import api from '../../api'
  import Modal from '../../components/Modal'
  import store from '../../store/index'
  import { createPlugin, updatePlugin, removePlugin } from '../../store/actions/plugins'
  import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Applications',

    layout: 'admin',

    mixins: [globalMixins],

    store,

    vuex: {
      getters: {
        plugins: ({ plugins }) => plugins.all
      },
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
      'modal': Modal
    },

    data () {
      return {
        key: {},
        apps: [],
        appTypes: locales[Vue.config.lang].app.types,
        encryptTypes: locales[Vue.config.lang].app.encrypt_types,
        showAddModal: false,
        showEditModal: false,
        showEditModal2: false,
        showEditModal3: false,
        // showEditModal4: false,
        showEditModal5: false,
        addModel: {
          name: '',
          type: 1
        },
        editModel: {
          type: 1
        },
        editModel2: {
          type: 2,
          android: {
            gcm_api_key: '',
            gcm_enable: false
          }
        },
        editModel3: {
          type: 3,
          web: {}
        },
        // editModel4: {
        //   type: 1,
        //   wechat: {
        //     id: '',
        //     app_id: '',
        //     app_secret: '',
        //     encrypt: 1,
        //     key: ''
        //   }
        // },
        editModel5: {
          type: 5
        },
        originAddModel: {},
        originEditModel: {},
        originEditModel2: {},
        originEditModel3: {},
        // originEditModel4: {},
        originEditModel5: {},
        addValidation: {},
        editValidation: {},
        editValidation2: {},
        editValidation3: {},
        // editValidation4: {},
        editValidation5: {},
        adding: false,
        editing: false,
        uploading: false,
        delChecked: false,
        loadingData: false,
        showAlertModal: false,
        showKeyModal: false
      }
    },

    route: {
      data () {
        this.originAddModel = _.clone(this.addModel)
        this.getApps()
      }
    },

    filters: {
      typeLabel (value) {
        return this.appTypes[value - 1].label
      }
    },

    methods: {
      // 获取 APP 列表
      getApps () {
        this.loadingData = true
        api.app.list().then((res) => {
          if (res.status === 200) {
            this.loadingData = false
            this.apps = res.data
          }
        })
      },
      // 查询定制应用是否已创建
      isAppExist (value) {
        var result = false
        this.plugins.forEach((item) => {
          if (item.type > 4) {
            result = true
          }
        })
        return result
      },
      /**
       * 查看密钥
       * @param  {String} accessKey AccessKey
       */
      viewAccessKeys (app) {
        this.key = app
        this.showKeyModal = true
        console.log(this.key.secret)
      },

      // 取消删除确认提醒
      onAlertCancel () {
        this.alertModel = false
        this.editing = false
      },
      // 添加应用表单钩子
      addAppHook (form) {
        this.addForm = form
      },

      // 修改应用表单钩子
      editAppHook (form) {
        this.editForm = form
      },

      // 修改安卓应用表单钩子
      editAppHook2 (form) {
        this.editForm2 = form
      },

      // 修改Web应用表单钩子
      editAppHook3 (form) {
        this.editForm3 = form
      },

      // 修改微信应用表单钩子
      // editAppHook4 (form) {
      //   this.editForm4 = form
      // },

      // 修改安卓应用表单钩子
      editAppHook5 (form) {
        this.editForm5 = form
      },

      // 关闭添加应用浮层并净化添加表单
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
        this.editModel = this.originEditModel
      },

      // 关闭安卓编辑浮层并净化编辑表单
      resetEdit2 () {
        this.editing = false
        this.showEditModal2 = false
        this.delChecked = false
        this.editModel2 = this.originEditModel2
      },

      // 关闭Web编辑浮层并净化编辑表单
      resetEdit3 () {
        this.editing = false
        this.showEditModal3 = false
        this.delChecked = false
        this.editModel3 = this.originEditModel3
      },

      // 关闭微信编辑浮层并净化编辑表单
      // resetEdit4 () {
      //   this.editing = false
      //   this.showEditModal4 = false
      //   this.delChecked = false
      //   this.editModel4 = this.originEditModel4
      // },
      // 关闭安卓编辑浮层并净化编辑表单
      resetEdit5 () {
        this.editing = false
        this.showEditModal5 = false
        this.delChecked = false
        this.editModel5 = this.originEditModel5
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      // 提交添加
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          if (this.addModel.type === 1) { // iOS应用
            this.addModel.apn_enable = false
            this.addModel.apn_license_url = ''
            this.addModel.apn_license_pwd = ''
            this.addModel.apn_license_production = false
          } else if (this.addModel.type === 2) { // 安卓应用
            this.addModel.gcm_api_key = ''
            // this.addModel.gcm_enable = false
          }
          // else if (this.addModel.type === 4) { // 微信应用
          //   this.addModel.wechat = {}
          //   this.addModel.wechat.id = ''
          //   this.addModel.wechat.app_id = ''
          //   this.addModel.wechat.app_secrect = ''
          //   this.addModel.wechat.encrypt = 1
          //   this.addModel.wechat.key = ''
          //   this.addModel.app_url = ''
          // }
          this.adding = true
          api.app.create(this.addModel).then((res) => {
            if (res.status === 200) {
              if (this.addModel.type === 3 || this.addModel.type > 4) {
                this.createPlugin(res.data)
              }
              this.resetAdd()
              this.getApps()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },

      // 初始化应用编辑表单
      onEditApp (app) {
        if (app.type === 1) {
          this.showEditModal = true
          this.editModel = _.cloneDeep(app)
          this.originEditModel = _.cloneDeep(app)
        } else if (app.type === 2) {
          this.showEditModal2 = true
          this.editModel2 = _.cloneDeep(app)
          this.originEditModel2 = _.cloneDeep(app)
        } else if (app.type === 3) {
          this.showEditModal3 = true
          this.editModel3 = _.cloneDeep(app)
          this.originEditModel3 = _.cloneDeep(app)
        } else if (app.type === 5) {
          this.showEditModal5 = true
          this.editModel5 = _.cloneDeep(app)
          this.originEditModel5 = _.cloneDeep(app)
        }
        // else if (app.type === 4) {
        //   this.showEditModal4 = true
        //   this.editModel4 = _.cloneDeep(app)
        //   this.originEditModel4 = _.cloneDeep(app)
        // }
      },

      // 取消应用编辑
      onEditCancel () {
        this.resetEdit()
      },

      // 取消安卓应用编辑
      onEditCancel2 () {
        this.resetEdit2()
      },

      // 取消Web应用编辑
      onEditCancel3 () {
        this.resetEdit3()
      },

      // 取消微信应用编辑
      // onEditCancel4 () {
      //   this.resetEdit4()
      // },
      // 取消安卓应用编辑
      onEditCancel5 () {
        this.resetEdit5()
      },

      // 提交应用更新
      onEditSubmit (model) {
        if (this.delChecked && !this.editing) {
          this.editing = true
          var result = window.confirm('确认删除该应用吗?')
          if (result === true) {
            api.app.remove(model.id).then((res) => {
              if (model.type === 1) {
                this.resetEdit()
              } else if (model.type === 2) {
                this.resetEdit2()
              } else if (model.type === 3) {
                this.removePlugin(model)
                this.resetEdit3()
              } else if (model.type === 5) {
                this.removePlugin(model)
                this.resetEdit5()
              }
              // else if (model.type === 4) {
              //   this.resetEdit4()
              // }
              this.getApps()
            }).catch((res) => {
              this.handleError(res)
              this.editing = false
            })
          } else {
            this.editing = false
          }
          this.showAlertModal = true
        } else if (model.type === 1 && this.editValidation.$valid && !this.editing) {
          this.editing = true
          api.app.update(this.editModel).then((res) => {
            if (res.status === 200) {
              this.getApps()
              this.resetEdit()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (model.type === 2 && this.editValidation2.$valid && !this.editing) {
          this.editing = true
          // var n = { }
          // n.id = this.editModel2.id
          // n.name = this.editModel2.name
          // n.type = this.editModel2.type
          // n.gcm_api_key = this.editModel2.android.gcm_api_key
          // n.gcm_enable = this.editModel2.android.gcm_enable
          api.app.update(this.editModel2).then((res) => {
            if (res.status === 200) {
              this.getApps()
              this.resetEdit2()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (model.type === 3 && this.editValidation3.$valid && !this.editing) {
          this.editing = true
          api.app.update(model).then((res) => {
            if (res.status === 200) {
              this.getApps()
              this.updatePlugin(model)
              this.resetEdit3()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (model.type === 5 && this.editValidation5.$valid && !this.editing) {
          this.editing = true
          // var n = { }
          // n.id = this.editModel2.id
          // n.name = this.editModel2.name
          // n.type = this.editModel2.type
          // n.gcm_api_key = this.editModel2.android.gcm_api_key
          // n.gcm_enable = this.editModel2.android.gcm_enable
          api.app.update(this.editModel5).then((res) => {
            if (res.status === 200) {
              this.getApps()
              this.resetEdit5()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },

      // 上传APN文件
      uploadApn (model, apnFile, event) {
        var file = this.$els[apnFile].files[0]
        var input = event.target

        if (file && file.size > 1024 * 1024) {
          this.showNotice({
            type: 'error',
            content: this.$t('upload.compatiblity')
          })
          return
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('upload.read_err')
            })
          }
          // 读取完成
          reader.onloadend = (evt) => {
            if (evt.target.readyState === window.FileReader.DONE) {
              if (!this.uploading) {
                this.uploading = true
                api.upload.apn(evt.target.result).then((res) => {
                  if (res.status === 200) {
                    input.value = ''
                    this[model].apn_license_url = res.data.url
                    this.uploading = false
                  }
                }).catch((res) => {
                  this.handleError(res)
                  this.uploading = false
                })
              }
            }
          }
          reader.readAsArrayBuffer(file)
        } else {
          this.showNotice({
            type: 'error',
            content: this.$t('upload.compatiblity')
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'
  /*.modal
    .form-edit-apk
      .form-row
        .controls
          width 470px*/

  .secret-key
    font-size 20px
  .modal
    .file-url
      color gray
      line-height 32px
      text-overflow()
</style>
