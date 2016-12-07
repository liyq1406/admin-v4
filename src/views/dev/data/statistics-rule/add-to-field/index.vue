<template>
  <div class="panel">
    <div class="panel-bd">
      <validator name="validation">
        <form autocomplete="off" novalidate>
          <div class="form">
            <div class="form-row row">
              <label class="form-control col-3">规则key:</label>
              <div class="controls col-21">
                <div class="input-text-wrap">
                  <input v-model="name" type="text" placeholder="请输入规则key" v-validate:name="{required: true, minlength: 2, maxlength: 30, format: 'english'}" name="name" class="input-text input-lenght" lazy/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">请输入规则key</span>
                    <span v-if="$validation.name.modified && $validation.name.minlength">规则key不能少于2位</span>
                    <span v-if="$validation.name.modified && $validation.name.maxlength">规则key不能大于于30位</span>
                    <span v-if="$validation.name.modified && $validation.name.format">规则key必须是纯英文</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row row">
              <label class="form-control col-3">规则名称:</label>
              <div class="controls col-21">
                <div class="input-text-wrap">
                  <input v-model="label" type="text" placeholder="请输入规则名称" v-validate:label="{required: true, minlength: 2, maxlength: 30, format: 'trim'}" label="label" class="input-text input-lenght" lazy/>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.label.touched && $validation.label.required">请输入规则名称</span>
                    <span v-if="$validation.label.modified && $validation.label.minlength">规则名称不能少于2位</span>
                    <span v-if="$validation.label.modified && $validation.label.maxlength">规则名称不能大于于30位</span>
                    <span v-if="$validation.label.modified && $validation.label.format">规则名称不能包含空格</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row row">
              <label class="form-control col-3">规则描述:</label>
              <div class="controls col-19">
                <div class="input-text-wrap">
                  <textarea v-model="description" type="text" placeholder="请输入规则描述" v-validate:description="{required: true, minlength: 1, maxlength: 300, format: 'trim'}" name="description" class="input-text textarea"></textarea>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.description.touched && $validation.description.required">请输入规则描述</span>
                    <span v-if="$validation.description.modified && $validation.description.minlength">规则名称不能少于1位</span>
                    <span v-if="$validation.description.modified && $validation.description.maxlength">规则名称不能大于于300位</span>
                    <span v-if="$validation.description.modified && $validation.description.format">规则描述不能包含空格</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row row">
              <label class="form-control col-3">统计规则:
                <i class="fa fa-question-circle" v-tooltip="'快照类型必须是 变化快照 或者 即时快照'"></i>
              </label>
              <div class="controls col-21">
                <x-select :label="selectedSnapshotRule.label" width="200px">
                  <select v-model="selectedSnapshotRule" :disabled="type==='edit'">
                    <option v-for="opt in snapshotOptions" :value="opt">{{ opt.label }}</option>
                  </select>
                </x-select>
              </div>
            </div>

            <div class="form-row row">
              <label class="form-control col-3">时间粒度:
                <i class="fa fa-question-circle" v-tooltip="'选择时间粒度，可根据所选时间，查看以该时间为粒度的数据统计分析，不可多选'"></i>
              </label>
              <div class="controls col-21 fineness-select mutiple-select">
                <!-- <input v-model="fineness" type="radio" name="fineness" value="hour">
                <label>小时</label> -->
                <input v-model="fineness" type="radio" name="fineness" value="day" :disabled="canSelectFineness.indexOf(2) === -1">
                <label :class="{'disabled': canSelectFineness.indexOf(2) === -1}">天</label>
                <input v-model="fineness" type="radio" name="fineness" value="week" :disabled="canSelectFineness.indexOf(3) === -1">
                <label :class="{'disabled': canSelectFineness.indexOf(3) === -1}">周</label>
                <input v-model="fineness" type="radio" name="fineness" value="month" :disabled="canSelectFineness.indexOf(4) === -1">
                <label :class="{'disabled': canSelectFineness.indexOf(4) === -1}">月</label>
                <input v-model="fineness" type="radio" name="fineness" value="year" :disabled="canSelectFineness.indexOf(5) === -1">
                <label :class="{'disabled': canSelectFineness.indexOf(5) === -1}">年</label>
                <input v-model="fineness" type="radio" name="fineness" value="all" :disabled="canSelectFineness.indexOf(6) === -1">
                <label :class="{'disabled': canSelectFineness.indexOf(6) === -1}">全部</label>

                <span class="select-time" v-if="fineness && (fineness !== 'all')">
                  <x-select :label="timeText(fineness, selectTimeType)" width="100px" :disabled="type==='edit'">
                    <select v-model="selectTimeType" :disabled="type==='edit'">
                      <option :value="'1'">{{ timeText(fineness, '1') }}</option>
                      <option :value="'2'">{{ timeText(fineness, '2') }}</option>
                    </select>
                  </x-select>
                </span>
              </div>
            </div>

            <div class="form-row row">
              <label class="form-control col-3">统计维度:
                <i class="fa fa-question-circle" v-tooltip="'根据数据端点，选择统计维度，可以统计求和、平均、最大、最小，不可多选'"></i>
              </label>
              <div class="controls col-21">
                <div class="control-text" v-if="!loadingData && !datapoints.length"><span class="hl-gray">暂无数据</span></div>
                <div class="table-wrap" v-if="!loadingData && datapoints.length">
                  <div class="data-table with-loading">
                    <div class="icon-loading" v-show="loadingData">
                      <i class="fa fa-refresh fa-spin"></i>
                    </div>
                    <table class="table table-stripe table-bordered">
                      <thead>
                        <tr>
                          <th width="5%"></th>
                          <th widht="15%">序号</th>
                          <th widht="30%">数据端点</th>
                          <th width="50%">统计维度</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="dp in datapoints | limitBy countPerPage (currentPage-1)*countPerPage">
                          <td><input v-model="selectedDataPoint" type="radio" name="dp.selected" :value="dp"/></td>
                          <td>{{dp.index}}</td>
                          <td>{{dp.name}}</td>
                          <td class="mutiple-select">
                            <template v-for="opt in snapshotTypeOptions">
                              <input
                              v-model="dp.statisticsType"
                              type="radio"
                              :name="dp.index"
                              :value="opt.value"
                              :disabled="!(selectedDataPoint.index === dp.index && dp.dpModes.indexOf(opt.code) >= 0)">
                              <label :class="{'disabled': !(selectedDataPoint.index === dp.index && dp.dpModes.indexOf(opt.code) >= 0)}">{{opt.label}}</label>
                            </template>

                            <!-- <input
                            v-model="dp.statisticsType"
                            type="radio"
                            :name="dp.index"
                            value="sum"
                            :disabled="selectedDataPoint.index !== dp.index && dp.dpModes.indexOf(dp.index) === -1">
                            <label :class="{'disabled': selectedDataPoint.index !== dp.index && dp.dpModes.indexOf(dp.index) === -1}">求和</label>

                            <input
                            v-model="dp.statisticsType"
                            type="radio"
                            :name="dp.index"
                            value="max"
                            :disabled="selectedDataPoint.index !== dp.index && dp.dpModes.indexOf(dp.index) === -1">
                            <label :class="{'disabled': selectedDataPoint.index !== dp.index && dp.dpModes.indexOf(dp.index) === -1}">最大</label>

                            <input
                            v-model="dp.statisticsType"
                            type="radio"
                            :name="dp.index"
                            value="min"
                            :disabled="selectedDataPoint.index !== dp.index && dp.dpModes.indexOf(dp.index) === -1">
                            <label :class="{'disabled': selectedDataPoint.index !== dp.index && dp.dpModes.indexOf(dp.index) === -1}">最小</label> -->
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="data-points-footer">
                    <pagination v-if="datapoints.length > countPerPage" :total="datapoints.length" :current="currentPage" :count-per-page="countPerPage" @page-update="onPageUpdate" :simple="true"></pagination>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions row">
              <div class="col-21 col-offset-3">
                <button :disabled="disabled" :class="{'disabled':disabled}" class="btn btn-primary" @click.prevent="onSubmit">{{ $t('common.ok') }}</button>
              </div>
            </div>
          </div>
        </form>
      </validator>
    </div>
  </div>
