<template>
  <div class="main">
    <div class="main-title">
      <h2>固件升级</h2>
    </div>
    <div class="tool-bar">
      <div class="tool-list">
        <div class="tool-list-item">
          <button class="trigger" :disabled="firmwares.length < 2" :class="{'disabled':firmwares.length < 2}" @click="showAddTaskModal = true"><i class="fa fa-plus"></i><span class="trigger-text">{{ $t('ui.task.create_task') }}</span></button>
        </div>
      </div>
    </div>

    <!-- 无产品时显示添加提示 -->
    <div class="panel" v-if="!products.length && !loadingProducts">
      <div class="panel-bd">
        <v-alert :cols="7">
          <p>还没有产品哦，请<a v-link="{ path: '/product/create' }" class="hl-red">点击此处</a>添加</p>
        </v-alert>
      </div>
    </div>

    <!-- Start: 固件升级列表 -->
    <div class="panel mt20" v-if="products.length && !loadingProducts">
      <div class="panel-hd">
        <h2>{{ $t('ui.task.task_list') }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingTasks">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <div class="filter-bar">
            <div class="filter-group">
              <v-select v-else width="200px" placeholder="请选择产品" :label="currProduct.name" size="small">
                <span slot="label">产品：</span>
                <select v-model="currProduct" name="product" @change="Productstatus">
                  <option v-for="product in products" :value="product">{{ product.name }}</option>
                </select>
              </v-select>
            </div>
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
              <tr v-if="tasks.length === 0">
                <td colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 添加固件升级任务浮层-->
    <modal :show.sync="showAddTaskModal" @close="onAddTaskCancel">
      <h3 slot="header">{{ $t("ui.task.create_task") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addTaskValidation" @submit.prevent="onAddTaskSubmit" hook="addTaskHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.task.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.task.placeholders.name')" class="input-text-wrap">
                <input v-model="addTaskModel.name" type="text" v-form-ctrl name="name" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="addTaskValidation.$submitted && addTaskValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addTaskValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.task.fields.name')}) }}</span></div>
              <div v-if="addTaskValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addTaskValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.task.fields.name')}) }}</span><span v-if="addTaskValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.task.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.task.fields.description") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.task.placeholders.description')" class="input-text-wrap">
                <textarea v-model="addTaskModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="addTaskValidation.$submitted && addTaskValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="addTaskValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.task.fields.description')}) }}</span></div>
              <div v-if="addTaskValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="addTaskValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.task.fields.description')}) }}</span><span v-if="addTaskValidation.description.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.task.fields.description'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.task.fields.from_version") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :placeholder="$t('ui.task.select_from_version')" :label="addTaskModel.from_version.toString()">
                  <select v-model="addTaskModel.from_version" v-form-ctrl name="from_version" custom-validator="checkTypeValid" @change="selectFrom" number>
                    <option v-for="firmware in fromFirmwares | orderBy 'version'" :value="firmware.version.toString()">{{ firmware.version }}</option>
                  </select>
                </v-select>
              </div>
              <div v-if="addTaskValidation.$submitted" class="form-tips form-tips-error"><span v-if="addTaskValidation.from_version.$error.customValidator">{{ $t("ui.task.select_from_version") }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.task.fields.target_version") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :placeholder="$t('ui.task.select_target_version')" :label="addTaskModel.target_version.toString()">
                  <select v-model="addTaskModel.target_version" v-form-ctrl name="target_version" custom-validator="checkTypeValid" @change="selectTarget" number>
                    <option v-for="firmware in targetFirmwares | orderBy 'version'" :value="firmware.version.toString()">{{ firmware.version }}</option>
                  </select>
                </v-select>
              </div>
              <div v-if="addTaskValidation.$submitted" class="form-tips form-tips-error"><span v-if="addTaskValidation.target_version.$error.customValidator">{{ $t("ui.task.select_target_version") }}</span></div>
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
  // import locales from 'consts/locales/index'
  import api from 'api'
  import Modal from 'components/Modal'
  import _ from 'lodash'
  import Select from 'components/Select'
  import Alert from 'components/Alert'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Applications',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'v-select': Select,
      'v-alert': Alert
    },

    data () {
      return {
        currProduct: {},
        products: [],
        firmwares: [],
        showAddTaskModal: false,
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
        uploading: false,
        adding: false,
        editing: false,
        toogling: false,
        loadingProducts: true,
        loadingFirmwares: true,
        loadingTasks: true,
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
        this.loadingProducts = true
        api.product.all().then((res) => {
          this.loadingProducts = false
          this.products = res.data
          if (this.products.length === 0) {
            return
          }
          this.currProduct = this.products[0]
          this.getFirmwares()
          this.getTasks()
        }).catch((res) => {
          this.handleError(res)
          this.loadingProducts = false
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
        return Number(value) >= 0
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
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

</style>
