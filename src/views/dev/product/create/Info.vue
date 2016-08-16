<template>
  <div>
    <div class="panel no-split-line">
      <div class="panel-body">
        <div class="info-form">
          <div class="col-thumb">
            <div class="thumb"><img :src="deviceThumb"/></div>
          </div>
          <div class="col-form">
            <div class="form">
              <validator name="validation">
                <form novalidate>
                  <div class="form-row row">
                    <label class="form-control col-4">{{ $t("ui.product.fields.name") }}:</label>
                    <div class="controls col-20">
                      <div v-placeholder="$t('ui.product.placeholders.name')" class="input-text-wrap">
                        <input v-model="product.name" type="text" name="product.name" v-validate:name="{required: true, maxlength: 32}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.name.touched && $validation.name.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.name')}) }}</span>
                        <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.product.fields.name'), 32]) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-4">{{ $t("ui.product.fields.mode") }}:</label>
                    <div class="controls col-20">
                      <div v-placeholder="$t('ui.product.placeholders.mode')" class="input-text-wrap">
                        <input v-model="product.mode" type="text" name="product.mode" v-validate:mode="{required: true, maxlength: 64}" lazy class="input-text"/>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.mode.touched && $validation.mode.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.mode')}) }}</span>
                        <span v-if="$validation.mode.modified && $validation.mode.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.product.fields.mode'), 64]) }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-4">{{ $t("ui.product.fields.link_type") }}:</label>
                    <div class="controls col-20">
                      <div class="select">
                        <v-select :label="locales.data.DEVICE_TYPES[product.link_type-1]">
                          <select v-model="product.link_type" name="link_type">
                            <option v-for="type in locales.data.DEVICE_TYPES" :value="$index+1" :selected="$index===0">{{ type }}</option>
                          </select>
                        </v-select>
                      </div>
                    </div>
                  </div>
                  <div class="form-row row">
                    <label class="form-control col-4">{{ $t("ui.product.fields.desc") }}:</label>
                    <div class="controls col-20">
                      <div v-placeholder="$t('ui.product.placeholders.desc')" class="input-text-wrap">
                        <textarea v-model="product.description" type="text" name="product.desc" v-validate:description="{required: true, maxlength: 250}" lazy class="input-text"></textarea>
                      </div>
                      <div class="form-tips form-tips-error">
                        <span v-if="$validation.description.touched && $validation.description.required">{{ $t('ui.validation.required', {field: $t('ui.product.fields.desc')}) }}</span>
                        <span v-if="$validation.description.modified && $validation.description.maxlength">{{ $t('ui.validation.maxlength', [$t('ui.product.fields.desc'), 250]) }}</span>
                      </div>
                    </div>
                  </div>
                </form>
              </validation>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary btn-lg" @click="onBtnClick">下一步</button>
    </div>
  </div>
</template>

<script>
import api from 'api'
import { globalMixins } from 'src/mixins'
import { createProduct } from 'store/actions/products'
import Select from 'components/Select'
import defaultDeviceThumb from 'assets/images/device_thumb.png'

export default {
  name: 'Info',

  mixins: [globalMixins],

  vuex: {
    actions: {
      createProduct
    }
  },

  components: {
    'v-select': Select
  },

  data () {
    return {
      deviceThumb: defaultDeviceThumb,
      product: {
        name: '',
        mode: '',
        link_type: 1,
        description: ''
      }
    }
  },

  methods: {
    /**
     * 处理按钮点击事件
     */
    onBtnClick () {
      if (this.$validation.valid) {
        api.product.create(this.product).then((res) => {
          if (res.status === 200) {
            // mutation
            this.createProduct(res.data)
            this.$emit('info-submit', res.data)
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.info-form
  padding 40px 0 60px 20px
  clearfix()

.col-thumb
  float left
  size 250px

  img
    size 100%

.col-form
  float left
  margin-left 30px
  width 480px
</style>
