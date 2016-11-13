<template>
  <div class="panel">
    <div class="panel-hd">
      <div class="actions">
        <button class="btn btn-primary" @click="addField"><i class="fa fa-plus"></i>添加自定义字段</button>
      </div>
      <h2>设置产品二维码信息<span class="hl-gray">（T、V、PID为系统字段，不可更改）</span></h2>
    </div>
    <div class="panel-bd">
      <x-table :headers="columns" :tables="fieldList" @tbody-name="editField" @tbody-info="editField"></x-table>
    </div>
    <div class="panel-hd mt30">
      <h2>产品二维码</h2>
    </div>
    <div class="panel-bd">
      <div class="qrcode-info">{{ qrcode }};;</div>
    </div>

    <!-- 添加/编辑自定义字段浮层 -->
    <modal :show.sync="modal.show" @close="onCancel">
      <h3 slot="header">{{modal.type==='add' ? '添加' : '编辑'}}二维码信息</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmit">
            <div class="form-row row">
              <label class="form-control col-6">名称:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input v-model="model.name" type="text" name="model.name" v-validate:name="{required: true, format: 'trim'}"  lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: $t('ui.app.fields.name')}) }}</span>
                  <span v-if="$validation.name.modified && $validation.name.format">名称前后不能包含空格</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">参数值:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <textarea v-model="model.info" type="text" name="model.info" v-validate:info="{required: true, format: 'trim'}"  lazy class="input-text"></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.info.touched && $validation.info.required">{{ $t('common.validation.required', {field: '参数值'}) }}</span>
                  <span v-if="$validation.info.modified && $validation.info.format">参数值前后不能包含空格</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <label class="del-check" v-if="this.modal.type==='edit'">
                <input type="checkbox" name="del" v-model="delChecked"/>删除参数
              </label>
              <button type="submit" :disabled="submitting" :class="{'disabled':submitting}" v-text="submitting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
              <button @click.prevent.stop="onCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            </div>
          </form>
        </validator>
      </div>
    </modal>
  </div>
</template>

<script>
import api from 'api'
import { updateProduct } from 'store/actions/products'
import { setCurrProductMixin } from '../../mixins'
import { globalMixins } from 'src/mixins'
import Table from 'components/Table'
export default {
  name: 'Qrcode',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, setCurrProductMixin],

  vuex: {
    actions: {
      updateProduct
    }
  },

  components: {
    'x-table': Table
  },

  data () {
    return {
      columns: [{
        key: 'name',
        title: '名称',
        class: 'wp30'
      }, {
        key: 'info',
        title: '参数信息'
      }],
      submitting: false,
      delChecked: false,
      modal: {
        show: false,
        type: 'add'
      },
      originModel: {
        name: '',
        info: ''
      },
      model: {}
    }
  },

  computed: {
    // 二维码信息
    qrcode () {
      let result = `XQR:T:P;V:1;PID:${this.$route.params.id}`
      if (this.currentProduct.qrcode) {
        result = this.currentProduct.qrcode.replace(';;', '')
      }
      return result
    },

    fieldArr () {
      return _.compact(this.qrcode.replace('XQR:', '').split(';'))
    },

    // 字段列表
    fieldList () {
      let defaultFields = this.fieldArr.slice(0, 3).map((item) => {
        let pair = item.split(':')
        return {
          name: pair[0],
          info: pair[1],
          origin: {
            name: pair[0],
            info: pair[1]
          }
        }
      })
      let customFields = this.fieldArr.slice(3).map((item) => {
        let pair = item.split(':')
        return {
          name: `<a class="hl-red">${pair[0]}</a>`,
          info: `<a class="hl-red">${pair[1]}</a>`,
          origin: {
            name: pair[0],
            info: pair[1]
          }
        }
      })
      return defaultFields.concat(customFields)
    }
  },

  methods: {
    /**
     * 添加字段
     */
    addField () {
      this.modal = {
        show: true,
        type: 'add'
      }
      this.model = _.clone(this.originModel)
    },

    /**
     * 编辑字段
     */
    editField (field, header, index) {
      this.modal = {
        show: true,
        type: 'edit',
        index: index
      }
      this.model = _.clone(field.origin)
    },

    /**
     * 取消表单提交
     */
    onCancel () {
      this.delChecked = false
      this.submitting = false
      this.modal.show = false
      this.$resetValidation()
    },

    /**
     * 提交表单
     */
    onSubmit () {
      if (this.submitting) return

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      this.submitting = true
      let params = _.clone(this.currentProduct)

      if (this.modal.type === 'add') {
        params.qrcode = `${this.qrcode};${this.model.name}:${this.model.info};;`
      } else {
        let arr = _.clone(this.fieldArr)
        if (this.delChecked) {
          arr.splice(this.modal.index, 1) // 删除对应索引的键值对
        } else {
          arr.splice(this.modal.index, 1, `${this.model.name}:${this.model.info}`) // 更新对应索引的键值对
        }
        params.qrcode = `XQR:${arr.join(';')};;`
      }
      api.product.updateProduct(params).then((res) => {
        if (res.status === 200) {
          this.onCancel()
          this.updateProduct(params)
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../../assets/stylus/common'

.qrcode-info
  border 1px solid default-border-color
  padding 10px
  min-height 80px
</style>
