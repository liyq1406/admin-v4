<template lang="jade">
section.main-wrap
  .main
    .panel
      .panel-hd
        search-box(:key.sync="query", :active="searching", :placeholder="'昵称'", @cancel="getUsers", @search-activate="toggleSearching", @search-deactivate="toggleSearching", @search="handleSearch")
          button.btn.btn-primary(slot="search-button", @click="getUsers") 搜索
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
            template(v-if="users.length > 0 && !loadingData")
              tr(v-for="user in users")
                td
                  a.hl-red(v-link="{path: '/users/'+user.id}") {{user.id}}
                td {{user.nickname}}
                td
                  span(v-if="user.phone&&user.email") {{user.phone}}/{{user.email}}
                  span(v-if="user.phone") {{user.phone}}
                  span(v-if="user.email") {{user.email}}
                td {{user.create_date | formatDate}}
                td
                  span(v-if="user.source===1") Web
                  span(v-if="user.source===2") Android
                  span(v-if="user.source===3") iOS
                  span(v-if="user.source===4") 微信
                td
                  span(v-if="user.status==1") 正常
                  span(v-if="user.status==2") 停用
            tr(v-if="loadingData")
              td.tac(colspan="6")
                .tips-null
                  i.fa.fa-refresh.fa-spin
                  span 数据加载中...
            tr(v-if="total === 0 && !loadingData")
              td.tac(colspan="6")
                .tips-null
                  span 暂无相关记录
        pager(v-if="!loadingData", :total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getUsers")
</template>

<script>
  var SearchBox = require('../../components/search-box.vue');
  var Modal = require('../../components/modal.vue');
  var api = require('../../api');
  var Pager = require('../../components/pager.vue');

  module.exports = {
    name: 'UserList',

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
        total: 0,
        currentPage: 1,
        pageCount: 10,
        loadingData: false
      };
    },

    route: {
      data: function () {
        this.getUsers();
      }
    },

    computed: {
      queryCondition: function () {
        var condition = {
          filter: ['id', 'phone', 'email', 'nickname', 'create_date', 'source', 'status'],
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: this.sortOrders,
          query: {}
        };

        if (this.query.length > 0) {
          condition.query['nickname'] = { $in: [this.query] };
        }

        return condition;
      }
    },

    methods: {
      // 获取用户
      getUsers: function () {
        var self = this;

        this.loadingData = true;
        api.corp.refreshToken().then(function () {
          api.user.list(self.queryCondition).then(function (data) {
            self.users = data.list;
            self.total = data.count;
            self.loadingData = false;
          }).catch(function (error) {
            self.handleError(error);
            self.loadingData = false;
          });
        });
      },

      // 搜索
      handleSearch: function () {
        if (this.query.length === 0) {
          this.getUsers();
        }
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        this.query = '';
      }
    }
  };

</script>
