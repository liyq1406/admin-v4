<template lang="jade">
  section.main-wrap
    .main
      .panel
        .panel-hd
          search-box(:key.sync="query", :auto="true", :active="searching", :placeholder="'用户名、邮箱、昵称'", @cancel="cancelSearching", @search-activate="toggleSearching", @search-deactivate="toggleSearching")
            label 查找用户
          h2 用户列表
        .panel-bd
          //- 用户列表
          table.table.table-stripe.table-bordered
            thead
              tr
                th id
                th 昵称
                th 手机号或邮箱
                th 创建时间
                th 用户来源
                th 状态
            tbody
              tr(v-for="user in users | filterBy query in 'email' 'nickname' | limitBy pageCount (currentPage-1)*pageCount")
                td
                  a.hl-red(v-link="{path: '/users/'+user.id}") {{user.id}}
                td {{user.nickname}}
                td
                  span(v-if="user.phone&&user.email") {{user.phone}}/{{user.email}}
                  span(v-if="user.phone") {{user.phone}}
                  span(v-if="user.email") {{user.email}}
                td {{user.create_date}}
                td
                  span(v-if="user.source===1") Web
                  span(v-if="user.source===2") Android
                  span(v-if="user.source===3") iOS
                  span(v-if="user.source===4") 微信
                td
                  span(v-if="user.status==1") 正常
                  span(v-if="user.status==2") 停用
              tr(v-if="users.length === 0")
                td.tac(colspan="6")
                  i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                  .tips-null(v-else) 查无此用户
          pager(:total="users.length", :current.sync="currentPage", :page-count="pageCount")
</template>

<script>
  var SearchBox = require('../../components/search-box.vue');
  var Modal = require('../../components/modal.vue');
  var api = require('../../api');
  var Pager = require('../../components/pager.vue');

  module.exports = {
    components: {
      'search-box': SearchBox,
      'modal': Modal,
      'api': api,
      'pager': Pager
    },

    data: function () {
      return {
        query: '',
        searching: false,
        users: [],
        currentPage: 1,
        pageCount: 1
      }
    },

    route: {
      data: function () {
        return {
          users: this.getUsers()
        }
      }
    },

    methods: {
      getUsers: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.user.list({ filter:["id","phone","email","nickname","create_date","source","status"]});
        });
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        this.query = '';
      }
      //searchuser
    }
  };

</script>
