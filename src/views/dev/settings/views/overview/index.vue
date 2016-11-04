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
              <div v-for="product in releasedProduct" class="fl input-radio-wrap">
                <input v-model="selectProduct" type="radio" :value="product.id" name="products"/>
                <label>{{ product.name }}</label>
              </div>
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
                <radio-button-group :items="quotasInfo" color="red" :value.sync="selectedQuota" @select="quotaSelect"></radio-button-group>
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
                      <radio-button-group :items="dataFromInfo" :value.sync="curQuotaData.dataFrom" @select="dataFromSelect"></radio-button-group>
                    </div>
                  </div>
                  <div class="form-row row">
                    <div class="form-control col-3">
                      <label>指标名称:</label>
                    </div>
                    <div class="controls col-6">
                      <div class="input-text-wrap">
                        <input v-model="curQuotaData.name" type="text" placeholder="请输入指标名称" class="input-text" v-validate:name="{required: true}" lazy/>
                        <div class="form-tips form-tips-error">
                          <span v-if="$validation.name.touched && $validation.name.required">指标名称不能为空</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="curQuotaData.dataFrom !== 1" class="form-row row">
                    <div class="form-control col-3">
                      <label>绑定数据项:</label>
                    </div>
                    <div class="controls col-21">
                      <div class="input-radio-wrap">
                        <input v-model="curQuotaData.dataBind" type="radio" :value="1" name="bind-data"/>
                        <label>授权数</label>
                        <input v-model="curQuotaData.dataBind" type="radio" :value="4" name="bind-data"/>
                        <label>用户数</label>
                        <input v-model="curQuotaData.dataBind" type="radio" :value="2" name="bind-data"/>
                        <label>激活数</label>
                        <input v-model="curQuotaData.dataBind" type="radio" :value="5" name="bind-data"/>
                        <label>用户在线数</label>
                        <input v-model="curQuotaData.dataBind" type="radio" :value="3" name="bind-data"/>
                        <label>设备在线数</label>
                      </div>
                    </div>
                  </div>
                  <template v-if="curQuotaData.dataFrom === 1">
                    <div class="form-row row">
                      <div class="form-control col-3">
                        <label>数据规则:</label>
                      </div>
                      <div class="control col-6">
                        <x-select width="120px" :label="selectedRule.name" :size="selectSize">
                          <select v-model="selectedRule" @change="statisticsRuleSelect">
                            <option v-for="option in statisticsRulesOptions" :value="option">{{ option.name }}</option>
                          </select>
                        </x-select>
                      </div>
                      <div class="form-control col-3">
                        <label>数据端点:</label>
                      </div>
                      <div class="control col-6">
                        <x-select width="100px" :label="selectedDatapoint.name" :size="selectSize">
                          <select v-model="selectedDatapoint" @change="datapointSelect">
                            <option v-for="option in datapointOptions" :value="option">{{ option.name }}</option>
                          </select>
                        </x-select>
                      </div>
                    </div>
                    <div v-if="selectedRule.fineness && selectedRule.fineness.length" class="form-row row">
                      <div class="form-control col-3">
                        <label>数据计算:</label>
                      </div>
                      <div class="controls col-21">
                        <div class="input-radio-wrap">
                          <template v-for="item in statisticsTypes">
                            <template v-if="item.mode===1">
                              <input v-model="curQuotaData.statisticType" type="radio" :value="1" name="statistic-type"/>
                              <label>最大值</label>
                            </template>
                            <template v-if="item.mode===2">
                              <input v-model="curQuotaData.statisticType" type="radio" :value="2" name="statistic-type"/>
                              <label>最小值</label>
                            </template>
                            <template v-if="item.mode===3">
                              <input v-model="curQuotaData.statisticType" type="radio" :value="3" name="statistic-type"/>
                              <label>平均</label>
                            </template>
                            <template v-if="item.mode===4">
                              <input v-model="curQuotaData.statisticType" type="radio" :value="4" name="statistic-type"/>
                              <label>求和</label>
                            </template>
                          </template>
                        </div>
                      </div>
                    </div>
                    <div class="form-row row">
                      <div class="form-control col-3">
                        <label>计算周期:</label>
                      </div>
                      <div class="controls col-21">
                        <div class="input-radio-wrap fl">
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="1" name="statistic-period" @change="statisticPeriodSelect"/>
                          <label>24小时</label>
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="2" name="statistic-period" @change="statisticPeriodSelect"/>
                          <label>7日</label>
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="3" name="statistic-period" @change="statisticPeriodSelect"/>
                          <label>30日</label>
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="4" name="statistic-period" @change="statisticPeriodSelect"/>
                          <label>至今</label>
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="5" name="statistic-period" @change="statisticPeriodSelect"/>
                          <label>自定义时间</label>
                        </div>
                        <div v-if="curQuotaData.statisticPeriod === 5" class="time-range-lineheight">
                          <date-time-range-picker :init-start-time="initStartTime" :init-end-time="initEndTime" @timechange="timeSelect"></date-time-range-picker>
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
import api from 'api'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import Select from 'components/Select'
import { globalMixins } from 'src/mixins'
import _ from 'lodash'
import proxy from './proxy-api'
import config from './config'

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
    DateTimeRangePicker
  },

  data () {
    return {
      initStartTime: 0,
      initEndTime: 0,
      editing: false,
      quotasInfo: QUOTAS,
      dataFromInfo: QUOTAS_TYPES,
      selectedQuota: 1,
      curQuotaData: {
        // dataFrom: 1,
        // dataBind: 1,
        // name: '',
        // statisticPeriod: 1,
        // selectedRule: {},
        // selectedDatapoint: {},
        // statisticType: 1
      },
      features: {},
      selectProduct: '',
      quotaData: {},
      statisticsRulesOptions: [],
      selectedRule: {
        name: ''
      },
      dataPoints: [],
      selectedDatapoint: {
        name: ''
      }
    }
  },
  computed: {
    arrowClass () {
      let res = 'arrow arrow-left-'
      return res + this.selectedQuota
    },
    datapointOptions () {
      let res = []
      if (this.dataPoints && this.dataPoints.length) {
        this.dataPoints.forEach((item) => {
          let findDpMode = _.find(this.dpMode, (dp) => {
            return dp.index === item.index
          })
          if (findDpMode) {
            res.push({
              id: item.id,
              name: item.name,
              index: item.index
            })
          }
        })
      }
      return res
    },
    statisticsTypes () {
      if (typeof this.selectedDatapoint.index !== 'number' || !this.dpMode || !this.dpMode.length) {
        return
      }
      let res = _.filter(this.dpMode, (item) => {
        return item.index === this.selectedDatapoint.index
      })
      if (res && res.length) {
        res.sort((a, b) => {
          return a.mode - b.mode
        })
        //
      }
      return res || []
    },
    dpMode () {
      return this.selectedRule.dp_mode || []
    }
  },
  watch: {
    releasedProduct () {
      if (this.releasedProduct.length) {
        this.selectProduct = this.releasedProduct[0].id
      }
    },
    selectProduct () {
      if (this.selectProduct) {
        this.resetConfig()
        this.getCurProductStatisticRules()
        this.getCurProductDatapoints(this.selectProduct)
      }
    }
  },
  route: {
    data () {
      if (this.releasedProduct.length) {
        this.selectProduct = this.releasedProduct[0].id
      }
    }
  },
  ready () {
  },
  methods: {
    // 重置当前产品配置
    resetConfig () {
      let defaultQuota = config.defaultValue.quatas
      for (var i in defaultQuota) {
        this.quotaData[i] = {
          dataFrom: defaultQuota[i].dataFrom,
          name: defaultQuota[i].name,
          dataBind: defaultQuota[i].preset
        }
        this.quotaData[i].statisticPeriod = 1
      }
      this.selectedQuota = 1
      this.features = {
        trend: config.defaultValue.trend,
        active: config.defaultValue.active,
        distribution: config.defaultValue.active
      }
      this.curQuotaData = _.clone(this.quotaData[1])
      this.$nextTick(() => {
        this.$validate(true)
      })
    },
    // 获取当前产品的数据端点
    getCurProductDatapoints (productId) {
      api.product.getDatapoints(productId).then((res) => {
        if (res.status === 200 && res.data.length) {
          this.dataPoints = res.data
          this.setInitSelect(true)
        } else {
          this.dataPoints = []
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 获取当前产品的统计规则
    getCurProductStatisticRules () {
      let params = {
        offset: 0,
        limit: 10000, // 取所有规则
        product_id: [this.selectProduct]
      }
      api.snapshot.getAllStatisticRules(params).then((res) => {
        if (res.status === 200 && res.data.list && res.data.list.length) {
          this.statisticsRulesOptions = res.data.list
          this.selectedRule = this.statisticsRulesOptions[0]
          this.setInitSelect(true)
        } else {
          this.statisticsRulesOptions = []
          this.selectedRule = {}
          this.selectedDatapoint = {}
        }
        this.setQuataSelect('selectedRule', _.clone(this.selectedRule))
      }).catch((res) => {
        this.handleError(res)
      })
    },
    setQuataSelect (key, value) {
      for (let i in this.quotaData) {
        if (this.quotaData[i]) {
          this.quotaData[i][key] = value
        }
      }
    },
    // 默认选第一个数据规则和数据端点
    setInitSelect (first) {
      if (this.datapointOptions.length) {
        this.selectedDatapoint = this.datapointOptions[0]
        if (first) {
          this.setQuataSelect('selectedDatapoint', _.clone(this.selectedDatapoint))
        }
        this.$nextTick(() => {
          this.setStatisticsTypeInit(first)
        })
      } else {
        this.selectedDatapoint = {}
      }
    },
    setStatisticsTypeInit (first) {
      if (this.statisticsTypes.length) {
        this.curQuotaData.statisticType = this.statisticsTypes[0].mode
        if (first) {
          this.setQuataSelect('statisticType', this.statisticsTypes[0].mode)
        }
      }
    },
    // 指标切换
    quotaSelect (quata, oldQuata) {
      this.quotaData[oldQuata] = _.clone(this.curQuotaData)
      this.quotaData[oldQuata].selectedRule = _.clone(this.selectedRule)
      this.quotaData[oldQuata].selectedDatapoint = _.clone(this.selectedDatapoint)
      this.curQuotaData = _.clone(this.quotaData[quata])
      if (this.curQuotaData.custom_time) {
        this.initStartTime = this.curQuotaData.custom_time.start || 0
        this.initEndTime = this.curQuotaData.custom_time.end || 0
      } else {
        this.initStartTime = this.initEndTime = 0
      }
      this.selectedRule = _.clone(this.curQuotaData.selectedRule) || {}
      this.selectedDatapoint = _.clone(this.curQuotaData.selectedDatapoint) || {}
      this.$resetValidation()
    },
    dataFromSelect () {},
    onSubmit () {
      if (this.editing) {
        return
      }
      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }
      if (!this.selectProduct) {
        return
      }
      this.editing = true
      let params = _.clone(config.defaultValue)
      for (let i in this.quotaData) {
        params.quatas[i] = this.setParamsQuatasConfig(this.quotaData[i])
      }
      params.quatas[this.selectedQuota] = this.setParamsQuatasConfig(this.curQuotaData)
      params.trend = this.features.trend
      params.active = this.features.active
      params.distribution = this.features.distribution
      proxy.setCustomOverviewConfig(this.selectProduct, params)
    },
    setParamsQuatasConfig (source) {
      let res = {}
      res.dataFrom = source.dataFrom
      res.name = source.name
      if (res.dataFrom === config.DATAFROM.preset) { // 绑定预设项
        res.preset = source.dataBind
      } else if (res.dataFrom === config.DATAFROM.datapoint) { // 绑定数据规则
        if (!source.selectedRule || !source.selectedRule.id) {
          // 当前产品没有数据规则
          return
        }
        res.datapoint = {
          statistics_rule_id: source.selectedRule.id,
          datapoint_index: source.selectedDatapoint.index,
          statistics_type: source.statisticType,
          period: source.statisticPeriod
        }
        if (res.datapoint.period === config.PERIODS.custom) {
          res.datapoint.custom_time = {}
          if (source.custom_time) {
            res.datapoint.custom_time.start = source.custom_time.start || 0
            res.datapoint.custom_time.end = source.custom_time.end || 0
          } else { // 没有设置时间。默认为一周
            let curTime = new Date()
            res.datapoint.custom_time.start = curTime.getTime() - 3600 * 24 * 1000 * 6
            res.datapoint.custom_time.end = curTime.getTime()
          }
        }
      }
      return res
    },
    statisticsRuleSelect () {
      this.setInitSelect()
    },
    datapointSelect () {
      this.setStatisticsTypeInit()
    },
    timeSelect (startTime, endTime) {
      if (!this.curQuotaData.custom_time) {
        this.curQuotaData.custom_time = {}
      }
      this.curQuotaData.custom_time.start = startTime.getTime()
      this.curQuotaData.custom_time.end = endTime.getTime()
    },
    statisticPeriodSelect (value) {
      if (this.curQuotaData.statisticPeriod === 5 && this.curQuotaData.custom_time) {
        this.initStartTime = this.curQuotaData.custom_time.start || 0
        this.initEndTime = this.curQuotaData.custom_time.end || 0
      }
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
