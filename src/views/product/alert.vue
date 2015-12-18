<template lang="jade">
  div
    .panel
      .panel-bd
        //- 操作栏
        .action-bar
          .action-group
            button.btn.btn-success(@click="showAddModal = true")
              i.fa.fa-plus
              | 添加规则

        //- 通知与告警列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th 规则名称
              th 告警类型
              th 内容
              th 状态
              th.tac 操作
          tbody
            tr(v-for="rule in rules")
              td {{rule.name}}
              td
                span(v-if="rule.type === 1") 数据端点
                span(v-if="rule.type === 2") 设备状态
              td {{rule.content}}
              td
                span.hl-green(v-if="is_enable") 启用
                span.hl-gray(v-else) 禁用
              td.tac
                button.btn.btn-link.btn-sm(@click="editRule(rule)") 编辑
            tr(v-if="rules.length === 0")
              td.tac(colspan="5")
                i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                .tips-null(v-else) 暂无规则
        // 分页
        pager(:total="rules.length", :current.sync="currentPage", :page-count="pageCount")

    // 添加规则浮层
    modal(:show.sync="showAddModal", :width="650", :flag="addModelEditingTag")
      h3(slot="header") 添加规则
      .form.form-rules(slot="body")
        form(v-form, name="addValidation", @submit.prevent="onAddSubmit")
          .form-row
            label.form-control 规则名称：
            .controls
              .input-text-wrap(v-placeholder="'请输入规则名称'")
                input.input-text(v-model="addModel.name", type="text", v-form-ctrl, name="name", required, minlength="2", maxlength="32")
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.name.$pristine")
                span(v-if="addValidation.name.$error.required") 请输入规则名称
              .form-tips.form-tips-error(v-if="addValidation.name.$dirty")
                span(v-if="addValidation.name.$error.required") 请输入规则名称
                span(v-if="addValidation.name.$error.minlength") 规则名称不能少于2个字符
                span(v-if="addValidation.name.$error.maxlength") 规则名称不能超过32个字符
          .form-row.condition-row
            label.form-control 告警条件：
            .controls
              .type
                .select
                  select(v-model="addModel.type", v-form-ctrl, name="type", number, @input="onSelectType")
                    option(value="1") 数据端点
                    option(value="2") 设备状态
              .data(v-show="addModel.type === 1")
                .select
                  select(v-model="addModel.param", v-form-ctrl, name="param")
                    option(v-for="option in datapoints", v-bind:value="option.id") {{option.name}}
              .compare(v-show="addModel.type === 1")
                .select
                  select(v-model="addModel.compare", v-form-ctrl, name="compare", number)
                    option(value="1") 等于
                    option(value="2") 大于
                    option(value="3") 小于
              .value(v-if="addModel.type === 1")
                .input-text-wrap
                  input.input-text(v-model="addModel.value", type="text", v-form-ctrl, name="value", required)
              .value(v-if="addModel.type === 2")
                .select
                  select(v-model="addModel.value", v-form-ctrl, name="value")
                    option(value="online") 上线
                    option(value="offline") 下线
          .form-row
            label.form-control 告警内容：
            .controls
              .input-text-wrap(v-placeholder="'请输入告警内容'")
                textarea.input-text(v-model="addModel.content", type="text", v-form-ctrl, name="content", required, maxlength="250")
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.content.$pristine")
                span(v-if="addValidation.content.$error.required") 请输入告警内容
              .form-tips.form-tips-error(v-if="addValidation.content.$dirty")
                span(v-if="addValidation.content.$error.required") 请输入告警内容
                span(v-if="addValidation.content.$error.maxlength") 告警内容不能超过250个字符
          .form-row
            label.form-control 通知类型：
            .controls
              .select
                select(v-model="addModel.notify_type", v-form-ctrl, name="notify_type", number)
                  option(value="1") 通知类型
                  option(value="2") 告警类型
          .form-row.tag-row
            label.form-control 标签：
            .controls
              tag-input(:value.sync="addModel.tag", :candidate="candidateTags", :editing.sync="addModelEditingTag", @adding-tag="showAddModal = true")
          .form-row
            label.form-control 通知方式：
            .controls
              .checkbox-group
                label.checkbox
                  input(type="checkbox", v-model="addModel.notify_target", name="notify_target", value="1", number)
                  | 短信
                label.checkbox
                  input(type="checkbox", v-model="addModel.notify_target", name="notify_target", value="2", number)
                  | 邮箱
                label.checkbox
                  input(type="checkbox", v-model="addModel.notify_target", name="notify_target", value="3", number)
                  | 移动应用推送
          .form-row
            label.form-control 可见范围：
            .controls
              .radio-group
                label.radio
                  input(type="radio", v-model="addModel.scope", name="addModel.scope", value="1", number)
                  | 企业可见
                label.radio
                  input(type="radio", v-model="addModel.scope", name="addModel.scope", value="2", number)
                  | 用户可见
                label.radio
                  input(type="radio", v-model="addModel.scope", name="addModel.scope", value="3", number)
                  | 全部可见
          .form-row
            label.form-control 状态：
            .controls
              .radio-group
                label.radio
                  input(type="radio", v-model="addModel.is_enable", name="is_enable", :value="false")
                  | 禁用
                label.radio
                  input(type="radio", v-model="addModel.is_enable", name="is_enable", :value="true")
                  | 启用

          .form-actions
            button.btn.btn-default(@click.stop="onAddCancel") 取消
            button.btn.btn-primary(type="submit") 确定

    // 编辑规则浮层
    modal(:show.sync="showEditModal", :width="650", :flag="editModelEditingTag")
      h3(slot="header") 编辑规则
      .form.form-rules(slot="body")
        form(v-form, name="editValidation", @submit.prevent="onEditSubmit")
          .form-row
            label.form-control 规则名称：
            .controls
              .input-text-wrap(v-placeholder="'请输入规则名称'")
                input.input-text(v-model="editModel.name", type="text", v-form-ctrl, name="name", required, minlength="2", maxlength="32")
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.name.$pristine")
                span(v-if="editValidation.name.$error.required") 请输入规则名称
              .form-tips.form-tips-error(v-if="editValidation.name.$dirty")
                span(v-if="editValidation.name.$error.required") 请输入规则名称
                span(v-if="editValidation.name.$error.minlength") 规则名称不能少于2个字符
                span(v-if="editValidation.name.$error.maxlength") 规则名称不能超过32个字符
          .form-row.condition-row
            label.form-control 告警条件：
            .controls
              .type
                .select
                  select(v-model="editModel.type", v-form-ctrl, name="type", number, @input="onSelectType")
                    option(value="1") 数据端点
                    option(value="2") 设备状态
              .data(v-show="editModel.type === 1")
                .select
                  select(v-model="editModel.param", v-form-ctrl, name="param")
                    option(v-for="option in datapoints", v-bind:value="option.id") {{option.name}}
              .compare(v-show="editModel.type === 1")
                .select
                  select(v-model="editModel.compare", v-form-ctrl, name="compare", number)
                    option(value="1") 等于
                    option(value="2") 大于
                    option(value="3") 小于
              .value(v-if="editModel.type === 1")
                .input-text-wrap
                  input.input-text(v-model="editModel.value", type="text", v-form-ctrl, name="value", required)
              .value(v-if="editModel.type === 2")
                .select
                  select(v-model="editModel.value", v-form-ctrl, name="value")
                    option(value="online") 上线
                    option(value="offline") 下线

          .form-row
            label.form-control 告警内容：
            .controls
              .input-text-wrap(v-placeholder="'请输入告警内容'")
                textarea.input-text(v-model="editModel.content", type="text", v-form-ctrl, name="content", required, maxlength="250")
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.content.$pristine")
                span(v-if="editValidation.content.$error.required") 请输入告警内容
              .form-tips.form-tips-error(v-if="editValidation.content.$dirty")
                span(v-if="editValidation.content.$error.required") 请输入告警内容
                span(v-if="editValidation.content.$error.maxlength") 告警内容不能超过250个字符
          .form-row
            label.form-control 通知类型：
            .controls
              .select
                select(v-model="editModel.notify_type", v-form-ctrl, name="notify_type", number)
                  option(value="1") 通知类型
                  option(value="2") 告警类型
          .form-row.tag-row
            label.form-control 标签：
            .controls
              tag-input(:value.sync="editModel.tag", :candidate="candidateTags", :editing.sync="editModelEditingTag", @adding-tag="showEditModal = true")
          .form-row
            label.form-control 通知方式：
            .controls
              .checkbox-group
                label.checkbox
                  input(type="checkbox", v-model="editModel.notify_target", name="notify_target", value="1", number)
                  | 短信
                label.checkbox
                  input(type="checkbox", v-model="editModel.notify_target", name="notify_target", value="2", number)
                  | 邮箱
                label.checkbox
                  input(type="checkbox", v-model="editModel.notify_target", name="notify_target", value="3", number)
                  | 移动应用推送
          .form-row
            label.form-control 可见范围：
            .controls
              .radio-group
                label.radio
                  input(type="radio", v-model="editModel.scope", name="scope", value="1", number)
                  | 企业可见
                label.radio
                  input(type="radio", v-model="editModel.scope", name="scope", value="2", number)
                  | 用户可见
                label.radio
                  input(type="radio", v-model="editModel.scope", name="scope", value="3", number)
                  | 全部可见
          .form-row
            label.form-control 状态：
            .controls
              .radio-group
                label.radio
                  input(type="radio", v-model="editModel.is_enable", name="is_enable", :value="false")
                  | 禁用
                label.radio
                  input(type="radio", v-model="editModel.is_enable", name="is_enable", :value="true")
                  | 启用

          .form-actions
            label.del-check
              input(type="checkbox", name="del", v-model="delChecked")
              | 删除告警规则
            button.btn.btn-default(@click.prevent.stop="onEditCancel") 取消
            button.btn.btn-primary(type="submit") 确定
