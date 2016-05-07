<template>
  <div>
    <div class="panel data-tables">
      <div class="panel-bd">
        <div class="row">
          <div class="col-4 data-table-border first-class-box">
            <div class="action-bar">
              <div class="action-group">
                <button @click="addModal.show=true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("table.create_table") }}</button>
              </div>
            </div>
            <div class="data-table-box">
              <ul>
                <li class="data-table-li" v-for="dataFirClass in dataFirClassList" @click="selectedFirstClass(dataFirClass)">
                  <a class="data-first-class" :title="dataFirClass.name" :class="{'selected': dataFirClass.selected}">{{dataFirClass.name}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-20 data-table-border details-box">
            <div class="selected-first-class" v-show="true">
              <div class="row details-header">
                <div class="col-8 title-box">
                  <span>数据表详情</span>
                </div>
                <div class="col-16 operation-box tar">
                  <div class="operation-div">
                    <div class="operation add-line" @click="addLineEvent">
                      <span>添加行</span>
                    </div>
                    <div class="operation del-line" :class="{'disabled': selectedTable.length === 0}">
                      <span>删除行</span>
                    </div>
                    <div class="operation add-column" @click="showAddColumnModal">
                      <span>添加列</span>
                    </div>
                    <div class="operation more">
                      <select>
                        <option value="0">更多</option>
                        <option value="1">删除所有数据</option>
                        <option value="2">删除数据表</option>
                        <option value="3">删除列</option>
                        <option value="4">限权设置</option>
                        <option value="5">导出数据</option>
                        <option value="6">导出全部数据表</option>
                      </select>
                    </div>
                    <div class="operation filter">
                      <span>过滤</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="details-table">
                <intelligent-table :headers="vHeaders" :tables="vTables" :selecting="true" @selected-change="selectedTableChange"></intelligent-table>
              </div>
            </div>
            <div class="tips-box" v-show="false">
              <p class="problem">如何管理我的数据表？</p>
              <p class="answer">
                您可以点击创建数据表<br>
                或者从左侧选择一个数据表，查看相关数据
              </p>
            </div>
          </div>
        </div>
        <!-- <div class="action-bar">
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
        <pager v-if="tables.length > pageCount" :total="tables.length" :current.sync="currentPage" :page-count="pageCount"></pager> -->
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
    <!-- start 添加行 -->
    <modal :show.sync="false">
      <h3 slot="header">添加行</h3>
      <div slot="body" class="form">
        <form>
          <div class="form-row row" v-for="key in addListKey">
            <label class="form-control col-6">{{key}}:</label>
            <div class="controls col-18">
              <div v-placeholder="'请输入' + key" class="input-text-wrap">
                <input v-model="addline['key']" type="text" name="name" minlength="2" maxlength="64" class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 添加行 -->
    <!-- start 添加列 -->
    <modal :show.sync="addColumnModal.show">
      <h3 slot="header">添加列</h3>
      <div slot="body" class="form">
        <form @submit.prevent="AddColumnModalConfirm">
          <div class="form-row row">
            <label class="form-control col-6">列名:</label>
            <div class="controls col-18">
              <div v-placeholder="'请输入列名'" class="input-text-wrap">
                <input v-model="addColumnModal.content" type="text" name="name" minlength="2" maxlength="64" class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="addColumnModal.show = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 添加列 -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api'
  import Pager from '../../components/Pager'
  import Modal from '../../components/Modal'
  import IntelligentTable from '../../components/IntelligentTable'
  import Select from '../../components/Select'
  import locales from '../../consts/locales/index'
  import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'DataTables',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'intelligent-table': IntelligentTable,
      'modal': Modal,
      'pager': Pager,
      'v-select': Select
    },

    data () {
      return {
        // 大分类
        dataFirClassList: [
          {
            name: '分类1',
            selected: true
          },
          {
            name: '分类2',
            selected: false
          },
          {
            name: '分类3',
            selected: false
          }
        ],
        // 当前是否正在筛选列表
        isSelecting: true,
        // 已选择的行
        selectedTable: [],
        // 表格头部
        vHeaders: [
          {
            key: 'id',
            title: 'ID',
            functionName: 'test'
          },
          {
            key: 'creatTime',
            title: '创建时间'
          },
          {
            key: 'updateTime',
            title: '更新时间'
          },
          {
            key: 'creater',
            title: '创建者',
            class: 'tac'
          },
          {
            key: 'operation',
            title: '操作',
            class: 'tac',
            functionName: 'showEditModal'
          }
        ],
        // 用户自己添加进去的字段
        addListKey: ['用户自定义key'], // 每次用户添加列都需要把key丢进来
        // 表格内容
        vTables: [
          {
            id: '<a>idididid</a>',
            creatTime: '123',
            updateTime: '更新时间',
            creater: '创建者',
            operation: '<a style="color:#c0252e">编辑</a>',
            tableName: '分类1'
          },
          {
            id: 'idididid',
            creatTime: '创建时间',
            updateTime: '更新时间',
            creater: '创建者',
            operation: '<a style="color:#c0252e">编辑</a>',
            tableName: '分类1'
          }
        ],
        addColumnModal: {
          show: false,
          content: ''
        },
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

    route: {
      data () {
        this.getTables()
      }
    },

    methods: {
      // 显示添加列浮层
      showAddColumnModal () {
        this.addColumnModal.show = true
        this.addColumnModal.content = ''
      },
      // 添加列浮层确定按钮按下
      AddColumnModalConfirm () {
        var key = this.addColumnModal.content
        if (key) {
          var repeat = false
          this.vHeaders.map((item) => {
            if (item.title === key) {
              repeat = true
            }
          })
          if (repeat) {
            this.showNotice({
              type: 'error',
              content: '列名不能重复'
            })
          } else {
            var obj = {
              key: key,
              title: key
            }
            this.vHeaders.push(obj)
            this.addColumnModal.show = false
          }
        } else {
          this.showNotice({
            type: 'error',
            content: '列名不能为空'
          })
        }
      },
      selectedFirstClass (selectedFirstClass) {
        this.dataFirClassList.map((item) => {
          item.selected = false
        })
        selectedFirstClass.selected = true
      },
      /**
       * 添加行
       */
      addLineEvent () {
        var obj = {
          id: '<a>新添加的行</a>',
          creatTime: '123',
          updateTime: '更新时间123',
          creater: '创建者123',
          operation: '操作123'
        }
        this.vTables.push(obj)
      },
      showEditModal (header, table) {
        // var obj =  {
        //   field: {},
        //   name: 123,
        //   permission: [],
        //   type: 1
        // }
        // this.editModal.
        this.editModal.show = true
        // this.vTables.$remove(table)
      },
      /**
       * 智能表格组件暴露事件 已选择的table发生变化
       * @param  {[type]} tables [description]
       * @return {[type]}        [description]
       */
      selectedTableChange (tables) {
        console.log('智能表格组件暴露事件 已选择的table发生变化')
        this.selectedTable = tables
        console.log(JSON.stringify(this.selectedTable))
      },
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
            console.log(JSON.stringify(this.tables))
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


  .data-tables
    padding-bottom 20px
    .first-class-box
      padding-right 20px
      box-sizing border-box
      .btn
        width 100%
      .data-table-box
        border 1px solid #e0e0e0
        border-bottom 0
        box-sizing border-box
        .data-table-li
          padding-left 10px
          border-bottom 1px solid #e0e0e0
          height 32px
          line-height 32px
          .data-first-class
            /*width 100%*/
            height 100%
            display block
            white-space nowrap
            text-overflow 100%
            transition transform ease 0.1s
            font-size 12px
        .selected
          color red
          transform translate(5px)
    .details-box
      padding-top 20px
      box-sizing border-box
      .details-header
        height 32px
        line-height 32px
        .title-box
          font-size 16px
        .operation-div
          font-size 0
        .operation
          height 32px
          display inline-block
          padding 0 10px
          border 1px solid #e0e0e0
          border-right 0
          box-sizing border-box
          cursor pointer
          font-size 14px
        .disabled
          color #bbb
        .more
          border-right 1px solid #e0e0e0
          padding-right 0
          select
            border 0
            width 100%
            background none
        .filter
          margin-left 20px
          border-right 1px solid #e0e0e0
      .tips-box
        box-sizing border-box
        padding 10px
        border 1px solid #e0e0e0
        padding-left 20px
        .problem
          font-size 18px
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
