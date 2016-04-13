<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("table.create_table") }}</button>
          </div>
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
            <template v-if="tables.length > 0 && !loadingData">
              <tr v-for="table in tables | limitBy pageCount (currentPage-1)*pageCount">
                <td><a v-link="{path: '/data/tables/' + table.name}" class="hl-red">{{ table.name }}</a></td>
                <td><span>{{ tableTypes[table.type-1] }}</span></td>
                <td class="tac">
                  <button @click="editTable(table)" class="btn btn-link btn-sm">{{ $t("common.edit") }}</button>
                </td>
              </tr>
            </template>
            <tr v-if="loadingData">
              <td colspan="3" class="tac">
                <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
              </td>
            </tr>
            <tr v-if="tables.length === 0 && !loadingData">
              <td colspan="3" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
        <pager v-if="!loadingData" :total="tables.length" :current.sync="currentPage" :page-count="pageCount"></pager>
      </div>
    </div>
    <!-- 添加数据表浮层-->
    <modal :show.sync="showAddModal" @close="onAddCancel">
      <h3 slot="header">{{ $t("table.create_table") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row">
            <label class="form-control">{{ $t("table.fields.name") }}:</label>
            <div class="controls">
              <div v-placeholder="$t('table.placeholders.name')" class="input-text-wrap">
                <input v-model="addModel.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="64" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('validation.required', {field: $t('table.fields.name')}) }}</span><span v-if="addValidation.name.$error.minlength">{{ $t('validation.minlength', [ $t('table.fields.name'), 2]) }}</span><span v-if="addValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('table.fields.name'), 64]) }}</span></div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("table.fields.type") }}:</label>
            <div class="controls">
              <div class="select">
                <select v-model="addModel.type" v-form-ctrl name="type" number="number">
                  <option v-for="type in tableTypes" :value="$index + 1" :selected="$index===0">{{ type }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("table.fields.permission") }}:</label>
            <div class="controls">
              <div class="checkbox-group">
                <label v-for="type in permissionTypes" class="checkbox">
                  <input type="checkbox" v-model="addModel.permission" name="permission" :value="type.value"/>{{ type.label }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row mxh">
            <label class="form-control">{{ $t("table.fields.field") }}:</label>
            <div class="controls">
              <div v-for="field in addFields" class="field-row">
                <div class="input-text-wrap">
                  <input v-model="field.name" type="text" @input="updateField(addModel, addFields)" @blur="onBlur(field, addModel, addFields)" lazy class="input-text"/>
                </div>
                <div class="select">
                  <select v-model="field.value" @change="updateField(addModel, addFields)">
                    <option v-for="type in fieldTypes" :value="type.value">{{ type.label }}</option>
                  </select>
                </div><span @click="removeField(field, addModel, addFields)" class="fa fa-times"></span>
              </div>
              <div class="field-row">
                <div class="input-text-wrap">
                  <input v-model="newField.name" type="text" lazy class="input-text"/>
                </div>
                <div class="select">
                  <select v-model="newField.value">
                    <option v-for="type in fieldTypes" :value="type.value">{{ type.label }}</option>
                  </select>
                </div>
              </div>
              <button @click.prevent.stop="createField(addModel, addFields)" class="btn btn-success">{{ $t("table.add_field") }}</button>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 修改数据表浮层-->
    <modal :show.sync="showEditModal" @close="onEditCancel">
      <h3 slot="header">{{ $t("table.edit_table") }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row">
            <label class="form-control">{{ $t("table.fields.name") }}:</label>
            <div class="controls"><span class="control-text">{{ editModel.name }}</span></div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("table.fields.type") }}:</label>
            <div class="controls">
              <div class="select">
                <select v-model="editModel.type" v-form-ctrl name="type" number="number">
                  <option v-for="type in tableTypes" :value="$index + 1" :selected="$index===0">{{ type }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("table.fields.permission") }}:</label>
            <div class="controls">
              <div class="checkbox-group">
                <label v-for="type in permissionTypes" class="checkbox">
                  <input type="checkbox" v-model="editModel.permission" name="permission" :value="type.value"/>{{ type.label }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="form-control">{{ $t("table.fields.field") }}:</label>
            <div class="controls">
              <div v-for="field in editFields" class="field-row">
                <div class="input-text-wrap">
                  <input v-model="field.name" type="text" @input="updateField(editModel, editFields)" @blur="onBlur(field, editModel, editFields)" lazy class="input-text"/>
                </div>
                <div class="select">
                  <select v-model="field.value" @change="updateField(editModel, editFields)">
                    <option v-for="type in fieldTypes" :value="type.value">{{ type.label }}</option>
                  </select>
                </div><span @click="removeField(field, editModel, editFields)" class="fa fa-times"></span>
              </div>
              <div class="field-row">
                <div class="input-text-wrap">
                  <input v-model="newField.name" type="text" lazy class="input-text"/>
                </div>
                <div class="select">
                  <select v-model="newField.value">
                    <option v-for="type in fieldTypes" :value="type.value">{{ type.label }}</option>
                  </select>
                </div>
              </div>
              <button @click.prevent.stop="createField(editModel, editFields)" class="btn btn-success">{{ $t("table.add_field") }}</button>
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
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api'
  import Pager from '../../components/Pager'
  import Modal from '../../components/Modal'
  import locales from '../../consts/locales'
  import _ from 'lodash'

  export default {
    name: 'DataTables',

    components: {
      'modal': Modal,
      'pager': Pager
    },

    data () {
      return {
        tables: [],
        tableTypes: locales[Vue.config.lang].table.types,
        fieldTypes: locales[Vue.config.lang].table.field_types,
        permissionTypes: locales[Vue.config.lang].table.permission_types,
        currentPage: 1,
        pageCount: 10,
        showAddModal: false,
        showEditModal: false,
        addModel: {
          name: '',
          type: 1,
          permission: [],
          field: {}
        },
        originAddModel: {
          name: '',
          type: 1,
          permission: [],
          field: {}
        },
        editModel: {},
        originEditModel: {},
        newField: {
          name: '',
          value: 'string'
        },
        addFields: [],
        editFields: [],
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
        // this.originAddModel = _.clone(this.addModel)
        this.getTables()
      }
    },

    methods: {
      // 获取数据表
      getTables () {
        this.loadingData = true
        api.dataTable.getTables().then((res) => {
          if (res.status === 200) {
            this.tables = res.data
            this.loadingData = false
          }
        }).catch((error) => {
          this.handleError(error)
          this.loadingData = false
        })
      },

      // 失焦
      onBlur (field, model, fields) {
        if (field.name.length === 0) {
          fields.$remove(field)
          this.updateField(model, fields)
        }
      },

      // 更新字段
      updateField (model, fields) {
        var field = {}
        fields.forEach((item) => {
          field[item.name] = item.value
        })
        model.field = field
      },

      // 创建字段
      createField (model, fields) {
        if (this.newField.name.length > 0) {
          // this.addModel.field[this.newField.name] = this.newField.value
          fields.push(this.newField)
          this.updateField(model, fields)
          this.newField = { name: '', value: 'string' }
        } else {
          window.alert(this.$t('table.field_msg'))
        }
      },

      // 移除字段
      removeField (field, model, fields) {
        fields.$remove(field)
        this.updateField(model, fields)
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
        this.addFields = []
        this.newField = { name: '', value: 'string' }
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.showEditModal = false
        this.delChecked = false
        this.editModel = _.clone(this.originEditModel)
        this.editModel.permission = _.clone(this.originEditModel.permission)
        this.newField = { name: '', value: 'string' }
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      // 添加操作
      onAddSubmit () {
        if (!this.addModel.name) {
          window.alert(this.$t('table.table_msg'))
        }
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          api.dataTable.createTable(this.addModel).then((res) => {
            if (res.status === 200) {
              this.tables.push(this.addModel)
              this.resetAdd()
            }
          }).catch((error) => {
            this.handleError(error)
            this.adding = false
          })
        }
      },

      // 编辑数据表
      editTable (table) {
        this.showEditModal = true
        this.editModel = _.clone(table)
        this.editModel.permission = _.clone(table.permission)
        this.originEditModel = _.clone(table)
        this.originEditModel.permission = _.clone(table.permission)
        this.editFields = []
        for (var key in this.editModel.field) {
          if (this.editModel.field.hasOwnProperty(key)) {
            this.editFields.push({name: key, value: this.editModel.field[key]})
          }
        }
      },

      // 取消编辑
      onEditCancel () {
        this.resetEdit()
        // this.product = this.originEditModel
      },

      // 提交更新
      onEditSubmit () {
        this.editing = true
        if (this.delChecked) {
          api.dataTable.deleteTable(this.editModel.name).then(() => {
            api.dataTable.getTables().then((res) => {
              if (res.status === 200) {
                this.resetEdit()
                this.tables = res.data
              }
            })
          }).catch((error) => {
            this.handleError(error)
            this.editing = false
          })
        } else if (this.editValidation.$valid) {
          api.dataTable.updateTable(this.editModel).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.editing = false
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
    .field-row
      clearfix()
      margin-bottom 10px

      .select
      .input-text-wrap
      .fa
        float left

      .input-text-wrap
        width 140px

      .select
        width 140px
        margin-left 10px

      .fa
        width 20px
        line-height 36px
        color red
        text-align center
        margin-left 10px
        cursor pointer
</style>
