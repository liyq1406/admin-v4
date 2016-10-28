<template>
  <section>
    <div class="panel">
      <div class="panel-hd">
        <div class="actions">
          <button @click="showAddModal = true" class="btn btn-primary"><i class="fa fa-plus"></i>添加标签</button>
        </div>
        <h2>标签列表</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t('ui.tags.fields.name') }}</th>
                <th class="tac">{{ $t('common.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="tags && tags.length > 0">
                <tr v-for="tag in tags">
                  <td>{{ tag.label }}</td>
                  <td class="tac">
                    <button class="btn btn-link btn-mini" @click="editTag(tag, $index)">编辑</button>
                  </td>
                </tr>
              </template>
              <tr v-if="tags && tags.length === 0 && !loadingData">
                <td colspan="2" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getTags"></pager>
      </div>
    </div>

    <!-- 添加标签浮窗 -->
    <modal :show.sync="showAddModal" width="380px">
      <h3 slot="header">添加标签</h3>
      <div slot="body" class="form">
        <form autocomplete="off" v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t('ui.tags.fields.name') }}:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="addModel.name" type="text" v-form-ctrl name="name" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.tags.fields.name')}) }}</span>
              </div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.tags.fields.name')}) }}</span>
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

    <!-- 修改标签浮窗 -->
    <modal :show.sync="showEditModal" width="380px">
      <h3 slot="header">修改标签</h3>
      <div slot="body" class="form">
        <form autocomplete="off" v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t('ui.tags.fields.name') }}:</label>
            <div class="controls col-18">
              <div class="input-text-wrap">
                <input v-model="editModel.label" type="text" v-form-ctrl name="name" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error">
                <span v-if="editValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.tags.fields.name')}) }}</span>
              </div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error">
                <span v-if="editValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.tags.fields.name')}) }}</span>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>删除标签
            </label>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>
  </section>
</template>

<script>
  // import Vue from 'vue'
  // import locales from 'consts/locales/index'
  import * as config from 'consts/config'
  import Modal from 'components/Modal'
  import Pager from 'components/Pager'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'
  import { pluginMixins } from '../mixins'
  import api from 'api'

  export default {
    name: 'Tags',

    mixins: [globalMixins, pluginMixins],

    components: {
      'modal': Modal,
      'pager': Pager
    },

    data () {
      return {
        tags: [],
        total: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        loadingData: false,
        showAddModal: false,
        showEditModal: false,
        addModel: {
          name: ''
        },
        editModel: {},
        editIndex: -1,
        originAddModel: {},
        originEditModel: {},
        addValidation: {},
        editValidation: {},
        delChecked: false,
        adding: false,
        editing: false
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {}
        }
        return condition
      }
    },

    route: {
      data () {
        this.getTags()
      }
    },

    ready () {
      this.originAddModel = _.clone(this.addModel)
    },

    methods: {
      /**
       * 获取标签列表
       */
      getTags () {
        this.loadingData = true
        var self = this
        var argvs = arguments
        var fn = self.getTags
        this.getAppToKen(this.$route.params.app_id, 'helpdesk').then((token) => {
          api.helpdesk.getFeedbackLabel(this.$route.params.app_id, token, this.queryCondition).then((res) => {
            if (res.status === 200 && res.data.list.length > 0) {
              this.tags = res.data.list
              this.total = res.data.count
            } else {
              this.tags = []
            }
            this.loadingData = false
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'helpdesk'
            }
            self.handlePluginError(err, env)
            this.loadingData = false
          })
        })
      },

      // 添加表单钩子
      addFormHook (form) {
        this.addForm = form
      },

      // 编辑表单钩子
      editFormHook (form) {
        this.editForm = form
      },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 关闭添加浮层并净化添加表单
      resetEdit () {
        this.editing = false
        this.showEditModal = false
        this.delChecked = false
        this.editModel = _.clone(this.originEditModel)
      },

      /**
       * 取消添加
       */
      onAddCancel () {
        this.resetAdd()
      },

      /**
       * 添加操作
       */
      onAddSubmit () {
        var self = this
        var argvs = arguments
        var fn = self.onAddSubmit
        var params = {
          label: this.addModel.name
        }
        this.getAppToKen(this.$route.params.app_id, 'helpdesk').then((token) => {
          this.adding = true
          api.helpdesk.saveFeedbackLabel(this.$route.params.app_id, token, params).then((res) => {
            if (res.status === 200) {
              self.resetAdd()
              self.getTags()
            }
            self.adding = false
          }).catch((err) => {
            var env = {
              'fn': fn,
              'argvs': argvs,
              'context': self,
              'plugin': 'helpdesk'
            }
            self.resetAdd()
            self.handlePluginError(err, env)
          })
        })
      },

      /**
       * 编辑标签
       * @param  {Objedt} tag 目标标签
       * @param  {Number} index 目标标签索引
       */
      editTag (tag, index) {
        this.editModel = _.clone(tag)
        this.originEditModel = _.clone(tag)
        this.editIndex = index
        this.showEditModal = true
      },

      /**
       * 取消编辑
       */
      onEditCancel () {
        this.resetEdit()
      },

      // 提交编辑表单
      onEditSubmit () {
        var self = this
        var argvs = arguments
        var fn = self.onEditSubmit
        if (this.delChecked && !this.editing) { // 删除
          this.editing = true
          this.getAppToKen(this.$route.params.app_id, 'helpdesk').then((token) => {
            api.helpdesk.delFeedbackLabel(this.$route.params.app_id, token, this.editModel._id).then((res) => {
              if (res.status === 200) {
                this.resetEdit()
                this.delChecked = false
                this.getTags()
              }
            }).catch((err) => {
              var env = {
                'fn': fn,
                'argvs': argvs,
                'context': self,
                'plugin': 'helpdesk'
              }
              self.handlePluginError(err, env)
              this.editing = false
            })
          })
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true
          this.getAppToKen(this.$route.params.app_id, 'helpdesk').then((token) => {
            var params = {
              label: this.editModel.label
            }
            api.helpdesk.putFeedbackLabel(this.$route.params.app_id, token, this.editModel._id, params).then((res) => {
              if (res.status === 200) {
                this.resetEdit()
                this.getTags()
              }
            }).catch((err) => {
              var env = {
                'fn': fn,
                'argvs': argvs,
                'context': self,
                'plugin': 'helpdesk'
              }
              self.handlePluginError(err, env)
              this.editing = false
            })
          })
        }
      } // onEditSubmit end
    }
  }
</script>
