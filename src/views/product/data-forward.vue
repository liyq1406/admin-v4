<template>
  <div class="row">
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <div class="action-group">
            <button @click="showAddModal = true" class="btn btn-success"><i class="fa fa-plus"></i>{{ '添加规则' }}</button>
          </div>
        </div>
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>{{ $t("ui.dataforward.fields.id") }}</th>
                <th>{{ $t("ui.dataforward.fields.destination.url") }}</th>
                <th>{{ $t("ui.dataforward.fields.destination.type") }}</th>
                <th class="tac">{{ $t("common.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="rules.length > 0">
                <tr v-for="rule in rules | limitBy countPerPage (currentPage-1)*countPerPage">
                  <td>{{* rule.id }}</td>
                  <td>{{* rule.destination.url }}</td>
                  <td><span v-if="rule.destination.type===1">转发到外部url</span><span v-if="rule.destination.type===2">转发到内部插件处理单元</span></td>
                  <td class="tac">
                    <button @click="editRule(rule)" class="btn-link">{{ $t("common.edit") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="rules.length === 0 && !loadingData">
                <td colspan="4" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="total > countPerPage" :total="rules.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager>
      </div>
    </div>
    <!-- 添加转发规则-->
    <modal :show.sync="showAddModal">
      <h3 slot="header">{{ '添加转发规则' }}</h3>
      <div slot="body" class="form">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row row">
            <label class="form-control col-7">{{ '数据的类型' }}:</label>
            <div class="controls col-17">
              <div class="checkbox-group">
                <label v-for="type in dataForwardType" class="checkbox">
                  <input type="checkbox" v-model="addModel.data_type" :value="$index+1"/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">{{ '分发类型' }}:</label>
            <div class="controls col-17">
              <div class="select">
                <v-select :label="dataDestination[addModel.destination.type-1]">
                  <select v-model="addModel.destination.type" name="type" number>
                    <option v-for="type in dataDestination" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">{{ '数据分发目的地' }}:</label>
            <div class="controls col-17">
              <div v-placeholder="'请输入URL'" class="input-text-wrap">
                <input v-model="addModel.destination.url" type="text" name="url" required minlength="2" maxlength="250" lazy class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">{{ 'token' }}:</label>
            <div class="controls col-17">
              <div v-placeholder="'请输入token'" class="input-text-wrap">
                <input v-model="addModel.destination.token" type="text" name="token" required minlength="2" maxlength="250" lazy class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="reset" @click.prevent.stop="onAddCancel" class="btn btn-default">{{ '取消' }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 编辑数据端点浮层-->
    <modal :show.sync="showEditModal">
      <h3 slot="header">{{ '修改转发规则' }}</h3>
      <div slot="body" class="form">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-7">{{ '数据的类型' }}:</label>
            <div class="controls col-17">
              <div class="checkbox-group">
                <label v-for="type in dataForwardType" class="checkbox">
                  <input type="checkbox" v-model="editModel.data_type" :value="$index+1"/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">{{ '分发类型' }}:</label>
            <div class="controls col-17">
              <div class="select">
                <v-select :label="dataDestination[editModel.destination.type-1]">
                  <select v-model="editModel.destination.type" name="type" number>
                    <option v-for="type in dataDestination" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">{{ '数据分发目的地' }}:</label>
            <div class="controls col-17">
              <div v-placeholder="'请输入URL'" class="input-text-wrap">
                <input v-model="editModel.destination.url" type="text" name="url" required minlength="2" maxlength="250" lazy class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">{{ 'token' }}:</label>
            <div class="controls col-17">
              <div v-placeholder="'请输入token'" class="input-text-wrap">
                <input v-model="editModel.destination.token" type="text" name="token" required minlength="2" maxlength="250" lazy class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ '删除转发规则' }}
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
  import * as config from '../../consts/config'
  import locales from '../../consts/locales/index'
  import Modal from '../../components/Modal'
  import Pager from '../../components/Pager'
  import Select from '../../components/Select'
  import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'DataForward',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'pager': Pager,
      'v-select': Select
    },

    data () {
      return {
        rules: [],            // 规则列表
        datapoints: [],
        dataForwardType: locales[Vue.config.lang].data.DATA_FORWARD_TYPES,
        dataDestination: locales[Vue.config.lang].data.DATA_DESTINATIONS,
        data_type: [],
        notify_type: [],
        countPerPage: config.COUNT_PER_PAGE,
        currentPage: 1,
        total: 0,
        showAddModal: false,
        showEditModal: false,
        addModel: {
          data_type: [],
          destination: {
            type: '',
            url: '',
            token: ''
          }
        },
        editModel: {
          data_type: [],
          destination: {
            type: '',
            url: '',
            token: ''
          }
        },
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
      data () {
        this.originAddModel = _.cloneDeep(this.addModel)
        this.getRule()
      }
    },

    ready () {
      this.getRule()
    },

    methods: {
      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.showAddModal = false
        this.addModel = _.cloneDeep(this.originAddModel)
        this.$nextTick(() => {
          this.addForm.setPristine()
        })
      },

      // 获取转发规则列表
      getRule () {
        this.loadingData = true
        api.dataForward.getRule(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.rules = res.data.list
            this.total = res.data.count
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      // 添加操作
      onAddSubmit () {
        this.adding = true
        api.dataForward.addRule(this.$route.params.id, this.addModel).then((res) => {
          if (res.status === 200) {
            this.rules.push(res.data)
            this.getRule()
            this.resetAdd()
          }
        }).catch((res) => {
          this.handleError(res)
          this.adding = false
        })
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.delChecked = false
        this.showEditModal = false
        this.editModel = this.originEditModel
      },

      // // 初始化编辑表单
      // editDataPoint (datapoint) {
      //   this.showEditModal = true
      //   this.editModel = _.clone(datapoint)
      //   this.originEditModel = _.clone(datapoint)
      // },

      // 初始化编辑表单
      editRule (rule) {
        this.showEditModal = true
        this.editModel = _.clone(rule)
        this.originEditModel = _.clone(rule)
      },

      // 取消编辑
      onEditCancel () {
        this.resetEdit()
      },

      // 提交编辑表单
      onEditSubmit () {
        if (this.delChecked && !this.editing) { // 删除
          this.editing = true
          api.dataForward.deleteRule(this.$route.params.id, this.editModel.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getRule()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true
          api.dataForward.updateRule(this.$route.params.id, this.editModel.id, this.editModel).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getRule()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },

      // 添加表单钩子
      addFormHook (form) {
        this.addForm = form
      },

      // 编辑表单钩子
      editFormHook (form) {
        this.editForm = form
      }
    }
  }
</script>
