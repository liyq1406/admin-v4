<template>
  <div>
    <div class="panel creation-step2">
      <div class="panel-body">
        <div class="filter-bar mt20">
          <div class="filter-group fr">
            <div class="filter-group-item">
              <button class="btn btn-ghost hidden" @click="showModal=true">导入数据模型</button>
            </div>
          </div>
          <h3>配置数据端点</h3>
        </div>
        <div class="data-table mb40">
          <table class="table">
            <thead>
              <tr>
                <th width="8%">索引</th>
                <th width="14%">端点 ID</th>
                <th width="27%">数据类型</th>
                <th width="8%">单位符号</th>
                <th width="20%">描述</th>
                <th width="11%">读写</th>
                <th width="12%" class="tac">操作</th>
              </tr>
            </thead>
            <tbody v-for="datapoint in datapoints">
                <tr v-if="datapoint.editing">
                  <td>{{ $index }}</td>
                  <td>
                    <div class="input-text-wrap">
                      <input type="text" class="input-text input-text-sm" maxlength="32" v-model="datapoint.name" :class="{'require-warnning': isNameError }">
                    </div>
                  </td>
                  <td>
                    <template v-if="datapoint.type === 1 || datapoint.type === 6">
                      <x-select :label="getLabelByValue(datapoint.type)" size="small">
                        <select v-model="datapoint.type" name="link_type">
                          <option v-for="type in datapointTypes" :value="type.value">{{ type.label }}</option>
                        </select>
                      </x-select>
                    </template>
                    <div class="row" v-else>
                      <div class="col-10">
                        <x-select :label="getLabelByValue(datapoint.type)" size="small">
                          <select v-model="datapoint.type" name="link_type">
                            <option v-for="type in datapointTypes" :value="type.value">{{ type.label }}</option>
                          </select>
                        </x-select>
                      </div>
                      <div class="col-7">
                        <div class="ml5">
                          <div class="input-text-wrap">
                            <input type="number" class="input-text input-text-sm" v-model="datapoint.min" placeholder="最小值" :class="{'require-warnning': isMinError }">
                          </div>
                        </div>
                      </div>
                      <div class="col-7">
                        <div class="ml5">
                          <div class="input-text-wrap">
                            <input type="number" class="input-text input-text-sm" v-model="datapoint.max" placeholder="最大值" :class="{'require-warnning': isMaxError }">
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="input-text-wrap" v-show="datapoint.type!==1">
                      <input type="text" class="input-text input-text-sm" v-model="datapoint.symbol" maxlength="10">
                    </div>
                  </td>
                  <td>
                    <div class="input-text-wrap">
                      <input type="text" class="input-text input-text-sm" v-model="datapoint.description" maxlength="250">
                    </div>
                  </td>
                  <td>
                    <x-select :label="datapoint.is_write?'可读写':'只读'" size="small">
                      <select v-model="datapoint.is_write" name="is_write">
                        <option :value="true">可读写</option>
                        <option :value="false">只读</option>
                      </select>
                    </x-select>
                  </td>
                  <td class="tac">
                    <button class="btn btn-link mr10" @click.prevent="save(datapoint)">保存</button><button class="btn btn-link" @click.prevent="cancel(datapoint, $index)">取消</button>
                  </td>
                </tr>
                <tr v-else>
                  <td>{{ datapoint.index }}</td>
                  <td>{{ datapoint.name }}</td>
                  <td>{{ getLabelByValue(datapoint.type) }}</td>
                  <td>{{ datapoint.symbol }}</td>
                  <td>{{ datapoint.description }}</td>
                  <!-- <td>{{ datapoint.is_write }}</td> -->
                  <td>
                    <span>
                      {{datapoint.is_write?'可读写':'只读'}}
                    </span>
                  </td>
                  <td class="tac">
                    <button class="btn btn-link mr10" @click.prevent="edit(datapoint)" :disabled="editing && !datapoint.editing" :class="{'disabled':editing && !datapoint.editing}">编辑</button><button class="btn btn-link" @click.prevent="remove(datapoint)" :disabled="editing && !datapoint.editing" :class="{'disabled':editing && !datapoint.editing}">删除</button>
                  </td>
              </tr>
            </tbody>
            <tbody>
              <tr v-if="adding">
                <td>{{ addModel.index }}</td>
                <td>
                  <div class="input-text-wrap">
                    <input type="text" class="input-text input-text-sm" v-model="addModel.name" :class="{'require-warnning': isNameError }" maxlength="32">
                  </div>
                </td>
                <td>
                  <template v-if="addModel.type === 1 || addModel.type === 6">
                    <x-select :label="getLabelByValue(addModel.type)" size="small">
                      <select v-model="addModel.type" name="link_type">
                        <option v-for="type in datapointTypes" :value="type.value">{{ type.label }}</option>
                      </select>
                    </x-select>
                  </template>
                  <div class="row" v-else>
                    <div class="col-10">
                      <x-select :label="getLabelByValue(addModel.type)" size="small">
                        <select v-model="addModel.type" name="link_type">
                          <option v-for="type in datapointTypes" :value="type.value">{{ type.label }}</option>
                        </select>
                      </x-select>
                    </div>
                    <div class="col-7">
                      <div class="ml5">
                        <div class="input-text-wrap">
                          <input type="number" class="input-text input-text-sm" v-model="addModel.min" placeholder="最小值" :class="{'require-warnning': isMinError }">
                        </div>
                      </div>
                    </div>
                    <div class="col-7">
                      <div class="ml5">
                        <div class="input-text-wrap">
                          <input type="number" class="input-text input-text-sm" v-model="addModel.max" placeholder="最大值" :class="{'require-warnning': isMaxError }">
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="input-text-wrap" v-show="addModel.type!==1">
                    <input type="text" class="input-text input-text-sm" v-model="addModel.symbol" maxlength="10">
                  </div>
                </td>
                <td>
                  <div class="input-text-wrap">
                    <input type="text" class="input-text input-text-sm" v-model="addModel.description" maxlength="250">
                  </div>
                </td>
                <td>
                  <x-select :label="addModel.is_write?'可读写':'只读'" size="small">
                    <select v-model="addModel.is_write" name="is_write">
                      <option :value="true">可读写</option>
                      <option :value="false">只读</option>
                    </select>
                  </x-select>
                </td>
                <td class="tac">
                  <button class="btn btn-link mr10" @click.prevent="save(addModel)">保存</button><button class="btn btn-link" @click.prevent="cancel(addModel)">取消</button>
                </td>
              </tr>
              <tr>
                <td colspan="7">
                  <!-- <a href="#" @click.prevent="add"><i class="fa fa-plus-circle"></i>添加数据端点</a> -->
                  <button class="btn btn-link btn-add" @click.prevent="add" :disabled="adding || editing" :class="{'disabled':adding || editing}"><i class="fa fa-plus-circle"></i>添加数据端点</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary btn-lg" @click="onBtnClick">配置完成，下一步</button>
    </div>
    <div>
      <data-model :show.sync="showModal"></data-model>
    </div>
  </div>
