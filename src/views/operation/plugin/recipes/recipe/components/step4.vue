<template>
  <div class="panel mt20">
    <div class="panel-hd">
      <div class="actions">
        <button class="btn btn-primary" @click="addDevice" :disabled="recipe.devices.length >= products.length" :class="{'disabled':recipe.devices.length >= products.length}"><i class="fa fa-plus"></i>添加烹饪设备</button>
      </div>
      <h2>烹饪设备列表</h2>
    </div>
    <div class="panel-bd">
      <div class="tips-null" v-if="!recipe.devices.length && !loadingData">您还没有关联烹饪设备，请点击“添加烹饪设备”按钮编辑智能菜谱数据</div>
      <div class="data-table with-loading" v-if="recipe.devices.length">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th class="wp30">烹饪设备</th>
              <th>指令</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in recipe.devices">
              <td>{{ device.name }}</td>
              <td><a class="hl-red" @click.prevent="editDevice(device)">{{ device.autoexec.value || '-' }}123</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <modal :show.sync="modal.show" @close="onCancel" width="480px">
      <h3 slot="header">{{ modal.type === 'add' ? '添加' : '编辑' }}烹饪设备</h3>
      <div slot="body" class="form">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmit">
            <div class="form-row row">
              <label class="form-control col-6">烹饪菜谱:</label>
              <div class="controls col-18">
                <div class="control-text">{{ recipe.name }}</div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">工作设备:</label>
              <div class="controls col-18" v-if="modal.type === 'add'">
                <x-select placeholder="请选择设备" :label="selectedProduct.name">
                  <select v-model="selectedProduct" name="selectedProduct">
                    <option v-for="product in productOptions" :value="product">{{ product.name }}</option>
                  </select>
                </x-select>
              </div>
              <div class="controls col-18" v-if="modal.type === 'edit'">
                <div class="control-text">{{ model.name }}</div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">设备指令:</label>
              <div class="controls col-18">
                <div class="input-text-wrap required-sign">
                  <textarea v-model="model.autoexec" name="model.autoexec" type="text" v-validate:autoexec="['required']" class="input-text"></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.autoexec.touched && $validation.autoexec.required">{{ $t('ui.validation.required', {field: '设备指令'}) }}</span>
                </div>
              </div>
            </div>
            <div class="form-actions">
              <label v-if="modal.type === 'edit'" class="del-check">
                <input type="checkbox" name="del" v-model="delChecked"/> 删除此设备
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
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'
import Modal from 'components/Modal'
import Select from 'components/Select'
import api from 'api'

export default {
  name: 'Devices',

  layout: 'admin',

  mixins: [globalMixins, pluginMixins],

  components: {
    Modal,
    'x-select': Select
  },

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  data () {
    return {
      recipe: {
        name: '',
        devices: []
      },
      modal: {
        show: false,
        type: 'add'
      },
      isShowModal: false,
      selectedProduct: {},
      originModel: {
        id: '',
        name: '',
        autoexec: ''
      },
      model: {},
      submitting: false,
      delChecked: false,
      loadingData: true
    }
  },

  computed: {
    productOptions () {
      return _.differenceBy(this.products, this.recipe.devices, 'id')
    }
  },

  ready () {
    this.getRecipes()
  },

  methods: {
    getRecipes () {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      let condition = {
        filter: ['name', 'devices'],
        limit: 1,
        offset: 0,
        query: {
          _id: this.$route.params.id
        }
      }
      this.loadingData = true
      api.recipes.getRecipes(appId, token, condition).then((res) => {
        if (res.status === 200) {
          this.loadingData = false
          let data = res.data.list[0] ? res.data.list[0] : null
          this.recipe.devices = data.devices
          this.recipe.name = data.name
        }
      })
    },

    addDevice () {
      this.modal = {
        show: true,
        type: 'add'
      }
      this.model = _.clone(this.originModel)
    },

    editDevice (device) {
      this.modal = {
        show: true,
        type: 'edit'
      }
      this.model = {
        id: device.id,
        name: device.name,
        autoexec: device.autoexec.value
      }
    },

    onCancel () {
      this.modal.show = false
      this.selectedProduct = {}
      this.delChecked = false
      this.$resetValidation()
    },

    /**
     * 提交
     */
    onSubmit () {
      if (!this.selectedProduct.name) {
        return this.showNotice({
          type: 'error',
          content: '请选择工作设备'
        })
      }
      if (this.submitting) return

      if (this.$validation.invalid) {
        return this.$validate(true)
      }

      this.submitting = true
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      let devices = _.clone(this.recipe.devices)
      let device
      if (this.modal.type === 'add') { // 添加
        device = {
          id: this.selectedProduct.id,
          name: this.selectedProduct.name,
          autoexec: {
            type: 'base64',
            value: this.model.autoexec
          }
        }
        devices.push(device)
      } else {
        if (this.delChecked) { // 删除
          _.remove(devices, (item) => {
            return item.id === this.model.id
          })
        } else {
          device = _.find(devices, (item) => {
            return item.id === this.model.id
          })
          device.autoexec.value = this.model.autoexec
        }
      }
      let params = {
        devices: devices,
        type: devices.length ? 2 : 1
      }
      api.recipes.editRecipes(appId, this.$route.params.id, token, params).then((res) => {
        if (res.status !== 200) return

        this.submitting = false
        this.onCancel()
        this.getRecipes()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../../assets/stylus/common'

.tips-null
  text-align center
  border 1px solid default-border-color
</style>
