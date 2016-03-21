<template lang="jade">
.row
  .panel
    .panel-bd
      pre {{selectedAppId}}
      .form.form-edit-apk
        form
          .form-row
            label.form-control 选择应用:
            .controls
              .select
                select(v-model="currProduct", name="app" @change="Appstatus")
                  //- option(selected) 请选择微信应用
                  option(v-for="app in apps", :value="app") {{app.name}}
            .controls.frr
              button.btn.btn-primary.frr(@click.prevent.stop="productEmpower", :disabled="empowering", :class="{'disabled':empowering}", v-text="empowering ? $t('common.unempower') : $t('common.empower')") 产品授权
              button.btn.btn-primary.mrr20.frr(@click.prevent.stop="showAlertModal = true" , :disabled="currProductEmpty", :class="{'disabled':currProductEmpty}") 授权设置
              button.btn.btn-success.mrr20.frr(@click.prevent.stop="showAddModal = true") 添加测试设备
          //- .form-row
          //-   label.form-control 产品名称:
          //-   .controls.lin35 {{currProduct.name}}
          //- .form-row.mxh
          //-   label.form-control 授权设置:
          //-   .controls
          //-     button.btn.btn-primary(@click.prevent.stop="showwechat") 授权设置
          //- .form-row
          //-   button.btn.btn-success.mrr20.frl(@click.prevent.stop="showAddModal = true") 添加单个设备
            //- button.btn.btn-success.mrr60 批量导入授权设备
            //- button.btn.btn-success.mrr60( @click.prevent.stop="showAddTaskModal = true")
            //-   i.fa.fa-plus
            //-   | 批量导入授权设备
            //- label.btn.btn-success.btn-upload.mrr60.frl(:class="{'disabled':importing}")
            //-   input(type="file",  v-el:device-file, name="deviceFile", @change.prevent="createMultiWechat")
            //-   i.fa.fa-reply-all
            //-   | {{importing ? $t("common.handling") : $t("overview.import_devices")}}
            //- button.btn.btn-primary(@click.prevent.stop="reEmpowerWechat") 再次授权
        //- 用户列表
        table.table.table-stripe.table-bordered
          thead
            tr
              //- th 勾选
              th 设备ID
              th MAC
              //- th 微信设备ID
              th 微信设备TYPE
              th 授权状态
          tbody
            template(v-if="devices.length > 0 && !loadingData")
              tr(v-for="device in devices | limitBy pageCount (currentPage-1)*pageCount")
                //- td
                //-   .controls
                //-     .checkbox-group
                //-       label.checkbox
                //-         input(type="checkbox", :value="$index" v-model="device.selected")
                //-         | {{type}}
                td {{ device.device_id }}
                td {{ device.mac }}
                //- td {{ device.w_device_id }}
                td {{ device.w_device_type }}
                td(v-if="device.status -0 === 0") 未授权
                td(v-if="device.status -0 === 1") 已授权
                td(v-if="device.status -0 === 2") 授权中
            tr(v-if="loadingData")
              td.tac(colspan="4")
                .tips-null
                  i.fa.fa-refresh.fa-spin
                  span {{ $t("common.data_loading") }}
            tr(v-if="devices.length === 0 && !loadingData")
              td.tac(colspan="4")
                .tips-null
                  span {{ $t("common.no_records") }}
        pager(v-if="!loadingData && devices.length > pageCount", :total="devices.length", :current.sync="currentPage", :page-count="pageCount")

  // 授权设置浮层
  modal(:show.sync="showSetModal", @close="onSetCancel")
    h3(slot="header") 授权设置页面
    .form.form-rules(slot="body")
      form(v-form, name="setValidation", @submit.prevent="onSetSubmit",hook="setFormHook")
        //- .form-row
        //-   label.form-control 微信产品ID:
        //-   .controls
        //-     label.form-control {{ currProduct.id }}
        .datatip.datatip_product_id(v-show="showTips1")
          | 设备的产品编号（由微信硬件平台分配）。可在公众号设备功能管理页面查询。<br />  当 op_type 为‘0’，product_id 为‘1’时，不要填写 product_id 字段（会引起不必要错误）；<br/>  当 op_typy 为‘0’，product_id 不为‘1’时，必须填写 product_id 字段；<br/>  当 op_type 为 1 时，不要填写 product_id 字段。

        .datatip.datatip_auth_key(v-show="showTips2")
          | auth及通信的加密key，第三方需要将key烧制在设备上（128bit），格式采用16进制串的方式（长度为32字节），不需要0X前缀，如:1234567890ABCDEF1234567890ABCDEF

        .datatip.datatip_close_strategy(v-show="showTips3")
          | 断开策略，目前支持：<br/>  1：退出公众号页面时即断开连接 <br/>  2：退出公众号之后保持连接不断开
        .datatip.datatip_conn_strategy(v-show="showTips4")
          | 连接策略，32位整型，按bit位置位，目前仅第1bit和第3bit位有效（bit置0为无效，1为有效；第2bit已被废弃），且bit位可以按或置位（如1|4=5），各bit置位含义说明如下：<br/>  1：（第1bit置位）在公众号对话页面，不停的尝试连接设备<br/>  4：（第3bit置位）处于非公众号页面（如主界面等），微信自动连接。当用户切换微信到前台时，可能尝试去连接设备，连上后一定时间会断开
        .datatip.datatip_crypt_method(v-show="showTips5")
          | auth加密方法，目前支持两种取值：<br/>  0：不加密<br/>  1：AES加密（CBC模式，PKCS7填充方式）
        .datatip.datatip_auth_ver(v-show="showTips6")
          | auth version，设备和微信进行auth时，会根据该版本号来确认auth buf和auth key的格式（各version对应的auth buf及key的具体格式可以参看“客户端蓝牙外设协议”），该字段目前支持取值：<br/>  0：不加密的version<br/>  1：version 1
        .datatip.datatip_manu_mac_pos(v-show="showTips7")
          | 表示mac地址在厂商广播manufature data里含有mac地址的偏移，取值如下：<br/>  -1：在尾部<br/>  -2：表示不包含mac地址<br/>  其他：非法偏移
        .datatip.datatip_ser_mac_pos(v-show="showTips8")
          | 表示mac地址在厂商serial number里含有mac地址的偏移，取值如下：<br/>  -1：表示在尾部 <br/>  -2：表示不包含mac地址 <br/>  其他：非法偏移
        .datatip.datatip_connect_protocol(v-show="showTips9")
          | 支持以下四种连接协议： <br/>android classic bluetooth – 1<br/>ios classic bluetooth – 2<br/>ble – 3<br/>wifi -- 4<br/>一个设备可以支持多种连接类型，用符号"|"做分割，客户端优先选择靠前的连接方式（优先级按|关系的排序依次降低），举例：<br/>1：表示设备仅支持andiod classic bluetooth <br/>1|2：表示设备支持andiod 和ios 两种classic bluetooth，但是客户端优先选择andriod classic bluetooth 协议，如果andriod classic bluetooth协议连接失败，再选择ios classic bluetooth协议进行连接<br/>（注：安卓平台不同时支持BLE和classic类型）
        .form-row
          label.form-control product_id:
            i.fa.fa-question-circle(@mouseover="showTips1 = true", @mouseout="showTips1 = false")
          .controls.wid250.inline
            .input-text-wrap
              input.input-text(v-model="setModel.product_id",type="text", name="product_id",placeholder="请输入微信产品ID" minlength="2", maxlength="32", lazy)
        p.redf 已经授权过的设备不支持更改产品ID
        .form-row
          label.form-control auth_key:
            i.fa.fa-question-circle(@mouseover="showTips2 = true", @mouseout="showTips2 = false")
          .controls.wid250.inline
            .input-text-wrap
              input.input-text(v-model="setModel.auth_key",type="text", name="auth_key",placeholder="请输入32位加密key" minlength="2", maxlength="32", lazy)
        .form-row
          label.form-control.wid160 close_strategy:
            i.fa.fa-question-circle(@mouseover="showTips3 = true", @mouseout="showTips3 = false")
          .controls.wid250.inline
            .radio-group.pleft30
              label.radio.lh35(v-for="type in ['1', '2']")
                input(type="radio", v-model="setModel.close_strategy",name="close_strategy", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control.wid160 conn_strategy:
            i.fa.fa-question-circle(@mouseover="showTips4 = true", @mouseout="showTips4 = false")
          .controls.wid250.inline
            .radio-group.pleft30
              label.radio.lh35(v-for="type in ['1', '4']")
                input(type="radio", v-model="setModel.conn_strategy", name="conn_strategy", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control.wid160 crypt_method:
            i.fa.fa-question-circle(@mouseover="showTips5 = true", @mouseout="showTips5 = false")
          .controls.wid250.inline
            .radio-group.pleft30
              label.radio.lh35(v-for="type in ['0', '1']")
                input(type="radio", v-model="setModel.crypt_method", name="crypt_method", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control.wid160 auth_ver:
            i.fa.fa-question-circle(@mouseover="showTips6 = true", @mouseout="showTips6 = false")
          .controls.wid250.inline
            .radio-group.pleft30
              label.radio.lh35(v-for="type in ['0', '1']")
                input(type="radio", v-model="setModel.auth_ver", name="auth_ver", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control.wid160 manu_mac_pos:
            i.fa.fa-question-circle(@mouseover="showTips7 = true", @mouseout="showTips7 = false")
          .controls.wid250.inline
            .radio-group.pleft30
              label.radio.lh35(v-for="type in ['-1', '-2']")
                input(type="radio", v-model="setModel.manu_mac_pos", name="manu_mac_pos", :value="type", number)
                | {{ type }}

        .form-row
          label.form-control.wid160 ser_mac_pos:
            i.fa.fa-question-circle(@mouseover="showTips8 = true", @mouseout="showTips8 = false")
          .controls.wid250.inline
            .radio-group.pleft30
              label.radio.lh35(v-for="type in ['-1', '-2']")
                input(type="radio", v-model="setModel.ser_mac_pos", name="ser_mac_pos", :value="type", number)
                | {{ type }}
        .form-row
          label.form-control.wid160 connect_protocol:
            i.fa.fa-question-circle(@mouseover="showTips9 = true", @mouseout="showTips9 = false")
          .controls.wid250.inline
            .radio-group.pleft30
              label.radio.lh35(v-for="type in ['1', '2', '3', '4']")
                input(type="radio", v-model="setModel.connect_protocol", name="connect_protocol", :value="type", number)
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
  // 新增授权警告浮层
  modal(:show.sync="showAlertModal",@close="onAlertCancel")
    h3(slot="header") 授权提醒
    .form.form-rules(slot="body")
      //- form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFormHook")
      .form-row
        p 确定要修改微信授权吗？
      .form-actions
        button.btn.btn-default(@click.prevent.stop="showAlertModal=false") 取消
        button.btn.btn-primary(@click.prevent.stop="showwechat") 确定

</template>

<script>
  // import Vue from 'vue';
  import api from '../../api';
  import Pager from '../../components/pager.vue';
  import Modal from '../../components/modal.vue';
  // import locales from '../../consts/locales';
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
        apps: [],
        currProduct: {},
        loadingFirmwares: false,
        tables: [],
        checkdatas: [],
        adding: false,
        empowering: false,
        setting: false,
        showSetModal: false,
        showAlertModal: false,
        showAddModal: false,
        addValidation: {},
        alertValidation: {},
        setValidation: {},
        originSetModel: {},
        originAddModel: {},
        setModel: {
          auth_key: '',
          close_strategy: '',
          conn_strategy: '',
          crypt_method: '',
          auth_ver: '',
          connect_protocol: '',
          manu_mac_pos: '',
          ser_mac_pos: '',
          product_id: ''
        },
        addModel: {},
        alertModel: {},
        reEmpowers: [],
        devices: [
          // {
          //   device_id: '设备ID',
          //   app_id: '应用ID',
          //   product_id: '产品ID',
          //   mac: 'MAC地址',
          //   w_device_id: '微信设备ID',
          //   w_device_type: '微信设备类型',
          //   status: '授权状态'
          // },
          // {
          //   device_id: '设备ID',
          //   app_id: '应用ID',
          //   product_id: '产品ID',
          //   mac: 'MAC地址',
          //   w_device_id: '微信设备ID',
          //   w_device_type: '微信设备类型',
          //   status: '授权状态'
          // }
        ],
        currentPage: 1,
        pageCount: 10,
        loadingData: false,
        showTips1: false,
        showTips2: false,
        showTips3: false,
        showTips4: false,
        showTips5: false,
        showTips6: false,
        showTips7: false,
        showTips8: false,
        showTips9: false,
        deviceEmpowering: false
      };
    },

    route: {
      data: function () {
        // this.getProducts();
        this.getApps();
        // this.ifEmpower();
        console.log(123);
        console.log(this.currProduct);

        // if (Object.keys(this.currProduct).length !== 0) {
        //   this.searchWechatList();
        //   this.empowerStatus();
        // }

      }
    },

    computed: {
      // 判断授权设置是否可按
      currProductEmpty: function () {
        return Object.keys(this.currProduct).length === 0;
      }
    },

    watch: {
      currProduct: function () {
        // console.log(1111);
        this.searchWechatList();
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
      // 获取 微信APP 列表
      getApps: function () {
        var self = this;
        // var app_name = localStorage.getItem('app_name');
        api.corp.refreshToken().then(function () {
          api.app.list().then(function (data) {
            var arr = [];
            data.forEach(function (item) {
              if (item.type - 0 === 4) {
                arr.push(item);
                if (item.id === window.localStorage.selectedAppId) {
                  self.currProduct = item;
                }
              }
            });
            self.apps = arr;
            // self.currProduct = app_name;
          });
        });
      },
      // 更改应用后获取列表与状态
      Appstatus: function () {
        var self = this;
        self.searchWechatList();
        self.empowerStatus();
      },

      /**
       * 查询授权设备列表
       */
      searchWechatList: function () {
        var self = this;
        this.loadingData = true;
        api.corp.refreshToken().then(function () {
          api.app.searchWechatList(self.currProduct.id, self.$route.params.id).then(function (data) {
            // this.ifEmpower();
            // 获取产品授权状态
            // self.empowerStatus();
            self.devices = data.list;
            console.log(self.devices);
            if (__DEBUG__) {
              console.log(data);
            };
            self.loadingData = false;
            // if (data.count > 0) {
            //   self.devices = data.list;
            //   self.devices.map(function (device) {
            //     device.selected = false;
            //   });
            // }
            // self.loadingData = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingData = false;
          });
        });
      },
      // 取消授权提醒
      onAlertCancel: function () {
        self.alertModel = false;
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
      // getProducts: function () {
      //   var self = this;
      //   api.corp.refreshToken().then(function () {
      //     api.product.getProducts().then(function (data) {
      //       self.products = data;
      //     });
      //   });
      // },
      /**
       * 设置授权
       */
      onSetSubmit: function () {
        var self = this;
        if (this.setValidation.$valid && !this.setting) {
          self.setting = true;
          api.corp.refreshToken().then(function () {
            console.log(JSON.stringify(self.setModel));
            api.app.empowerWechat(self.currProduct.id, self.$route.params.id, self.setModel).then(function (data) {
              self.resetSet();
              self.setting = false;
              localStorage.setItem('selectedAppId', self.currProduct.id);
            }).catch(function (error) {
              self.handleError(error);
              self.setting = false;
            });
          });
        }
      },
      // 微信授权提醒
      showAlert: function () {
        var self = this;
        self.alertModel = true;
      },
      // 微信授权
      showwechat: function () {
        var self = this;
        this.showSetModal = true;
        self.showAlertModal = false;
        api.corp.refreshToken().then(function () {
          console.log(JSON.stringify(self.setModel));
          api.app.getWechat(self.currProduct.id, self.$route.params.id).then(function (data) {
            if (Object.keys(data).length === 0) {
              self.setModel = {};
            } else {
              self.setModel = data.auth_config;
            }
            console.log(self.setModel);
          }).catch(function (error) {
            self.handleError(error);
            self.adding = false;
          });
        });
      },
      /**
       * 再次授权
       */
      // reEmpowerWechat: function () {
      //   var self = this;
      //   var newArr = [];
      //   self.devices.map(function (device) {
      //     if (device.selected) {
      //       newArr.push(device);
      //     }
      //   });
      //   api.corp.refreshToken().then(function () {
      //     console.log(JSON.stringify(self.setModel));
      //     api.app.reEmpowerWechat(self.$route.params.id, self.currProduct.id, newArr).then(function (data) {
      //       self.resetAdd();
      //     }).catch(function (error) {
      //       self.handleError(error);
      //       self.adding = false;
      //     });
      //   });
      //   console.log(newArr);
      //
      // },
      // 提交新增
      createWechat: function () {
        var self = this;
        console.log(111);
        console.log(self.addModel.mac);
        if (this.addValidation.$valid && !this.adding) {
          // var obj = {name: self.addModel.name};
          api.corp.refreshToken().then(function () {
            api.app.createWechat(self.currProduct.id, self.$route.params.id, self.addModel).then(function (data) {
              self.resetAdd();
              self.searchWechatList();
              // self.getKeys();
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },
      // 获取产品授权状态
      empowerStatus: function () {
        var self = this;
        self.deviceEmpowering = true;
        api.corp.refreshToken().then(function () {
          api.app.productEmpowerStatus(self.currProduct.id, self.$route.params.id).then(function (data) {
            console.log(data.status);
            if (data.status - 0 === 0) {
              self.empowering = false;
              self.deviceEmpowering = false;
              self.searchWechatList();
            } else {
              self.empowering = true;
              setTimeout(self.empowerStatus, 3000);
            }
          }).catch(function (error) {
            self.handleError(error);
            self.empowering = false;
          });
        });
      },

      // 产品授权
      productEmpower: function () {
        var self = this;
        console.log(self.currProduct.id);
        api.corp.refreshToken().then(function () {
          api.app.productEmpower(self.currProduct.id, self.$route.params.id).then(function () {
            // self.resetAdd();
            // self.getKeys();
            // 获取产品授权状态
            // api.corp.refreshToken().then(function () {
            //   api.app.productEmpowerStatus(self.currProduct.id, self.$route.params.id).then(function (data) {
            //     if (data.status - 0 === 0) {
            //       self.empowering = false;
            //     } else {
            //       self.empowering = true;
            //     }
            //   }).catch(function (error) {
            //     self.handleError(error);
            //     self.empowering = false;
            //   });
            // });
            self.empowerStatus();
          }).catch(function (error) {
            self.handleError(error);
            self.empowering = false;
          });
        });
      }

      // 批量导入
      // createMultiWechat: function () {
      //   var self = this;
      //   var file = this.$els.deviceFile.files[0];
      //   if (window.File && window.FileReader && window.FileList && window.Blob) {
      //     var reader = new FileReader();
      //     if (!/text\/\w+/.test(file.type)) {
      //       alert(file.name + self.$t('upload.type_tips'));
      //       return false;
      //     }
      //     reader.onerror = function (evt) {
      //       alert(self.$t('upload.read_err'));
      //     };
      //     this.importing = true;
      //     // 读取完成
      //     reader.onloadend = function (evt) {
      //       if (evt.target.readyState === FileReader.DONE) {
      //         var macArr = evt.target.result.replace(' ', '').replace(/\r\n/g, '\n').split('\n');
      //         var a = [];
      //         macArr.forEach(function (element, index) {
      //           if (element !== '') {
      //             a.push(element);
      //           }
      //         });
      //         macArr = a;
      //         api.corp.refreshToken().then(function () {
      //           api.app.createMultiWechat(self.$route.params.id, self.currProduct.id, macArr).then(function (status) {
      //             console.log(self.currProduct.id);
      //             if (status === 200) {
      //               alert(self.$t('upload.success_msg'));
      //               // self.getDevices();
      //             }
      //             self.importing = false;
      //           }).catch(function (error) {
      //             self.handleError(error);
      //             self.importing = false;
      //           });
      //         });
      //       }
      //     };
      //     reader.readAsText(file);
      //   } else {
      //     alert(self.$t('upload.compatiblity'));
      //   }
      // }
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
    float left!important
  .frr
    float right!important
  .lh35
    line-height 35px!important
    height 35px!important
  .modal .form-rules .form-row .controls.wid250
    width 250px!important
  .modal .form-rules .form-row .wid160
    width 160px!important
  .datatip
    z-index 9
    position absolute;
    width 350px
    left 60px
    /*margin-left: -43px;*/
    border 1px solid #ddd
    /*white-space: nowrap;*/
    background #fff
    padding 5px 10px
    font-size 12px
  .datatip_product_id
    top 100px
  .datatip_auth_key
    top 197px
  .datatip_close_strategy
    top 244px
  .datatip_conn_strategy
    top 291px
  .datatip_crypt_method
    top 338px
  .datatip_auth_ver
    top 385px
  .datatip_manu_mac_pos
    top 292px
  .datatip_ser_mac_pos
    top 338px
  .datatip_connect_protocol
    top 240px
  .inline
    display inline-block!important
  .modal .modal-body
    max-height 600px!important
  .redf
    color red
</style>
