<template>
  <div class="main">
    <div class="main-title">
      <h2>固件版本管理</h2>
    </div>
    <div class="tool-bar">
      <div class="tool-list">
        <div class="tool-list-item">
          <button class="trigger" :disabled="!products.length" :class="{'disabled': !products.length}" @click="showAddModal = true"><i class="fa fa-plus"></i><span class="trigger-text">{{ $t('ui.firmware.add_firmware') }}</span></button>
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

    <!-- Start: 固件版本列表 -->
    <div class="panel" v-if="products.length && !loadingProducts">
      <div class="panel-hd">
        <h2>{{ $t('ui.firmware.firmware_list') }}</h2>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingFirmwares">
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
              <tr v-if="firmwares.length === 0">
                <td colspan="4" class="tac">
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
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFirmwareHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.mod") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.mod')" class="input-text-wrap">
                <input v-model="addModel.mod" type="text" v-form-ctrl name="mod" maxlength="20" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.mod.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.mod.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.mod')}) }}</span></div>
              <div v-if="addValidation.mod.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.mod.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.mod')}) }}</span><span v-if="addValidation.mod.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.firmware.fields.mod'), 20]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.version") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.version')" class="input-text-wrap">
                <input v-model="addModel.version" type="text" v-form-ctrl name="version" required custom-validator="numberic" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.version.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.version.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.version')}) }}</span></div>
              <div v-if="addValidation.version.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.version.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.version')}) }}</span><span v-if="addValidation.version.$error.customValidator">{{ $t('ui.validation.numberic') }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.file") }}:</label>
            <div class="controls col-18">
              <label :class="{'disabled':uploading}" class="btn btn-success btn-upload">
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
              <div v-if="addValidation.$submitted && addValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.description')}) }}</span></div>
              <div v-if="addValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.description')}) }}</span><span v-if="addValidation.description.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.firmware.fields.version'), 250]) }}</span></div>
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
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 编辑固件版本浮层-->
    <modal :show.sync="showEditModal" @close="onEditCancel">
      <h3 slot="header">{{ $t('ui.firmware.edit_firmware') }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFirmwareHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.mod") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.mod')" class="input-text-wrap">
                <input v-model="editModel.mod" type="text" v-form-ctrl name="mod" maxlength="20" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.mod.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.mod.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.mod')}) }}</span></div>
              <div v-if="editValidation.mod.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.mod.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.mod')}) }}</span><span v-if="editValidation.mod.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.firmware.fields.mod'), 20]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.fields.version") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.firmware.placeholders.version')" class="input-text-wrap">
                <input v-model="editModel.version" type="text" v-form-ctrl name="version" required custom-validator="numberic" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.version.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.version.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.version')}) }}</span></div>
              <div v-if="editValidation.version.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.version.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.version')}) }}</span><span v-if="editValidation.version.$error.customValidator">{{ $t('ui.validation.numberic') }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.firmware.file") }}:</label>
            <div class="controls col-18">
              <label :class="{'disabled':uploading}" class="btn btn-success btn-upload">
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
              <div v-if="editValidation.$submitted && editValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.description')}) }}</span></div>
              <div v-if="editValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('ui.validation.required', {field: $t('ui.firmware.fields.description')}) }}</span><span v-if="editValidation.description.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.firmware.fields.version'), 250]) }}</span></div>
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
            <button type="reset" @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
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
  import Select from 'components/Select'
  import Alert from 'components/Alert'
  import store from 'store/index'
  import * as config from 'consts/config'
  import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Management',

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
      'v-select': Select,
      'v-alert': Alert
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
        editModel: {},
        addValidation: {},
        editValidation: {},
        originEditModel: {},
        delChecked: false,
        uploading: false,
        adding: false,
        editing: false,
        toogling: false,
        loadingProducts: true,
        loadingFirmwares: true
      }
    },

    route: {
      data () {
        this.originAddModel = _.clone(this.addModel)
        this.getProducts()
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
        }).catch((res) => {
          this.handleError(res)
          this.loadingProducts = false
        })
      },

      /**
       * 获取固件列表
       */
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
      },
      // 添加固件版本表单钩子
      addFirmwareHook (form) {
        this.addForm = form
      },
      // 修改固件版本表单钩子
      editFirmwareHook (form) {
        this.editForm = form
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
          api.product.addFirmware(this.currProduct.id, this.addModel).then((res) => {
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
          api.product.deleteFirmware(this.currProduct.id, this.editModel.id).then((res) => {
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
          api.product.updateFirmware(this.currProduct.id, this.editModel).then((res) => {
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
      // 上传固件文件
      uploadFirmware (model, firmwareFile, event) {
        var file = this.$els[firmwareFile].files[0]
        var input = event.target

        if (file && file.size > config.MAX_FIRMWARE_FILE_SIZE * 1024 * 1024) {
          this.showNotice({
            type: 'error',
            content: this.$t('ui.upload.file_size_msg', {max: config.MAX_FIRMWARE_FILE_SIZE})
          })
          return
        }

        if (window.File && window.FileReader && window.FileList && window.Blob) {
          var reader = new window.FileReader()
          reader.onerror = (evt) => {
            this.showNotice({
              type: 'error',
              content: this.$t('ui.upload.read_err')
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
            content: this.$t('ui.upload.compatiblity')
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'
</style>
