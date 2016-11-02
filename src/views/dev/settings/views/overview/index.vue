<template>
  <div class="panel">
    <div class="panel-bd ml20 customize-overview">
      <validator name="validation">
        <form autocomplete="off" novalidate @submit.prevent="onSubmit" class="form">
          <div class="form-row row">
            <div class="form-control col-4">
              <label class="middle-word">选择产品:</label>
            </div>
            <div class="controls col-20">
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
            <div class="form-control col-4">
              <label class="middle-word">数据指标配置:</label>
            </div>
            <div class="controls col-20">
              <div class="radio-button-wrap">
                <radio-button-group :items="quotasInfo" color="red" :value.sync="selectedQuota" @select="quotaSelect"></radio-button-group>
              </div>
              <div class="quotas-detail mt30">
                <div class="{{ arrowClass }}"></div>
                <div class="arrow-cover"></div>
                <div class="content">
                  <div class="form-row row">
                    <div class="form-control col-4">
                      <label>数据来源:</label>
                    </div>
                    <div class="controls col-20">
                      <radio-button-group :items="dataFromInfo" :value.sync="curQuotaData.dataFrom" @select="dataFromSelect"></radio-button-group>
                    </div>
                  </div>
                  <div class="form-row row">
                    <div class="form-control col-4">
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
                    <div class="form-control col-4">
                      <label>绑定数据项:</label>
                    </div>
                    <div class="controls col-20">
                      <div class="input-radio-wrap">
                        <input v-model="curQuotaData.dataBind" type="radio" :value="1" name="bind-data"/>
                        <label>授权数</label>
                        <input v-model="curQuotaData.dataBind" type="radio" :value="2" name="bind-data"/>
                        <label>用户数</label>
                        <input v-model="curQuotaData.dataBind" type="radio" :value="3" name="bind-data"/>
                        <label>激活数</label>
                        <input v-model="curQuotaData.dataBind" type="radio" :value="4" name="bind-data"/>
                        <label>用户在线数</label>
                        <input v-model="curQuotaData.dataBind" type="radio" :value="5" name="bind-data"/>
                        <label>设备在线数</label>
                      </div>
                    </div>
                  </div>
                  <template v-if="curQuotaData.dataFrom === 1">
                    <div class="form-row row">
                      <div class="form-control col-4">
                        <label>数据规则:</label>
                      </div>
                      <div class="control col-6">
                        <x-select width="120px" :label="selectedRule.name" :size="selectSize">
                          <select v-model="selectedRule" @change="toggleSelectedRule">
                            <option v-for="option in statisticsRules" :value="option">{{ option.name }}</option>
                          </select>
                        </x-select>
                      </div>
                      <div class="form-control col-4">
                        <label>数据端点:</label>
                      </div>
                      <div class="control col-6">
                        <x-select width="100px" :label="selectedDatapoint.name" :size="selectSize">
                          <select v-model="selectedDatapoint" @change="">
                            <option v-for="option in datapointOptions" :value="option">{{ option.name }}</option>
                          </select>
                        </x-select>
                      </div>
                    </div>
                    <div v-if="selectedRule.fineness && selectedRule.fineness.length" class="form-row row">
                      <div class="form-control col-4">
                        <label>数据计算:</label>
                      </div>
                      <div class="controls col-20">
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
                      <div class="form-control col-4">
                        <label>计算周期:</label>
                      </div>
                      <div class="controls col-20">
                        <div class="input-radio-wrap">
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="1" name="statistic-period"/>
                          <label>24小时</label>
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="2" name="statistic-period"/>
                          <label>7日</label>
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="3" name="statistic-period"/>
                          <label>30日</label>
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="4" name="statistic-period"/>
                          <label>至今</label>
                          <input v-model="curQuotaData.statisticPeriod" type="radio" :value="5" name="statistic-period"/>
                          <label>自定义时间</label>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div v-if="releasedProduct.length" class="form-row row">
            <div class="form-control col-4">
              <label class="middle-word">功能模块:</label>
            </div>
            <div class="controls col-20">
              <div class="form-row row">
                <div class="form-control col-4">
                  <label>产品趋势:</label>
                </div>
                <div class="controls col-20">
                  <div class="input-radio-wrap">
                    <input v-model="features.trend" type="radio" :value="1" name="trend"/>
                    <label>显示</label>
                    <input v-model="features.trend" type="radio" :value="2" name="trend"/>
                    <label>隐藏</label>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <div class="form-control col-4">
                  <label>产品活跃度:</label>
                </div>
                <div class="controls col-20">
                  <div class="input-radio-wrap">
                    <input v-model="features.active" type="radio" :value="1" name="active"/>
                    <label>显示</label>
                    <input v-model="features.active" type="radio" :value="2" name="active"/>
                    <label>隐藏</label>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <div class="form-control col-4">
                  <label>产品分布:</label>
                </div>
                <div class="controls col-20">
                  <div class="input-radio-wrap">
                    <input v-model="features.distribution" type="radio" :value="1" name="distribution"/>
                    <label>显示</label>
                    <input v-model="features.distribution" type="radio" :value="2" name="distribution"/>
                    <label>隐藏</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-actions save-config">
            <button type="submit" :disabled="saving" :class="{'disabled':saving}" v-text="saving ? $t('common.handling') : $t('common.save')" class="btn btn-primary mt20"></button>
          </div>
        </form>
      </validator>
    </div>
  </div>
