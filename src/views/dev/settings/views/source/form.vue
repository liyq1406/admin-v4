<template>
  <div class="data-source">
    <validator name="validation">
      <form autocomplete="off" novalidate>
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-3 col-offset-1">选择产品:</label>
            <div class="controls col-20">
              <x-select :label="selectedProduct.name" width="120px">
                <select v-model="selectedProduct">
                  <option v-for="opt in products" :value="opt">{{ opt.name }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3 col-offset-1">标题:</label>
            <div class="controls col-10">
              <div class="input-text-wrap">
                <input v-model="title" type="text" placeholder="请输入标题" v-validate:name="{required: true, minlength: 2, maxlength: 30, format: 'trim'}" name="name" class="input-text input-lenght cover-fontsize"/>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">请输入标题</span>
                  <span v-if="$validation.name.modified && $validation.name.minlength">标题不能少于2位</span>
                  <span v-if="$validation.name.modified && $validation.name.maxlength">标题不能大于于30位</span>
                  <span v-if="$validation.name.modified && $validation.name.format">标题不能包含空格</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 暂时隐藏 -->
          <div v-if="false" class="form-row row">
            <label class="form-control col-3 col-offset-1">显示方式:</label>
            <div class="controls col-10">
              <div class="controls col-20">
                <x-select :label="selectedShowType.name" width="120px" @change="showTypeChange">
                  <select v-model="selectedShowType">
                    <option v-for="opt in showTypes" :value="opt">{{ opt.name }}</option>
                  </select>
                </x-select>
              </div>
            </div>
          </div>
          <template v-if="selectedShowType.value === 2">
            <div class="form-row row">
              <label class="form-control col-3 col-offset-1">图表类型:</label>
              <div class="controls col-20">
                <div class="input-radio-wrap chart-type">
                  <div class="fl mr15 pie icon" :class="{ select: chartType === 1 }" @click="chartTypeSelect(1)">
                    <i class="fa fa-pie-chart" aria-hidden="true"></i>
                  </div>
                  <!-- 暂时隐藏 -->
                  <div v-if="false" class="fl mr15 bar icon" :class="{ select: chartType === 2 }" @click="chartTypeSelect(2)">
                    <i class="fa fa-bar-chart" aria-hidden="true"></i>
                  </div>
                  <div v-if="false" class="fl line icon" :class="{ select: chartType === 3 }" @click="chartTypeSelect(3)">
                    <i class="fa fa-line-chart" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="chartType === 1" class="form-row row">
              <label class="form-control col-3 col-offset-1">扇形图分类:
                <i class="fa fa-question-circle tips-icon" v-tooltip="tipPie"></i>
              </label>
              <div class="controls col-20">
                <div v-for="(index, rule) in classifty" class="row input-text-wrap" :class="[index!==0 ? 'mt10': '']">
                  <div class="col-4 key-input">
                    <input placeholder="最小值" v-model="rule.min" type="number" class="input-text"/>
                  </div>
                  <span class="col-1 span-middle-center">-</span>
                  <div class="col-4 value-input">
                    <input placeholder="最大值" v-model="rule.max" type="number" class="input-text"/>
                  </div>
                  <div v-if="index === classifty.length-1" class="col-2">
                    <button class="btn btn-ghost add-btn ml10" @click.prevent.stop="addRule(index)">
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                  <div v-else class="col-1 del-icon ml10">
                    <i class="fa fa-times-circle" @click="delRule(index)"></i>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="selectedProduct.id" class="form-row row">
            <div class="form-control col-3 col-offset-1">
              <label>数据类型配置:</label>
            </div>
            <div class="controls col-20">
              <div class="radio-button-wrap mt5">
                <radio-button-group :items="sourceTypes" color="red" :value="sourceType" @select="onSourceTypeSelect" :label-width="'100px'"></radio-button-group>
              </div>
              <div class="quotas-detail mt20">
                <div class="{{ arrowClass }}"></div>
                <div class="arrow-cover"></div>
                <div class="content">
                  <template v-if="sourceType === 3">
                    <div class="form-row row">
                      <div class="form-control col-3">
                        <label>数据端点:</label>
                      </div>
                      <div class="control col-6">
                        <x-select width="140px" :label="selectedDatapoint.name">
                          <select v-model="selectedDatapoint" @change="">
                            <option v-for="option in datapoints" :value="option">{{ option.name }}</option>
                          </select>
                        </x-select>
                      </div>
                    </div>
                  </template>
                  <template v-if="sourceType === 1 || sourceType === 2">
                    <div class="form-row row">
                      <div class="form-control col-3">
                        <label>统计规则:</label>
                      </div>
                      <div class="control col-6">
                        <x-select width="120px" :label="selectedRule.name">
                          <select v-model="selectedRule" @change="statisticsRuleSelect">
                            <option v-for="option in statisticsRulesOptions" :value="option">{{ option.name }}</option>
                          </select>
                        </x-select>
                      </div>
                    </div>
                    <div v-if="selectedRule.fineness && selectedRule.fineness.length && selectedShowType.value === 2" class="form-row row">
                      <div class="form-control col-3">
                        <label>时间粒度:</label>
                      </div>
                      <div class="controls col-21">
                        <div class="input-radio-wrap">
                          <template v-for="item in finenessTypes">
                            <template v-if="item===1">
                              <input v-model="finenessType" type="radio" :value="1" name="fineness-type"/>
                              <label>小时</label>
                            </template>
                            <template v-if="item===2">
                              <input v-model="finenessType" type="radio" :value="2" name="fineness-type"/>
                              <label>天</label>
                            </template>
                            <template v-if="item===3">
                              <input v-model="finenessType" type="radio" :value="3" name="fineness-type"/>
                              <label>周</label>
                            </template>
                            <template v-if="item===4">
                              <input v-model="finenessType" type="radio" :value="4" name="fineness-type"/>
                              <label>月</label>
                            </template>
                            <template v-if="item===5">
                              <input v-model="finenessType" type="radio" :value="5" name="fineness-type"/>
                              <label>年</label>
                            </template>
                            <template v-if="item===6">
                              <input v-model="finenessType" type="radio" :value="6" name="fineness-type"/>
                              <label>全部</label>
                            </template>
                          </template>
                        </div>
                      </div>
                    </div>
                    <div v-if="selectedRule.id" class="form-row row">
                      <div class="form-control col-3">
                        <label>数据端点:</label>
                      </div>
                      <div class="control col-6">
                        <x-select width="120px" :label="ruleSelectedDatapoint.name">
                          <select v-model="ruleSelectedDatapoint" @change="ruleDatapointSelect">
                            <option v-for="option in ruleDatapoints" :value="option">{{ option.name }}</option>
                          </select>
                        </x-select>
                      </div>
                    </div>
                    <div v-if="selectedRule.fineness && selectedRule.fineness.length && ruleSelectedDatapoint.id" class="form-row row">
                      <div class="form-control col-3">
                        <label>统计方式:</label>
                      </div>
                      <div class="controls col-21">
                        <div class="input-radio-wrap">
                          <template v-for="item in statisticsTypes">
                            <template v-if="item.mode===1">
                              <input v-model="statisticType" type="radio" :value="1" name="statistic-type"/>
                              <label>最大值</label>
                            </template>
                            <template v-if="item.mode===2">
                              <input v-model="statisticType" type="radio" :value="2" name="statistic-type"/>
                              <label>最小值</label>
                            </template>
                            <template v-if="item.mode===3">
                              <input v-model="statisticType" type="radio" :value="3" name="statistic-type"/>
                              <label>平均</label>
                            </template>
                            <template v-if="item.mode===4">
                              <input v-model="statisticType" type="radio" :value="4" name="statistic-type"/>
                              <label>求和</label>
                            </template>
                          </template>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!(selectedShowType.value === 2 && chartType >= 2 || sourceType === 3)" class="form-row row">
            <div class="form-control col-3 col-offset-1">
              <label>计算周期:</label>
            </div>
            <div class="controls col-20">
              <div class="input-radio-wrap fl">
                <input v-model="period" type="radio" :value="1" name="period" @change=""/>
                <label>24小时</label>
                <input v-model="period" type="radio" :value="2" name="period" @change=""/>
                <label>7日</label>
                <input v-model="period" type="radio" :value="3" name="period" @change=""/>
                <label>30日</label>
                <input v-model="period" type="radio" :value="4" name="period" @change=""/>
                <label>至今</label>
                <input v-model="period" type="radio" :value="5" name="period" @change=""/>
                <label>自定义时间</label>
              </div>
              <div v-if="period === 5" class="time-range-lineheight mt5">
                <date-time-range-picker :init-start-time="initStartTime" :init-end-time="initEndTime" @timechange="timeSelect"></date-time-range-picker>
              </div>
            </div>
          </div>
          <div class="form-row row" v-if="type==='edit'">
            <div class="col-20 col-offset-3">
              <label class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/> 删除数据源
              </label>
            </div>
          </div>
          <div class="form-actions row">
            <div class="col-20 col-offset-3">
              <button :disabled="submitting" :class="{'disabled':submitting}" class="btn btn-primary" @click.prevent="onSubmit">{{ $t('common.ok') }}</button>
            </div>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import api from 'api'

export default {
  name: 'data-source-form',
  components: {
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
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
      selectedProduct: {
        name: '请选择产品'
      },
      selectedDatapoint: {
        name: '请选择数据端点'
      },
      ruleSelectedDatapoint: {
        name: '请选择数据端点'
      },
      selectedRule: {
        name: '请选择统计规则'
      },
      datapoints: [],
      statisticsRules: [],
      submitting: false,
      period: 1,
      initStartTime: 0,
      initEndTime: 0,
      sourceType: 2,
      title: '',
      statisticType: 0,
      finenessType: 0,
      classifty: [{
        min: '',
        max: ''
      }],
      chartType: 1,
      tipPie: '每一个数据范围表示扇形统计的一个分类, 不输入表示正无穷或者负无穷',
      showTypes: [
        {name: '指标', value: 1},
        {name: '自定义图表', value: 2}
      ],
      selectedShowType: {name: '自定义图表', value: 2},
      customTime: {
        start: 0,
        end: 0
      },
      originSelect: {},
      delChecked: false
    }
  },

  computed: {
    arrowClass () {
      let res = 'arrow arrow-left-'
      if (this.sourceType === 3) {
        res = res + 2
      } else {
        res = res + 1
      }
      return res
    },
    statisticsRulesOptions () {
      let type = 2 // 产品下统计规则
      if (this.selectedShowType.value === 2 && this.chartType === 1) { // 扇形图用设备统计规则
        type = 1
      }
      return _.filter(this.statisticsRules, (item) => {
        return item.type === type
      })
    },
    sourceTypes () {
      if (this.selectedShowType.value === 1) {
        return [
          { label: '产品统计规则', value: 1 }
        ]
      } else {
        return [
          { label: '设备统计规则', value: 2 },
          { label: '数据端点', value: 3 }
        ]
      }
    },
    statisticsTypes () {
      if (typeof this.ruleSelectedDatapoint.index !== 'number' || !this.dpMode || !this.dpMode.length) {
        return
      }
      let res = _.filter(this.dpMode, (item) => {
        return item.index === this.ruleSelectedDatapoint.index
      })
      if (res && res.length) {
        res.sort((a, b) => {
          return a.mode - b.mode
        })
      }
      return res || []
    },
    ruleDatapoints () {
      let res = []
      if (this.datapoints && this.datapoints.length) {
        this.datapoints.forEach((item) => {
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
    dpMode () {
      return this.selectedRule.dp_mode || []
    },
    finenessTypes () {
      if (this.selectedRule.fineness && this.selectedRule.fineness.length) {
        return this.selectedRule.fineness.sort((a, b) => {
          return a - b
        })
      } else {
        return []
      }
    }
  },

  watch: {
    selectedProduct () {
      if (this.selectedProduct.id) {
        this.resetSelect()
        this.getDatapoints()
        this.getStatisticRules()
      }
    },
    products () {
      this.setDefaultProduct()
    }
  },

  ready () {
    if (this.type === 'edit') {
      this.getConfig()
    }
  },

  methods: {
    statisticsRuleSelect () {
      this.ruleSelectedDatapoint = {
        name: '请选择数据端点'
      }
      this.statisticType = 0
      this.finenessType = 0
    },
    ruleDatapointSelect () {
      this.statisticType = 0
    },
    /**
     * 处理数据源类型选择
     */
    onSourceTypeSelect (type) {
      this.sourceType = type
    },

    getConfig () {
      api.custom.dataSource.get().then((res) => {
        if (Array.isArray(res)) {
          let origin = _.find(res, (item) => {
            return item.id === parseInt(this.$route.params.id)
          })
          this.originSelect = origin
          this.setDefaultSelect()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    setDefaultSelect () {
      this.setDefaultProduct()
      this.setDefaultDatapoint()
      this.setDefaultRule()
      this.setDefaultRuleDatapoint()
      this.title = this.originSelect.title
      this.sourceType = this.originSelect.data_from
      this.selectedShowType = _.find(this.showTypes, (item) => {
        return item.value === this.originSelect.show_type
      })
      if (this.originSelect.show_type === 2) { // 图表
        this.chartType = this.originSelect.chart
        if (this.chartType === 1) { // 饼图
          this.classifty = this.originSelect.pie_classify
        }
      }
      if (this.originSelect.period) {
        this.period = this.originSelect.period
        if (this.period === 5) {
          this.initStartTime = this.customTime.start = this.originSelect.custom_time.start || 0
          this.initEndTime = this.customTime.end = this.originSelect.custom_time.end || 0
        }
      }
      if (this.originSelect.fineness) {
        this.finenessType = this.originSelect.fineness
      }
    },
    setDefaultProduct () {
      if (!this.products.length || !this.originSelect.product_id) {
        return
      }
      let finded = _.find(this.products, (item) => {
        return item.id === this.originSelect.product_id
      })
      if (finded) {
        this.selectedProduct = finded
      }
    },
    setDefaultDatapoint () {
      if (!this.datapoints.length || !this.originSelect.dp_index || this.originSelect.data_from === 1 || this.originSelect.data_from === 2) {
        return
      }
      let finded = _.find(this.datapoints, (item) => {
        return item.index === this.originSelect.dp_index
      })
      if (finded) {
        this.selectedDatapoint = finded
      }
    },
    setDefaultRule () {
      if (!this.statisticsRules.length || !this.originSelect.rule_id) {
        return
      }
      let finded = _.find(this.statisticsRules, (item) => {
        return item.id === this.originSelect.rule_id
      })
      if (finded) {
        this.selectedRule = finded
        if (this.originSelect.rule_type) {
          this.statisticType = this.originSelect.rule_type
        }
      }
    },
    setDefaultRuleDatapoint () {
      if (!this.ruleDatapoints.length || !this.originSelect.dp_index || this.originSelect.data_from === 3) {
        return
      }
      let finded = _.find(this.ruleDatapoints, (item) => {
        return item.index === this.originSelect.dp_index
      })
      if (finded) {
        this.ruleSelectedDatapoint = finded
      }
    },
    showTypeChange () {
      if (this.selectedShowType.value === 1) {  // 指标
        this.sourceType = 2
      } else {
        this.sourceType = 1
      }
    },
    resetSelect () {
      this.selectedRule = {
        name: '请选择统计规则'
      }
      this.selectedDatapoint = this.ruleSelectedDatapoint = {
        name: '请选择数据端点'
      }
    },
    chartTypeSelect (value) {
      this.chartType = value
    },
    timeSelect (startTime, endTime) {
      this.customTime.start = startTime.getTime()
      this.customTime.end = endTime.getTime()
    },
    /**
     * 获取统计快照规则
     * @author guohao
     */
    getStatisticRules () {
      let params = {
        offset: 0,
        limit: 10000, // 取所有规则
        product_id: [this.selectedProduct.id]
        // type: 2 // 产品规则
      }
      api.snapshot.getAllStatisticRules(params).then((res) => {
        if (res.status === 200 && res.data.list && res.data.list.length) {
          res.data.list.sort((a, b) => {
            a = +new Date(a.create_time)
            b = +new Date(b.create_time)
            return a - b
          })
          this.statisticsRules = res.data.list
          this.setDefaultRule()
          this.setDefaultRuleDatapoint()
          this.setDefaultDatapoint()
        } else {
          this.statisticsRules = []
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 处理翻页
     * @param  {Number} page 目标页码
     * @author shengzhi
     */
    onPageUpdate (page) {
      this.currentPage = page
    },

    /**
     * 获取数据端点
     * @author shengzhi
     */
    getDatapoints () {
      // 获取产品数据端点列表
      api.product.getDatapoints(this.selectedProduct.id).then((res) => {
        if (res.status === 200) {
          this.currentPage = 1
          let datapoints = res.data.sort((a, b) => {
            return a.index - b.index
          })
          this.datapoints = _.filter(datapoints, (item) => {
            return this.canBeCounted(item.type)
          })
          this.setDefaultRuleDatapoint()
          this.setDefaultDatapoint()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    addRule (index) {
      if (index >= 9) {
        return
      }
      this.classifty.push({
        min: '',
        max: ''
      })
    },
    delRule (index) {
      this.classifty.splice(index, 1)
    },

    checkSummit () {
      if (this.$validation.invalid) {
        this.$validate(true)
        return false
      }
      if (this.delChecked && !window.confirm('您确定要删除该数据源么?')) {
        return false
      }

      if (!this.selectedProduct.id) {
        this.showNotice({
          type: 'error',
          content: '请选择产品'
        })
        return false
      }
      if (this.selectedShowType.value === 1) { // 指标
        if (!this.statisticCheck()) {
          return false
        }
      } else { // 图表
        if (this.sourceType === 1 || this.sourceType === 2) { // 统计规则
          if (!this.statisticCheck()) {
            return false
          }
          if (!this.finenessType) {
            this.showNotice({
              type: 'error',
              content: '请选择时间粒度'
            })
            return false
          }
        } else { // 数据端点
          if (!this.selectedDatapoint.id) {
            this.showNotice({
              type: 'error',
              content: '请选择数据端点'
            })
            return false
          }
        }
      }
      return true
    },
    statisticCheck () {
      if (!this.selectedRule.id) {
        this.showNotice({
          type: 'error',
          content: '请选择统计规则'
        })
        return false
      }
      if (!this.ruleSelectedDatapoint.id) {
        this.showNotice({
          type: 'error',
          content: '请选择数据端点'
        })
        return false
      }
      if (!this.statisticType) {
        this.showNotice({
          type: 'error',
          content: '请选择统计方式'
        })
        return false
      }
      return true
    },
    canBeCounted (type) {
      return (type >= 2 && type <= 5) || type === 8 || type === 9 // 可统计的数据端点类型
    },
    /**
     * 数据源提交
     * @author guohao
     */
    onSubmit () {
      if (this.submitting) return false

      if (!this.checkSummit()) {
        return
      }

      let model = {
        product_id: this.selectedProduct.id,
        title: this.title,
        show_type: this.selectedShowType.value
      }

      if (model.show_type === 1) { // 指标
        model.data_from = 1 // 指标只能使用统计规则
        model.rule_id = this.selectedRule.id
        model.snapshot_id = this.selectedRule.snapshot_id
        model.dp_index = this.ruleSelectedDatapoint.index
        model.fineness = Math.max.apply(Math, this.selectedRule.fineness) || 0 // 取最大值
        model.rule_type = this.statisticType
      } else { // 图表
        model.chart = this.chartType
        if (this.chartType === 1) {  // 饼图
          model.pie_classify = _.clone(this.classifty)
        }
        model.data_from = this.sourceType
        if (model.data_from === 1 || model.data_from === 2) { // 统计规则
          model.rule_id = this.selectedRule.id
          model.snapshot_id = this.selectedRule.snapshot_id
          model.dp_index = this.ruleSelectedDatapoint.index
          model.rule_type = this.statisticType
          model.fineness = this.finenessType
        } else { // 数据端点
          model.dp_index = this.selectedDatapoint.index
        }
      }

      if (!(model.show_type === 2 && this.chartType > 1 || this.sourceType === 3)) {
        model.period = this.period
        if (model.period === 5) {
          model.custom_time = {
            start: this.customTime.start,
            end: this.customTime.end
          }
        }
      }

      let process

      this.submitting = true
      if (this.type === 'add') { // 添加
        process = api.custom.dataSource.add(model)
      } else {
        if (this.delChecked) { // 删除
          process = api.custom.dataSource.del(this.$route.params.id)
        } else {
          process = api.custom.dataSource.put(this.$route.params.id, model)
        }
      }
      process.then((res) => {
        this.submitting = false
        if (res.status === 200) {
          this.$route.router.replace('/dev/settings/views/source')
        }
      }).catch((res) => {
        this.submitting = false
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../../assets/stylus/common'
.chart-type
  font-size 20px
  color #707070
  .icon
    cursor pointer
  .select
    color #1F9CDD
.radio-button-wrap
  .btn
    text-align center
.input-radio-wrap
  position relative
  line-height 30px
  display inline-block
  input, label
    vertical-align middle
  label
    margin-right 20px
.del-icon
  height 32px
  width 32px
  i
    line-height 32px !important
.data-source
  .form
    max-width 800px !important
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
        left 40px
      .arrow-left-2
        left 138px
.span-middle-center
  text-align center
  vertical-align middle
  line-height 32px
  display inline-block
.add-btn
  height 32px
  width 32px
  padding 0
.cover-fontsize
  font-size 13px !important
</style>
