<template lang="jade">
.panel
  .panel-bd
    //- 操作栏
    .action-bar
      search-box(:placeholder="'请输入关键字'")
        button.btn.btn-primary(slot="search-button") {{ $t('common.search') }}
      .action-group
        button.btn.btn-success()
          i.fa.fa-plus
          | 添加菜谱
        button.btn.btn-success()
          i.fa.fa-list-ol
          | 类别管理

    //- 状态栏
    .status-bar
      .status 123
        //- | 共有
        //- span {{total}}
        //- | 条结果
      v-select(:options="categoryOptions",@select="getRecipes")
        span 类别：


</template>

<script>
// import Vue from 'vue';
// import api from '../../api';
import Select from '../../../components/select.vue';
// import Pager from '../../components/pager.vue';
// import Modal from '../../components/modal.vue';
import SearchBox from '../../../components/search-box.vue';
// import locales from '../../consts/locales';
// import _ from 'lodash';

export default {

  components: {
    'v-select': Select,
    'search-box': SearchBox
  },
  data () {
    return {
      categoryOptions: []
    };
  },

  methods: {
    getRecipes () {
      var self = this;
      console.log(self);
    }
  }
};
</script>

<style lang="stylus">
</style>
