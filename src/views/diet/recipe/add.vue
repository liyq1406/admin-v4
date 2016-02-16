<template lang="jade">
section.main-wrap.diet
  .main
    .breadcrumb
      a(v-link="{path: '/diet/recipe'}")
        i.fa.fa-arrow-circle-left
        | 菜谱管理
    .panel
      .panel-hd(@click="showSelectFoods=true")
        h2 添加菜谱
      .panel-bd
        .form
          form
            .form-row
              label.form-control 123:
              .controls
                .input-text-wrap(v-placeholder="'请填写菜谱名称'")
                  input.input-text(type="text",lazy,v-model="toAddrecipeObj.title")
                .form-tips.form-tips-error(v-show="false")
                  span 错误提示
            .form-row
              .prompt-box
                |小提示：
                br
                |1、步骤图宽度在150像素至150像素；
                br
                |2、每个步骤用一段话描述，如果不需要可将内容留空；

              .step-box(v-for="n in 4")
                label.form-control 第{{n+1}}步
                .imgInput
                  .selectedImg
                    input(type="file")
                .step-text 123
        modal(:show.sync="showSelectFoods",:width="800")
          h3(slot="header") 选择食材
          .food-box(slot="body")
            .status-bar
              v-select(:options="categoryOptions", :value.sync="category", @select="selectClass")
                span 类别：
              search-box
                button.btn.btn-primary(slot="search-button", @click="searchFoods") {{ $t('common.search') }}
            .toSelectList
              table.table.table-stripe.table-bordered
                thead
                  tr
                    th
                      | 标题
                    th.tac {{ $t('common.action') }}
                tbody
                  tr(v-for="n in 5")
                    td 小炒肉
                    td.tac
                      a.btn-link.btn-sm 添加
              pager(:page-count="1",:total="15",:current.sync="3")
            .selectedList
              table.table.table-stripe.table-bordered
                thead
                  tr
                    th
                      | 已选择
                tbody
                  td.tac
                    a.btn-link.btn-sm 编辑
</template>

<script>
import Modal from '../../../components/modal.vue';
import Pager from '../../../components/pager.vue';
import Select from '../../../components/select.vue';
import SearchBox from '../../../components/search-box.vue';

export default {
  name: 'AddForm',

  components: {
    'v-select': Select,
    'search-box': SearchBox,
    'pager': Pager,
    'modal': Modal
  },
  data () {
    return {
      showSelectFoods: false,
      toAddrecipeObj: {
        title: ''
      },
      category: '全部',
      categoryOptions: [
        {label: '全部', value: '全部'},
        {label: '蔬菜', value: '蔬菜'},
        {label: '水果', value: '水果'}
      ]
    };
  },

  methods: {
    selectClass () {
      var self = this;
      console.log(self);
    },
    searchFoods () {

    }
  }
};
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'
  .diet
    .panel
      .panel-bd
        .form-row
          max-height 5000px
          .prompt-box
            width 96%
            height auto
            margin 20px auto
            border 1px solid #ccc
            padding 10px
          .step-box
            margin-bottom 20px
            clearfix()
            label.form-control
              text-align right
              line-height 120px
              padding-right 20px
              box-sizing border-box
            .imgInput
              float left
              padding-top 10px
              .selectedImg
                position relative
                float left
                width 100px
                height 100px
                background red
                margin 0 20px
                input
                  position absolute
                  left 0
                  top 0
                  opacity 0.5
                  width 100%
                  height 100%

            .step-text
              float left
              width 60%
              height 120px
              border 1px solid #ccc
      .modal
        .modal-body
          clearfix()
          .status-bar
            .v-select
              float left
              display inline-block
            .search-box
              float right
          .toSelectList
            width 68%
            float left
            .pager
              margin-top 10px
          .selectedList
            width 30%
            float right


</style>
