<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click="addDataPoint" class="btn btn-success"><i class="fa fa-plus"></i>{{ $t("ui.datapoint.add_datapoint") }}</button>
          </div>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t("ui.datapoint.fields.index") }}</th>
                <th>{{ $t("ui.datapoint.fields.name") }}</th>
                <th>{{ $t("ui.datapoint.fields.type") }}</th>
                <th>{{ $t("ui.datapoint.fields.symbol") }}</th>
                <th>{{ $t("ui.datapoint.fields.description") }}</th>
                <th class="tac">{{ $t("common.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="datapoints.length > 0">
                <tr v-for="datapoint in datapoints | limitBy countPerPage (currentPage-1)*countPerPage">
                <!-- 如果不需要分页，改成下面这个 -->
                <!-- <tr v-for="datapoint in datapoints"> -->
                  <td>{{* datapoint.index }}</td>
                  <td>{{* datapoint.name }}</td>
                  <td>{{ getTypeByValue(datapoint.type).label }}</td>
                  <td>{{* datapoint.symbol }}</td>
                  <td>{{* datapoint.description }}</td>
                  <td class="tac">
                    <button @click="editDataPoint(datapoint)" class="btn btn-link btn-mini">{{ $t("common.edit") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="datapoints.length === 0 && !loadingData">
                <td colspan="6" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="datapoints.length > countPerPage" :total="datapoints.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager>
      </div>
    </div>
    <!-- 添加数据端点浮层-->
    <modal :show.sync="showAddModal" @close="onAddCancel">
      <h3 slot="header">{{ $t("ui.datapoint.add_datapoint") }}</h3>
      <div slot="body" class="form">
        <validator name="addValidation">
          <form novalidate @submit.prevent="onAddSubmit">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.index") }}:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="addModel.index" type="text" name="index" v-validate:index="{required: true, format: 'numberic'}" class="input-text" lazy/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$addValidation.index.touched && $addValidation.index.required">{{ $t('ui.validation.required', {field: $t('ui.datapoint.fields.index')}) }}</span>
                  <span v-if="$addValidation.index.modified && $addValidation.index.format">{{ $t('ui.validation.numberic') }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.name") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.datapoint.placeholders.name')" class="input-text-wrap">
                  <input v-model="addModel.name" type="text" name="addModel.name" v-validate:name="{required: true, maxlength: 32}" class="input-text" lazy/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$addValidation.name.touched && $addValidation.name.required">{{ $t('ui.validation.required', {field: $t('ui.datapoint.fields.name')}) }}</span>
                  <span v-if="$addValidation.name.modified && $addValidation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.datapoint.fields.name'), 32]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.type") }}:</label>
              <div class="controls col-18">
                <div class="select">
                  <v-select :label="addModelType.label">
                    <select v-model="addModelType" name="type">
                      <option v-for="type in datapointTypes" :value="type" :selected="$index===0">{{ type.label }}</option>
                    </select>
                  </v-select>
                </div>
              </div>
            </div>
            <div class="form-row row" v-show="addModelType.value!==1 && addModelType.value!==6">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.range") }}:</label>
              <div class="controls col-18">
                <div class="row">
                  <div class="col-11">
                    <div v-placeholder="$t('ui.datapoint.placeholders.min')" class="input-text-wrap">
                      <input v-model="addModel.min" type="text" name="addModel.min" class="input-text" lazy v-validate:min="{format: 'numberic', min: addModelType.value === 2 || addModelType.value === 3 ? 0 : -9223372036854775808, max: addMax}" class="input-text" lazy/>
                    </div>
                  </div>
                  <div class="col-2 tac control-text">-</div>
                  <div class="col-11">
                    <div v-placeholder="$t('ui.datapoint.placeholders.max')" class="input-text-wrap">
                      <input v-model="addModel.max" type="text" name="addModel.max" class="input-text" lazy v-validate:max="{format: 'numberic', min: addMin, max: addModelType.value === 2 ? 255 : addModelType.value === 3 ? 65535 : 9223372036854775807}"/>
                    </div>
                  </div>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$addValidation.min.modified && $addValidation.min.format">{{ $t('ui.validation.numberic') }}</span>
                  <span v-if="$addValidation.min.modified && $addValidation.min.min">{{ $t('ui.validation.min', [$t('ui.datapoint.fields.min'), addModelType.value === 2 || addModelType.value === 3 ? 0 : -9223372036854775808]) }}</span>
                  <span v-if="($addValidation.min.modified && $addValidation.min.max) || ($addValidation.max.modified && $addValidation.max.min)">最大值必须大于最小值</span>
                  <span v-if="$addValidation.max.modified && $addValidation.max.format">{{ $t('ui.validation.numberic') }}</span>
                  <span v-if="$addValidation.max.modified && $addValidation.max.max">{{ $t('ui.validation.max', [$t('ui.datapoint.fields.max'), addModelType.value === 2 ? 255 : addModelType.value === 3 ? 65535 : 9223372036854775807]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row" v-show="addModelType.value!==1">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.symbol") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.datapoint.placeholders.symbol')" class="input-text-wrap">
                  <input v-model="addModel.symbol" type="text" name="addModel.symbol" v-validate:symbol="{maxlength: 10}" class="input-text" lazy/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$addValidation.symbol.modified && $addValidation.symbol.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.datapoint.fields.symbol'), 10]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.description") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.datapoint.placeholders.description')" class="input-text-wrap">
                  <textarea v-model="addModel.description" type="text" name="addModel.description" v-validate:description="{maxlength: 250}" class="input-text" lazy></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$addValidation.description.modified && $addValidation.description.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.datapoint.fields.description'), 250]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button type="reset" @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
    <!-- 编辑数据端点浮层-->
    <modal :show.sync="showEditModal" @close="onEditCancel">
      <h3 slot="header">{{ $t("ui.datapoint.edit_datapoint") }}</h3>
      <div slot="body" class="form">
        <validator name="editValidation">
          <form novalidate @submit.prevent="onEditSubmit">
            <!-- <pre>{{$editValidation|json}}</pre> -->
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.index") }}:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="editModel.index" type="text" name="index" v-validate:index="{required: true, format: 'numberic'}" class="input-text" lazy/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$editValidation.index.touched && $editValidation.index.required">{{ $t('ui.validation.required', {field: $t('ui.datapoint.fields.index')}) }}</span>
                  <span v-if="$editValidation.index.modified && $editValidation.index.format">{{ $t('ui.validation.numberic') }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.name") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.datapoint.placeholders.name')" class="input-text-wrap">
                  <input v-model="editModel.name" type="text" name="editModel.name" v-validate:name="{required: true, maxlength: 32}" class="input-text" lazy/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$editValidation.name.touched && $editValidation.name.required">{{ $t('ui.validation.required', {field: $t('ui.datapoint.fields.name')}) }}</span>
                  <span v-if="$editValidation.name.modified && $editValidation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.datapoint.fields.name'), 32]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.type") }}:</label>
              <div class="controls col-18">
                <div class="select">
                  <v-select :label="editModelType.label">
                    <select v-model="editModelType" name="type">
                      <option v-for="type in datapointTypes" :value="type" :selected="$index===0">{{ type.label }}</option>
                    </select>
                  </v-select>
                </div>
              </div>
            </div>
            <div class="form-row row" v-show="editModelType.value!==1 && editModelType.value!==6">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.range") }}:</label>
              <div class="controls col-18">
                <div class="row">
                  <div class="col-11">
                    <div v-placeholder="$t('ui.datapoint.placeholders.min')" class="input-text-wrap">
                      <input v-model="editModel.min" type="text" name="editModel.min" class="input-text" lazy v-validate:min="{required: false, format: 'numberic', min: editModelType.value === 2 || editModelType.value === 3 ? 0 : -9223372036854775808, max: editMax}" initial="false" number/>
                    </div>
                  </div>
                  <div class="col-2 tac control-text">-</div>
                  <div class="col-11">
                    <div v-placeholder="$t('ui.datapoint.placeholders.max')" class="input-text-wrap">
                      <input v-model="editModel.max" type="text" name="editModel.max" class="input-text" lazy v-validate:max="{required: false, format: 'numberic', min: editMin, max: editModelType.value === 2 ? 255 : editModelType.value === 3 ? 65535 : 9223372036854775807}" initial="false" number/>
                    </div>
                  </div>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$editValidation.min.modified && $editValidation.min.format">{{ $t('ui.validation.numberic') }}</span>
                  <span v-if="$editValidation.min.modified && $editValidation.min.min">{{ $t('ui.validation.min', [$t('ui.datapoint.fields.min'), editModelType.value === 2 || editModelType.value === 3 ? 0 : -9223372036854775808]) }}</span>
                  <span v-if="($editValidation.min.modified && $editValidation.min.max) || ($editValidation.max.modified && $editValidation.max.min)">最大值必须大于最小值</span>
                  <span v-if="$editValidation.max.modified && $editValidation.max.format">{{ $t('ui.validation.numberic') }}</span>
                  <span v-if="$editValidation.max.modified && $editValidation.max.max">{{ $t('ui.validation.max', [$t('ui.datapoint.fields.max'), editModelType.value === 2 ? 255 : editModelType.value === 3 ? 65535 : 9223372036854775807]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row" v-show="editModelType.value!==1">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.symbol") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.datapoint.placeholders.symbol')" class="input-text-wrap">
                  <input v-model="editModel.symbol" type="text" name="editModel.symbol" v-validate:symbol="{maxlength: 10}" class="input-text" lazy/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$editValidation.symbol.modified && $editValidation.symbol.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.datapoint.fields.symbol'), 10]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.datapoint.fields.description") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.datapoint.placeholders.description')" class="input-text-wrap">
                  <textarea v-model="editModel.description" type="text" name="editModel.description" v-validate:description="{maxlength: 250}" class="input-text" lazy></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$editValidation.description.modified && $editValidation.description.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.datapoint.fields.description'), 250]) }}</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label class="del-check">
                  <input type="checkbox" name="del" v-model="delChecked"/> {{ $t("ui.datapoint.del_datapoint") }}
                </label>
              </div>
              <div class="col-18">
                <div class="form-actions">
                  <button type="reset" @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
                  <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
                </div>
              </div>
            </div>
          </form>
        </validator>
      </div>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'api'
  import * as config from 'consts/config'
  import locales from 'consts/locales/index'
  import Modal from 'components/Modal'
  import Pager from 'components/Pager'
  import Select from 'components/Select'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'

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
        countPerPage: config.COUNT_PER_PAGE,
        currentPage: 1,
        showAddModal: false,
        showEditModal: false,
        addModelType: {},
        addModel: {
          index: '',
          name: '',
          type: 1,
          description: '',
          symbol: ''
        },
        editModelType: {},
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

    computed: {
      // 数据端点类型
      datapointTypes () {
        var result = locales[Vue.config.lang].data.DATAPOINT_TYPES
        _.remove(result, (o) => {
          return o.value === 5
        })
        return result
      },

      maxIndex () {
        var result = -1
        if (this.datapoints.length > 0) {
          result = this.datapoints.concat().sort((a, b) => {
            if (a.index > b.index) {
              return -1
            }
            if (a.index < b.index) {
              return 1
            }
            return 0
          })[0].index
        }
        return result
      },

      addMin () {
        var min = 0
        if (this.addModelType.value === 4) {
          min = -9223372036854775808
        }
        return this.addModel.min || min
      },

      addMax () {
        var max = 9223372036854775807
        if (this.addModelType.value === 2) {
          max = 255
        } else if (this.addModelType.value === 3) {
          max = 65535
        }
        return this.addModel.max || max
      },

      editMin () {
        var min = 0
        if (this.editModelType.value === 4) {
          min = -9223372036854775808
        }
        return this.editModel.min || min
      },

      editMax () {
        var max = 9223372036854775807
        if (this.editModelType.value === 2) {
          max = 255
        } else if (this.editModelType.value === 3) {
          max = 65535
        }
        return this.editModel.max || max
      }
    },

    methods: {
      /**
       * 通过值查找类型
       * @param  {Number} value 值
       */
      getTypeByValue (value) {
        return _.find(this.datapointTypes, (o) => {
          return o.value === value
        })
      },

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
      // addFormHook (form) {
      //   this.addForm = form
      // },

      // 编辑表单钩子
      // editFormHook (form) {
      //   this.editForm = form
      // },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.showAddModal = false
        this.addModel = _.clone(this.originAddModel)
        this.$nextTick(() => {
          // this.addForm.setPristine()
          this.$resetValidation()
        })
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.showEditModal = false
        this.delChecked = false
        this.editModel = this.originEditModel
        this.$resetValidation()
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      /**
       * 添加数据端点
       */
      addDataPoint () {
        this.addModel.index = this.maxIndex + 1
        this.addModelType = this.getTypeByValue(1)
        this.showAddModal = true
      },

      // 添加操作
      onAddSubmit () {
        if (this.$addValidation.valid || ((this.addModelType.value === 1 || this.addModelType.value === 6) && this.$addValidation.index.valid && this.$addValidation.name.valid && this.$addValidation.symbol.valid && this.$addValidation.description.valid) && !this.adding) {
          var params = {
            index: this.addModel.index,
            name: this.addModel.name,
            type: this.addModelType.value,
            description: this.addModel.description,
            symbol: this.addModel.symbol
          }
          if (this.addModelType.value !== 1 && this.addModelType.value !== 6) {
            params.min = this.addModel.min
            params.max = this.addModel.max
          }
          this.adding = true
          api.product.addDataPoint(this.$route.params.id, params).then((res) => {
            if (res.status === 200) {
              this.datapoints.push(res.data)
              this.resetAdd()
            }
          }).catch((res) => {
            this.handleError(res)
            this.resetAdd()
          })
        }
      },

      // 初始化编辑表单
      editDataPoint (datapoint) {
        this.showEditModal = true
        var i = datapoint.index + ''
        this.editModel = _.clone(datapoint)
        this.originEditModel = _.clone(datapoint)
        this.editModel.index = i
        this.originEditModel.index = i
        // this.editModelType = this.
        // console.log(this.editModel.type)
        this.editModelType = this.getTypeByValue(this.editModel.type)
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
        } else if (this.$editValidation.valid || ((this.editModelType.value === 1 || this.editModelType.value === 6) && this.$editValidation.index.valid && this.$editValidation.name.valid && this.$editValidation.symbol.valid && this.$editValidation.description.valid) && !this.editing) {
          this.editing = true
          var params = {
            id: this.editModel.id,
            index: this.editModel.index,
            name: this.editModel.name,
            type: this.editModelType.value,
            description: this.editModel.description,
            symbol: this.editModel.symbol
          }
          if (this.editModelType.value !== 1 && this.editModelType.value !== 6) {
            params.min = this.editModel.min
            params.max = this.editModel.max
          }
          api.product.updateDataPoint(this.$route.params.id, params).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getDatapoints()
            }
          }).catch((res) => {
            this.handleError(res)
            this.resetEdit()
          })
        }
      } // onEditSubmit end
    }
  }
</script>
