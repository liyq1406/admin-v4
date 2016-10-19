<template>
  <div>
    <validator name="validation">
      <form autocomplete="off" novalidate>
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-3">规则名称:</label>
            <div class="controls col-21">
              <div class="input-text-wrap">
                <input v-model="name" type="text" placeholder="请输入规则名称" v-validate:name="{required: true, minlength: 2, maxlength: 30}" name="name" class="input-text input-lenght"/>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">请输入规则名称</span>
                  <span v-if="$validation.name.modified && $validation.name.minlength">规则名称不能少于2位</span>
                  <span v-if="$validation.name.modified && $validation.name.maxlength">规则名称不能大于于30位</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">快照名称:</label>
            <div class="controls col-21">
              <x-select :label="selectedSnapshot.label" width="200px">
                <select v-model="selectedSnapshot">
                  <option v-for="opt in snapshotOptions" :value="opt">{{ opt.label }}</option>
                </select>
              </x-select>
              <div class="ruletype-tips">
                <span v-show="ruleType==='instance'">(当设备产生上报动作时立即创建快照)</span>
                <span v-show="ruleType==='update'">(当设备上报的数据端点和上次的数据端点发生变化时，才会进行存储和快照，如果没有变化则不存储快照)</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">时间粒度:</label>
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
            <label class="form-control col-3">统计维度:</label>
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
          <div class="form-row row" v-if="type==='edit'">
            <div class="col-21 col-offset-3">
              <label class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/> 删除统计规则
              </label>
            </div>
          </div>
          <div class="form-actions row">
            <div class="col-21 col-offset-3">
              <button :disabled="submitting || $validation.invalid || !selectedSnapshot.id || !fineness.length || !isSelected" :class="{'disabled':submitting || $validation.invalid || !selectedSnapshot.id || !fineness.length || !isSelected}" class="btn btn-primary" @click.prevent="onSubmit">{{ $t('common.ok') }}</button>
            </div>
          </div>
        </div>
      </form>
    </validation>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import store from 'store'
import Select from 'components/Select'
import Pager from 'components/Pager'
import api from 'api'
import proxy from './restful-proxy'
import _ from 'lodash'

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

  store,

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
      fineness: [],
      selectedSnapshot: {
        id: 0,
        label: '请选择快照'
      },
      name: '', // 规则名称
      submitting: false,
      currentPage: 1,
      countPerPage: 10,
      delChecked: false,
      loadingData: false,
      ruleType: 'timer',
      snapshotsRules: [],
      datapoints: [],
      curSelect: 0 // 为触发computer 无意义
    }
  },

  computed: {
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
      if (this.selectedSnapshot.productId) {
        this.getDatapoints()
      } else {
        this.datapoints = []
      }
    },
    products () {
      this.getSnapshotRules()
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
      this.products.forEach((product) => {
        proxy.getRules(product.id).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            res.data.list = _.filter(res.data.list, (item) => {
              return item.rule === 1 || item.rule === 2
            })
            res.data.list.forEach((item) => {
              item.productId = product.id
            })
            this.snapshotsRules = this.snapshotsRules.concat(res.data.list)
          }
        }).catch((res) => {
          this.handleError(res)
        })
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

          if (this.type === 'edit') {
            this.getRule()
          }
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
      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      if (this.submitting) return

      let model = {
        dp_mode: this.getDpMode(),
        fineness: this.getFineness(),
        name: this.name,
        describe: this.name,
        type: 1
      }

      console.log(model)
      let process

      this.submitting = true
      if (this.type === 'add') { // 添加
        process = api.snapshot.ceateStatisticRules(this.selectedSnapshot.productId, this.selectedSnapshot.id, model)
      } else {
        if (this.delChecked) { // 删除
          process = api.snapshot.delStatisticRules(this.selectedSnapshot.productId, this.selectedSnapshot.id, '')
        } else {
          model._id = this.$route.params.rule_id
          process = api.snapshot.editStatisticRule(this.selectedSnapshot.productId, this.selectedSnapshot.id, '', model)
        }
      }
      process.then((res) => {
        this.submitting = false
        if (res.status === 200) {
          this.$route.router.replace('/dev/data/snapshots')
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
@import '../../../../assets/stylus/common'

.form
  max-width 800px
  .input-lenght
    width 200px
  .rule-type-item
    display inline-block
  .ruletype-tips
    color #999
.fineness-select
  display inline-block
  line-height 32px
.mutiple-select
  input, label
    vertical-align middle
  label
    margin-right 10px
</style>
