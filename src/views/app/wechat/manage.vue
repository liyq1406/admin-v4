<template lang="jade">
div
  .panel
    .panel-bd
      modal
      .form.form-edit-apk
        form
          .form-row
            label.form-control 选择产品:
            .controls
              .select
                select(v-model="currProduct", name="product" @change="searchWechatList")
                  option(value="0", selected) 请选择产品
                  option(v-for="product in products", :value="product") {{product.name}}
          //- .form-row
          //-   label.form-control 产品名称:
          //-   .controls.lin35 {{currProduct.name}}
          .form-row.mxh
            label.form-control 授权设置:
            .controls
              button.btn.btn-primary(@click.prevent.stop="showwechat") 设置
          .form-row
            button.btn.btn-success.mrr20.frl(@click.prevent.stop="showAddModal = true") 新增授权设备
            //- button.btn.btn-success.mrr60 批量导入授权设备
            //- button.btn.btn-success.mrr60( @click.prevent.stop="showAddTaskModal = true")
            //-   i.fa.fa-plus
            //-   | 批量导入授权设备
            label.btn.btn-success.btn-upload.mrr60.frl(:class="{'disabled':importing}")
              input(type="file",  v-el:device-file, name="deviceFile", @change.prevent="createMultiWechat")
              i.fa.fa-reply-all
              | {{importing ? $t("common.handling") : $t("overview.import_devices")}}
            button.btn.btn-primary(@click.prevent.stop="reEmpowerWechat") 再次授权
        //- 用户列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th 勾选
              th 设备ID
              th MAC
              th 微信设备ID
              th 微信设备TYPE
              th 授权状态
          tbody
            template(v-if="devices.length > 0 && !loadingData")
              tr(v-for="device in devices | limitBy pageCount (currentPage-1)*pageCount")
                td
                  .controls
                    .checkbox-group
                      label.checkbox
                        input(type="checkbox", :value="$index" v-model="device.selected")
                        | {{type}}
                td {{ device.device_id }}
                td {{ device.mac }}
                td {{ device.w_device_id }}
                td {{ device.w_device_type }}
                td(v-if='device.status -0 === 0') 未授权
                td(v-else) 已授权
            tr(v-if="loadingData")
              td.tac(colspan="6")
                .tips-null
                  i.fa.fa-refresh.fa-spin
                  span {{ $t("common.data_loading") }}
            tr(v-if="devices.length === 0 && !loadingData")
              td.tac(colspan="6")
                .tips-null
                  span {{ $t("common.no_records") }}
        pager(v-if="!loadingData", :total="devices.length", :current.sync="currentPage", :page-count="pageCount")

  // 授权设置浮层
  modal(:show.sync="showSetModal", @close="onSetCancel")
    h3(slot="header") 授权设置页面
    .form.form-rules(slot="body")
      form(v-form, name="setValidation", @submit.prevent="onSetSubmit",hook="setFormHook")
        .form-row
          label.form-control auth_key:
          .controls
            .input-text-wrap
              input.input-text(v-model="setModel.auth_key",type="text", name="auth_key",placeholder="请输入32位加密key" minlength="2", maxlength="32", lazy)

        .form-row
          label.form-control close_strategy:
          .controls
            .radio-group.pleft30
              label.radio(v-for="type in ['1', '2']")
                input(type="radio", v-model="setModel.close_strategy",name="close_strategy", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control conn_strategy:
          .controls
            .radio-group.pleft30
              label.radio(v-for="type in ['1', '4']")
                input(type="radio", v-model="setModel.conn_strategy", name="conn_strategy", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control crypt_method:
          .controls
            .radio-group.pleft30
              label.radio(v-for="type in ['0', '1']")
                input(type="radio", v-model="setModel.crypt_method", name="crypt_method", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control auth_ver:
          .controls
            .radio-group.pleft30
              label.radio(v-for="type in ['0', '1']")
                input(type="radio", v-model="setModel.auth_ver", name="auth_ver", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control manu_mac_pos:
          .controls
            .radio-group.pleft30
              label.radio(v-for="type in ['-1', '-2']")
                input(type="radio", v-model="setModel.manu_mac_pos", name="manu_mac_pos", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control ser_mac_pos:
          .controls
            .radio-group.pleft30
              label.radio(v-for="type in ['-1', '-2']")
                input(type="radio", v-model="setModel.ser_moc_pos", name="ser_moc_pos", :value="type", number)
                | {{ type }}
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onSetCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="setting", :class="{'disabled':setting}", v-text="setting ? $t('common.handling') : $t('common.ok')")

  // 新增授权浮层
  modal(:show.sync="showAddModal", @close="onAddCancel")
    h3(slot="header") 新增授权页面
    .form.form-rules(slot="body")
      //- form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFormHook")
      form(v-form, name="addValidation", @submit.prevent.stop="createWechat",hook="addFormHook")
        .form-row
          label.form-control {{ $t("overview.addForm.mac")}}:
          .controls
            .input-text-wrap(v-placeholder="$t('overview.addForm.mac_placeholder')")
              //- input.input-text(v-model="addModel.mac", type="text", v-form-ctrl, name="mac", required, lazy)
              input.input-text(v-model="addModel.mac",type="text", name="mac", required, lazy)
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onAddCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? $t('common.handling') : $t('common.ok')")

</template>

<script>
  // import Vue from 'vue';
  import api from '../../../api';
  import Pager from '../../../components/pager.vue';
  import Modal from '../../../components/modal.vue';
  // import locales from '../../../consts/locales';
  import _ from 'lodash';

  module.exports = {
    name: 'DataTables',

    components: {
      'modal': Modal,
      'pager': Pager
    },

    data: function () {
      return {
        firmwares: [],
        products: [],
        currProduct: {},
        loadingFirmwares: false,
        tables: [],
        checkdatas: [],
        adding: false,
        setting: false,
        showSetModal: false,
        showAddModal: false,
        addValidation: {},
        setValidation: {},
        originSetModel: {},
        originAddModel: {},
        setModel: {},
        addModel: {},
        reEmpowers: [],
        devices: [],
        currentPage: 1,
        pageCount: 10,
        loadingData: false
      };
    },

    route: {
      data: function () {
        this.getProducts();
        console.log(this.currProduct);
        if (this.currProduct - 0) {
          this.searchWechatList();
        }

      }
    },

    methods: {
      // 关闭授权浮层并净化表单
      resetSet: function () {
        // var self = this;
        this.setting = false;
        this.showSetModal = false;
        this.setModel = _.clone(this.originSetModel);
        // this.$nextTick(function () {
        //   self.setForm.setPristine();
        // });
      },
      /**
       * 查询授权设备列表
       */
      searchWechatList: function () {
        var self = this;
        this.loadingData = true;
        api.corp.refreshToken().then(function () {
          api.app.searchWechatList(self.$route.params.id, self.currProduct.id).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            if (data.count > 0) {
              self.devices = data.list;
              self.devices.map(function (device) {
                device.selected = false;
              });
            } else {
              self.loadingData = false;
            }

            // self.loadingData = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingData = false;
          });
        });
      },
      // 取消授权
      onSetCancel: function () {
        this.resetSet();
      },
      // 授权表单钩子
      setFormHook: function (form) {
        this.setForm = form;
      },
      // 关闭添加授权浮层并净化添加表单
      resetAdd: function () {
        // var self = this;
        this.adding = false;
        this.showAddModal = false;
        this.addModel = _.clone(this.originAddModel);
      },
      // 取消添加
      onAddCancel: function () {
        this.resetAdd();
        // console.log(123);
      },
      // 添加表单钩子
      addFormHook: function (form) {
        this.addForm = form;
      },
      /**
       * 获取产品
       */
      getProducts: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.product.getProducts().then(function (data) {
            self.products = data;
          });
        });
      },
      /**
       * 设置授权
       */
      onSetSubmit: function () {
        var self = this;
        if (this.setValidation.$valid && !this.setting) {
          self.setting = true;
          api.corp.refreshToken().then(function () {
            console.log(JSON.stringify(self.setModel));
            api.app.empowerWechat(self.$route.params.id, self.currProduct.id, self.setModel).then(function (data) {
              self.resetAdd();
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      // 微信授权
      showwechat: function () {
        var self = this;
        this.showSetModal = true;
        api.corp.refreshToken().then(function () {
          console.log(JSON.stringify(self.setModel));
          api.app.getWechat(self.$route.params.id, self.currProduct.id).then(function (data) {
            self.setModel = data;
          }).catch(function (error) {
            self.handleError(error);
            self.adding = false;
          });
        });
      },
      /**
       * 再次授权
       */
      reEmpowerWechat: function () {
        var self = this;
        var newArr = [];
        self.devices.map(function (device) {
          if (device.selected) {
            newArr.push(device);
          }
        });
        api.corp.refreshToken().then(function () {
          console.log(JSON.stringify(self.setModel));
          api.app.reEmpowerWechat(self.$route.params.id, self.currProduct.id, newArr).then(function (data) {
            self.resetAdd();
          }).catch(function (error) {
            self.handleError(error);
            self.adding = false;
          });
        });
        console.log(newArr);

      },
      // 提交新增
      createWechat: function () {
        var self = this;
        console.log(111);
        console.log(self.addModel.mac);
        if (this.addValidation.$valid && !this.adding) {
          // var obj = {name: self.addModel.name};
          api.corp.refreshToken().then(function () {
            api.app.createWechat(self.$route.params.id, self.currProduct.id, self.addModel.mac).then(function (data) {
              self.resetAdd();
              // self.getKeys();
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      // 批量导入
      createMultiWechat: function () {
        var self = this;
        var file = this.$els.deviceFile.files[0];
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new FileReader();
          if (!/text\/\w+/.test(file.type)) {
            alert(file.name + self.$t('upload.type_tips'));
            return false;
          }
          reader.onerror = function (evt) {
            alert(self.$t('upload.read_err'));
          };
          this.importing = true;
          // 读取完成
          reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
              var macArr = evt.target.result.replace(' ', '').replace(/\r\n/g, '\n').split('\n');
              var a = [];
              macArr.forEach(function (element, index) {
                if (element !== '') {
                  a.push(element);
                }
              });
              macArr = a;
              api.corp.refreshToken().then(function () {
                api.app.createMultiWechat(self.$route.params.id, self.currProduct.id, macArr).then(function (status) {
                  console.log(self.currProduct.id);
                  if (status === 200) {
                    alert(self.$t('upload.success_msg'));
                    // self.getDevices();
                  }
                  self.importing = false;
                }).catch(function (error) {
                  self.handleError(error);
                  self.importing = false;
                });
              });
            }
          };
          reader.readAsText(file);
        } else {
          alert(self.$t('upload.compatiblity'));
        }
      }
    }
  };
</script>

<style lang="stylus">
  .lin35
    line-height 35px
  .mrr20
    margin-right 20px
  .mrr60
    margin-right 60px
  .pleft30
    padding-left 30px
  .frl
    float left
</style>
