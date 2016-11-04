<template>
  <div>
    <validator name="validation">
      <form autocomplete="off" novalidate>
        <div class="form">
          <div class="form-row row">
            <label class="form-control col-3">产品:</label>
            <div class="controls col-21">
              <template v-if="type==='add'">
                <x-select :label="selectedProduct.label" width="200px">
                  <select v-model="selectedProduct">
                    <option v-for="opt in productOptions" :value="opt">{{ opt.label }}</option>
                  </select>
                </x-select>
              </template>
              <div class="control-text" v-else>{{ selectedProduct.name }}</div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">快照类型:</label>
            <div class="controls col-21">
              <div class="clearfix">
                <div class="form-control rule-type-item mr10">
                  <input v-model="ruleType" type="radio" name="rule-type" value="timer" :disabled="type==='edit'">
                  <span>定时快照</span>
                </div>
                <div class="form-control rule-type-item mr10">
                  <input v-model="ruleType" type="radio" name="rule-type" value="instance" :disabled="type==='edit'">
                  <span>即时快照</span>
                </div>
                <div class="form-control rule-type-item">
                  <input v-model="ruleType" type="radio" name="rule-type" value="update" :disabled="type==='edit'">
                  <span>变化快照</span>
                </div>
              </div>
              <div class="ruletype-tips">
                <span v-show="ruleType==='instance'">(当设备产生上报动作时立即创建快照)</span>
                <span v-show="ruleType==='update'">(当设备上报的数据端点和上次的数据端点发生变化时，才会进行存储和快照，如果没有变化则不存储快照)</span>
              </div>
            </div>
          </div>
          <div v-if="ruleType==='timer'" class="form-row row">
            <label class="form-control col-3">采集周期:</label>
            <div class="controls col-21">
              <x-select :label="interval.label" width="200px">
                <select v-model="interval">
                  <option v-for="opt in locales.data.SNAPSHOT_INTERVAL" :value="opt">{{ opt.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">快照名称:</label>
            <div class="controls col-21">
              <div class="input-text-wrap">
                <input v-model="name" type="text" placeholder="请输入快照名称" v-validate:name="{required: true, minlength: 2, maxlength: 30}" name="name" class="input-text input-lenght"/>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">请输入快照名称</span>
                  <span v-if="$validation.name.modified && $validation.name.minlength">快照名称不能少于2位</span>
                  <span v-if="$validation.name.modified && $validation.name.maxlength">快照名称不能大于于30位</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-3">快照数据:</label>
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
                        <th width="5%">选择</th>
                        <th widht="10%">索引</th>
                        <th width="30%">数据类型</th>
                        <th width="15%">单位符号</th>
                        <th width="40%">描述</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="dp in datapoints | limitBy countPerPage (currentPage-1)*countPerPage">
                        <td><input :checked="dp.selected" type="checkbox" @click="toggleSelected(dp)"/></td>
                        <td>{{dp.index}}</td>
                        <td>{{getTypeByValue(dp.type).label}}</td>
                        <td>{{dp.symbol}}</td>
                        <td>{{dp.description}}</td>
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
                <input type="checkbox" name="del" v-model="delChecked"/> 删除快照
              </label>
            </div>
          </div>
          <div class="form-actions row">
            <div class="col-21 col-offset-3">
              <button :disabled="submitting || selectedDatapoints.length === 0 || $validation.invalid" :class="{'disabled':submitting || selectedDatapoints.length === 0 || $validation.invalid}" class="btn btn-primary" @click.prevent="onSubmit">{{ $t('common.ok') }}</button>
            </div>
          </div>
        </div>
      </form>
    </validation>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Select from 'components/Select'
import Pager from 'components/Pager'
import api from 'api'
import _ from 'lodash'

export default {
  name: 'SnapshotForm',

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
      selectedProduct: {
        id: 0,
        label: '请选择产品'
      }, // 已选产品
      interval: {}, // 快照规则
      name: '', // 快照名称
      submitting: false,
      selectedDatapoints: [],
      allDatapoints: [],
      currentPage: 1,
      countPerPage: 10,
      delChecked: false,
      loadingData: false,
      ruleType: 'timer'
    }
  },

  computed: {
    // 产品选项
    productOptions () {
      let result = this.products.map((item) => {
        return {
          id: item.id,
          label: item.name
        }
      })
      result.unshift({
        id: 0,
        label: '请选择产品'
      })

      return result
    },

    // 数据端点
    datapoints () {
      let result = this.allDatapoints.map((item) => {
        item.selected = false
        this.selectedDatapoints.forEach((index) => {
          if (index === item.index) {
            item.selected = true
          }
        })
        return item
      })
      return result
    }
  },

  watch: {
    selectedProduct () {
      if (this.selectedProduct.id) {
        this.getDatapoints()
      }
    },

    products () {
      this.init()
    }
  },

  ready () {
    this.init()
  },

  methods: {
    // REVIEW 完成快照规则编辑 #shengzhi
    /**
     * 初始化
     */
    init () {
      if (this.products.length) {
        if (this.type === 'add') {
          this.selectedProduct = {
            id: 0,
            label: '请选择产品'
          }
          this.interval = this.locales.data.SNAPSHOT_INTERVAL[0]
        } else {
          this.selectedProduct = _.find(this.products, (item) => {
            return item.id === this.$route.params.product_id
          })
        }
      }
    },

    /**
     * 判断数据端点是否已选
     * @author shengzhi
     * @param {Object} datapoint 目标数据端点
     */
    isSelected (datapoint) {
      let ret = false
      this.selectedDatapoints.forEach((item) => {
        if (item === datapoint.index) {
          ret = true
        }
      })
      return ret
    },

    /**
     * 选择切换
     * @author shengzhi
     * @param {Object} datapoint 目标数据端点
     */
    toggleSelected (datapoint) {
      if (this.isSelected(datapoint)) {
        this.selectedDatapoints.$remove(datapoint.index)
      } else {
        this.selectedDatapoints.push(datapoint.index)
      }
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
     * 通过值查找类型
     * @param  {Number} type 值
     * @author shengzhi
     */
    getTypeByValue (value) {
      return _.find(this.locales.data.DATAPOINT_TYPES, (o) => {
        return o.value === value
      })
    },

    /**
     * 获取产品快照规则
     * @author shengzhi
     */
    getRule () {
      this.loadingData = true
      api.snapshot.getRule(this.$route.params.product_id, this.$route.params.rule_id).then((res) => {
        if (res.status === 200) {
          this.loadingData = false
          let interval = _.find(this.locales.data.SNAPSHOT_INTERVAL, (o) => {
            return o.value === res.data.interval
          })
          if (interval) {
            this.interval = interval
          }
          switch (res.data.rule) {
            case 1:
              this.ruleType = 'instance'
              break
            case 2:
              this.ruleType = 'update'
              break
            case 3:
              this.ruleType = 'timer'
              break
            default:
              this.ruleType = 'timer'
              break
          }
          this.name = res.data.name
          this.selectedDatapoints = res.data.datapoint || []
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },

    /**
     * 获取数据端点
     * @author shengzhi
     */
    getDatapoints () {
      this.loadingData = true
      // 获取产品数据端点列表
      api.product.getDatapoints(this.selectedProduct.id).then((res) => {
        if (res.status === 200) {
          this.loadingData = false
          this.currentPage = 1
          this.allDatapoints = res.data.sort((a, b) => {
            return a.index - b.index
          })

          if (this.type === 'edit') {
            this.getRule()
          }
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },

    /**
     * 快照规则提交
     * @author shengzhi
     */
    onSubmit () {
      if (this.submitting) return

      if (this.delChecked && !window.confirm('您确定要删除该规则?')) {
        return
      }

      let model
      let process
      if (!this.delChecked) { // 非删除
        if (this.$validation.invalid) {
          this.$validate(true)
          return
        }

        model = {
          rule: 3,
          storage: {
            expire: 0
          },
          datapoint: this.selectedDatapoints,
          name: this.name
        }

        if (this.ruleType === 'instance') {
          model.rule = 1
        } else if (this.ruleType === 'update') {
          model.rule = 2
        }

        if (model.rule === 3) {
          model.interval = this.interval.value
        }
      }

      this.submitting = true
      if (this.type === 'add') { // 添加
        process = api.snapshot.createRule(this.selectedProduct.id, model)
      } else {
        if (this.delChecked) { // 删除
          process = api.snapshot.deleteRule(this.selectedProduct.id, this.$route.params.rule_id)
        } else {
          model._id = this.$route.params.rule_id
          process = api.snapshot.updateRule(this.selectedProduct.id, model)
        }
      }
      process.then((res) => {
        this.submitting = false
        if (res.status === 200) {
          this.$route.router.replace('/dev/data/snapshots')
        }
      }).catch((res) => {
        this.submitting = false
        console.log(res.data)
        if (res.data.error.code === 4001160) {
          this.showNotice({
            type: 'error',
            content: '编辑或删除本规则前请删除相关联的统计规则'
          })
        } else {
          this.handleError(res)
        }
      })
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
</style>
