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
            th.tac 操作
        tbody
          template(v-if="firmwares.length > 0 && !loadingFirmwares")
            tr(v-for="firmware in firmwares")
              td {{firmware.version}}
              td {{firmware.description}}
              td {{firmware.create_date | formatDate}}
              td.tac
                button.btn.btn-link.btn-sm(@click="onEditFirmware(firmware)") 编辑
          tr(v-if="loadingFirmwares")
            td.tac(colspan="4")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span 数据加载中...
          tr(v-if="firmwares.length === 0 && !loadingFirmwares")
            td.tac(colspan="4")
              .tips-null
                span 暂无相关记录

  .panel
    .panel-hd
      .actions
        button.btn.btn-success(:disabled="firmwares.length < 2", :class="{'disabled':firmwares.length < 2}", @click="showAddTaskModal = true")
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
            th 已升级设备
            th.tac.w80 操作
        tbody
          template(v-if="tasks.length > 0 && !loadingTasks")
            tr(v-for="task in tasks")
              td {{$index + 1}}
              td {{task.name}}
              td {{task.from_version}}
              td {{task.target_version}}
              td {{task.upgrade_count}}
              td.tac
                button.btn.btn-primary.btn-sm(:class="{'btn-primary': task.status, 'btn-success': !task.status, 'disabled': toggling}", :disabled="toggling", @click="toggleTaskStatus(task)")
                  i.fa(:class="{'fa-stop': task.status, 'fa-play': !task.status}")
                  | {{task.status ? '停止' : '启动'}}
          tr(v-if="loadingTasks")
            td.tac(colspan="6")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span 数据加载中...
          tr(v-if="tasks.length === 0 && !loadingTasks")
            td.tac(colspan="6")
              .tips-null
                span 暂无相关记录

  // 添加固件版本浮层
  modal(:show.sync="showAddModal", @close="onAddCancel")
    h3(slot="header") 添加固件版本
    .form(slot="body")
      form(v-form, name="addValidation", @submit.prevent="onAddSubmit", hook="addFirmwareHook")
        .form-row
          label.form-control 固件型号：
          .controls
            .input-text-wrap(v-placeholder="'请输入固件型号'")
              input.input-text(v-model="addModel.mod", type="text", v-form-ctrl, name="mod", maxlength="20", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.mod.$pristine")
              span(v-if="addValidation.mod.$error.required") 请输入固件型号
            .form-tips.form-tips-error(v-if="addValidation.mod.$dirty")
              span(v-if="addValidation.mod.$error.required") 请输入固件型号
              span(v-if="addValidation.mod.$error.maxlength") 固件型号最多不能超过20个字符
        .form-row
          label.form-control 固件版本号：
          .controls
            .input-text-wrap(v-placeholder="'请输入固件版本号'")
              input.input-text(v-model="addModel.version", type="text", v-form-ctrl, name="version", required, custom-validator="numberic", lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.version.$pristine")
              span(v-if="addValidation.version.$error.required") 请输入固件版本号
            .form-tips.form-tips-error(v-if="addValidation.version.$dirty")
              span(v-if="addValidation.version.$error.required") 请输入固件版本号
              span(v-if="addValidation.version.$error.customValidator") 固件版本号应为不超过32位的整数
        .form-row
          label.form-control 固件文件：
          .controls
            label.btn.btn-success.btn-upload(:class="{'disabled':uploading}")
              input(type="file", v-el:add-firmware-file, name="firmwareFile", @change.prevent="uploadFirmware('addModel', 'addFirmwareFile', $event)", :disabled="uploading")
              i.fa.fa-reply-all
              | {{uploading ? '文件上传中，请稍等...' : '上传固件文件'}}
            .form-tips.mt5(v-if="addModel.file_url.length > 0") url: {{addModel.file_url}}
        .form-row
          label.form-control 描述：
          .controls
            .input-text-wrap(v-placeholder="'请输入描述'")
              textarea.input-text(v-model="addModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required, lazy)
            .form-tips.form-tips-error(v-if="addValidation.$submitted && addValidation.description.$pristine")
              span(v-if="addValidation.description.$error.required") 请输入描述
            .form-tips.form-tips-error(v-if="addValidation.description.$dirty")
              span(v-if="addValidation.description.$error.required") 请输入描述
              span(v-if="addValidation.description.$error.maxlength") 描述最多不能超过250个字符
        .form-row
          label.form-control 是否发布：
          .controls
            .checkbox-group
              label.checkbox
                input(type="checkbox", name="is_release", v-model="addModel.is_release")
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onAddCancel") 取消
          button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? '处理中...' : '确定'")

  // 编辑固件版本浮层
  modal(:show.sync="showEditModal", @close="onEditCancel")
    h3(slot="header") 编辑固件版本
    .form(slot="body")
      form(v-form, name="editValidation", @submit.prevent="onEditSubmit", hook="editFirmwareHook")
        .form-row
          label.form-control 固件型号：
          .controls
            .input-text-wrap(v-placeholder="'请输入固件型号'")
              input.input-text(v-model="editModel.mod", type="text", v-form-ctrl, name="mod", maxlength="20", required, lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.mod.$pristine")
              span(v-if="editValidation.mod.$error.required") 请输入固件型号
            .form-tips.form-tips-error(v-if="editValidation.mod.$dirty")
              span(v-if="editValidation.mod.$error.required") 请输入固件型号
              span(v-if="editValidation.mod.$error.maxlength") 固件型号最多不能超过20个字符
        .form-row
          label.form-control 固件版本号：
          .controls
            .input-text-wrap(v-placeholder="'请输入固件版本号'")
              input.input-text(v-model="editModel.version", type="text", v-form-ctrl, name="version", required, custom-validator="numberic", lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.version.$pristine")
              span(v-if="editValidation.version.$error.required") 请输入固件版本号
            .form-tips.form-tips-error(v-if="editValidation.version.$dirty")
              span(v-if="editValidation.version.$error.required") 请输入固件版本号
              span(v-if="editValidation.version.$error.customValidator") 固件版本号应为不超过32位的整数
        .form-row
          label.form-control 固件文件地址：
          .controls
            label.btn.btn-success.btn-upload(:class="{'disabled':uploading}")
              input(type="file", v-el:edit-firmware-file, name="firmwareFile", @change.prevent="uploadFirmware('editModel', 'editFirmwareFile', $event)", :disabled="uploading")
              i.fa.fa-reply-all
              | {{uploading ? '文件上传中，请稍等...' : '上传固件文件'}}
            .form-tips.mt5(v-if="editModel.file_url") url: {{editModel.file_url}}
        .form-row
          label.form-control 描述：
          .controls
            .input-text-wrap(v-placeholder="'请输入描述'")
              textarea.input-text(v-model="editModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required, lazy)
            .form-tips.form-tips-error(v-if="editValidation.$submitted && editValidation.description.$pristine")
              span(v-if="editValidation.description.$error.required") 请输入描述
            .form-tips.form-tips-error(v-if="editValidation.description.$dirty")
              span(v-if="editValidation.description.$error.required") 请输入描述
              span(v-if="editValidation.description.$error.maxlength") 描述最多不能超过250个字符
        .form-row
          label.form-control 是否发布：
          .controls
            .checkbox-group
              label.checkbox
                input(type="checkbox", name="is_release", v-model="editModel.is_release")
        .form-actions
          label.del-check
            input(type="checkbox", name="del", v-model="delChecked")
            | 删除固件版本
          button.btn.btn-default(type="reset", @click.prevent.stop="onEditCancel") 取消
          button.btn.btn-primary(type="submit") 确定

  // 添加固件升级任务浮层
  modal(:show.sync="showAddTaskModal", @close="onAddTaskCancel")
    h3(slot="header") 添加固件升级任务
    .form(slot="body")
      form(v-form, name="addTaskValidation", @submit.prevent="onAddTaskSubmit", hook="addTaskHook")
        .form-row
          label.form-control 任务名称：
          .controls
            .input-text-wrap(v-placeholder="'升级任务名称'")
              input.input-text(v-model="addTaskModel.name", type="text", v-form-ctrl, name="name", maxlength="32", required, lazy)
            .form-tips.form-tips-error(v-if="addTaskValidation.$submitted && addTaskValidation.name.$pristine")
              span(v-if="addTaskValidation.name.$error.required") 请输入任务名称
            .form-tips.form-tips-error(v-if="addTaskValidation.name.$dirty")
              span(v-if="addTaskValidation.name.$error.required") 请输入任务名称
              span(v-if="addTaskValidation.name.$error.maxlength") 固件型号最多不能超过32个字符
        .form-row
          label.form-control 描述：
          .controls
            .input-text-wrap(v-placeholder="'请输入描述'")
              textarea.input-text(v-model="addTaskModel.description", type="text", v-form-ctrl, name="description", maxlength="250", required, lazy)
            .form-tips.form-tips-error(v-if="addTaskValidation.$submitted && addTaskValidation.description.$pristine")
              span(v-if="addTaskValidation.description.$error.required") 请输入描述
            .form-tips.form-tips-error(v-if="addTaskValidation.description.$dirty")
              span(v-if="addTaskValidation.description.$error.required") 请输入描述
              span(v-if="addTaskValidation.description.$error.maxlength") 描述最多不能超过250个字符
        .form-row
          label.form-control 起始版本号：
          .controls
            .select
              select(v-model="addTaskModel.from_version", v-form-ctrl, name="from_version", custom-validator="checkTypeValid", @change="selectFrom")
                option(selected, value="0") 请选择起始版本号
                option(v-for="firmware in fromFirmwares", :value="firmware.version") {{firmware.version}}
            .form-tips.mt5(v-if="addTaskModel.from_version > 0") url: {{addTaskModel.from_version | firmwareUrl}}
            .form-tips.form-tips-error(v-if="addTaskValidation.$submitted")
              span(v-if="addTaskValidation.from_version.$error.customValidator") 请选择起始版本号
        .form-row
          label.form-control 目标版本号：
          .controls
            .select
              select(v-model="addTaskModel.target_version", v-form-ctrl, name="target_version", custom-validator="checkTypeValid", @change="selectTarget")
                option(selected, value="0") 请选择目标版本号
                option(v-for="firmware in targetFirmwares", :value="firmware.version") {{firmware.version}}
            .form-tips.mt5(v-if="addTaskModel.target_version > 0") url: {{addTaskModel.target_version | firmwareUrl}}
            .form-tips.form-tips-error(v-if="addTaskValidation.$submitted")
              span(v-if="addTaskValidation.target_version.$error.customValidator") 请选择目标版本号
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onAddTaskCancel") 取消
          button.btn.btn-primary(type="submit", :disabled="adding", :class="{'disabled':adding}", v-text="adding ? '处理中...' : '确定'")
</template>

<script>
  var api = require('../../api');
  var Modal = require('../../components/modal.vue');
  var _ = require('lodash');

  module.exports = {
    name: 'Upgrade',

    components: {
      'modal': Modal
    },

    data: function () {
      return {
        firmwares: [],
        showAddModal: false,
        showAddTaskModal: false,
        showEditModal: false,
        addModel: {
          mod: '',
          version: '',
          file_url: '',
          description: '',
          is_release: false
        },
        originAddModel: {},
        addTaskModel: {
          name: '',
          description: '',
          product_id: this.$route.params.id,
          from_version: 1,
          from_version_url: '',
          from_version_md5: '',
          from_version_size: 0,
          target_version: 2,
          target_version_url: '',
          target_version_md5: '',
          target_version_size: 0
        },
        originAddTaskModel: {},
        tasks: [],
        editModel: {},
        addValidation: {},
        addTaskValidation: {},
        editValidation: {},
        originEditModel: {},
        delChecked: false,
        uploading: false,
        adding: false,
        editing: false,
        toogling: false,
        loadingFirmwares: false,
        loadingTasks: false
      };
    },

    route: {
      data: function () {
        this.originAddModel = _.clone(this.addModel);
        this.originAddTaskModel = _.clone(this.addTaskModel);
        this.getFirmwares();
        this.getTasks();
      }
    },

    computed: {
      fromFirmwares: function () {
        var self = this;
        return this.firmwares.filter(function (item, index) {
          return index < self.firmwares.length - 1;
        });
      },

      targetFirmwares: function () {
        var self = this;
        return this.firmwares.filter(function (item, index) {
          return index > self.addTaskModel.from_version - 1 && index < self.firmwares.length;
        });
      }
    },

    filters: {
      firmwareUrl: function (value) {
        var url = '';
        this.firmwares.forEach(function (element, index) {
          if (element.version === value) {
            url = element.file_url;
          }
        });
        return url;
      }
    },

    watch: {

    },

    methods: {
      getFirmwares: function () {
        var self = this;

        this.loadingFirmwares = true;
        api.corp.refreshToken().then(function () {
          api.product.getFirmwares(self.$route.params.id).then(function (data) {
            self.firmwares = data;
            self.loadingFirmwares = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingFirmwares = false;
          });
        });
      },

      getTasks: function () {
        var self = this;

        this.loadingTasks = true;
        api.corp.refreshToken().then(function () {
          api.firmware.taskList(self.$route.params.id).then(function (data) {
            self.tasks = data;
            self.loadingTasks = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingTasks = false;
          });
        });
      },

      checkTypeValid: function (value) {
        return Number(value) > 0;
      },

      // 添加固件版本表单钩子
      addFirmwareHook: function (form) {
        this.addForm = form;
      },

      // 修改固件版本表单钩子
      editFirmwareHook: function (form) {
        this.editForm = form;
      },

      // 添加升级任务表单钩子
      addTaskHook: function (form) {
        this.addTaskForm = form;
      },

      // 关闭添加固件版本浮层并净化添加表单
      resetAdd: function () {
        var self = this;
        this.adding = false;
        this.showAddModal = false;
        this.addModel = _.clone(this.originAddModel);
        this.$nextTick(function () {
          self.addForm.setPristine();
        });
      },

      // 关闭固件版本编辑浮层并净化编辑表单
      resetEdit: function () {
        this.editing = false;
        this.showEditModal = false;
        this.delChecked = false;
        this.editModel = this.originEditModel;
      },

      // 取消添加固件版本
      onAddCancel: function () {
        this.resetAdd();
      },

      // 添加固件版本操作
      onAddSubmit: function () {
        var self = this;

        if (this.addValidation.$valid && !this.adding) {
          this.adding = true;
          api.corp.refreshToken().then(function () {
            api.product.addFirmware(self.$route.params.id, self.addModel).then(function (data) {
              self.resetAdd();
              self.getFirmwares();
              // self.firmwares.push(data);
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      // 初始化固件版本编辑表单
      onEditFirmware: function (firmware) {
        this.showEditModal = true;
        this.editModel = _.clone(firmware);
        this.originEditModel = _.clone(firmware);
      },

      // 取消固件版本编辑
      onEditCancel: function () {
        this.resetEdit();
      },

      // 提交固件版本更新
      onEditSubmit: function () {
        var self = this;
        if (this.delChecked && !this.editing) {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.product.deleteFirmware(self.$route.params.id, self.editModel.id).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.resetEdit();
              self.firmwares.$remove(self.editModel);
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        } else if (this.editValidation.$valid && !this.editing) {
          this.editing = true;
          api.corp.refreshToken().then(function () {
            api.product.updateFirmware(self.$route.params.id, self.editModel).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              self.getFirmwares();
              self.resetEdit();
            }).catch(function (error) {
              self.handleError(error);
              self.editing = false;
            });
          });
        }
      },

      // 选择起始版本号
      selectFrom: function () {
        var firmware = this.firmwares[this.addTaskModel.from_version - 1];
        this.addTaskModel.from_version_url = firmware.file_url;
        this.addTaskModel.from_version_md5 = firmware.file_md5;
        this.addTaskModel.from_version_size = firmware.file_size;
      },

      // 选择目标版本号
      selectTarget: function () {
        var firmware = this.firmwares[this.addTaskModel.target_version - 1];
        this.addTaskModel.target_version_url = firmware.file_url;
        this.addTaskModel.target_version_md5 = firmware.file_md5;
        this.addTaskModel.target_version_size = firmware.file_size;
      },

      // 关闭添加固件版本浮层并净化添加表单
      resetAddTask: function () {
        var self = this;
        this.adding = false;
        this.showAddTaskModal = false;
        this.addTaskModel = _.clone(this.originAddTaskModel);
        this.$nextTick(function () {
          self.addTaskForm.setPristine();
        });
      },

      // 取消添加固件版本
      onAddTaskCancel: function () {
        this.resetAddTask();
      },

      // 提交添加任务表单
      onAddTaskSubmit: function () {
        var self = this;

        if (this.addTaskValidation.$valid && !this.adding) {
          this.adding = true;
          api.corp.refreshToken().then(function () {
            api.firmware.task(self.addTaskModel).then(function (data) {
              self.resetAddTask();
              self.tasks.push(data);
            }).catch(function (error) {
              self.handleError(error);
              self.adding = false;
            });
          });
        }
      },

      // 切换任务状态
      toggleTaskStatus: function (task) {
        var self = this;

        if (!this.toggling) {
          this.toggling = true;
          api.corp.refreshToken().then(function () {
            api.firmware.toggleTaskStatus({
              product_id: self.$route.params.id,
              upgrade_task_id: task.id,
              status: task.status ? 0 : 1
            }).then(function (data) {
              // self.getTasks();
              task.status = !task.status;
              self.toggling = false;
            }).catch(function (error) {
              self.handleError(error);
              self.toggling = false;
            });
          });
        }
      },

      // 上传固件文件
      uploadFirmware: function (model, firmwareFile, event) {
        var self = this;
        var file = this.$els[firmwareFile].files[0];
        var input = event.target;

        if (file && file.size > 1024 * 1024) {
          alert('文件大小不能大于1MB');
          return;
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new FileReader();
          reader.onerror = function (evt) {
            alert('文件读取失败。');
          };
          // 读取完成
          reader.onloadend = function (evt) {
            if (evt.target.readyState === FileReader.DONE) {
              if (!self.uploading) {
                self.uploading = true;
                api.corp.refreshToken().then(function () {
                  api.product.uploadFirmware(self.$route.params.id, evt.target.result).then(function (data) {
                    input.value = '';
                    console.log(data);
                    self[model].file_url = data.url;
                    self[model].file_md5 = data.md5;
                    self[model].file_size = data.size;
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
          alert('您的浏览器过于低级，不支持 HTML5 上传');
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
