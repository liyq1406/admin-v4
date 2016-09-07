<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="form">
        <validator name="validation">
          <form novalidate @submit.prevent="onSubmit">
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.product.fields.name") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.product.placeholders.name')" class="input-text-wrap">
                  <input v-model="editModel.name" type="text" name="editModel.name" v-validate:name="{required: true, maxlength: 32}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.name')}) }}</span>
                  <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.product.fields.name'), 32]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.product.fields.mode") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                  <input v-model="editModel.mode" type="text" name="editModel.mode" v-validate:mode="{maxlength: 64}" lazy class="input-text"/>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.mode.modified && $validation.mode.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.product.fields.mode'), 64]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.product.fields.link_type") }}:</label>
              <div class="controls col-18">
                <div class="select">
                  <x-select :label="locales.data.DEVICE_TYPES[editModel.link_type-1]">
                    <select v-model="editModel.link_type" name="link_type">
                      <option v-for="type in locales.data.DEVICE_TYPES" :value="$index+1" :selected="$index===0">{{ type }}</option>
                    </select>
                  </x-select>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6">{{ $t("ui.product.fields.desc") }}:</label>
              <div class="controls col-18">
                <div v-placeholder="$t('ui.product.placeholders.desc')" class="input-text-wrap">
                  <textarea v-model="editModel.description" type="text" name="editModel.description" v-validate:description="{required: true, maxlength: 250}" lazy class="input-text"></textarea>
                </div>
                <div class="form-tips form-tips-error">
                  <span v-if="$validation.description.touched && $validation.description.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.desc')}) }}</span>
                  <span v-if="$validation.description.modified && $validation.description.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.product.fields.desc'), 250]) }}</span>
                </div>
              </div>
            </div>
            <div class="form-row row mb0">
              <div class="controls col-18 col-offset-6">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="is_registerable" v-model="editModel.is_registerable"/>{{ $t("ui.product.fields.is_registerable") }}
                  </label>
                </div>
              </div>
            </div>
            <div class="form-row row mb0" v-show="editModel.link_type===5">
              <div class="controls col-18 col-offset-6">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="is_active_register" v-model="editModel.is_active_register"/>允许动态注册设备
                  </label>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <div class="controls col-18 col-offset-6">
                <div class="checkbox-group">
                  <label class="checkbox">
                    <input type="checkbox" name="is_allow_multi_admin" v-model="editModel.is_allow_multi_admin"/>允许设备多个管理员
                  </label>
                </div>
              </div>
            </div>

            <div class="form-actions row">
              <div class="col-offset-6">
                <button type="submit" class="btn btn-primary btn-lg">{{ '提交' }}</button>
                <button type="submit" class="btn btn-primary btn-lg" @click.prevent="deleteProduct">{{ '删除产品' }}</button>
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
  import store from 'store'
  import Select from 'components/Select'
  import _ from 'lodash'
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'edit-product',

    // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
    mixins: [globalMixins, setCurrProductMixin],

    store,

    vuex: {
      actions: {
        removeProduct,
        updateProduct
      }
    },

    components: {
      'x-select': Select
    },

    data () {
      return {
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
          'user_role_authority': '接口未实现',
          'scan_mode': '接口未实现',
          id: ''
        }
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
      getDetails () {
        console.log(this.currentProduct)
        this.editModel = _.clone(this.currentProduct)
      },
      deleteProduct () {
        console.log('这个地方删除产品')
        if (!this.editing) { // 删除
          this.editing = true
          if (window.confirm('确认删除该产品吗?')) {
            api.product.deleteProduct(this.$route.params.id).then((res) => {
              if (res.status === 200) {
                this.removeProduct(this.currentProduct)
                alert('删除成功')
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

/*<style lang="stylus" scoped>

.statistic-group
  border-top 1px solid default-border-color
</style>*/
