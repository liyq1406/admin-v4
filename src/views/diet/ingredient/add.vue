<template lang="jade">
section.main-wrap
  .main
    .breadcrumb
      a(v-link="{path: '/diet/ingredient'}")
        i.fa.fa-arrow-circle-left
        | 食材管理
    .panel
      .panel-hd
        h2 添加食材
        //- pre {{model | json}}
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
                    span.fa.fa-times(@click="delSelected(model.classification, category)")
                button.btn.btn-success(@click.prevent="AddCategory", :disabled="model.classification.length === categories.length", :class="{'disabled': model.classification.length === categories.length}")
                  i.fa.fa-plus
                  | 添加类别
            .form-row
              label.form-control {{ $t("ingredient.fields.push_rules") }}:
              .controls
                .select-group
                  .select(v-for="rule in model.properties.push_rules")
                    select(v-model="rule")
                      option(v-for="opt in rules | dropSlected model.properties.push_rules rule", :value="opt", :selected="opt===rule") {{opt}}
                    span.fa.fa-times(@click="delSelected(model.properties.push_rules, rule)")
                button.btn.btn-success(@click.prevent="AddRule", :disabled="model.properties.push_rules.length === rules.length", :class="{'disabled': model.properties.push_rules.length === rules.length}")
                  i.fa.fa-plus
                  | 添加推送
            .form-row
              label.form-control {{ $t("ingredient.fields.instructions") }}:
              .controls
                .input-text-wrap(v-placeholder="$t('ingredient.placeholders.instructions')")
                  textarea.input-text(v-model="model.instructions", type="text", name="instructions", maxlength="250", lazy)
            .form-actions
              button.btn.btn-primary.btn-lg(type="submit") {{ $t("common.save") }}
</template>

<script>
import api from '../../../api';
import ImageUploader from '../../../components/image-uploader.vue';
import _ from 'lodash/array';

export default {
  name: 'AddIngredientForm',

  components: {
    'image-uploader': ImageUploader
  },

  data () {
    return {
      model: {
        name: '',
        images: [''],
        classification: [],
        properties: {
          push_rules: []
        },
        instructions: ''
      },
      rules: [],
      validation: {},
      categories: []
    };
  },

  route: {
    data () {
      // 获取食材分类
      this.getCategories();

      // 获取推送规则
      this.getRules();
    }
  },

  computed: {
    categoryOptions () {
      return _.differenceBy(this.categories, this.model.classification, 'main');
    },

    ruleOptions () {
      return _.difference(this.rules, this.model.properties.push_rules);
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
          this.categories = data.value;
        } else {
          this.categories = [];
        }
      }).catch((error) => {
        this.handleError(error);
      });
    },

    /**
     * 获取规则
     */
    getRules () {
      api.diet.listCategory('push_rules').then((data) => {
        if (data.value !== undefined) {
          this.rules = data.value;
        } else {
          this.rules = [];
        }
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
     * 添加推送规则
     */
    AddRule () {
      var newRule = this.ruleOptions[0];
      this.model.properties.push_rules.push(newRule);
    },

    /**
     * 删除已选
     * @return {[type]} [description]
     */
    delSelected (arr, obj) {
      arr.$remove(obj);
    },

    /**
     * 添加食材表单提交
     */
    onSubmit () {
      var self = this;
      if (this.validation.$valid) {
        api.diet.addIngredient(this.model).then(function (data) {
          alert('食材添加成功！');
          self.$route.router.go({path: '/diet/ingredient'});
        }).catch(function (error) {
          self.handleError(error);
        });
      }
    }
  }
};
</script>
