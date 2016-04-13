<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("rule.add_rule") }}</button>
          </div>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>{{ $t("rule.fields.name") }}</th>
              <th>{{ $t("rule.fields.type") }}</th>
              <th>{{ $t("rule.fields.content") }}</th>
              <th>{{ $t("common.status") }}</th>
              <th class="tac">{{ $t("common.action") }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="rules.length > 0 && !loadingData">
              <tr v-for="rule in rules">
                <td>{{* rule.name }}</td>
                <td>{{* rule.type | ruleLabel }}</td>
                <td>{{* rule.content }}</td>
                <td><span v-if="rule.is_enable" class="hl-green">{{ $t("common.enable") }}</span><span v-else="v-else" class="hl-gray">{{ $t("common.disabled") }}</span></td>
                <td class="tac">
                  <button @click="editRule(rule)" class="btn btn-link btn-sm">{{ $t("common.edit") }}</button>
                </td>
              </tr>
            </template>
            <tr v-if="loadingData">
              <td colspan="5" class="tac">
                <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
              </td>
            </tr>
            <tr v-if="rules.length === 0 && !loadingData">
              <td colspan="5" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 分页-->
        <pager v-if="!loadingData" :total="rules.length" :current.sync="currentPage" :page-count="pageCount"></pager>
      </div>
    </div>
    <!-- 添加规则浮层-->
    <modal :show.sync="showAddModal" :width="650" :flag="addModelEditingTag" @close="onAddCancel">
      <h3 slot="header">{{ $t("rule.add_rule") }}</h3>
      <div slot="body" class="form form-rules">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.name") }}:</label>
            <div class="controls">
              <div v-placeholder="$t('rule.placeholders.name')" class="input-text-wrap">
                <input v-model="addModel.name" type="text" v-form-ctrl name="name" required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('validation.required', {field: $t('rule.fields.name')}) }}</span></div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('validation.required', {field: $t('rule.fields.name')}) }}</span><span v-if="addValidation.name.$error.minlength">{{ $t('validation.minlength', [ $t('rule.fields.name'), 2]) }}</span><span v-if="addValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('rule.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row condition-row">
            <label class="form-control">{{ $t("rule.condition") }}:</label>
            <div class="controls">
              <div class="type">
                <div class="select">
                  <select v-model="addModel.type" v-form-ctrl name="type" number="number" @input="onSelectType">
                    <option v-for="type in ruleTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </div>
              </div>
              <div v-show="addModel.type === 1" class="data">
                <div class="select">
                  <select v-model="addModel.param" v-form-ctrl name="param">
                    <option v-for="option in datapoints" v-bind:value="option.id">{{ option.name }}</option>
                  </select>
                </div>
              </div>
              <div v-show="addModel.type === 1" class="compare">
                <div class="select">
                  <select v-model="addModel.compare" v-form-ctrl name="compare" number="number">
                    <option v-for="type in compareTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </div>
              </div>
              <div v-if="addModel.type === 1" class="value">
                <div class="input-text-wrap">
                  <input v-model="addModel.value" type="text" v-form-ctrl name="value" required lazy class="input-text"/>
                </div>
              </div>
              <div v-if="addModel.type === 2" class="value">
                <div class="select">
                  <select v-model="addModel.value" v-form-ctrl name="value">
                    <option value="online">{{ $t("common.online") }}</option>
                    <option value="offline">{{ $t("common.offline") }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.content") }}:</label>
            <div class="controls">
              <div v-placeholder="$t('rule.placeholders.content')" class="input-text-wrap">
                <textarea v-model="addModel.content" type="text" v-form-ctrl name="content" required maxlength="250" lazy class="input-text"></textarea>
              </div>
              <div v-if="addValidation.$submitted && addValidation.content.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.content.$error.required">{{ $t('validation.required', {field: $t('rule.fields.content')}) }}</span></div>
              <div v-if="addValidation.content.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.content.$error.required">{{ $t('validation.required', {field: $t('rule.fields.content')}) }}</span><span v-if="addValidation.content.$error.maxlength">{{ $t('validation.maxlength', [ $t('rule.fields.content'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.inform_type") }}:</label>
            <div class="controls">
              <div class="select">
                <select v-model="addModel.notify_type" v-form-ctrl name="notify_type" number="number">
                  <option v-for="type in informTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row tag-row">
            <label class="form-control">{{ $t("rule.fields.tags") }}:</label>
            <div class="controls">
              <tag-input :value.sync="addModel.tag" :candidate="candidateTags" :editing.sync="addModelEditingTag" @adding-tag="showAddModal = true"></tag-input>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.notify_type") }}:</label>
            <div class="controls">
              <div class="checkbox-group">
                <label v-for="type in notifyTypes" class="checkbox">
                  <input type="checkbox" v-model="addModel.notify_target" name="notify_target" :value="$index+1" number="number"/>{{ type }}
                </label>
              </div>
              <div v-show="showApps('addModel')" class="apn-list">
                <div class="checkbox-group">
                  <label v-for="app in apps" v-if="app.type===1" class="checkbox">
                    <input type="checkbox" v-model="addModel.notify_apps" name="notify_apps" :value="app.id" number="number"/>{{ app.name }}
                  </label>
                </div>
              </div>
              <div v-show="showAndroids('addModel')" class="apn-list">
                <div class="checkbox-group">
                  <label v-for="app in apps" v-if="app.type===2" class="checkbox">
                    <input type="checkbox" v-model="addModel.notify_apps" name="notify_apps" :value="app.id" number="number"/>{{ app.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.scope") }}:</label>
            <div class="controls">
              <div class="radio-group">
                <label v-for="type in scopeTypes" class="radio">
                  <input type="radio" v-model="addModel.scope" name="addModel.scope" :value="$index+1" number="number"/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("common.status") }}:</label>
            <div class="controls">
              <div class="radio-group">
                <label class="radio">
                  <input type="radio" v-model="addModel.is_enable" name="is_enable" :value="false"/>{{ $t("common.disabled") }}
                </label>
                <label class="radio">
                  <input type="radio" v-model="addModel.is_enable" name="is_enable" :value="true"/>{{ $t("common.enable") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="reset" @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 编辑规则浮层-->
    <modal :show.sync="showEditModal" :width="650" :flag="editModelEditingTag">
      <h3 slot="header">{{ $t("rule.edit_rule") }}</h3>
      <div slot="body" class="form form-rules">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.name") }}:</label>
            <div class="controls">
              <div v-placeholder="$t('rule.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel.name" type="text" v-form-ctrl name="name" required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('rule.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('rule.fields.name')}) }}</span><span v-if="editValidation.name.$error.minlength">{{ $t('validation.minlength', [ $t('rule.fields.name'), 2]) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('rule.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row condition-row">
            <label class="form-control">{{ $t("rule.condition") }}:</label>
            <div class="controls">
              <div class="type">
                <div class="select">
                  <select v-model="editModel.type" v-form-ctrl name="type" number="number" @input="onSelectType">
                    <option v-for="type in ruleTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </div>
              </div>
              <div v-show="editModel.type === 1" class="data">
                <div class="select">
                  <select v-model="editModel.param" v-form-ctrl name="param">
                    <option v-for="option in datapoints" v-bind:value="option.id">{{ option.name }}</option>
                  </select>
                </div>
              </div>
              <div v-show="editModel.type === 1" class="compare">
                <div class="select">
                  <select v-model="editModel.compare" v-form-ctrl name="compare" number="number">
                    <option v-for="type in compareTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </div>
              </div>
              <div v-if="editModel.type === 1" class="value">
                <div class="input-text-wrap">
                  <input v-model="editModel.value" type="text" v-form-ctrl name="value" required lazy class="input-text"/>
                </div>
              </div>
              <div v-if="editModel.type === 2" class="value">
                <div class="select">
                  <select v-model="editModel.value" v-form-ctrl name="value">
                    <option value="online">{{ $t("common.online") }}</option>
                    <option value="offline">{{ $t("common.offline") }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.content") }}:</label>
            <div class="controls">
              <div v-placeholder="'请输入告警内容'" class="input-text-wrap">
                <textarea v-model="editModel.content" type="text" v-form-ctrl name="content" required maxlength="250" lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted && editValidation.content.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.content.$error.required">{{ $t('validation.required', {field: $t('rule.fields.content')}) }}</span></div>
              <div v-if="editValidation.content.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.content.$error.required">{{ $t('validation.required', {field: $t('rule.fields.content')}) }}</span><span v-if="editValidation.content.$error.maxlength">{{ $t('validation.maxlength', [ $t('rule.fields.content'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.inform_type") }}:</label>
            <div class="controls">
              <div class="select">
                <select v-model="editModel.notify_type" v-form-ctrl name="notify_type" number="number">
                  <option v-for="type in informTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row tag-row">
            <label class="form-control">{{ $t("rule.fields.tags") }}:</label>
            <div class="controls">
              <tag-input :value.sync="editModel.tag" :candidate="candidateTags" :editing.sync="editModelEditingTag" @adding-tag="showEditModal = true"></tag-input>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.notify_type") }}:</label>
            <div class="controls">
              <div class="checkbox-group">
                <label v-for="type in notifyTypes" class="checkbox">
                  <input type="checkbox" v-model="editModel.notify_target" name="notify_target" :value="$index+1" number="number"/>{{ type }}
                </label>
              </div>
              <div v-show="showApps('editModel')" class="apn-list">
                <div class="checkbox-group">
                  <label v-for="app in apps" v-if="app.type===1" class="checkbox">
                    <input type="checkbox" v-model="editModel.notify_apps" name="notify_apps" :value="app.id" number="number"/>{{ app.name }}
                  </label>
                </div>
              </div>
              <div v-show="showAndroids('editModel')" class="apn-list">
                <div class="checkbox-group">
                  <label v-for="app in apps" v-if="app.type===2" class="checkbox">
                    <input type="checkbox" v-model="editModel.notify_apps" name="notify_apps" :value="app.id" number="number"/>{{ app.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("rule.fields.scope") }}:</label>
            <div class="controls">
              <div class="radio-group">
                <label v-for="type in scopeTypes" class="radio">
                  <input type="radio" v-model="editModel.scope" name="scope" :value="$index+1" number="number"/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("common.status") }}:</label>
            <div class="controls">
              <div class="radio-group">
                <label class="radio">
                  <input type="radio" v-model="editModel.is_enable" name="is_enable" :value="false"/>{{ $t("common.disabled") }}
                </label>
                <label class="radio">
                  <input type="radio" v-model="editModel.is_enable" name="is_enable" :value="true"/>{{ $t("common.enable") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("rule.del_rule") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api'
  import locales from '../../consts/locales/index'
  import Pager from '../../components/Pager'
  import Modal from '../../components/Modal'
  import TagInput from '../../components/TagInput'
  import _ from 'lodash'

  export default {
    name: 'Alert',

    components: {
      'modal': Modal,
      'pager': Pager,
      'tag-input': TagInput
    },

    data () {
      return {
        rules: [],            // 规则列表
        apps: [],              // app 列表
        ruleTypes: locales[Vue.config.lang].rule.types,
        compareTypes: locales[Vue.config.lang].rule.compare_types,
        informTypes: locales[Vue.config.lang].rule.inform_types,
        notifyTypes: locales[Vue.config.lang].rule.notify_types,
        scopeTypes: locales[Vue.config.lang].rule.scope_types,
        datapoints: [],       // 数据端点
        currentPage: 1,       // 当前页
        pageCount: 10,        // 每页记录数
        showAddModal: false,  // 是否显示添加浮层
        showEditModal: false, // 是否显示编辑浮层
        candidateTags: locales[Vue.config.lang].rule.candidate_tags,      // 候选标签
        addModel: {           // 添加数据模型
          product_id: this.$route.params.id,
          name: '',
          tag: '',
          type: 1,
          notify_target: [],
          notify_apps: [],
          notify_type: 1,
          compare: 1,
          value: '0',
          scope: 1,
          is_enable: true,
          content: ''
        },
        addValidation: {},    // 添加验证
        editValidation: {},   // 修改验证
        addModelEditingTag: false, // 是否正在编辑添加浮层的标签
        editModelEditingTag: false, // 是否正在编辑编辑浮层的标签
        editModel: {
          tag: ''
        },
        delChecked: false,    // 是否删除
        adding: false,
        editing: false,
        addForm: {},
        editForm: {},
        originAddModel: {},
        originEditModel: {},
        loadingData: false
      }
    },

    route: {
      data () {
        this.originAddModel = _.cloneDeep(this.addModel)
        this.getDatapoints().then((res) => {
          if (res.status === 200) {
            this.datapoints = res.data
            this.addModel.param = res.data[0].id
          }
        })
        this.getRules()
        this.getApps()
      }
    },

    filters: {
      ruleLabel (value) {
        return this.ruleTypes[value - 1]
      }
    },

    methods: {
      // 获取数据端点列表
      getDatapoints () {
        return api.product.getDatapoints(this.$route.params.id)
      },

      // 获取告警规则列表
      getRules () {
        this.loadingData = true
        api.alert.getRules(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.rules = res.data
            this.loadingData = false
          }
        }).catch((error) => {
          this.handleError(error)
          this.loadingData = false
        })
      },

      // 获取 APP 列表
      getApps () {
        api.app.list().then((res) => {
          if (res.status === 200) {
            this.apps = res.data
          }
        })
      },

      // 是否显示 APN推送
      showApps (model) {
        return _.includes(this[model].notify_target, 4)
      },

      // 是否显示 Google推送
      showAndroids (model) {
        return _.includes(this[model].notify_target, 5)
      },
      // 选择告警类型
      onSelectType () {
        if (this.addModel.type === 1) {
          this.addModel.compare = 1
          this.addModel.value = 'online'
        } else {
          this.addModel.value = ''
        }
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
        this.addModel = _.cloneDeep(this.originAddModel)
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.delChecked = false
        this.showEditModal = false
        this.editModel = this.originEditModel
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          api.alert.addRule(this.addModel).then((res) => {
            if (res.status === 200) {
              this.getRules()
              this.resetAdd()
            }
          }).catch((error) => {
            this.handleError(error)
            this.adding = false
          })
        }
      },

      // 初始化编辑表单
      editRule (rule) {
        this.showEditModal = true
        this.editModel = _.clone(rule)
        this.originEditModel = _.clone(rule)
      },

      // 取消编辑
      onEditCancel () {
        this.resetEdit()
      },

      // 提交编辑表单
      onEditSubmit () {
        if (this.delChecked && !this.editing) { // 删除
          this.editing = true
          api.alert.deleteRule(this.editModel.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getRules()
            }
          }).catch((error) => {
            this.handleError(error)
            this.editing = false
          })
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true
          api.alert.updateRule(this.editModel, this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getRules()
            }
          }).catch((error) => {
            this.handleError(error)
            this.editing = false
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'

  .modal
    .form-rules
      .form-row
        .controls
          width 480px !important

      .tag-row
        overflow-y visible

      .apn-list
        background #FFF
        border 1px solid #DDD
        padding 5px 10px

      .condition-row
        .type
        .data
        .compare
        .value
          float left

        .type
          width 110px
          margin-right 10px

        .data
          width 140px
          margin-right 10px

        .compare
          width 80px
          margin-right 10px

        .value
          width 120px

</style>
