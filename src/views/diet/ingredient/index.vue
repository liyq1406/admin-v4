<template>
  <div>
    <div class="panel">
      <div class="panel-bd">
        <div class="action-bar">
          <search-box :key.sync="query" :active="searching" :placeholder="$t('ingredient.placeholders.search')" @cancel="getIngredients" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getIngredients">
            <button slot="search-button" @click="getIngredients" class="btn btn-primary">{{ $t('common.search') }}</button>
          </search-box>
          <div class="action-group"><a v-link="{path: '/diet/ingredient/add'}" class="btn btn-success"><i class="fa fa-plus"></i>添加食材</a>
            <button @click="showCategoryModal=true" class="btn btn-success"><i class="fa fa-list-ul"></i>类别管理</button>
            <button @click="showPushModal=true" class="btn btn-success"><i class="fa fa-share"></i>推送管理</button>
          </div>
        </div>
        <div class="status-bar">
          <div class="status">{{{ $t('common.total_results', {count:total}) }}}</div>
          <v-select :options="categoryOptions" :value.sync="category" @select="getIngredients"><span>类别：</span></v-select>
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
            <template v-if="ingredients.length > 0 && !loadingData">
              <tr v-for="ingredient in ingredients">
                <td>{{ ingredient.name }}</td>
                <td>{{ ingredient.created_by }}</td>
                <td>{{ ingredient.created_at | formatDate }}</td>
                <td class="tac"><a v-link="{path: '/diet/ingredient/'+ingredient._id+'/edit'}" class="btn-link btn-sm">编辑</a></td>
              </tr>
            </template>
            <tr v-if="loadingData">
              <td colspan="4" class="tac">
                <div class="tips-null"><i class="fa fa-refresh fa-spin"></i><span>{{ $t("common.data_loading") }}</span></div>
              </td>
            </tr>
            <tr v-if="ingredients.length === 0 && !loadingData">
              <td colspan="4" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
        <pager v-if="!loadingData && total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getIngredients"></pager>
      </div>
    </div>
    <!-- 类别管理浮层-->
    <modal :show.sync="showCategoryModal">
      <h3 slot="header">类别管理</h3>
      <div slot="body" class="form">
        <form @submit.prevent="onCateSubmit">
          <div class="form-row">
            <div class="form-tips mb10">请输入食材类别，每行一个类别</div>
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
    <!-- 推送管理浮层-->
    <modal :show.sync="showPushModal">
      <h3 slot="header">推送管理</h3>
      <div slot="body" class="form">
        <form @submit.prevent="onPushSubmit">
          <div class="form-row">
            <div class="form-tips mb10">请输入推送规则，每行一个规则</div>
            <div class="input-text-wrap">
              <textarea v-model="rules | formatRules" rows="8" class="input-text"></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onPushCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
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
      showPushModal: false,
      query: '',
      searching: false,
      total: 0,
      ingredients: [],
      category: 'all',
      categories: [],
      rules: [],
      currentPage: 1,
      pageCount: 10,
      loadingData: false,
      editing: false
    }
  },

  computed: {
    /**
     * 构建食材分类选项
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
     * 食材查询条件
     * @return {Object} 查询条件
     */
    queryCondition () {
      var condition = {
        filter: ['_id', 'name', 'classification', 'created_by', 'created_at'],
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

      return condition
    }
  },

  route: {
    data () {
      // 获取食材分类
      this.getCategories()
      // 获取食材列表
      this.getIngredients()
      // 获取推送规则
      this.getRules()
    }
  },

  methods: {
    /**
     * 获取食材列表
     */
    getIngredients () {
      this.loadingData = true
      api.diet.listIngredient(this.queryCondition).then((res) => {
        if (res.status === 200) {
          // 食材列表
          this.ingredients = res.data.list
          // 记录数
          this.total = res.data.total
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
      // this.categories = [{main: '蔬菜', sub: ['叶菜', '块茎']}, {main: '水果', sub: []}]
      api.diet.listCategory('ingredient_classification').then((res) => {
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
      this.getCategories()
    },

    /**
     * 提交类别编辑
     */
    onCateSubmit () {
      this.editing = true
      api.diet.updateCategory('ingredient_classification', this.categories).then((res) => {
        if (res.status === 200) {
          this.onCateCancel()
        }
      }).catch((error) => {
        this.onCateCancel()
        this.handleError(error)
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
      }).catch((error) => {
        this.handleError(error)
      })
    },

    /**
     * 取消推送编辑
     */
    onPushCancel () {
      this.editing = false
      this.showPushModal = false
      this.getRules()
    },

    /**
     * 提交推送编辑
     */
    onPushSubmit () {
      this.editing = true
      api.diet.updateCategory('push_rules', this.rules).then((res) => {
        if (res.status === 200) {
          this.onPushCancel()
        }
      }).catch((error) => {
        this.onPushCancel()
        this.handleError(error)
      })
    },

    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getIngredients()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getIngredients()
    }
  }
}
</script>

<style lang="stylus" scoped>
.form
  .input-text-wrap
    textarea.input-text
      height 200px
</style>
