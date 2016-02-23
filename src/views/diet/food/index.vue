<template lang="jade">
div
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        search-box(:key.sync="query", :active="searching", :placeholder="$t('food.placeholders.search')", @cancel="getFoods", @search-activate="toggleSearching", @search-deactivate="toggleSearching", @search="handleSearch", @press-enter="getFoods")
          button.btn.btn-primary(slot="search-button", @click="getFoods") {{ $t('common.search') }}
        .action-group
          a.btn.btn-success(v-link="{path: '/diet/food/add'}")
            i.fa.fa-plus
            | 添加食材
          button.btn.btn-success(@click="showCategoryModal = true")
            i.fa.fa-list-ul
            | 类别管理
          button.btn.btn-success(@click="showPushModal = true")
            i.fa.fa-share
            | 推送管理
      //- 状态栏
      .status-bar
        .status {{{ $t('common.total_results', {count:total}) }}}
        v-select(:options="categoryOptions", :value.sync="category", @select="getFoods")
          span 类别：

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
          template(v-if="foods.length > 0 && !loadingData")
            tr(v-for="food in foods")
              td {{food.name}}
              td {{food.created_by}}
              td {{food.created_at | formatDate}}
              td.tac
                a.btn-link.btn-sm(v-link="{path: '/diet/food/'+food._id+'/edit'}") 编辑
          tr(v-if="loadingData")
            td.tac(colspan="4")
              .tips-null
                i.fa.fa-refresh.fa-spin
                span {{ $t("common.data_loading") }}
          tr(v-if="foods.length === 0 && !loadingData")
            td.tac(colspan="4")
              .tips-null
                span {{ $t("common.no_records") }}
      pager(v-if="!loadingData && total > pageCount", :total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getFoods")

  // 类别管理浮层
  modal(:show.sync="showCategoryModal")
    h3(slot="header") 类别管理
    .form(slot="body")
      form(@submit.prevent="onCateSubmit")
        .form-row
          .form-tips.mb10 请输入食材类别，每行一个类别
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
  name: 'FoodList',

  components: {
    'v-select': Select,
    'modal': Modal,
    'search-box': SearchBox,
    'pager': Pager
  },

  data (a, b, c) {
    return {
      showCategoryModal: false,
      showPushModal: false,
      query: '',
      searching: false,
      total: 0,
      foods: [],
      category: 'all',
      categories: [],
      currentPage: 1,
      pageCount: 10,
      loadingData: false,
      editing: false
    };
  },

  computed: {
    /**
     * 构建食材分类选项
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
      };

      if (this.query.length > 0) {
        condition.query['name'] = { $like: this.query };
      }

      if (this.category === 'all') {
        delete condition.query['classification.main'];
      } else {
        condition.query['classification.main'] = { $in: [this.category] };
      }

      return condition;
    }
  },

  route: {
    data () {
      this.getCategories();
      this.getFoods();
    }
  },

  methods: {
    /**
     * 获取食材列表
     */
    getFoods () {
      this.loadingData = true;
      api.diet.listFood(this.queryCondition).then((data) => {
        // 食材列表
        this.foods = data.list;
        // 记录数
        this.total = data.total;
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
      // this.categories = [{main: '蔬菜', sub: ['叶菜', '块茎']}, {main: '水果', sub: []}];
      api.diet.listCategory('recipe_Ingredients').then((data) => {
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
      this.getCategories();
    },

    /**
     * 提交类别编辑
     */
    onCateSubmit () {
      this.editing = true;
      api.diet.editCategory('recipe_Ingredients', this.categories).then((data) => {
        console.log(data.status);
        this.onCateCancel();
      }).catch((error) => {
        this.onCateCancel();
        self.handleError(error);
      });
    },

    // 搜索
    handleSearch: function () {
      if (this.query.length === 0) {
        this.getFoods();
      }
    },

    // 切换搜索
    toggleSearching: function () {
      this.searching = !this.searching;
    },

    // 取消搜索
    cancelSearching: function () {
      this.getFoods();
    }
  }
};
</script>

<style lang="stylus" scoped>
.form
  .input-text-wrap
    textarea.input-text
      height 200px
</style>
