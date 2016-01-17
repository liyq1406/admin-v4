<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 应用管理
      .panel-bd
        //- 操作栏
        .action-bar
          .action-group
            button.btn.btn-success(@click="showAddModal = true")
              i.fa.fa-plus
              | 新建应用

        //- 数据
        table.table.table-stripe.table-bordered
          thead
            tr
              th 应用ID
              th 应用名称
              th 应用类型
              th 创建时间
              th.tac 操作
          tbody
            template(v-if="apps.length > 0 && !loadingApps")
              tr(v-for="app in apps")
                td {{app.id}}
                td {{app.name}}
                td {{app.type | typeLabel}}
                td {{app.create_time | formatDate}}
                td.tac
                  button.btn.btn-link.btn-sm(@click="onEditApp(app)") 编辑
            tr(v-if="loadingApps")
              td.tac(colspan="5")
                .tips-null
                  i.fa.fa-refresh.fa-spin
                  span 数据加载中...
            tr(v-if="apps.length === 0 && !loadingApps")
              td.tac(colspan="5")
                .tips-null
                  span 暂无相关记录

  // 添加应用浮层
  modal(:show.sync="showAddModal", @close="onAddCancel")
    h3(slot="header") 添加应用
    .form(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addAppHook")
        .form-row
          label.form-control 应用名称：
          .controls
            .input-text-wrap(v-placeholder="'请输入应用名称'")
              input.input-text(v-model="addModel.name", type="text", v-form-ctrl, name="name", minlength="2", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.name.$pristine")
              span(v-if="addValidation.name.$error.required") 请输入应用名称
            .form-tips.form-tips-error(v-if="addValidation.name.$dirty")
              span(v-if="addValidation.name.$error.required") 请输入应用名称
              span(v-if="addValidation.name.$error.maxlength") 应用名称不能少于2个字符
              span(v-if="addValidation.name.$error.maxlength") 应用名称不能超过32个字符
        .form-row
          label.form-control 应用类型：
          .controls
            .radio-group.radio-group-v
              label.radio(v-for="type in appTypes")
                input(type="radio", v-model="addModel.type", name="type", :value="$index+1", :disabled="type.disabled")
                | {{type.label}}
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onAddCancel") 取消
          button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? '处理中...' : '确定'")

  // 编辑应用浮层
  modal(:show.sync="showEditModal", @close="onEditCancel")
    //- h3(slot="header") 编辑应用({{editModel.type | typeLabel}})
    h3(slot="header") 编辑应用 ({{editModel.type | typeLabel}})
    .form(slot="body")
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit", hook="editAppHook")
        .form-row
          label.form-control 应用名称：
          .controls
            .input-text-wrap(v-placeholder="'请输入应用名称'")
              input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", minlength="2", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.name.$pristine")
              span(v-if="editValidation.name.$error.required") 请输入应用名称
            .form-tips.form-tips-error(v-if="editValidation.name.$dirty")
              span(v-if="editValidation.name.$error.required") 请输入应用名称
              span(v-if="editValidation.name.$error.maxlength") 应用名称不能少于2个字符
              span(v-if="editValidation.name.$error.maxlength") 应用名称不能超过32个字符
        .form-row
          label.form-control 消息通知：
          .controls
            .checkbox-group
              label.checkbox
                input(type="checkbox", name="apn_enable", v-model="editModel.apn_enable")
                | 启用苹果APN服务
        .form-row(v-show="editModel.apn_enable")
          label.form-control APN授权文件：
          .controls
            label.btn.btn-success.btn-upload(:class="{'disabled':uploading}")
              input(type="file", v-el:edit-apn-file, name="apnFile", @change.prevent="uploadApn('editModel', 'editApnFile', $event)", :disabled="uploading")
              i.fa.fa-reply-all
              | {{uploading ? '文件上传中，请稍等...' : '上传P12文件'}}
            .form-tips.mt5(v-if="editModel.apn_license_url") url: {{editModel.apn_license_url}}
        .form-row(v-show="editModel.apn_enable")
          label.form-control 文件密码：
          .controls
            .input-text-wrap(v-placeholder="'请输入授权文件的密码'")
              input.input-text(v-model="editModel.apn_license_pwd", type="text", v-form-ctrl, name="apn_license_pwd")
        .form-row.without-label(v-show="editModel.apn_enable")
          .controls
            .checkbox-group
              label.checkbox
                input(type="checkbox", name="apn_license_production", v-model="editModel.apn_license_production")
                | 正式发布APN密钥文件
        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | 删除应用
          button.btn.btn-default(@click.prevent.stop="onEditCancel") 取消
          button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? '处理中...' : '确定'")
</template>

<script>
  var api = require('../../api');
  var Modal = require('../../components/modal.vue');
  var config = require('../../consts/config');
  var _ = require('lodash');

  module.exports = {
    name: 'Applications',

    components: {
      'modal': Modal
    },

    data: function () {
      return {
        apps: [],
        appTypes: config.appTypes,
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
          alert('文件大小不能大于1MB');
          return;
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new FileReader();
          reader.onerror = function (evt) {
            alert('文件读取失败。');
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
          alert('您的浏览器过于低级，不支持 HTML5 上传');
        }
      }
    }
  };
</script>
