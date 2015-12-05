<template lang="jade">
  .row
    .panel
      .panel-hd
        .actions
          button.btn.btn-success(@click="showAddModal = true")
            i.fa.fa-plus
            | 添加固件版本
        h2 版本列表
      .panel-bd
        //- 版本列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th 版本号
              th 版本说明
              th 添加日期
              th 发布日期
              th 文件大小(byte)
              th.tac 操作
          tbody
            tr(v-for="firmware in firmwares")
              td {{firmware.version}}
              td {{firmware.description}}
              td {{firmware.create_date}}
              td {{firmware.release_date}}
              td 缺API
              td.tac
                button.btn.btn-link.btn-sm(@click="onEditFirmware(firmware)") 编辑
            tr(v-if="firmwares.length === 0")
              td.tac(colspan="6")
                i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                .tips-null(v-else) 暂无固件版本

    .panel
      .panel-hd
        .actions
          button.btn.btn-success
            i.fa.fa-refresh
            | 升级任务列表
        h2 升级任务列表
      .panel-bd
        //- 版本列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th 版本号
              th 任务名称
              th 起始版本
              th 目标版本
              th 启动时间
              th 终止时间
              th 已升级设备
              th.tac 操作
          tbody
            - for(var i=5; i>=1; i--)
              tr
                td= i
                td 修正版本3的bug，版本3一定要升级
                td 3
                td 4
                td 2015-06-03 17:53:01
                td 2015-06-03 17:53:01
                td 58,977
                td.tac
                  if i % 2 == 0
                    button.btn.btn-success.btn-sm
                      i.fa.fa-play
                      | 启动
                  else
                    button.btn.btn-primary.btn-sm
                      i.fa.fa-stop
                      | 停止

    // 添加固件版本浮层
    modal(:show.sync="showAddModal", @close="onAddCancel")
      h3(slot="header") 添加固件版本
      .form(slot="body")
        form(v-form, name="addValidation", @submit.prevent="onAddSubmit")
          .form-row
            label.form-control 固件型号：
            .controls
              .input-text-wrap(v-placeholder="'请输入固件型号'")
                input.input-text(v-model="addModel.mod", type="text", v-form-ctrl, name="mod", maxlength="20", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.mod.$pristine")
                span(v-if="addValidation.mod.$error.required") 请输入固件型号
              .form-tips.form-tips-error(v-if="addValidation.mod.$dirty")
                span(v-if="addValidation.mod.$error.required") 请输入固件型号
                span(v-if="addValidation.mod.$error.maxlength") 固件型号最多不能超过20个字符
          .form-row
            label.form-control 固件版本号：
            .controls
              .input-text-wrap(v-placeholder="'请输入固件版本号'")
                input.input-text(v-model="addModel.version", type="number", v-form-ctrl, name="version", max="4294967296", required, number)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.version.$pristine")
                span(v-if="addValidation.version.$error.required") 请输入固件版本号
              .form-tips.form-tips-error(v-if="addValidation.version.$dirty")
                span(v-if="addValidation.version.$error.required") 请输入固件版本号
          .form-row
            label.form-control 固件文件地址：
            .controls
              .input-text-wrap(v-placeholder="'请输入固件文件地址'")
                input.input-text(v-model="addModel.file_url", type="text", v-form-ctrl, name="file_url", maxlength="250", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.file_url.$pristine")
                span(v-if="addValidation.file_url.$error.required") 请输入固件文件地址
              .form-tips.form-tips-error(v-if="addValidation.file_url.$dirty")
                span(v-if="addValidation.file_url.$error.required") 请输入固件文件地址
                span(v-if="addValidation.file_url.$error.maxlength") 固件文件地址最多不能超过250个字符
          .form-row
            label.form-control 描述：
            .controls
              .input-text-wrap(v-placeholder="'请输入描述'")
                textarea.input-text(v-model="addModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required)
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.description.$pristine")
                span(v-if="addValidation.description.$error.required") 请输入描述
              .form-tips.form-tips-error(v-if="addValidation.description.$dirty")
                span(v-if="addValidation.description.$error.required") 请输入描述
                span(v-if="addValidation.description.$error.maxlength") 描述最多不能超过250个字符
          .form-row
            label.form-control 发布日期：
            .controls
              .input-text-wrap(v-placeholder="'请输入发布日期'")
                input.input-text(v-model="addModel.release_date", type="text", v-form-ctrl, name="release_date", required)
                .form-tips 例：2015-10-09T08:15:40.843Z
              .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.release_date.$pristine")
                span(v-if="addValidation.release_date.$error.required") 请输入发布日期
              .form-tips.form-tips-error(v-if="addValidation.release_date.$dirty")
                span(v-if="addValidation.release_date.$error.required") 请输入发布日期
          .form-row
            label.form-control 是否发布：
            .controls
              input(type="checkbox", name="is_release", v-model="addModel.is_release")
          .form-actions
            button.btn.btn-default(@click.prevent.stop="onAddCancel") 取消
            button.btn.btn-primary(type="submit") 确定

    // 编辑固件版本浮层
    modal(:show.sync="showEditModal", @close="onEditCancel")
      h3(slot="header") 编辑固件版本
      .form(slot="body")
        form(v-form, name="editValidation", @submit.prevent="onEditSubmit")
          .form-row
            label.form-control 固件型号：
            .controls
              .input-text-wrap(v-placeholder="'请输入固件型号'")
                input.input-text(v-model="editModel.mod", type="text", v-form-ctrl, name="mod", maxlength="20", required)
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.mod.$pristine")
                span(v-if="editValidation.mod.$error.required") 请输入固件型号
              .form-tips.form-tips-error(v-if="editValidation.mod.$dirty")
                span(v-if="editValidation.mod.$error.required") 请输入固件型号
                span(v-if="editValidation.mod.$error.maxlength") 固件型号最多不能超过20个字符
          .form-row
            label.form-control 固件版本号：
            .controls
              .input-text-wrap(v-placeholder="'请输入固件版本号'")
                input.input-text(v-model="editModel.version", type="number", v-form-ctrl, name="version", max="4294967296", required, number)
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.version.$pristine")
                span(v-if="editValidation.version.$error.required") 请输入固件版本号
              .form-tips.form-tips-error(v-if="editValidation.version.$dirty")
                span(v-if="editValidation.version.$error.required") 请输入固件版本号
          .form-row
            label.form-control 固件文件地址：
            .controls
              .input-text-wrap(v-placeholder="'请输入固件文件地址'")
                input.input-text(v-model="editModel.file_url", type="text", v-form-ctrl, name="file_url", maxlength="250", required)
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.file_url.$pristine")
                span(v-if="editValidation.file_url.$error.required") 请输入固件文件地址
              .form-tips.form-tips-error(v-if="editValidation.file_url.$dirty")
                span(v-if="editValidation.file_url.$error.required") 请输入固件文件地址
                span(v-if="editValidation.file_url.$error.maxlength") 固件文件地址最多不能超过250个字符
          .form-row
            label.form-control 描述：
            .controls
              .input-text-wrap(v-placeholder="'请输入描述'")
                textarea.input-text(v-model="editModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required)
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.description.$pristine")
                span(v-if="editValidation.description.$error.required") 请输入描述
              .form-tips.form-tips-error(v-if="editValidation.description.$dirty")
                span(v-if="editValidation.description.$error.required") 请输入描述
                span(v-if="editValidation.description.$error.maxlength") 描述最多不能超过250个字符
          .form-row
            label.form-control 发布日期：
            .controls
              .input-text-wrap(v-placeholder="'请输入发布日期'")
                input.input-text(v-model="editModel.release_date", type="text", v-form-ctrl, name="release_date", required)
                .form-tips 例：2015-10-09T08:15:40.843Z
              .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.release_date.$pristine")
                span(v-if="editValidation.release_date.$error.required") 请输入发布日期
              .form-tips.form-tips-error(v-if="editValidation.release_date.$dirty")
                span(v-if="editValidation.release_date.$error.required") 请输入发布日期
          .form-row
            label.form-control 是否发布：
            .controls
              input(type="checkbox", name="is_release", v-model="editModel.is_release")
          .form-actions
            label.del-check
              input(type="checkbox", name="del", v-model="delChecked")
              | 删除数据端点
            button.btn.btn-default(@click.prevent.stop="onEditCancel") 取消
            button.btn.btn-primary(type="submit") 确定
</template>

<script>
  var api = require('../../api');
  var Modal = require('../../components/modal.vue');
  var _ = require('lodash');

  module.exports = {
    components: {
      'modal': Modal
    },

    data: function () {
      return {
        firmwares: [],
        showAddModal: false,
        showEditModal: false,
        addModel: {
          is_release: false
        },
        editModel: {},
        addValidation: {},
        editValidation: {},
        originModel:{},
        delChecked: false
      };
    },

    route: {
      data: function () {
        return {
          firmwares: this.getFirmwares()
        };
      }
    },

    methods: {
      getFirmwares: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.product.getFirmwares(self.$route.params.id);
        });
      },

      onAddSubmit: function () {
        var self = this;

        if (this.addValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.product.addFirmware(self.$route.params.id, self.addModel).then(function (data) {
              self.showAddModal = false;
              self.firmwares.push(data);
            }).catch(function (error) {
              self.handleError(error);
            });
          });
        }
      },

      onAddCancel: function () {
        this.showAddModal = false;
      },

      onEditFirmware: function (firmware) {
        this.showEditModal = true;
        this.editModel = firmware;
        this.originModel = _.clone(firmware);
      },

      onEditCancel: function () {
        this.showEditModal = false;
        this.delChecked = false;
        this.editModel = this.originModel;
      },

      onEditSubmit: function () {
        console.log(22222);
        var self = this;
        if (this.delChecked) {
          api.corp.refreshToken().then(function () {
            api.product.deleteFirmware(self.$route.params.id, self.editModel.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.firmwares.$remove(self.editModel);
              self.showEditModal = false;
              self.delChecked = false;
            });
          });
        } else if (this.editValidation.$valid) {
          api.corp.refreshToken().then(function () {
            api.product.updateFirmware(self.$route.params.id, self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.showEditModal = false;
            }).catch(function (error) {
              self.handleError(error);
            });
          });
        }
      },

      handleError: function (error) {
        if (error.code === 4001001) {
          alert('日期格式错误，请重新输入');
        }
      }
    }
  };
</script>
