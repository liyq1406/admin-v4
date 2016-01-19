<template lang="jade">
div
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        .action-group
          button.btn.btn-success(@click="showAddModal = true")
            i.fa.fa-plus
            | 新建数据表

      //- 数据
      table.table.table-stripe.table-bordered
        thead
          tr
            th 名称
            th 数据表类型
            th.tac 操作
        tbody
          template(v-if="tables.length > 0 && !loadingData")
            tr(v-for="table in tables | limitBy pageCount (currentPage-1)*pageCount")
              td
                a.hl-red(v-link="{path: '/data/tables/' + table.name}") {{table.name}}
              td
                span(v-if="table.type === 1") 用户公开表
                span(v-if="table.type === 2") 用户私有表
              td.tac
                button.btn.btn-link.btn-sm(@click="editTable(table)") 编辑
          tr(v-if="loadingData")
            td.tac(colspan="3")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span 数据加载中...
          tr(v-if="tables.length === 0 && !loadingData")
            td.tac(colspan="3")
              .tips-null
                span 暂无相关记录
      pager(v-if="!loadingData", :total="tables.length", :current.sync="currentPage", :page-count="pageCount")

  // 添加数据表浮层
  modal(:show.sync="showAddModal", @close="onAddCancel")
    h3(slot="header") 新建数据表
    .form(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit",hook="addFormHook")
        .form-row
          label.form-control 表名：
          .controls
            .input-text-wrap(v-placeholder="'请输入表名'")
              input.input-text(v-model="addModel.name", type="text", v-form-ctrl, name="name", minlength="2", maxlength="64", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.name.$dirty")
              span(v-if="addValidation.name.$error.required") 请输入表名
              span(v-if="addValidation.name.$error.minlength") 表名最少为2字符
              span(v-if="addValidation.name.$error.maxlength") 表名最多为64字符
        .form-row
          label.form-control 数据表类型：
          .controls
            .select
              select(v-model="addModel.type", v-form-ctrl, name="type", number)
                option(value="1", selected) 用户公开表
                option(value="2") 用户私有表
        .form-row
          label.form-control 访问权限：
          .controls
            .checkbox-group
              label.checkbox(v-for="type in permissionTypes")
                input(type="checkbox", v-model="addModel.permission", name="permission", :value="type.value")
                | {{type.label}}
        .form-row
          label.form-control 字段：
          .controls
            .field-row(v-for="field in addFields")
              .input-text-wrap
                input.input-text(v-model="field.name", type="text", @input="updateField(addModel, addFields)", @blur="onBlur(field, addModel, addFields)", lazy)
              .select
                select(v-model="field.value", @change="updateField(addModel, addFields)")
                  option(v-for="type in fieldTypes", :value="type.value") {{type.label}}
              span.fa.fa-times(@click="removeField(field, addModel, addFields)")
            .field-row
              .input-text-wrap
                input.input-text(v-model="newField.name", type="text", lazy)
              .select
                select(v-model="newField.value")
                  option(v-for="type in fieldTypes", :value="type.value") {{type.label}}
            button.btn.btn-success(@click.prevent.stop="createField(addModel, addFields)") 添加字段
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onAddCancel") 取消
          button.btn.btn-primary(type="submit",:disabled="adding", :class="{'disabled':adding}", v-text="adding ? '处理中...' : '确定'") 确定

  // 修改数据表浮层
  modal(:show.sync="showEditModal", @close="onEditCancel")
    h3(slot="header") 修改数据表
    .form(slot="body")
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit",hook="editFormHook")
        .form-row
          label.form-control 表名：
          .controls
            span.control-text {{editModel.name}}
        .form-row
          label.form-control 数据表类型：
          .controls
            .select
              select(v-model="editModel.type", v-form-ctrl, name="type", number)
                option(value="1", selected) 用户公开表
                option(value="2") 用户私有表
        .form-row
          label.form-control 访问权限：
          .controls
            .checkbox-group
              label.checkbox(v-for="type in permissionTypes")
                input(type="checkbox", v-model="editModel.permission", name="permission", :value="type.value")
                | {{type.label}}
        .form-row
          label.form-control 字段：
          .controls
            .field-row(v-for="field in editFields")
              .input-text-wrap
                input.input-text(v-model="field.name", type="text", @input="updateField(editModel, editFields)", @blur="onBlur(field, editModel, editFields)", lazy)
              .select
                select(v-model="field.value", @change="updateField(editModel, editFields)")
                  option(v-for="type in fieldTypes", :value="type.value") {{type.label}}
              span.fa.fa-times(@click="removeField(field, editModel, editFields)")
            .field-row
              .input-text-wrap
                input.input-text(v-model="newField.name", type="text", lazy)
              .select
                select(v-model="newField.value")
                  option(v-for="type in fieldTypes", :value="type.value") {{type.label}}
            button.btn.btn-success(@click.prevent.stop="createField(editModel, editFields)") 添加字段
        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | 删除数据表
          button.btn.btn-default(@click.prevent.stop="onEditCancel") 取消
          button.btn.btn-primary(type="submit",:disabled="editing", :class="{'disabled':editing}", v-text="editing ? '处理中...' : '确定'") 确定
</template>

<script>
  var api = require('../../api');
  var Pager = require('../../components/pager.vue');
  var Modal = require('../../components/modal.vue');
  var config = require('../../consts/config');
  var _ = require('lodash');

  module.exports = {
    name: 'DataTables',

    components: {
      'modal': Modal,
      'pager': Pager
    },

    data: function () {
      return {
        tables: [],
        fieldTypes: config.fieldTypes,
        permissionTypes: config.permissionTypes,
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
      };
    },

    route: {
      data: function () {
        // this.originAddModel = _.clone(this.addModel);
        this.getTables();
      }
    },

    methods: {
      // 获取数据表
      getTables: function () {
        var self = this;

        self.loadingData = true;
        api.corp.refreshToken().then(function () {
          api.dataTable.getTables().then(function (data) {
            self.tables = data;
            self.loadingData = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingData = false;
          });
        });
      },

      // 失焦
      onBlur: function (field, model, fields) {
        if (field.name.length === 0) {
          fields.$remove(field);
          this.updateField(model, fields);
        }
      },

      // 更新字段
      updateField: function (model, fields) {
        var field = {};
        fields.forEach(function (item) {
          field[item.name] = item.value;
        });
        model.field = field;
      },

      // 创建字段
      createField: function (model, fields) {
        if (this.newField.name.length > 0) {
          // this.addModel.field[this.newField.name] = this.newField.value;
          fields.push(this.newField);
          this.updateField(model, fields);
          this.newField = { name: '', value: 'string' };
        } else {
          alert('请输入字段名!');
        }
      },

      // 移除字段
      removeField: function (field, model, fields) {
        fields.$remove(field);
        this.updateField(model, fields);
      },

      // 添加表单钩子
      addFormHook: function (form) {
        this.addForm = form;
      },

      // 编辑表单钩子
      editFormHook: function (form) {
        this.editForm = form;
      },

      // 关闭添加浮层并净化添加表单
      resetAdd: function () {
        var self = this;
        this.adding = false;
        this.showAddModal = false;
        this.addModel = _.clone(this.originAddModel);
        this.addFields = [];
        this.newField = { name: '', value: 'string' };
        this.$nextTick(function () {
          self.addForm.setPristine();
        });
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit: function () {
        this.editing = false;
        this.showEditModal = false;
        this.delChecked = false;
        this.editModel = _.clone(this.originEditModel);
        this.editModel.permission = _.clone(this.originEditModel.permission);
        this.newField = { name: '', value: 'string' };
      },

      // 取消添加
      onAddCancel: function () {
        this.resetAdd();
      },

      // 添加操作
      onAddSubmit: function () {
        var self = this;

        if (!self.addModel.name) {
          alert('请输入表名！');
        };
        if (this.addValidation.$valid && !this.adding) {
          self.adding = true;
          api.corp.refreshToken().then(function () {
            api.dataTable.createTable(self.addModel).then(function (data) {
              self.tables.push(self.addModel);
              self.resetAdd();
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      // 编辑数据表
      editTable: function (table) {
        this.showEditModal = true;
        this.editModel = _.clone(table);
        this.editModel.permission = _.clone(table.permission);
        this.originEditModel = _.clone(table);
        this.originEditModel.permission = _.clone(table.permission);
        this.editFields = [];
        for (var key in this.editModel.field) {
          if (this.editModel.field.hasOwnProperty(key)) {
            this.editFields.push({name: key, value: this.editModel.field[key]});
          }
        }
      },

      // 取消编辑
      onEditCancel: function () {
        this.resetEdit();
        // this.product = this.originEditModel;
      },

      // 提交更新
      onEditSubmit: function () {
        var self = this;
        self.editing = true;
        if (this.delChecked) {
          api.corp.refreshToken().then(function () {
            api.dataTable.deleteTable(self.editModel.name).then(function (data) {
              self.resetEdit();
              self.getTables().then(function (data) {
                self.tables = data;
              });
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        } else if (this.editValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.dataTable.updateTable(self.editModel).then(function (data) {
              self.resetEdit();
              self.editing = false;
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        }
      }
    }
  };
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
