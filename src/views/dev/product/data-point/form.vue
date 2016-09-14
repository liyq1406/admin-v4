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
                    <input v-model="model.index" type="text" name="index" readonly="readyonly" v-validate:index="{required: true, format: 'numberic'}" class="input-text" lazy/>
                  </div>
                  <!-- <div class="form-tips form-tips-error">
                    <span v-if="$validation.index.touched && $validation.index.required">{{ $t('ui.validation.required', {field: $t('ui.datapoint.fields.index')}) }}</span>
                    <span v-if="$validation.index.modified && $validation.index.format">{{ $t('ui.validation.numberic') }}</span>
                  </div> -->
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
                        <option v-for="type in datapointTypes" :value="type">{{ type.label }}</option>
                      </select>
                    </v-select>
                  </div>
                </div>
              </div>
              <div class="form-row row" v-if="modelType.value!==1 && modelType.value!==6">
                <label class="form-control col-6">{{ $t("ui.datapoint.fields.range") }}:</label>
                <div class="controls col-18">
                  <div class="row">
                    <div class="col-11">
                      <div v-placeholder="$t('ui.datapoint.placeholders.min')" class="input-text-wrap">
                        <input v-model="model.min" type="number" name="model.min" class="input-text" lazy v-validate:min="validateMin" class="input-text"/>
                      </div>
                    </div>
                    <div class="col-2 tac control-text">-</div>
                    <div class="col-11">
                      <div v-placeholder="$t('ui.datapoint.placeholders.max')" class="input-text-wrap">
                        <input v-model="model.max" type="number" name="model.max" class="input-text" v-validate:max="{required: true, format: 'numberic', min: addMin, max: modelType.value === 2 ? 255 : modelType.value === 3 ? 65535 : 9223372036854775807}"/>
                      </div>
                    </div>
                  </div>
                  <div class="form-tips form-tips-error">
                    <div class="row">
                      <div class="col-13">
                        <span v-if="$validation.min.touched && $validation.min.required">最小值为必填项</span>
                      </div>
                      <div class="col-11">
                        <span v-if="$validation.max.touched && $validation.max.required">最大值为必填项</span>
                      </div>
                    </div>
                    <span v-if="$validation.min.modified && $validation.min.format">{{ $t('ui.validation.numberic') }}</span>
                    <span v-if="$validation.min.modified && $validation.min.min">最小值超过范围</span>
                    <span v-if="$validation.max.modified && $validation.max.format">{{ $t('ui.validation.numberic') }}</span>
                    <span v-if="$validation.max.modified && $validation.max.max">{{ $t('ui.validation.max', [$t('ui.datapoint.fields.max'), modelType.value === 2 ? 255 : modelType.value === 3 ? 65535 : 9223372036854775807]) }}</span>
                  </div>
                </div>
              </div>
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
      result.min = -9223372036854775808
      if (this.modelType.value === 2) { // 单字节
        result.min = 0
      } else if (this.modelType.value === 3) { // 短整型有符号
        result.min = -32768
      } else if (this.modelType.value === 4) { // 32位整型（有符号）
        result.min = -2147483648
      }
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
    // 数据端点类型
    datapointTypes () {
      var result = [
        {
          value: 1,
          label: '布尔类型'
        },
        {
          value: 2,
          label: '单字节(无符号)'
        },
        {
          value: 3,
          label: '16位短整型（有符号）'
        },
        {
          value: 4,
          label: '32位整型（有符号）'
        },
        {
          value: 5,
          label: '浮点'
        },
        {
          value: 6,
          label: '字符串'
        },
        {
          value: 7,
          label: '字节数组'
        },
        {
          value: 8,
          label: '16位短整型（无符号）'
        },
        {
          value: 9,
          label: '32位整型（无符号）'
        }
      ]
      return result
    },
    addMin () {
      var min = 0
      if (this.modelType.value === 4) {
        min = -9223372036854775808
      }
      return this.model.min === '' ? min : parseInt(this.model.min) + 1
    },

    addMax () {
      var max = 9223372036854775807
      if (this.modelType.value === 2) {
        max = 255
      } else if (this.modelType.value === 3) {
        max = 65535
      }
      return this.model.max || max
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
     * 获取数据端点详情
     * @return {[type]} [description]
     */
    getDatapoint () {
      api.product.getDataPoint(this.$route.params.id, this.dataPointId).then((res) => {
        this.model = res.data
        this.modelType = this.datapointTypes[res.data.type - 1]
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 提交按钮
     * @return {[type]} [description]
     */
    onSubmit () {
      // 判断表单验证是否通过
      if (this.$validation.valid || this.delChecked) {
        this.submiting = true
        if (this.type === 'add') {
          this.addDataPoint()
        } else {
          if (this.delChecked) {
            this.deleteDataPoint()
          } else {
            this.updateDataPoint()
          }
        }
      } else {
        this.$validate(true)
      }
    },

    /**
     * 添加数据端点
     */
    addDataPoint () {
      let params = {
        'name': this.model.name,
        'type': this.model.type,
        'index': this.model.index,
        'description': this.model.description,
        'symbol': this.model.symbol
      }
      if (this.modelType.value !== 1 && this.modelType.value !== 6) {
        params.min = this.model.min
        params.max = this.model.max
      }
      api.product.addDataPoint(this.$route.params.id, params).then((res) => {
        this.showSuccess('添加成功')
        this.goList()
        this.submiting = false
      }).catch((res) => {
        this.handleError(res)
        this.submiting = false
      })
    },
    /**
     * 编辑数据端点
     * @return {[type]} [description]
     */
    updateDataPoint () {
      let params = {
        'id': this.model.id,
        'name': this.model.name,
        'type': this.model.type,
        'index': this.model.index,
        'description': this.model.description,
        'symbol': this.model.symbol,
        'is_write': this.model.is_write
      }
      if (this.modelType.value !== 1 && this.modelType.value !== 6) {
        params.min = this.model.min
        params.max = this.model.max
      }
      api.product.updateDataPoint(this.$route.params.id, params).then((res) => {
        this.showSuccess('更新成功')
        this.goList()
        this.submiting = false
      }).catch((res) => {
        this.handleError(res)
        this.submiting = false
      })
    },

    /**
     * 删除数据端点
     * @return {[type]} [description]
     */
    deleteDataPoint () {
      if (window.confirm('确定要删除改数据端点？')) {
        api.product.deleteDataPoint(this.$route.params.id, this.dataPointId).then((res) => {
          this.showSuccess('删除成功')
          this.goList()
        }).catch((res) => {
          this.handleError(res)
          this.submiting = false
        })
      } else {
        this.submiting = false
      }
    },

    /**
     * 跳回列表页
     * @return {[type]} [description]
     */
    goList () {
      this.$route.router.go('/dev/products/' + this.$route.params.id + '/data-point')
    },

    /**
     * 显示成功文案
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    showSuccess (str) {
      this.showNotice({
        type: 'success',
        content: str
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
