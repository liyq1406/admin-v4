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
                th id
                th 昵称
                th 手机号/邮箱
                th 创建时间
                th 用户来源

            tbody(v-for="user in users.list")
                tr
                  td
                    a.hl-red(v-link="{path: '/users/1'}") {{user.id}}
                  td {{user.nickname}}
                  td {{user.phone/email}}
                  td {{user.create_date}}
                  td {{user.source}}
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
  var Modal = require('../../components/modal.vue');
  var api = require('../../api');

  module.exports = {
    components: {
      'search-box': SearchBox,
      'modal': Modal,
      'api': api
    },

    data: function () {
      return {
        query: '',
        searching: false,
        users: {}
      }
    },

    route: {
      data: function () {
        var self = this;
        api.corp.refreshToken().then(function () {
          api.user.list().then(function (data) {
            if(__DEBUG__) {
              console.log(data);
            }
            self.users=data;
            console.log(self.users.list)
          });
        })
        return {};
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
