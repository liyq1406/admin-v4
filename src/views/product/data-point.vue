<template lang="jade">
div
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        .action-group
          button.btn.btn-success(@click="showAddModal = true")
            i.fa.fa-plus
            | {{ $t("datapoint.add_datapoint") }}

      //- 数据端点列表
      table.table.table-stripe.table-bordered
        thead
          tr
            th {{ $t("datapoint.fields.index") }}
            th {{ $t("datapoint.fields.name") }}
            th {{ $t("datapoint.fields.type") }}
            th {{ $t("datapoint.fields.symbol") }}
            th {{ $t("datapoint.fields.description") }}
            th.tac {{ $t("common.action") }}
        tbody
          template(v-if="datapoints.length > 0 && !loadingData")
            tr(v-for="datapoint in datapoints | limitBy pageCount (currentPage-1)*pageCount")
              td {{* datapoint.index}}
              td {{* datapoint.name}}
              td {{* datapoint.type | typeLabel}}
              td {{* datapoint.symbol}}
              td {{* datapoint.description}}
              td.tac
                button.btn-link(@click="editDataPoint(datapoint)") {{ $t("common.edit") }}
          tr(v-if="loadingData")
            td.tac(colspan="6")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span {{ $t("common.data_loading") }}
          tr(v-if="datapoints.length === 0 && !loadingData")
            td.tac(colspan="6")
              .tips-null
                span {{ $t("common.no_records") }}
      pager(v-if="!loadingData", :total="datapoints.length", :current.sync="currentPage", :page-count="pageCount")

  // 添加数据端点浮层
  modal(:show.sync="showAddModal", @close="onAddCancel")
    h3(slot="header") {{ $t("datapoint.add_datapoint") }}
    .form(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFormHook")
        .form-row
          label.form-control {{ $t("datapoint.fields.index") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('datapoint.placeholders.index')")
              input.input-text(v-model="addModel.index", type="text", v-form-ctrl, name="index", required, custom-validator="numberic", lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.index.$pristine")
              span(v-if="addValidation.index.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.index')}) }}
            .form-tips.form-tips-error(v-if="addValidation.index.$dirty")
              span(v-if="addValidation.index.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.index')}) }}
              span(v-if="addValidation.index.$error.customValidator") {{ $t('validation.maxlength', [ $t('datapoint.fields.index'), 32]) }}
        .form-row
          label.form-control {{ $t("datapoint.fields.name") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('datapoint.placeholders.name')")
              input.input-text(v-model="addModel.name", type="text", v-form-ctrl, name="name", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.name.$pristine")
              span(v-if="addValidation.name.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.name')}) }}
            .form-tips.form-tips-error(v-if="addValidation.name.$dirty")
              span(v-if="addValidation.name.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.name')}) }}
              span(v-if="addValidation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('datapoint.fields.name'), 32]) }}
        .form-row
          label.form-control {{ $t("datapoint.fields.type") }}:
          .controls
            .select
              select(v-model="addModel.type", v-form-ctrl, name="type")
                option(v-for="type in datapointTypes", :value="$index + 1", :selected="$index===0") {{type}}
        .form-row
          label.form-control {{ $t("datapoint.fields.symbol") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('datapoint.placeholders.symbol')")
              textarea.input-text(v-model="addModel.symbol", type="text", v-form-ctrl, name="symbol", maxlength="10", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.symbol.$pristine")
              span(v-if="addValidation.symbol.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.symbol')}) }}
            .form-tips.form-tips-error(v-if="addValidation.symbol.$dirty")
              span(v-if="addValidation.symbol.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.symbol')}) }}
              span(v-if="addValidation.symbol.$error.maxlength") {{ $t('validation.maxlength', [ $t('datapoint.fields.symbol'), 10])
        .form-row
          label.form-control {{ $t("datapoint.fields.description") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('datapoint.placeholders.description')")
              textarea.input-text(v-model="addModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted&& addValidation.description.$pristine")
              span(v-if="addValidation.description.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.description')}) }}
            .form-tips.form-tips-error(v-if="addValidation.description.$dirty")
              span(v-if="addValidation.description.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.description')}) }}
              span(v-if="addValidation.description.$error.maxlength") {{ $t('validation.maxlength', [ $t('datapoint.fields.description'), 250])

        .form-actions
          button.btn.btn-default(type="reset", @click.prevent.stop="onAddCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? $t('common.handling') : $t('common.ok')")

  // 编辑数据端点浮层
  modal(:show.sync="showEditModal")
    h3(slot="header") {{ $t("datapoint.edit_datapoint") }}
    .form(slot="body")
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit", hook="editFormHook")
        .form-row
          label.form-control {{ $t("datapoint.fields.index") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('datapoint.placeholders.index')")
              input.input-text(v-model="editModel.index", type="text", v-form-ctrl, name="index", required, custom-validator="numberic", lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.index.$pristine")
              span(v-if="editValidation.index.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.index')}) }}
            .form-tips.form-tips-error(v-if="editValidation.index.$dirty")
              span(v-if="editValidation.index.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.index')}) }}
              span(v-if="editValidation.index.$error.customValidator") {{ $t('validation.maxlength', [ $t('datapoint.fields.index'), 32]) }}
        .form-row
          label.form-control {{ $t("datapoint.fields.name") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('datapoint.placeholders.name')")
              input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.name.$pristine")
              span(v-if="editValidation.name.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.name')}) }}
            .form-tips.form-tips-error(v-if="editValidation.name.$dirty")
              span(v-if="editValidation.name.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.name')}) }}
              span(v-if="editValidation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('datapoint.fields.name'), 32]) }}
        .form-row
          label.form-control {{ $t("datapoint.fields.type") }}:
          .controls
            .select
              select(v-model="editModel.type", v-form-ctrl, name="type")
                option(v-for="type in datapointTypes", :value="$index + 1") {{type}}
        .form-row
          label.form-control {{ $t("datapoint.fields.symbol") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('datapoint.placeholders.symbol')")
              textarea.input-text(v-model="editModel.symbol", type="text", v-form-ctrl, name="symbol", maxlength="10", required, lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.symbol.$pristine")
              span(v-if="editValidation.symbol.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.symbol')}) }}
            .form-tips.form-tips-error(v-if="editValidation.symbol.$dirty")
              span(v-if="editValidation.symbol.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.symbol')}) }}
              span(v-if="editValidation.symbol.$error.maxlength") {{ $t('validation.maxlength', [ $t('datapoint.fields.symbol'), 10])
        .form-row
          label.form-control {{ $t("datapoint.fields.description") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('datapoint.placeholders.description')")
              textarea.input-text(v-model="editModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required, lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted&& editValidation.description.$pristine")
              span(v-if="editValidation.description.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.description')}) }}
            .form-tips.form-tips-error(v-if="editValidation.description.$dirty")
              span(v-if="editValidation.description.$error.required") {{ $t('validation.required', {field: $t('datapoint.fields.description')}) }}
              span(v-if="editValidation.description.$error.maxlength") {{ $t('validation.maxlength', [ $t('datapoint.fields.description'), 250])

        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | {{ $t('datapoint.del_datapoint') }}
          button.btn.btn-default(@click.prevent.stop="onEditCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")
</template>

<script>
  var Vue = require('vue');
  var api = require('../../api');
  // var config = require('../../consts/config');
  var locales = require('../../consts/locales');
  var Modal = require('../../components/modal.vue');
  var Pager = require('../../components/pager.vue');
  var _ = require('lodash');

  module.exports = {
    name: 'DataPoint',

    components: {
      'modal': Modal,
      'pager': Pager
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
        datapointTypes: locales[Vue.config.lang].datapoint.types,
        pageCount: 10,
        currentPage: 1,
        showAddModal: false,
        showEditModal: false,
        addModel: {
          index: '',
          name: '',
          type: 1,
          description: '',
          symbol: ''
        },
        editModel: {},
        editingDatapoint: {},
        addValidation: {},
        editValidation: {},
        delChecked: false,
        adding: false,
        editing: false,
        addForm: {},
        editForm: {},
        originAddModel: {},
        originEditModel: {},
        loadingData: false
      };
    },

    route: {
      data: function (transition) {
        this.originAddModel = _.clone(this.addModel);
        this.getDatapoints();
      }
    },

    filters: {
      typeLabel: function (value) {
        return this.datapointTypes[value - 1];
      }
    },

    methods: {
      // 获取数据端点列表
      getDatapoints: function () {
        var self = this;
        this.loadingData = true;
        api.corp.refreshToken(this).then(function () {
          api.product.getDatapoints(self.$route.params.id).then(function (data) {
            self.datapoints = data;
            self.loadingData = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingData = false;
          });
        });
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
        this.$nextTick(function () {
          self.addForm.setPristine();
        });
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit: function () {
        this.editing = false;
        this.showEditModal = false;
        this.delChecked = false;
        this.editModel = this.originEditModel;
      },

      // 取消添加
      onAddCancel: function () {
        this.resetAdd();
      },

      // 添加操作
      onAddSubmit: function () {
        var self = this;
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true;
          api.corp.refreshToken().then(function () {
            api.product.addDataPoint(self.$route.params.id, self.addModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.datapoints.push(data);
              self.resetAdd();
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      // 初始化编辑表单
      editDataPoint: function (datapoint) {
        this.showEditModal = true;
        this.editModel = _.clone(datapoint);
        this.originEditModel = _.clone(datapoint);
      },

      // 取消编辑
      onEditCancel: function () {
        this.resetEdit();
      },

      // 提交编辑表单
      onEditSubmit: function () {
        var self = this;
        if (this.delChecked && !this.editing) { // 删除
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.product.deleteDataPoint(self.$route.params.id, self.editModel.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.resetEdit();
              self.delChecked = false;
              self.getDatapoints();
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.product.updateDataPoint(self.$route.params.id, self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.resetEdit();
              self.getDatapoints();
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        }
      } // onEditSubmit end
    }
  };
</script>
