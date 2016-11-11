<template>
  <div>
    <validator name="validation">
      <form autocomplete="off" novalidate>
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-3">规则名称:</label>
            <div class="controls col-21">
              <div class="input-text-wrap">
                <input v-model="name" type="text" placeholder="请输入规则名称" v-validate:name="{required: true, minlength: 2, maxlength: 30, format: 'trim'}" name="name" class="input-text input-lenght"/>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">请输入规则名称</span>
                  <span v-if="$validation.name.modified && $validation.name.minlength">规则名称不能少于2位</span>
                  <span v-if="$validation.name.modified && $validation.name.maxlength">规则名称不能大于于30位</span>
                  <span v-if="$validation.name.modified && $validation.name.format">规则名称不能包含空格</span>
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
            <label class="form-control col-3">快照名称:</label>
            <div class="controls col-21">
              <x-select :label="selectedSnapshot.label" width="200px" :disabled="type==='edit'">
                <select v-model="selectedSnapshot" :disabled="type==='edit'">
                  <option v-for="opt in snapshotOptions" :value="opt">{{ opt.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">时间粒度:
              <i class="fa fa-question-circle" v-tooltip="'选择时间粒度，可根据所选时间，查看以该时间为粒度的数据统计分析，可多选'"></i>
            </label>
            <div class="controls col-21 fineness-select mutiple-select">
              <input v-model="fineness" type="checkbox" name="fineness" value="hour">
              <label>小时</label>
              <input v-model="fineness" type="checkbox" name="fineness" value="day">
              <label>天</label>
              <input v-model="fineness" type="checkbox" name="fineness" value="week">
              <label>周</label>
              <input v-model="fineness" type="checkbox" name="fineness" value="month">
              <label>月</label>
              <input v-model="fineness" type="checkbox" name="fineness" value="year">
              <label>年</label>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">统计维度:
              <i class="fa fa-question-circle" v-tooltip="'根据数据端点，选择统计维度，可以统计求和、平均、最大、最小，可多选'"></i>
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
                        <td><input v-model="dp.selected" @click="toggleSelected(dp)" type="checkbox" /></td>
                        <td>{{dp.index}}</td>
                        <td>{{dp.name}}</td>
                        <td class="mutiple-select">
                          <input v-model="dp.statisticsType" type="checkbox" :name="dp.index" value="avg" @click="toggleSelectedType(dp)">
                          <label>平均</label>
                          <input v-model="dp.statisticsType" type="checkbox" :name="dp.index" value="sum" @click="toggleSelectedType(dp)">
                          <label>求和</label>
                          <input v-model="dp.statisticsType" type="checkbox" :name="dp.index" value="max" @click="toggleSelectedType(dp)">
                          <label>最大</label>
                          <input v-model="dp.statisticsType" type="checkbox" :name="dp.index" value="min" @click="toggleSelectedType(dp)">
                          <label>最小</label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="data-points-footer">
                  <pager v-if="datapoints.length > countPerPage" :total="datapoints.length" :current="currentPage" :count-per-page="countPerPage" @page-update="onPageUpdate" :simple="true"></pager>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">{{ $t("common.status") }}:</label>
            <div class="controls col-21 mutiple-select">
              <div class="radio-group">
                <label class="radio">
                  <input type="radio" v-model="status" name="is_enable" :value="1"/>{{ $t("common.enable") }}
                </label>
                <label class="radio">
                  <input type="radio" v-model="status" name="is_enable" :value="2"/>{{ $t("common.disabled") }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row" v-if="type==='edit'">
            <div class="col-21 col-offset-3">
              <label class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/> 删除统计规则
              </label>
            </div>
          </div>
          <div class="form-actions row">
            <div class="col-21 col-offset-3">
              <button :disabled="submitting || $validation.invalid || (selectedSnapshot && !selectedSnapshot.id) || !fineness.length || !isSelected" :class="{'disabled':submitting || $validation.invalid || (selectedSnapshot && !selectedSnapshot.id) || !fineness.length || !isSelected}" class="btn btn-primary" @click.prevent="onSubmit">{{ $t('common.ok') }}</button>
            </div>
          </div>
        </div>
      </form>
    </validator>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Select from 'components/Select'
import Pager from 'components/Pager'
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
  year: 5
}

export default {
  name: 'StatisticRuleForm',

  mixins: [globalMixins],

  components: {
    'x-select': Select,
    Pager
  },

  vuex: {
    getters: {
      products: ({ products }) => products.all
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
      status: 1,
      statisticsRules: [],
      fineness: [],
      selectedSnapshot: {
        id: 0,
        label: '请选择快照'
      },
      name: '', // 规则名称
      description: '', // 规则描述
      submitting: false,
      currentPage: 1,
      countPerPage: 10,
      delChecked: false,
      loadingData: false,
      snapshotsRules: [],
      datapoints: [],
      curSelect: 0, // 为触发computer 无意义
      curStatisticsRules: {}
    }
  },

  computed: {
    srQueryCondition () {
      let params = {
        offset: 0,
        limit: 10000, // 取所有规则
        product_id: []
      }
      if (this.products && this.products.length) {
        this.products.forEach((item) => {
          params.product_id.push(item.id)
        })
      }
      return params
    },
    // 产品选项
    snapshotOptions () {
      let result = this.snapshotsRules.map((item) => {
        return {
          id: item.id,
          label: item.name,
          datapoint: item.datapoint,
          productId: item.productId
        }
      })
      result.unshift({
        id: 0,
        label: '请选择快照'
      })

      return result
    },
    isSelected () {
      let res = false
      for (let i = 0; i <= this.datapoints.length; i++) {
        if (this.curSelect >= 0 && this.datapoints[i] && this.datapoints[i].selected === true && this.datapoints[i].statisticsType.length) {
          res = true
          break
        }
      }
      return res
    }
  },

  watch: {
    selectedSnapshot () {
      if (this.selectedSnapshot && this.selectedSnapshot.productId) {
        this.getDatapoints()
      } else {
        this.datapoints = []
      }
    },
    products () {
      this.getSnapshotRules()
    },
    statisticsRules () {
      let cur = _.find(this.statisticsRules, (item) => {
        return item.id === this.$route.params.rule_id
      })
      this.curStatisticsRules = cur
      if (cur) {
        this.name = cur.name
        this.description = cur.describe
        this.status = cur.status
        let selected = _.find(this.snapshotOptions, (item) => {
          return item.id === cur.snapshot_id
        })
        if (selected) {
          this.selectedSnapshot = selected
        }

        this.fineness = []
        if (cur.fineness && cur.fineness.length) {
          cur.fineness.forEach((item) => {
            for (let key in SNAPSHOT_STATISTICS_FINENESS) {
              if (SNAPSHOT_STATISTICS_FINENESS[key] === item) {
                this.fineness.push(key)
              }
            }
          })
        }
        this.$nextTick(() => {
          this.$validate(true)
        })
      }
    },
    datapoints () {
      let cur = this.curStatisticsRules
      if (cur.dp_mode && cur.dp_mode.length) {
        cur.dp_mode.forEach((item) => {
          let dp = _.find(this.datapoints, (dpItem) => {
            return dpItem.index === item.index
          })
          if (dp && dp.statisticsType) {
            dp.selected = true
            for (let key in SNAPSHOT_STATISTICS_TYPES) {
              if (SNAPSHOT_STATISTICS_TYPES[key] === item.mode) {
                dp.statisticsType.push(key)
              }
            }
          }
        })
      }
    }
  },

  ready () {
    this.getSnapshotRules()
  },

  methods: {
    canBeCounted (type) {
      return (type >= 2 && type <= 5) || type === 8 || type === 9 // 可统计的数据端点类型
    },
    /**
     * 判断数据端点是否已选
     * @author shengzhi
     * @param {Object} datapoint 目标数据端点
     */
    toggleSelected (datapoint) {
      let ret = false
      if (datapoint.selected) {
        datapoint.statisticsType = []
      }
      return ret
    },
    toggleSelectedType (datapoint) {
      this.curSelect = datapoint.index
    },
    getSnapshotRules () {
      this.snapshotsRules = []
      let finished = 0
      this.products.forEach((product) => {
        api.snapshot.getRules(product.id).then((res) => {
          finished++
          if (res.status === 200 && res.data.list && res.data.list.length) {
            res.data.list = _.filter(res.data.list, (item) => {
              return item.rule === 1 || item.rule === 2
            })
            res.data.list.forEach((item) => {
              item.productId = product.id
            })
            this.snapshotsRules = this.snapshotsRules.concat(res.data.list)
          }
          if (finished === this.products.length && this.type === 'edit') {
            this.getStatisticRules()
          }
        }).catch((res) => {
          finished++
          this.handleError(res)
        })
      })
    },
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
      api.product.getDatapoints(this.selectedSnapshot.productId).then((res) => {
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
        if (this.selectedSnapshot.datapoint && this.selectedSnapshot.datapoint.length) {
          this.selectedSnapshot.datapoint.forEach((index) => {
            if (index === item.index) {
              find = true
            }
          })
        }
        if (find) {
          result.push(item)
        }
      })

      result = _.filter(result, (item) => {
        return this.canBeCounted(item.type)
      })
      result = result.map((item) => {
        item.statisticsType = []
        item.selected = false
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

      if (this.delChecked && !window.confirm('您确定要删除该规则?')) {
        return
      }

      let model = {
        dp_mode: this.getDpMode(),
        fineness: this.getFineness(),
        name: this.name,
        describe: this.description,
        type: 2,
        status: this.status
      }

      let process

      this.submitting = true
      if (this.type === 'add') { // 添加
        process = api.snapshot.ceateStatisticRules(this.selectedSnapshot.productId, this.selectedSnapshot.id, model)
      } else {
        if (this.delChecked) { // 删除
          process = api.snapshot.delStatisticRules(this.selectedSnapshot.productId, this.selectedSnapshot.id, this.$route.params.rule_id)
        } else {
          model._id = this.$route.params.rule_id
          process = api.snapshot.editStatisticRule(this.selectedSnapshot.productId, this.selectedSnapshot.id, this.$route.params.rule_id, model)
        }
      }
      process.then((res) => {
        this.submitting = false
        if (res.status === 200) {
          this.$route.router.replace('/dev/data/statistics-rule/product')
        }
      }).catch((res) => {
        this.submitting = false
        this.handleError(res)
      })
    },
    getDpMode () {
      let res = []
      this.datapoints.forEach((dp) => {
        if (dp.selected && dp.statisticsType && dp.statisticsType.length) {
          dp.statisticsType.forEach((type) => {
            res.push({
              index: dp.index,
              mode: SNAPSHOT_STATISTICS_TYPES[type]
            })
          })
        }
      })
      return res
    },
    getFineness () {
      let res = []
      this.fineness.forEach((item) => {
        res.push(SNAPSHOT_STATISTICS_FINENESS[item])
      })
      return res
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
.fineness-select
  display inline-block
  line-height 32px
.mutiple-select
  input, label
    vertical-align middle
  label
    margin-right 10px
</style>
