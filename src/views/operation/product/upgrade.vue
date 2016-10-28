<template>
  <div class="row">
    <div class="panel">
      <div class="panel-hd">
        <div class="actions">
          <button @click="showAddModal = true" class="btn btn-primary"><i class="fa fa-plus"></i>{{ $t('ui.firmware.add_firmware') }}</button>
        </div>
        <h2>{{ $t('ui.firmware.firmware_list') }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingFirmwares">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th class="w50">{{ $t('ui.firmware.fields.version') }}</th>
                <th>{{ $t('ui.firmware.fields.description') }}</th>
                <th>{{ $t('ui.firmware.fields.create_date') }}</th>
                <th class="tac">{{ $t('common.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="firmwares.length > 0">
                <tr v-for="firmware in firmwares | orderBy 'version'">
                  <td>{{ firmware.version }}</td>
                  <td>{{ firmware.description }}</td>
                  <td>{{ firmware.create_date | formatDate }}</td>
                  <td class="tac">
                    <button @click="onEditFirmware(firmware)" class="btn btn-link btn-mini">{{ $t('common.edit') }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="firmwares.length === 0 && !loadingFirmwares">
                <td colspan="4" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd">
        <div class="actions">
          <button :disabled="firmwares.length < 2" :class="{'disabled':firmwares.length < 2}" @click="showAddTaskModal = true" class="btn btn-primary"><i class="fa fa-plus"></i>{{ $t('ui.task.create_task') }}</button>
        </div>
        <h2>{{ $t('ui.task.task_list') }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingTasks">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t('ui.task.fields.order') }}</th>
                <th>{{ $t('ui.task.fields.description') }}</th>
                <th>{{ $t('ui.task.fields.from_version') }}</th>
                <th>{{ $t('ui.task.fields.target_version') }}</th>
                <th>{{ $t('ui.task.fields.upgrade_count') }}</th>
                <th class="tac">{{ $t('common.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="tasks.length > 0">
                <tr v-for="task in tasks">
                  <td>{{ $index + 1 }}</td>
                  <td>{{ task.name }}</td>
                  <td>{{ task.from_version }}</td>
                  <td>{{ task.target_version }}</td>
                  <td>{{ task.upgrade_count }}</td>
                  <td class="tac">
                    <button :class="{'btn-primary': task.status, 'btn-success': !task.status, 'disabled': toggling}" :disabled="toggling" @click="toggleTaskStatus(task)" class="btn btn-primary btn-mini mr20"><i :class="{'fa-stop': task.status, 'fa-play': !task.status}" class="fa"></i>{{ task.status ? $t('ui.task.stop') : $t('ui.task.start') }}</button>
                    <button @click="removeTask(task)" class="btn btn-primary btn-mini">删除</button>
                  </td>
                </tr>
              </template>
              <tr v-if="tasks.length === 0 && !loadingTasks">
                <td colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 添加固件版本浮层-->
    <modal :show.sync="showAddModal" @close="onAddCancel">
      <h3 slot="header">{{ $t('ui.firmware.add_firmware') }}</h3>
      <div slot="body" class="form">
        <form autocomplete="off" v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFirmwareHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.mod") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.mod')" class="input-text-wrap">
                <input v-model="addModel.mod" type="text" v-form-ctrl name="mod" maxlength="20" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.mod.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.mod.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.mod')}) }}</span></div>
              <div v-if="addValidation.mod.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.mod.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.mod')}) }}</span><span v-if="addValidation.mod.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('ui.firmware.fields.mod'), 20]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.version") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.version')" class="input-text-wrap">
                <input v-model="addModel.version" type="text" v-form-ctrl name="version" required custom-validator="numberic" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.version.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.version.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.version')}) }}</span></div>
              <div v-if="addValidation.version.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.version.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.version')}) }}</span><span v-if="addValidation.version.$error.customValidator">{{ $t('common.validation.numberic') }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.file") }}:</label>
            <div class="controls col-18">
              <label :class="{'disabled':uploading}" class="btn btn-ghost btn-upload">
                <input type="file" v-el:add-firmware-file="v-el:add-firmware-file" name="firmwareFile" @change.prevent="uploadFirmware('addModel', 'addFirmwareFile', $event)" :disabled="uploading"/><i class="fa fa-reply-all"></i>{{ uploading ? $t('ui.firmware.uploading') : $t('ui.firmware.upload') }}
              </label>
              <div v-if="addModel.file_url.length > 0" class="file-url">url: {{ addModel.file_url }}</div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.description") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.description')" class="input-text-wrap">
                <textarea v-model="addModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="addValidation.$submitted && addValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.description.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.description')}) }}</span></div>
              <div v-if="addValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.description.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.description')}) }}</span><span v-if="addValidation.description.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('ui.firmware.fields.version'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_release" v-model="addModel.is_release"/>{{ $t("ui.firmware.fields.is_release") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 编辑固件版本浮层-->
    <modal :show.sync="showEditModal" @close="onEditCancel">
      <h3 slot="header">{{ $t('ui.firmware.edit_firmware') }}</h3>
      <div slot="body" class="form">
        <form autocomplete="off" v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFirmwareHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.mod") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.mod')" class="input-text-wrap">
                <input v-model="editModel.mod" type="text" v-form-ctrl name="mod" maxlength="20" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.mod.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.mod.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.mod')}) }}</span></div>
              <div v-if="editValidation.mod.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.mod.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.mod')}) }}</span><span v-if="editValidation.mod.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('ui.firmware.fields.mod'), 20]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.version") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.version')" class="input-text-wrap">
                <input v-model="editModel.version" type="text" v-form-ctrl name="version" required custom-validator="numberic" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.version.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.version.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.version')}) }}</span></div>
              <div v-if="editValidation.version.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.version.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.version')}) }}</span><span v-if="editValidation.version.$error.customValidator">{{ $t('common.validation.numberic') }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.file") }}:</label>
            <div class="controls col-18">
              <label :class="{'disabled':uploading}" class="btn btn-ghost btn-upload">
                <input type="file" v-el:edit-firmware-file="v-el:edit-firmware-file" name="firmwareFile" @change.prevent="uploadFirmware('editModel', 'editFirmwareFile', $event)" :disabled="uploading"/><i class="fa fa-reply-all"></i>{{ uploading ? $t('ui.firmware.uploading') : $t('ui.firmware.upload') }}
              </label>
              <div v-if="editModel.file_url" class="file-url">url: {{ editModel.file_url }}</div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.description") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.description')" class="input-text-wrap">
                <textarea v-model="editModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted && editValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.description')}) }}</span></div>
              <div v-if="editValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('common.validation.required', {field: $t('ui.firmware.fields.description')}) }}</span><span v-if="editValidation.description.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('ui.firmware.fields.version'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <div class="controls col-18 col-offset-6">
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" name="is_release" v-model="editModel.is_release"/>{{ $t("ui.firmware.fields.is_release") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.firmware.del_firmware") }}
            </label>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button type="reset" @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 添加固件升级任务浮层-->
    <modal :show.sync="showAddTaskModal" @close="onAddTaskCancel">
      <h3 slot="header">{{ $t("ui.task.create_task") }}</h3>
      <div slot="body" class="form">
        <form autocomplete="off" v-form name="addTaskValidation" @submit.prevent="onAddTaskSubmit" hook="addTaskHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.task.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.task.placeholders.name')" class="input-text-wrap">
                <input v-model="addTaskModel.name" type="text" v-form-ctrl name="name" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="addTaskValidation.$submitted && addTaskValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addTaskValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.task.fields.name')}) }}</span></div>
              <div v-if="addTaskValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addTaskValidation.name.$error.required">{{ $t('common.validation.required', {field: $t('ui.task.fields.name')}) }}</span><span v-if="addTaskValidation.name.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('ui.task.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.task.fields.description") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.task.placeholders.description')" class="input-text-wrap">
                <textarea v-model="addTaskModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="addTaskValidation.$submitted && addTaskValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="addTaskValidation.description.$error.required">{{ $t('common.validation.required', {field: $t('ui.task.fields.description')}) }}</span></div>
              <div v-if="addTaskValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="addTaskValidation.description.$error.required">{{ $t('common.validation.required', {field: $t('ui.task.fields.description')}) }}</span><span v-if="addTaskValidation.description.$error.maxlength">{{ $t('common.validation.maxlength', [ $t('ui.task.fields.description'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.task.fields.from_version") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <x-select :placeholder="$t('ui.task.select_from_version')" :label="addTaskModel.from_version.toString()">
                  <select v-model="addTaskModel.from_version" v-form-ctrl name="from_version" custom-validator="checkTypeValid" @change="selectFrom" number>
                    <option v-for="firmware in fromFirmwares | orderBy 'version'" :value="firmware.version.toString()">{{ firmware.version }}</option>
                  </select>
                </x-select>
              </div>
              <div v-if="addTaskModel.from_version > 0" class="form-tips mt5">url: {{ addTaskModel.from_version | firmwareUrl }}</div>
              <div v-if="addTaskValidation.$submitted" class="form-tips form-tips-error"><span v-if="addTaskValidation.from_version.$error.customValidator">{{ $t("ui.task.select_from_version") }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.task.fields.target_version") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <x-select :placeholder="$t('ui.task.select_target_version')" :label="addTaskModel.target_version.toString()">
                  <select v-model="addTaskModel.target_version" v-form-ctrl name="target_version" custom-validator="checkTypeValid" @change="selectTarget" number>
                    <option v-for="firmware in targetFirmwares | orderBy 'version'" :value="firmware.version.toString()">{{ firmware.version }}</option>
                  </select>
                </x-select>
              </div>
              <div v-if="addTaskModel.target_version > 0" class="form-tips mt5">url: {{ addTaskModel.target_version | firmwareUrl }}</div>
              <div v-if="addTaskValidation.$submitted" class="form-tips form-tips-error"><span v-if="addTaskValidation.target_version.$error.customValidator">{{ $t("ui.task.select_target_version") }}</span></div>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onAddTaskCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
  import api from 'api'
  import Modal from 'components/Modal'
  import Select from 'components/Select'
  import _ from 'lodash'
  import * as config from 'consts/config'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Upgrade',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'x-select': Select
    },

    data () {
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
          from_version: '',
          from_version_url: '',
          from_version_md5: '',
          from_version_size: 0,
          target_version: '',
          target_version_url: '',
          target_version_md5: '',
          target_version_size: 0
        },
        originAddTaskModel: {},
        tasks: [
          // {
          //   'name': '123',
          //   'from_version': '1',
          //   'target_version': '2',
          //   'upgrade_count': '3'
          // }
        ],
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
      }
    },

    route: {
      data () {
        this.originAddModel = _.clone(this.addModel)
        this.originAddTaskModel = _.clone(this.addTaskModel)
        this.getFirmwares()
        this.getTasks()
      }
    },

    computed: {
      fromFirmwares () {
        return this.firmwares.filter((item) => {
          return item.version < (this.addTaskModel.target_version || this.maxVersion)
        })
      },

      targetFirmwares () {
        return this.firmwares.filter((item) => {
          return item.version > (this.addTaskModel.from_version || this.minVersion)
        })
      },

      maxVersion () {
        var max = 0
        this.firmwares.map((item) => {
          max = Math.max(max, item.version)
        })
        return max
      },

      minVersion () {
        var min = Number.MAX_VALUE
        this.firmwares.map((item) => {
          min = Math.min(min, item.version)
        })
        return min
      }
    },

    filters: {
      firmwareUrl (value) {
        var url = ''
        this.firmwares.forEach((element, index) => {
          if (element.version === value) {
            url = element.file_url
          }
        })
        return url
      }
    },

    watch: {

    },

    methods: {
      getFirmwares () {
        this.loadingFirmwares = true
        api.product.getFirmwares(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.firmwares = res.data
            this.loadingFirmwares = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingFirmwares = false
        })
      },

      getTasks () {
        this.loadingTasks = true
        api.firmware.taskList(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.tasks = res.data
            this.loadingTasks = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingTasks = false
        })
      },

      checkTypeValid (value) {
        return Number(value) > 0
      },

      // 添加固件版本表单钩子
      addFirmwareHook (form) {
        this.addForm = form
      },

      // 修改固件版本表单钩子
      editFirmwareHook (form) {
        this.editForm = form
      },

      // 添加升级任务表单钩子
      addTaskHook (form) {
        this.addTaskForm = form
      },

      // 关闭添加固件版本浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 关闭固件版本编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.showEditModal = false
        this.delChecked = false
        this.editModel = this.originEditModel
      },

      // 取消添加固件版本
      onAddCancel () {
        this.resetAdd()
      },

      // 添加固件版本操作
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          api.product.addFirmware(this.$route.params.id, this.addModel).then((res) => {
            if (res.status === 200) {
              this.resetAdd()
              this.getFirmwares()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },

      // 初始化固件版本编辑表单
      onEditFirmware (firmware) {
        this.showEditModal = true
        this.editModel = _.clone(firmware)
        this.originEditModel = _.clone(firmware)
      },

      // 取消固件版本编辑
      onEditCancel () {
        this.resetEdit()
      },

      // 提交固件版本更新
      onEditSubmit () {
        if (this.delChecked && !this.editing) {
          this.editing = true
          api.product.deleteFirmware(this.$route.params.id, this.editModel.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getFirmwares()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (this.editValidation.$valid && !this.editing) {
          this.editing = true
          api.product.updateFirmware(this.$route.params.id, this.editModel).then((res) => {
            if (res.status === 200) {
              this.getFirmwares()
              this.resetEdit()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },

      // 选择起始版本号
      selectFrom () {
        var firmware = this.firmwares.filter((item) => {
          return item.version === this.addTaskModel.from_version
        })[0]
        this.addTaskModel.from_version_url = firmware.file_url
        this.addTaskModel.from_version_md5 = firmware.file_md5
        this.addTaskModel.from_version_size = firmware.file_size
      },

      // 选择目标版本号
      selectTarget () {
        var firmware = this.firmwares.filter((item) => {
          return item.version === this.addTaskModel.target_version
        })[0]
        this.addTaskModel.target_version_url = firmware.file_url
        this.addTaskModel.target_version_md5 = firmware.file_md5
        this.addTaskModel.target_version_size = firmware.file_size
      },

      // 关闭添加固件版本浮层并净化添加表单
      resetAddTask () {
        this.adding = false
        this.showAddTaskModal = false
        this.addTaskModel = _.clone(this.originAddTaskModel)
        this.$nextTick(() => {
          this.addTaskForm.setPristine()
        })
      },

      // 取消添加固件版本
      onAddTaskCancel () {
        this.resetAddTask()
      },

      // 提交添加任务表单
      onAddTaskSubmit () {
        if (this.addTaskValidation.$valid && !this.adding) {
          this.adding = true
          api.firmware.task(this.addTaskModel).then((res) => {
            if (res.status === 200) {
              this.resetAddTask()
              this.tasks.push(res.data)
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },

      // 切换任务状态
      toggleTaskStatus (task) {
        if (!this.toggling) {
          this.toggling = true
          api.firmware.toggleTaskStatus({
            product_id: this.$route.params.id,
            upgrade_task_id: task.id,
            status: task.status ? 0 : 1
          }).then((res) => {
            if (res.status === 200) {
              task.status = !task.status
              this.toggling = false
            }
          }).catch((res) => {
            this.handleError(res)
            this.toggling = false
          })
        }
      },

      // 删除升级任务
      removeTask (task) {
        var result = window.confirm('确认删除该升级任务吗？')
        if (result === true) {
          api.firmware.removeTask({
            id: task.id,
            product_id: this.$route.params.id
          }).then((res) => {
            if (res.status === 200) {
              this.getTasks()
            }
          }).catch((res) => {
            this.handleError(res)
            this.toggling = false
          })
        }
      },

      // 上传固件文件
      uploadFirmware (model, firmwareFile, event) {
        var file = this.$els[firmwareFile].files[0]
        var input = event.target

        if (file && file.size > config.MAX_FIRMWARE_FILE_SIZE * 1024 * 1024) {
          this.showNotice({
            type: 'error',
            content: this.$t('common.upload.file_size_msg', {max: config.MAX_FIRMWARE_FILE_SIZE})
          })
          return
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('common.upload.read_err')
            })
          }
          // 读取完成
          reader.onloadend = (evt) => {
            if (evt.target.readyState === window.FileReader.DONE) {
              if (!this.uploading) {
                this.uploading = true
                api.upload.firmware(this.$route.params.id, evt.target.result).then((res) => {
                  if (res.status === 200) {
                    input.value = ''
                    this[model].file_url = res.data.url
                    this[model].file_md5 = res.data.md5
                    this[model].file_size = res.data.size
                    this.uploading = false
                  }
                }).catch((res) => {
                  this.handleError(res)
                  this.uploading = false
                })
              }
            }
          }
          reader.readAsArrayBuffer(file)
        } else {
          this.showNotice({
            type: 'error',
            content: this.$t('common.upload.compatiblity')
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

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
