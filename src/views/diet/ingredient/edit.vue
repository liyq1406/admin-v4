<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/diet/ingredient'}"><i class="fa fa-arrow-circle-left"></i>食材管理</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>编辑食材</h2>
        </div>
        <div class="panel-bd">
          <div class="form">
            <form v-form name="validation" @submit.prevent="onSubmit">
              <div class="form-row">
                <label class="form-control">{{ $t("ingredient.fields.name") }}:</label>
                <div class="controls">
                  <div v-placeholder="$t('ingredient.placeholders.name')" class="input-text-wrap">
                    <input v-model="model.name" type="text" v-form-ctrl name="name" maxlength="250" required custom-validator="noSpacesPrefixAndSuffix" lazy class="input-text"/>
                  </div>
                  <div v-if="validation.$submitted && validation.name.$pristine" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('validation.required', {field: $t('ingredient.fields.name')}) }}</span></div>
                  <div v-if="validation.name.$dirty" class="form-tips form-tips-error"><span v-if="validation.name.$error.required">{{ $t('validation.required', {field: $t('ingredient.fields.name')}) }}</span><span v-if="validation.name.$error.maxlength">{{ $t('validation.maxlength', [ $t('ingredient.fields.name'), 250]) }}</span><span v-if="validation.name.$error.customValidator">{{ $t('validation.format', {field: $t('ingredient.fields.name')}) }}</span></div>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">{{ $t("ingredient.fields.images") }}:</label>
                <div class="controls controls-image">
                  <div class="image-uploader">
                    <image-uploader v-for="n in model.images.length" :image.sync="model.images[n]"></image-uploader>
                  </div>
                  <div class="form-tips">建议上传640像素*480像素成品图</div>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">{{ $t("ingredient.fields.classification") }}:</label>
                <div class="controls">
                  <div class="select-group">
                    <div v-for="category in model.classification" class="select">
                      <select v-model="category.main">
                        <option v-for="opt in categories | dropSlected model.classification category 'main'" :value="opt.main" :selected="opt.main===category.main">{{ opt.main }}</option>
                      </select><span @click="delSelected(model.classification, category)" class="fa fa-times"></span>
                    </div>
                  </div>
                  <button @click.prevent="AddCategory" :disabled="model.classification.length === categories.length" :class="{'disabled': model.classification.length === categories.length}" class="btn btn-success"><i class="fa fa-plus"></i>添加类别</button>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">{{ $t("ingredient.fields.push_rules") }}:</label>
                <div class="controls">
                  <div class="select-group">
                    <div v-for="rule in model.properties.push_rules" class="select">
                      <select v-model="rule">
                        <option v-for="opt in rules | dropSlected model.properties.push_rules rule" :value="opt" :selected="opt===rule">{{ opt }}</option>
                      </select><span @click="delSelected(model.properties.push_rules, rule)" class="fa fa-times"></span>
                    </div>
                  </div>
                  <button @click.prevent="AddRule" :disabled="model.properties.push_rules.length === rules.length" :class="{'disabled': model.properties.push_rules.length === rules.length}" class="btn btn-success"><i class="fa fa-plus"></i>添加推送</button>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">{{ $t("ingredient.fields.instructions") }}:</label>
                <div class="controls">
                  <div v-placeholder="$t('ingredient.placeholders.instructions')" class="input-text-wrap">
                    <textarea v-model="model.instructions" type="text" v-form-ctrl name="instructions" maxlength="250" lazy class="input-text textarea-lg"></textarea>
                  </div>
                  <div v-if="validation.instructions.$dirty" class="form-tips form-tips-error"><span v-if="validation.instructions.$error.maxlength"> {{ $t('validation.maxlength', [ $t('ingredient.fields.instructions'), 250]) }}</span></div>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" :disabled="editing" :class="{'disabled': editing}" class="btn btn-primary btn-lg">{{ $t("common.save") }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-bd">
          <button @click.prevent="deleteIngredient" class="btn btn-primary btn-lg mt10 mb10">{{ $t('ingredient.del') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import api from '../../../api'
  import ImageUploader from '../../../components/ImageUploader'
  import _ from 'lodash'
  import { globalMixins } from '../../../mixins'

  export default {
    name: 'AddIngredientForm',

    layout: 'admin',

    mixins: [globalMixins],

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
        validation: {},
        rules: [],
        categories: [],
        editing: false
      }
    },

    route: {
      data () {
        // 获取目标食材
        this.getIngredient()

        // 获取分类
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
          if (typeof res.data.value !== 'undefined') {
            this.categories = _.unionBy(this.model.classification, res.data.value, 'main')
          } else {
            this.categories = this.model.classification
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
          if (typeof res.data.value !== 'undefined') {
            this.rules = res.data.value
          } else {
            this.rules = []
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },

      /**
       * 获取食材
       */
      getIngredient () {
        api.diet.getIngredient(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.model.name = res.data.name
            this.model.instructions = res.data.instructions
            this.model.images = res.data.images
            this.model.classification = res.data.classification
            this.model.properties.push_rules = res.data.properties.push_rules
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
       * 编辑食材表单提交
       */
      onSubmit () {
        if (this.validation.$valid && !this.editing) {
          this.editing = true
          api.diet.updateIngredient(this.$route.params.id, this.model).then((res) => {
            if (res.status === 200) {
              window.alert('食材修改成功！')
              this.$route.router.go({path: '/diet/ingredient'})
            }
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },

      /**
       * 删除食材
       */
      deleteIngredient () {
        if (window.confirm('确定要删除该食材吗？')) {
          api.diet.deleteIngredient(this.$route.params.id).then((res) => {
            if (res.status === 200) {
              this.$route.router.go({path: '/diet/ingredient'})
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      }
    }
  }
</script>