</template>

<script>
import api from 'api'

const SNAPSHOT_STATISTICS_TYPES = {
  max: 1,
  min: 2,
  avg: 3,
  sum: 4
}

const SNAPSHOT_STATISTICS_FINENESS = {
  hour: 1,
  day: 2,
  week: 3,
  month: 4,
  year: 5,
  all: 6
}

export default {
  name: 'addRoField',

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  data () {
    return {
      snapshotTypeOptions: [
        {
          value: 'max',
          label: '最大',
          code: 1
        },
        {
          value: 'min',
          label: '最小',
          code: 2
        },
        {
          value: 'avg',
          label: '平均',
          code: 3
        },
        {
          value: 'sum',
          label: '求和',
          code: 4
        }
      ],
      fineness: '',
      selectedSnapshotRule: {
        id: 0,
        label: '请选择快照规则'
      },
      name: '', // 规则key
      label: '', // 规则名称
      description: '', // 规则描述
      submitting: false,
      currentPage: 1,
      countPerPage: 10,
      delChecked: false,
      loadingData: false,
      snapshotsRules: [],
      statisticsRules: [],
      datapoints: [],
      curSelect: 0, // 为触发computer 无意义
      selectedDataPoint: {},
      selectTimeType: '1' // 1是当前  2是上一个
    }
  },

  computed: {
    srQueryCondition () {
      let params = {
        offset: 0,
        limit: 10000, // 取所有规则
        product_id: [],
        type: 1
      }
      if (this.products && this.products.length) {
        this.products.forEach((item) => {
          params.product_id.push(item.id)
        })
      }
      return params
    },

    canSelectFineness () {
      var result = this.selectedSnapshotRule.fineness || []
      return result
    },

    disabled () {
      return this.submitting || this.$validation.invalid || (this.selectedSnapshotRule && !this.selectedSnapshotRule.id) || !this.fineness.length || !this.selectedDataPoint.statisticsType
    },

    // 下拉框选项
    snapshotOptions () {
      var result = [
        {
          id: 0,
          label: '请选择快照规则'
        }
      ]
      this.statisticsRules.forEach((item) => {
        var option = _.clone(item)
        option.label = item.name
        result.push(option)
      })
      return result
    }
  },

  watch: {
    products () {
      if (this.products && this.products.length) {
        this.getStatisticRules()
      }
    },
    selectedSnapshotRule (val) {
      this.selectedDataPoint = {}
      this.getDatapoints()
    }
  },

  route: {
    data () {
      if (this.products && this.products.length) {
        this.getStatisticRules()
      }
    }
  },

  methods: {
    /**
     * 获取统计快照规则
     * @author guohao
     */
    getStatisticRules () {
      api.snapshot.getAllStatisticRules(this.srQueryCondition).then((res) => {
        if (res.status === 200 && res.data.list && res.data.list.length) {
          res.data.list.sort((a, b) => {
            a = +new Date(a.create_time)
            b = +new Date(b.create_time)
            return a - b
          })
          this.statisticsRules = res.data.list
        } else {
          this.statisticsRules = []
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    canBeCounted (type) {
      return (type >= 2 && type <= 5) || type === 8 || type === 9 // 可统计的数据端点类型
    },
    // getSnapshotRules () {
    //   this.snapshotsRules = []
    //   let finished = 0
    //   this.products.forEach((product) => {
    //     api.snapshot.getRules(product.id).then((res) => {
    //       finished++
    //       if (res.status === 200 && res.data.list && res.data.list.length) {
    //         res.data.list = _.filter(res.data.list, (item) => {
    //           return item.rule === 1 || item.rule === 2
    //         })
    //         res.data.list.forEach((item) => {
    //           item.productId = product.id
    //         })
    //         this.snapshotsRules = this.snapshotsRules.concat(res.data.list)
    //       }
    //     }).catch((res) => {
    //       finished++
    //       this.handleError(res)
    //     })
    //   })
    // },

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
      this.loadingData = true
      // 获取产品数据端点列表
      api.product.getDatapoints(this.selectedSnapshotRule.product_id).then((res) => {
        if (res.status === 200) {
          this.loadingData = false
          this.currentPage = 1
          let datapoints = res.data.sort((a, b) => {
            return a.index - b.index
          })

          this.datapoints = this.filterSnapshotDatapoint(datapoints)
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },

    filterSnapshotDatapoint (datapoints) {
      let result = []
      datapoints.forEach((item) => {
        let find = false
        var dpModes = []
        if (this.selectedSnapshotRule.dp_mode && this.selectedSnapshotRule.dp_mode.length) {
          this.selectedSnapshotRule.dp_mode.forEach((dpMode) => {
            if (dpMode.index === item.index) {
              find = true
              dpModes.push(dpMode.mode)
            }
          })
        }
        if (find) {
          item.dpModes = dpModes
          result.push(item)
        }
      })
      result = _.filter(result, (item) => {
        return this.canBeCounted(item.type)
      })
      result = result.map((item) => {
        item.statisticsType = ''
        return item
      })
      return result
    },

    /**
     * 快照规则提交
     * @author shengzhi
     */
    onSubmit () {
      if (this.submitting) return

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      let model = {
        name: this.name,
        label: this.label,
        hidden: true,
        sort: 1000,
        snapshot: this.selectedSnapshotRule.id,
        datapointIndex: this.selectedDataPoint.index,
        dp_mode: this.getDpMode(this.selectedDataPoint.statisticsType),
        fineness: this.getFineness(),
        describe: this.description,
        selectTimeType: this.selectTimeType
      }

      this.submitting = true
      api.custom.field.getCustomFieldConfig(this.selectedSnapshotRule.product_id).then((data) => {
        var params = data || {}
        params.base_fields = params.base_fields || []
        params.datapoints = params.datapoints || []
        params.snapshot_shuffle = params.snapshot_shuffle || []
        var keyRepeat = false
        params.snapshot_shuffle.forEach((item) => {
          if (item.name === model.name) {
            keyRepeat = true
          }
        })
        if (keyRepeat) {
          this.submitting = false
          return this.showNotice({
            type: 'error',
            content: '当前规则已存在'
          })
        }
        params.snapshot_shuffle.push(model)
        api.custom.field.setCustomFieldConfig(this.selectedSnapshotRule.product_id, params).then((data) => {
          this.submitting = false
          this.showNotice({
            type: 'success',
            content: '提交成功，可前往字段管理模块管理字段'
          })
        }).catch((res) => {
          this.submitting = false
          this.handleError(res)
        })
      }).catch((res) => {
        this.submitting = false
        this.handleError(res)
      })
    },
    getDpMode (statisticsType) {
      let res = SNAPSHOT_STATISTICS_TYPES[statisticsType]
      return res
    },
    getFineness () {
      let res = SNAPSHOT_STATISTICS_FINENESS[this.fineness]
      return res
    },
    timeText (fineness, type) {
      var result1 = {
        day: '今天',
        week: '本周',
        month: '本月',
        year: '今年'
      }
      var result2 = {
        day: '昨天',
        week: '上周',
        month: '上月',
        year: '去年'
      }
      return type === '1' ? result1[fineness] : result2[fineness]
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

.form
  max-width 800px
  .input-lenght
    width 200px
  .select-time
    margin-left 15px
    display inline-block
  .disabled
    opacity 0.3
.fineness-select
  display inline-block
  line-height 32px
.mutiple-select
  input, label
    vertical-align middle
  label
    margin-right 10px
</style>
