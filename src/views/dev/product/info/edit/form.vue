<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="form ml20">
        <validator name="validation">
          <form autocomplete="off" novalidate @submit.prevent="onSubmit">
            <!-- 产品名称 -->
            <div class="form-row row">
              <label class="form-control col-3">{{ $t("ui.product.fields.name") }}:</label>
              <div class="controls col-12">
                <div v-placeholder="$t('ui.product.placeholders.name')" class="input-text-wrap">
                  <input v-model="editModel.name" type="text" name="editModel.name" v-validate:name="{required: true, maxlength: 32}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: $t('ui.product.fields.name')}) }}</span>
                  <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('common.validation.maxlength', [$t('ui.product.fields.name'), 32]) }}</span>
                </div>
              </div>
            </div>
            <!-- 产品型号 -->
            <div class="form-row row">
              <label class="form-control col-3">{{ $t("ui.product.fields.mode") }}:</label>
              <div class="controls col-12">
                <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                  <input v-model="editModel.mode" type="text" name="editModel.mode" v-validate:mode="{maxlength: 64}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.mode.modified && $validation.mode.maxlength">{{ $t('common.validation.maxlength', [$t('ui.product.fields.mode'), 64]) }}</span>
                </div>
              </div>
            </div>
            <!-- 产品类型不允许修改 -->
            <div class="form-row row">
              <label class="form-control col-3">产品类型:</label>
              <div class="controls col-12">
                <div class="select">
                  <x-select :label="productType" :placeholder="'请选择类型'" :disabled="true">
                    <select v-model="editModel.type" name="editModel.type" :disabled="true">
                      <option v-for="type in locales.data.ACCOUNT_TYPES" :value="type.value">{{ type.label }}</option>
                    </select>
                  </x-select>
                </div>
              </div>
            </div>
            <!-- 连接类型 -->
            <div class="form-row row">
              <label class="form-control col-3">{{ $t("ui.product.fields.link_type") }}:</label>
              <div class="controls col-12">
                <div class="select">
                  <x-select :label="locales.data.DEVICE_TYPES[editModel.link_type-1]">
                    <select v-model="editModel.link_type" name="link_type">
                      <option v-for="type in locales.data.DEVICE_TYPES" :value="$index+1" :selected="$index===0">{{ type }}</option>
                    </select>
                  </x-select>
                </div>
              </div>
            </div>
            <!-- 产品描述 -->
            <div class="form-row row">
              <label class="form-control col-3">{{ $t("ui.product.fields.desc") }}:</label>
              <div class="controls col-12">
                <div v-placeholder="$t('ui.product.placeholders.desc')" class="input-text-wrap">
                  <textarea v-model="editModel.description" type="text" name="editModel.description" v-validate:description="{required: true, maxlength: 250}" lazy class="input-text"></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.description.touched && $validation.description.required">{{ $t('common.validation.required', {field: $t('ui.product.fields.desc')}) }}</span>
                  <span v-if="$validation.description.modified && $validation.description.maxlength">{{ $t('common.validation.maxlength', [$t('ui.product.fields.desc'), 250]) }}</span>
                </div>
              </div>
            </div>
            <!-- 产品管理 -->
            <div class="form-row row">
              <label class="form-control col-3">产品管理:</label>
              <div class="controls col-19">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="is_allow_multi_admin" v-model="editModel.is_allow_multi_admin"/>允许设备多个管理员
                  </label>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">设备授权:</label>
                <!-- <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="is_registerable" v-model="editModel.is_registerable"/>允许多用户订阅设备 <span class="ml10 hl-gray">(设备被订阅后，可以被其它用户再次订阅)</span>
                  </label>
                </div> -->
              <div class="controls col-19">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="is_registerable" v-model="editModel.is_registerable"/>允许用户授权设备 <span class="ml10 hl-gray">(注：用户添加设备时自动完成平台授权，并消耗产品配额，如mesh网络设备)</span>
                  </label>
                </div>
                <div class="checkbox-group" v-show="editModel.link_type===5">
                  <label class="checkbox">
                    <input type="checkbox" name="is_active_register" v-model="editModel.is_active_register"/>允许设备自行授权 <span class="ml10 hl-gray">(注：PC设备调用SDK注册接口自动完成添加设备和授权设备，并消耗产品配额)</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-3">订阅设备:</label>
              <div class="controls col-19">
                <div class="select">
                  <x-select :label="scanMode" width="240px">
                    <select v-model="editModel.scan_mode" name="editModel.scan_mode">
                      <option v-for="opt in locales.data.SCAN_MODES" :value="opt.value">{{ opt.label }}</option>
                    </select>
                  </x-select>
                </div>
                <p class="mt5 hl-gray">(注：即当设备被订阅后，是否允许其他用户再次订阅该设备)</p>
              </div>
            </div>

            <!-- 产品图片 -->
            <div class="form-row row">
              <label class="form-control col-3">产品图片:</label>
              <div class="controls col-19">
                <div class="img-box">
                  <image-uploader :images="editModel.pics" @modified="imageChange" img-width="120px"></image-uploader>
                </div>
              </div>
            </div>

            <div class="form-actions row">
              <div class="col-offset-3">
                <button type="submit" class="btn btn-primary btn-lg">{{ '提交' }}</button>
                <button type="submit" v-if="!editModel.is_release" class="btn btn-ghost btn-lg" @click.prevent="deleteProduct">{{ '删除产品' }}</button>
              </div>
            </div>
          </form>
        </validator>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
