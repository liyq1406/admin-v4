<template lang="jade">
  div
    .panel
      .panel-bd
        //- 操作栏
        .action-bar
          .action-group
            button.btn.btn-default(@click="showAddModal = true")
              i.fa.fa-plus
              | 添加数据端点

        //- 数据端点列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th 索引
              th 变量名
              th 数据类型
              th 单位符号
              th 描述
              th.tac 操作
          tbody
            tr(v-for="datapoint in datapoints", track-by="$index")
              td {{datapoint.index}}
              td {{datapoint.name}}
              td {{datapoint.type}}
              td {{datapoint.symbol}}
              td {{datapoint.description}}
              td.tac
                button.btn-link(@click="editDataPoint(datapoint)") 编辑
        .pager.tar
          button.pager-btn.pager-prev
            i.fa.fa-chevron-left
          input.pager-input(type="text")
          button.pager-btn.pager-next
            i.fa.fa-chevron-right

    modal(:show.sync="showAddModal")
      h3(slot="header") 添加数据端点
      .form(slot="body")
        form(v-form, name="addValidation", @submit.prevent="onAddSubmit")
          .form-row
            label.form-control 索引：
            .controls
              .input-text-wrap(v-placeholder="'数据端点索引不能重复'")
                input.input-text(v-model="model.index", type="number", v-form-ctrl, name="index", max="4294967296", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.index.$pristine")
                span(v-if="addValidation.index.$error.required") 请输入数据端点索引
              .form-tips.form-tips-error(v-if="addValidation.index.$dirty")
                span(v-if="addValidation.index.$error.required") 请输入数据端点索引
                span(v-if="addValidation.index.$error.maxlength") 数据端点索引应为不超过32位的整数
          .form-row
            label.form-control 变量名：
            .controls
              .input-text-wrap(v-placeholder="'英文、数字或下划线'")
                input.input-text(v-model="model.name", type="text", v-form-ctrl, name="name", maxlength="32", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.name.$pristine")
                span(v-if="addValidation.name.$error.required") 请输入数据端点名称
              .form-tips.form-tips-error(v-if="addValidation.name.$dirty")
                span(v-if="addValidation.name.$error.required") 请输入数据端点名称
                span(v-if="addValidation.name.$error.maxlength") 数据端点名称最大不能超过32位
          .form-row
            label.form-control 数据类型：
            .controls
              .select
                select(v-model="model.type", v-form-ctrl, name="type")
                  option(value="1", selected) 布尔类型
                  option(value="2") 单字节
                  option(value="3") 16位短整型
                  option(value="4") 32位整型
                  option(value="5") 浮点
                  option(value="6") 字符串
          .form-row
            label.form-control 单位符号：
            .controls
              .input-text-wrap(v-placeholder="'例如：℃'")
                textarea.input-text(v-model="model.symbol", type="text", v-form-ctrl, name="symbol", maxlength="10", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.symbol.$pristine")
                span(v-if="addValidation.symbol.$error.required") 请输入单位符号
              .form-tips.form-tips-error(v-if="addValidation.symbol.$dirty")
                span(v-if="addValidation.symbol.$error.required") 请输入单位符号
                span(v-if="addValidation.symbol.$error.maxlength") 单位符号最大不能超过10字符
          .form-row
            label.form-control 描述：
            .controls
              .input-text-wrap(v-placeholder="'请填写数据端点描述'")
                textarea.input-text(v-model="model.description", type="text", v-form-ctrl, name="description", maxlength="250", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted&& addValidation.description.$pristine")
                span(v-if="addValidation.description.$error.required") 请输入数据端点描述
              .form-tips.form-tips-error(v-if="addValidation.description.$dirty")
                span(v-if="addValidation.description.$error.required") 请输入数据端点描述
                span(v-if="addValidation.description.$error.maxlength") 产品描述最大不能超过250字符

          .form-actions
            button.btn.btn-default(@click.prevent.stop="showAddModal = false") 取消
            button.btn.btn-primary(type="submit") 确定

    modal(:show.sync="showEditModal")
      h3(slot="header") 编辑数据端点
      .form(slot="body")
        form(v-form, name="editValidation", @submit.prevent="onEditSubmit")
          .form-row
            label.form-control 索引：
            .controls
              .input-text-wrap(v-placeholder="'数据端点索引不能重复'")
                input.input-text(v-model="editModel.index", type="number", v-form-ctrl, name="index", max="4294967296", required)
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.index.$pristine")
                span(v-if="editValidation.index.$error.required") 请输入数据端点索引
              .form-tips.form-tips-error(v-if="editValidation.index.$dirty")
                span(v-if="editValidation.index.$error.required") 请输入数据端点索引
                span(v-if="editValidation.index.$error.maxlength") 数据端点索引应为不超过32位的整数
          .form-row
            label.form-control 变量名：
            .controls
              .input-text-wrap(v-placeholder="'英文、数字或下划线'")
                input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", maxlength="32", required)
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.name.$pristine")
                span(v-if="editValidation.name.$error.required") 请输入数据端点名称
              .form-tips.form-tips-error(v-if="editValidation.name.$dirty")
                span(v-if="editValidation.name.$error.required") 请输入数据端点名称
                span(v-if="editValidation.name.$error.maxlength") 数据端点名称最大不能超过32位
          .form-row
            label.form-control 数据类型：
            .controls
              .select
                select(v-model="editModel.type", v-form-ctrl, name="type")
                  option(value="1", selected) 布尔类型
                  option(value="2") 单字节
                  option(value="3") 16位短整型
                  option(value="4") 32位整型
                  option(value="5") 浮点
                  option(value="6") 字符串
          .form-row
            label.form-control 单位符号：
            .controls
              .input-text-wrap(v-placeholder="'例如：℃'")
                textarea.input-text(v-model="editModel.symbol", type="text", v-form-ctrl, name="symbol", maxlength="10", required)
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.symbol.$pristine")
                span(v-if="editValidation.symbol.$error.required") 请输入单位符号
              .form-tips.form-tips-error(v-if="editValidation.symbol.$dirty")
                span(v-if="editValidation.symbol.$error.required") 请输入单位符号
                span(v-if="editValidation.symbol.$error.maxlength") 单位符号最大不能超过10字符
          .form-row
            label.form-control 描述：
            .controls
              .input-text-wrap(v-placeholder="'请填写数据端点描述'")
                textarea.input-text(v-model="editModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required)
              .form-tips.form-tips-error(v-if="editValidation.$submitted&& editValidation.description.$pristine")
                span(v-if="editValidation.description.$error.required") 请输入数据端点描述
              .form-tips.form-tips-error(v-if="editValidation.description.$dirty")
                span(v-if="editValidation.description.$error.required") 请输入数据端点描述
                span(v-if="editValidation.description.$error.maxlength") 产品描述最大不能超过250字符

          .form-actions
            label.del-check
              input(type="checkbox", name="del", v-model="delChecked")
              | 删除数据端点
            button.btn.btn-default(@click.prevent.stop="onCancelEdit") 取消
            button.btn.btn-primary(type="submit") 确定
</template>

<script>
  var api = require('../../api');
  var Modal = require('../../components/modal.vue');
  var _ = require('lodash');

  module.exports = {
    components: {
      'modal': Modal
    },

    props: {
      product: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },

    data: function () {
      return {
        datapoints: [],
        showAddModal: false,
        showEditModal: false,
        model: {},
        editModel: {},
        editingDatapoint: {},
        originModel: {},
        addValidation: {},
        editValidation: {},
        delChecked: false
      }
    },

    route: {
      data: function (transition) {
        return {
          datapoints: this.getDatapoints()
        }
      }
    },

    methods: {
      getDatapoints: function () {
        var self = this;
        return api.corp.refreshToken(this).then(function () {
          return api.product.getDatapoints(self.$route.params.id)
        });
      },

      onAddSubmit: function () {
        var self = this;
        if (this.addValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.product.addDataPoint(self.$route.params.id, self.model).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.datapoints.push(data);
              self.model = {};
              self.showAddModal = false;
            });
          });
        }
      },

      editDataPoint: function (datapoint) {
        this.showEditModal = true;
        this.editModel = datapoint;
        this.originModel = _.clone(datapoint);
      },

      onCancelEdit: function () {
        this.showEditModal = false;
        this.editModel = this.originModel;
      },

      onEditSubmit: function () {
        var self = this;
        if (this.delChecked) {
          api.corp.refreshToken().then(function () {
            api.product.deleteDataPoint(self.$route.params.id, self.editModel.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.datapoints.$remove(self.editModel);
              self.showEditModal = false;
            });
          });
        } else if (this.editValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.product.updateDataPoint(self.$route.params.id, self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.showEditModal = false;
            });
          });
        }
      }
    }
  };
</script>
