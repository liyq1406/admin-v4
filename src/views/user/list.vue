<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          search-box(:key="query", :active="searching", :placeholder="'用户名、邮箱、昵称'", @search="setQuery", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching",)
            label 查找用户
          h2 用户列表
        .panel-bd
          //- 用户列表
          table.table.table-stripe.table-bordered
            thead
              tr
                th 序号
                th 用户名
                th 昵称
                th Email
                th 创建时间
                th 最后一次登录
                th.tac 在线状态
            tbody
              - for(var i=1; i<=10; i++)
                tr
                  td= i
                  td
                    a.hl-red(v-link="{path: '/users/1'}") samxlu
                  td 路路
                  td 8009995558@citicib.com.cn
                  td 2015-6-3 15:38:53
                  td 2015-6-3 15:38:53
                  td.tac
                    if i % 2 === 0
                      span.hl-gray 离线
                    else
                      span.hl-green 在线
          .pager.tar
            button.pager-btn.pager-prev
              i.fa.fa-chevron-left
            input.pager-input(type="text")
            button.pager-btn.pager-next
              i.fa.fa-chevron-right
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
