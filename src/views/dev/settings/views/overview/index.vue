<template>
  <div class="panel">
    <div class="panel-bd ml20 customize-overview">
      <validator name="validation">
        <form autocomplete="off" novalidate @submit.prevent="onSubmit" class="form">
          <div class="form-row row">
            <div class="form-control col-3">
              <label class="middle-word">选择产品:</label>
            </div>
            <div class="controls col-21">
              <x-radios :items="productsOption"
                          name="products"
                 :default-item="{ value: defaultProductId }"
                        @select="productChange">
              </x-radios>
              <div v-if="!releasedProduct.length" class="fl input-radio-wrap">
                <label>暂无已发布设备</label>
              </div>
            </div>
          </div>
          <div v-if="releasedProduct.length" class="form-row row">
            <div class="form-control col-3">
              <label class="middle-word">数据指标配置:</label>
            </div>
            <div class="controls col-21">
              <div class="radio-button-wrap">
                <radio-button-group :items="quotasInfo"
                                     color="red"
                               :value.sync="curQuotaIndex"
                                   @select="quotaChange">
                </radio-button-group>
              </div>
              <div class="quotas-detail mt30">
                <div class="{{ arrowClass }}"></div>
                <div class="arrow-cover"></div>
                <div class="content">
                  <div class="form-row row">
                    <div class="form-control col-3">
                      <label>数据来源:</label>
                    </div>
                    <div class="controls col-21">
                      <radio-button-group :items="dataFromInfo"
                                     :value.sync="quataData[curQuotaIndex].dataFrom"
                                         @select="dataFromChange">
                      </radio-button-group>
                    </div>
                  </div>
                  <div class="form-row row">
                    <div class="form-control col-3">
                      <label>指标名称:</label>
                    </div>
                    <div class="controls col-6">
                      <div class="input-text-wrap">
                        <input v-model="quataData[curQuotaIndex].name" type="text" placeholder="请输入指标名称" class="input-text" v-validate:name="{required: true}" lazy/>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.name.touched && $validation.name.required">指标名称不能为空</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="quataData[curQuotaIndex].dataFrom !== 1" class="form-row row">
                    <div class="form-control col-3">
                      <label>绑定数据项:</label>
                    </div>
                    <div class="controls col-21">
                      <x-radios :items="presetOption"
                                  name="preset"
                         :default-item="{ value: quataData[curQuotaIndex].preset }"
                                @select="">
                      </x-radios>
                    </div>
                  </div>
                  <template v-if="quataData[curQuotaIndex].dataFrom === 1">
                    <div class="form-row row">
                      <div class="form-control col-3">
                        <label>数据规则:</label>
                      </div>
                      <div class="control col-6">
                        <statistics-rule-options :product-id="selectProductId"
                                                     @select="statisticsRulesChange"
                                                     :default-item="{
                                                         label: quataData[curQuotaIndex].statisticsRule.name,
                                                         value: quataData[curQuotaIndex].statisticsRule.id
                                                       }">
                        </statistics-rule-options>
                      </div>
                      <div class="form-control col-3">
                        <label>数据端点:</label>
                      </div>
                      <div class="control col-6">
                        <datapoint-options :product-id="selectProductId"
                                               :filter="dpFilter"
                                               @select="datapointChange">
                          </datapoint-options>
                      </div>
                    </div>
                    <div v-if="true" class="form-row row">
                      <div class="form-control col-3">
                        <label>统计维度:</label>
                      </div>
                      <div class="controls col-21">
                        <x-radios :items="statisticsTypeOption"
                                    name="statisticsType"
                           :default-item="{ value: quataData[this.curQuotaIndex].statisticsType }"
                                  @select="">
                        </x-radios>
                      </div>
                    </div>
                    <div v-if="true" class="form-row row">
                      <div class="form-control col-3">
                        <label>时间粒度:</label>
                      </div>
                      <div class="controls col-21">
                        <x-radios :items="finenessOption"
                                    name="fineness"
                                    :default-item="{ value: quataData[this.curQuotaIndex].fineness }"
                                  @select="">
                        </x-radios>
                      </div>
                    </div>
                    <div class="form-row row">
                      <div class="form-control col-3">
                        <label>计算周期:</label>
                      </div>
                      <div class="controls col-21">
                        <div class="fl">
                          <x-radios :items="peroidOption"
                                      name="peroid"
                                      :default-item="{ value: quataData[curQuotaIndex].period }"
                                    @select="periodChange">
                          </x-radios>
                        </div>
                        <div v-if="quataData[curQuotaIndex].period === 5" class="time-range-lineheight">
                          <date-time-range-picker :init-start-time="quataData[curQuotaIndex].custom_time.start" :init-end-time="quataData[curQuotaIndex].custom_time.end" @timechange="timeSelect"></date-time-range-picker>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div v-if="releasedProduct.length" class="form-row row">
            <div class="form-control col-3">
              <label class="middle-word">功能模块:</label>
            </div>
            <div class="controls col-21">
              <div class="form-row row">
                <div class="form-control col-3">
                  <label>产品趋势:</label>
                </div>
                <div class="controls col-21">
                  <div class="input-radio-wrap">
                    <input v-model="features.trend" type="radio" :value="true" name="trend"/>
                    <label>显示</label>
                    <input v-model="features.trend" type="radio" :value="false" name="trend"/>
                    <label>隐藏</label>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <div class="form-control col-3">
                  <label>产品活跃度:</label>
                </div>
                <div class="controls col-21">
                  <div class="input-radio-wrap">
                    <input v-model="features.active" type="radio" :value="true" name="active"/>
                    <label>显示</label>
                    <input v-model="features.active" type="radio" :value="false" name="active"/>
                    <label>隐藏</label>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <div class="form-control col-3">
                  <label>产品分布:</label>
                </div>
                <div class="controls col-21">
                  <div class="input-radio-wrap">
                    <input v-model="features.distribution" type="radio" :value="true" name="distribution"/>
                    <label>显示</label>
                    <input v-model="features.distribution" type="radio" :value="false" name="distribution"/>
                    <label>隐藏</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-actions save-config">
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.save')" class="btn btn-primary mt20"></button>
          </div>
        </form>
      </validator>
    </div>
  </div>
