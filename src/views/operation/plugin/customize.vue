<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("ui.app.create_app") }}</button>
          </div>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t("ui.app.fields.id") }}</th>
                <th>{{ $t("ui.app.fields.name") }}</th>
                <th class="tac">Access Key Secret</th>
                <th>{{ $t("ui.app.fields.type") }}</th>
                <th>{{ $t("ui.app.fields.create_time") }}</th>
                <th class="tac">{{ $t("common.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="apps.length > 0">
                <tr v-for="app in apps">
                  <td>{{ app.id }}</td>
                  <td>{{ app.name }}</td>
                  <td class="tac">
                    <button @click="viewAccessKeys(app)" class="btn btn-link btn-mini">{{ $t('common.details') }}</button>
                  </td>
                  <td>{{ app.type | typeLabel }}</td>
                  <td>{{ app.create_time | formatDate }}</td>
                  <td class="tac">
                    <button v-if="app.type===1" v-link="{ path: '/plugins/ios/'+app.id+'/settings' }" class="btn btn-link btn-mini">{{ $t("common.config") }}</button>
                    <button v-if="app.type===2" v-link="{ path: '/plugins/android/'+app.id+'/settings' }" class="btn btn-link btn-mini">{{ $t("common.config") }}</button>
                    <button v-if="app.type===4" v-link="{ path: '/plugins/wechat/'+app.id+'/settings' }" class="btn btn-link btn-mini">{{ $t("common.config") }}</button>
                    <button v-if="app.type===3" v-link="{ path: '/plugins/web/'+app.id+'/settings' }" class="btn btn-link btn-mini">{{ $t("common.config") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="apps.length === 0 && !loadingData">
                <td colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
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
      <h3 slot="header">{{ $t("ui.app.create_app") }}</h3>
      <div slot="body" class="form">
        <form autocomplete="off" v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addAppHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.app.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.app.placeholders.name')" class="input-text-wrap">
                <input v-model="addModel.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" custom-validator="noSpacesPrefixAndSuffix" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.app.fields.name')}) }}</span>
              </div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.app.fields.name')}) }}</span>
                <span v-if="addValidation.name.$error.minlength">{{ $t('common.validation.minlength', [ $t('ui.app.fields.name'), 2]) }}</span>
                <span v-if="addValidation.name.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('ui.app.fields.name'), 32]) }}</span>
                <span v-if="addValidation.name.$error.customValidator">{{ $t('common.validation.format', {field: $t('ui.app.fields.name')}) }}</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.app.fields.type") }}:</label>
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
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 新增添加应用浮层-->
  </div>
</template>

<script>
  import Vue from 'vue'
  import locales from 'consts/locales/index'
  import api from 'api'
  import Modal from 'components/Modal'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Applications',

    mixins: [globalMixins],

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
        appTypes: locales[Vue.config.lang].data.APP_TYPES,
        encryptTypes: locales[Vue.config.lang].data.APP_ENCRYPT_TYPES,
        showAddModal: false,
        addModel: {
          name: '',
          type: 1
        },
        originAddModel: {},
        addValidation: {},
        adding: false,
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
        if (value > 4) {
          return ''
        }
        return this.appTypes[value - 1].label
      }
    },

    methods: {
      // 获取 APP 列表
      getApps () {
        this.loadingData = true
        api.plugin.all().then((res) => {
          if (res.status === 200) {
            this.loadingData = false
            this.apps = _.filter(res.data.list, (item) => {
              return item.type !== 10
            })
          }
        })
      },
      // 查询定制应用是否已创建
      isAppExist (value) {
        var result = false
        this.plugins.forEach((item) => {
          if (item.type === 10) {
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

      // 关闭添加应用浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      // 提交添加
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          if (this.addModel.type === 1) { // iOS应用
            this.addModel.plugin = 'ios'
          } else if (this.addModel.type === 2) { // 安卓应用
            this.addModel.plugin = 'android'
          } else if (this.addModel.type === 3) { // web应用
            this.addModel.plugin = 'web'
          } else if (this.addModel.type === 4) { // 微信应用
            this.addModel.plugin = 'wechat'
          }
          this.adding = true
          api.plugin.create(this.addModel).then((res) => {
            if (res.status === 200) {
              this.createPlugin(res.data)
              this.resetAdd()
              this.getApps()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'
  /*.modal
    .form-edit-apk
      .form-row
        .controls
          width 470px*/

  .secret-key
    font-size 20px
</style>
