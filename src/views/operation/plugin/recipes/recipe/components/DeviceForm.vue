<template>
  <validator name="validation">
    <form autocomplete="off" novalidate @submit.prevent="onSubmit">
      <div class="form-row row">
        <label class="form-control col-6">烹饪菜谱:</label>
        <div class="controls col-18">
          <div class="control-text">{{ name }}</div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-6">工作设备:</label>
        <div class="controls col-18">
          <x-select placeholder="请选择设备" :label="selectedProduct.name">
            <select v-model="selectedProduct" name="selectedProduct">
              <option v-for="product in productOptions" :value="product">{{ product.name }}</option>
            </select>
          </x-select>
        </div>
        <!-- <div class="controls col-18" v-if="modal.type === 'edit'">
          <div class="control-text">{{ model.name }}</div>
        </div> -->
      </div>
      <div class="form-row row">
        <label class="form-control col-6">设备指令:</label>
        <div class="controls col-18">
          <div class="input-text-wrap required-sign">
            <textarea v-model="model.autoexec" name="model.autoexec" type="text" v-validate:autoexec="['required']" class="input-text"></textarea>
          </div>
          <div class="form-tips form-tips-error">
            <span v-if="$validation.autoexec.touched && $validation.autoexec.required">{{ $t('common.validation.required', {field: '设备指令'}) }}</span>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <!-- <label v-if="modal.type === 'edit'" class="del-check">
          <input type="checkbox" name="del" v-model="delChecked"/> 删除此设备
        </label> -->
        <button type="submit" :disabled="submitting" :class="{'disabled':submitting}" v-text="submitting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        <button @click.prevent.stop="onCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
      </div>
    </form>
  </validator>
</template>

<script>
import Modal from 'components/Modal'
// import _ from 'lodash'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'
import Select from 'components/Select'
import _ from 'lodash'

export default {
  name: 'DeviceForm',

  layout: 'admin',

  mixins: [globalMixins, pluginMixins],

  components: {
    'modal': Modal,
    'x-select': Select
  },
  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  props: {
    name: {
      type: String
    }
  },

  data () {
    return {
      delChecked: false,
      recipe: {
        name: '',
        devices: []
      },
      selectedProduct: {},
      model: {
        id: '',
        name: '',
        autoexec: ''
      }
      // orignModel: {
      //   type: ''
      // }
    }
  },
  computed: {
    productOptions () {
      return _.differenceBy(this.products, this.recipe.devices, 'id')
    }
  },

  ready () {
    // this.orignModel.type = this.menu.type
    this.$resetValidation()
  },

  methods: {
    // handleSubmit (menu) {
    //   if (this.$validation.invalid) {
    //     return
    //   }
    //   if (this.delChecked === false) {
    //     this.$emit('submit', menu)
    //     this.$resetValidation()
    //   } else if (this.delChecked === true) {
    //     this.$emit('delete', menu)
    //     this.$resetValidation()
    //   }
    // },
    cancel () {
      this.$emit('close')
      this.$resetValidation()
    },
    onSubmit () {
      this.model.name = this.selectedProduct.name
      this.model.id = this.selectedProduct.id
      this.$emit('add')
    },
    onCancel () {}
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../../../../assets/stylus/common'
</style>
