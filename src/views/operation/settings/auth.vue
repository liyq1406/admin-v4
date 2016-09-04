<template>
  <div class="main">
    <div class="main-title">
      <h2>授权管理</h2>
    </div>
    <div class="tool-bar">
      <div class="tool-list fr">
        <div class="tool-list-item">
          <div class="trigger" @click="toggleList"><i class="fa fa-eye"></i><span class="trigger-text" v-text="newList?'查看V1版本':'返回新版'">查看V1版本</span></div>
        </div>
      </div>
      <div class="tool-list">
        <div class="tool-list-item">
          <div class="trigger" @click="showAddModal=true"><i class="fa fa-plus"></i><span class="trigger-text">添加授权</span></div>
        </div>
      </div>
    </div>
    <div v-if="newList" class="panel mt20">
      <div class="panel-hd">
        <h2>授权列表</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>Access Key ID</th>
                <th class="tac">Access Key Secret</th>
                <th>{{ $t("common.name") }}</th>
                <th class="tac">创建时间</th>
                <th class="tac">操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="accessKeys.length > 0">
                <tr v-for="accessKey in accessKeys">
                  <td>{{ accessKey.id }}</td>
                  <td class="tac">
                    <button @click="viewAccessKeys(accessKey)" class="btn btn-link btn-mini">{{ $t('common.details') }}</button>
                  </td>
                  <td>{{ accessKey.name }}</td>
                  <td>{{ accessKey.create_time }}</td>
                  <td class="tac">
                    <button :class="{'btn-primary': accessKey.status, 'btn-success': !accessKey.status, 'disabled': toggling}" :disabled="toggling" @click="togglekeys(accessKey)" class="btn btn-primary btn-mini"><i :class="{'fa-stop': accessKey.status, 'fa-play': !accessKey.status}" class="fa"></i>{{ accessKey.status ? $t('ui.task.stop') : $t('ui.task.start') }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="accessKeys.length === 0">
                <td colspan="5" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 添加应用浮层-->
      <modal :show.sync="showAddModal" @close="onAddCancel">
        <h3 slot="header">添加授权</h3>
        <div slot="body" class="form">
          <form v-form name="addValidation" @submit.prevent="addKeys" hook="addAppHook">
            <div class="form-row row">
              <label class="form-control col-6">授权名称:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.app.placeholders.name')" class="input-text-wrap">
                  <input v-model="addModel.name" v-form-ctrl type="text" name="name" minlength="2" maxlength="32" required lazy class="input-text"/>
                </div>
                <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.app.fields.name')}) }}</span></div>
                <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.app.fields.name')}) }}</span><span v-if="addValidation.name.$error.maxlength">{{ $t('ui.validation.minlength', [ $t('ui.app.fields.name'), 2]) }}</span><span v-if="addValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.app.fields.name'), 32]) }}</span></div>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </div>
      </modal>
      <pager v-if="!loadingData && accessKeys.length > countPerPage" :total="accessKeys.length" :current.sync="currentPage" :count-per-page="countPerPage">
      </pager>
      <modal :show.sync="showKeyModal">
        <h3 slot="header">Access Key Secret</h3>
        <div slot="body" class="form">
          <div slot="body" class="secret-key tac mrbthr">{{ key.secret }}</div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>删除授权
            </label>
            <button @click="onViewConfirm(key.id)" v-text="deleting ? $t('common.handling') : $t('common.ok')" :disabled="deleting" :class="{'disabled':deleting}" class="btn btn-primary"></button>
          </div>
        </div>
      </modal>
    </div>
    <div v-if="!newList" class="panel">
      <div class="panel-hd">
        <h2>授权列表(V1版本)</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t("common.name") }}</th>
                <th>Access Key ID</th>
                <th class="tac">{{ $t("common.status") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="empowers.length > 0">
                <tr v-for="empower in empowers | limitBy countPerPage (currentPage-1)*countPerPage">
                  <td>{{ empower.name }}</td>
                  <td>{{ empower.access_id }}</td>
                  <td class="tac"><span v-if="empower.status-0===1" class="hl-green">{{ $t("common.enable") }}</span><span v-if="empower.status-0===2" class="hl-gray">{{ $t("common.disabled") }}</span></td>
                </tr>
              </template>
              <tr v-if="empowers.length === 0">
                <td colspan="3" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- <pager v-if="!loadingData && empowers.length > countPerPage" :total="empowers.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager> -->
    </div>
  </div>
</template>

<script>
  /**
   * 页面初始化：
   * 1. 请求授权列表
   *
   * 点击添加按钮：
   *
   * 点击查看：
   *
   * 点击启用/停用按钮：
   *
   */

  import Modal from 'components/Modal'
  import Pager from 'components/Pager'
  import api from 'api'
  import * as config from 'consts/config'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'AuthSettings',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'pager': Pager
    },

    data () {
      return {
        empowers: [
          // {
          //   'name': '1',
          //   'id': '111',
          //   'status': '2'
          // }
        ],
        accessKeys: [
          // {
          //   'id': '1',
          //   'secret': '111',
          //   'name': '111',
          //   'create_time': '111',
          //   'status': 0
          // }
          // {
          //   'id': '2',
          //   'secret': '222',
          //   'name': '222',
          //   'create_time': '222',
          //   'status': 1
          // }
        ],
        showAddModal: false,
        addModel: {
          name: ''
        },
        originAddModel: {},
        addValidation: {},
        adding: false,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        loadingData: false,
        showKeyModal: false,
        key: {},
        delChecked: false,
        deleting: false,
        newList: true
      }
    },

    route: {
      data () {
        // this.getEmpowers()
        // this.getAccessKeys()
        this.getKeys()
      }
    },

    methods: {
      /**
       * 获取 v1 旧版的 AccessKey 列表
       */
      getAccessKeys () {
        this.loadingData = true
        api.empower.getAccessKeys().then((res) => {
          if (res.status === 200) {
            this.empowers = res.data
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      // 切换V1与V2
      toggleList () {
        this.newList = !this.newList
        this.newList ? this.getKeys() : this.getAccessKeys()
      },

      /**
       * 获取 新版的 AccessKey 列表
       */
      getKeys () {
        this.loadingData = true
        api.empower.getKeys().then((res) => {
          if (res.status === 200) {
            this.accessKeys = res.data.list
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      // 提交添加
      addKeys () {
        if (this.addValidation.$valid && !this.adding) {
          var obj = {name: this.addModel.name}
          api.empower.addKeys(obj).then((res) => {
            if (res.status === 200) {
              this.accessKeys.push(res.data)
              this.resetAdd()
              this.getKeys()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },

      /**
       * 确定查看授权
       * @param  {String} id 目标授权id
       * @return {void}
       */
      onViewConfirm (id) {
        if (this.delChecked) {
          this.deleting = true
          api.empower.deleteKeys(id).then((res) => {
            if (res.status === 200) {
              this.getKeys()
              this.onViewCancel()
            }
          }).catch((res) => {
            this.onViewCancel()
            this.handleError(res)
          })
        }
        this.showKeyModal = false
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
      // 切换状态
      togglekeys (accessKey) {
        if (!this.toggling) {
          this.toggling = true
          api.empower.toggleKeys(accessKey.id, !accessKey.status - 0).then((res) => {
            if (res.status === 200) {
              accessKey.status = !accessKey.status - 0
              this.toggling = false
            }
          }).catch((res) => {
            this.handleError(res)
            this.toggling = false
          })
        }
      },

      /**
       * 查看密钥
       * @param  {String} accessKey AccessKey
       */
      viewAccessKeys (accessKey) {
        this.key = accessKey
        this.showKeyModal = true
      },

      /**
       * 取消查看授权
       * @return {void}
       */
      onViewCancel () {
        this.deleting = false
        this.delChecked = false
        this.showKeyModal = false
      },
      // 获取V1列表
      getEmpowers () {
        this.loadingData = true
        api.empower.getEmpowers().then((res) => {
          if (res.status === 200) {
            this.empowers = res.data
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      }

    }
  }
</script>

<style lang="stylus" scoped>
  .secret-key
    font-size 20px
  .mrbthr
    margin-bottom 30px
</style>
