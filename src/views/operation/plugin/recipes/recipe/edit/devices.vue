<template>
  <div class="panel mt20">
    <!-- <div class="panel-hd">
      <h2>烹饪设备列表</h2>
    </div> -->
    <div class="panel-bd">
      <div class="tips-null" v-if="!recipe.devices.length && !loadingData">您还没有关联烹饪设备，请点击“添加烹饪设备”按钮编辑智能菜谱数据</div>
      <div class="data-table with-loading" v-if="recipe.devices.length">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div v-for="device in recipe.devices">
          <h3>{{ device.name }}</h3>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th colspan="2" class="wp30">烹饪曲线设备</th>
                <th class="w5 tac">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="w5">指令类型</td>
                <td><span class="hl-red">{{ device.autoexec.type || '-' }}</span></td>
                <td class="w5 tac"><a class="hl-red" @click.prevent="editType(device)">编辑</a></td>
              </tr>
              <tr>
                <td class="w5">烹饪指令</td>
                <td><span class="hl-red">{{ device.autoexec.value || '-' }}</span></td>
                <td class="w5 tac"><a class="hl-red" @click.prevent="editInstructions(device)">编辑</a></td>
              </tr>
              <tr>
                <th colspan="3" class="">烹饪提示</th>
              </tr>
              <tr v-for="tip in device.prompts">
                <td class="w5">第{{ $index + 1 }}步</td>
                <td><span v-if="tip.prompt_text" class="hl-red">{{ tip.prompt_text }}</span><span class="graytip" v-if="!tip.prompt_text">请输入提示内容,如:请将食物翻面</span></td>
                <td class="w5 tac"><a class="hl-red" @click.prevent="addTips(device, 'edit', tip)">编辑</a></td>
              </tr>
              <tr>
                <td class="w5"> </td>
                <td><a class="hl-red" @click.prevent="addTips(device, 'add')">+添加烹饪提示步骤</a></td>
                <td class="w5 tac"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <table class="table table-stripe table-bordered">
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
        </table> -->
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary" @click="addDevice" :disabled="recipe.devices.length >= products.length" :class="{'disabled':recipe.devices.length >= products.length}"><i class="fa fa-plus"></i>添加烹饪设备</button>
    </div>
    <div class="form-actions mb40 row">
      <div class="col-offset-4">
        <button type="submit" @click.prevent.stop="editOthers('edit')" :disabled="editing" :class="{'disabled': editing}" class="btn btn-primary btn-lg">{{ $t("common.save") }}</button>
        <!-- <button @click.prevent.stop="isShowPreview=true" class="btn btn-ghost btn-lg">预览</button> -->
        <!-- <button @click.prevent="deleteRecipe" class="btn btn-ghost btn-lg" v-if="type==='edit'">{{ $t('ui.recipe.del') }}</button> -->
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
              <label class="form-control col-6">指令类型:</label>
              <div class="controls col-18" v-if="modal.type === 'add'">
                <x-select placeholder="请选择指令类型" :label="selectedType">
                  <select v-model="selectedType" name="selectedType">
                    <option v-for="type in types" :value="type">{{ type }}</option>
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
                <div v-placeholder="'请输入设备指令'" class="input-text-wrap required-sign">
                  <textarea v-model="model.autoexec" name="model.autoexec" type="text" v-validate:autoexec="{required: true, format: 'trim'}" class="input-text"></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.autoexec.touched && $validation.autoexec.required">{{ $t('common.validation.required', {field: '设备指令'}) }}</span>
                  <span v-if="$validation.autoexec.touched && $validation.autoexec.format">设备指令不允许前后带空格</span>
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
    <!-- 编辑类型begin -->
    <modal :show.sync="showType" @close="onTypeCancel" width="480px">
      <h3 slot="header">编辑烹饪设置</h3>
      <div slot="body" class="form">
        <form autocomplete="off" novalidate @submit.prevent="onTypeEdit">
          <div class="form-row row">
            <label class="form-control col-6">指令类型:</label>
            <div class="radio-group controls col-18">
              <label v-for="type in types" class="radio">
                <input type="radio" v-model="typeModal.type" name="typeModal.type" :value="type" number required/>{{ type }}
              </label>
            </div>
          </div>
          <div class="form-actions">
            <!-- <label v-if="modal.type === 'edit'" class="del-check">
              <input type="checkbox" name="del" v-model="delChecked"/> 删除此设备
            </label> -->
            <button type="submit" :disabled="submitting" :class="{'disabled':submitting}" v-text="submitting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onTypeCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 指令编辑 -->
    <modal :show.sync="instructionsShow" width="480px">
      <h3 slot="header">编辑烹饪设置</h3>
      <div slot="body" class="form">
        <instructions-form v-if="instructionsShow" :model="instructionsModal" @submit="editIns" @delete="deleteIns" @close="onInsCancel"></instructions-form>
      </div>
    </modal>
    <!-- 指令提示 -->
    <modal :show.sync="tipsShow" width="480px">
      <h3 slot="header"><span v-if="this.tipsType === 'add'">添加</span><span v-if="this.tipsType === 'edit'">编辑</span>烹饪提示</h3>
      <div slot="body" class="form">
        <tips-form v-if="tipsShow" :type="tipsType" :model="tipsModal" @submit="editTips" @delete="delTips" @close="onTipsCancel"></tips-form>
      </div>
    </modal>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../../../mixins'
import InstructionsForm from '../components/InstructionsForm'
import TipsForm from '../components/TipsForm'
import api from 'api'

