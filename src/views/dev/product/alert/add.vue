<template>
  <div class="main">
    <div class="main-title">
      <h2>告警管理</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel">
      <div class="panel-bd">
        <div class="row">
          <div class="col-16 alert-max form">
            <form  v-form name="addValidation" @submit.prevent="onSubmit" hook="addFormHook">
              <div class="form-row row mt20">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.fields.name") }}:</label>
                <div class="controls col-19">
                  <div v-placeholder="$t('ui.rule.placeholders.name')" class="input-text-wrap">
                    <input v-model="addModal.model.name" type="text" v-form-ctrl name="name" minlength="2" maxlength="32" lazy required class="input-text"/>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.name.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.name')}) }}</span></div>
                  <div v-if="addValidation.name.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.name')}) }}</span><span v-if="addValidation.name.$error.minlength">{{ $t('ui.validation.minlength', [$t('ui.rule.fields.name'), 2]) }}</span><span v-if="addValidation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.rule.fields.name'), 32]) }}</span></div>
                </div>
              </div>
              <div class="form-row row mt20">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.condition") }}:</label>
                <div class="controls col-19">
                  <div class="row">
                    <div class="col-5">
                      <v-select :label="ruleTypes[addModal.model.type-1]">
                        <select v-model="addModal.model.type" name="type" number @input="onSelectType">
                          <option v-for="type in ruleTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                        </select>
                      </v-select>
                    </div>
                    <div class="col-19" v-show="addModal.model.type === 1 && !datapoints.length">
                      <a class="control-text ml20 hl-red">无数据端点，请点击添加</a>
                    </div>
                    <div class="col-8">
                      <div v-show="addModal.model.type === 1 && datapoints.length" class="ml10">
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
                      <div v-show="addModal.model.type === 1 && datapoints.length" class="ml10">
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
                        <div class="input-text-wrap" v-show="addModal.model.type === 1 && datapoints.length">
                          <input v-model="addModal.value1" type="text"
                          v-form-ctrl name="value" required lazy class="input-text"/>
                        </div>
                        <div class="select" v-show="addModal.model.type === 2">
                          <v-select :label="$t('common.'+addModal.value2)">
                            <select v-model="addModal.value2"
                             v-form-ctrl name="value">
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
              <div class="form-row row mt20">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.fields.content") }}:</label>
                <div class="controls col-19">
                  <div v-placeholder="$t('ui.rule.placeholders.content')" class="input-text-wrap">
                    <textarea v-model="addModal.model.content" type="text" v-form-ctrl name="content" required lazy maxlength="250" class="input-text"></textarea>
                  </div>
                  <div v-if="addValidation.$submitted && addValidation.content.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.content.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.content')}) }}</span></div>
                  <div v-if="addValidation.content.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.content.$error.required">{{ $t('ui.validation.required', {field: $t('ui.rule.fields.content')}) }}</span><span v-if="addValidation.content.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.rule.fields.content'), 250]) }}</span></div>
                </div>
              </div>
              <div class="form-row row tag-row mt20">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.fields.tags") }}:</label>
                <div class="controls col-19">
                  <tag-input :value.sync="addModal.model.tag" :candidate="candidateTags" :editing.sync="addModal.editingTag" @adding-tag="addModal.show = true"></tag-input>
                </div>
              </div>
              <div class="form-row row mt20">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.fields.notify_type") }}:</label>
                <div class="controls col-19 mt10">
                  <div class="checkbox-group">
                    <template v-for="type in notifyTypes">
                      <label v-if="$index < 3" class="checkbox">
                        <input type="checkbox" v-model="addModal.model.notify_target" name="notify_target" :value="$index+1" number/>{{ type }}
                      </label>
                    </template>
                  </div>
                  <template v-for="type in notifyTypes">
                    <div class="row" v-if="$index === 3">
                      <div class="checkbox-group col-6 mt10">
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
                      <div class="checkbox-group col-6 mt10">
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
              <div class="form-row row mt20">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.fields.scope") }}:</label>
                <div class="controls col-19 mt10">
                  <div class="radio-group">
                    <label v-for="type in scopeTypes" class="radio">
                      <input type="radio" v-model="addModal.model.scope" name="addModal.model.scope" :value="$index+1" number/>{{ type }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-row row mt20">
                <label class="form-control col-5 alert-label">{{ $t("common.status") }}:</label>
                <div class="controls col-19 mt10">
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
              <div class="form-actions mt10">
                <button type="submit" :disabled="adding" :class="{'disabled':adding}"  class="btn btn-primary">提交</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from 'src/api'
  import Vue from 'vue'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  import locales from 'consts/locales/index'
  import Pager from 'components/Pager'
  import Breadcrumb from 'components/Breadcrumb'
  import { globalMixins } from 'src/mixins'
  import _ from 'lodash'
  import TagInput from 'components/TagInput'

  export default {
    name: 'Alert',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      TagInput,
      SearchBox,
      Pager,
      Breadcrumb
    },

    data () {
      return {
        datapoints: [],
        ruleTypes: locales[Vue.config.lang].data.RULE_TYPES,
        compareTypes: locales[Vue.config.lang].data.RULE_COMPARE_TYPES,
        informTypes: locales[Vue.config.lang].data.RULE_INFORM_TYPES,
        notifyTypes: locales[Vue.config.lang].data.RULE_NOTIFY_TYPES,
        scopeTypes: locales[Vue.config.lang].data.RULE_SCOPE_TYPES,
        candidateTags: locales[Vue.config.lang].data.RULE_CANDIDATE_TAGS,      // 候选标签
        breadcrumbNav: [{
          label: '全部',
          link: `/dev/products/${this.$route.params.id}/alert`
        }, {
          label: '添加告警规则'
        }],
        addValidation: {},
        originAddModel: {},
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
        }
      }
    },
    filters: {
    },
    route: {
      data () {
        this.getDataPoint()
      }
    },
    ready () {
    },
    methods: {
      // 添加表单钩子
      addFormHook (form) {
        this.addModal.form = form
      },
      // 是否显示 APN推送
      isShowApn (model) {
        return _.includes(model.notify_target, 4)
      },

      // 是否显示 Google推送
      isShowGoogle (model) {
        return _.includes(model.notify_target, 5)
      },
      onSubmit () {
        if (this.addValidation.$valid && !this.adding) {
          this.adding = true
          this.addModal.model.value = this.addModal.model.type === 1 ? this.addModal.value1 : this.addModal.value2
          api.alert.addRule(this.addModal.model).then((res) => {
            if (res.status === 200) {
              this.$route.router.go('/dev/products/' + this.$route.params.id + '/alert')
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      },
      getDataPoint () {
        api.product.getDatapoints(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            if (!res.data.length) {
              return
            }
            this.datapoints = res.data
            this.addModal.model.param = res.data[0].id
          }
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
        })
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
          if (datapoint !== undefined) {
            result = datapoint.name
          } else {
            result = ''
          }
        } else {
          result = ''
        }

        return result
      },
      // 选择告警类型
      onSelectType () {
        if (this.addModal.model.type === 1) {
          this.addModal.model.compare = 1
          this.addModal.model.value = 'online'
        } else {
          this.addModal.model.value = ''
        }
      }
    }
  }
</script>
<style lang='stylus' scoped>
@import '../../../../assets/stylus/partials/form'
.alert-label
  line-height 32px
  padding-left 20px
  box-sizing border-box
.alert-max
  max-width 700px
</style>
