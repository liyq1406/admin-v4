<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click="addModal.show = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("table.create_table") }}</button>
          </div>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t("table.fields.name") }}</th>
                <th>{{ $t("table.fields.type") }}</th>
                <th class="tac">{{ $t("common.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="tables.length > 0">
                <tr v-for="table in tables | limitBy pageCount (currentPage-1)*pageCount">
                  <td><a v-link="{path: '/data/tables/' + table.name}" class="hl-red">{{ table.name }}</a></td>
                  <td><span>{{ tableTypes[table.type-1] }}</span></td>
                  <td class="tac">
                    <button @click="editTable(table)" class="btn btn-link btn-mini">{{ $t("common.edit") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="tables.length === 0 && !loadingData">
                <td colspan="3" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="tables.length > pageCount" :total="tables.length" :current.sync="currentPage" :page-count="pageCount"></pager>
      </div>
    </div>

    <!-- Start: 添加数据表浮层 -->
    <modal :show.sync="addModal.show" @close="onAddCancel">
      <h3 slot="header">{{ $t("table.create_table") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("table.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('table.placeholders.name')" class="input-text-wrap">
                <input v-model="addModal.model.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="64" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('validation.required', {field: $t('table.fields.name')}) }}</span>
              </div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('validation.required', {field: $t('table.fields.name')}) }}</span>
                <span v-if="addValidation.name.$error.minlength">{{ $t('validation.minlength', [ $t('table.fields.name'), 2]) }}</span>
                <span v-if="addValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('table.fields.name'), 64]) }}</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("table.fields.type") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :label="tableTypes[addModal.model.type-1]">
                  <select v-model="addModal.model.type" v-form-ctrl name="type" number>
                    <option v-for="type in tableTypes" :value="$index + 1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("table.fields.permission") }}:</label>
            <div class="controls col-18">
              <div class="checkbox-group">
                <label v-for="type in permissionTypes" class="checkbox">
                  <input type="checkbox" v-model="addModal.model.permission" name="permission" :value="type.value"/>{{ type.label }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("table.fields.field") }}:</label>
            <div class="controls col-18">
              <div v-for="field in addModal.fields" class="field-row row">
                <div class="col-11">
                  <div class="input-text-wrap">
                    <input v-model="field.name" type="text" class="input-text input-text-sm"/>
                  </div>
                </div>
                <div class="col-11">
                  <div class="ml10">
                    <v-select :label="getTypeLabelByValue(field.value)" size="small">
                      <select v-model="field.value">
                        <option v-for="type in fieldTypes" :value="type.value">{{ type.label }}</option>
                      </select>
                    </v-select>
                  </div>
                </div>
                <div class="col-2">
                  <span @click="removeField(field, addModal.fields)" class="fa fa-times"></span>
                </div>
              </div>
              <button @click.prevent.stop="createField(addModal.fields, $event)" :disabled="!canCreateAddFields" class="btn btn-success" :class="{'disabled':!canCreateAddFields}">{{ $t("table.add_field") }}</button>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 添加数据表浮层 -->

    <!-- Start: 修改数据表浮层 -->
    <modal :show.sync="editModal.show" @close="onEditCancel">
      <h3 slot="header">{{ $t("table.edit_table") }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("table.fields.name") }}:</label>
            <div class="controls col-18">
              <span class="control-text">{{ editModal.model.name }}</span>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("table.fields.type") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :label="tableTypes[editModal.model.type-1]">
                  <select v-model="editModal.model.type" v-form-ctrl name="type" number>
                    <option v-for="type in tableTypes" :value="$index + 1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("table.fields.permission") }}:</label>
            <div class="controls col-18">
              <div class="checkbox-group">
                <label v-for="type in permissionTypes" class="checkbox">
                  <input type="checkbox" v-model="editModal.model.permission" name="permission" :value="type.value"/>{{ type.label }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("table.fields.field") }}:</label>
            <div class="controls col-18">
              <div v-for="field in editModal.fields" class="field-row row">
                <div class="col-11">
                  <div class="input-text-wrap">
                    <input v-model="field.name" type="text" class="input-text-sm input-text"/>
                  </div>
                </div>
                <div class="col-11">
                  <div class="ml10">
                    <v-select :label="getTypeLabelByValue(field.value)" size="small">
                      <select v-model="field.value">
                        <option v-for="type in fieldTypes" :value="type.value">{{ type.label }}</option>
                      </select>
                    </v-select>
                  </div>
                </div>
                <div class="col-2">
                  <span @click="removeField(field, editModal.fields)" class="fa fa-times"></span>
                </div>
              </div>
              <button @click.prevent.stop="createField(editModal.fields, $event)" :disabled="!canCreateEditFields" class="btn btn-success" :class="{'disabled':!canCreateEditFields}">{{ $t("table.add_field") }}</button>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("table.del_table") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 修改数据表浮层 -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api'
  import Pager from '../../components/Pager'
  import Modal from '../../components/Modal'
  import Select from '../../components/Select'
  import locales from '../../consts/locales/index'
  import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'DataTables',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'pager': Pager,
      'v-select': Select
    },

    data () {
      return {
        tables: [],
        tableTypes: locales[Vue.config.lang].table.types,
        fieldTypes: locales[Vue.config.lang].table.field_types,
        permissionTypes: locales[Vue.config.lang].table.permission_types,
        currentPage: 1,
        pageCount: 10,
        addModal: {
          show: false,
          model: {
            name: '',
            type: 1,
            permission: [],
            field: {}
          },
          fields: []
        },
        editModal: {
          show: false,
          model: {},
          fields: []
        },
        originAddModel: {
          name: '',
          type: 1,
          permission: [],
          field: {}
        },
        originEditModel: {},
        addValidation: {},
        editValidation: {},
        delChecked: false,
        adding: false,
        editing: false,
        loadingData: false
      }
    },

    route: {
      data () {
        this.getTables()
      }
    },

    computed: {
      // 是否可以在添加浮层里面创建字段
      canCreateAddFields () {
        var names = _.uniq(_.compact(_.map(this.addModal.fields, 'name')))
        return names.length === this.addModal.fields.length
      },

      // 是否可以在编辑浮层里面创建字段
      canCreateEditFields () {
        var names = _.uniq(_.compact(_.map(this.editModal.fields, 'name')))
        return names.length === this.editModal.fields.length
      }
    },

    methods: {
      /**
       * 根据 value 获取对应的 label
       * @param  {String} value 值
       * @return {String}
       */
      getTypeLabelByValue (value) {
        var result = _.find(this.fieldTypes, (type) => {
          return type.value === value
        })
        return result.label
      },

      /**
       * 获取数据表
       */
      getTables () {
        this.loadingData = true
        api.dataTable.getTables().then((res) => {
          if (res.status === 200) {
            this.tables = res.data
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      /**
       * 创建字段
       * @param  {Array} fields  字段列表
       * @param  {DomEvent} ev   DOM 事件
       */
      createField (fields, ev) {
        fields.push({ name: '', value: 'string' })
        // 聚焦新添加的输入框
        this.$nextTick(() => {
          var inputs = ev.target.parentNode.getElementsByTagName('input')
          var lastInput = inputs[inputs.length - 1]
          lastInput.focus()
        })
      },

      /**
       * 移除字段
       * @param  {Object} field  需要移除的字段
       * @param  {Array}  fields 字段列表
       */
      removeField (field, fields) {
        fields.$remove(field)
      },

      /**
       * 添加表单钩子
       * @param  {Form} form   表单
       */
      addFormHook (form) {
        this.addForm = form
      },

      /**
       * 编辑表单钩子
       * @param  {Form} form   表单
       */
      editFormHook (form) {
        this.editForm = form
      },

      /**
       * 关闭添加浮层并净化添加表单
       */
      _resetAdd () {
        this.adding = false
        this.addModal.show = false
        this.addModal.model = _.clone(this.originAddModel)
        this.addModal.fields = []
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      /**
       * 关闭编辑浮层并净化编辑表单
       */
      _resetEdit () {
        this.editing = false
        this.editModal.show = false
        this.delChecked = false
        this.editModal.model = _.clone(this.originEditModel)
        this.editModal.model.permission = _.clone(this.originEditModel.permission)
        this.newField = { name: '', value: 'string' }
      },

      /**
       * 取消添加
       */
      onAddCancel () {
        this._resetAdd()
      },

      /**
       * 添加操作
       */
      onAddSubmit () {
        // 如果字段名称为空或重复，则不允许表单提交
        if (!this.canCreateAddFields) {
          this.showNotice({
            type: 'error',
            content: '字段名称不允许为空或重复'
          })
          return
        }

        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          this.addModal.model.name.trim()
          this.addModal.model.field = {}
          this.addModal.fields.forEach((item) => {
            this.addModal.model.field[item.name] = item.value
          })
          api.dataTable.createTable(this.addModal.model).then((res) => {
            if (res.status === 200) {
              this.getTables()
              this._resetAdd()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },

      // 编辑数据表
      /**
       * 编辑数据表
       * @param  {Object} table 数据表
       */
      editTable (table) {
        this.editModal.show = true
        this.editModal.model = _.clone(table)
        this.editModal.model.permission = _.clone(table.permission)
        this.originEditModel = _.clone(table)
        this.originEditModel.permission = _.clone(table.permission)
        this.editModal.fields = []
        for (var key in this.editModal.model.field) {
          if (this.editModal.model.field.hasOwnProperty(key)) {
            this.editModal.fields.push({
              name: key,
              value: this.editModal.model.field[key]
            })
          }
        }
      },

      /**
       * 取消编辑
       */
      onEditCancel () {
        this._resetEdit()
      },

      /**
       * 提交更新
       */
      onEditSubmit () {
        // 如果字段名称为空或重复，则不允许表单提交
        if (!this.delChecked && !this.canCreateEditFields) {
          this.showNotice({
            type: 'error',
            content: '字段名称不允许为空或重复'
          })
          return
        }

        this.editing = true
        if (this.delChecked) {
          api.dataTable.deleteTable(this.editModal.model.name).then(() => {
            api.dataTable.getTables().then((res) => {
              if (res.status === 200) {
                this._resetEdit()
                this.getTables()
              }
            })
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (this.editValidation.$valid) {
          this.editModal.model.field = {}
          this.editModal.fields.forEach((item) => {
            this.editModal.model.field[item.name] = item.value
          })
          api.dataTable.updateTable(this.editModal.model).then((res) => {
            if (res.status === 200) {
              this._resetEdit()
              this.getTables()
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
  @import '../../assets/stylus/common'

  .modal
    .field-row
      clearfix()
      margin-bottom 10px

      .fa
        width 26px
        color lighten(red, 50%)
        line-height 26px
        text-align center
        margin-left 10px
        cursor pointer
        border-radius 15px

        &:hover
          color red
</style>
