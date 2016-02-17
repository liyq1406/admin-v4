<template lang="jade">
section.main-wrap
  .main
    .breadcrumb
      a(v-link="{path: '/diet/food'}")
        i.fa.fa-arrow-circle-left
        | 食材管理
    .panel
      .panel-hd
        h2 添加食材
      .panel-bd
        .form
          form(v-form, name="validation", @submit.prevent="onSubmit")
            .form-row
              label.form-control {{ $t("food.fields.name") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('food.placeholders.name')")
                  input.input-text(v-model="model.name", type="text", v-form-ctrl, name="name", maxlength="250", required, custom-validator="noSpacesPrefixAndSuffix", lazy)
                .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                  span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('food.fields.name')}) }}
                .form-tips.form-tips-error(v-if="validation.name.$dirty")
                  span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('food.fields.name')}) }}
                  span(v-if="validation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('food.fields.name'), 250]) }}
                  span(v-if="validation.name.$error.customValidator") {{ $t('validation.format', {field: $t('food.fields.name')}) }}
            .form-row
              label.form-control {{ $t("food.fields.images") }}:
              .controls.controls-image
                .image-uploader
                  image-uploader(v-for="n in model.images.length", :image.sync="model.images[n]")
                .form-tips 建议上传640像素*480像素成品图，最多不超过3张
            .form-row
              label.form-control {{ $t("food.fields.classification") }}:
              .controls
                .select-group
                  .select
                    select(v-model="model.classification", v-form-ctrl, name="classification")
                      option(v-for="category in categories", :value="", :selected="$index===0") {{category}}
                    span.fa.fa-times
                  .select
                    select(v-model="model.classification", v-form-ctrl, name="classification")
                      option(v-for="category in categories", :value="", :selected="$index===0") {{category}}
                    span.fa.fa-times
                button.btn.btn-success
                  i.fa.fa-plus
                  | 添加类别
            .form-row
              label.form-control {{ $t("food.fields.instructions") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('food.placeholders.instructions')")
                  textarea.input-text(v-model="model.instructions", type="text", v-form-ctrl, name="instructions", maxlength="250", lazy)
                .form-tips.form-tips-error(v-if="validation.instructions.$dirty")
                  span(v-if="validation.instructions.$error.maxlength")  {{ $t('validation.maxlength', [ $t('food.fields.instructions'), 250]) }}
            .form-actions
              button.btn.btn-primary.btn-lg(type="submit") {{ $t("common.save") }}
</template>

<script>
import ImageUploader from '../../../components/image-uploader.vue';

export default {
  name: 'AddFoodForm',

  components: {
    'image-uploader': ImageUploader
  },

  data () {
    return {
      model: {
        name: '',
        classification: [],
        images: [''],
        instructions: ''
      },
      validation: {},
      categories: ['蔬菜', '水果']
    };
  },

  methods: {
    /**
     * 添加食材表单提交
     */
    onSubmit () {

    }
  }
};
</script>