</template>

<script>
  var api = require('../../api');
  var Pager = require('../../components/pager.vue');
  var Modal = require('../../components/modal.vue');
  var TagInput = require('../../components/tag-input.vue');

  module.exports = {
    components: {
      'modal': Modal,
      'pager': Pager,
      'tag-input': TagInput
    },

    data: function () {
      return {
        rules: [],            // 规则列表
        datapoints: [],       // 数据端点
        currentPage: 1,       // 当前页
        pageCount: 10,        // 每页记录数
        showAddModal: false,  // 是否显示添加浮层
        showEditModal: false, // 是否显示编辑浮层
        candidateTags: [      // 候选标签
          '严重',
          '轻微',
          '通知'
        ],
        addModelEditingTag: false,
        originAddModel: {           // 添加数据模型
          product_id: this.$route.params.id,
          name: '',
          tag: '',
          type: 1,
          notify_target: [],
          notify_type: 1,
          compare: 1,
          value: '',
          scope: 1,
          is_enable: false
        },
        addModel: {           // 添加数据模型
          product_id: this.$route.params.id,
          name: '',
          tag: '',
          type: 1,
          notify_target: [],
          notify_type: 1,
          compare: 1,
          value: '',
          scope: 1,
          is_enable: false
        },
        addValidation: {},    // 添加验证
        editValidation: {},   // 修改验证
        editModelEditingTag: false,
        editModel: {          // 编辑数据模型
          product_id: '',
          name: '',
          tag: '',
          type: 1,
          notify_target: [],
          notify_type: 1,
          compare: 1,
          value: '',
          scope: 1,
          is_enable: false
        },
        originEditModel: {},      // 原数据模型
        delChecked: false     // 是否删除
      }
    },

    route: {
      data: function () {
        var self = this;
        this.getDatapoints().then(function (data) {
          self.datapoints = data;
          self.addModel.param = data[0].id;
        });

        return {
          rules: this.getRules()
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

      getRules: function () {
        var self = this;
        return api.corp.refreshToken(this).then(function () {
          return api.alert.getRules(self.$route.params.id)
        });
      },

      onSelectType: function () {
        if (this.addModel.type === 1) {
          this.addModel.compare = 1;
          this.addModel.value = 'online';
        } else {
          this.addModel.value = '';
        }
      },

      onAddCancel: function () {
        // this.addModelEditingTag = false;
        this.addModel = this.originAddModel;
        this.showAddModal = false;
      },

      onAddSubmit: function () {
        var self = this;
        if (this.addValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.alert.addRule(self.addModel).then(function (data) {
              self.showAddModal = false;
              self.rules.push(data);
            });
          });
        }
      },

      editRule: function (rule) {
        this.showEditModal = true;
        this.editModel = rule;
        this.originEditModel = _.clone(rule);
      },

      onEditCancel: function () {
        this.showEditModal = false;
        this.editModel = this.originEditModel;
      },

      onEditSubmit: function () {
        var self = this;
        if (this.delChecked) {
          api.corp.refreshToken().then(function () {
            api.alert.deleteRule(self.editModel.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.rules.$remove(self.editModel);
              self.showEditModal = false;
            });
          });
        } else if (this.editValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.alert.updateRule(self.editModel).then(function (data) {
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

<style lang="stylus">
  @import '../../assets/stylus/common'

  .modal
    .form-rules
      .form-row
        .controls
          width 480px

      .tag-row
        overflow-y visible

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
