<template lang="jade">
div.recipe-box
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        search-box
          button.btn.btn-primary(slot="search-button", @click="getRecipes") {{ $t('common.search') }}
        .action-group
          a.btn.btn-success(v-link="{path: '/diet/recipe/add'}")
            i.fa.fa-plus
            | 添加菜谱
          button.btn.btn-success(@click="showCategoryModal = true")
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
          tr(v-for="n in 10")
            td 小炒肉{{n}}
            td xiaolu@xlink.cn
            td 2015-06-11 12:09:11
            td.tac
              a.btn-link.btn-sm(v-link="{path: '/diet/recipe/123/edit'}") 编辑
        pager(v-if="!loadingData", :total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getRecipes")

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
// import api from '../../api';
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

  data () {
    return {
      showCategoryModal: false,
      total: 0,
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
    categoryOptions () {
      var arr = [{label: '全部', value: 'all'}];
      this.categories.map((item) => {
        let obj = {};
        obj.label = item.main;
        obj.value = item.main;
        arr.push(obj);
      });
      return arr;
    }
  },

  ready () {
    this.getCategories();
  },

  methods: {
    /**
     * 获取菜谱列表
     */
    getRecipes () {

    },

    /**
     * 获取分类
     */
    getCategories () {
      // @TODO 调用获取分类接口
      this.categories = [{main: '粤菜', sub: ['客家菜', '顺德菜']}, {main: '东北菜', sub: []}];
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

    }
  }
};
</script>

<style lang="stylus">
.recipe-box
  .v-select
    display inline-block
    margin-right 30px

.form
  .input-text-wrap
    textarea.input-text
      height 200px
</style>
