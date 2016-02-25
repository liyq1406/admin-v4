<template lang="jade">
div.recipe-box
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        search-box(:key.sync="query", :active="searching", :placeholder="$t('ingredient.placeholders.search')", @cancel="getRecipes", @search-activate="toggleSearching", @search-deactivate="toggleSearching", @search="handleSearch", @press-enter="getRecipes")
          button.btn.btn-primary(slot="search-button", @click="getRecipes") {{ $t('common.search') }}
        .action-group
          a.btn.btn-success(v-link="{path: '/diet/recipe/add'}")
            i.fa.fa-plus
            | 添加菜谱
          button.btn.btn-success(@click="showCategoryModal=true")
            i.fa.fa-list-ul
            | 类别管理
      //- 状态栏
      .status-bar
        .status {{{ $t('common.total_results', {count:total}) }}}
        v-select(:options="categoryOptions", :value.sync="category", @select="getRecipes")
          span 类别：
        v-select(:options="deviceOptions", :value.sync="device", @select="getRecipes")
          span 烹饪设备：
      //- 食材列表
      table.table.table-stripe.table-bordered
        thead
          tr
            th
              | 标题
            th
              | 创建者
            th
              | 创建时间
            th.tac {{ $t('common.action') }}
        tbody
          template(v-if="recipes.length > 0 && !loadingData")
            tr(v-for="recipe in recipes")
              td {{recipe.name}}
              td {{recipe.created_by}}
              td {{recipe.created_at | formatDate}}
              td.tac
                a.btn-link.btn-sm(v-link="{path: '/diet/recipe/'+recipe._id+'/edit'}") 编辑
          tr(v-if="loadingData")
            td.tac(colspan="4")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span {{ $t("common.data_loading") }}
          tr(v-if="recipes.length === 0 && !loadingData")
            td.tac(colspan="4")
              .tips-null
                span {{ $t("common.no_records") }}
      pager(v-if="!loadingData && total > pageCount", :total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getRecipes")

  // 类别管理浮层
  modal(:show.sync="showCategoryModal")
    h3(slot="header") 类别管理
    .form(slot="body")
      form(@submit.prevent="onCateSubmit")
        .form-row
          .form-tips.mb10 请输入菜谱类别，每行一个类别
          .input-text-wrap
            textarea.input-text(v-model="categories | formatCategories", rows="8")
        .form-actions
          button.btn.btn-default(@click.prevent.stop="onCateCancel") {{ $t("common.cancel") }}
          button.btn.btn-primary(type="submit", :disabled="editing", :class="{'disabled':editing}", v-text="editing ? $t('common.handling') : $t('common.ok')")
</template>

<script>
import api from '../../../api';
import Select from '../../../components/select.vue';
import Pager from '../../../components/pager.vue';
import Modal from '../../../components/modal.vue';
import SearchBox from '../../../components/search-box.vue';

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
    };
  },

  computed: {
    /**
     * 构建菜谱分类选项
     * @return {Array} 分类选项
     */
    categoryOptions () {
      var arr = [{label: '全部', value: 'all'}];
      this.categories.map((item) => {
        let obj = {};
        obj.label = item.main;
        obj.value = item.main;
        arr.push(obj);
      });
      return arr;
    },

    /**
     * 菜谱查询条件
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
      };

      if (this.query.length > 0) {
        condition.query['name'] = { $like: this.query };
      }

      if (this.category === 'all') {
        delete condition.query['classification.main'];
      } else {
        condition.query['classification.main'] = { $in: [this.category] };
      }

      if (this.device === 'all') {
        delete condition.query['devices.name'];
      } else {
        condition.query['devices.name'] = { $in: [this.device] };
      }

      return condition;
    }
  },

  route: {
    data () {
      // 获取菜谱类别
      this.getCategories();
      // 获取菜谱列表
      this.getRecipes();
    }
  },

  methods: {
    /**
     * 获取菜谱列表
     */
    getRecipes () {
      this.loadingData = true;
      api.diet.listRecipe(this.queryCondition).then((data) => {
        // 菜谱列表
        this.recipes = data.list;
        // 记录数
        this.total = data.count;
        this.loadingData = false;
      }).catch((error) => {
        this.handleError(error);
        this.loadingData = false;
      });
    },

    /**
     * 获取分类
     */
    getCategories () {
      // this.categories = [{main: '粤菜', sub: ['客家菜', '顺德菜']}, {main: '东北菜', sub: []}];
      api.diet.listCategory('recipe_classification').then((data) => {
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
     * 取消类别编辑
     */
    onCateCancel () {
      this.editing = false;
      this.showCategoryModal = false;
      // this.getCategories();
    },

    /**
     * 提交类别编辑
     */
    onCateSubmit () {
      this.editing = true;
      api.diet.updateCategory('recipe_classification', this.categories).then((data) => {
        this.onCateCancel();
      }).catch((error) => {
        this.onCateCancel();
        self.handleError(error);
      });
    },

    // 搜索
    handleSearch: function () {
      if (this.query.length === 0) {
        this.getRecipes();
      }
    },

    // 切换搜索
    toggleSearching: function () {
      this.searching = !this.searching;
    },

    // 取消搜索
    cancelSearching: function () {
      this.getRecipes();
    }
  }
};
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
