<template>
  <div class="menu-form">
    <div class="form with-loading">
      <!-- <div class="icon-loading" v-show="loadingData">
        <i class="fa fa-refresh fa-spin"></i>
      </div> -->
      <validator name="validation">
        <form autocomplete="off" novalidate @submit.prevent="onMenuSubmit">
          <div class="form-row row">
            <label class="form-control col-4"><i class="hl-red">*</i> 标题:</label>
            <div class="controls col-20">
              <div v-placeholder="'请输入标题'" class="input-text-wrap">
                <input v-model="model.name" type="text" name="model.name" v-validate:name="{required: true, maxlength: 50, format: 'trim'}" lazy class="input-text"/>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$validation.name.touched && $validation.name.required">{{ $t('common.validation.required', {field: '标题'}) }}</span>
                <span v-if="$validation.name.modified && $validation.name.maxlength">{{ $t('common.validation.maxlength', ['标题', 50]) }}</span>
                <span v-if="$validation.name.modified && $validation.name.format">标题前后不允许带空格</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4"><i class="hl-red">*</i> 摘要:</label>
            <div class="controls col-20">
              <div v-placeholder="'请输入摘要介绍'" class="input-text-wrap">
                <textarea v-model="model.instructions" type="text" name="model.instructions" v-validate:instructions="{required: true, maxlength: 200, format: 'trim'}" v-length-tip="{max: 200, model: model.instructions}" lazy class="input-text"></textarea>
              </div>
              <div class="form-tips form-tips-error">
                <span v-if="$validation.instructions.touched && $validation.instructions.required">{{ $t('common.validation.required', {field: '摘要介绍'}) }}</span>
                <span v-if="$validation.instructions.modified && $validation.instructions.maxlength">{{ $t('common.validation.maxlength', ['摘要介绍', 200]) }}</span>
                <span v-if="$validation.instructions.modified && $validation.instructions.format">摘要前后不允许带空格</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4"><i class="hl-red">*</i> 菜谱:</label>
            <div class="controls col-20">
              <!-- <a class="control-text hl-red" @click.prevent.stop="editRecipes">+ 编辑菜谱</a> -->
              <button class="btn btn-ghost btn-sm" @click.prevent.stop="editRecipes"><i class="fa" :class="{'fa-pencil-square-o': model.menu && model.menu.length, 'fa-plus': !(model.menu && model.menu.length)}"></i> {{ model.menu && model.menu.length ? '编辑' : '添加' }}菜谱</button>
              <div class="recipe-list" v-if="model.menu && model.menu.length">
                <div class="recipe-list-item" v-for="recipe in model.menu">
                  <span>{{ recipe.name }}</span>
                  <i class="fa fa-times" @click="removeRecipe(recipe, model.menu)"></i>
                </div>
              </div>
              <input v-model="model.menu" type="text" v-validate:menu="{required: true}" class="hidden">
              <div class="form-tips form-tips-error">
                <span v-if="$validation.menu.touched && $validation.menu.required">请添加菜谱</span>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-4">状态:</label>
            <div class="controls col-20">
              <div class="radio-group">
                <label class="radio">
                  <input type="radio" v-model="model.status" name="is_enable" :value="1"/>已发布
                </label>
                <label class="radio">
                  <input type="radio" v-model="model.status" name="is_enable" :value="0"/>待审核
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions row">
            <div class="col-offset-4">
              <button type="submit" :disabled="submitting" :class="{'disabled': submitting}" class="btn btn-primary btn-xlg">{{ $t("common.save") }}</button>
              <!-- <button @click.prevent.stop="showMask=true" class="btn btn-ghost btn-xlg">预览</button> -->
              <button @click.prevent="deleteMenu" class="btn btn-ghost btn-xlg" v-if="type==='edit'">{{ $t("common.del") }}</button>
            </div>
          </div>
        </form>
      </validator>
    </div>

    <!-- 添加菜谱浮层 Start -->
    <modal :show.sync="modal.show" width="640px">
      <h3 slot="header">添加菜谱</h3>
      <div slot="body">
        <div class="form">
          <x-table :headers="columns" :rows="recipeList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrentPageChange" @tbody-operation="addRecipe" :simple-page="true">
            <div class="filter-bar" slot="filter-bar">
              <div class="filter-group fr">
                <div class="filter-group-item">
                  <search-box
                    :key="query"
                    :active="searching"
                    :placeholder="$t('ui.ingredient.placeholders.search_condi')"
                    @cancel="getRecipes(true)"
                    @search-activate="toggleSearching"
                    @search-deactivate="toggleSearching"
                    @search="handleSearch"
                    @press-enter="getRecipes(true)">
                    <button slot="search-button" @click="getRecipes(true)" class="btn">{{ $t('common.search') }}</button>
                  </search-box>
                </div>
              </div>
              <h3>菜谱列表</h3>
            </div>
          </x-table>
          <div class="recipe-list">
            <h3>菜单</h3>
            <ul>
              <li class="recipe-list-item" v-for="recipe in modal.recipes">
                <span>{{ recipe.name }}</span>
                <i class="fa fa-times" @click="removeRecipe(recipe, modal.recipes)"></i>
              </li>
            </ul>
          </div>
          <div class="form-actions mt20">
            <button @click="onRecipesSubmit" :disabled="submitting" :class="{'disabled':submitting}" v-text="submitting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            <button @click.prevent.stop="onRecipesCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          </div>
        </div>
      </div>
    </modal>
    <!-- 添加菜谱浮层 End -->
  </div>