export default {
  name: 'Devices',

  layout: 'admin',

  mixins: [globalMixins, pluginMixins],

  components: {
    InstructionsForm,
    TipsForm
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
        devices: [
        //   {
        //   id: '2',
        //   name: '隔水炖',
        //   time: '4mins',
        //   autoexec: {
        //     type: 'base64',
        //     value: 'MDIgMDEgMzQgM2EgMDAgNjIgNTIgMDAgMGggMDAgMDYgMzQgMDggMDUgODI'
        //   },
        //   prompts: [{
        //     index: 1,
        //     prompt_text: '请放进备好的青菜'
        //   }]
        // }
        ]
      },
      modal: {
        show: false,
        type: 'add'
      },
      instructionsShow: false,
      instructionsModal: {},
      tipsShow: false,
      tipsModal: {},
      tipsType: 'add',
      showType: false,
      typeModal: {},
      selectedType: 'HEX',
      types: ['HEX', 'base64', 'json'],
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

  route: {
    data () {
      this.getRecipes()
    }
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
          this.recipe.devices.forEach((device) => {
            if (!device.hasOwnProperty('prompts')) {
              device.prompts = []
            }
          })
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
    editType (device) {
      this.showType = true
      this.typeModal = {
        device: device,
        type: device.autoexec.type
      }
    },

    editInstructions (device) {
      console.log(device)
      this.instructionsShow = true
      this.instructionsModal = {
        device: device,
        value: device.autoexec.value
      }
    },
    addTips (device, type, tip) {
      this.tipsShow = true
      this.tipsType = type
      this.tipsModal = {
        device: device,
        tip: tip,
        prompt_text: ''
      }
      if (type === 'edit') {
        this.tipsModal.prompt_text = tip.prompt_text
      }
    },
    // 添加提示
    editTips (obj) {
      var no = this.recipe.devices.indexOf(obj.device)
      var lesno = this.recipe.devices[no].prompts.indexOf(obj.tip)
      if (this.tipsType === 'add') {
        var device = _.clone(this.recipe.devices[no])
        device.prompts.push({prompt_text: obj.prompt_text})
        this.recipe.devices.$set(no, device)
        this.onTipsCancel()
        // this.editOthers('edit')
      } else if (this.tipsType === 'edit') {
        // this.recipe.devices[no].prompts[lesno] = {prompt_text: obj.prompt_text}
        // this.recipe.devices[no].prompts[lesno] = _.extend({}, this.recipe.devices[no].prompts[lesno], {prompt_text: obj.prompt_text})
        this.$set(`recipe.devices[${no}].prompts[${lesno}]`, {prompt_text: obj.prompt_text})
        this.onTipsCancel()
        // this.editOthers('edit')
      }
    },
    delTips (obj) {
      var no = this.recipe.devices.indexOf(obj.device)
      var lesno = this.recipe.devices[no].prompts.indexOf(obj.tip)
      this.recipe.devices[no].prompts.splice(lesno, 1)
      this.onTipsCancel()
      // this.editOthers('edit')
    },
    onTipsCancel () {
      this.tipsShow = false
    },

    onCancel () {
      this.modal.show = false
      this.selectedProduct = {}
      this.delChecked = false
      this.$resetValidation()
    },
    onTypeCancel () {
      this.showType = false
    },
    // 编辑类型
    onTypeEdit () {
      // console.log(JSON.stringify(this.typeModal))
      // 当前索引
      // console.log(this.recipe.devices.indexOf(this.typeModal.device))
      var no = this.recipe.devices.indexOf(this.typeModal.device)
      this.recipe.devices[no].autoexec.type = this.typeModal.type
      this.onTypeCancel()
      // this.editOthers('edit')
    },
    // 编辑指令
    editIns (obj) {
      var no = this.recipe.devices.indexOf(obj.device)
      this.recipe.devices[no].autoexec.value = obj.value
      this.onInsCancel()
      // this.editOthers('edit')
    },
    // 删除指令
    deleteIns (obj) {
      var result = window.confirm('确认删除该设备烹饪设备?')
      if (result === true) {
        var no = this.recipe.devices.indexOf(obj.device)
        // this.recipe.devices[no] = obj.value
        this.recipe.devices.splice(no, 1)
        this.onInsCancel()
        // this.editOthers('edit')
      } else {
        return
      }
    },
    onInsCancel () {
      this.instructionsShow = false
    },

    /**
     * 提交
     */
    onSubmit () {
      if (this.modal.type === 'add') {
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
            type: this.selectedType,
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
    },
    editOthers (type) {
      this.submitting = true
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      let devices = _.clone(this.recipe.devices)
      let params = {
        devices: devices,
        type: devices.length ? 2 : 1
      }
      api.recipes.editRecipes(appId, this.$route.params.id, token, params).then((res) => {
        if (res.status !== 200) return

        this.submitting = false
        this.onCancel()
        this.getRecipes()
        this.showNotice({
          type: 'success',
          content: '菜谱更新成功！'
        })
        this.$route.router.go({path: '/operation/plugins/recipes/' + this.$route.params.app_id + '/recipes'})
      })
    }
    // addTip (arr, index) {
    //   arr.push({
    //     index: index + 1,
    //     prompt_text: ''
    //   })
    // }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../../../assets/stylus/common'
.graytip
  color #a9a9a9
.actions
  margin-top 20px
.w5
  width 5%
.tips-null
  text-align center
  border 1px solid default-border-color
</style>
