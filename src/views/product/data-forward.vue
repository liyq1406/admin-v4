<template lang="jade">
.row
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        .action-group
          button.btn.btn-success(@click="showAddModal = true")
            i.fa.fa-plus
            | {{ '添加规则' }}
      //- 数据端点列表
      table.table.table-stripe.table-bordered
        thead
          tr
            th {{ $t("dataforward.fields.id") }}
            th {{ $t("dataforward.fields.destination.url") }}
            th {{ $t("dataforward.fields.destination.type") }}
            th.tac {{ $t("common.action") }}
        tbody
          template(v-if="rules.length > 0 && !loadingData")
            tr(v-for="rule in rules | limitBy pageCount (currentPage-1)*pageCount")
              td {{* rule.id}}
              td {{* rule.destination.url}}
              td
                span(v-if="rule.destination.type===1") 转发到外部url
                span(v-if="rule.destination.type===2") 转发到内部插件处理单元
              td.tac
                button.btn-link(@click="editRule(rule)") {{ $t("common.edit") }}
          tr(v-if="loadingData")
            td.tac(colspan="4")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span {{ $t("common.data_loading") }}
          tr(v-if="rules.length === 0 && !loadingData")
            td.tac(colspan="4")
              .tips-null
                span {{ $t("common.no_records") }}
      pager(v-if="!loadingData", :total="rules.length", :current.sync="currentPage", :page-count="pageCount")

  // 添加转发规则
  modal(:show.sync="showAddModal")
    h3(slot="header") {{ '添加转发规则'}}
    .form(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit",hook="addFormHook")
        .form-row
          label.form-control {{ '数据的类型' }}:
          .controls
            .checkbox-group
              label.checkbox(v-for="type in ['设备上线', '设备下线', '设备激活', 'Pipe包', '设备同步包', '用户上线', '用户下线']")
                input(type="checkbox", v-model="addModel.data_type", :value="$index+1")
                | {{type}}
        .form-row
          label.form-control {{ '分发类型' }}:
          .controls
            .select
              select(v-model="addModel.destination.type", name="type", number)
                option(v-for="type in ['转发到外部url','转发到内部插件处理单元']", :value="$index+1", :selected="$index===0") {{type}}
        .form-row
          label.form-control {{ '数据分发目的地' }}:
          .controls
            .input-text-wrap(v-placeholder="'请输入URL'")
              input.input-text(v-model="addModel.destination.url", type="text", name="url", required, minlength="2", maxlength="32", lazy)
        .form-row
          label.form-control {{ 'token' }}:
          .controls
            .input-text-wrap(v-placeholder="'请输入token'")
              input.input-text(v-model="addModel.destination.token", type="text", name="token", required, minlength="2", maxlength="32", lazy)
        .form-actions
          button.btn.btn-default(type="reset", @click.prevent.stop="onAddCancel") {{ '取消' }}
          button.btn.btn-primary(type="submit",:disabled="adding", :class="{'disabled':adding}", v-text="adding ? $t('common.handling') : $t('common.ok')")

  // 编辑数据端点浮层
  modal(:show.sync="showEditModal")
    h3(slot="header") {{ '修改转发规则' }}
    .form(slot="body")
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit", hook="editFormHook")
        .form-row
          label.form-control {{ '数据的类型' }}:
          .controls
            .checkbox-group
              label.checkbox(v-for="type in ['设备上线', '设备下线', '设备激活', 'Pipe包', '设备同步包', '用户上线', '用户下线']")
                input(type="checkbox", v-model="editModel.data_type", :value="$index+1")
                | {{type}}
        .form-row
          label.form-control {{ '分发类型' }}:
          .controls
            .select
              select(v-model="editModel.destination.type", name="destination_type", number)
                option(v-for="type in ['转发到外部url','转发到内部插件处理单元']", :value="$index+1", :selected="$index===0") {{type}}
        .form-row
          label.form-control {{ '数据分发目的地' }}:
          .controls
            .input-text-wrap(v-placeholder="'请输入URL'")
              input.input-text(v-model="editModel.destination.url", type="text", name="url", required, minlength="2", maxlength="32", lazy)
        .form-row
          label.form-control {{ 'token' }}:
          .controls
            .input-text-wrap(v-placeholder="'请输入token'")
              input.input-text(v-model="editModel.destination.token", type="text", name="token", required, minlength="2", maxlength="32", lazy)
        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | {{ '删除转发规则' }}
          button.btn.btn-default(@click.prevent.stop="onEditCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit",:disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")
  </template>

<script>
import Vue from 'vue';
import api from '../../api';
import locales from '../../consts/locales';
import Modal from '../../components/modal.vue';
import Pager from '../../components/pager.vue';
import _ from 'lodash';

export default {
  name: 'DataForward',

  components: {
    'modal': Modal,
    'pager': Pager
  },

  data: function () {
    return {
      rules: [],            // 规则列表
      datapoints: [],
      // dataforwards: [
      //   {
      //     'id': '转发规则ID',
      //     'data_type': [
      //       '1',
      //       '2'
      //     ],
      //     'destination': {
      //       'type': '数据分发类型',
      //       'url': '数据分发url',
      //       'token': '分发url访问所需凭证'
      //     }
      //   },
      //   {
      //     'id': '转发规则ID',
      //     'data_type': [
      //       '1',
      //       '2'
      //     ],
      //     'destination': {
      //       'type': '数据分发类型',
      //       'url': '数据分发url',
      //       'token': '分发url访问所需凭证'
      //     }
      //   }
      // ],
      dataforwardTypes: locales[Vue.config.lang].dataforward.types,
      dateTypes: locales[Vue.config.lang].dataforward.datetype_forwards,
      destinationTypes: locales[Vue.config.lang].rule.destination_types,
      data_type: [],
      notify_type: [],
      pageCount: 10,
      currentPage: 1,
      showAddModal: false,
      showEditModal: false,
      addModel: {
        data_type: [],
        destination: {
          type: '',
          url: '',
          token: ''
        }
      },
      editModel: {
        data_type: [],
        destination: {
          type: '',
          url: '',
          token: ''
        }
      },
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
    data: function () {
      // var self = this;
      this.originAddModel = _.cloneDeep(this.addModel);
      this.getRule();
    }
  },
  ready: function () {
    this.getRule();
  },
  methods: {
    // 取消添加
    onAddCancel: function () {
      this.resetAdd();
    },
    // 关闭添加浮层并净化添加表单
    resetAdd: function () {
      var self = this;
      this.adding = false;
      this.showAddModal = false;
      this.addModel = _.cloneDeep(this.originAddModel);
      this.$nextTick(function () {
        self.addForm.setPristine();
      });
    },
    // 获取转发规则列表
    getRule: function () {
      var self = this;
      this.loadingData = true;
      api.corp.refreshToken(this).then(function () {
        api.dataForward.getRule(self.$route.params.id).then(function (data) {
          console.log(data);
          self.rules = data.list;
          self.loadingData = false;
        }).catch(function (error) {
          self.handleError(error);
          self.loadingData = false;
        });
      });
    },
    // 添加操作
    onAddSubmit: function () {
      var self = this;
      if (this.addValidation.$valid && !this.adding) {
        this.adding = true;
        api.corp.refreshToken().then(function () {
          api.dataForward.addRule(self.$route.params.id, self.addModel).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            self.rules.push(data);
            self.getRule();
            self.resetAdd();
          }).catch(function (error) {
            self.handleError(error);
            self.adding = false;
          });
        });
      }
    },
    // 关闭编辑浮层并净化编辑表单
    resetEdit: function () {
      this.editing = false;
      this.delChecked = false;
      this.showEditModal = false;
      this.editModel = this.originEditModel;
    },
    // // 初始化编辑表单
    // editDataPoint: function (datapoint) {
    //   this.showEditModal = true;
    //   this.editModel = _.clone(datapoint);
    //   this.originEditModel = _.clone(datapoint);
    // },

    // 初始化编辑表单
    editRule: function (rule) {
      this.showEditModal = true;
      this.editModel = _.clone(rule);
      this.originEditModel = _.clone(rule);
    },

    // 取消编辑
    onEditCancel: function () {
      this.resetEdit();
    },

    // 提交编辑表单
    onEditSubmit: function () {
      var self = this;
      console.log(111);
      if (this.delChecked && !this.editing) { // 删除
        this.editing = true;
        api.corp.refreshToken().then(function () {
          api.dataForward.deleteRule(self.$route.params.id, self.editModel.id).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            self.resetEdit();
            self.getRule();
          }).catch(function (error) {
            self.handleError(error);
            self.editing = false;
          });
        });
      } else if (this.editValidation.$valid && !this.editing) { // 更新
        this.editing = true;
        api.corp.refreshToken().then(function () {
          api.dataForward.updateRule(self.$route.params.id, self.editModel.id, self.editModel).then(function (data) {
            if (__DEBUG__) {
              console.log(data);
            }
            self.resetEdit();
            self.getRule();
          }).catch(function (error) {
            self.handleError(error);
            self.editing = false;
          });
        });
      }
    },
    // 添加表单钩子
    addFormHook: function (form) {
      this.addForm = form;
    },

    // 编辑表单钩子
    editFormHook: function (form) {
      this.editForm = form;
    }
  }
};
</script>
