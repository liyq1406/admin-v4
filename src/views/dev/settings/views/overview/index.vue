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
                <radio-button-group :items="quotasInfo" color="red" :value="selectedQuota" @select="quotaSelect" :width="'80px'"></radio-button-group>
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
                      <radio-button-group :items="dataFromInfo" :value="curQuotaData.dataFrom" @select="dataFromSelect"></radio-button-group>
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
                        <label>设备总数</label>
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
          <div v-if="releasedProduct.length" class="form-row row">
            <div class="form-control col-3">
              <label class="middle-word">自定义图表:
                <i class="fa fa-question-circle" v-tooltip="customChartTooltip"></i>
              </label>
            </div>
            <div class="col-21 custom-chart">
              <div v-for="(index, chart) in customCharts" class="row form-row">
                <div class="form-control col-2">
                  <label class="input-text">添加标题:</label>
                </div>
                <div class="controls col-4">
                  <div class="input-text-wrap">
                    <input v-model="chart.title" type="text" placeholder="请输入标题" class="input-text" v-validate="{required: true}" lazy :field="'chart' + index"/>
                    <div class="form-tips form-tips-error">
                      <span v-if="$validation['chart' + index].touched && $validation['chart' + index].required">标题不能为空</span>
                    </div>
                  </div>
                </div>
                <div class="form-control col-3 ml20">
                  <label class="input-text">添加数据源:</label>
                </div>
                <div class="form-control col-4 ml10">
                  <x-select width="120px" :label="chart.data_source.first.title">
                    <select v-model="chart.data_source.first" @change="dataSourceSelect">
                      <option v-for="option in dataSourceDefaultOptions" :value="option">{{ option.title }}</option>
                    </select>
                  </x-select>
                </div>
                <div v-if="showSecond(chart.data_source.first)" class="form-control col-4 ml10">
                  <x-select width="120px" :label="chart.data_source.second.title">
                    <select v-model="chart.data_source.second" @change="dataSourceSelect">
                      <option v-for="option in dataSourceDefaultOptions" :value="option">{{ option.title }}</option>
                    </select>
                  </x-select>
                </div>
                <div v-if="showThird(chart.data_source.first, chart.data_source.second)" class="form-control col-4 ml10">
                  <x-select width="120px" :label="chart.data_source.third.title">
                    <select v-model="chart.data_source.third" @change="dataSourceSelect">
                      <option v-for="option in dataSourcePieOptions" :value="option">{{ option.title }}</option>
                    </select>
                  </x-select>
                </div>
                <div v-if="index === customCharts.length - 1" class="form-control col-1 ml10">
                  <a class="fa fa-times-circle" @click="delRow(index)"></a>
                </div>
              </div>
              <button name="button" class="btn btn-ghost" @click.prevent.stop="addRow">添加行
                <i class="fa fa-plus"></i>
              </button>
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
import config from 'consts/custom-config'

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
  vuex: {
    getters: {
      releasedProduct: ({ products }) => products.released
    }
  },

  components: {
  },

  data () {
    return {
      defaultCustomChartRow: {
        title: '',
        data_source: {
          first: {
            title: '请选择数据源'
          },
          second: {
            title: '请选择数据源'
          },
          third: {
            title: '请选择数据源'
          }
        }
      },
      customCharts: [],
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
      },
      configLoaded: {
        1: false,
        2: false,
        3: false,
        4: false
      },
      dataSourceList: [],
      customChartTooltip: '每列最多包含2个折线图或柱状图或3个扇形图'
    }
  },
  computed: {
    secondOverflow () {
      return true
    },
    arrowClass () {
      let res = 'arrow arrow-left-'
      return res + this.selectedQuota
    },
    dataSourceDefaultOptions () {
      return _.filter(this.dataSourceList, (item) => {
        return item.product_id === this.selectProduct && item.show_type === 2
      })
    },
    dataSourcePieOptions () {
      return _.filter(this.dataSourceDefaultOptions, (item) => {
        return item.chart === 1
      })
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
    this.getDataSourceList()
  },
  methods: {
    showSecond (first) {
      if (!first || !first.id) {
        return false
      }
      return true
    },
    showThird (first, second) {
      if (!first || !first.id || !second || !second.id) {
        return false
      }
      if (first.chart > 1 || second.chart > 1) {
        return false
      }
      return true
    },
    dataSourceSelect () {},
    getDataSourceList () {
      api.custom.dataSource.get().then((res) => {
        if (res) {
          this.dataSourceList = res
        } else {
          this.dataSourceList = []
        }
        this.setDefaultCustomChart()
      }).catch((res) => {
        this.handleError(res)
      })
    },
    setDefaultCustomChart () {
      if (!this.customCharts.length) {
        return
      }
      this.customCharts.forEach((item) => {
        if (item.data_source.first.id) {
          let first = _.find(this.dataSourceDefaultOptions, (ds) => {
            return ds.id === item.data_source.first.id
          })
          if (first) {
            item.data_source.first = first
          }
        }
        if (item.data_source.second.id) {
          let second = _.find(this.dataSourceDefaultOptions, (ds) => {
            return ds.id === item.data_source.second.id
          })
          if (second) {
            item.data_source.second = second
          }
        }
        if (item.data_source.third.id) {
          let third = _.find(this.dataSourceDefaultOptions, (ds) => {
            return ds.id === item.data_source.third.id
          })
          if (third) {
            item.data_source.third = third
          }
        }
      })
    },
    addRow () {
      if (this.customCharts.length >= 3) {
        return
      }
      this.customCharts.push(_.cloneDeep(this.defaultCustomChartRow))
    },
    delRow (index) {
      this.customCharts.splice(index, 1)
    },
    // 重置当前产品配置
    resetConfig () {
      for (let i in this.configLoaded) {
        // reset
        this.configLoaded[i] = false
      }
      // 设置默认
      this.initProductConfig(config.defaultValue)
      api.custom.productOverview.getCustomOverviewConfig(this.selectProduct).then((res) => {
        if (res) {
          // 配置服务器返回
          this.initProductConfig(res)
          for (let i in res.quatas) {
            if (res.quatas[i].dataFrom === config.DATAFROM.datapoint && res.quatas[i].datapoint && res.quatas[i].datapoint.statistics_type) {
              this.configLoaded[i] = true
            }
          }
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    initProductConfig (pConfig) {
      for (let i in pConfig.quatas) {
        this.quotaData[i] = {
          dataFrom: pConfig.quatas[i].dataFrom,
          name: pConfig.quatas[i].name
        }
        this.quotaData[i].statisticPeriod = 1
        this.quotaData[i].dataBind = 1
        if (pConfig.quatas[i].dataFrom === config.DATAFROM.preset) {
          this.quotaData[i].dataBind = pConfig.quatas[i].preset
        }
        if (pConfig.quatas[i].dataFrom === config.DATAFROM.datapoint && pConfig.quatas[i].datapoint) {
          this.quotaData[i].statisticPeriod = pConfig.quatas[i].datapoint.period
          this.quotaData[i].statisticType = pConfig.quatas[i].datapoint.statistics_type
          this.quotaData[i].statistics_rule_id = pConfig.quatas[i].datapoint.statistics_rule_id
          this.quotaData[i].datapoint_index = pConfig.quatas[i].datapoint.datapoint_index
        }

        if (this.quotaData[i].statisticPeriod === 5) {
          this.quotaData[i].custom_time = _.clone(pConfig.quatas[i].datapoint.custom_time)
        }
      }
      this.selectedQuota = 1
      this.features = {
        trend: pConfig.trend,
        active: pConfig.active,
        distribution: pConfig.distribution
      }
      this.curQuotaData = _.clone(this.quotaData[1])
      if (this.curQuotaData.custom_time) {
        this.initStartTime = this.curQuotaData.custom_time.start || 0
        this.initEndTime = this.curQuotaData.custom_time.end || 0
      }
      if (!pConfig.custom_chart || !pConfig.custom_chart.length) {
        this.customCharts = []
      } else {
        pConfig.custom_chart.forEach((item) => {
          let temp = _.cloneDeep(this.defaultCustomChartRow)
          temp.title = item.title
          if (item.dataSources && item.dataSources.length) {
            item.dataSources.forEach((source) => {
              let finded
              if (this.dataSourceDefaultOptions.length) {
                finded = _.find(this.dataSourceDefaultOptions, (ds) => {
                  return ds.id === source.id
                })
              }
              if (source.index === 1) {
                if (finded) {
                  temp.data_source.first = finded
                } else {
                  temp.data_source.first.id = source.id
                }
              }
              if (source.index === 2) {
                if (finded) {
                  temp.data_source.second = finded
                } else {
                  temp.data_source.second.id = source.id
                }
              }
              if (source.index === 3) {
                if (finded) {
                  temp.data_source.third = finded
                } else {
                  temp.data_source.third.id = source.id
                }
              }
            })
          }
          this.customCharts.push(temp)
        })
      }
      this.setStatisticesConfig()
      this.$nextTick(() => {
        this.$validate(true)
      })
    },
    setStatisticesConfig () {
      if (this.statisticsRulesOptions.length) {
        let orginSelectRule = this.selectedRule
        for (let i in this.quotaData) {
          if (this.quotaData[i].statistics_rule_id) { // 设置数据规则
            let selectedRule = _.find(this.statisticsRulesOptions, (item) => {
              return item.id === this.quotaData[i].statistics_rule_id
            })
            if (selectedRule) {
              this.quotaData[i].selectedRule = _.clone(selectedRule)
            }
          } else {
            this.quotaData[i].selectedRule = _.clone(this.statisticsRulesOptions[0])
          }
          if (typeof this.quotaData[i].datapoint_index === 'number') { // 设置数据端点
            this.selectedRule = this.quotaData[i].selectedRule
            let selectedDatapoint = _.find(this.datapointOptions, (item) => {
              return item.index === this.quotaData[i].datapoint_index
            })
            if (selectedDatapoint) {
              this.quotaData[i].selectedDatapoint = _.clone(selectedDatapoint)
            }
          } else {
            this.quotaData[i].selectedDatapoint = _.clone(this.datapointOptions[0])
          }
        }
        this.selectedRule = orginSelectRule
        // 设置当前
        this.curQuotaData = _.clone(this.quotaData[1])
        if (this.curQuotaData.selectedRule) {
          this.selectedRule = _.clone(this.curQuotaData.selectedRule)
        }
        if (this.curQuotaData.selectedDatapoint) {
          this.selectedDatapoint = _.clone(this.curQuotaData.selectedDatapoint)
        }
      }
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
        this.setStatisticesConfig()
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 获取当前产品的统计规则
    getCurProductStatisticRules () {
      let params = {
        offset: 0,
        limit: 10000, // 取所有规则
        product_id: [this.selectProduct],
        type: 2
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
        this.setStatisticesConfig()
      }).catch((res) => {
        this.handleError(res)
      })
    },
    setQuataSelect (key, value) {
      for (let i in this.quotaData) {
        if (this.quotaData[i]) {
          this.quotaData[i][key] = _.clone(value)
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
        this.setStatisticsTypeInit(first)
      } else {
        this.selectedDatapoint = {}
      }
    },
    setStatisticsTypeInit (first) {
      if (this.statisticsTypes.length) {
        this.curQuotaData.statisticType = this.statisticsTypes[0].mode
        if (first) {
          // this.setQuataSelect('statisticType', this.statisticsTypes[0].mode)
          for (let i in this.quotaData) {
            if (!this.configLoaded[i]) {
              this.quotaData[i].statisticType = this.statisticsTypes[0].mode
            }
          }
        }
      }
    },
    // 指标切换
    quotaSelect (quata, oldQuata) {
      this.selectedQuota = quata
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
    dataFromSelect (val) {
      this.curQuotaData.dataFrom = val
    },
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
      if (params.quatas[this.selectedQuota].datapoint) {
        params.quatas[this.selectedQuota].datapoint.datapoint_index = this.selectedDatapoint.index
        params.quatas[this.selectedQuota].datapoint.statistics_rule_id = this.selectedRule.id
        params.quatas[this.selectedQuota].datapoint.snapshot_id = this.selectedRule.snapshot_id
      }

      if (this.customCharts.length) {
        params.custom_chart = []
        let index = 0
        this.customCharts.forEach((item) => {
          let sourceIndex = 0
          let temp = {
            index: ++index,
            enable: true,
            title: item.title,
            dataSources: []
          }
          if (item.data_source.first.id) {
            temp.dataSources.push({
              index: ++sourceIndex,
              id: item.data_source.first.id
            })
          }
          if (item.data_source.second.id) {
            temp.dataSources.push({
              index: ++sourceIndex,
              id: item.data_source.second.id
            })
          }
          if (item.data_source.third.id) {
            temp.dataSources.push({
              index: ++sourceIndex,
              id: item.data_source.third.id
            })
          }
          params.custom_chart.push(temp)
        })
      }
      api.custom.productOverview.setCustomOverviewConfig(this.selectProduct, params).then((res) => {
        if (res.status === 200) {
          // 设置成功
          this.showNotice({
            type: 'success',
            content: '设置成功'
          })
        }
        this.editing = false
      }).catch((res) => {
        this.handleError(res)
        this.editing = false
      })
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
          return {}
        }
        res.datapoint = {
          statistics_rule_id: source.selectedRule.id,
          datapoint_index: source.selectedDatapoint.index,
          statistics_type: source.statisticType,
          period: source.statisticPeriod,
          fineness: Math.max.apply(Math, source.selectedRule.fineness) || 0,
          snapshot_id: source.selectedRule.snapshot_id
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
.add-btn-wrap
  margin-top 2px
  button
    background #DA4E38
.custom-row-wrap
  border 1px solid default-border-color
  padding 10px 15px 0 15px
.custom-chart
  .x-select
    .x-select-wrap
      vertical-align baseline
  .form-row
    margin-bottom 5px
</style>
