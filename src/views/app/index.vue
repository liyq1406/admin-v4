<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 {{ $t("nav_aside.apps") }}
      .panel-bd
        //- 操作栏
        .action-bar
          .action-group
            button.btn.btn-success(@click="showAddModal = true")
              i.fa.fa-plus
              | {{ $t("app.create_app") }}

        //- 数据
        table.table.table-stripe.table-bordered
          thead
            tr
              th {{ $t("app.fields.id") }}
              th {{ $t("app.fields.name") }}
              th {{ $t("app.fields.type") }}
              th {{ $t("app.fields.create_time") }}
              th.tac {{ $t("common.action") }}
          tbody
            template(v-if="apps.length > 0 && !loadingApps")
              tr(v-for="app in apps")
                td {{app.id}}
                td {{app.name}}
                td {{app.type | typeLabel}}
                td {{app.create_time | formatDate}}
                td.tac
                  button.btn.btn-link.btn-sm(@click="onEditApp(app)") {{ $t("common.edit") }}
            tr(v-if="loadingApps")
              td.tac(colspan="5")
                .tips-null
                  i.fa.fa-refresh.fa-spin
                  span {{ $t("common.data_loading") }}
            tr(v-if="apps.length === 0 && !loadingApps")
              td.tac(colspan="5")
                .tips-null
                  span {{ $t("common.no_records") }}

  // 添加应用浮层
  modal(:show.sync="showAddModal", @close="onAddCancel")
    h3(slot="header") {{ $t("app.create_app") }}
    .form(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addAppHook")
        .form-row
          label.form-control {{ $t("app.fields.name") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('app.placeholders.name')")
              input.input-text(v-model="addModel.name", type="text", v-form-ctrl, name="name", minlength="2", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.name.$pristine")
              span(v-if="addValidation.name.$error.required") {{ $t('validation.required', {field: $t('app.fields.name')}) }}
            .form-tips.form-tips-error(v-if="addValidation.name.$dirty")
              span(v-if="addValidation.name.$error.required") {{ $t('validation.required', {field: $t('app.fields.name')}) }}
              span(v-if="addValidation.name.$error.maxlength") {{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}
              span(v-if="addValidation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('app.fields.name'), 32]) }}
        .form-row
          label.form-control {{ $t("app.fields.type") }}:
          .controls
            .radio-group.radio-group-v
              label.radio(v-for="type in appTypes")
                input(type="radio", v-model="addModel.type", name="type", :value="$index+1", :disabled="type.disabled")
                | {{type.label}}
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onAddCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? $t('common.handling') : $t('common.ok')")

  // 编辑应用浮层
  modal(:show.sync="showEditModal", @close="onEditCancel")
    //- h3(slot="header") 编辑应用({{editModel.type | typeLabel}})
    h3(slot="header") {{ $t("app.edit_app") }} ({{editModel.type | typeLabel}})
    .form(slot="body")
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit", hook="editAppHook")
        .form-row
          label.form-control {{ $t("app.fields.name") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('app.placeholders.name')")
              input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", minlength="2", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.name.$pristine")
              span(v-if="editValidation.name.$error.required") {{ $t('validation.required', {field: $t('app.fields.name')}) }}
            .form-tips.form-tips-error(v-if="editValidation.name.$dirty")
              span(v-if="editValidation.name.$error.required") {{ $t('validation.required', {field: $t('app.fields.name')}) }}
              span(v-if="editValidation.name.$error.maxlength") {{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}
              span(v-if="editValidation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('app.fields.name'), 32]) }}
        .form-row
          label.form-control {{ $t("app.inform") }}:
          .controls
            .checkbox-group
              label.checkbox
                input(type="checkbox", name="apn_enable", v-model="editModel.apn_enable")
                | {{ $t("app.fields.apn_enable") }}
        .form-row(v-show="editModel.apn_enable")
          label.form-control {{ $t("app.apn_file") }}:
          .controls
            label.btn.btn-success.btn-upload(:class="{'disabled':uploading}")
              input(type="file", v-el:edit-apn-file, name="apnFile", @change.prevent="uploadApn('editModel', 'editApnFile', $event)", :disabled="uploading")
              i.fa.fa-reply-all
              | {{uploading ? $t('app.uploading') : $t('app.upload') }}
            .form-tips.mt5(v-if="editModel.apn_license_url") url: {{editModel.apn_license_url}}
        .form-row(v-show="editModel.apn_enable")
          label.form-control {{ $t("app.fields.apn_license_pwd") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('app.placeholders.apn_license_pwd')")
              input.input-text(v-model="editModel.apn_license_pwd", type="text", v-form-ctrl, name="apn_license_pwd")
        .form-row.without-label(v-show="editModel.apn_enable")
          .controls
            .checkbox-group
              label.checkbox
                input(type="checkbox", name="apn_license_production", v-model="editModel.apn_license_production")
                | {{ $t("app.is_release") }}
        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | {{ $t("app.del_app") }}
          button.btn.btn-default(@click.prevent.stop="onEditCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")
</template>

<script>
  var Vue = require('vue');
  var locales = require('../../consts/locales');
  var api = require('../../api');
  var Modal = require('../../components/modal.vue');
  var _ = require('lodash');

  module.exports = {
    name: 'Applications',

    components: {
      'modal': Modal
    },

    data: function () {
      return {
        apps: [],
        appTypes: locales[Vue.config.lang].app.types,
        showAddModal: false,
        showEditModal: false,
        addModel: {
          name: '',
          type: 1,
          apn_enable: false,
          apn_license_url: '',
          apn_license_pwd: '',
          apn_license_production: false
        },
        editModel: {
          type: 1
        },
        originAddModel: {},
        originEditModel: {},
        addValidation: {},
        editValidation: {},
        adding: false,
        editing: false,
        uploading: false,
        delChecked: false,
        loadingApps: false
      };
    },

    route: {
      data: function () {
        this.originAddModel = _.clone(this.addModel);
        this.getApps();
      }
    },

    filters: {
      typeLabel: function (value) {
        return this.appTypes[value - 1].label;
      }
    },

    methods: {
      // 获取 APP 列表
      getApps: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.app.list().then(function (data) {
            self.apps = data;
          });
        });
      },

      // 添加应用表单钩子
      addAppHook: function (form) {
        this.addForm = form;
      },

      // 修改应用表单钩子
      editAppHook: function (form) {
        this.editForm = form;
      },

      // 关闭添加应用浮层并净化添加表单
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

      // 提交添加
      onAddSubmit: function () {
        var self = this;

        if (this.addValidation.$valid && !this.adding) {
          this.adding = true;
          api.corp.refreshToken().then(function () {
            api.app.create(self.addModel).then(function (data) {
              self.resetAdd();
              self.getApps();
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      // 初始化应用编辑表单
      onEditApp: function (app) {
        this.showEditModal = true;
        this.editModel = _.clone(app);
        this.originEditModel = _.clone(app);
      },

      // 取消应用编辑
      onEditCancel: function () {
        this.resetEdit();
      },

      // 提交应用更新
      onEditSubmit: function () {
        var self = this;
        if (this.delChecked && !this.editing) {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.app.remove(self.editModel.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.resetEdit();
              self.getApps();
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        } else if (this.editValidation.$valid && !this.editing) {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.app.update(self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.getApps();
              self.resetEdit();
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        }
      },

      // 上传APN文件
      uploadApn: function (model, apnFile, event) {
        var self = this;
        var file = this.$els[apnFile].files[0];
        var input = event.target;

        if (file && file.size > 1024 * 1024) {
          alert(self.$t('task.file_size_msg'));
          return;
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new FileReader();
          reader.onerror = function (evt) {
            alert(self.$t('upload.read_err'));
          };
          // 读取完成
          reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
              if (!self.uploading) {
                self.uploading = true;
                api.corp.refreshToken().then(function () {
                  api.app.uploadApn(evt.target.result).then(function (data) {
                    console.log(data);
                    input.value = '';
                    self[model].apn_license_url = data.url;
                    self.uploading = false;
                  }).catch(function (error) {
                    self.handleError(error);
                    self.uploading = false;
                  });
                });
              }
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          alert(self.$t('upload.compatiblity'));
        }
      }
    }
  };
</script>
