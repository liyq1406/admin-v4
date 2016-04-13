<template>
  <section class="main-wrap diet">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/diet/recipe'}"><i class="fa fa-arrow-circle-left"></i>菜谱管理</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>添加菜谱</h2>
        </div>
        <div class="panel-bd">
          <div class="form">
            <form v-form name="validation" @submit.prevent="onRecipeSubmit">
              <div class="form-row">
                <label class="form-control">{{ $t("recipe.fields.name") }}:</label>
                <div class="controls">
                  <div v-placeholder="'请填写菜谱名称'" class="input-text-wrap">
                    <input v-model="model.name" type="text" v-form-ctrl name="name" maxlength="250" required lazy class="input-text"/>
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
                  <div class="form-tips">建议上传640像素*480像素成品图，最多不超过3张</div>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">难度:</label>
                <div class="controls">
                  <div class="select-group">
                    <div class="select">
                      <select v-model="model.properties.difficulty" name="difficulty">
                        <option v-for="difficulty in difficulties" :value="difficulty" :selected="difficulty===model.properties.difficulty">{{ difficulty }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">{{ $t("ingredient.fields.classification") }}:</label>
                <div class="controls">
                  <div class="select-group">
                    <div v-for="category in model.classification" class="select">
                      <select v-model="category.main">
                        <option v-for="opt in categories | dropSlected model.classification category 'main'" :value="opt.main" :selected="opt.main===category.main">{{ opt.main }}</option>
                      </select><span @click="removeObj(category,model.classification)" class="fa fa-times"></span>
                    </div>
                  </div>
                  <button @click.prevent="addCategory" :disabled="model.classification.length === categories.length" :class="{'disabled': model.classification.length === categories.length}" class="btn btn-success"><i class="fa fa-plus"></i>添加类别</button>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">{{ $t("recipe.fields.instructions") }}:</label>
                <div class="controls">
                  <div v-placeholder="$t('recipe.placeholders.instructions')" class="input-text-wrap">
                    <textarea v-model="model.instructions" type="text" name="instructions" lazy class="input-text textarea-lg"></textarea>
                  </div>
                </div>
              </div>
              <div class="form-row ingredient-row">
                <label class="form-control">食材:</label>
                <div class="controls">
                  <table v-if="model.major_ingredients.length">
                    <tbody>
                      <tr v-for="ingredient in model.major_ingredients">
                        <td><span class="ingredient-name">{{ ingredient.name }}</span></td>
                        <td>
                          <div class="input-text-wrap inline">
                            <input type="text" placeholder="请填写用量" v-model="ingredient.unit" class="input-text-time"/>
                          </div><span @click="removeObj(ingredient,model.major_ingredients)" class="fa fa-times pointer"></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button @click.prevent="ingredientSelectModal.show=true" class="btn btn-success"><i class="fa fa-plus"></i>添加食材</button>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">烹饪设备:</label>
                <div class="controls">
                  <div v-for="cookingDevice in model.devices" class="select-group">
                    <div class="select inline">
                      <select v-model="cookingDevice">
                        <option v-for="opt in devices | dropSlected model.devices cookingDevice 'name'" :value="opt" :selected="opt.name===cookingDevice.name">{{ opt.name }}</option>
                      </select>
                    </div>
                    <div class="input-text-wrap inline">
                      <input type="text" v-model="cookingDevice.time" placeholder="请填写时长" class="input-text-time"/><span class="text-time">分钟</span>
                    </div>
                    <div class="delete-input inline"><span @click="removeObj(cookingDevice, model.devices)" class="fa fa-times pointer"></span></div>
                    <div class="input-text-wrap block mb20">
                      <textarea placeholder="请输入设备烹饪指令" v-model="cookingDevice.autoexec" type="text" class="input-text textarea-lg"></textarea>
                    </div>
                  </div>
                  <button @click.prevent="addCookingDevice" :disabled="model.devices.length === devices.length" :class="{'disabled': model.devices.length === devices.length}" class="btn btn-success"><i class="fa fa-plus"></i>添加烹饪设备</button>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">步骤:</label>
                <div class="controls">
                  <div class="alert-text">小提示：<br/>1、步骤图宽度在150像素至150像素；<br/>2、每个步骤用一段话描述，如果不需要可将内容留空；</div>
                  <div v-for="cooking_step in model.cooking_steps" class="step-box">
                    <label class="form-control">第{{ $index+1 }}步:</label>
                    <div class="controls controls-image">
                      <div class="image-uploader">
                        <image-uploader v-for="img in cooking_step.images" :image.sync="img"></image-uploader>
                      </div>
                    </div>
                    <div class="input-text-wrap step-text">
                      <textarea v-model="cooking_step.description" type="text" lazy placeholder="请填写步骤的描述" class="input-text"></textarea>
                    </div>
                    <div class="button-list">
                      <div v-show="model.cooking_steps.length>1&&$index>0" @click="handleStepEvent('MOVE_UP', cooking_step, $index)" class="control-button button-up"><i class="icon fa fa-long-arrow-up"></i></div>
                      <div v-show="model.cooking_steps.length>1&&$index<(model.cooking_steps.length-1)" @click="handleStepEvent('MOVE_DOWN', cooking_step, $index)" class="control-button button-down"><i class="icon fa fa-long-arrow-down"></i></div>
                      <div @click="handleStepEvent('ADD', cooking_step, $index)" class="control-button button-add"><i class="icon fa fa-plus"></i></div>
                      <div v-show="model.cooking_steps.length>1" @click="handleStepEvent('DEL', cooking_step, $index)" class="control-button button-del"><i class="icon fa fa-times"></i></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-row">
                <label class="form-control">{{ $t('recipe.fields.tips') }}:</label>
                <div class="controls">
                  <div v-placeholder="$t('recipe.placeholders.tips')" class="input-text-wrap">
                    <textarea v-model="model.tips" type="text" name="tips" lazy class="input-text textarea-lg"></textarea>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" :disabled="adding" :class="{'disabled': adding}" class="btn btn-primary btn-lg">{{ $t("common.save") }}</button>
              </div>
            </form>
          </div>
          <modal :show.sync="ingredientSelectModal.show" :width="800">
            <h3 slot="header">选择食材</h3>
            <div slot="body" class="ingredient-box">
              <div class="status-bar">
                <v-select :options="ingredientCategoryOptions" :value.sync="ingredientSelectModal.category" @select="getIngredients"><span>类别：</span></v-select>
                <search-box :key.sync="ingredientSelectModal.query" :active="ingredientSelectModal.searching" :placeholder="$t('ingredient.placeholders.search')" @cancel="getIngredients" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getIngredients">
                  <button slot="search-button" @click="getIngredients" class="btn btn-primary">{{ $t('common.search') }}</button>
                </search-box>
              </div>
              <div class="ingredient-list clearfix mb20">
                <div class="to-select-list">
                  <table class="table table-stripe table-bordered">
                    <thead>
                      <tr>
                        <th>标题</th>
                        <th class="tac">{{ $t('common.action') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-if="filteredIngredientList.length > 0 && !ingredientSelectModal.loadingData">
                        <tr v-for="ingredient in filteredIngredientList">
                          <td><span>{{ ingredient.name }}</span></td>
                          <td class="tac w70"><a v-show="!ingredient.selected" @click.stop="addIngredient(ingredient)" class="btn-link">添加</a><span v-show="ingredient.selected">已添加</span></td>
                        </tr>
                      </template>
                      <tr v-if="ingredientSelectModal.loadingData">
                        <td colspan="2" class="tac">
                          <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
                        </td>
                      </tr>
                      <tr v-if="filteredIngredientList.length === 0 && !ingredientSelectModal.loadingData">
                        <td colspan="2" class="tac">
                          <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <pager v-if="!ingredientSelectModal.loadingData && ingredientSelectModal.total > ingredientSelectModal.pageCount" :total="ingredientSelectModal.total" :current.sync="ingredientSelectModal.currentPage" :page-count="ingredientSelectModal.pageCount" @page-update="getIngredients"></pager>
                </div>
                <div class="selected-list">
                  <h3>已选择</h3>
                  <ul>
                    <li v-for="selectedIngredient in ingredientSelectModal.selectedIngredientList"><span>{{ selectedIngredient.name }}</span><i @click="deleteIngredient(selectedIngredient)" class="fa fa-times-circle"></i></li>
                  </ul>
                </div>
              </div>
              <div class="button-box">
                <div class="form-actions">
                  <button @click.prevent.stop="ingredientSelectModal.show=false" class="btn btn-default">{{ $t("common.cancel") }}</button>
                  <button type="submit" :disabled="ingredientSelectModal.adding" :class="{'disabled':ingredientSelectModal.adding}" v-text="ingredientSelectModal.adding ? $t('common.handling') : $t('common.ok')" @click.prevent.stop="confirmSelected" class="btn btn-primary"></button>
                </div>
              </div>
            </div>
          </modal>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../../../api'
import Modal from '../../../components/Modal'
import Pager from '../../../components/Pager'
import Select from '../../../components/Select'
import SearchBox from '../../../components/SearchBox'
import ImageUploader from '../../../components/ImageUploader'
import _ from 'lodash'

export default {
  name: 'AddForm',

  components: {
    'v-select': Select,
    'search-box': SearchBox,
    'pager': Pager,
    'modal': Modal,
    'image-uploader': ImageUploader
  },
  data () {
    return {
      validation: {},
      model: {
        name: '',
        classification: [],
        major_ingredients: [],
        minor_ingredients: [],
        cooking_steps: [{
          description: '',
          time: '',
          images: ['']
        }],
        properties: {
          difficulty: '不限'
        },
        devices: [],
        tags: [],
        tips: '',
        difficulties: [],
        images: ['', '', ''],
        instructions: ''
      },
      difficulties: ['不限', '新手', '初级', '中级', '高级', '厨神'],
      devices: [
        {id: '0', name: '电饭煲', autoexec: '', time: ''},
        {id: '1', name: '云炖锅', autoexec: '', time: ''},
        {id: '2', name: '隔水炖', autoexec: '', time: ''},
        {id: '3', name: '电水壶', autoexec: '', time: ''}
      ],
      ingredientSelectModal: {
        show: false,
        adding: false,
        searching: false,
        category: 'all',
        pageCount: 10,
        currentPage: 1,
        total: 0,
        loadingData: false,
        query: '',
        ingredientList: [],
        selectedIngredientList: []
      },
      categories: [],
      ingredientCategories: [],
      adding: false
    }
  },

  computed: {
    categoryOptions () {
      return _.differenceBy(this.categories, this.model.classification, 'main')
    },

    deviceOptions () {
      return _.differenceBy(this.devices, this.model.devices, 'name')
    },

    /**
     * 构建食材分类选项
     * @return {Array} 分类选项
     */
    ingredientCategoryOptions () {
      var arr = [{label: '全部', value: 'all'}]
      this.ingredientCategories.map((item) => {
        let obj = {}
        obj.label = item.main
        obj.value = item.main
        arr.push(obj)
      })
      return arr
    },

    /**
     * 食材查询条件
     * @return {Object} 查询条件
     */
    queryCondition () {
      var condition = {
        filter: ['_id', 'name', 'classification'],
        limit: this.ingredientSelectModal.pageCount,
        offset: (this.ingredientSelectModal.currentPage - 1) * this.ingredientSelectModal.pageCount,
        query: {},
        order: {
          created_at: 'desc'
        }
      }

      if (this.ingredientSelectModal.query.length > 0) {
        condition.query['name'] = { $like: this.ingredientSelectModal.query }
      }

      if (this.ingredientSelectModal.category === 'all') {
        delete condition.query['classification.main']
      } else {
        condition.query['classification.main'] = { $in: [this.ingredientSelectModal.category] }
      }
      return condition
    },

    filteredIngredientList () {
      var list = this.ingredientSelectModal.ingredientList.map((item) => {
        var flag = false
        this.model.major_ingredients.map((ingredient) => {
          if (ingredient.name === item.name) {
            flag = true
          }
        })
        this.ingredientSelectModal.selectedIngredientList.map((ingredient) => {
          if (ingredient.name === item.name) {
            flag = true
          }
        })
        item.selected = flag
        return item
      })
      return list
    }
  },

  route: {
    data () {
      // 获取所有菜谱分类
      this.getCategories()
      // 获取所有食材分类
      this.getIngredientCategories()
      // 获取所有食材
      this.getIngredients()
    }
  },

  methods: {
    /**
     * 获取菜谱分类
     */
    getCategories () {
      // this.categories = [{main: '蔬菜', sub: ['叶菜', '块茎']}, {main: '水果', sub: []}]
      api.diet.listCategory('recipe_classification').then((res) => {
        if (typeof res.data.value !== 'undefined') {
          this.categories = res.data.value
        } else {
          this.categories = []
        }
      }).catch((error) => {
        this.handleError(error)
      })
    },

    /**
     * 获取食材分类
     */
    getIngredientCategories () {
      api.diet.listCategory('ingredient_classification').then((res) => {
        if (typeof res.data.value !== 'undefined') {
          this.ingredientCategories = res.data.value
        } else {
          this.ingredientCategories = []
        }
      }).catch((error) => {
        this.handleError(error)
      })
    },

    /**
     * 获取食材列表
     */
    getIngredients () {
      this.ingredientSelectModal.loadingData = true
      api.diet.listIngredient(this.queryCondition).then((res) => {
        // 食材列表
        this.ingredientSelectModal.ingredientList = res.data.list.map((item) => {
          item.selected = false
          return item
        })
        this.ingredientSelectModal.total = res.data.total
        this.ingredientSelectModal.loadingData = false
      }).catch((error) => {
        this.handleError(error)
        this.ingredientSelectModal.loadingData = false
      })
    },

    /**
     * 添加菜谱类别
     */
    addCategory () {
      var newCate = {sub: []}
      newCate.main = this.categoryOptions[0].main
      this.model.classification.push(newCate)
    },

    /**
     * 添加烹饪设备
     */
    addCookingDevice () {
      this.model.devices.push(this.deviceOptions[0])
    },

    /**
     * 菜谱步骤右边四个小操作按钮的事件
     * @param  {[type]} step      当前操作的步骤对象
     * @param  {[type]} index     当前操作的步骤index
     * @param  {[type]} eventType 事件类型，用来区分四个按钮的四个事件
     * @return {[type]}           无返回
     */
    handleStepEvent (eventType, step, index) {
      var newstep = {
        description: '',
        time: 0,
        images: ['']
      }
      switch (eventType) {
        case 'MOVE_UP':
          this.model.cooking_steps.splice(index, 1)
          this.model.cooking_steps.splice(index - 1, 0, step)
          break
        case 'MOVE_DOWN':
          this.model.cooking_steps.splice(index, 1)
          this.model.cooking_steps.splice(index + 1, 0, step)
          break
        case 'ADD':
          this.model.cooking_steps.splice(index + 1, 0, newstep)
          break
        case 'DEL':
          this.model.cooking_steps.$remove(step)
          break
        default:
          break
      }
    },

    /**
     * 通用删除事件
     * @param  {Object} obj 要删除的对象
     * @param  {Array}  arr 要删除的对象的父数组
     */
    removeObj (obj, arr) {
      arr.$remove(obj)
    },

    /**
     * 确定已选食材
     */
    confirmSelected () {
      this.ingredientSelectModal.adding = true
      this.ingredientSelectModal.selectedIngredientList.map((item) => {
        var newIngredient = {}
        newIngredient._id = item._id
        newIngredient.classification = item.classification
        newIngredient.name = item.name
        this.model.major_ingredients.push(newIngredient)
      })
      this.ingredientSelectModal.selectedIngredientList = []
      this.ingredientSelectModal.show = false
      this.ingredientSelectModal.adding = false
    },

    /**
     * 添加食材操作
     * @param {Object} ingredient 食材
     */
    addIngredient (ingredient) {
      this.ingredientSelectModal.selectedIngredientList.push(ingredient)
    },

    /**
     * 添加食材弹出浮层的删除事件
     * @param {Object} ingredient 食材
     */
    deleteIngredient (ingredient) {
      this.ingredientSelectModal.selectedIngredientList.$remove(ingredient)
    },

    // 搜索
    handleSearch () {
      if (this.ingredientSelectModal.query.length === 0) {
        this.getIngredients()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.ingredientSelectModal.searching = !this.ingredientSelectModal.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getIngredients()
    },

    /**
     * 菜谱表单提交
     */
    onRecipeSubmit () {
      if (this.validation.$valid && !this.adding) {
        this.adding = true
        this.model.images = _.compact(this.model.images)
        api.diet.addRecipe(this.model).then((res) => {
          if (res.status === 200) {
            window.alert('菜谱添加成功！')
            this.$route.router.go({path: '/diet/recipe'})
          }
        }).catch((error) => {
          this.handleError(error)
          this.ingredientSelectModal.loadingData = false
          this.adding = false
        })
      }
    }
  }
}
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .inline
    display inline-block
  .block
    display block
  .pointer
    cursor pointer
  .diet
    .panel
      .panel-bd
        .form-row
          max-height 5000px
          .prompt-box
            width 100%
            height auto
            margin 0 auto 10px
            border 1px solid #ccc
            box-sizing border-box
            padding 10px
          .step-box
            margin-top 20px
            width 100%
            position relative
            clearfix()
            label.form-control
              float left
              text-align right
              width 70px
              line-height 120px
              padding-right 20px
              box-sizing border-box
            .controls-image
              float left
              width 182px
              min-width 182px
              overflow hidden

              .image-uploader-item
                margin-bottom 0
            .step-text
              float left
              width 50%
              box-sizing border-box
              height 120px
              .input-text
                height 100%
            .button-list
              position absolute
              left 100.5%
              height 120px
              opacity 0
              /*transition opacity ease 0.3s*/
              .control-button
                height 25px
                width 25px
                line-height 25px
                margin-bottom 6px
                background #999
                text-align center
                cursor pointer
                &:hover
                  background red
                i.icon
                  color #fff
            &:hover
              .button-list
                opacity 1
          .controls
            width 70%
            .select-group
              position relative
            .input-text-wrap
              input.input-text-time
                border 1px solid #d9d9d9
                display inline-block
                width 120px
                box-sizing border-box
                font-size 14px
                height 32px
                line-height 32px
                padding 6px 20px
                margin-right 10px
              span.text-time
                margin-right 10px

            .delete-input
              position absolute
              right 5px
              top 5px
              span.fa
                color #c0252e

        .ingredient-row
          table
            margin-top 0

            td
              padding 5px 0

          .ingredient-name
            margin-right 20px

          .fa-times
            color #c0252e
      .modal
        .modal-body
          clearfix()
          .status-bar
            padding 0
            border 0
            .v-select
              float left
              display inline-block
              padding-left 10px
            .search-box
              float right

      clearfix()

      .to-select-list
        width 65%
        float left

      .pager
        margin-top 10px

      .selected-list
        width 33%
        float right
        border 1px solid #e4e4e4
        box-sizing border-box
        background #FFF

        h3
          font-size 14px
          padding 0 20px
          line-height 35px
          margin 0
          border-bottom 1px solid #e4e4e4

        ul
          margin 0
          max-height 310px
          list-style none
          overflow auto

        li
          border-bottom 1px solid #e4e4e4
          font-size 12px
          position relative
          line-height 30px
          padding 0 20px

          .fa
            height 100%
            top 0
            line-height 30px

          &:nth-child(2n-1)
            background #F9F9F9

          &:last-child
            border-bottom none

    .button-box
      width 100%
      box-sizing border-box
      text-align right
      .btn
        margin-left 10px

</style>
