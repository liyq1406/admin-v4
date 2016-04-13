<template>
  <div class="recipe-box">
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <search-box :key.sync="query" :active="searching" :placeholder="$t('ingredient.placeholders.search')" @cancel="getRecipes" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getRecipes">
            <button slot="search-button" @click="getRecipes" class="btn btn-primary">{{ $t('common.search') }}</button>
          </search-box>
          <div class="action-group"><a v-link="{path: '/diet/recipe/add'}" class="btn btn-success"><i class="fa fa-plus"></i>添加菜谱</a>
            <button @click="showCategoryModal=true" class="btn btn-success"><i class="fa fa-list-ul"></i>类别管理</button>
          </div>
        </div>
        <div class="status-bar">
          <div class="status">{{{ $t('common.total_results', {count:total}) }}}</div>
          <v-select :options="categoryOptions" :value.sync="category" @select="getRecipes"><span>类别：</span></v-select>
          <v-select :options="deviceOptions" :value.sync="device" @select="getRecipes"><span>烹饪设备：</span></v-select>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>标题</th>
              <th>创建者</th>
              <th>创建时间</th>
              <th class="tac">{{ $t('common.action') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="recipes.length > 0 && !loadingData">
              <tr v-for="recipe in recipes">
                <td>{{ recipe.name }}<i v-if="hasCloudRecipe(recipe.devices)" style="color: #35AA47;" class="fa fa-cloud ml5"></i></td>
                <td>{{ recipe.created_by }}</td>
                <td>{{ recipe.created_at | formatDate }}</td>
                <td class="tac"><a v-link="{path: '/diet/recipe/'+recipe._id+'/edit'}" class="btn-link btn-sm">编辑</a></td>
              </tr>
            </template>
            <tr v-if="loadingData">
              <td colspan="4" class="tac">
                <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
              </td>
            </tr>
            <tr v-if="recipes.length === 0 && !loadingData">
              <td colspan="4" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
        <pager v-if="!loadingData && total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getRecipes"></pager>
      </div>
    </div>
    <!-- 类别管理浮层-->
    <modal :show.sync="showCategoryModal">
      <h3 slot="header">类别管理</h3>
      <div slot="body" class="form">
        <form @submit.prevent="onCateSubmit">
          <div class="form-row">
            <div class="form-tips mb10">请输入菜谱类别，每行一个类别</div>
            <div class="input-text-wrap">
              <textarea v-model="categories | formatCategories" rows="8" class="input-text"></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onCateCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
import api from '../../../api'
import Select from '../../../components/Select'
import Pager from '../../../components/Pager'
import Modal from '../../../components/Modal'
import SearchBox from '../../../components/SearchBox'

export default {
  name: 'IngredientList',

  components: {
    'v-select': Select,
    'modal': Modal,
    'search-box': SearchBox,
    'pager': Pager
  },

  data () {
    return {
      showCategoryModal: false,
      total: 0,
      query: '',
      recipes: [],
      searching: false,
      category: 'all',
      categories: [],
      device: 'all',
      deviceOptions: [
        {label: '全部', value: 'all'},
        {label: '隔水炖', value: '隔水炖'},
        {label: '云炖锅', value: '云炖锅'},
        {label: '电饭煲', value: '电饭煲'},
        {label: '电水壶', value: '电水壶'}
      ],
      currentPage: 1,
      pageCount: 10,
      loadingData: false
    }
  },

  computed: {
    /**
     * 构建菜谱分类选项
     * @return {Array} 分类选项
     */
    categoryOptions () {
      var arr = [{label: '全部', value: 'all'}]
      this.categories.map((item) => {
        let obj = {}
        obj.label = item.main
        obj.value = item.main
        arr.push(obj)
      })
      return arr
    },

    /**
     * 菜谱查询条件
     * @return {Object} 查询条件
     */
    queryCondition () {
      var condition = {
        filter: ['_id', 'name', 'classification', 'devices', 'created_by', 'created_at'],
        limit: this.pageCount,
        offset: (this.currentPage - 1) * this.pageCount,
        query: {},
        order: {
          created_at: 'desc'
        }
      }

      if (this.query.length > 0) {
        condition.query['name'] = { $like: this.query }
      }

      if (this.category === 'all') {
        delete condition.query['classification.main']
      } else {
        condition.query['classification.main'] = { $in: [this.category] }
      }

      if (this.device === 'all') {
        delete condition.query['devices.name']
      } else {
        condition.query['devices.name'] = { $in: [this.device] }
      }

      return condition
    }
  },

  route: {
    data () {
      // 获取菜谱类别
      this.getCategories()
      // 获取菜谱列表
      this.getRecipes()
    }
  },

  methods: {
    /**
     * 获取菜谱列表
     */
    getRecipes () {
      this.loadingData = true
      api.diet.listRecipe(this.queryCondition).then((res) => {
        if (res.status === 200) {
          // 菜谱列表
          this.recipes = res.data.list
          // 记录数
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((error) => {
        this.handleError(error)
        this.loadingData = false
      })
    },

    /**
     * 获取分类
     */
    getCategories () {
      // this.categories = [{main: '粤菜', sub: ['客家菜', '顺德菜']}, {main: '东北菜', sub: []}]
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
     * 取消类别编辑
     */
    onCateCancel () {
      this.editing = false
      this.showCategoryModal = false
      // this.getCategories()
    },

    /**
     * 提交类别编辑
     */
    onCateSubmit () {
      this.editing = true
      api.diet.updateCategory('recipe_classification', this.categories).then((res) => {
        if (res.status === 200) {
          this.onCateCancel()
        }
      }).catch((error) => {
        this.onCateCancel()
        this.handleError(error)
      })
    },

    // 搜索
    handleSearch () {
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
    },

    /**
     * 判断是否带有云菜谱
     * @param  {Array}   devices 菜谱设备
     * @return {Boolean}         是否带有云菜谱
     */
    hasCloudRecipe (devices) {
      let flag = false
      devices.map((item) => {
        if (item.autoexec.length) {
          flag = true
        }
      })
      return flag
    }
  }
}
</script>

<style lang="stylus" scoped>
.recipe-box
  .v-select
    display inline-block
    margin-right 30px

.form
  .input-text-wrap
    textarea.input-text
      height 200px
</style>