</template>

<script>
// import api from 'api'
import RadioButtonGroup from 'components/RadioButtonGroup'
import RadioGroup from 'components/RadioGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import Select from 'components/Select'
import { globalMixins } from 'src/mixins'
import _ from 'lodash'
// import proxy from './proxy-api'
import config from 'consts/custom-config'
import XRadios from './components/x-radios'
import StatisticsRuleOptions from './components/statistics-rule-options'
import DatapointOptions from './components/datapoint-options'

var QUOTAS = [
  { label: '指标1', value: 1 },
  { label: '指标2', value: 2 },
  { label: '指标3', value: 3 },
  { label: '指标4', value: 4 }
]

var QUOTAS_TYPES = [
  { label: '数据端点', value: 1 },
  { label: '绑定预设项', value: 2 }
]

var PRESETSOPTION = [
  { label: '设备总数', value: 1 },
  { label: '用户数', value: 2 },
  { label: '激活数', value: 3 },
  { label: '用户在线数', value: 4 },
  { label: '设备在线数', value: 5 }
]

var PEROID = [
  { label: '24小时', value: 1 },
  { label: '7日', value: 2 },
  { label: '30日', value: 3 },
  { label: '至今', value: 4 },
  { label: '自定义时间', value: 5 }
]

var FINENESS = [
  { label: '小时', value: 1 },
  { label: '天', value: 2 },
  { label: '周', value: 3 },
  { label: '月', value: 4 },
  { label: '年', value: 5 }
]

var STATISTICS_TYPES = [
  { value: 1, label: '最大值' },
  { value: 2, label: '最小值' },
  { value: 3, label: '平均值' },
  { value: 4, label: '和' }
]

