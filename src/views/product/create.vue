<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t('product.add_product') }}</h2>
        </div>
        <div class="panel-bd">
          <div class="form">
            <form v-form name="validation" @submit.prevent="onSubmit">
              <div class="form-row">
                <label class="form-control">{{ $t("product.fields.name") }}:</label>
                <div class="controls">
                  <div v-placeholder="$t('product.placeholders.name')" class="input-text-wrap">
                    <input v-model="model.name" type="text" v-form-ctrl name="name" maxlength="32" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
                  </div>
                  <div v-if="validation.$submitted && validation.name.$pristine" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('validation.required', {field: $t('product.fields.name')}) }}</span></div>
                  <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('validation.required', {field: $t('product.fields.name')}) }}</span><span v-if="validation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('product.fields.name'), 32]) }}</span><span v-if="validation.name.$error.customValidator">{{ $t('validation.format', {field: $t('product.fields.name')}) }}</span></div>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">{{ $t("product.fields.desc") }}:</label>
                <div class="controls">
                  <div v-placeholder="$t('product.placeholders.desc')" class="input-text-wrap">
                    <textarea v-model="model.description" type="text" v-form-ctrl name="description" maxlength="250" required lazy class="input-text"></textarea>
                  </div>
                  <div v-if="validation.$submitted && validation.description.$pristine" class="form-tips form-tips-error"><span v-if="validation.description.$error.required">{{ $t('validation.required', {field: $t('product.fields.desc')}) }}</span></div>
                  <div v-if="validation.description.$dirty" class="form-tips form-tips-error"><span v-if="validation.description.$error.required">{{ $t('validation.required', {field: $t('product.fields.desc')}) }}</span><span v-if="validation.description.$error.maxlength"> {{ $t('validation.maxlength', [ $t('product.fields.name'), 250]) }}</span></div>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">{{ $t("product.fields.link_type") }}:</label>
                <div class="controls">
                  <div class="select">
                    <v-select :label="deviceTypes[model.link_type-1]">
                      <select v-model="model.link_type" v-form-ctrl name="link_type">
                        <option v-for="type in deviceTypes" :value="$index+1" :selected="$index===0">{{ type }}</option>
                      </select>
                    </v-select>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-lg">{{ $t("common.add") }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import api from '../../api'
  import { createProduct } from '../../store/actions/products'
  import locales from '../../consts/locales/index'
  import { globalMixins } from '../../mixins'
  import Select from '../../components/Select'

  export default {
    name: 'CreateProductForm',

    layout: 'admin',

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
        deviceTypes: locales[Vue.config.lang].deviceTypes,
        model: {},
        validation: {}
      }
    },

    methods: {
      onSubmit () {
        if (this.validation.$valid) {
          api.product.createProduct(this.model).then((res) => {
            if (res.status === 200) {
              // mutation
              this.createProduct(res.data)
              this.$route.router.go({path: '/products/' + res.data.id})
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      }
    }
  }
</script>
