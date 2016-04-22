<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("datapoint.add_datapoint") }}</button>
          </div>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>{{ $t("datapoint.fields.index") }}</th>
              <th>{{ $t("datapoint.fields.name") }}</th>
              <th>{{ $t("datapoint.fields.type") }}</th>
              <th>{{ $t("datapoint.fields.symbol") }}</th>
              <th>{{ $t("datapoint.fields.description") }}</th>
              <th class="tac">{{ $t("common.action") }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="datapoints.length > 0 && !loadingData">
              <tr v-for="datapoint in datapoints | limitBy pageCount (currentPage-1)*pageCount">
                <td>{{* datapoint.index }}</td>
                <td>{{* datapoint.name }}</td>
                <td>{{* datapoint.type | typeLabel }}</td>
                <td>{{* datapoint.symbol }}</td>
                <td>{{* datapoint.description }}</td>
                <td class="tac">
                  <button @click="editDataPoint(datapoint)" class="btn-link">{{ $t("common.edit") }}</button>
                </td>
              </tr>
            </template>
            <tr v-if="loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
              </td>
            </tr>
            <tr v-if="datapoints.length === 0 && !loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
        <pager v-if="!loadingData" :total="datapoints.length" :current.sync="currentPage" :page-count="pageCount"></pager>
      </div>
    </div>
    <!-- 添加数据端点浮层-->
    <modal :show.sync="showAddModal" @close="onAddCancel">
      <h3 slot="header">{{ $t("datapoint.add_datapoint") }}</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.index") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('datapoint.placeholders.index')" class="input-text-wrap">
                <input v-model="addModel.index" type="text" v-form-ctrl name="index" required custom-validator="numberic" lazy class="input-text" />
              </div>
              <div v-if="addValidation.$submitted && addValidation.index.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.index.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.index')}) }}</span></div>
              <div v-if="addValidation.index.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.index.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.index')}) }}</span><span v-if="addValidation.index.$error.customValidator">{{ $t('validation.maxlength', [ $t('datapoint.fields.index'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('datapoint.placeholders.name')" class="input-text-wrap">
                <input v-model="addModel.name" type="text" v-form-ctrl name="name" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.name')}) }}</span></div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.name')}) }}</span><span v-if="addValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('datapoint.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.type") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :label="datapointTypes[addModel.type-1]">
                  <select v-model="addModel.type" v-form-ctrl name="type">
                    <option v-for="type in datapointTypes" :value="$index + 1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.symbol") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('datapoint.placeholders.symbol')" class="input-text-wrap">
                <textarea v-model="addModel.symbol" type="text" v-form-ctrl name="symbol" maxlength="10" required lazy class="input-text"></textarea>
              </div>
              <div v-if="addValidation.$submitted && addValidation.symbol.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.symbol.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.symbol')}) }}</span></div>
              <div v-if="addValidation.symbol.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.symbol.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.symbol')}) }}</span><span v-if="addValidation.symbol.$error.maxlength">{{ $t('validation.maxlength', [ $t('datapoint.fields.symbol'), 10])</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.description") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('datapoint.placeholders.description')" class="input-text-wrap">
                <textarea v-model="addModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="addValidation.$submitted&& addValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.description.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.description')}) }}</span></div>
              <div v-if="addValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.description.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.description')}) }}</span><span v-if="addValidation.description.$error.maxlength">{{ $t('validation.maxlength', [ $t('datapoint.fields.description'), 250])</span></div>
            </div>
          </div>
          <div class="form-actions">
            <button type="reset" @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 编辑数据端点浮层-->
    <modal :show.sync="showEditModal">
      <h3 slot="header">{{ $t("datapoint.edit_datapoint") }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.index") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('datapoint.placeholders.index')" class="input-text-wrap">
                <input v-model="editModel.index" type="text" v-form-ctrl name="index" required custom-validator="numberic" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.index.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.index.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.index')}) }}</span></div>
              <div v-if="editValidation.index.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.index.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.index')}) }}</span><span v-if="editValidation.index.$error.customValidator">{{ $t('validation.maxlength', [ $t('datapoint.fields.index'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.name") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('datapoint.placeholders.name')" class="input-text-wrap">
                <input v-model="editModel.name" type="text" v-form-ctrl name="name" maxlength="32" required lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.name')}) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('datapoint.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.type") }}:</label>
            <div class="controls col-18">
              <div class="select">
                <v-select :label="datapointTypes[editModel.type-1]">
                  <select v-model="editModel.type" v-form-ctrl name="type">
                    <option v-for="type in datapointTypes" :value="$index + 1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.symbol") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('datapoint.placeholders.symbol')" class="input-text-wrap">
                <textarea v-model="editModel.symbol" type="text" v-form-ctrl name="symbol" maxlength="10" required lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted && editValidation.symbol.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.symbol.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.symbol')}) }}</span></div>
              <div v-if="editValidation.symbol.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.symbol.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.symbol')}) }}</span><span v-if="editValidation.symbol.$error.maxlength">{{ $t('validation.maxlength', [ $t('datapoint.fields.symbol'), 10])</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("datapoint.fields.description") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('datapoint.placeholders.description')" class="input-text-wrap">
                <textarea v-model="editModel.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted&& editValidation.description.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.description')}) }}</span></div>
              <div v-if="editValidation.description.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.description.$error.required">{{ $t('validation.required', {field: $t('datapoint.fields.description')}) }}</span><span v-if="editValidation.description.$error.maxlength">{{ $t('validation.maxlength', [ $t('datapoint.fields.description'), 250])</span></div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t('datapoint.del_datapoint') }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api'
  import locales from '../../consts/locales/index'
  import Modal from '../../components/Modal'
  import Pager from '../../components/Pager'
  import Select from '../../components/Select'
  import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'DataPoint',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'pager': Pager,
      'v-select': Select
    },

    props: {
      product: {
        type: Object,
        default () {
          return {}
        }
      }
    },

    data () {
      return {
        datapoints: [],
        datapointTypes: locales[Vue.config.lang].datapoint.types,
        pageCount: 10,
        currentPage: 1,
        showAddModal: false,
        showEditModal: false,
        addModel: {
          index: '',
          name: '',
          type: 1,
          description: '',
          symbol: ''
        },
        editModel: {},
        editingDatapoint: {},
        addValidation: {},
        editValidation: {},
        delChecked: false,
        adding: false,
        editing: false,
        addForm: {},
        editForm: {},
        originAddModel: {},
        originEditModel: {},
        loadingData: false
      }
    },

    route: {
      data (transition) {
        this.originAddModel = _.clone(this.addModel)
        this.getDatapoints()
      }
    },

    filters: {
      typeLabel (value) {
        return this.datapointTypes[value - 1]
      }
    },

    methods: {
      // 获取数据端点列表
      getDatapoints () {
        this.loadingData = true
        api.product.getDatapoints(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.datapoints = res.data
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      // 添加表单钩子
      addFormHook (form) {
        this.addForm = form
      },

      // 编辑表单钩子
      editFormHook (form) {
        this.editForm = form
      },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.showEditModal = false
        this.delChecked = false
        this.editModel = this.originEditModel
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      // 添加操作
      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          api.product.addDataPoint(this.$route.params.id, this.addModel).then((res) => {
            if (res.status === 200) {
              this.datapoints.push(res.data)
              this.resetAdd()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },

      // 初始化编辑表单
      editDataPoint (datapoint) {
        this.showEditModal = true
        this.editModel = _.clone(datapoint)
        this.originEditModel = _.clone(datapoint)
      },

      // 取消编辑
      onEditCancel () {
        this.resetEdit()
      },

      // 提交编辑表单
      onEditSubmit () {
        if (this.delChecked && !this.editing) { // 删除
          this.editing = true
          api.product.deleteDataPoint(this.$route.params.id, this.editModel.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.delChecked = false
              this.getDatapoints()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true
          api.product.updateDataPoint(this.$route.params.id, this.editModel).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getDatapoints()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      } // onEditSubmit end
    }
  }
</script>
