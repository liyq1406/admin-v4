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
              <form novalidate>
                <div class="form-row row">
                  <label class="form-control col-4">{{ $t("ui.product.fields.name") }}:</label>
                  <div class="controls col-20">
                    <div v-placeholder="$t('ui.product.placeholders.name')" class="input-text-wrap">
                      <input v-model="product.name" type="text" name="name" maxlength="32" required lazy class="input-text"/>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-4">产品型号:</label>
                  <div class="controls col-20">
                    <div v-placeholder="$t('ui.product.placeholders.name')" class="input-text-wrap">
                      <input v-model="product.model" type="text" name="model" maxlength="32" required lazy class="input-text"/>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-4">产品类型:</label>
                  <div class="controls col-20">
                    <div class="select">
                      <v-select :label="locales.data.ACCOUNT_TYPES[product.type-1].label">
                        <select v-model="product.type" v-form-ctrl name="type">
                          <option v-for="type in locales.data.ACCOUNT_TYPES" :value="type.value" :selected="$index===0">{{ type.label }}</option>
                        </select>
                      </v-select>
                    </div>
                  </div>
                </div>
                <div class="form-row row">
                  <label class="form-control col-4">{{ $t("ui.product.fields.link_type") }}:</label>
                  <div class="controls col-20">
                    <div class="select">
                      <v-select :label="locales.data.DEVICE_TYPES[product.link_type-1]">
                        <select v-model="product.link_type" v-form-ctrl name="link_type">
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
                      <textarea v-model="product.description" type="text" name="description" maxlength="250" required lazy class="input-text"></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-primary btn-lg" @click="handleBtnClick">下一步</button>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Select from 'components/Select'
import defaultDeviceThumb from 'assets/images/device_thumb.png'

export default {
  name: 'Info',

  mixins: [globalMixins],

  components: {
    'v-select': Select
  },

  data () {
    return {
      deviceThumb: defaultDeviceThumb,
      product: {
        name: '',
        model: '',
        type: 1,
        link_type: 1,
        description: ''
      }
    }
  },

  methods: {
    /**
     * 处理按钮点击事件
     */
    handleBtnClick () {
      this.$emit('next-step', this.product)
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
