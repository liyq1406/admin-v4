<template>
  <div>
    <div class="panel">
      <div class="panel-hd">
        <div class="actions">
          <button :disabled="firmwares.length < 2" :class="{'disabled':firmwares.length < 2}" @click="showAddTaskModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t('task.create_task') }}</button>
        </div>
        <h2>{{ $t('task.task_list') }}</h2>
        <div style="position:absolute; top:5px; left:120px">
          <a style="position:absolute;width:220px;top:15px" v-show="tips" v-link="{ path: '/product/create' }" class="nontip">没有产品，点击此处跳转添加页面</a>
          <v-select v-else width="200px" placeholder="请选择产品" :label="currProduct.name" size="small">
            <select v-model="currProduct" name="product" @change="Productstatus">
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </v-select>
        </div>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingTasks">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t('task.fields.order') }}</th>
                <th>{{ $t('task.fields.description') }}</th>
                <th>{{ $t('task.fields.from_version') }}</th>
                <th>{{ $t('task.fields.target_version') }}</th>
                <th>{{ $t('task.fields.upgrade_count') }}</th>
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
                    <button :class="{'btn-primary': task.status, 'btn-success': !task.status, 'disabled': toggling}" :disabled="toggling" @click="toggleTaskStatus(task)" class="btn btn-primary btn-mini mr20"><i :class="{'fa-stop': task.status, 'fa-play': !task.status}" class="fa"></i>{{ task.status ? $t('task.stop') : $t('task.start') }}</button>
                    <button @click="removeTask(task)" class="btn btn-primary btn-mini">删除</button>
                  </td>
                </tr>
              </template>
              <tr v-if="tasks.length === 0 && !loadingTasks">
                <td colspan="6" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 添加固件升级任务浮层-->
    <modal :show.sync="showAddTaskModal" @close="onAddTaskCancel">
      <h3 slot="header">{{ $t("task.create_task") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addTaskValidation" @submit.prevent="onAddTaskSubmit" hook="addTaskHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("task.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('task.placeholders.name')" class="input-text-wrap">
                <input v-model="addTaskModel.name" type="text" v-form-ctrl name="name" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="addTaskValidation.$submitted && addTaskValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addTaskValidation.name.$error.required">{{ $t('validation.required', {field: $t('task.fields.name')}) }}</span></div>
              <div v-if="addTaskValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addTaskValidation.name.$error.required">{{ $t('validation.required', {field: $t('task.fields.name')}) }}</span><span v-if="addTaskValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('task.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("task.fields.description") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('task.placeholders.description')" class="input-text-wrap">
                <textarea v-model="addTaskModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="addTaskValidation.$submitted && addTaskValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="addTaskValidation.description.$error.required">{{ $t('validation.required', {field: $t('task.fields.description')}) }}</span></div>
              <div v-if="addTaskValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="addTaskValidation.description.$error.required">{{ $t('validation.required', {field: $t('task.fields.description')}) }}</span><span v-if="addTaskValidation.description.$error.maxlength">{{ $t('validation.maxlength', [ $t('task.fields.description'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("task.fields.from_version") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :placeholder="$t('task.select_from_version')" :label="addTaskModel.from_version.toString()">
                  <select v-model="addTaskModel.from_version" v-form-ctrl name="from_version" custom-validator="checkTypeValid" @change="selectFrom" number="number">
                    <option v-for="firmware in fromFirmwares | orderBy 'version'" :value="firmware.version">{{ firmware.version }}</option>
                  </select>
                </v-select>
              </div>
              <div v-if="addTaskModel.from_version > 0" class="form-tips mt5">url: {{ addTaskModel.from_version | firmwareUrl }}</div>
              <div v-if="addTaskValidation.$submitted" class="form-tips form-tips-error"><span v-if="addTaskValidation.from_version.$error.customValidator">{{ $t("task.select_from_version") }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("task.fields.target_version") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :placeholder="$t('task.select_target_version')" :label="addTaskModel.target_version.toString()">
                  <select v-model="addTaskModel.target_version" v-form-ctrl name="target_version" custom-validator="checkTypeValid" @change="selectTarget" number="number">
                    <option v-for="firmware in targetFirmwares | orderBy 'version'" :value="firmware.version">{{ firmware.version }}</option>
                  </select>
                </v-select>
              </div>
              <div v-if="addTaskModel.target_version > 0" class="form-tips mt5">url: {{ addTaskModel.target_version | firmwareUrl }}</div>
              <div v-if="addTaskValidation.$submitted" class="form-tips form-tips-error"><span v-if="addTaskValidation.target_version.$error.customValidator">{{ $t("task.select_target_version") }}</span></div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onAddTaskCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import locales from '../../consts/locales/index'
  import api from '../../api'
  import Modal from '../../components/Modal'
  import store from '../../store/index'
  import { createPlugin, updatePlugin, removePlugin } from '../../store/actions/plugins'
  import _ from 'lodash'
  import config from '../../consts/config'
  import Select from '../../components/Select'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Applications',

    layout: 'admin',

    mixins: [globalMixins],

    store,

    vuex: {
      getters: {
        plugins: ({ plugins }) => plugins.all
      },
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
      'modal': Modal,
      'v-select': Select
    },

    data () {
      return {
        currProduct: {},
        products: [],
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
          product_id: '',
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
        loadingTasks: false,
        tips: false
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

    route: {
      data () {
        this.originAddTaskModel = _.clone(this.addTaskModel)
        this.getProducts()
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

    methods: {
      // 获取产品列表
      getProducts () {
        api.product.all().then((res) => {
          this.products = res.data
          this.currProduct = this.products[0]
          console.log(this.products)
          if (this.products.length === 0) {
            this.tips = true
          }
          this.getFirmwares()
          this.getTasks()
        }).catch((res) => {
          this.handleError(res)
        })
      },
      getFirmwares () {
        this.loadingFirmwares = true
        api.product.getFirmwares(this.currProduct.id).then((res) => {
          if (res.status === 200) {
            this.firmwares = res.data
            this.loadingFirmwares = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingFirmwares = false
        })
      },
      // 更改应用后获取列表与状态
      Productstatus () {
        this.getFirmwares()
        this.getTasks()
      },
      getTasks () {
        this.loadingTasks = true
        api.firmware.taskList(this.currProduct.id).then((res) => {
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
      // 添加升级任务表单钩子
      addTaskHook (form) {
        this.addTaskForm = form
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
          this.addTaskModel.product_id = this.currProduct.id
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
            product_id: this.currProduct.id,
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
            product_id: this.currProduct.id
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

        if (file && file.size > config.maxFirmwareFileSize * 1024 * 1024) {
          this.showNotice({
            type: 'error',
            content: this.$t('upload.file_size_msg', {max: config.maxFirmwareFileSize})
          })
          return
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('upload.read_err')
            })
          }
          // 读取完成
          reader.onloadend = (evt) => {
            if (evt.target.readyState === window.FileReader.DONE) {
              if (!this.uploading) {
                this.uploading = true
                api.upload.firmware(this.currProduct.id, evt.target.result).then((res) => {
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
            content: this.$t('upload.compatiblity')
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'

</style>
