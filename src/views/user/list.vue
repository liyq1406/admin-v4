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
                th id
                th 昵称
                th 手机号或邮箱
                th 创建时间
                th 用户来源
                th 状态
            tbody(v-for="user in users.list")
                tr
                  td
                    a.hl-red(v-link="{path: '/users/'+user.id}") {{user.id}}
                  td {{user.nickname}}
                  td(v-if="user.phone&&user.email") {{user.phone}}/{{user.email}}
                  td(v-if="user.phone") {{user.phone}}
                  td(v-if="user.email") {{user.email}}
                  td {{user.create_date}}
                  td(v-if="user.source==1") Web
                  td(v-if="user.source==2") Android
                  td(v-if="user.source==3") IOS
                  td(v-if="user.source==4") 微信
                  td(v-if="user.status==1") 正常
                  td(v-if="user.status==2") 停用
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
          api.user.list({ "filter":["id","phone","email","nickname","create_date","source","status"]}).then(function (data) {
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
