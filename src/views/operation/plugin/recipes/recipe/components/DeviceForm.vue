<template>
  <validator name="validation">
    <form autocomplete="off" novalidate @submit.prevent="onSubmit">
      <div class="form-row row" v-if="type === 'add'">
        <label class="form-control col-6">烹饪菜谱:</label>
        <div class="controls col-18">
          <div class="control-text">{{ name }}</div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-6">工作设备:</label>
        <div class="controls col-18" v-if="type === 'add'">
          <x-select placeholder="请选择设备" :label="selectedProduct.name">
            <select v-model="selectedProduct" name="selectedProduct">
              <option v-for="product in products" :value="product">{{ product.name }}</option>
            </select>
          </x-select>
        </div>
        <div class="controls col-18" v-if="type === 'edit'">
          <div class="control-text">{{ selectedProduct.name }}</div>
        </div>
      </div>
      <div class="form-row row">
        <label class="form-control col-6">指令类型:</label>
        <div class="controls col-18">
          <x-select placeholder="请选择指令类型" :label="selectedType">
            <select v-model="selectedType" name="selectedType">
              <option v-for="type in types" :value="type">{{ type }}</option>
            </select>
          </x-select>
        </div>
        <!-- <div class="controls col-18" v-if="type === 'edit'">
          <div class="control-text">{{ model.name }}</div>
        </div> -->
      </div>
      <div class="form-row row">
        <label class="form-control col-6">设备指令:</label>
        <div class="controls col-18">
          <div v-placeholder="'请输入设备烹饪指令'" class="input-text-wrap">
            <textarea v-model="model.autoexec.value" name="model.autoexec.value" type="text" v-validate:autoexec="['required']" class="input-text"></textarea>
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
import { pluginMixins } from '../../../mixins'
export default {
  name: 'DeviceForm',

  layout: 'admin',

  mixins: [pluginMixins],

  components: {
  },
  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  props: {
    name: {
      type: String
    },
    type: {
      type: String,
      default: 'add'
    },
    recipe: {
      type: Object,
      default: {}
    }
  },

  data () {
    return {
      delChecked: false,
      // recipe: {
      //   name: '',
      //   devices: []
      // },
      model: {
        id: '',
        name: '',
        autoexec: {
          type: '',
          value: ''
        },
        prompts: []
      },
      cloneModal: {},
      selectedType: 'HEX',
      types: ['HEX', 'base64', 'json'],
      selectedProduct: {}
      // model: {
      //   id: '',
      //   name: '',
      //   autoexec: ''
      // }
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
    this.init()
  },

  methods: {
    // 初始化
    // init () {
    //   this.cloneModal = _.clone(this.model)
    // },
    init () {
      if (this.type === 'edit') {
        console.log(this.recipe.devices[0])
        var device = this.recipe.devices[0]
        this.products.forEach((product) => {
          if (product.id === device.id) {
            this.selectedProduct = product
          }
        })
        this.model.autoexec.value = device.autoexec.value
        this.types.forEach((type) => {
          if (type === device.autoexec.type) {
            this.selectedType = type
          }
        })
      }
    },
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
      if (this.type === 'add') {
        if (!this.selectedProduct.name) {
          return this.showNotice({
            type: 'error',
            content: '请选择工作设备'
          })
        }
      }
      if (this.submitting) return

      if (this.$validation.invalid) {
        return this.$validate(true)
      }
      this.model.name = this.selectedProduct.name
      this.model.id = this.selectedProduct.id
      this.model.autoexec.type = this.selectedType
      console.log(this.model)
      if (this.type === 'add') {
        this.$emit('add', this.model)
      } else if (this.type === 'edit') {
        this.$emit('edit', this.model)
      }
    },
    onCancel () {
      this.$emit('close')
      this.$resetValidation()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../../../../../assets/stylus/common'
</style>
