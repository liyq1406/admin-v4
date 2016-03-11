<template lang="jade">
div
  .panel
    .panel-bd
      // 编辑微信应用
      modal(:show.sync="showEditModal4")
        //- h3(slot="header") 编辑应用({{editModel4.type | typeLabel}})
        .form.form-edit-apk
          form(v-form, name="editValidation4", @submit.prevent="onEditSubmit(editModel4)", hook="editAppHook4")
            //- .form-row
            //-   label.form-control {{ $t("datapoint.fields.type") }}:
            //-   .controls
            //-     .select
            //-       select(name="type" , v-model="editModel4.type")
            //-         option(v-for="type in ['type1','type2','type3']", :value="$index + 1") {{type}}
            .form-row
              label.form-control {{ $t("app.fields.name") }}:
              .controls
                //- .input-text-wrap(v-placeholder="$t('app.placeholders.name')")
                .input-text-wrap()
                  input.input-text(type="text",placeholder="请输入应用名称", v-model="editModel4.name", name="name", minlength="2", maxlength="32", required, lazy)
            .form-row
              label.form-control {{ $t("app.fields.wechat_id") }}:
              .controls
                //- .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_id')")
                .input-text-wrap
                  input.input-text(type="text", placeholder="请输入微信公众号ID" v-model="editModel4.wechat.id",  name="wechat_id", lazy)
            .form-row
              label.form-control {{ $t("app.fields.wechat_app_id") }}:
              .controls
                //- .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_app_id')")
                .input-text-wrap
                  input.input-text(type="text",v-model="editModel4.wechat.app_id", placeholder="请输入微信公众号APPID",  name="wechat_app_id", lazy)
            .form-row
              label.form-control {{ $t("app.fields.wechat_app_secret") }}:
              .controls
                //- .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_app_secret')")
                .input-text-wrap
                  input.input-text(type="text", v-model="editModel4.wechat.app_secret", placeholder="请输入微信公众号APPSecret",  name="wechat_app_secret", lazy)
            .form-row
              label.form-control {{ $t("app.fields.wechat_encrypt") }}:
              .controls
                .radio-group.radio-group-v
                  template(v-for="type in encryptTypes")
                    label.radio
                      input(type="radio",v-model="editModel4.wechat.encrypt", name="wechat_encrypt", :value="$index+1")
                      | {{ type.label }}
                    p {{ type.info }}
            .form-row
              label.form-control {{ $t("app.fields.wechat_key") }}:
              .controls
                //- .input-text-wrap(v-placeholder="$t('app.placeholders.wechat_key')")
                .input-text-wrap
                  textarea.input-text(type="text", v-model="editModel4.wechat.key", placeholder="请输入43位微信密匙",  name="wechat_key", lazy)
            .form-row
              label.form-control {{ $t("app.fields.app_url") }}:
              .controls
                .input-text-wrap
                  input.input-text(type="text",v-model='editModel4.wechat.url', placeholder="请输入云智易APP接收微信消息", name="app_url", lazy)
            .form-actions
              label.del-check
                input(type="checkbox", name="del", v-model="delChecked")
                | {{ $t("app.del_app") }}
              //- button.btn.btn-default(@click.prevent.stop="onEditCancel4") {{ $t("common.cancel") }}
              button.btn.btn-default(v-link="{path: '../../'}") {{ $t("common.cancel") }}
              //- {{ '取消' }}
              //- {{ '取消' }}
              button.btn.btn-primary(type="submit" ,:disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")
</template>

<script>
  import Vue from 'vue';
  import locales from '../../../consts/locales';
  import api from '../../../api';
  // import Modal from '../../../components/modal.vue';
  import _ from 'lodash';

  module.exports = {
    name: 'Applications',

    components: {
      // 'modal': Modal
    },

    data: function () {
      return {
        apps: [],
        appTypes: locales[Vue.config.lang].app.types,
        encryptTypes: locales[Vue.config.lang].app.encrypt_types,
        // showAddModal: false,
        // showEditModal: false,
        // showEditModal2: false,
        // showEditModal4: false,
        // addModel: {
        //   name: '',
        //   type: 1
        // },
        // editModel: {
        //   type: 1
        // },
        // editModel2: {
        //   type: 1
        // },
        editModel4: {
          type: 2,
          name: '',
          wechat: {
            id: '',
            app_id: '',
            app_secret: '',
            encrypt: 1,
            key: '',
            url: ''
          }
        },
        // originAddModel: {},
        // originEditModel: {},
        // originEditModel2: {},
        originEditModel4: {},
        // addValidation: {},
        // editValidation: {},
        // editValidation2: {},
        editValidation4: {},
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
        // this.getApps();
      }
    },

    filters: {
      typeLabel: function (value) {
        return this.appTypes[value - 1].label;
      }
    },
    ready: function () {
      this.getinfo();
    },
    methods: {
      // 获取 APP 详细信息
      getinfo: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.app.getinfo(self.$route.params.id).then(function (data) {
            self.editModel4 = data;
          });
        });
      },
      // 修改微信应用表单钩子
      editAppHook4: function (form) {
        this.editForm4 = form;
      },
      // 关闭编辑浮层并净化编辑表单
      // resetEdit4: function () {
      //   this.editing = false;
      //   this.showEditModal4 = true;
      //   this.delChecked = false;
      //   this.editModel4 = this.originEditModel4;
      // },

      // 初始化应用编辑表单
      onEditApp: function (app) {
        this.showEditModal4 = true;
        this.editModel4 = _.cloneDeep(app);
        this.originEditModel4 = _.cloneDeep(app);
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
          console.log(111);
          api.corp.refreshToken().then(function () {
            api.app.remove(self.$route.params.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              // if (model.type === 1) {
              //   self.resetEdit();
              // }
              self.$route.router.go('../../');
              if (model.type === 4) {
                self.resetEdit4();
              }
              // self.getApps();
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        } else {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            self.editModel4.type = 4;
            api.app.update(self.editModel4).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              // self.getApps();
              self.$route.router.go('../../');
              // self.resetEdit4();
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
