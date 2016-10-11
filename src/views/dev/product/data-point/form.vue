<template>
  <div class="main">
    <div class="main-title">
      <h2>{{'数据端点'}}</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt10">
      <div class="panel-bd">
        <div class="form">
          <validator name="validation">
            <form novalidate @submit.prevent="onSubmit">
              <div class="form-row row">
                <label class="form-control col-6">{{ $t("ui.datapoint.fields.index") }}:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap">
                    <input v-model="model.index" type="text" name="index"  v-validate:index="{required: true, format: 'numberic'}" class="input-text" lazy/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.index.touched && $validation.index.required">{{ $t('ui.validation.required', {field: $t('ui.datapoint.fields.index')}) }}</span>
                    <span v-if="$validation.index.modified && $validation.index.format">{{ $t('ui.validation.numberic') }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">{{ $t("ui.datapoint.fields.name") }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.datapoint.placeholders.name')" class="input-text-wrap">
                    <input v-model="model.name" type="text" name="model.name" v-validate:name="{required: true, maxlength: 32}" class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.datapoint.fields.name')}) }}</span>
                    <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.datapoint.fields.name'), 32]) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">{{ $t("ui.datapoint.fields.type") }}:</label>
                <div class="controls col-18">
                  <div class="select">
                    <v-select :label="modelType.label">
                      <select v-model="modelType" name="type">
                        <option v-for="type in locales.data.DATAPOINT_TYPES" :value="type">{{ type.label }}</option>
                      </select>
                    </v-select>
                  </div>
                </div>
              </div>
              <div class="form-row row" v-if="modelType.value!==1 && modelType.value!==6 && modelType.value!==7">
                <label class="form-control col-6">{{ $t("ui.datapoint.fields.range") }}:</label>
                <div class="controls col-18">
                  <div class="row">
                    <div class="col-11">
                      <div v-placeholder="$t('ui.datapoint.placeholders.min')" class="input-text-wrap">
                        <input v-model="model.min" type="number" name="model.min" class="input-text" v-validate:min="validateMin" lazy/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.min.touched && $validation.min.required">最小值为必填项</span>
                        <span v-if="$validation.min.modified && $validation.min.format">{{ $t('ui.validation.numberic') }}</span>
                        <span v-if="$validation.min.modified && ($validation.min.min || $validation.min.max)">最小值不合法</span>
                      </div>
                    </div>
                    <div class="col-2 tac control-text">-</div>
                    <div class="col-11">
                      <div v-placeholder="$t('ui.datapoint.placeholders.max')" class="input-text-wrap">
                        <input v-model="model.max" type="number" name="model.max" class="input-text" v-validate:max="validateMax" lazy/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.max.touched && $validation.max.required">最大值为必填项</span>
                        <span v-if="$validation.max.modified && $validation.max.format">{{ $t('ui.validation.numberic') }}</span>
                        <span v-if="$validation.max.modified && ($validation.max.min || $validation.max.max)">最大值不合法</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 非布尔类型允许添加单位 -->
              <div class="form-row row" v-if="modelType.value!==1">
                <label class="form-control col-6">{{ $t("ui.datapoint.fields.symbol") }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.datapoint.placeholders.symbol')" class="input-text-wrap">
                    <input v-model="model.symbol" type="text" name="model.symbol" v-validate:symbol="{maxlength: 10}" class="input-text"/>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.symbol.modified && $validation.symbol.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.datapoint.fields.symbol'), 10]) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">读写状态:</label>
                <div class="controls col-18">
                  <div class="input-box">
                    <label>
                      <input type="radio" name="writeType" v-model="model.is_write" :value="true">
                      <span>可读写</span>
                    </label>
                    <label class="ml10">
                      <input type="radio" name="writeType" v-model="model.is_write" :value="false">
                      <span>只读</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6">{{ $t("ui.datapoint.fields.description") }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.datapoint.placeholders.description')" class="input-text-wrap">
                    <textarea v-model="model.description" type="text" name="model.description" v-validate:description="{maxlength: 250}" class="input-text"></textarea>
                  </div>
                  <div class="form-tips form-tips-error">
                    <span v-if="$validation.description.modified && $validation.description.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.datapoint.fields.description'), 250]) }}</span>
                  </div>
                </div>
              </div>
              <div class="form-row col-offset-6" v-if="type === 'edit'">
                <label class="del-check">
                  <input type="checkbox" name="del" v-model="delChecked"/> {{ $t("ui.datapoint.del_datapoint") }}
                </label>
              </div>
              <div class="form-actions col-offset-6">
                <button type="submit" :disabled="submiting" :class="{'disabled':submiting}" v-text="submiting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary w100"></button>
              </div>
            </form>
          </validator>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Select from 'components/Select'
import { globalMixins } from 'src/mixins'
import Breadcrumb from 'components/Breadcrumb'
import _ from 'lodash'

export default {
  name: 'Authorize',

  mixins: [globalMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.all
    }
  },

  components: {
    'v-select': Select,
    Breadcrumb
  },

  data () {
    return {
      submiting: false,
      delChecked: false,
      modelType: {
        value: 1,
        label: '布尔类型'
      },
      model: {
        index: 0,
        name: '',
        type: 1,
        min: 0,
        max: 100,
        description: '',
        symbol: '',
        is_write: true
      }
    }
  },

  computed: {
    /**
     * 计算属性 最小值的表单验证
     * @return {[type]} [description]
     */
    validateMin () {
      var result = {}
      result.format = 'numberic'
      result.max = this.addMax
      result.min = this.addMin
      result.required = true
      return result
    },
    validateMax () {
      var result = {}
      result.format = 'numberic'
      result.max = this.addMax
      result.min = this.model.min !== '' ? Math.max(this.model.min, this.addMin) : this.addMin
      result.required = true
      return result
    },
    type () {
      if (this.$route.params.dataPointId) {
        return 'edit'
      } else {
        return 'add'
      }
    },
    // 端点id
    dataPointId () {
      return this.$route.params.dataPointId
    },
    // 面包屑导航
    breadcrumbNav () {
      return [{
        label: '数据端点',
        link: '/dev/products/' + this.$route.params.id + '/data-point'
      }, {
        label: this.dataPointId ? '编辑数据端点' : '添加数据端点'
      }]
    },

    // 当前数据类型允许的最小值
    addMin () {
      return this.getByType(this.modelType.value, 'min')
    },

    // 当前数据类型允许的最大值
    addMax () {
      return this.getByType(this.modelType.value, 'max')
    }
  },

  watch: {
    modelType () {
      this.model.type = this.modelType.value
    }
  },
  route: {
    data () {
      if (this.type === 'edit') {
        this.getDatapoint()
      } else if (this.type === 'add') {
        this.model.index = this.$route.params.addIndex
      }
    }
  },

  methods: {
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
      if (typeof keyName !== 'undefined') {
        return obj[keyName]
      }
      return obj
    },

    /**
     * 获取数据端点详情
     * @return {[type]} [description]
     */
    getDatapoint () {
      api.product.getDataPoint(this.$route.params.id, this.dataPointId).then((res) => {
        this.model = res.data
        // 如果是布尔类型，初始化其最大值为100
        if (this.model.type === 1) {
          this.model.max = 100
        }
        this.modelType = this.getByType(res.data.type)
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 提交按钮
     * @return {[type]} [description]
     */
    onSubmit () {
      // 如果表单正在提交，禁止二次提交
      if (this.submiting) return

      // 如果勾选了删除但在确认弹窗中没确认，则取消该次表单提交动作
      if (this.delChecked && !window.confirm('确定要删除该数据端点？')) return

      // 如果表单验证不通过则重新验证
      if (!this.delChecked && this.$validation.invalid) {
        this.$validate(true)
        return
      }

      // 开始提交表单
      this.submiting = true

      // 表单参数
      let params = {
        'name': this.model.name,
        'type': this.model.type,
        'index': this.model.index,
        'description': this.model.description,
        'symbol': this.model.symbol,
        'is_read': true,
        'is_write': this.model.is_write
      }

      if (this.modelType.value !== 1 && this.modelType.value !== 6) {
        params.min = this.model.min
        params.max = this.model.max
      }

      // 如果是编辑，则加上数据端点的 id
      if (this.type === 'edit') {
        params.id = this.model.id
      }

      // 删除动作则只需要数据端点的 id作为参数
      if (this.delChecked) {
        params = this.dataPointId
      }

      // 产品 id
      let productId = this.$route.params.id

      // 根据表单的类型和是否勾选删除确定提交动作
      let process = ({
        add: {
          act: api.product.addDataPoint,
          label: '添加'
        },
        edit: {
          act: api.product.updateDataPoint,
          label: '更新'
        },
        del: {
          act: api.product.deleteDataPoint,
          label: '删除'
        }
      })[this.delChecked ? 'del' : this.type]

      // 执行动作并处理回调
      process.act(productId, params).then((res) => {
        this.showNotice({
          type: 'success',
          content: `${process.label}成功`
        })
        // 跳转到列表页
        this.$route.router.go('/dev/products/' + this.$route.params.id + '/data-point')
        this.submiting = false
      }).catch((res) => {
        this.handleError(res)
        this.submiting = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

  .form
    width 600px
    .input-box
      height 32px
      line-height 32px
</style>
