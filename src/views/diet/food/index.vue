<template lang="jade">
div
  .panel
    .panel-bd
      //- 操作栏
      .action-bar
        search-box
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
          td 小炒肉
          td xiaolu@xlink.cn
          td 2015-06-11 12:09:11
          td.tac
            a.btn-link.btn-sm(v-link="{path: '/diet/food/123/edit'}") 编辑
      pager(v-if="!loadingData", :total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getFoods")

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
      showPushModal: false,
      total: 0,
      category: 'all',
      categories: [],
      currentPage: 1,
      pageCount: 10,
      loadingData: false,
      editing: false
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
     * 获取食材列表
     */
    getFoods () {

    },

    /**
     * 获取分类
     */
    getCategories () {
      // @TODO 调用获取分类接口
      this.categories = [{main: '蔬菜', sub: ['叶菜', '块茎']}, {main: '水果', sub: []}];
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
.form
  .input-text-wrap
    textarea.input-text
      height 200px
</style>