</template>

<script>
import Select from 'components/Select'
import DataModel from './data-model'
import { globalMixins } from 'src/mixins'
import Validator from 'utils/Validator'
import api from 'api'

export default {
  name: 'Datapoints',

  mixins: [globalMixins],

  components: {
    'x-select': Select,
    DataModel
  },

  vuex: {
    getters: {
      allProducts: ({ products }) => products.all
    }
  },

  data () {
    return {
      product: {},
      adding: false,
      editing: false,
      loadingData: false,
      datapoints: [],
      originAddModel: {
        index: 0,
        name: '',
        type: 1,
        description: '',
        symbol: '',
        is_write: true,
        min: 0,
        max: 100
      },
      originEditModel: {},
      addModel: {},
      showModal: false,
      isNameError: false, // 判断端点ID是否缺失
      isMinError: false, // 判断端点最小值是否缺失
      isMaxError: false // 判断端点最大值是否缺失
    }
  },

  computed: {
    // 数据端点类型
    datapointTypes () {
      var result = this.locales.data.DATAPOINT_TYPES
      _.remove(result, (o) => {
        return o.value === 5
      })
      return result
    },

    // 最大索引值
    maxIndex () {
      var result = -1
      if (this.datapoints.length > 0) {
        result = this.datapoints.concat().sort((a, b) => {
          if (a.index > b.index) {
            return -1
          }
          if (a.index < b.index) {
            return 1
          }
          return 0
        })[0].index
      }
      return result
    }
  },

  watch: {
    allProducts () {
      this.init()
    }
  },

  route: {
    data () {
      this.init()
      this.getDatapoints()
    }
  },

  methods: {
    init () {
      if (this.allProducts.length) {
        let product = _.find(this.allProducts, (item) => {
          return item.id === this.$route.params.id
        })
        if (product) this.product = product
      }
    },

    /**
     * 根据数据端点类型获取指定属性值
     * @author shengzhi
     * @param {Number} type 数据端点类型
     * @param {String} keyName 指定的属性
     */
    getByType (type, keyName) {
      let obj = _.find(this.locales.data.DATAPOINT_TYPES, (item) => {
        return item.value === type
      })
      return obj[keyName]
    },

    /**
     * 获取数据端点列表
     * @author shengzhi
     */
    getDatapoints () {
      this.loadingData = true
      api.product.getDatapoints(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data.map((item) => {
            item.editing = false
            this.adding = false
            this.editing = false
            return item
          })
          this.loadingData = false
          this.adding = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 根据值获取 label
     * @author shengzhi
     * @param {Number} val 值
     */
    getLabelByValue (val) {
      let ret = ''
      let type = _.find(this.locales.data.DATAPOINT_TYPES, (item) => {
        return item.value === val
      })
      if (type) {
        ret = type.label
      }
      return ret
    },

    /**
     * 添加数据端点
     * @author shengzhi
     */
    add () {
      this.adding = true
      this.addModel = _.clone(this.originAddModel)
      this.addModel.index = this.maxIndex + 1
    },

    /**
     * 编辑数据端点
     * @author shengzhi
     * @param {Object} datapoint 目标数据端点
     */
    edit (datapoint) {
      this.originEditModel = _.clone(datapoint)
      this.adding = false
      this.editing = true
      datapoint.editing = true
    },

    /**
     * 保存数据端点
     * @author shengzhi
     * @param {Object} datapoint 目标数据端点
     */
    save (datapoint) {
      if (this.loadingData) return

      let validator = new Validator()

      // 重置验证标识
      this.resetValidate()

      // 端点ID为必填
      validator.add(datapoint.name, [{
        format: 'required',
        msg: '请填写端点ID'
      }], () => {
        this.isNameError = true
      })

      // 数字类型需要判断必填以及取值范围的合法性
      let isNumType = _.some([2, 3, 4, 5, 8, 9], (item) => item === datapoint.type)
      if (isNumType) {
        validator.add(datapoint.min, [{
          format: 'required',
          msg: '请填写最小值'
        }, {
          format: 'min:' + this.getByType(datapoint.type, 'min'),
          msg: '最小值不合法'
        }], () => {
          this.isMinError = true
        })

        validator.add(datapoint.max, [{
          format: 'required',
          msg: '请填写最大值'
        }, {
          format: 'max:' + this.getByType(datapoint.type, 'max'),
          msg: '最大值不合法'
        }, {
          format: 'compare:' + datapoint.min,
          msg: '最大值必须大于最小值'
        }], () => {
          this.isMaxError = true
        })
      }

      let errMsg = validator.validate()
      if (errMsg) {
        this.showErrors(errMsg)
        return
      }

      this.loadingData = true
      if (this.adding) { // 添加
        api.product.addDataPoint(this.product.id, datapoint).then((res) => {
          if (res.status !== 200) return
            // this.adding = false
          this.getDatapoints()
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      } else { // 修改
        api.product.updateDataPoint(this.product.id, datapoint).then((res) => {
          if (res.status !== 200) return
          this.getDatapoints()
        }).catch((res) => {
          this.editing = false
          this.handleError(res)
          this.loadingData = true
        })
      }
    },

    resetValidate () {
      // 重置验证标识
      this.isNameError = false
      this.isMinError = false
      this.isMaxError = false
    },

    showErrors (str) {
      this.showNotice({
        type: 'error',
        content: str
      })
    },
    /**
     * 移除数据端点
     * @author shengzhi
     * @param {Object} datapoint 目标数据端点
     */
    remove (datapoint) {
      if (window.confirm('确定删除该数据端点？')) {
        api.product.deleteDataPoint(this.product.id, datapoint.id).then((res) => {
          if (res.status === 200) {
            this.getDatapoints()
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }
    },

    /**
     * 取消编辑数据端点
     * @author shengzhi
     * @param {Object} datapoint 目标数据端点
     * @param {Number} index 目标数据端点索引
     */
    cancel (datapoint, index) {
      // 重置验证标识
      this.resetValidate()
      if (this.adding) {
        this.adding = false
      } else {
        this.editing = false
        this.datapoints.$set(index, _.clone(this.originEditModel))
      }
    },
    /**
     * 处理按钮点击事件
     * @author shengzhi
     */
    onBtnClick () {
      this.$emit('next', 'data-points', this.$route.params.id)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../assets/stylus/common'

.btn-link
  padding 0

  &.disabled
    color gray-light
    cursor not-allowed

.btn-add
  color gray-dark

.creation-step2
  .filter-bar
    border-bottom 1px solid light-border-color

  .modal
    .modal-body
      padding 0 0 20px
      background #FFF

      .form
        max-width none

        .form-actions
          padding-right 20px

  .require-warnning
    border 1px solid red
</style>
