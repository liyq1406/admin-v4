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
              th.w50 版本号
              th 版本说明
              th 添加日期
              th 发布日期
              //- th 文件大小(byte)
              th.tac 操作
          tbody
            tr(v-for="firmware in firmwares")
              td {{firmware.version}}
              td {{firmware.description}}
              td {{firmware.create_date}}
              td {{firmware.release_date}}
              //- td 缺API
              td.tac
                button.btn.btn-link.btn-sm(@click="onEditFirmware(firmware)") 编辑
            tr(v-if="firmwares.length === 0")
              td.tac(colspan="5")
                i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                .tips-null(v-else) 暂无固件版本

    .panel
      .panel-hd
        .actions
          button.btn.btn-success(@click="showAddModal2 = true")
            i.fa.fa-plus
            | 创建自动升级任务
        h2 升级任务列表
      .panel-bd
        //- 版本列表
        table.table.table-stripe.table-bordered
          thead
            tr
              th 序号
              th 任务名称
              th 起始版本
              th 目标版本
              //- th 启动时间
              //- th 终止时间
              th 已升级设备
              th.tac 操作
          tbody
            tr(v-for="task in tasks")
              td {{$index + 1}}
              td {{task.name}}
              td {{task.from_version}}
              td {{task.target_version}}
              //- td 2015-06-03 17:53:01
              //- td 2015-06-03 17:53:01
              td {{task.upgrade_count}}
              td.tac
                button.btn.btn-primary.btn-sm(:class="{'btn-primary': task.status, 'btn-success': !task.status}", @click="toggleTaskStatus(task)")
                  i.fa(:class="{'fa-stop': task.status, 'fa-play': !task.status}")
                  | {{task.status ? '停止' : '启动'}}
            tr(v-if="tasks.length === 0")
              td.tac(colspan="6")
                i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                .tips-null(v-else) 暂无升级任务

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
          .form-row.date-row
            label.form-control 发布日期：
            .controls
              datepicker(:value.sync="addReleaseDate", @select-day="updateAddModelRelease")
              timepicker(:value.sync="addReleaseTime", @select-time="updateAddModelRelease", :pull-left="true")
              //- .form-tips 例：2015-10-09T08:15:40.843Z
          .form-row
            label.form-control 是否发布：
            .controls
              .checkbox-group
                label.checkbox
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
          .form-row.date-row
            label.form-control 发布日期：
            .controls
              datepicker(:value.sync="editReleaseDate", @select-day="updateEditModelRelease")
              timepicker(:value.sync="editReleaseTime", @select-time="updateEditModelRelease", :pull-left="true")
          .form-row
            label.form-control 是否发布：
            .controls
              .checkbox-group
                label.checkbox
                  input(type="checkbox", name="is_release", v-model="editModel.is_release")
          .form-actions
            label.del-check
              input(type="checkbox", name="del", v-model="delChecked")
              | 删除数据端点
            button.btn.btn-default(type="reset", @click.prevent.stop="onEditCancel") 取消
            button.btn.btn-primary(type="submit") 确定

    // 添加固件版本浮层
    modal(:show.sync="showAddModal2", @close="onAddCancel2")
      h3(slot="header") 添加固件升级任务
      .form(slot="body")
        form(v-form, name="addValidation2", @submit.prevent="onAddSubmit2")
          .form-row
            label.form-control 任务名称：
            .controls
              .input-text-wrap(v-placeholder="'升级任务名称'")
                input.input-text(v-model="addModel2.name", type="text", v-form-ctrl, name="name", maxlength="32", required)
              .form-tips.form-tips-error(v-if="addValidation2.$submitted && addValidation2.name.$pristine")
                span(v-if="addValidation2.name.$error.required") 请输入任务名称
              .form-tips.form-tips-error(v-if="addValidation2.name.$dirty")
                span(v-if="addValidation2.name.$error.required") 请输入任务名称
                span(v-if="addValidation2.name.$error.maxlength") 固件型号最多不能超过32个字符
          .form-row
            label.form-control 描述：
            .controls
              .input-text-wrap(v-placeholder="'请输入描述'")
                textarea.input-text(v-model="addModel2.description", type="text", v-form-ctrl, name="description", maxlength="250", required)
              .form-tips.form-tips-error(v-if="addValidation2.$submitted && addValidation2.description.$pristine")
                span(v-if="addValidation2.description.$error.required") 请输入描述
              .form-tips.form-tips-error(v-if="addValidation2.description.$dirty")
                span(v-if="addValidation2.description.$error.required") 请输入描述
                span(v-if="addValidation2.description.$error.maxlength") 描述最多不能超过250个字符
          .form-row
            label.form-control 起始版本号：
            .controls
              .input-text-wrap(v-placeholder="'请输入起始版本号'")
                input.input-text(v-model="addModel2.from_version", type="number", v-form-ctrl, name="from_version", max="4294967296", required, number)
              .form-tips.form-tips-error(v-if="addValidation2.$submitted && addValidation2.from_version.$pristine")
                span(v-if="addValidation2.from_version.$error.required") 请输入起始版本号
              .form-tips.form-tips-error(v-if="addValidation2.from_version.$dirty")
                span(v-if="addValidation2.from_version.$error.required") 请输入起始版本号
          .form-row
            label.form-control 起始版本地址：
            .controls
              .input-text-wrap(v-placeholder="'请输入起始版本文件地址'")
                input.input-text(v-model="addModel2.from_version_url", type="text", v-form-ctrl, name="from_version_url", maxlength="250", required)
              .form-tips.form-tips-error(v-if="addValidation2.$submitted && addValidation2.from_version_url.$pristine")
                span(v-if="addValidation2.from_version_url.$error.required") 请输入起始版本文件地址
              .form-tips.form-tips-error(v-if="addValidation2.from_version_url.$dirty")
                span(v-if="addValidation2.from_version_url.$error.required") 请输入起始版本文件地址
                span(v-if="addValidation2.from_version_url.$error.maxlength") 起始版本文件地址最多不能超过250个字符
          .form-row
            label.form-control 目标版本号：
            .controls
              .input-text-wrap(v-placeholder="'请输入目标版本号'")
                input.input-text(v-model="addModel2.target_version", type="number", v-form-ctrl, name="target_version", max="4294967296", required, number)
              .form-tips.form-tips-error(v-if="addValidation2.$submitted && addValidation2.target_version.$pristine")
                span(v-if="addValidation2.target_version.$error.required") 请输入目标版本号
              .form-tips.form-tips-error(v-if="addValidation2.target_version.$dirty")
                span(v-if="addValidation2.target_version.$error.required") 请输入目标版本号
          .form-row
            label.form-control 目标版本地址：
            .controls
              .input-text-wrap(v-placeholder="'请输入目标版本文件地址'")
                input.input-text(v-model="addModel2.target_version_url", type="text", v-form-ctrl, name="target_version_url", maxlength="250", required)
              .form-tips.form-tips-error(v-if="addValidation2.$submitted && addValidation2.target_version_url.$pristine")
                span(v-if="addValidation2.target_version_url.$error.required") 请输入目标版本文件地址
              .form-tips.form-tips-error(v-if="addValidation2.target_version_url.$dirty")
                span(v-if="addValidation2.target_version_url.$error.required") 请输入目标版本文件地址
                span(v-if="addValidation2.target_version_url.$error.maxlength") 目标版本文件地址最多不能超过250个字符
          .form-actions
            button.btn.btn-default(type="reset", @click.prevent.stop="onAddCancel2") 取消
            button.btn.btn-primary(type="submit") 确定
