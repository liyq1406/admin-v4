<template lang="jade">
section.main-wrap
  .main
    .breadcrumb
      a(v-link="{path: '/diet/ingredient'}")
        i.fa.fa-arrow-circle-left
        | 食材管理
    .panel
      .panel-hd
        h2 编辑食材
      .panel-bd
        .form
          form(v-form, name="validation", @submit.prevent="onSubmit")
            .form-row
              label.form-control {{ $t("ingredient.fields.name") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('ingredient.placeholders.name')")
                  input.input-text(v-model="model.name", type="text", v-form-ctrl, name="name", maxlength="250", required, custom-validator="noSpacesPrefixAndSuffix", lazy)
                .form-tips.form-tips-error(v-if="validation.$submitted && validation.name.$pristine")
                  span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('ingredient.fields.name')}) }}
                .form-tips.form-tips-error(v-if="validation.name.$dirty")
                  span(v-if="validation.name.$error.required") {{ $t('validation.required', {field: $t('ingredient.fields.name')}) }}
                  span(v-if="validation.name.$error.maxlength") {{ $t('validation.maxlength', [ $t('ingredient.fields.name'), 250]) }}
                  span(v-if="validation.name.$error.customValidator") {{ $t('validation.format', {field: $t('ingredient.fields.name')}) }}
            .form-row
              label.form-control {{ $t("ingredient.fields.images") }}:
              .controls.controls-image
                .image-uploader
                  image-uploader(v-for="n in model.images.length", :image.sync="model.images[n]")
                .form-tips 建议上传640像素*480像素成品图
            .form-row
              label.form-control {{ $t("ingredient.fields.classification") }}:
              .controls
                .select-group
                  .select(v-for="category in model.classification")
                    select(v-model="category.main")
                      option(v-for="opt in categories | dropSlected model.classification category 'main'", :value="opt.main", :selected="opt.main===category.main") {{opt.main}}
                    span.fa.fa-times(@click="delCategory(category)")
                button.btn.btn-success(@click.prevent="AddCategory", :disabled="model.classification.length === categories.length", :class="{'disabled': model.classification.length === categories.length}")
                  i.fa.fa-plus
                  | 添加类别
            .form-row
              label.form-control {{ $t("ingredient.fields.instructions") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('ingredient.placeholders.instructions')")
                  textarea.input-text(v-model="model.instructions", type="text", v-form-ctrl, name="instructions", maxlength="250", lazy)
                .form-tips.form-tips-error(v-if="validation.instructions.$dirty")
                  span(v-if="validation.instructions.$error.maxlength")  {{ $t('validation.maxlength', [ $t('ingredient.fields.instructions'), 250]) }}
            .form-actions
              button.btn.btn-primary.btn-lg(type="submit") {{ $t("common.save") }}
    .panel
      .panel-bd
        button.btn.btn-primary.btn-lg.mt10.mb10(@click.prevent="deleteIngredient") {{ $t('ingredient.del') }}
</template>

<script>
import api from '../../../api';
import ImageUploader from '../../../components/image-uploader.vue';
import _ from 'lodash';

export default {
  name: 'AddIngredientForm',

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
      categories: []
    };
  },

  route: {
    data () {
      // 获取目标食材
      this.getIngredient();
      // 获取分类
      this.getCategories();
    }
  },

  computed: {
    categoryOptions () {
      return _.differenceBy(this.categories, this.model.classification, 'main');
    }
  },

  methods: {
    /**
     * 获取分类
     */
    getCategories () {
      // this.categories = [{main: '蔬菜', sub: ['叶菜', '块茎']}, {main: '水果', sub: []}];
      api.diet.listCategory('ingredient_classification').then((data) => {
        if (data.value !== undefined) {
          this.categories = _.unionBy(this.model.classification, data.value, 'main');
          console.log(this.categories);
        } else {
          this.categories = this.model.classification;
        }
      }).catch((error) => {
        this.handleError(error);
      });
    },

    /**
     * 获取食材
     */
    getIngredient () {
      api.diet.getIngredient(this.$route.params.id).then((data) => {
        this.model.name = data.name;
        this.model.instructions = data.instructions;
        this.model.images = data.images;
        this.model.classification = data.classification;
      }).catch((error) => {
        this.handleError(error);
      });
    },

    /**
     * 添加类别
     */
    AddCategory () {
      var newCate = {sub: []};
      newCate.main = this.categoryOptions[0].main;
      this.model.classification.push(newCate);
    },

    /**
     * 删除已选类别
     * @return {[type]} [description]
     */
    delCategory (cate) {
      this.model.classification.$remove(cate);
    },

    /**
     * 编辑食材表单提交
     */
    onSubmit () {
      if (this.validation.$valid) {
        api.diet.updateIngredient(this.$route.params.id, this.model).then((data) => {
          alert('食材修改成功！');
          this.$route.router.go({path: '/diet/ingredient'});
        }).catch(function (error) {
          this.handleError(error);
        });
      }
    },

    /**
     * 删除食材
     */
    deleteIngredient () {
      if (confirm('确定要删除该食材吗？')) {
        api.diet.deleteIngredient(this.$route.params.id).then((data) => {
          this.$route.router.go({path: '/diet/ingredient'});
        }).catch((error) => {
          this.handleError(error);
        });
      }
    }
  }
};
</script>
