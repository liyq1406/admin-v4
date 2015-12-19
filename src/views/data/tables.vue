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
            tr(v-for="table in tables | limitBy pageCount (currentPage-1)*pageCount")
              td
                a.hl-red(v-link="{path: '/data/tables/' + table.name}") {{table.name}}
              td
                span(v-if="table.type === 1") 用户公开表
                span(v-if="table.type === 2") 用户私有表
              td.tac
                button.btn.btn-link.btn-sm(@click="editTable(table)") 编辑
            tr(v-if="tables.length === 0")
              td.tac(colspan="3")
                i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                .tips-null(v-else) 暂无数据表
        pager(:total="tables.length", :current.sync="currentPage", :page-count="pageCount")

    // 添加数据表浮层
    modal(:show.sync="showAddModal")
      h3(slot="header") 新建数据表
      .form(slot="body")
        form(v-form, name="addValidation", @submit.prevent="onAddSubmit")
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
                label.checkbox
                  input(type="checkbox", v-model="addModel.permission", name="permission", value="create")
                  | 添加
                label.checkbox
                  input(type="checkbox", v-model="addModel.permission", name="permission", value="get")
                  | 获取
                label.checkbox
                  input(type="checkbox", v-model="addModel.permission", name="permission", value="find")
                  | 查找
                label.checkbox
                  input(type="checkbox", v-model="addModel.permission", name="permission", value="update")
                  | 修改
                label.checkbox
                  input(type="checkbox", v-model="addModel.permission", name="permission", value="delete")
                  | 删除
          .form-row
            label.form-control 字段：
            .controls
              .field-row(v-for="field in addFields")
                .input-text-wrap
                  input.input-text(v-model="field.name", type="text", @input="updateField(addModel, addFields)", @blur="onBlur(field, addModel, addFields)")
                .select
                  select(v-model="field.value", @change="updateField(addModel, addFields)")
                    option(value="string") 字符串
                    option(value="int") 32位整形数字
                    option(value="boolean") 布尔类型
                    option(value="float") 浮点类型
                    option(value="date") 日期类型
                span.fa.fa-times(@click="removeField(field, addModel, addFields)")
              .field-row
                .input-text-wrap
                  input.input-text(v-model="newField.name", type="text")
                .select
                  select(v-model="newField.value")
                    option(value="string") 字符串
                    option(value="int") 32位整形数字
                    option(value="boolean") 布尔类型
                    option(value="float") 浮点类型
                    option(value="date") 日期类型
              button.btn.btn-success(@click.prevent.stop="createField(addModel, addFields)") 添加字段
          .form-actions
            button.btn.btn-default(@click.prevent.stop="onAddCancel") 取消
            button.btn.btn-primary(type="submit") 确定

    // 修改数据表浮层
    modal(:show.sync="showEditModal")
      h3(slot="header") 修改数据表
      .form(slot="body")
        form(v-form, name="editValidation", @submit.prevent="onEditSubmit")
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
                label.checkbox
                  input(type="checkbox", v-model="editModel.permission", name="permission", value="create")
                  | 添加
                label.checkbox
                  input(type="checkbox", v-model="editModel.permission", name="permission", value="get")
                  | 获取
                label.checkbox
                  input(type="checkbox", v-model="editModel.permission", name="permission", value="find")
                  | 查找
                label.checkbox
                  input(type="checkbox", v-model="editModel.permission", name="permission", value="update")
                  | 修改
                label.checkbox
                  input(type="checkbox", v-model="editModel.permission", name="permission", value="delete")
                  | 删除
          .form-row
            label.form-control 字段：
            .controls
              .field-row(v-for="field in editFields")
                .input-text-wrap
                  input.input-text(v-model="field.name", type="text", @input="updateField(editModel, editFields)", @blur="onBlur(field, editModel, editFields)")
                .select
                  select(v-model="field.value", @change="updateField(editModel, editFields)")
                    option(value="string") 字符串
                    option(value="int") 32位整形数字
                    option(value="boolean") 布尔类型
                    option(value="float") 浮点类型
                    option(value="date") 日期类型
                span.fa.fa-times(@click="removeField(field, editModel, editFields)")
              .field-row
                .input-text-wrap
                  input.input-text(v-model="newField.name", type="text")
                .select
                  select(v-model="newField.value")
                    option(value="string") 字符串
                    option(value="int") 32位整形数字
                    option(value="boolean") 布尔类型
                    option(value="float") 浮点类型
                    option(value="date") 日期类型
              button.btn.btn-success(@click.prevent.stop="createField(editModel, editFields)") 添加字段
          .form-actions
            label.del-check
              input(type="checkbox", name="del", v-model="delChecked")
              | 删除数据表
            button.btn.btn-default(@click.prevent.stop="onEditCancel") 取消
            button.btn.btn-primary(type="submit") 确定
</template>

<script>
  var api = require('../../api');
  var Pager = require('../../components/pager.vue');
  var Modal = require('../../components/modal.vue');

  module.exports = {
    components: {
      'modal': Modal,
      'pager': Pager
    },

    data: function () {
      return {
        tables: [],
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
        editModel: {
          permission: [],
          field: {}
        },
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
        editing: false
      };
    },

    route: {
      data: function () {
        return {
          tables: this.getTables()
        };
      }
    },

    methods: {
      getTables: function () {
        return api.corp.refreshToken().then(function () {
          return api.dataTable.getTables();
        })
      },

      onAddCancel: function () {
        this.showAddModal = false;
        this.adding = false;
      },

      onEditCancel: function () {
        this.showEditModal = false;
        this.editing = false;
      },

      onBlur: function (field, model, fields) {
        if (field.name.length === 0) {
          fields.$remove(field);
          this.updateField(model, fields)
        }
      },

      updateField: function (model, fields) {
        var field = {};
        fields.forEach(function (item) {
          field[item.name] = item.value;
        });
        model.field = field;
      },

      createField: function (model, fields) {
        if (this.newField.name.length > 0) {
          // this.addModel.field[this.newField.name] = this.newField.value;
          fields.push(this.newField);
          this.updateField(model, fields);
          this.newField = { name: '', value: 'string' };
        } else {
          alert('请输入字段名!')
        }
      },

      removeField: function (field, model, fields) {
        fields.$remove(field);
        this.updateField(model, fields);
      },

      onAddSubmit: function () {
        var self = this;
        if (this.addValidation.$valid && !this.adding) {
          self.adding = true;
          api.corp.refreshToken().then(function () {
            api.dataTable.createTable(self.addModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.tables.push(self.addModel);
              self.showAddModal = false;
              self.adding = false;
              self.addFields = [];
            }).catch(function (error) {
              self.handleError(error);
            });
          });
        }
      },

      editTable: function (table) {
        this.showEditModal = true;
        this.editModel = table;
        this.editFields = [];
        for (var key in this.editModel.field) {
          if (this.editModel.field.hasOwnProperty(key)) {
            this.editFields.push({name: key, value: this.editModel.field[key]});
          }
        }
      },

      onEditSubmit: function () {
        var self = this;
        if (this.delChecked) {
          api.corp.refreshToken().then(function () {
            api.dataTable.deleteTable(self.editModel.name).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.tables.$remove(self.editModel);
              self.showEditModal = false;
            }).catch(function (error) {
              self.handleError(error);
            });
          });
        } else if (this.editValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.dataTable.updateTable(self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.showEditModal = false;
            }).catch(function (error) {
              self.handleError(error);
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