</template>

<script>
import api from 'api'
// import * as config from 'consts/config'
import { pluginMixins } from '../../../mixins'
export default {
  name: 'MenuForm',

  mixins: [pluginMixins],

  components: {
  },

  props: {
    type: {
      type: String,
      default: 'add'
    }
  },

  vuex: {
    getters: {
      currentMember: ({ system }) => system.currentMember
    }
  },

  data () {
    return {
      originModel: {
        name: '',
        instructions: '',
        menu: [],
        status: 0
      },
      model: {},
      submitting: false,
      isShowModal: false,
      columns: [{
        key: 'name',
        title: '标题'
      }, {
        key: 'creator',
        title: '作者',
        class: 'wp15'
      }, {
        key: 'type',
        title: '类型',
        class: 'wp15'
      }, {
        key: 'operation',
        title: '操作',
        class: 'tac wp15'
      }],
      query: '',
      recipes: [],
      modal: {
        show: false,
        recipes: []
      },
      searching: false,
      total: 0,
      currentPage: 1,
      countPerPage: 5,
      loadingData: false
    }
  },

  computed: {
    // 菜谱列表
    recipeList () {
      let result = []
      let types = ['普通菜谱', '智能菜谱']
      this.recipes.forEach((item) => {
        let typeIndex = item.type || 1
        result.push({
          name: item.name,
          creator: item.creator,
          type: types[typeIndex - 1],
          operation: item.added ? '<span class="hl-gray">已添加</span>' : '<a class="hl-red">+ 添加</a>',
          origin: item
        })
      })
      return result
    },

    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    /**
     * 菜谱查询条件
     * @return {Object} 查询条件
     */
    queryCondition () {
      var condition = {
        filter: ['name', 'creator', 'type'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {
          type: {
            $in: [1, 2]
          },
          status: 1
        },
        order: {
          create_time: -1
        }
      }

      // 搜索框中有关键词
      if (this.query.length > 0) {
        condition.query['name'] = {$regex: this.query, $options: 'i'}
      }

      return condition
    }
  },

  ready () {
    if (this.type === 'add') {
      this.model = _.clone(this.originModel)
    } else {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      var condition = {
        filter: [],
        limit: 1,
        offset: 0,
        query: {
          _id: this.$route.params.id
        }
      }
      api.recipes.getMenus(appId, token, condition).then((res) => {
        if (res.status === 200) {
          var data = res.data.list[0] ? res.data.list[0] : null
          this.model = data
          this.model.menu = data.menu
        }
      })
    }
  },

  methods: {
    /**
     * 添加菜谱
     * @author shengzhi
     * @param {Object} recipe 菜谱
     */
    addRecipe (recipe) {
      this.modal.recipes.push({
        id: recipe.origin._id,
        name: recipe.name
      })
      recipe.origin.added = true
    },

    /**
     * 移除菜谱
     * @author shengzhi
     * @param {Object} recipe 菜谱
     * @param {Array} recipes 菜谱列表
     */
    removeRecipe (recipe, recipes) {
      recipes.$remove(recipe)
      let recipeToRemove = _.find(this.recipes, (item) => {
        return item._id === recipe.id
      })
      if (recipeToRemove) {
        recipeToRemove.added = false
      }
    },

    /**
     * 编辑菜单
     */
    editRecipes () {
      this.modal.recipes = _.clone(this.model.menu)
      this.getRecipes()
      this.modal.show = true
    },

    /**
     * 取消菜谱提交
     * @author shengzhi
     */
    onRecipesCancel () {
      this.modal.show = false
      this.submitting = false
    },

    /**
     * 处理菜谱提交
     * @author shengzhi
     */
    onRecipesSubmit () {
      this.model.menu = this.modal.recipes
      this.modal.show = false
      this.submitting = false
    },

    /**
     * 处理表单提交
     * @author shengzhi
     */
    onMenuSubmit () {
      if (this.submitting) return

      if (this.$validation.invalid) {
        this.$validate(true)
        return
      }

      // 菜谱至少添加两个
      if (this.model.menu.length < 2) {
        this.showError('请至少添加2个菜谱')
        return
      }

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token
      let process
      let noticeCont = ({
        add: '菜单添加成功！',
        edit: '菜单修改成功！'
      })[this.type]

      this.submitting = true
      // 作者
      this.model.creator = this.currentMember.name
      if (this.type === 'edit') {
        process = api.recipes.editMenu(appId, this.$route.params.id, token, this.model)
      } else {
        process = api.recipes.addMenu(appId, token, this.model)
      }

      process.then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: noticeCont
          })
          this.$route.router.go({path: '/operation/plugins/recipes/' + this.$route.params.app_id + '/menus'})
        }
      }).catch((res) => {
        this.handleError(res)
        this.editing = false
      })
    },

    /**
     * 删除菜单
     */
    deleteMenu () {
      if (!window.confirm('确定要删除该菜单吗？')) return

      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      api.recipes.delMenu(appId, this.$route.params.id, token).then((res) => {
        if (res.status === 200) {
          this.showNotice({
            type: 'success',
            content: '菜单删除成功'
          })
          this.$route.router.go({path: `/operation/plugins/recipes/${this.$route.params.app_id}/menus`})
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 处理每页数量更新
     * @author shengzhi
     * @param {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
    },

    /**
     * 处理页码更新
     * @author shengzhi
     * @param {Number} page 页码
     */
    onCurrentPageChange (page) {
      this.currentPage = page
      this.getRecipes()
    },

    /**
     * 获取菜谱列表
     * @author shengzhi
     */
    getRecipes (reset) {
      let appId = this.$route.params.app_id
      // 从 localStorage 中获取app token
      let token = JSON.parse(window.localStorage.pluginsToken)[appId].token

      if (reset) {
        this.currentPage = 1
      }

      this.loadingData = true
      api.recipes.getRecipes(appId, token, this.queryCondition).then((res) => {
        if (res.status === 200) {
          // 虚拟数据开始----------------------------
          // res.data.list = [{
          //   _id: '1231safsdf',
          //   name: '西红柿鸡蛋汤',
          //   creator: 'Jon',
          //   create_time: '2016-12-07T12:34:54Z',
          //   pageviews: 1203,
          //   status: 1
          // }, {
          //   _id: '1231safsde',
          //   name: '咖喱饭',
          //   creator: 'Jon',
          //   create_time: '2016-12-07T12:34:54Z',
          //   pageviews: 1500,
          //   status: 0
          // }]
          // res.data.count = 2
          // 虚拟数据结束----------------------------

          // 菜谱列表
          this.recipes = res.data.list.map((item) => {
            item.added = false
            this.modal.recipes.forEach((recipe) => {
              if (recipe.id === item._id) {
                item.added = true
              }
            })
            return item
          })
          // 记录数
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    // 搜索
    handleSearch (val) {
      this.query = val
      if (this.query.length === 0) {
        this.getRecipes()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getRecipes()
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../../../assets/stylus/common'

.recipe-list
  h3
    font-size 12px
    font-weight normal
    margin 0 0 5px

  ul
    font-size 0

  .recipe-list-item
    position relative
    background #EEE
    display inline-block
    font-size 12px
    height 24px
    line-height 24px
    padding 0 29px 0 5px
    margin 5px 5px 0 0
    white-space nowrap

    .fa
      absolute right top
      size 24px
      line-height 24px
      text-align center

      &:hover
        cursor pointer
        background #DDD
        color red

.modal
  .recipe-list
    ul
      border 1px solid light-border-color
      padding 5px 5px 10px 10px
      min-height 53px
</style>