export default {
  name: 'custom-overview',

  mixins: [globalMixins],

  vuex: {
    getters: {
      releasedProduct: ({ products }) => products.released
    }
  },

  components: {
    'x-select': Select,
    RadioButtonGroup,
    RadioGroup,
    XRadios,
    DateTimeRangePicker,
    StatisticsRuleOptions,
    DatapointOptions
  },

  data () {
    return {
      curQuotaIndex: 1, // 当前指标索引
      initStartTime: 0,
      initEndTime: 0,
      editing: false,
      quotasInfo: QUOTAS,
      dataFromInfo: QUOTAS_TYPES,
      presetOption: PRESETSOPTION,
      peroidOption: PEROID,
      features: { // 功能模块
        trend: true,
        active: true,
        distribution: true
      },
      _features: {},
      defaultProductId: '',
      selectProductId: '',
      _quataData: {},
      quataData: {
        1: {
          dataFrom: config.DATAFROM.preset,
          name: '设备总数',
          statisticsRule: {},
          datapoint: {},
          preset: 1,
          period: 1,
          custom_time: {
            start: 0,
            end: 0
          },
          fineness: 0,
          statisticsType: 0
        },
        2: {
          dataFrom: config.DATAFROM.preset,
          name: '设备激活数',
          statisticsRule: {},
          datapoint: {},
          preset: 3,
          period: 1,
          custom_time: {
            start: 0,
            end: 0
          },
          fineness: 0,
          statisticsType: 0
        },
        3: {
          dataFrom: config.DATAFROM.preset,
          name: '设备在线数',
          statisticsRule: {},
          datapoint: {},
          preset: 5,
          period: 1,
          custom_time: {
            start: 0,
            end: 0
          },
          fineness: 0,
          statisticsType: 0
        },
        4: {
          dataFrom: config.DATAFROM.preset,
          name: '用户在线数',
          statisticsRule: {},
          datapoint: {},
          preset: 2,
          period: 1,
          custom_time: {
            start: 0,
            end: 0
          },
          fineness: 0,
          statisticsType: 0
        }
      }
    }
  },
  computed: {
    statisticsTypeOption () { // 统计维度
      let res = STATISTICS_TYPES
      let rule = this.quataData[this.curQuotaIndex].statisticsRule
      if (rule && rule.dp_mode && rule.dp_mode.length) {
        let ruleGroups = _.groupBy(rule.dp_mode, (item) => {
          return item.index
        })
        if (ruleGroups) {
          let curDp = this.quataData[this.curQuotaIndex].datapoint
          if (!curDp) {
            return []
          }
          if (ruleGroups[curDp.index]) {
            return _.filter(res, (item) => {
              return _.find(ruleGroups[curDp.index], (mode) => {
                return mode.mode === item.value
              })
            })
          }
        }
      } else {
        return []
      }
    },
    finenessOption () {
      let res = FINENESS
      let rule = this.quataData[this.curQuotaIndex].statisticsRule
      if (rule && rule.fineness && rule.fineness.length) {
        return _.filter(res, (item) => {
          return _.find(rule.fineness, (fi) => {
            return fi === item.value
          })
        })
      }
      return res
    },
    arrowClass () {
      let res = 'arrow arrow-left-'
      return res + this.curQuotaIndex
    },
    productsOption () {
      let res = []
      if (this.releasedProduct.length) {
        this.releasedProduct.forEach((item) => {
          res.push({
            value: item.id,
            label: item.name
          })
        })
      }
      return res
    },
    dpFilter () {
      let rule = this.quataData[this.curQuotaIndex].statisticsRule
      if (rule && rule.dp_mode && rule.dp_mode.length) {
        let ruleGroups = _.groupBy(rule.dp_mode, (item) => {
          return item.index
        })
        return function (dp) {
          return !!ruleGroups[dp.value]
        }
      }
      return function () { return false }
    }
  },
  watch: {
    releasedProduct () {
      this.setDefaultProduct()
    }
  },
  route: {
    data () {}
  },
  ready () {
    this.copyDefaultConfig()
    this.setDefaultProduct()
  },
  methods: {
    copyDefaultConfig () {
      this._quataData = _.cloneDeep(this.quataData)
      this._features = _.cloneDeep(this.features)
    },
    resetProductConfig () {
      this.quataData = _.cloneDeep(this._quataData)
      this.features = _.cloneDeep(this._features)
    },
    setDefaultProduct () {
      if (this.releasedProduct.length) {
        this.defaultProductId = this.selectProductId = this.productsOption[0].value
      }
    },
    onSubmit () {},
    quotaChange () {},
    dataFromChange () {},
    statisticsRulesChange (rule) {
      this.quataData[this.curQuotaIndex].statisticsRule = _.clone(rule || {})
    },
    resetStatisticsType () {
      this.quataData[this.curQuotaIndex].statisticsType = 0
    },
    resetFineness () {
      this.quataData[this.curQuotaIndex].fineness = 0
    },
    setDefaultStatisticesType () {
      if (!this.quataData[this.curQuotaIndex].statisticsType && this.statisticsTypeOption.length) {
        this.quataData[this.curQuotaIndex].statisticsType = this.statisticsTypeOption[0].value
      }
    },
    datapointChange (datapoint) {
      this.quataData[this.curQuotaIndex].datapoint = _.clone(datapoint)
    },
    periodChange (value) {
      this.quataData[this.curQuotaIndex].period = value
    },
    timeSelect (startTime, endTime) {
      this.quataData[this.curQuotaIndex].custom_time.start = startTime.getTime()
      this.quataData[this.curQuotaIndex].custom_time.end = endTime.getTime()
    },
    productChange (productId) {
      this.resetProductConfig()
      this.selectProductId = productId
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../../assets/stylus/common'
.input-radio-wrap
  position relative
  line-height 30px
  display inline-block
  input, label
    vertical-align middle
  label
    margin-right 20px
.middle-word
  font-weight 700
  font-size 13px
.radio-button-wrap
  .btn
    width 80px
    text-align center
.quotas-detail
  border 1px solid #DA4E37
  position relative
  .content
    padding 15px 20px 0px
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
    left 30px
  .arrow-left-2
    left 105px
  .arrow-left-3
    left 185px
  .arrow-left-4
    left 265px
.customize-overview
  .form
    max-width 1000px !important
.save-config
  border-top 1px solid default-border-color
  margin-left -30px
  button
    width 80px
    margin-left 140px
.time-range-lineheight
  margin-top 2px
</style>