</template>

<script>
  var api = require('../../api');
  var Modal = require('../../components/modal.vue');
  var Datepicker = require('../../components/datepicker.vue');
  var Timepicker = require('../../components/timepicker.vue');
  var dateFormat = require('date-format');
  var _ = require('lodash');

  module.exports = {
    components: {
      'modal': Modal,
      'datepicker': Datepicker,
      'timepicker': Timepicker
    },

    data: function () {
      return {
        firmwares: [],
        showAddModal: false,
        showAddModal2: false,
        showEditModal: false,
        addModel: {
          is_release: false,
          release_date: dateFormat('yyyy-MM-dd', new Date(new Date().getTime() + 24 * 60 * 60 * 1000)) + 'T00:00:00.00Z'
        },
        addModel2: {
          product_id: this.$route.params.id
        },
        tasks: [],
        editModel: {},
        addValidation: {},
        addValidation2: {},
        editValidation: {},
        originModel:{},
        delChecked: false,
        addReleaseDate: dateFormat('yyyy-MM-dd', new Date(new Date().getTime() + 24 * 60 * 60 * 1000)),
        addReleaseTime: '00:00:00',
        editReleaseDate: '',
        editReleaseTime: ''
      };
    },

    route: {
      data: function () {
        return {
          firmwares: this.getFirmwares(),
          tasks: this.getTasks()
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

      getTasks: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.firmware.taskList(self.$route.params.id);
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
        var rDate = new Date(firmware.release_date);
        this.showEditModal = true;
        this.editModel = firmware;
        this.originModel = _.clone(firmware);
        this.editReleaseDate = dateFormat('yyyy-MM-dd', rDate);
        this.editReleaseTime = dateFormat('hh:mm:ss', rDate);
      },

      onEditCancel: function () {
        this.showEditModal = false;
        this.delChecked = false;
        this.editModel = this.originModel;
        this.editReleaseDate = '';
        this.editReleaseTime = '';
      },

      onEditSubmit: function () {
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

      onAddSubmit2: function () {
        var self = this;

        if (this.addValidation2.$valid) {
          api.corp.refreshToken().then(function () {
            api.firmware.task(self.addModel2).then(function (data) {
              self.showAddModal2 = false;
              self.tasks.push(data);
            }).catch(function (error) {
              self.handleError(error);
            });
          });
        }
      },

      onAddCancel2: function () {
        this.showAddModal2 = false;
      },

      toggleTaskStatus: function (task) {
        var self = this;

        api.corp.refreshToken().then(function () {
          api.firmware.toggleTaskStatus({
            product_id: self.$route.params.id,
            upgrade_task_id: task.id,
            status: task.status ? 0 : 1
          }).then(function (data) {
            self.getTasks().then(function (data) {
              self.tasks = data;
            });
          });
        });
      },

      updateAddModelRelease: function () {
        this.addModel.release_date = this.addReleaseDate + 'T' + this.addReleaseTime + '.00Z';
      },

      updateEditModelRelease: function () {
        this.editModel.release_date = this.editReleaseDate + 'T' + this.editReleaseTime + '.00Z';
      },

      handleError: function (error) {
        switch (error.code) {
          case 4001001:
            alert('日期格式错误，请重新输入');
            break;
          case 4001017:
            alert('版本号不能重复');
            break;
          case 4001035:
            alert('任务名称不能重复');
            break;
          default:
        }
      }
    }
  };
</script>

<style lang="stylus">
  .date-row
    .datepicker
    .timepicker
      float left

    .datepicker
      width 160px

    .timepicker
      width 160px
      margin-left 10px
</style>
