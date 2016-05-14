<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/plugins/recipe/ingredient'}"><i class="fa fa-arrow-circle-left"></i>食材管理</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>添加食材</h2>
        </div>
        <div class="panel-bd">
          <div class="form">
            <form v-form name="validation" @submit.prevent="onSubmit">
              <div class="form-row row">
                <label class="form-control col-4">{{ $t("ui.ingredient.fields.name") }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.ingredient.placeholders.name')" class="input-text-wrap">
                    <input v-model="model.name" type="text" v-form-ctrl name="name" maxlength="250" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
                  </div>
                  <div v-if="validation.$submitted && validation.name.$pristine" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.ingredient.fields.name')}) }}</span></div>
                  <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('ui.validation.required', {field: $t('ui.ingredient.fields.name')}) }}</span><span v-if="validation.name.$error.maxlength">{{ $t('ui.validation.maxlength', [ $t('ui.ingredient.fields.name'), 250]) }}</span><span v-if="validation.name.$error.customValidator">{{ $t('ui.validation.format', {field: $t('ui.ingredient.fields.name')}) }}</span></div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-4">{{ $t("ui.ingredient.fields.images") }}:</label>
                <div class="controls col-18 controls-image">
                  <div class="image-uploader">
                    <image-uploader v-for="n in model.images.length" :image.sync="model.images[n]"></image-uploader>
                  </div>
                  <div class="form-tips">建议上传640像素*480像素成品图</div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-4">{{ $t("ui.ingredient.fields.classification") }}:</label>
                <div class="controls col-18">
                  <div class="select-group">
                    <div v-for="category in model.classification" class="select">
                      <v-select width="150px" :label="category.main">
                        <select v-model="category.main">
                          <option v-for="option in categories | dropSlected model.classification category 'main'" :value="option.main">{{ option.main }}</option>
                        </select>
                      </v-select>
                      <span @click="delSelected(model.classification, category)" class="fa fa-times"></span>
                    </div>
                  </div>
                  <button @click.prevent="AddCategory" :disabled="model.classification.length === categories.length" :class="{'disabled': model.classification.length === categories.length}" class="btn btn-success"><i class="fa fa-plus"></i>添加类别</button>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-4">{{ $t("ui.ingredient.fields.push_rules") }}:</label>
                <div class="controls col-18">
                  <div class="select-group">
                    <div v-for="rule in model.properties.push_rules" class="select">
                      <v-select width="150px" :label="rule">
                        <select v-model="rule">
                          <option v-for="option in rules | dropSlected model.properties.push_rules rule" :value="option">{{ option }}</option>
                        </select>
                      </v-select>
                      <span @click="delSelected(model.properties.push_rules, rule)" class="fa fa-times"></span>
                    </div>
                  </div>
                  <button @click.prevent="AddRule" :disabled="model.properties.push_rules.length === rules.length" :class="{'disabled': model.properties.push_rules.length === rules.length}" class="btn btn-success"><i class="fa fa-plus"></i>添加推送</button>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-4">{{ $t("ui.ingredient.fields.instructions") }}:</label>
                <div class="controls col-18">
                  <div v-placeholder="$t('ui.ingredient.placeholders.instructions')" class="input-text-wrap">
                    <textarea v-model="model.instructions" type="text" name="instructions" maxlength="250" lazy class="input-text textarea-lg"></textarea>
                  </div>
                </div>
              </div>
              <div class="form-actions row">
                <div class="col-offset-4">
                  <button type="submit" :disabled="adding" :class="{'disabled': adding}" class="btn btn-primary btn-lg">{{ $t("common.save") }}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import api from '../../../../api'
  import ImageUploader from '../../../../components/ImageUploader'
  import Select from '../../../../components/Select'
  import _ from 'lodash/array'
  import { globalMixins } from '../../../../mixins'

  export default {
    name: 'AddIngredientForm',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'image-uploader': ImageUploader,
      'v-select': Select
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
        categories: [],
        adding: false
      }
    },

    route: {
      data () {
        // 获取食材分类
        this.getCategories()

        // 获取推送规则
        this.getRules()
      }
    },

    computed: {
      categoryOptions () {
        return _.differenceBy(this.categories, this.model.classification, 'main')
      },

      ruleOptions () {
        return _.difference(this.rules, this.model.properties.push_rules)
      }
    },

    methods: {
      /**
       * 获取分类
       */
      getCategories () {
        // this.categories = [{main: '蔬菜', sub: ['叶菜', '块茎']}, {main: '水果', sub: []}]
        api.diet.listCategory('ingredient_classification').then((res) => {
          if (res.data.value !== undefined) {
            this.categories = res.data.value
          } else {
            this.categories = []
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 获取规则
       */
      getRules () {
        api.diet.listCategory('push_rules').then((res) => {
          if (res.data.value !== undefined) {
            this.rules = res.data.value
          } else {
            this.rules = []
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 添加类别
       */
      AddCategory () {
        var newCate = {sub: []}
        newCate.main = this.categoryOptions[0].main
        this.model.classification.push(newCate)
      },

      /**
       * 添加推送规则
       */
      AddRule () {
        var newRule = this.ruleOptions[0]
        this.model.properties.push_rules.push(newRule)
      },

      /**
       * 删除已选
       * @return {[type]} [description]
       */
      delSelected (arr, obj) {
        arr.$remove(obj)
      },

      /**
       * 添加食材表单提交
       */
      onSubmit () {
        if (this.validation.$valid && !this.adding) {
          this.adding = true
          api.diet.addIngredient(this.model).then((res) => {
            if (res.status === 200) {
              this.showNotice({
                type: 'success',
                content: '食材添加成功！'
              })
              this.$route.router.go({path: '/plugins/recipe/ingredient'})
            }
          }).catch((res) => {
            this.handleError(res)
            this.adding = false
          })
        }
      }
    }
  }
</script>
