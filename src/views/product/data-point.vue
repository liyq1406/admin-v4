<template lang="jade">
  div
    .panel
      .panel-bd
        //- 操作栏
        .action-bar
          .action-group
            button.btn.btn-default(@click="showModal = true")
              i.fa.fa-plus
              | 添加数据端点

        //- 数据端点列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th mac
              th 是否激活
              th 激活时间
              th 最后一次登录
              th.tac 操作
          tbody
            tr(v-for="datapoint in datapoints")
              td ACCF2356BF53
              td 是
              td 2015-10-15 22:30:12
              td 2015-10-15 22:30:12
              td.tac
                button.btn-link 编辑
        .pager.tar
          button.pager-btn.pager-prev
            i.fa.fa-chevron-left
          input.pager-input(type="text")
          button.pager-btn.pager-next
            i.fa.fa-chevron-right

    modal(:show.sync="showModal")
      h3(slot="header") 添加数据端点
      .form(slot="body")
        form(v-form, name="addValidation", @submit.prevent="onSubmit")
          .form-row
            label.form-control 索引：
            .controls
              .input-text-wrap(v-placeholder="'数据端点索引不能重复'")
                input.input-text(v-model="model.index", type="number", v-form-ctrl, name="index", maxlength="32", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.index.$pristine")
                span(v-if="addValidation.index.$error.required") 请输入数据端点索引
              .form-tips.form-tips-error(v-if="addValidation.index.$dirty")
                span(v-if="addValidation.index.$error.required") 请输入数据端点索引
                span(v-if="addValidation.index.$error.maxlength") 数据端点索引应为不超过32位的整数
          .form-row
            label.form-control 变量名：
            .controls
              .input-text-wrap(v-placeholder="'英文、数字或下划线'")
                input.input-text(v-model="model.name", type="text", v-form-ctrl, name="name", maxlength="32", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.name.$pristine")
                span(v-if="addValidation.name.$error.required") 请输入数据端点名称
              .form-tips.form-tips-error(v-if="addValidation.name.$dirty")
                span(v-if="addValidation.name.$error.required") 请输入数据端点名称
                span(v-if="addValidation.name.$error.maxlength") 数据端点名称最大不能超过32位
          .form-row
            label.form-control 数据类型：
            .controls
              .select
                select(v-model="model.type", v-form-ctrl, name="type")
                  option(value="1", selected) 布尔类型
                  option(value="2") 单字节
                  option(value="3") 16位短整型
                  option(value="4") 32位整型
                  option(value="5") 浮点
                  option(value="6") 字符串
          .form-row
            label.form-control 单位符号：
            .controls
              .input-text-wrap(v-placeholder="'例如：℃'")
                textarea.input-text(v-model="model.symbol", type="text", v-form-ctrl, name="symbol", maxlength="10", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.symbol.$pristine")
                span(v-if="addValidation.symbol.$error.required") 请输入单位符号
              .form-tips.form-tips-error(v-if="addValidation.symbol.$dirty")
                span(v-if="addValidation.symbol.$error.required") 请输入单位符号
                span(v-if="addValidation.symbol.$error.maxlength") 单位符号最大不能超过10字符
          .form-row
            label.form-control 描述：
            .controls
              .input-text-wrap(v-placeholder="'请填写数据端点描述'")
                textarea.input-text(v-model="model.description", type="text", v-form-ctrl, name="description", maxlength="250", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted&& addValidation.description.$pristine")
                span(v-if="addValidation.description.$error.required") 请输入数据端点描述
              .form-tips.form-tips-error(v-if="addValidation.description.$dirty")
                span(v-if="addValidation.description.$error.required") 请输入数据端点描述
                span(v-if="addValidation.description.$error.maxlength") 产品描述最大不能超过250字符

          .form-actions
            button.btn.btn-default(@click.prevent.stop="showModal = false") 取消
            button.btn.btn-primary(type="submit") 确定
</template>

<script>
  var api = require('../../api');
  var Modal = require('../../components/modal.vue');

  module.exports = {
    components: {
      'modal': Modal
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
        showModal: false,
        model: {},
        addValidation: {}
      }
    },

    route: {
      data: function (transition) {
        return {
          datapoints: api.product.datapoints()
        }
      }
    },

    methods: {
      onSubmit: function () {
        var self = this;
        if (this.addValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.product.addDataPoint(self.$route.params.id, self.model)
          });
        }
      }
    }
  };
</script>
