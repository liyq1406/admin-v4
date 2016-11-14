<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="row">
        <div class="col-16 alert-max form">
          <validator name="validation">
            <form autocomplete="off" novalidate @submit.prevent="onSubmit">
              <div class="form-row row">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.fields.name") }}:</label>
                <div class="controls col-19">
                  <div v-placeholder="$t('ui.rule.placeholders.name')" class="input-text-wrap">
                    <input class="input-text" type="text" name="model.name" v-model="model.name" v-validate:name="{required: true, minlength: 2, maxlength: 32, format: 'trim'}" lazy/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: $t('ui.rule.fields.name')}) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.minlength">{{ $t('common.validation.minlength', [$t('ui.rule.fields.name'), 2]) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('common.validation.maxlength', [$t('ui.rule.fields.name'), 32]) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.format">{{ $t('ui.rule.fields.name') }}不允许前后带空格</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.condition") }}:</label>
                <!-- <div class="controls col-19">
                  <div class="row">
                    <div class="col-5">
                      <x-select :label="locales.data.RULE_TYPES[model.type-1]">
                        <select v-model="model.type" name="type" number @input="onTypeSelect">
                          <option v-for="type in locales.data.RULE_TYPES" :value="$index+1" :selected="$index===0">{{ type }}</option>
                        </select>
                      </x-select>
                    </div>
                    <div class="col-19" v-show="model.type === 1 && !datapoints.length">
                      <a class="control-text ml20 hl-red">无数据端点，请点击添加</a>
                    </div>
                    <div class="col-8">
                      <div v-show="model.type === 1 && datapoints.length" class="ml10">
                        <div class="select">
                          <x-select :label="datapointName">
                            <select v-model="model.param" name="param">
                              <option v-for="option in datapoints" :value="option.id">{{ option.name }}</option>
                            </select>
                          </x-select>
                        </div>
                      </div>
                    </div>
                    <div class="col-6">
                      <div v-show="model.type === 1 && datapoints.length" class="ml10">
                        <div class="select">
                          <x-select :label="locales.data.RULE_COMPARE_TYPES[model.compare-1]">
                            <select v-model="model.compare" name="compare" number>
                              <option v-for="type in locales.data.RULE_COMPARE_TYPES" :value="$index+1" :selected="$index===0">{{ type }}</option>
                            </select>
                          </x-select>
                        </div>
                      </div>
                    </div>
                    <div class="col-5">
                      <div class="ml10">
                        <div class="input-text-wrap" v-show="model.type === 1 && datapoints.length">
                          <input v-model="value1" type="text"
                         name="value" required lazy class="input-text"/>
                        </div>
                        <div class="select" v-show="model.type === 2">
                          <x-select :label="$t('common.'+value2)">
                            <select v-model="value2"
                             name="value">
                              <option value="online">{{ $t("common.online") }}</option>
                              <option value="offline">{{ $t("common.offline") }}</option>
                            </select>
                          </x-select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> -->
                <div class="controls col-19">
                  <div class="radio-button-wrap">
                    <radio-button-group :items="ruleTypes"
                                         color="red"
                                   :value.sync="selectedType"
                                       @select="">
                    </radio-button-group>
                  </div>
                  <div class="quotas-detail mt30">
                    <div class="{{ arrowClass }}"></div>
                    <div class="arrow-cover"></div>
                    <div class="content">
                      <div class="row" v-if="selectedType===1">
                        <div class="col-5">
                          <x-select :label="locales.data.RULE_TYPES[model.type-1]">
                            <select v-model="model.type" name="type" number @input="onTypeSelect">
                              <option v-for="type in locales.data.RULE_TYPES" :value="$index+1" :selected="$index===0">{{ type }}</option>
                            </select>
                          </x-select>
                        </div>
                        <div class="col-19" v-show="model.type === 1 && !datapoints.length">
                          <a class="control-text ml20 hl-red">无数据端点，请点击添加</a>
                        </div>
                        <div class="col-8">
                          <div v-show="model.type === 1 && datapoints.length" class="ml10">
                            <div class="select">
                              <x-select :label="datapointName">
                                <select v-model="model.param" name="param">
                                  <option v-for="option in datapoints" :value="option.id">{{ option.name }}</option>
                                </select>
                              </x-select>
                            </div>
                          </div>
                        </div>
                        <div class="col-6">
                          <div v-show="model.type === 1 && datapoints.length" class="ml10">
                            <div class="select">
                              <x-select :label="locales.data.RULE_COMPARE_TYPES[model.compare-1]">
                                <select v-model="model.compare" name="compare" number>
                                  <option v-for="type in locales.data.RULE_COMPARE_TYPES" :value="$index+1" :selected="$index===0">{{ type }}</option>
                                </select>
                              </x-select>
                            </div>
                          </div>
                        </div>
                        <div class="col-5">
                          <div class="ml10">
                            <div class="input-text-wrap" v-show="model.type === 1 && datapoints.length">
                              <input v-model="value1" type="text"
                             name="value" required lazy class="input-text"/>
                            </div>
                            <div class="select" v-show="model.type === 2">
                              <x-select :label="$t('common.'+value2)">
                                <select v-model="value2"
                                 name="value">
                                  <option value="online">{{ $t("common.online") }}</option>
                                  <option value="offline">{{ $t("common.offline") }}</option>
                                </select>
                              </x-select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row" v-if="selectedType===2">
                        <div class="col-4">
                          <div class="">
                            <div class="select">
                              <div class="input-text-wrap">
                                <span class="certime">数据端点</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-20" v-show="!datapoints.length">
                          <a class="control-text ml20 hl-red">无数据端点，请点击添加</a>
                        </div>
                        <div class="col-5">
                          <div v-show="datapoints.length" class="ml10">
                            <div class="select">
                              <x-select :label="datapointName">
                                <select v-model="model.param" name="param">
                                  <option v-for="option in datapoints" :value="option.id">{{ option.name }}</option>
                                </select>
                              </x-select>
                            </div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div v-show="datapoints.length" class="ml10">
                            <div class="select">
                              <div class="input-text-wrap">
                                <span class="certime">固定时间</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="ml10">
                            <div class="input-text-wrap" v-show="datapoints.length">
                              <input v-model="interval" placeholder="分钟" type="number"
                             name="interval" required lazy class="input-text"/>
                            </div>
                          </div>
                        </div>
                        <div class="col-5">
                          <div v-show="datapoints.length" class="ml10">
                            <div class="select">
                              <x-select :label="locales.data.RULE_COMPARE_TYPES[model.compare-1]">
                                <select v-model="model.compare" name="compare" number>
                                  <option v-for="type in locales.data.RULE_COMPARE_TYPES" :value="$index+1" :selected="$index===0">{{ type }}</option>
                                </select>
                              </x-select>
                            </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="ml10">
                            <div class="input-text-wrap" v-show="datapoints.length">
                              <input v-model="value1" type="text"
                             name="value" required lazy class="input-text"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.fields.content") }}:</label>
                <div class="controls col-19">
                  <div v-placeholder="$t('ui.rule.placeholders.content')" class="input-text-wrap">
                    <textarea class="input-text" type="text" name="model.content" v-model="model.content" v-length-tip="{max: 250, model: model.content}" v-validate:content="{required: true, maxlength: 250}" lazy></textarea>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.content.touched && $validation.content.required">{{ $t('common.validation.required', {field: $t('ui.rule.fields.content')}) }}</span>
                    <span v-if="$validation.content.modified && $validation.content.maxlength">{{ $t('common.validation.maxlength', [$t('ui.rule.fields.content'), 250]) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row tag-row">
                <label class="form-control col-5 alert-label">告警等级:</label>
                <div class="controls col-19">
                  <x-select width="120px" :label="model.tag">
                    <select v-model="model.tag">
                      <option v-for="opt in locales.data.RULE_CANDIDATE_TAGS" :value="opt">{{ opt }}</option>
                    </select>
                  </x-select>
                </div>
              </div>
              <div class="form-row row tag-row">
                <label class="form-control col-5 alert-label">通知类型:</label>
                <div class="controls col-19">
                  <x-select width="120px" :label="model.notify_type === 1 ? '通知类型' : '告警类型'">
                    <select v-model="model.notify_type">
                      <option v-for="opt in locales.data.RULE_INFORM_TYPES" :value="opt.value">{{ opt.label }}</option>
                    </select>
                  </x-select>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.fields.notify_type") }}:</label>
                <div class="controls col-19">
                  <div class="checkbox-group">
                    <template v-for="type in locales.data.RULE_NOTIFY_TYPES">
                      <label v-if="$index < 3 && $index > 0" class="checkbox">
                        <input type="checkbox" v-model="model.notify_target" name="notify_target" :value="$index+1" number v-validate:notify-target="['required']"/>{{ type }}
                      </label>
                    </template>
                  </div>
                  <template v-for="type in locales.data.RULE_NOTIFY_TYPES">
                    <div class="row" v-if="$index === 3">
                      <div class="checkbox-group col-6 mt10">
                        <label class="checkbox">
                          <input type="checkbox" v-model="model.notify_target" name="notify_target" :value="$index+1" number v-validate:notify-target="['required']"/>{{ type }}
                        </label>
                      </div>
                      <div class="col-18">
                        <div v-show="isShowApn && iOSApps.length" class="app-list mb10">
                          <div class="checkbox-group">
                            <label v-for="app in iOSApps" class="checkbox">
                              <input type="checkbox" v-model="model.notify_apps" name="notify_apps" :value="app.id" number/>{{ app.name }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row" v-if="$index === 4">
                      <div class="checkbox-group col-6 mt10">
                        <label class="checkbox">
                          <input type="checkbox" v-model="model.notify_target" name="notify_target" :value="$index+1" number v-validate:notify-target="['required']"/>{{ type }}
                        </label>
                      </div>
                      <div class="col-18">
                        <div v-show="isShowGoogle && androidApps.length" class="app-list">
                          <div class="checkbox-group">
                            <label v-for="app in androidApps" class="checkbox">
                              <input type="checkbox" v-model="model.notify_apps" name="notify_apps" :value="app.id" number/>{{ app.name }}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.notifyTarget.touched && $validation.notifyTarget.required">{{ $t('common.validation.required', {field: $t('ui.rule.fields.notify_type')}) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-5 alert-label">{{ $t("ui.rule.fields.scope") }}:</label>
                <div class="controls col-19">
                  <div class="radio-group">
                    <label v-for="type in locales.data.RULE_SCOPE_TYPES" class="radio">
                      <input type="radio" v-model="model.scope" name="model.scope" :value="$index+1" number/>{{ type }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-5 alert-label">{{ $t("common.status") }}:</label>
                <div class="controls col-19">
                  <div class="radio-group">
                    <label class="radio">
                      <input type="radio" v-model="model.is_enable" name="is_enable" :value="false"/>{{ $t("common.disabled") }}
                    </label>
                    <label class="radio">
                      <input type="radio" v-model="model.is_enable" name="is_enable" :value="true"/>{{ $t("common.enable") }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-actions mt20 row">
                <div class="col-5" v-if="type==='edit'">
                  <label class="del-check">
                    <input type="checkbox" name="del" v-model="delChecked"/>{{ $t("ui.rule.del_rule") }}
                  </label>
                </div>
                <div class="col-19" :class="{'col-offset-5':type==='add'}">
                  <button type="submit" :disabled="submitting" :class="{'disabled':submitting}"  class="btn btn-primary mt5 submit-btn">提交</button>
                </div>
              </div>
            </form>
          </validator>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'src/api'
import Select from 'components/Select'
import RadioButtonGroup from 'components/RadioButtonGroup'
import RadioGroup from 'components/RadioGroup'
import { globalMixins } from 'src/mixins'

export default {
  name: 'RuleForm',

  mixins: [globalMixins],

  components: {
    'x-select': Select,
    RadioButtonGroup,
    RadioGroup
  },

  vuex: {
    getters: {
      apps: ({ plugins }) => plugins.all
    }
  },

  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  data () {
    return {
      interval: '',
      ruleTypes: [
        { label: '普通', value: 1 },
        { label: '固定时间值', value: 2 }
      ],
      selectedType: 1,
      datapoints: [],
      originModel: {           // 添加数据模型
        product_id: this.$route.params.id,
        name: '',
        tag: '通知',
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
      model: {},
      value1: '0',
      value2: 'online',
      submitting: false,
      delChecked: false
    }
  },

  computed: {
    arrowClass () {
      let res = 'arrow arrow-left-'
      return res + this.selectedType
    },

    /**
     * 是否显示 APN推送
     * @author shengzhi
     */
    isShowApn () {
      return _.includes(this.model.notify_target, 4)
    },

    /**
     * 是否显示 Google推送
     * @author shengzhi
     */
    isShowGoogle () {
      return _.includes(this.model.notify_target, 5)
    },

    // iOS 应用
    iOSApps () {
      return _.filter(this.apps, (item) => item.type === 1)
    },

    // Android 应用
    androidApps () {
      return _.filter(this.apps, (item) => item.type === 2)
    },

    /**
     * 排除掉已删除应用的已选应用
     */
    selectedApps () {
      let result = []

      result = _.intersection(this.model.notify_apps, _.map(this.apps, 'id'))

      return result
    },

    /**
     * 数据端点名称
     * @author shengzhi
     */
    datapointName () {
      var result
      if (this.datapoints.length > 0 && typeof this.model.param !== 'undefined' && this.model.param.length > 0) {
        var datapoint = _.find(this.datapoints, (item) => {
          return item.id === this.model.param
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
    }
  },

  ready () {
    this.getDataPoint()

    if (this.type === 'add') {
      this.model = _.clone(this.originModel)
    } else {
      this.getRule()
    }
  },

  methods: {
    /**
     * 获取规则
     * @author shengzhi
     */
    getRule () {
      api.alert.getRule(this.$route.params.rule_id).then((res) => {
        if (res.status === 200) {
          this.model = res.data
          this.model.notify_target.forEach((item) => {
            item = item - 0
          })
          if (this.model.type === 1) {
            this.value1 = this.model.value
          } else if (this.model.type === 2) {
            this.value2 = this.model.value
          } else if (this.model.type === 3) {
            this.value1 = this.model.value
            this.selectedType = 2
            this.interval = this.model.interval
          }
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 处理表单提交
     * @author shengzhi
     */
    onSubmit () {
      if (this.submitting) return

      let process
      if (this.delChecked) { // 删除
        process = api.alert.deleteRule(this.model.id)
      } else {
        if (this.$validation.invalid) {
          this.$validate(true)
          return
        }
        var param = _.clone(this.model)
        if (this.selectedType === 2) {
          param.type = 3
          param.interval = this.interval - 0 || 0
        }
        if (param.type === 1 || param.type === 3) {
          param.value = this.value1
        } else if (param.type === 2) {
          param.value = this.value2
        }
        console.log(param)
        // this.model.value = this.model.type === 1 ? this.value1 : this.value2
        if (this.type === 'add') { // 添加
          process = api.alert.addRule(param)
        } else { // 编辑
          param.notify_apps = this.selectedApps
          process = api.alert.updateRule(param, this.$route.params.id)
        }
      }

      this.submitting = true
      process.then((res) => {
        if (res.status === 200) {
          this.$route.router.go('/dev/products/' + this.$route.params.id + '/alert')
        }
      }).catch((res) => {
        this.handleError(res)
        this.submitting = false
      })
    },

    /**
     * 获取数据端点
     * @author shengzhi
     */
    getDataPoint () {
      api.product.getDatapoints(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          if (!res.data.length) {
            return
          }
          this.datapoints = res.data
          if (this.type === 'add') {
            this.model.param = res.data[0].id
          }
        }
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 选择告警类型
     * @author shengzhi
     */
    onTypeSelect () {
      if (this.model.type === 1) {
        this.model.compare = 1
        this.model.value = 'online'
      } else {
        this.model.value = ''
      }
    }
  }
}
</script>

<style lang="stylus">
.certime
  display inline-block
  height 30px
  width 100%
  text-align center
  line-height 30px
  border 1px solid #d9d9d9
.radio-button-wrap
  .btn
    width 100px!important
    text-align center
.quotas-detail
  border 1px solid #DA4E37
  position relative
  .content
    padding 15px 15px 15px
  .arrow
    position absolute
    left 265px
    top -9px
    width 18px
    height 18px
    background #DA4E37
    transform rotate(45deg)
  .arrow-cover
    position absolute
    width 100%
    top 0
    left 0
    z-index 1
    height 15px
    background white
  .arrow-left-1
    left 40px
  .arrow-left-2
    left 135px
.alert-label
  line-height 32px
  padding-left 20px
  box-sizing border-box
.alert-max
  max-width 820px

.form-actions
  border-top 1px solid #DDDDDD
  padding-top 20px

  .submit-btn
    width 120px

.app-list
  border 1px solid #ddd
  padding 5px
</style>
