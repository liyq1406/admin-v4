<template>
  <div class="main data-tables">
    <div class="main-title">
      <h3>数据表</h3>
    </div>
    <div class="tool-bar">
      <div class="tool-list">
        <div class="tool-list-item">
          <div class="trigger" @click="addModal.show=true"><i class="fa fa-plus"></i><span class="trigger-text">{{ $t("ui.table.create_table") }}</span></div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-4 data-table-border first-class-box mt20">
            <!-- <div class="action-bar">
              <div class="action-group">
                <button @click="addModal.show=true" class="btn btn-success btn-block"><i class="fa fa-plus"></i>{{ $t("ui.table.create_table") }}</button>
              </div>
            </div> -->
            <div class="data-table-box" v-show="dataFirClassList.length">
              <ul>
                <li class="data-table-li" v-for="dataFirClass in dataFirClassList" :class="{'selected': dataFirClass.selected}"  @click="selectedFirstClassEvent(dataFirClass)">
                  <a class="data-first-class" :title="dataFirClass.name">
                    <i class="fa fa-list" title="用户公开表" v-show="dataFirClass.type===1"></i>
                    <i class="fa fa-lock" title="用户私有表" v-show="dataFirClass.type===2"></i>
                    <i class="fa fa-database" title="应用数据表" v-show="dataFirClass.type===3"></i>
                     {{dataFirClass.name}}
                   </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-20 data-table-border details-box">
            <div class="selected-first-class" v-show="selectedFirstClass.selected">
              <div class="row details-header">
                <div class="col-8 title-box">
                  <span>数据表详情</span>
                </div>
                <div class="col-16 operation-box tar">
                  <div class="operation-div">
                    <div class="operation add-line" @click="addLineEvent">
                      <span><i class="fa fa-plus"></i> 添加行</span>
                    </div>
                    <div class="operation del-line" :class="{'disabled': selectedLine.length === 0}" @click="deleteLineEvent">
                      <span><i class="fa fa-trash"></i> 删除行</span>
                    </div>
                    <div class="operation add-column" @click="showAddColumnModal">
                      <span><i class="fa fa-plus"></i> 添加列</span>
                    </div>
                    <div class="operation more">
                      <span><i class="fa fa-reorder"></i> 更多</span>
                      <div class="moreOperation-box">
                        <ul>
                          <li @click.stop="deleteAllData"><span>删除所有数据</span></li>
                          <li @click.stop="deleteDataTable"><span>删除数据表</span></li>
                          <li @click.stop="showDeleteColumnModal"><span>删除列</span></li>
                          <li @click.stop="showJurisdictionModal"><span>限权设置</span></li>
                          <li @click.stop=""><span>导出数据</span></li>
                          <li @click.stop=""><span>导出全部数据表</span></li>
                        </ul>
                      </div>
                    </div>
                    <!-- <div class="operation filter" @click="showFilterModal">
                      <span><i class="fa fa-filter"></i> 筛选</span>
                    </div> -->
                  </div>
                </div>
              </div>
              <div class="details-table">
                <intelligent-table :headers.sync="vHeaders" :tables.sync="vTables" :selected-table="selectedLine" :selecting.sync="true" @selected-change="selectedLineChange"></intelligent-table>
                <!-- <intelligent-table :headers.sync="vHeaders" :tables.sync="vTables"></intelligent-table> -->
              </div>
            </div>
            <div class="tips-box" v-show="!selectedFirstClass.selected">
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
            <button @click="addModal.show = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("ui.table.create_table") }}</button>
          </div>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t("ui.table.fields.name") }}</th>
                <th>{{ $t("ui.table.fields.type") }}</th>
                <th class="tac">{{ $t("common.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="tables.length > 0">
                <tr v-for="table in tables | limitBy countPerPage (currentPage-1)*countPerPage">
                  <td><a v-link="{path: '/data/tables/' + table.name}" class="hl-red">{{ table.name }}</a></td>
                  <td><span>{{ tableTypes[table.type-1] }}</span></td>
                  <td class="tac">
                    <button @click="editTable(table)" class="btn btn-link btn-mini">{{ $t("common.edit") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="tables.length === 0 && !loadingData">
                <td colspan="3" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="tables.length > countPerPage" :total="tables.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager> -->
      </div>
    </div>

    <!-- Start: 添加数据表浮层 -->
    <modal :show.sync="addModal.show" @close="onAddCancel">
      <h3 slot="header">{{ $t("ui.table.create_table") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row row">
            <label class="form-control col-6">
              <span>{{ $t("ui.table.fields.name") }}:</span>
            </label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.table.placeholders.name')" class="input-text-wrap">
                <input v-model="addModal.model.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="64" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.table.fields.name')}) }}</span>
              </div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error">
                <span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.table.fields.name')}) }}</span>
                <span v-if="addValidation.name.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.table.fields.name'), 2]) }}</span>
                <span v-if="addValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.table.fields.name'), 64]) }}</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">
              <span>{{ $t("ui.table.fields.type") }}:</span>
            </label>
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
            <label class="form-control col-6">
              <span>{{ $t("ui.table.fields.permission") }}:</span>
            </label>
            <div class="controls col-18">
              <div class="checkbox-group">
                <label v-for="type in permissionTypes" class="checkbox">
                  <input type="checkbox" v-model="addModal.model.permission" name="permission" :value="type.value"/>{{ type.label }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">
              <span>{{ $t("ui.table.fields.field") }}:</span>
            </label>
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
              <button @click.prevent.stop="createField(addModal.fields, $event)" :disabled="!canCreateAddFields" class="btn btn-success" :class="{'disabled':!canCreateAddFields}">{{ $t("ui.table.add_field") }}</button>
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
      <h3 slot="header">{{ $t("ui.table.edit_table") }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-6">
              <span>{{ $t("ui.table.fields.name") }}:</span>
            </label>
            <div class="controls col-18">
              <span class="control-text">{{ editModal.model.name }}</span>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">
              <span>{{ $t("ui.table.fields.type") }}:</span>
            </label>
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
            <label class="form-control col-6">{{ $t("ui.table.fields.permission") }}:</label>
            <div class="controls col-18">
              <div class="checkbox-group">
                <label v-for="type in permissionTypes" class="checkbox">
                  <input type="checkbox" v-model="editModal.model.permission" name="permission" :value="type.value"/>{{ type.label }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.table.fields.field") }}:</label>
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
              <button @click.prevent.stop="createField(editModal.fields, $event)" :disabled="!canCreateEditFields" class="btn btn-success" :class="{'disabled':!canCreateEditFields}">{{ $t("ui.table.add_field") }}</button>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.table.del_table") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 修改数据表浮层 -->
    <!-- start 添加列 -->
    <modal :show.sync="addColumnModal.show">
      <h3 slot="header">添加列</h3>
      <div slot="body" class="form">
        <form @submit.prevent="addColumnModalConfirm">
          <div class="form-row row">
            <label class="form-control col-6">列名:</label>
            <div class="controls col-18">
              <div v-placeholder="'请输入列名'" class="input-text-wrap">
                <input v-model="addColumnModal.content" type="text" name="name" minlength="2" maxlength="64" class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">类型:</label>
            <div class="controls col-18">
              <v-select :label="getTypeLabelByValue(addColumnModal.type)">
                <select v-model="addColumnModal.type">
                  <option v-for="type in fieldTypes" :value="type.value">{{ type.label }}</option>
                </select>
              </v-select>
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
    <!-- start 删除列 -->
    <modal :show.sync="delColumnModal.show">
      <h3 slot="header">删除列</h3>
      <div slot="body" class="form">
        <form @submit.prevent="delColumnModalConfirm">
          <div class="form-row row">
            <label class="form-control col-6">列名:</label>
            <div class="controls col-12">
              <v-select :label="delColumnModal.selectedColumn" :width="'150px'">
                <select v-model="delColumnModal.selectedColumn">
                  <option v-for="addListKey in addListKeys" track-by="$index" :value="addListKey.key">{{ addListKey.key }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="delColumnModal.show = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 删除列 -->
    <!-- start 筛选 -->
    <modal :show.sync="filterModal.show">
      <h3 slot="header">筛选</h3>
      <div slot="body" class="form">
        <form @submit.prevent="filterModalConfirm">
          <div class="form-row">
            <div class="controls row">
              <span class="filterModalTitle col-6">选择列：</span>
              <div class="select-box col-18">
                <v-select :label="filterModal.modal.title">
                  <select v-model="filterModal.modal">
                    <option v-for="header in vHeaders" :value="header">{{ header.title }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="controls row">
              <span class="filterModalTitle col-6">筛选条件：</span>
              <div class="select-box col-18">
                <v-select :label="filterModal.condition.selectedCondition">
                  <select v-model="filterModal.condition.selectedCondition">
                    <option v-for="condition in filterModal.condition.conditionList" :value="condition">{{ condition }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="controls row">
              <span class="filterModalTitle col-6">值：</span>
              <div class="value-box col-18">
                <div v-placeholder="'请输入值'" class="input-text-wrap">
                  <input v-model="filterModal.condition.value" type="text" class="input-text"/>
                </div>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="filterModal.show = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 筛选 -->
    <!-- start 限权设置 -->
    <modal :show.sync="jurisdictionModal.show">
      <h3 slot="header">限权设置</h3>
      <div slot="body" class="form">
        <form @submit.prevent="jurisdictionModalConfirm">
          <div class="form-row row">
            <div class="checkbox-group">
              <label v-for="type in permissionTypes" class="checkbox">
                <input type="checkbox" v-model="jurisdictionModal.modal[type.value]"/>{{ type.label }}
              </label>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="jurisdictionModal.show = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 限权设置 -->
    <!-- start 提示 -->
    <modal :show.sync="confirmModal.show">
      <h3 slot="header">{{confirmModal.title}}</h3>
      <div slot="body" class="form">
        <div class="content-box">
          <p><i class="fa fa-warning "></i> {{confirmModal.content}}</p>
        </div>
        <div class="form-actions">
          <button @click.prevent.stop="confirmModal.show = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button @click.prevent.stop="confirmModalConfirm" type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        </div>
      </div>
    </modal>
    <!-- 提示 -->
    <!-- start 编辑用户自定义字段的值 -->
    <modal :show.sync="userEditColumnModal.show" class="visible">
      <h3 slot="header">编辑内容</h3>
      <div slot="body" class="form">
        <form v-form name="userEditColumnModalValidation" @submit.prevent="userEditColumnModalConfirm">
          <div class="form-row row">
            <label class="form-control col-6">
              <span>{{userEditColumnModal.columnName}}:</span>
            </label>
            <!-- 字符串 -->
            <div class="controls col-18" v-show="userEditColumnModal.fieldType === 'string'">
              <div v-placeholder="'请输入' + userEditColumnModal.columnName + '(字符串)'" class="input-text-wrap">
                <input v-model="userEditColumnModal.value" type="text" class="input-text"/>
              </div>
            </div>
            <!-- 整形数字 -->
            <div class="controls col-18" v-show="userEditColumnModal.fieldType === 'int'">
              <div v-placeholder="'请输入' + userEditColumnModal.columnName + '(整型数字)'" class="input-text-wrap">
                <input v-model="userEditColumnModal.value" v-form-ctrl name="int" custom-validator="checkNumber" type="text" class="input-text"/>
              </div>
              <div v-show="userEditColumnModalValidation.int.$dirty" class="form-tips form-tips-error">
                <span v-show="userEditColumnModalValidation.int.$error.customValidator">{{userEditColumnModal.columnName}}必须是数字</span>
              </div>
            </div>
            <!-- 浮点数字 -->
            <div class="controls col-18" v-show="userEditColumnModal.fieldType === 'float'">
              <div v-placeholder="'请输入' + userEditColumnModal.columnName + '(浮点型数字)'" class="input-text-wrap">
                <input v-model="userEditColumnModal.value" v-form-ctrl name="float" custom-validator="checkNumber" type="text" class="input-text"/>
              </div>
              <div v-show="userEditColumnModalValidation.float.$dirty" class="form-tips form-tips-error">
                <span v-show="userEditColumnModalValidation.float.$error.customValidator">{{userEditColumnModal.columnName}}必须是数字</span>
              </div>
            </div>
            <!-- 布尔 -->
            <div class="controls col-18" v-show="userEditColumnModal.fieldType === 'boolean'">
              <v-select :label="userEditColumnModal.value+''" size="small">
                <select v-model="userEditColumnModal.value">
                  <option :value="true" selected>true</option>
                  <option :value="false">false</option>
                </select>
              </v-select>
            </div>
            <!-- 日期 -->
            <div class="controls col-18" v-show="userEditColumnModal.fieldType === 'date'">
              <!-- <date-picker :value.sync="userEditColumnModal.value"></date-picker> -->
              <date-picker :value.sync="datePicker.date"></date-picker>
              <span class="time-picker" v-show="datePicker.date">
                <time-picker :value.sync="datePicker.time"></time-picker>
                <!-- <input type="time" v-model="datePicker.time"> -->
              </span>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="userEditColumnModal.show = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing || !userEditColumnModal.value" :class="{'disabled':(editing || !userEditColumnModal.value)}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 编辑用户自定义字段的值 -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'api'
  import * as config from 'consts/config'
  import Pager from 'components/Pager'
  import Modal from 'components/Modal'
  import IntelligentTable from 'components/IntelligentTable'
  import DatePicker from 'components/DatePicker'
  import TimePicker from 'components/TimePicker2'
  import Select from 'components/Select'
  import locales from 'consts/locales/index'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'DataTables',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'intelligent-table': IntelligentTable,
      'date-picker': DatePicker,
      'time-picker': TimePicker,
      'modal': Modal,
      'pager': Pager,
      'v-select': Select
    },

    data () {
      return {
        // 大分类
        dataFirClassList: [
          // {
          //   name: '分类1',
          //   selected: true
          // },
          // {
          //   name: '分类2',
          //   selected: false
          // },
          // {
          //   name: '分类3',
          //   selected: false
          // }
        ],
        // 当前是否正在筛选列表
        isSelecting: true,
        // 已选择的行
        selectedLine: [],
        // 表格头部
        vHeaders: [
        ],
        // 默认表格头部
        baseVHeaders: [
          {
            key: 'objectId',
            title: 'ID',
            class: 'nowrap'
          },
          {
            key: 'createAt',
            title: '创建时间',
            class: 'nowrap'
          },
          {
            key: 'updateAt',
            title: '更新时间',
            class: 'nowrap'
          },
          {
            key: 'creator',
            title: '创建者',
            class: 'tac nowrap'
          }
          // {
          //   key: 'operation',
          //   title: '操作',
          //   class: 'tac',
          //   functionName: 'showEditModal'
          // }
        ],
        // 表格内容
        vTables: [
          // {
          //   id: '<a>idididid</a>',
          //   creatTime: '123',
          //   updateTime: '更新时间',
          //   creater: '创建者',
          //   operation: '<a>编辑</a>',
          //   tableName: '分类1'
          // },
          // {
          //   id: 'idididid',
          //   creatTime: '创建时间',
          //   updateTime: '更新时间',
          //   creater: '创建者',
          //   operation: '<a>编辑</a>',
          //   tableName: '分类1'
          // }
        ],

        // 添加列浮层
        addColumnModal: {
          show: false,
          content: '',
          type: 'string'
        },

        // 删除列浮层
        delColumnModal: {
          show: false,
          selectedColumn: ''
        },
        // 筛选浮层
        filterModal: {
          show: false,
          condition: {
            selectedCondition: '>',
            conditionList: ['>', '<', '>=', '<='],
            value: ''
          },
          modal: {
            key: 'id',
            title: ''
          }
        },
        // 限权设置浮层
        jurisdictionModal: {
          show: false,
          modal: {
            find: false,
            update: false,
            delete: false,
            get: false,
            create: false
          }
        },
        // 编辑用户自定义列的内容浮层
        userEditColumnModal: {
          show: false,
          columnName: '提示',
          fieldType: 'string',
          value: ''
        },
        // 编辑用户自定义列的内容浮层验证器
        userEditColumnModalValidation: {},
        // 存放时间控件的临时日期和时间
        datePicker: {
          date: '2016-06-06',
          time: '00:00:00'
        },
        // 提示浮层
        confirmModal: {
          show: false,
          title: '提示',
          content: ''
        },
        // 后端返回的数据全部放在table里面
        tables: [],
        // 限权种类
        permissionTypes: locales[Vue.config.lang].data.TABLE_PERMISSION_TYPES,
        // 表格种类
        tableTypes: locales[Vue.config.lang].data.TABLE_TYPES,
        // 列种类
        fieldTypes: locales[Vue.config.lang].data.TABLE_FIELD_TYPES,
        // 数据表详情基本表头
        // baseHeader: ['objectId', 'createAt', 'updateAt', 'creator'],
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
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
      // 用户自己添加进去的字段
      addListKeys () {
        var result = []
        var noUserKey = []
        this.baseVHeaders.map((baseVHeader) => {
          noUserKey.push(baseVHeader.key)
        })
        this.vHeaders.map((vHeader) => {
          if (noUserKey.indexOf(vHeader.key) === -1) {
            result.push(vHeader)
          }
        })
        return result
      },
      /**
       * 已经选择的大类
       * @return {[type]} [description]
       */
      selectedFirstClass () {
        var selectedFirstClass = {}
        this.dataFirClassList.map((item) => {
          if (item.selected) {
            selectedFirstClass = item
          }
        })
        return selectedFirstClass
      },
      /**
       * 已经选择的数据表
       * @return {[type]} [description]
       */
      selectedTable () {
        var selectedTable = {}
        this.tables.map((item) => {
          if (item.name === this.selectedFirstClass.name) {
            selectedTable = item
          }
        })
        return selectedTable
      },
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
      /**
       * 获取数据表数据以及更新数据表
       * @param  {[type]} tableName 表名
       * @param  {[type]} params     过滤参数
       * @return {[type]}            [description]
       */
      getTableData (tableName, params, type) {
        this.loadingData = true
        if (type === 3) {
          // console.log('数据表逻辑')
          api.dataTable.queryAppData(tableName, params).then((res) => {
            this.initTableHeader(type) // 根据当前已选择的大类初始化表格头部
            let jsonTables = JSON.stringify(res.data.list)
            // 将返回的数据里面的日期格式的内容转化为普通的日期格式
            let result = jsonTables.replace(/(\d+-\d+-\d+)T(\d+:\d+:\d+).\d+Z/g, '$1 $2')
            result = result.replace(/_id/g, 'objectId')
            this.vTables = JSON.parse(result)
            this.loadingData = true
          }).catch((res) => {
            this.handleError(res)
            this.loadingData = false
          })
        } else {
          api.dataTable.queryData(tableName, params).then((res) => {
            this.initTableHeader() // 根据当前已选择的大类初始化表格头部
            let jsonTables = JSON.stringify(res.data.list)
            // 将返回的数据里面的日期格式的内容转化为普通的日期格式
            let result = jsonTables.replace(/(\d+-\d+-\d+)T(\d+:\d+:\d+).\d+Z/g, '$1 $2')
            this.vTables = JSON.parse(result)
            this.loadingData = true
          }).catch((res) => {
            this.handleError(res)
            this.loadingData = false
          })
        }
      },
      /**
       * 根据已选择数据表更新数据表头部
       * @return {[type]} [description]
       */
      initTableHeader (type) {
        var vHeaders = _.clone(this.baseVHeaders)
        if (type === 3) {
          vHeaders = [
            {
              key: 'objectId',
              title: 'ID',
              class: 'nowrap'
            }
          ]
        }
        for (let key in this.selectedFirstClass.field) {
          var vHeader = {
            key: key,
            title: key,
            type: this.selectedFirstClass.field[key],
            functionName: 'showEditUserColumnModal',
            class: 'userColumn' + ((this.selectedFirstClass.field[key] === 'date') ? ' nowrap' : '')
          }
          vHeaders.splice(1, 0, vHeader)
        }
        this.vHeaders = vHeaders
      },
      /**
       * 初始化数据 用tables的数据初始化各个对象
       * @return {[type]} [description]
       */
      initTable () {
        var dataFirClassList = []
        var vHeaders = []
        this.tables.map((table) => {
          var dataFirClassListObj = {
            name: table.name,
            type: table.type,
            field: table.field,
            permission: table.permission,
            selected: false
          }
          dataFirClassList.push(dataFirClassListObj)
          if (Object.keys(table.field).length) {
            for (var key in table.field) {
              var obj = {
                key: key,
                title: key,
                type: table.field[key],
                functionName: 'showEditUserColumnModal',
                class: 'userColumn'
              }
              this.vHeaders.splice(1, 0, obj)
            }
          }
        })

        this.vHeaders = this.baseVHeaders.concat(vHeaders)
        this.dataFirClassList = dataFirClassList
        if (dataFirClassList[0]) {
          this.selectedFirstClassEvent(dataFirClassList[0])
        }
        this.filterModal.modal = _.clone(this.vHeaders[0])
      },
      // 显示添加列浮层
      showAddColumnModal () {
        this.addColumnModal.show = true
        this.addColumnModal.content = ''
        this.addColumnModal.type = 'string'
      },
      // 添加列浮层确定按钮按下
      addColumnModalConfirm () {
        var key = this.addColumnModal.content
        var type = this.addColumnModal.type
        if (key) {
          var repeat = false
          this.vHeaders.map((item) => {
            if (item.title === key) {
              repeat = true
            }
            if (item.key === key) {
              repeat = true
            }
          })
          if (repeat) {
            this.showNotice({
              type: 'error',
              content: '该列明不可用'
            })
          } else {
            // console.log('向服务器发送数据 编辑当前数据表')
            let table = {}
            let field = _.clone(this.selectedFirstClass.field)
            field[key] = type
            table.name = this.selectedFirstClass.name
            table.permission = this.selectedFirstClass.permission
            table.type = this.selectedFirstClass.type
            table.field = field
            this.editing = true
            api.dataTable.updateTable(table).then((res) => {
              if (res.status === 200) {
                var obj = {
                  key: key,
                  title: key,
                  type: type,
                  functionName: 'showEditUserColumnModal',
                  class: 'userColumn'
                }
                this.vHeaders.splice(1, 0, obj)
                this.addColumnModal.show = false
                this.editing = false
                this.showNotice({
                  type: 'success',
                  content: '限权设置成功'
                })
              }
            }).catch((res) => {
              this.handleError(res)
              this.editing = false
            })
          }
        } else {
          this.showNotice({
            type: 'error',
            content: '列名不能为空'
          })
        }
      },

      /**
       * 编辑用户自定义列表
       * @param  {[type]} line   列
       * @param  {[type]} column 行
       * @param  {[type]} tableIndex 当前被编辑的行的索引
       * @return {[type]}        [description]
       */
      showEditUserColumnModal (column, line, lineIndex) {
        // this.userEditColumnModalValidation.$dirty = true
        this.userEditColumnModal.show = true
        this.userEditColumnModal.columnName = column.key
        this.userEditColumnModal.lineIndex = lineIndex
        this.userEditColumnModal.fieldType = column.type
        this.userEditColumnModal.value = line[column.key]
        this.userEditColumnModal.objectId = line.objectId
        if (this.userEditColumnModal.fieldType === 'date') {
          if (line[column.key]) {
            this.datePicker.date = line[column.key].split(' ')[0]
            this.datePicker.time = line[column.key].split(' ')[1]
          } else {
            let date = new Date()
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            month = month > 9 ? month : ('0' + month)
            let day = date.getDate()
            day = day > 9 ? day : ('0' + day)
            this.datePicker.date = year + '-' + month + '-' + day
            this.datePicker.time = '00:00:00'
            this.userEditColumnModal.value = this.datePicker.date + ' ' + this.datePicker.time
          }
        }
        this.userEditColumnModal.show = true
      },

      /**
       * 编辑用户自定义列表浮层确定事件
       * @return {[type]} [description]
       */
      userEditColumnModalConfirm () {
        var params = {}
        var value = this.userEditColumnModal.value
        if (value) {
          if (this.userEditColumnModal.fieldType === 'date') {
            // 如果是日期类型 拼接秤日期类型的字符串
            value = this.datePicker.date + 'T' + this.datePicker.time + '.000Z'
          } else if (this.userEditColumnModal.fieldType === 'string') {
            // 如果是字符串 转成字符串
            value = value + ''
          } else if (this.userEditColumnModal.fieldType === 'int') {
            // 如果是整型
            value = parseInt(value)
          }
          params[this.userEditColumnModal.columnName] = value
          // 判断当前的列表id是否存在 存在的话修改数据  不存在的话创建数据
          if (this.userEditColumnModal.objectId) {
            // 修改数据
            this.updateTableData(this.selectedFirstClass.name, this.userEditColumnModal.objectId, params, this.selectedFirstClass.type)
          } else {
            // 新增数据
            this.createTableData(this.selectedFirstClass.name, params, this.selectedFirstClass.type)
          }
        } else {
          this.showNotice({
            type: 'error',
            content: '内容不能为空'
          })
        }
      },

      /**
       * 修改数据表
       * @param  {[type]} tableName 表名
       * @param  {[type]} objectId  列表id
       * @param  {[type]} params     参数
       * @return {[type]}            [description]
       */
      updateTableData (tableName, objectId, params, type) {
        this.editing = true
        if (type === 3) {
          // console.log('应用级的修改数据')
          api.dataTable.updateAppData(tableName, objectId, params).then((res) => {
            var jsonTables = JSON.stringify(res.data)
            let result = jsonTables.replace(/(\d+-\d+-\d+)T(\d+:\d+:\d+).\d+Z/g, '$1 $2')
            result = result.replace(/_id/g, 'objectId')
            this.vTables.$set(this.userEditColumnModal.lineIndex, JSON.parse(result))
            this.userEditColumnModal.show = false
            this.editing = false
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else {
          api.dataTable.updateData(tableName, objectId, params).then((res) => {
            var jsonTables = JSON.stringify(res.data)
            let result = jsonTables.replace(/(\d+-\d+-\d+)T(\d+:\d+:\d+).\d+Z/g, '$1 $2')
            this.vTables.$set(this.userEditColumnModal.lineIndex, JSON.parse(result))
            this.userEditColumnModal.show = false
            this.editing = false
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },

      /**
       * 创建数据表并且更新
       * @param  {[type]} tableName 表名
       * @param  {[type]} params     参数
       * @return {[type]}            [description]
       */
      createTableData (tableName, params, type) {
        this.editing = true
        if (type === 3) {
          // console.log('应用级的创建数据')
          api.dataTable.createAppData(tableName, params).then((res) => {
            var jsonTables = JSON.stringify(res.data)
            let result = jsonTables.replace(/(\d+-\d+-\d+)T(\d+:\d+:\d+).\d+Z/g, '$1 $2')
            result = result.replace(/_id/g, 'objectId')
            this.vTables.$set(this.userEditColumnModal.lineIndex, JSON.parse(result))
            this.userEditColumnModal.show = false
            this.editing = false
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else {
          api.dataTable.createData(tableName, params).then((res) => {
            var jsonTables = JSON.stringify(res.data)
            let result = jsonTables.replace(/(\d+-\d+-\d+)T(\d+:\d+:\d+).\d+Z/g, '$1 $2')
            this.vTables.$set(this.userEditColumnModal.lineIndex, JSON.parse(result))
            this.userEditColumnModal.show = false
            this.editing = false
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },
      /**
       * 删除数据表
       * @return {[type]} [description]
       */
      deleteDataTable () {
        // console.log(this.selectedFirstClass.name)
        this.confirm('确定要删除数据表' + this.selectedFirstClass.name + '？', () => {
          this.editing = true
          api.dataTable.deleteTable(this.selectedFirstClass.name).then(() => {
            // 重新获取数据表
            this.getTables()
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        })
      },

      /**
       * 显示限权浮层
       * @return {[type]} [description]
       */
      showJurisdictionModal () {
        this.permissionTypes.map((item) => {
          this.jurisdictionModal.modal[item.value] = false
        })
        this.selectedFirstClass.permission.map((item) => {
          this.jurisdictionModal.modal[item] = true
        })
        this.jurisdictionModal.show = true
      },
      /**
       * 限权设置浮层的确定按钮
       * @return {[type]} [description]
       */
      jurisdictionModalConfirm () {
        var permission = []
        for (let key in this.jurisdictionModal.modal) {
          if (this.jurisdictionModal.modal[key]) {
            permission.push(key)
          }
        }
        var table = {}
        table.name = this.selectedFirstClass.name
        table.permission = permission
        table.type = this.selectedFirstClass.type
        table.field = this.selectedFirstClass.field
        this.editing = true
        api.dataTable.updateTable(table).then((res) => {
          if (res.status === 200) {
            var index = this.dataFirClassList.indexOf(this.selectedFirstClass)
            this.dataFirClassList[index].permission = permission
            this.showNotice({
              type: 'success',
              content: '限权设置成功'
            })
            this.editing = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.editing = false
        })
        this.jurisdictionModal.show = false
      },
      /**
       * 选择大类
       * @param  {[type]} selectedFirstClassEvent [description]
       * @return {[type]}                    [description]
       */
      selectedFirstClassEvent (selectedFirstClass) {
        this.dataFirClassList.map((item) => {
          item.selected = false
        })
        var params = {}
        this.getTableData(selectedFirstClass.name, params, selectedFirstClass.type)
        selectedFirstClass.selected = true
      },
      /**
       * 添加行
       */
      addLineEvent () {
        var hasUserColumn = Boolean(this.addListKeys.length)
        // 判断有没有用户自定义列
        if (hasUserColumn) {
          var obj = {}
          this.addListKeys.map((item) => {
            obj[item.key] = ''
          })
          this.baseVHeaders.map((item) => {
            obj[item.key] = ''
          })
          this.vTables.push(obj)
        } else {
          this.showNotice({
            type: 'error',
            content: '请先添加列'
          })
        }
      },

      /**
       * 删除行事件
       * @return {[type]} [description]
       */
      deleteLineEvent () {
        if (this.selectedLine.length) {
          // this.confirm('确定删除已选中行？', () => {
          //
          // })
          if (this.selectedFirstClass.type === 3) {
            this.selectedLine.map((line) => {
              if (line.objectId) {
                api.dataTable.deleteAppData(this.selectedFirstClass.name, line.objectId).then(() => {
                  this.vTables.$remove(line)
                }).catch((res) => {
                  this.handleError(res)
                  this.loadingData = false
                })
              } else {
                this.vTables.$remove(line)
              }
            })
          } else {
            this.selectedLine.map((line) => {
              if (line.objectId) {
                api.dataTable.deleteData(this.selectedFirstClass.name, line.objectId).then(() => {
                  this.vTables.$remove(line)
                }).catch((res) => {
                  this.handleError(res)
                  this.loadingData = false
                })
              } else {
                this.vTables.$remove(line)
              }
            })
          }
        }
      },

      /**
       * 删除所有数据表
       * @return {[type]} [description]
       */
      deleteAllData () {
        this.confirm('确定要删除所有数据表？', () => {
          // console.log('发请求删除所有数据 然后重新渲染列表')
          // console.error('删除所有数据表功能还没实现  没有批量删除接口 现在是模拟删除功能')
          this.tables = []
          this.initTable()
        })
      },

      /**
       * 显示筛选条件浮层
       * @return {[type]} [description]
       */
      showFilterModal () {
        this.filterModal.show = true
      },
      /**
       * 筛选条件浮层确定按钮
       * @return {[type]} [description]
       */
      filterModalConfirm () {
        // console.log('筛选条件浮层确定按钮')
        this.filterModal.show = false
      },

      /**
       * 显示删除列浮层
       * @return {[type]} [description]
       */
      showDeleteColumnModal () {
        if (this.addListKeys.length) {
          this.delColumnModal.selectedColumn = this.addListKeys[0].key
          this.delColumnModal.show = true
        } else {
          this.showNotice({
            type: 'error',
            content: '当前没有可删除的列'
          })
        }
      },
      /**
       * 删除列浮层确定按钮事件
       * @return {[type]} [description]
       */
      delColumnModalConfirm () {
        var table = {}
        var field = _.clone(this.selectedFirstClass.field)
        delete field[this.delColumnModal.selectedColumn]
        table.name = this.selectedFirstClass.name
        table.permission = this.selectedFirstClass.permission
        table.type = this.selectedFirstClass.type
        table.field = field
        this.editing = true
        api.dataTable.updateTable(table).then((res) => {
          if (res.status === 200) {
            var index = this.dataFirClassList.indexOf(this.selectedFirstClass)
            this.dataFirClassList[index].field = field
            this.vHeaders.map((item) => {
              if (item.key === this.delColumnModal.selectedColumn) {
                this.vHeaders.$remove(item)
                return
              }
            })
            this.showNotice({
              type: 'success',
              content: '删除' + this.delColumnModal.selectedColumn + '成功'
            })
          }
          this.delColumnModal.show = false
          this.editing = false
        }).catch((res) => {
          this.handleError(res)
          this.editing = false
          this.delColumnModal = false
        })
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
      selectedLineChange (tables) {
        this.selectedLine = tables
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
            this.initTable()
            this.editing = false
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
      },

      /**
       * 显示自定义的confirm框
       * @param  {[type]}   content [description]
       * @param  {Function} fn      [description]
       * @return {[type]}           [description]
       */
      confirm (content, fn) {
        this.confirmModal.content = content
        this.confirmModal.fn = fn
        this.confirmModal.show = true
      },
      /**
       * 提示按钮按下
       * @param  {[type]}   content [description]
       * @param  {Function} fn      [description]
       * @return {[type]}           [description]
       */
      confirmModalConfirm () {
        this.confirmModal.show = false
        this.confirmModal.fn()
      },

      // 格式化日期
      toDate (date) {
        date = new Date(date)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        month = month > 9 ? month : '0' + month
        var day = date.getDate()
        day = day > 9 ? day : '0' + day
        return year + '-' + month + '-' + day
      },

      /**
       * 格式化后端返回的日期和时间
       * @param  {[type]} date [description]
       * @return {[type]}      [description]
       */
      formatDateTime (date) {
        if (/T/.test(date)) {
          var result = ''
          result = date.split(/.\d+Z/)[0]
          result.replace('T', ' ')
          return result
        } else {
          return new Date(date)
        }
      },

      /**
       * 表单验证 验证是否为数字
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      checkNumber (value) {
        // console.log(value)
        return value - 0 === value - 0
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .data-tables
    .panel
      padding-bottom 20px
    .first-class-box
      padding-right 20px
      box-sizing border-box
      .data-table-box
        border 1px solid light-border-color
        border-bottom 0
        box-sizing border-box
        .data-table-li
          padding-left 10px
          border-bottom 1px solid light-border-color
          height 32px
          line-height 32px
          &:hover
            background rgba(0,0,0,0.08)
          .data-first-class
            /*width 100%*/
            height 100%
            display block
            white-space nowrap
            text-overflow 100%
            transition transform ease 0.1s
            font-size 12px
            box-sizing border-box
            text-decoration blink
            position relative
            padding-right 25px
            .fa
              line-height 32px
              position absolute
              right 0
              padding-right 10px
              color gray-light
        .selected
          .data-first-class
            color red
            border-right 3px solid #c0252e
    .details-box
      padding-top 20px
      box-sizing border-box
      .details-header
        height 26px
        line-height 24px
        .title-box
          font-size 15px
        .operation-div
          font-size 0
        .operation
          height 26px
          display inline-block
          padding 0 10px
          border 1px solid light-border-color
          border-right 0
          box-sizing border-box
          cursor pointer
          font-size 12px
        .disabled
          color #bbb
          cursor no-drop
        .more
          border-right 1px solid #e0e0e0
          position relative
          .moreOperation-box
            height 0
            overflow hidden
            opacity 0
            position absolute
            right -1px
            top 100%
            white-space nowrap
            z-index 10
            background #fff
            line-height 24px
            border 1px solid light-border-color
            transition all ease 0.3s
            transform translate(0, 10px)
            li
              height 24px
              line-height 24px
              padding 0 10px
              border-bottom 1px solid light-border-color
              transition all ease 0.3s
              &:hover
                color red
                transform translate(-3px)
          &:hover
            .moreOperation-box
              opacity 1
              height auto
              transform translate(0, 0)
        .filter
          margin-left 20px
          border-right 1px solid light-border-color
      .tips-box
        box-sizing border-box
        padding 10px
        border 1px solid light-border-color
        padding-left 20px
        .problem
          font-size 18px
      .userColumn
        cursor text
        &:hover
          background rgba(0,0,0,0.08)
      .nowrap
        white-space nowrap
    .modal.visible
      .modal-body
        overflow-x visible
        overflow-y visible
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
      .filterModalTitle
        line-height 32px
      .fa-warning
        font-size 25px
        color #FF9D00
      .time-picker
        display inline-block
        width 150px
      .form-control
        span
          display inline-block
          text-overflow 100%
</style>
