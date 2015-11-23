<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          search-box(:key="query", :active="searching", :placeholder="'支持用户名、邮箱、昵称'", @search="setQuery", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching",)
            label 查找用户
          h2 用户列表
        .panel-bd
          //- 用户列表
</template>

<style lang="stylus">
  @import '../../assets/stylus/common'

</style>

<script>
  var SearchBox = require('../../components/search-box.vue');

  module.exports = {
    components: {
      'search-box': SearchBox
    },

    data: function () {
      return {
        query: '',
        searching: false,
        users: []
      }
    },

    methods: {
      setQuery: function (query) {
        this.query = query;
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        this.setQuery('');
      }
    }
  };
</script>