<template>
  <div class="main">
    <div class="main-title">
      <h3>告警信息</h3>
    </div>
    <div class="tool-bar">
      <div class="tool-list">
        <div class="tool-list-item">
          <a class="trigger" v-link="{ path: '/operation/alerts/settings' }"><i class="fa fa-cog"></i><span class="trigger-text">规则设置</span></a>
        </div>
      </div>
    </div>
    <div class="panel mt15">
      <!-- <div class="panel-hd">
        <h2>告警信息列表</h2>
      </div> -->
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <!-- <th>{{ $t("ui.alert.info_list.product_name") }}</th> -->
                <th>{{ $t("ui.alert.info_list.content") }}</th>
                <th>{{ $t("ui.alert.info_list.create_date") }}</th>
                <th>{{ $t("ui.alert.info_list.is_read") }}</th>
                <th class="tac">{{ $t("common.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="alerts.length > 0">
                <tr v-for="alert in alerts">
                  <!-- <td>{{ alert.product_name }}</td> -->
                  <td>
                    <template v-if="alert.tags"><span v-for="tag in alert.tags | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ tag }}</span></template>{{ alert.content }}
                  </td>
                  <td>{{ alert.create_date | formatDate }}</td>
                  <td><span v-if="alert.is_read" class="hl-gray">{{ $t("common.read") }}</span><span v-else>{{ $t("common.unread") }}</span></td>
                  <td class="tac">
                    <button @click="showAlert(alert)" class="btn btn-link btn-mini">{{ $t("common.details") }}</button>
                  </td>
                </tr>
              </template>
              <tr v-if="alerts.length === 0">
                <td colspan="4" class="tac">
                  <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getAlerts"></pager>
        <!-- 分页-->
        <!-- <pager v-if="rules.length > countPerPage" :total="rules.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager> -->
      </div>
    </div>

    <!-- Start: 添加规则浮层 -->
    <modal :show.sync="addModal.show" width="670px" :flag="addModal.editingTag" @close="onAddCancel">
      <h3 slot="header">{{ $t("ui.rule.add_rule") }}</h3>
      <div slot="body" class="form form-rules">
        <form v-form name="addValidation" @submit.prevent="onAddSubmit" hook="addFormHook">
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.name") }}:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.rule.placeholders.name')" class="input-text-wrap">
                <input v-model="addModal.model.name" type="text" v-form-ctrl name="name" required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.name')}) }}</span></div>
              <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.name')}) }}</span><span v-if="addValidation.name.$error.minlength">{{ $t('ui.validation.minlength', [$t('ui.rule.fields.name'), 2]) }}</span><span v-if="addValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.rule.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.condition") }}:</label>
            <div class="controls col-19">
              <div class="row">
                <div class="col-5">
                  <v-select :label="ruleTypes[addModal.model.type-1]">
                    <select v-model="addModal.model.type" v-form-ctrl name="type" number @input="onSelectType">
                      <option v-for="type in ruleTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                    </select>
                  </v-select>
                </div>
                <div class="col-8">
                  <div v-show="addModal.model.type === 1" class="ml10">
                    <div class="select">
                      <v-select :label="datapointName(addModal.model)">
                        <select v-model="addModal.model.param" v-form-ctrl name="param">
                          <option v-for="option in datapoints" :value="option.id">{{ option.name }}</option>
                        </select>
                      </v-select>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div v-show="addModal.model.type === 1" class="ml10">
                    <div class="select">
                      <v-select :label="compareTypes[addModal.model.compare-1]">
                        <select v-model="addModal.model.compare" v-form-ctrl name="compare" number>
                          <option v-for="type in compareTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                        </select>
                      </v-select>
                    </div>
                  </div>
                </div>
                <div class="col-5">
                  <div class="ml10">
                    <div class="input-text-wrap" v-show="addModal.model.type === 1">
                      <input v-model="addModal.value1" type="text" v-form-ctrl name="value" required lazy class="input-text"/>
                    </div>
                    <div class="select" v-show="addModal.model.type === 2">
                      <v-select :label="$t('common.'+addModal.value2)">
                        <select v-model="addModal.value2" v-form-ctrl name="value">
                          <option value="online">{{ $t("common.online") }}</option>
                          <option value="offline">{{ $t("common.offline") }}</option>
                        </select>
                      </v-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.content") }}:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.rule.placeholders.content')" class="input-text-wrap">
                <textarea v-model="addModal.model.content" type="text" v-form-ctrl name="content" required maxlength="250" lazy class="input-text"></textarea>
              </div>
              <div v-if="addValidation.$submitted && addValidation.content.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.content.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.content')}) }}</span></div>
              <div v-if="addValidation.content.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.content.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.content')}) }}</span><span v-if="addValidation.content.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.rule.fields.content'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.inform_type") }}:</label>
            <div class="controls col-19">
              <div class="select">
                <v-select :label="informTypes[addModal.model.notify_type-1]">
                  <select v-model="addModal.model.notify_type" v-form-ctrl name="notify_type" number>
                    <option v-for="type in informTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row tag-row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.tags") }}:</label>
            <div class="controls col-19">
              <tag-input :value.sync="addModal.model.tag" :candidate="candidateTags" :editing.sync="addModal.editingTag" @adding-tag="addModal.show = true"></tag-input>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.notify_type") }}:</label>
            <div class="controls col-19">
              <div class="checkbox-group">
                <template v-for="type in notifyTypes">
                  <label v-if="$index < 3" class="checkbox">
                    <input type="checkbox" v-model="addModal.model.notify_target" name="notify_target" :value="$index+1" number/>{{ type }}
                  </label>
                </template>
              </div>
              <template v-for="type in notifyTypes">
                <div class="row" v-if="$index === 3">
                  <div class="checkbox-group col-6">
                    <label class="checkbox">
                      <input type="checkbox" v-model="addModal.model.notify_target" name="notify_target" :value="$index+1" number/>{{ type }}
                    </label>
                  </div>
                  <div class="col-18">
                    <div v-show="isShowApn(addModal.model)" class="apn-list">
                      <div class="checkbox-group">
                        <label v-for="app in apps" v-if="app.type===1" class="checkbox">
                          <input type="checkbox" v-model="addModal.model.notify_apps" name="notify_apps" :value="app.id" number/>{{ app.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="$index === 4">
                  <div class="checkbox-group col-6">
                    <label class="checkbox">
                      <input type="checkbox" v-model="addModal.model.notify_target" name="notify_target" :value="$index+1" number/>{{ type }}
                    </label>
                  </div>
                  <div class="col-18">
                    <div v-show="isShowGoogle(addModal.model)" class="apn-list">
                      <div class="checkbox-group">
                        <label v-for="app in apps" v-if="app.type===2" class="checkbox">
                          <input type="checkbox" v-model="addModal.model.notify_apps" name="notify_apps" :value="app.id" number/>{{ app.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.scope") }}:</label>
            <div class="controls col-19">
              <div class="radio-group">
                <label v-for="type in scopeTypes" class="radio">
                  <input type="radio" v-model="addModal.model.scope" name="addModal.model.scope" :value="$index+1" number/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("common.status") }}:</label>
            <div class="controls col-19">
              <div class="radio-group">
                <label class="radio">
                  <input type="radio" v-model="addModal.model.is_enable" name="is_enable" :value="false"/>{{ $t("common.disabled") }}
                </label>
                <label class="radio">
                  <input type="radio" v-model="addModal.model.is_enable" name="is_enable" :value="true"/>{{ $t("common.enable") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="reset" @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- End: 添加规则浮层 -->
    <!-- 查看告警信息浮层-->
    <modal :show.sync="showModal">
      <h3 slot="header">{{ $t("ui.alert.info") }}</h3>
      <table slot="body" class="table table-stripe table-bordered">
        <tbody>
          <tr>
            <td>{{ $t("ui.alert.info_list.product_name") }}</td>
            <td>{{ model.product_name }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.alert_name") }}</td>
            <td>{{ model.alert_name }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.content") }}</td>
            <td>{{ model.content }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.tags") }}</td>
            <td>
              <template v-if="model.tags"><span v-for="tag in model.tags | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ tag }}</span></template>
            </td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.type") }}</td>
            <td><span>{{ informTypes[model.type - 1] }}</span></td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.notify_type") }}</td>
            <td><span>{{ alertTypes[model.notify_type - 1] }}</span></td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.alert_value") }}</td>
            <td>{{ model.alert_value }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.from") }}</td>
            <td>{{ model.from }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.to") }}</td>
            <td>{{ model.to }}</td>
          </tr>
          <tr>
            <td>{{ $t("ui.alert.info_list.create_date") }}</td>
            <td>{{ model.create_date | formatDate }}</td>
          </tr>
        </tbody>
      </table>
      <div slot="footer" class="modal-footer">
        <button @click.prevent.stop="showModal = false" class="btn btn-primary">{{ $t("common.ok") }}</button>
      </div>
    </modal>
    <!-- Start: 编辑规则浮层 -->
    <!-- <modal :show.sync="editModal.show" :width="'670px'" :flag="editModal.editingTag">
      <h3 slot="header">{{ $t("ui.rule.edit_rule") }}</h3>
      <div slot="body" class="form form-rules">
        <form v-form name="editValidation" @submit.prevent="onEditSubmit" hook="editFormHook">
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.name") }}:</label>
            <div class="controls col-19">
              <div v-placeholder="$t('ui.rule.placeholders.name')" class="input-text-wrap">
                <input v-model="editModal.model.name" type="text" v-form-ctrl name="name" required minlength="2" maxlength="32" lazy class="input-text"/>
              </div>
              <div v-if="editValidation.$submitted && editValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.name')}) }}</span></div>
              <div v-if="editValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.name')}) }}</span><span v-if="editValidation.name.$error.minlength">{{ $t('ui.validation.minlength', [ $t('ui.rule.fields.name'), 2]) }}</span><span v-if="editValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.rule.fields.name'), 32]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.condition") }}:</label>
            <div class="controls col-19">
              <div class="row">
                <div class="col-5">
                  <v-select :label="ruleTypes[editModal.model.type-1]">
                    <select v-model="editModal.model.type" v-form-ctrl name="type" number @input="onSelectType">
                      <option v-for="type in ruleTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                    </select>
                  </v-select>
                </div>
                <div class="col-8">
                  <div v-show="editModal.model.type === 1" class="ml10">
                    <div class="select">
                      <v-select :label="datapointName(editModal.model)">
                        <select v-model="editModal.model.param" v-form-ctrl name="param">
                          <option v-for="option in datapoints" :value="option.id">{{ option.name }}</option>
                        </select>
                      </v-select>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div v-show="editModal.model.type === 1" class="ml10">
                    <div class="select">
                      <v-select :label="compareTypes[editModal.model.compare-1]">
                        <select v-model="editModal.model.compare" v-form-ctrl name="compare" number>
                          <option v-for="type in compareTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                        </select>
                      </v-select>
                    </div>
                  </div>
                </div>
                <div class="col-5">
                  <div class="ml10">
                    <div class="input-text-wrap" v-show="editModal.model.type === 1">
                      <input v-model="editModal.value1" type="text" v-form-ctrl name="value" required lazy class="input-text"/>
                    </div>
                    <div class="select" v-show="editModal.model.type === 2">
                      <v-select :label="$t('common.'+editModal.value2)">
                        <select v-model="editModal.value2" v-form-ctrl name="value">
                          <option value="online">{{ $t("common.online") }}</option>
                          <option value="offline">{{ $t("common.offline") }}</option>
                        </select>
                      </v-select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.content") }}:</label>
            <div class="controls col-19">
              <div v-placeholder="'请输入告警内容'" class="input-text-wrap">
                <textarea v-model="editModal.model.content" type="text" v-form-ctrl name="content" required maxlength="250" lazy class="input-text"></textarea>
              </div>
              <div v-if="editValidation.$submitted && editValidation.content.$pristine" class="form-tips form-tips-error"><span v-if="editValidation.content.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.content')}) }}</span></div>
              <div v-if="editValidation.content.$dirty" class="form-tips form-tips-error"><span v-if="editValidation.content.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.content')}) }}</span><span v-if="editValidation.content.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.rule.fields.content'), 250]) }}</span></div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.inform_type") }}:</label>
            <div class="controls col-19">
              <div class="select">
                <v-select :label="informTypes[editModal.model.notify_type-1]">
                  <select v-model="editModal.model.notify_type" v-form-ctrl name="notify_type" number>
                    <option v-for="type in informTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                  </select>
                </v-select>
              </div>
            </div>
          </div>
          <div class="form-row row tag-row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.tags") }}:</label>
            <div class="controls col-19">
              <tag-input :value.sync="editModal.model.tag" :candidate="candidateTags" :editing.sync="editModal.editingTag" @adding-tag="editModal.show = true"></tag-input>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.notify_type") }}:</label>
            <div class="controls col-19">
              <div class="checkbox-group">
                <template v-for="type in notifyTypes">
                  <label v-if="$index < 3" class="checkbox">
                    <input type="checkbox" v-model="editModal.model.notify_target" name="notify_target" :value="$index+1" number/>{{ type }}
                  </label>
                </template>
              </div>
              <template v-for="type in notifyTypes">
                <div class="row" v-if="$index === 3">
                  <div class="checkbox-group col-6">
                    <label class="checkbox">
                      <input type="checkbox" v-model="editModal.model.notify_target" name="notify_target" :value="$index+1" number/>{{ type }}
                    </label>
                  </div>
                  <div class="col-18">
                    <div v-show="isShowApn(editModal.model)" class="apn-list">
                      <div class="checkbox-group">
                        <label v-for="app in apps" v-if="app.type===1" class="checkbox">
                          <input type="checkbox" v-model="editModal.model.notify_apps" name="notify_apps" :value="app.id" number/>{{ app.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="$index === 4">
                  <div class="checkbox-group col-6">
                    <label class="checkbox">
                      <input type="checkbox" v-model="editModal.model.notify_target" name="notify_target" :value="$index+1" number/>{{ type }}
                    </label>
                  </div>
                  <div class="col-18">
                    <div v-show="isShowGoogle(editModal.model)" class="apn-list">
                      <div class="checkbox-group">
                        <label v-for="app in apps" v-if="app.type===2" class="checkbox">
                          <input type="checkbox" v-model="editModal.model.notify_apps" name="notify_apps" :value="app.id" number/>{{ app.name }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("ui.rule.fields.scope") }}:</label>
            <div class="controls col-19">
              <div class="radio-group">
                <label v-for="type in scopeTypes" class="radio">
                  <input type="radio" v-model="editModal.model.scope" name="scope" :value="$index+1" number/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-5">{{ $t("common.status") }}:</label>
            <div class="controls col-19">
              <div class="radio-group">
                <label class="radio">
                  <input type="radio" v-model="editModal.model.is_enable" name="is_enable" :value="false"/>{{ $t("common.disabled") }}
                </label>
                <label class="radio">
                  <input type="radio" v-model="editModal.model.is_enable" name="is_enable" :value="true"/>{{ $t("common.enable") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <label class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.rule.del_rule") }}
            </label>
            <button @click.prevent.stop="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal> -->
    <!-- End: 编辑规则浮层 -->
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'api'
  import * as config from 'consts/config'
  import locales from 'consts/locales/index'
  import Pager from 'components/Pager'
  import Modal from 'components/Modal'
  import Select from 'components/Select'
  import TagInput from 'components/TagInput'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Alert',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'pager': Pager,
      'v-select': Select,
      'tag-input': TagInput
    },

    data () {
      return {
        alerts: [],
        rules: [],            // 规则列表
        apps: [],              // app 列表
        ruleTypes: locales[Vue.config.lang].data.RULE_TYPES,
        compareTypes: locales[Vue.config.lang].data.RULE_COMPARE_TYPES,
        informTypes: locales[Vue.config.lang].data.RULE_INFORM_TYPES,
        notifyTypes: locales[Vue.config.lang].data.RULE_NOTIFY_TYPES,
        scopeTypes: locales[Vue.config.lang].data.RULE_SCOPE_TYPES,
        datapoints: [],       // 数据端点
        currentPage: 1,       // 当前页
        countPerPage: config.COUNT_PER_PAGE,        // 每页记录数
        // addModal.show: false,  // 是否显示添加浮层
        // editModal.show: false, // 是否显示编辑浮层
        candidateTags: locales[Vue.config.lang].data.RULE_CANDIDATE_TAGS,      // 候选标签
        addModal: {
          show: false,
          form: {},
          editingTag: false,
          model: {           // 添加数据模型
            product_id: this.$route.params.id,
            name: '',
            tag: '',
            type: 1,
            notify_target: [],
            notify_apps: [],
            notify_type: 1,
            compare: 1,
            value: '0',
            scope: 1,
            is_enable: true,
            content: '',
            param: ''
          },
          value1: '0',
          value2: 'online'
        },
        model: {
          id: '',
          type: 1,
          product_name: '',
          alert_name: '',
          alert_value: '',
          notify_type: 1,
          from: '',
          to: [],
          content: '',
          create_date: '',
          is_read: false,
          tags: ''
        },
        alertTypes: locales[Vue.config.lang].data.ALERT_TYPES,
        editModal: {
          show: false,
          form: {},
          editingTag: false,
          model: {           // 添加数据模型
            tag: ''
          },
          value1: '0',
          value2: 'online'
        },
        // addModel: {           // 添加数据模型
        //   product_id: this.$route.params.id,
        //   name: '',
        //   tag: '',
        //   type: 1,
        //   notify_target: [],
        //   notify_apps: [],
        //   notify_type: 1,
        //   compare: 1,
        //   value: '0',
        //   scope: 1,
        //   is_enable: true,
        //   content: '',
        //   param: ''
        // },
        addValidation: {},    // 添加验证
        editValidation: {},   // 修改验证
        // addModelEditingTag: false, // 是否正在编辑添加浮层的标签
        // editModal.modelEditingTag: false, // 是否正在编辑编辑浮层的标签
        // editModal.model: {
        //   tag: ''
        // },
        delChecked: false,    // 是否删除
        adding: false,
        editing: false,
        // addForm: {},
        // editForm: {},
        originAddModel: {},
        originEditModel: {},
        loadingData: false,
        productName: '',
        query: {},
        showModal: false
      }
    },

    route: {
      // data () {
      //   this.getDatapoints().then((res) => {
      //     if (res.status === 200) {
      //       this.datapoints = res.data
      //       this.addModal.model.param = res.data[0].id
      //       this.originAddModel = _.cloneDeep(this.addModal.model)
      //     }
      //   })
      //   this.getRules()
      //   this.getApps()
      // }
    },

    filters: {
      toTags (value) {
        return value.length ? value.split(',') : []
      }
    },

    computed: {
      /**
       * 数据端点名称
       */
      // datapointName (model) {
      //   var result
      //
      //   console.log(model.param)
      //
      //   if (this.datapoints.length > 0 && typeof model.param !== 'undefined') {
      //     var datapoint = _.find(this.datapoints, (item) => {
      //       return item.id === model.param
      //     })
      //     result = datapoint.name
      //   } else {
      //     result = ''
      //   }
      //
      //   return result
      // }
      queryCondition () {
        return {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {
            name: this.productName
          }
        }
      }
    },
    ready () {
      this.getProduct()
    },

    methods: {
      /**
       * 数据端点名称
       */
      datapointName (model) {
        var result

        if (this.datapoints.length > 0 && typeof model.param !== 'undefined' && model.param.length > 0) {
          var datapoint = _.find(this.datapoints, (item) => {
            return item.id === model.param
          })
          result = datapoint.name
        } else {
          result = ''
        }

        return result
      },
      // 获取产品
      getProduct () {
        api.product.getProduct(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            // this.product = res.data
            this.productName = res.data.name
            this.getAlerts()
          }
        })
      },
      /**
       * 获取告警信息列表
       */
      getAlerts () {
        this.loadingData = true
        api.alert.getAlerts(this.queryCondition).then((res) => {
          if (res.status === 200) {
            this.alerts = res.data.list
            this.total = res.data.count
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      /**
       * 获取单条告警信息并弹出浮层显示
       * @param  {Object} alert 目标告警信息
       */
      showAlert (alert) {
        this.model = alert
        this.showModal = true
        api.alert.setAlertRead([alert.id]).then((res) => {
          if (res.status === 200) {
            alert.is_read = true
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      // 获取数据端点列表
      getDatapoints () {
        return api.product.getDatapoints(this.$route.params.id)
      },

      // 获取告警规则列表
      getRules () {
        this.loadingData = true
        api.alert.getRules(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.rules = res.data
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },

      // 获取 APP 列表
      getApps () {
        api.plugin.all().then((res) => {
          if (res.status === 200) {
            this.apps = res.data.list
          }
        })
      },

      // 是否显示 APN推送
      isShowApn (model) {
        return _.includes(model.notify_target, 4)
      },

      // 是否显示 Google推送
      isShowGoogle (model) {
        return _.includes(model.notify_target, 5)
      },
      // 选择告警类型
      onSelectType () {
        if (this.addModal.model.type === 1) {
          this.addModal.model.compare = 1
          this.addModal.model.value = 'online'
        } else {
          this.addModal.model.value = ''
        }
      },

      // 添加表单钩子
      addFormHook (form) {
        this.addModal.form = form
      },

      // 编辑表单钩子
      editFormHook (form) {
        this.editModal.form = form
      },

      // 关闭添加浮层并净化添加表单
      resetAdd () {
        this.adding = false
        this.addModal.show = false
        this.addModal.model = _.cloneDeep(this.originAddModel)
        this.addModal.value1 = '0'
        this.addModal.value2 = 'online'
        this.$nextTick(() => {
          this.addModal.form.setPristine()
        })
      },

      // 关闭编辑浮层并净化编辑表单
      resetEdit () {
        this.editing = false
        this.delChecked = false
        this.editModal.show = false
        this.editModal.model = this.originEditModel
      },

      // 取消添加
      onAddCancel () {
        this.resetAdd()
      },

      onAddSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          this.addModal.model.value = this.addModal.model.type === 1 ? this.addModal.value1 : this.addModal.value2
          api.alert.addRule(this.addModal.model).then((res) => {
            if (res.status === 200) {
              this.getRules()
              this.resetAdd()
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },

      // 初始化编辑表单
      editRule (rule) {
        this.editModal.show = true
        if (rule.type === 1) {
          this.editModal.value1 = rule.value
        } else {
          this.editModal.value2 = rule.value
        }
        this.editModal.model = _.clone(rule)
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
          api.alert.deleteRule(this.editModal.model.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getRules()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else if (this.editValidation.$valid && !this.editing) { // 更新
          this.editing = true
          this.editModal.model.value = this.editModal.model.type === 1 ? this.editModal.value1 : this.editModal.value2
          api.alert.updateRule(this.editModal.model, this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.resetEdit()
              this.getRules()
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .modal
    .form-rules
      /*.form-row
        .controls
          width 480px !important*/

      /*.tag-row*/
        /*overflow-y visible*/

      .apn-list
        background #FFF
        border 1px solid default-border-color
        padding 0 10px
        margin-bottom 3px
</style>
