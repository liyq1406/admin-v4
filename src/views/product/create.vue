<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        h2 {{ $t('product.add_product') }}
      .panel-bd
        .form
          form(v-form, name="validation", @submit.prevent="onSubmit")
            .form-row
              label.form-control {{ $t("product.fields.name") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('product.placeholders.name')")
                  input.input-text(v-model="model.name", type="text", v-form-ctrl, name="name", maxlength="32", required, custom-validator="noSpacesPrefixAndSuffix", lazy)
                .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                  span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('product.fields.name')}) }}
                .form-tips.form-tips-error(v-if="validation.name.$dirty")
                  span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('product.fields.name')}) }}
                  span(v-if="validation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('product.fields.name'), 32]) }}
                  span(v-if="validation.name.$error.customValidator") {{ $t('validation.format', {field: $t('product.fields.name')}) }}
            .form-row
              label.form-control {{ $t("product.fields.desc") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('product.placeholders.desc')")
                  textarea.input-text(v-model="model.description", type="text", v-form-ctrl, name="description", maxlength="250", required, lazy)
                .form-tips.form-tips-error(v-if="validation.$submitted && validation.description.$pristine")
                  span(v-if="validation.description.$error.required") {{ $t('validation.required', {field: $t('product.fields.desc')}) }}
                .form-tips.form-tips-error(v-if="validation.description.$dirty")
                  span(v-if="validation.description.$error.required") {{ $t('validation.required', {field: $t('product.fields.desc')}) }}
                  span(v-if="validation.description.$error.maxlength")  {{ $t('validation.maxlength', [ $t('product.fields.name'), 250]) }}
            .form-row
              label.form-control {{ $t("product.fields.link_type") }}:
              .controls
                .select
                  select(v-model="model.link_type", v-form-ctrl, name="link_type")
                    option(v-for="type in deviceTypes", :value="$index+1", :selected="$index===0") {{type}}
            .form-actions
              button.btn.btn-primary.btn-lg(type="submit") {{ $t("common.add") }}

</template>

<script>
  import Vue from 'vue';
  import api from '../../api';
  import productsStore from '../../stores/products';
  import locales from '../../consts/locales';

  module.exports = {
    name: 'CreateProductForm',

    data: function () {
      return {
        deviceTypes: locales[Vue.config.lang].deviceTypes,
        model: {},
        validation: {},
        state: productsStore.state
      };
    },

    methods: {
      onSubmit: function () {
        var self = this;
        if (this.validation.$valid) {
          api.corp.refreshToken().then(function () {
            api.product.createProduct(self.model).then(function (data) {
              if (__DEBUG__) {
                console.log(data);
              }
              productsStore.addProduct(data);
              self.$route.router.go({path: '/products/' + data.id});
            }).catch(function (error) {
              self.handleError(error);
            });
          });
        }
      }
    }
  };
</script>