</template>

<script>
import api from 'api'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Select from 'components/Select'
import { globalMixins } from 'src/mixins'
import _ from 'lodash'

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
    RadioButtonGroup
  },

  data () {
    return {
      saving: false,
      quotasInfo: QUOTAS,
      dataFromInfo: QUOTAS_TYPES,
      selectedQuota: 1,
      orginCurQuotaData: {},
      curQuotaData: {
        dataFrom: 1,
        name: '',
        dataBind: 1,
        statisticRule: 1,
        datapoint: 0,
        statisticType: 1,
        statisticPeriod: 1
      },
      features: {
        trend: 1,
        active: 1,
        distribution: 1
      },
      selectProduct: '',
      quotaData: {},
      statisticsRules: [],
      selectedRule: {
        name: '请选择快照规则'
      },
      dpMode: [],
      dataPoints: [],
      selectedDatapoint: {
        name: '请选择数据端点'
      },
      statisticsTypes: []
    }
  },
  computed: {
    arrowClass () {
      let res = 'arrow arrow-left-'
      return res + this.selectedQuota
    },
    // 快照统计规则的搜索条件
    srQueryCondition () {
      let params = {
        offset: 0,
        limit: 10000, // 取所有规则
        product_id: [this.selectProduct]
      }
      return params
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
        if (res.length) {
          this.selectedDatapoint = res[0]
        }
      }
      return res
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
        this.getCurProductStatisticRules()
        this.getCurProductDatapoints(this.selectProduct)
      }
    },
    selectedDatapoint () {
      this.datapointChange()
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
    this.orginCurQuotaData = _.clone(this.curQuotaData)
  },
  methods: {
    // 获取当前产品的数据端点
    getCurProductDatapoints (productId) {
      api.product.getDatapoints(productId).then((res) => {
        if (res.status === 200 && res.data.length) {
          this.dataPoints = res.data
        } else {
          this.dataPoints = []
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 获取当前产品的统计规则
    getCurProductStatisticRules () {
      api.snapshot.getAllStatisticRules(this.srQueryCondition).then((res) => {
        if (res.status === 200 && res.data.list && res.data.list.length) {
          this.statisticsRules = res.data.list
          this.selectedRule = this.statisticsRules[0]
          this.toggleSelectedRule(this.selectedRule)
        } else {
          this.statisticsRules = []
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    toggleSelectedRule (rule) {
      this.dpMode = this.selectedRule.dp_mode
    },
    quotaSelect (quata, oldQuata) {
      this.quotaData[oldQuata] = _.clone(this.curQuotaData)
      this.curQuotaData = _.clone(this.quotaData[quata] || this.orginCurQuotaData)
      this.$resetValidation()
    },
    dataFromSelect () {},
    onSubmit () {},
    datapointChange () {
      this.statisticsTypes = _.filter(this.dpMode, (item) => {
        return item.index === this.selectedDatapoint.index
      })
      if (this.statisticsTypes && this.statisticsTypes.length) {
        this.statisticsTypes.sort((a, b) => {
          return a.mode - b.mode
        })
        this.curQuotaData.statisticType = this.statisticsTypes[0].mode
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
    max-width 800px !important
.save-config
  border-top 1px solid default-border-color
  margin-left -30px
  button
    width 80px
    margin-left 140px
</style>
