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
                //- td.tac
                //-   button.btn.btn-link.btn-sm(@click="onEditApp(app)") {{ $t("common.edit") }}
                td.tac(v-if='app.type===4')
                  button.btn-link.btn-sm(v-link="{ path: '/apps/wechat/'+app.id }") {{'查看'}}
                td.tac(v-else)
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
              span(v-if="addValidation.name.$error.minlength") {{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}
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

  // 编辑iOS应用浮层
  modal(:show.sync="showEditModal", @close="onEditCancel")
    //- h3(slot="header") 编辑应用({{editModel.type | typeLabel}})
    h3(slot="header") {{ $t("app.edit_app") }} ({{editModel.type}})
    .form(slot="body")
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit(editModel)", hook="editAppHook")
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

  // 编辑安卓应用浮层
  modal(:show.sync="showEditModal2", @close="onEditCancel2")
    //- h3(slot="header") 编辑应用({{editModel2.type | typeLabel}})
    h3(slot="header") {{ '编辑应用' }} ({{editModel2.type | typeLabel}})
    .form(slot="body")
      form(v-form, name="editValidation2", @submit.prevent="onEditSubmit(editModel2)", hook="editAppHook2")
        .form-row
          label.form-control.wid130 {{ '应用名称' }}:
          .controls.wid310
            .input-text-wrap(v-placeholder="$t('app.placeholders.name')")
              input.input-text(v-model="editModel2.name", type="text", name="name", minlength="2", maxlength="32", required, lazy)
        .form-row
          label.form-control.wid130 {{ $t("app.inform") }}:
          .controls.wid310
            .checkbox-group
              label.checkbox
                input(type="checkbox", name="gcm_enable", v-model="editModel2.android.gcm_enable")
                | {{ '启用GooglePlay服务' }}
        .form-row(v-show="editModel2.android.gcm_enable")
          //- label.form-control {{ $t("app.fields.apn_license_pwd") }}:
          label.form-control.wid130 Server API Key:
          .controls.wid310
            .input-text-wrap(v-placeholder="$t('app.placeholders.apn_license_pwd')")
              //- input.input-text(v-model="editModel.apn_license_pwd", type="text", v-form-ctrl, name="apn_license_pwd")
              input.input-text(v-model="editModel2.android.gcm_api_key", type="text", v-form-ctrl, name="gcm_api_key")
        //- .form-row.without-label(v-show="editModel.apn_enable")
        //-   .controls
        //-     .checkbox-group
        //-       label.checkbox
        //-         input(type="checkbox", name="apn_license_production", v-model="editModel.apn_license_production")
        //-         | {{ $t("app.is_release") }}
        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | {{ $t("app.del_app") }}
          button.btn.btn-default(@click.prevent.stop="onEditCancel2") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")

  //- // 编辑微信应用浮层
  //- modal(:show.sync="showEditModal4", @close="onEditCancel4", :width="640")
  //-   //- h3(slot="header") 编辑应用({{editModel4.type | typeLabel}})
  //-   h3(slot="header") {{ $t("app.edit_app") }} ({{editModel4.type | typeLabel}})
  //-   .form.form-edit-apk(slot="body")
  //-     form(v-form, name="editValidation4", @submit.prevent="onEditSubmit(editModel4)", hook="editAppHook4")
  //-       .form-row
  //-         label.form-control {{ $t("app.fields.name") }}:
  //-         .controls
  //-           .input-text-wrap(v-placeholder="$t('app.placeholders.name')")
  //-             input.input-text(v-model="editModel4.name", type="text", v-form-ctrl, name="name", minlength="2", maxlength="32", required, lazy)
  //-           .form-tips.form-tips-error(v-if="editValidation4.$submitted && editValidation4.name.$pristine")
  //-             span(v-if="editValidation4.name.$error.required") {{ $t('validation.required', {field: $t('app.fields.name')}) }}
  //-           .form-tips.form-tips-error(v-if="editValidation4.name.$dirty")
  //-             span(v-if="editValidation4.name.$error.required") {{ $t('validation.required', {field: $t('app.fields.name')}) }}
  //-             span(v-if="editValidation4.name.$error.maxlength") {{ $t('validation.minlength', [ $t('app.fields.name'), 2]) }}
  //-             span(v-if="editValidation4.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('app.fields.name'), 32]) }}
  //-       .form-row
  //-         label.form-control {{ $t("app.fields.wechat_id") }}:
  //-         .controls
  //-           .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_id')")
  //-             input.input-text(v-model="editModel4.wechat.id", type="text", v-form-ctrl, name="wechat_id", lazy)
  //-       .form-row
  //-         label.form-control {{ $t("app.fields.wechat_app_id") }}:
  //-         .controls
  //-           .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_app_id')")
  //-             input.input-text(v-model="editModel4.wechat.app_id", type="text", v-form-ctrl, name="wechat_app_id", lazy)
  //-       .form-row
  //-         label.form-control {{ $t("app.fields.wechat_app_secret") }}:
  //-         .controls
  //-           .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_app_secret')")
  //-             input.input-text(v-model="editModel4.wechat.app_secret", type="text", v-form-ctrl, name="wechat_app_secret", lazy)
  //-       .form-row
  //-         label.form-control {{ $t("app.fields.wechat_encrypt") }}:
  //-         .controls
  //-           .radio-group.radio-group-v
  //-             template(v-for="type in encryptTypes")
  //-               label.radio
  //-                 input(type="radio", name="wechat_encrypt", v-model="editModel4.wechat.encrypt", :value="$index+1")
  //-                 | {{ type.label }}
  //-               p {{ type.info }}
  //-       .form-row
  //-         label.form-control {{ $t("app.fields.wechat_key") }}:
  //-         .controls
  //-           .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_key')")
  //-             textarea.input-text(v-model="editModel4.wechat.key", type="text", v-form-ctrl, name="wechat_key", lazy)
  //-       .form-row
  //-         label.form-control {{ $t("app.fields.app_url") }}:
  //-         .controls
  //-           .input-text-wrap(v-placeholder="$t('app.placeholders.app_url')")
  //-             input.input-text(v-model="editModel4.app_url", type="text", v-form-ctrl, name="app_url", lazy)
  //-       .form-actions
  //-         label.del-check
  //-           input(type="checkbox", name="del", v-model="delChecked")
  //-           | {{ $t("app.del_app") }}
  //-         button.btn.btn-default(@click.prevent.stop="onEditCancel4") {{ $t("common.cancel") }}
  //-         button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")

  // 新增授权警告浮层
  //- modal(:show.sync="showAlertModal",@close="onAlertCancel")
  //-   h3(slot="header") 确认删除
  //-   .form.form-rules(slot="body")
  //-     //- form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFormHook")
  //-     .form-row
  //-       p 确认删除该应用吗？
  //-     .form-actions
  //-       button.btn.btn-default(@click.prevent.stop="showAlertModal=false,this.editing=false") 取消
  //-       button.btn.btn-primary() 确定

</template>

<script>
  import Vue from 'vue';
  import locales from '../../consts/locales';
  import api from '../../api';
  import Modal from '../../components/modal.vue';
  import _ from 'lodash';

  module.exports = {
    name: 'Applications',

    components: {
      'modal': Modal
    },

    data: function () {
      return {
        apps: [],
        appTypes: locales[Vue.config.lang].app.types,
        encryptTypes: locales[Vue.config.lang].app.encrypt_types,
        showAddModal: false,
        showEditModal: false,
        showEditModal2: false,
        // showEditModal4: false,
        addModel: {
          name: '',
          type: 1
        },
        editModel: {
          type: 1
        },
        editModel2: {
          type: 1,
          android: {
            gcm_api_key: '',
            gcm_enable: false
          }
        },
        // editModel4: {
        //   type: 1,
        //   wechat: {
        //     id: '',
        //     app_id: '',
        //     app_secret: '',
        //     encrypt: 1,
        //     key: ''
        //   }
        // },
        originAddModel: {},
        originEditModel: {},
        originEditModel2: {},
        // originEditModel4: {},
        addValidation: {},
        editValidation: {},
        editValidation2: {},
        // editValidation4: {},
        adding: false,
        editing: false,
        uploading: false,
        delChecked: false,
        loadingApps: false,
        showAlertModal: false
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

      // 取消删除确认提醒
      onAlertCancel: function () {
        self.alertModel = false;
        self.editing = false;
      },
      // 添加应用表单钩子
      addAppHook: function (form) {
        this.addForm = form;
      },

      // 修改应用表单钩子
      editAppHook: function (form) {
        this.editForm = form;
      },

      // 修改安卓应用表单钩子
      editAppHook2: function (form) {
        this.editForm2 = form;
      },

      // 修改微信应用表单钩子
      // editAppHook4: function (form) {
      //   this.editForm4 = form;
      // },

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

      // 关闭安卓编辑浮层并净化编辑表单
      resetEdit2: function () {
        this.editing = false;
        this.showEditModal2 = false;
        this.delChecked = false;
        this.editModel2 = this.originEditModel2;
      },

      // 关闭微信编辑浮层并净化编辑表单
      // resetEdit4: function () {
      //   this.editing = false;
      //   this.showEditModal4 = false;
      //   this.delChecked = false;
      //   this.editModel4 = this.originEditModel4;
      // },

      // 取消添加
      onAddCancel: function () {
        this.resetAdd();
      },

      // 提交添加
      onAddSubmit: function () {
        var self = this;

        if (this.addValidation.$valid && !this.adding) {
          if (self.addModel.type === 1) { // iOS应用
            self.addModel.apn_enable = false;
            self.addModel.apn_license_url = '';
            self.addModel.apn_license_pwd = '';
            self.addModel.apn_license_production = false;
          }else if (self.addModel.type === 2) { // 安卓应用
            self.addModel.gcm_api_key = '';
            // self.addModel.gcm_enable = false;
          }
          // else if (self.addModel.type === 4) { // 微信应用
          //   self.addModel.wechat = {};
          //   self.addModel.wechat.id = '';
          //   self.addModel.wechat.app_id = '';
          //   self.addModel.wechat.app_secrect = '';
          //   self.addModel.wechat.encrypt = 1;
          //   self.addModel.wechat.key = '';
          //   self.addModel.app_url = '';
          // }
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
        if (app.type === 1) {
          this.showEditModal = true;
          this.editModel = _.cloneDeep(app);
          this.originEditModel = _.cloneDeep(app);
        } else if (app.type === 2) {
          this.showEditModal2 = true;
          this.editModel2 = _.cloneDeep(app);
          this.originEditModel2 = _.cloneDeep(app);
        }
        // else if (app.type === 4) {
        //   this.showEditModal4 = true;
        //   this.editModel4 = _.cloneDeep(app);
        //   this.originEditModel4 = _.cloneDeep(app);
        // }
      },

      // 取消应用编辑
      onEditCancel: function () {
        this.resetEdit();
      },

      // 取消安卓应用编辑
      onEditCancel2: function () {
        this.resetEdit2();
      },

      // 取消微信应用编辑
      // onEditCancel4: function () {
      //   this.resetEdit4();
      // },

      // 提交应用更新
      onEditSubmit: function (model) {
        var self = this;
        if (this.delChecked && !this.editing) {
          this.editing = true;
          var result = confirm('确认删除该应用吗?');
          if (result === true) {
            api.corp.refreshToken().then(function () {
              api.app.remove(model.id).then(function (data) {
                if (__DEBUG__) {
                  console.log(data);
                }
                if (model.type === 1) {
                  self.resetEdit();
                }else if (model.type === 2) {
                  self.resetEdit2();
                }
                // else if (model.type === 4) {
                //   self.resetEdit4();
                // }
                self.getApps();
              }).catch(function (error) {
                self.handleError(error);
                self.editing = false;
              });
            });
          } else {
            self.editing = false;
          }
          // api.corp.refreshToken().then(function () {
          //   api.app.remove(model.id).then(function (data) {
          //     if (__DEBUG__) {
          //       console.log(data);
          //     }
          //     if (model.type === 1) {
          //       self.resetEdit();
          //     }else if (model.type === 2) {
          //       self.resetEdit2();
          //     }
          //     // else if (model.type === 4) {
          //     //   self.resetEdit4();
          //     // }
          //     self.getApps();
          //   }).catch(function (error) {
          //     self.handleError(error);
          //     self.editing = false;
          //   });
          // });
          this.showAlertModal = true;
        } else if (model.type === 1 && this.editValidation.$valid && !this.editing) {
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
        } else if (model.type === 2 && this.editValidation2.$valid && !this.editing) {
          this.editing = true;
          // var n = { };
          // n.id = self.editModel2.id;
          // n.name = self.editModel2.name;
          // n.type = self.editModel2.type;
          // n.gcm_api_key = self.editModel2.android.gcm_api_key;
          // n.gcm_enable = self.editModel2.android.gcm_enable;
          console.log(model);
          api.corp.refreshToken().then(function () {
            api.app.update(self.editModel2).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.getApps();
              self.resetEdit2();
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        }
        // else if (model.type === 4 && this.editValidation4.$valid && !this.editing) {
        //   this.editing = true;
        //   api.corp.refreshToken().then(function () {
        //     api.app.update(self.editModel4).then(function (data) {
        //       if (__DEBUG__) {
        //         console.log(data);
        //       }
        //       self.getApps();
        //       self.resetEdit4();
        //     }).catch(function (error) {
        //       self.handleError(error);
        //       self.editing = false;
        //     });
        //   });
        // }
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
                  api.upload.apn(evt.target.result).then(function (data) {
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

<style lang="stylus">
.modal
  .form-edit-apk
    .form-row
      .controls
        width 470px

.wid130
  width 130px!important
.wid310
  width 310px!important
</style>
