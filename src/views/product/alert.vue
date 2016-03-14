<template lang="jade">
div
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        .action-group
          button.btn.btn-success(@click="showAddModal = true")
            i.fa.fa-plus
            | {{ $t("rule.add_rule") }}

      //- 通知与告警列表
      table.table.table-stripe.table-bordered
        thead
          tr
            th {{ $t("rule.fields.name") }}
            th {{ $t("rule.fields.type") }}
            th {{ $t("rule.fields.content") }}
            th {{ $t("common.status") }}
            th.tac {{ $t("common.action") }}
        tbody
          template(v-if="rules.length > 0 && !loadingData")
            tr(v-for="rule in rules")
              td {{* rule.name}}
              td {{* rule.type | ruleLabel}}
              td {{* rule.content}}
              td
                span.hl-green(v-if="rule.is_enable") {{ $t("common.enable") }}
                span.hl-gray(v-else) {{ $t("common.disabled") }}
              td.tac
                button.btn.btn-link.btn-sm(@click="editRule(rule)") {{ $t("common.edit") }}
          tr(v-if="loadingData")
            td.tac(colspan="5")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span {{ $t("common.data_loading") }}
          tr(v-if="rules.length === 0 && !loadingData")
            td.tac(colspan="5")
              .tips-null
                span {{ $t("common.no_records") }}
      // 分页
      pager(v-if="!loadingData", :total="rules.length", :current.sync="currentPage", :page-count="pageCount")

  // 添加规则浮层
  modal(:show.sync="showAddModal", :width="650", :flag="addModelEditingTag", @close="onAddCancel")
    h3(slot="header") {{ $t("rule.add_rule") }}
    .form.form-rules(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFormHook")
        .form-row
          label.form-control {{ $t("rule.fields.name") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('rule.placeholders.name')")
              input.input-text(v-model="addModel.name", type="text", v-form-ctrl, name="name", required, minlength="2", maxlength="32", lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.name.$pristine")
              span(v-if="addValidation.name.$error.required") {{ $t('validation.required', {field: $t('rule.fields.name')}) }}
            .form-tips.form-tips-error(v-if="addValidation.name.$dirty")
              span(v-if="addValidation.name.$error.required") {{ $t('validation.required', {field: $t('rule.fields.name')}) }}
              span(v-if="addValidation.name.$error.minlength") {{ $t('validation.minlength', [ $t('rule.fields.name'), 2]) }}
              span(v-if="addValidation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('rule.fields.name'), 32]) }}
        .form-row.condition-row
          label.form-control {{ $t("rule.condition") }}:
          .controls
            .type
              .select
                select(v-model="addModel.type", v-form-ctrl, name="type", number, @input="onSelectType")
                  option(v-for="type in ruleTypes", :value="$index+1", :selected="$index===0") {{type}}
            .data(v-show="addModel.type === 1")
              .select
                select(v-model="addModel.param", v-form-ctrl, name="param")
                  option(v-for="option in datapoints", v-bind:value="option.id") {{option.name}}
            .compare(v-show="addModel.type === 1")
              .select
                select(v-model="addModel.compare", v-form-ctrl, name="compare", number)
                  option(v-for="type in compareTypes", :value="$index+1", :selected="$index===0") {{type}}
            .value(v-if="addModel.type === 1")
              .input-text-wrap
                input.input-text(v-model="addModel.value", type="text", v-form-ctrl, name="value", required, lazy)
            .value(v-if="addModel.type === 2")
              .select
                select(v-model="addModel.value", v-form-ctrl, name="value")
                  option(value="online") {{ $t("common.online") }}
                  option(value="offline") {{ $t("common.offline") }}
        .form-row
          label.form-control {{ $t("rule.fields.content") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('rule.placeholders.content')")
              textarea.input-text(v-model="addModel.content", type="text", v-form-ctrl, name="content", required, maxlength="250", lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.content.$pristine")
              span(v-if="addValidation.content.$error.required") {{ $t('validation.required', {field: $t('rule.fields.content')}) }}
            .form-tips.form-tips-error(v-if="addValidation.content.$dirty")
              span(v-if="addValidation.content.$error.required") {{ $t('validation.required', {field: $t('rule.fields.content')}) }}
              span(v-if="addValidation.content.$error.maxlength") {{ $t('validation.maxlength', [ $t('rule.fields.content'), 250]) }}
        .form-row
          label.form-control {{ $t("rule.fields.inform_type") }}:
          .controls
            .select
              select(v-model="addModel.notify_type", v-form-ctrl, name="notify_type", number)
                option(v-for="type in informTypes", :value="$index+1", :selected="$index===0") {{type}}
        .form-row.tag-row
          label.form-control {{ $t("rule.fields.tags") }}:
          .controls
            tag-input(:value.sync="addModel.tag", :candidate="candidateTags", :editing.sync="addModelEditingTag", @adding-tag="showAddModal = true")
        .form-row
          label.form-control {{ $t("rule.fields.notify_type") }}:
          .controls
            .checkbox-group
              label.checkbox(v-for="type in notifyTypes")
                input(type="checkbox", v-model="addModel.notify_target", name="notify_target", :value="$index+1", number)
                | {{type}}
            .apn-list(v-show="showApps('addModel')")
              .checkbox-group
                label.checkbox(v-for="app in apps")
                  input(type="checkbox", v-model="addModel.notify_apps", name="notify_apps", :value="app.id", number)
                  | {{app.name}}
            //- .apn-list(v-show="showAndroids('addModel')")
            //-   .checkbox-group
            //-     label.checkbox(v-for="app in apps")
            //-       input(type="checkbox", v-model="addModel.notify_apps", name="notify_apps", :value="app.id", number)
            //-       | {{app.name}}
        .form-row
          label.form-control {{ $t("rule.fields.scope") }}:
          .controls
            .radio-group
              label.radio(v-for="type in scopeTypes")
                input(type="radio", v-model="addModel.scope", name="addModel.scope", :value="$index+1", number)
                | {{type}}
        .form-row
          label.form-control {{ $t("common.status") }}:
          .controls
            .radio-group
              label.radio
                input(type="radio", v-model="addModel.is_enable", name="is_enable", :value="false")
                | {{ $t("common.disabled") }}
              label.radio
                input(type="radio", v-model="addModel.is_enable", name="is_enable", :value="true")
                | {{ $t("common.enable") }}

        .form-actions
          button.btn.btn-default(type="reset", @click.prevent.stop="onAddCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit",:disabled="adding", :class="{'disabled':adding}", v-text="adding ? $t('common.handling') : $t('common.ok')")

  // 编辑规则浮层
  modal(:show.sync="showEditModal", :width="650", :flag="editModelEditingTag")
    h3(slot="header") {{ $t("rule.edit_rule") }}
    .form.form-rules(slot="body")
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit", hook="editFormHook")
        .form-row
          label.form-control {{ $t("rule.fields.name") }}:
          .controls
            .input-text-wrap(v-placeholder="$t('rule.placeholders.name')")
              input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", required, minlength="2", maxlength="32", lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.name.$pristine")
              span(v-if="editValidation.name.$error.required") {{ $t('validation.required', {field: $t('rule.fields.name')}) }}
            .form-tips.form-tips-error(v-if="editValidation.name.$dirty")
              span(v-if="editValidation.name.$error.required") {{ $t('validation.required', {field: $t('rule.fields.name')}) }}
              span(v-if="editValidation.name.$error.minlength") {{ $t('validation.minlength', [ $t('rule.fields.name'), 2]) }}
              span(v-if="editValidation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('rule.fields.name'), 32]) }}
        .form-row.condition-row
          label.form-control {{ $t("rule.condition") }}:
          .controls
            .type
              .select
                select(v-model="editModel.type", v-form-ctrl, name="type", number, @input="onSelectType")
                  option(v-for="type in ruleTypes", :value="$index+1", :selected="$index===0") {{type}}
            .data(v-show="editModel.type === 1")
              .select
                select(v-model="editModel.param", v-form-ctrl, name="param")
                  option(v-for="option in datapoints", v-bind:value="option.id") {{option.name}}
            .compare(v-show="editModel.type === 1")
              .select
                select(v-model="editModel.compare", v-form-ctrl, name="compare", number)
                  option(v-for="type in compareTypes", :value="$index+1", :selected="$index===0") {{type}}
            .value(v-if="editModel.type === 1")
              .input-text-wrap
                input.input-text(v-model="editModel.value", type="text", v-form-ctrl, name="value", required, lazy)
            .value(v-if="editModel.type === 2")
              .select
                select(v-model="editModel.value", v-form-ctrl, name="value")
                  option(value="online") {{ $t("common.online") }}
                  option(value="offline") {{ $t("common.offline") }}

        .form-row
          label.form-control {{ $t("rule.fields.content") }}:
          .controls
            .input-text-wrap(v-placeholder="'请输入告警内容'")
              textarea.input-text(v-model="editModel.content", type="text", v-form-ctrl, name="content", required, maxlength="250", lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.content.$pristine")
              span(v-if="editValidation.content.$error.required") {{ $t('validation.required', {field: $t('rule.fields.content')}) }}
            .form-tips.form-tips-error(v-if="editValidation.content.$dirty")
              span(v-if="editValidation.content.$error.required") {{ $t('validation.required', {field: $t('rule.fields.content')}) }}
              span(v-if="editValidation.content.$error.maxlength") {{ $t('validation.maxlength', [ $t('rule.fields.content'), 250]) }}
        .form-row
          label.form-control {{ $t("rule.fields.inform_type") }}:
          .controls
            .select
              select(v-model="editModel.notify_type", v-form-ctrl, name="notify_type", number)
                option(v-for="type in informTypes", :value="$index+1", :selected="$index===0") {{type}}
        .form-row.tag-row
          label.form-control {{ $t("rule.fields.tags") }}:
          .controls
            tag-input(:value.sync="editModel.tag", :candidate="candidateTags", :editing.sync="editModelEditingTag", @adding-tag="showEditModal = true")
        .form-row
          label.form-control {{ $t("rule.fields.notify_type") }}:
          .controls
            .checkbox-group
              label.checkbox(v-for="type in notifyTypes")
                input(type="checkbox", v-model="editModel.notify_target", name="notify_target", :value="$index+1", number)
                | {{type}}
            .apn-list(v-show="showApps('editModel')")
              .checkbox-group
                label.checkbox(v-for="app in apps")
                  input(type="checkbox", v-model="editModel.notify_apps", name="notify_apps", :value="app.id", number)
                  | {{app.name}}
            //- .apn-list(v-show="showAndroids('editModel')")
            //-   .checkbox-group
            //-     label.checkbox(v-for="app in apps")
            //-       input(type="checkbox", v-model="editModel.notify_apps", name="notify_apps", :value="app.id", number)
            //-       | {{app.name}}

        .form-row
          label.form-control {{ $t("rule.fields.scope") }}:
          .controls
            .radio-group
              label.radio(v-for="type in scopeTypes")
                input(type="radio", v-model="editModel.scope", name="scope", :value="$index+1", number)
                | {{type}}
        .form-row
          label.form-control {{ $t("common.status") }}:
          .controls
            .radio-group
              label.radio
                input(type="radio", v-model="editModel.is_enable", name="is_enable", :value="false")
                | {{ $t("common.disabled") }}
              label.radio
                input(type="radio", v-model="editModel.is_enable", name="is_enable", :value="true")
                | {{ $t("common.enable") }}

        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | {{ $t("rule.del_rule") }}
          button.btn.btn-default(@click.prevent.stop="onEditCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit",:disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")
</template>

<script>
  import Vue from 'vue';
  import api from '../../api';
  import locales from '../../consts/locales';
  import Pager from '../../components/pager.vue';
  import Modal from '../../components/modal.vue';
  import TagInput from '../../components/tag-input.vue';
  import _ from 'lodash';

  module.exports = {
    name: 'Alert',

    components: {
      'modal': Modal,
      'pager': Pager,
      'tag-input': TagInput
    },

    data: function () {
      return {
        rules: [],            // 规则列表
        apps: [],              // app 列表
        ruleTypes: locales[Vue.config.lang].rule.types,
        compareTypes: locales[Vue.config.lang].rule.compare_types,
        informTypes: locales[Vue.config.lang].rule.inform_types,
        notifyTypes: locales[Vue.config.lang].rule.notify_types,
        scopeTypes: locales[Vue.config.lang].rule.scope_types,
        datapoints: [],       // 数据端点
        currentPage: 1,       // 当前页
        pageCount: 10,        // 每页记录数
        showAddModal: false,  // 是否显示添加浮层
        showEditModal: false, // 是否显示编辑浮层
        candidateTags: locales[Vue.config.lang].rule.candidate_tags,      // 候选标签
        addModel: {           // 添加数据模型
          product_id: this.$route.params.id,
          name: '',
          tag: '',
          type: 1,
          notify_target: [],
          notify_apps: [],
          notify_type: 1,
          compare: 1,
          value: '0',
          scope: 1,
          is_enable: true,
          content: ''
        },
        addValidation: {},    // 添加验证
        editValidation: {},   // 修改验证
        addModelEditingTag: false, // 是否正在编辑添加浮层的标签
        editModelEditingTag: false, // 是否正在编辑编辑浮层的标签
        editModel: {
          tag: ''
        },
        delChecked: false,    // 是否删除
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
        var self = this;
        this.originAddModel = _.cloneDeep(this.addModel);
        this.getDatapoints().then(function (data) {
          self.datapoints = data;
          self.addModel.param = data[0].id;
        });
        this.getRules();
        this.getApps();
      }
    },

    filters: {
      ruleLabel: function (value) {
        return this.ruleTypes[value - 1];
      }
    },

    methods: {
      // 获取数据端点列表
      getDatapoints: function () {
        var self = this;
        return api.corp.refreshToken(this).then(function () {
          return api.product.getDatapoints(self.$route.params.id);
        });
      },

      // 获取告警规则列表
      getRules: function () {
        var self = this;

        this.loadingData = true;
        api.corp.refreshToken(this).then(function () {
          api.alert.getRules(self.$route.params.id).then(function (data) {
            self.rules = data;
            self.loadingData = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingData = false;
          });
        });
      },

      // 获取 APP 列表
      getApps: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.app.list().then(function (data) {
            self.apps = data;
          });
        });
      },

      // 是否显示 apps
      showApps: function (model) {
        return _.includes(this[model].notify_target, 4);
      },

      // 是否显示 安卓
      // showAndroids: function (model) {
      //   return _.includes(this[model].notify_target, 5);
      // },
      // 选择告警类型
      onSelectType: function () {
        if (this.addModel.type === 1) {
          this.addModel.compare = 1;
          this.addModel.value = 'online';
        } else {
          this.addModel.value = '';
        }
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
        this.addModel = _.cloneDeep(this.originAddModel);
        this.$nextTick(function () {
          self.addForm.setPristine();
        });
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit: function () {
        this.editing = false;
        this.delChecked = false;
        this.showEditModal = false;
        this.editModel = this.originEditModel;
      },

      // 取消添加
      onAddCancel: function () {
        this.resetAdd();
      },

      onAddSubmit: function () {
        var self = this;
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true;
          api.corp.refreshToken().then(function () {
            api.alert.addRule(self.addModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.getRules();
              self.resetAdd();
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

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
        if (this.delChecked && !this.editing) { // 删除
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.alert.deleteRule(self.editModel.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.resetEdit();
              self.getRules();
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.alert.updateRule(self.editModel, self.$route.params.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.resetEdit();
              self.getRules();
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

<style lang="stylus">
  @import '../../assets/stylus/common'

  .modal
    .form-rules
      .form-row
        .controls
          width 480px !important

      .tag-row
        overflow-y visible

      .apn-list
        background #FFF
        border 1px solid #DDD
        padding 5px 10px

      .condition-row
        .type
        .data
        .compare
        .value
          float left

        .type
          width 110px
          margin-right 10px

        .data
          width 140px
          margin-right 10px

        .compare
          width 80px
          margin-right 10px

        .value
          width 120px

</style>