// import * as config from 'consts/config'
import { removeProduct, updateProduct } from 'store/actions/products'
import { setCurrProductMixin } from '../../mixins'
import ImageUploader from 'components/ImageUploader'
import Select from 'components/Select'
import { globalMixins } from 'src/mixins'

export default {
  name: 'ProductInfo',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  mixins: [globalMixins, setCurrProductMixin],

  vuex: {
    actions: {
      removeProduct,
      updateProduct
    }
  },

  components: {
    'x-select': Select,
    ImageUploader
  },

  data () {
    return {
      images: [''],
      delChecked: false,
      editing: false,
      editModel: {
        is_allow_multi_admin: false,
        name: '',
        description: '',
        mode: '',
        link_type: '',
        is_registerable: false,
        is_active_register: false,
        is_release: false,
        user_role_authority: 'RW',
        type: 0,
        scan_mode: 1,
        id: '',
        pics: []
      }
    }
  },

  computed: {
    productType () {
      var result = ''
      this.locales.data.ACCOUNT_TYPES.forEach((item) => {
        if (item.value === this.editModel.type) {
          result = item.label
        }
      })
      return result
    },

    scanMode () {
      var result = ''
      this.locales.data.SCAN_MODES.forEach((item) => {
        if (item.value === this.editModel.scan_mode) {
          result = item.label
        }
      })
      return result
    }
  },
  watch: {
    currentProduct () {
      this.getDetails()
    }
  },
  route: {
    data () {
      this.getDetails()
    }
  },
  methods: {
    imageChange (images) {
      this.editModel.pics = images
    },
    /**
     * 获取当前产品信息
     * @return {[type]} [description]
     */
    getDetails () {
      this.editModel = _.cloneDeep(this.currentProduct)
      this.editModel.pics = this.editModel.pics || ['']
      if (this.editModel.pics.length === 0) {
        this.editModel.pics = ['']
      }
    },
    /**
     * 删除产品函数
     * @return {[type]} [description]
     */
    deleteProduct () {
      if (!this.editing) { // 删除
        this.editing = true
        if (window.confirm('确认删除该产品吗?')) {
          api.product.deleteProduct(this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.removeProduct(this.currentProduct)
              this.showNotice({
                type: 'success',
                content: '产品删除成功！'
              })
              this.$route.router.replace('/dev/home')
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        } else {
          this.editing = false
        }
      }
    },
    /**
     * 表单提交
     * @return {[type]} [description]
     */
    onSubmit () {
      if (this.$validation.valid && !this.editing) { // 编辑
        this.editing = true
        api.product.updateProduct(this.editModel).then(() => {
          api.product.getProduct(this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.updateProduct(res.data)
              this.editing = false
              this.showNotice({
                type: 'success',
                content: '更新成功！'
              })
              this.$route.router.replace(`/dev/products/${this.$route.params.id}/info`)
            }
          })
        }).catch((res) => {
          this.handleError(res)
          this.editing = false
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.panel-bd
  .form
    max-width 800px
    padding-top 10px

.statistic-group
  border-top 1px solid default-border-color
</style>
