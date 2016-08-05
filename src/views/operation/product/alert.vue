<template>
  <div class="main">
    <div class="main-title">
      <h2>告警信息</h2>
    </div>
    <div class="row statistic-group mb30 bt">
      <div class="col-6">
        <statistic :info="alertSummary.unhandle" :title="alertSummary.unhandle.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.message" :title="alertSummary.message.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.sevenday" :title="alertSummary.sevenday.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :info="alertSummary.thirtyday" :title="alertSummary.thirtyday.title" align="left"></statistic>
      </div>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-range-picker @timechange = "getSpecial"></date-time-range-picker>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="periods" :value.sync="period" @select="getAll()"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
      <h3>趋势</h3>
    </div>
    <div class="panel">
      <time-line :data="trendData" ></time-line>
    </div>
    <div class="panel">
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fl">
              <div class="filter-group-item">
                <v-select width="90px" size="small" :label="visibility.label">
                  <span slot="label">明细：</span>
                  <select v-model="visibility" @change="getList()">
                    <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                  </select>
                </v-select>
              </div>
            </div>
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getList()" @search-deactivate="getList()" @search="getList()" @press-enter="getList()">
                  <v-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" @click="getList()" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
          </div>
          <c-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @page-count-update="pageCountUpdate" @current-page-change="currentPageChange"></c-table>
        </div>
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
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'api'
  import * as config from 'consts/config'
  import locales from 'consts/locales/index'
  import Table from 'components/Table'
  import Modal from 'components/Modal'
  import Select from 'components/Select'
  import TagInput from 'components/TagInput'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'
  import Statistic from 'components/Statistic'
  import RadioButtonGroup from 'components/RadioButtonGroup'
  import DateTimeRangePicker from 'components/DateTimeRangePicker'
  import TimeLine from 'components/g2-charts/TimeLine'
  // import Mock from 'mockjs'
  import Dropdown from 'components/Dropdown'
  import { formatDate, uniformDate } from 'src/filters'
  import dateFormat from 'date-format'
  import SearchBox from 'components/SearchBox'

  export default {
    name: 'Alert',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'c-table': Table,
      'v-select': Select,
      'tag-input': TagInput,
      Statistic,
      RadioButtonGroup,
      DateTimeRangePicker,
      TimeLine,
      Dropdown,
      SearchBox
    },

    data () {
      return {
        // TODO
        alertChartData: [],
        records: [],
        deviceID: '',
        productID: '',
        key: '',
        total: 0,
        visibility: {
          label: '全部等级',
          value: 'all'
        },
        visibilityOptions: [
          { label: '全部等级', value: 'all' },
          { label: '通知', value: '通知' },
          { label: '轻微', value: '轻微' },
          { label: '严重', value: '严重' }
        ],
        queryTypeOptions: [
          { label: 'MAC', value: 'mac' },
          { label: '设备ID', value: 'from' },
          { label: '告警内容', value: 'alert_name' }
        ],
        queryType: {
          label: 'MAC',
          value: 'mac'
        },
        startTimePick: '',
        endTimePick: '',
        trendData: [],
        serious: {
          name: '严重',
          data: []
        },
        normal: {
          name: '通知',
          data: []
        },
        light: {
          name: '轻微',
          data: []
        },
        // alerts: [{
        //   content: '设备下线',
        //   level: 1
        // }, {
        //   content: 'PM2.5超过指标',
        //   level: 3
        // }, {
        //   content: 'PM2.5超过指标',
        //   level: 3
        // }, {
        //   content: 'PM2.5超过指标',
        //   level: 3
        // }, {
        //   content: 'PM2.5超过指标',
        //   level: 3
        // }, {
        //   content: 'AQI过低',
        //   level: 2
        // }, {
        //   content: 'AQI过低',
        //   level: 2
        // }, {
        //   content: 'AQI过低',
        //   level: 2
        // }, {
        //   content: '滤网失效',
        //   level: 3
        // }, {
        //   content: '滤网失效',
        //   level: 3
        // }],
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
        addValidation: {},    // 添加验证
        editValidation: {},   // 修改验证
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
        showModal: false,
        alertSummary: {
          unhandle: {
            total: '',
            change: '',
            title: '待处理告警'
          },
          message: {
            total: '',
            change: '',
            title: '今日告警'
          },
          thirtyday: {
            total: '',
            change: '',
            title: '30天告警数'
          },
          sevenday: {
            total: '',
            change: '',
            title: '7天告警数'
          }
        },
        period: 7,
        periods: [
          {
            value: 1,
            label: '24h'
          },
          {
            value: 7,
            label: '7天'
          },
          {
            value: 30,
            label: '30天'
          }
        ],
        headers: [
          {
            key: 'content',
            title: '告警内容'
          },
          {
            key: 'mac',
            title: '设备MAC'
          },
          {
            key: 'id',
            title: '设备ID'
          },
          {
            key: 'time',
            title: '时间',
            sortType: -1
          },
          {
            key: 'duration',
            title: '持续时长'
          },
          {
            key: 'level',
            title: '告警等级'
          },
          {
            key: 'state',
            title: '状态'
          }
        ]
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
      page () {
        return {
          total: this.total,
          currentPage: this.currentPage,
          countPerPage: this.countPerPage
        }
      },
      tables () {
        var result = []
        this.records.map((item) => {
          var levelCls = ''
          if (item.tags === '通知') {
            levelCls = 'text-label-warning'
          } else if (item.tags === '严重') {
            levelCls = 'text-label-danger'
          }
          var alert = {
            content: item.alert_name,
            mac: item.mac,
            time: formatDate(item.create_date),
            duration: item.lasting + 'h',
            id: item.from,
            level: `<div class="level level1 text-label ${levelCls}">${item.tags === '轻微' ? '轻微' : item.tags === '通知' ? '通知' : '严重'}</div>`,
            state: item.is_read ? '已处理' : '未处理',
            prototype: item
          }
          result.push(alert)
        })
        return result
      },
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
      // queryCondition () {
      //   var condition = {
      //     limit: this.countPerPage,
      //     offset: (this.currentPage - 1) * this.countPerPage,
      //     order: {},
      //     query: {}
      //   }
      //   if (this.key !== '') {
      //     condition.query.id = {$regex: this.key, $options: 'i'}
      //   }
      //
      //   return condition
      // },
      queryCondition () {
        var condition = {}
        if (this.period === '') {
          condition = {
            limit: this.countPerPage,
            offset: (this.currentPage - 1) * this.countPerPage,
            order: {},
            query: {
              product_id: {
                $in: [this.$route.params.id]
              },
              create_date: {
                $gte: this.startTimePick,
                $lte: this.endTimePick
              }
            }
          }
        } else {
          condition = {
            limit: this.countPerPage,
            offset: (this.currentPage - 1) * this.countPerPage,
            order: {},
            query: {
              product_id: {
                $in: [this.$route.params.id]
              },
              create_date: {
                $lte: this.endTime + 'T00:00:00.000Z',
                $gte: this.beginTime + 'T00:00:00.000Z'
              }
            }
          }
        }
        // if (this.key !== '') {
        //   condition.query.id = {$in: [this.key]}
        // }
        if (this.key.length > 0) {
          condition.query[this.queryType.value] = this.queryType.value === 'from' ? { $in: [Number(this.key)] } : { $like: this.key }
        }

        switch (this.visibility.value) {
          case '通知':
            condition.query['tags'] = { $in: ['通知'] }
            break
          case '轻微':
            condition.query['tags'] = { $in: ['轻微'] }
            break
          case '严重':
            condition.query['tags'] = { $in: ['严重'] }
            break
          default:
        }

        return condition
      },
      endTime () {
        var end = new Date().getTime()
        return dateFormat('yyyy-MM-dd', new Date(end))
      },

      beginTime () {
        var past = new Date().getTime() - this.period * 24 * 3600 * 1000
        return dateFormat('yyyy-MM-dd', new Date(past))
      }
    },
    ready () {
      // this.getProduct()
      this.getSummary()
      this.getList()
      this.getTagTrend()
      // TODO
      // this.alertChartData = Mock.mock({
      //   'list|21': [{
      //     'date|+1': [
      //       new Date(2016, 7, 15),
      //       new Date(2016, 7, 16),
      //       new Date(2016, 7, 17),
      //       new Date(2016, 7, 18),
      //       new Date(2016, 7, 19),
      //       new Date(2016, 7, 20),
      //       new Date(2016, 7, 21),
      //       new Date(2016, 7, 15),
      //       new Date(2016, 7, 16),
      //       new Date(2016, 7, 17),
      //       new Date(2016, 7, 18),
      //       new Date(2016, 7, 19),
      //       new Date(2016, 7, 20),
      //       new Date(2016, 7, 21),
      //       new Date(2016, 7, 15),
      //       new Date(2016, 7, 16),
      //       new Date(2016, 7, 17),
      //       new Date(2016, 7, 18),
      //       new Date(2016, 7, 19),
      //       new Date(2016, 7, 20),
      //       new Date(2016, 7, 21)
      //     ],
      //     'count|+1': [6, 8, 9, 3, 9, 3, 9, 6, 38, 19, 33, 29, 33, 29, 16, 81, 91, 31, 19, 13, 19],
      //     '产品|+1': ['轻度', '轻度', '轻度', '轻度', '轻度', '轻度', '轻度', '中度', '中度', '中度', '中度', '中度', '中度', '中度',
      //     '重度', '重度', '重度', '重度', '重度', '重度', '重度']
      //   }]
      // }).list
    },

    methods: {
      currentPageChange (number) {
        this.currentPage = number
        this.getList()
      },
      pageCountUpdate (count) {
        this.countPerPage = count
        this.getList()
      },
      // 获取告警概览@author weijie
      getSummary () {
        var todayBeginTime = new Date().getTime() - 1 * 24 * 3600 * 1000
        todayBeginTime = dateFormat('yyyy-MM-dd', new Date(todayBeginTime))
        var weekBeginTime = new Date().getTime() - 7 * 24 * 3600 * 1000
        weekBeginTime = dateFormat('yyyy-MM-dd', new Date(weekBeginTime))
        var monthBeginTime = new Date().getTime() - 30 * 24 * 3600 * 1000
        monthBeginTime = dateFormat('yyyy-MM-dd', new Date(monthBeginTime))
        var now = new Date().getTime()
        now = dateFormat('yyyy-MM-dd', new Date(now))
        // 获取当天数据
        api.statistics.getAlertSummary(todayBeginTime, now).then((res) => {
          if (res.status === 200) {
            this.alertSummary.unhandle.total = res.data.unread
            this.alertSummary.message.total = res.data.message
          }
        }).catch((res) => {
          this.handleError(res)
        })
        // 获取7天数据
        api.statistics.getAlertSummary(weekBeginTime, now).then((res) => {
          if (res.status === 200) {
            this.alertSummary.sevenday.total = res.data.message
          }
        }).catch((res) => {
          this.handleError(res)
        })
        // 获取30天数据
        api.statistics.getAlertSummary(monthBeginTime, now).then((res) => {
          if (res.status === 200) {
            this.alertSummary.thirtyday.total = res.data.message
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      // 获取消息列表@author weijie
      getList () {
        this.loadingData = true
        api.alert.getAlerts(this.queryCondition).then((res) => {
          if (res.status === 200) {
            this.total = res.data.count
            // console.log(res.data.list)
            // this.alerts = res.data.list
            this.records = res.data.list.map((item) => {
              // 计算已读告警持续时间
              if (item.is_read) {
                let beginTime = new Date(formatDate(item.create_date))
                let endTime = new Date(formatDate(item.read_time))
                let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
                // console.log(lasting.toFixed(1))
                item.lasting = lasting.toFixed(1)
              } else {
                // 计算未读告警持续时间
                let beginTime = new Date(formatDate(item.create_date))
                let endTime = new Date()
                let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
                // console.log(lasting.toFixed(1))
                item.lasting = lasting.toFixed(1)
              }
              return item
            })
          }
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      // 获取告警趋势图表数据
      getTagTrend () {
        var begin
        var end
        if (this.period === '') {
          var startTimePick = uniformDate(this.startTimePick)
          var endTimePick = uniformDate(this.endTimePick)
          begin = startTimePick
          end = endTimePick
        } else {
          begin = this.beginTime
          end = this.endTime
        }
        // 获取标签'轻微'的趋势
        api.alert.getTagTrend(this.$route.params.id, '轻微', begin, end).then((res) => {
          if (res.status === 200) {
            this.light = res.data
            this.pushArr(this.light)
          }
        }).catch((res) => {
          this.handleError(res)
        })

        // 获取标签'通知'的趋势
        api.alert.getTagTrend(this.$route.params.id, '通知', begin, end).then((res) => {
          if (res.status === 200) {
            this.normal = res.data
            this.pushArr(this.normal)
          }
        }).catch((res) => {
          this.handleError(res)
        })

        // 获取标签'严重'的趋势
        api.alert.getTagTrend(this.$route.params.id, '严重', begin, end).then((res) => {
          if (res.status === 200) {
            this.serious = res.data
            this.pushArr(this.serious)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      // 处理标签数据
      pushArr (arr) {
        var rearr = []
        arr.data.forEach((item) => {
          var i = 0
          var sum = 0
          while (i < item.hours.length) {
            sum += item.hours[i].message
            i++
          }
          rearr.push({
            day: item.day,
            data: sum,
            product: item.name
          })
        })
        this.trendData = rearr
        // arr.data.forEach((item) => {
        //   var dayTotal = 0
        //   item.hours.forEach((message) => {
        //     dayTotal = dayTotal + message.message
        //   })
        //   this.trendData.push({
        //     day: item.day,
        //     data: dayTotal,
        //     product: item.name
        //   })
        // })
      },
      getSpecial (start, end) {
        this.period = ''
        this.startTimePick = start
        this.endTimePick = end
        this.getTagTrend()
        this.getList()
      },
      getAll () {
        this.getTagTrend()
        this.getList()
      },
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
            // this.alerts = res.data.list
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
  .bt
    border-top 1px solid #d9d9d9
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
