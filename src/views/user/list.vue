<template lang="jade">
.panel
  .panel-hd
    search-box(:key.sync="query", :active="searching", @cancel="getUsers", :placeholder="$t('user.fields.account')", @search-activate="toggleSearching", @search-deactivate="toggleSearching", @search="handleSearch", @press-enter="getUsers")
      button.btn.btn-primary(slot="search-button", @click="getUsers") {{ $t('common.search') }}
      label {{ $t('user.search_user') }}
    h2 {{ $t('user.list') }}
  .panel-bd
    //- 用户列表
    table.table.table-stripe.table-bordered
      thead
        tr
          th ID
          th {{ $t('user.fields.nick_name') }}
          th {{ $t('user.fields.account') }}
          th {{ $t('user.fields.create_time') }}
          th {{ $t('user.fields.source') }}
          th {{ $t('common.status') }}
      tbody
        template(v-if="users.length > 0 && !loadingData")
          tr(v-for="user in users")
            td
              a.hl-red(v-link="{path: '/user/'+user.id}") {{user.id}}
            td {{user.nickname}}
            td {{user.account}}
            td {{user.create_date | formatDate}}
            td
              span(v-if="user.source===1") Web
              span(v-if="user.source===2") Android
              span(v-if="user.source===3") iOS
              span(v-if="user.source===4") {{ $('common.wechat') }}
            td
              span(v-if="user.status==1") {{ $t('user.status.normal') }}
              span(v-if="user.status==2") {{ $t('user.status.banned') }}
        tr(v-if="loadingData")
          td.tac(colspan="6")
            .tips-null
              i.fa.fa-refresh.fa-spin
              span {{ $t("common.data_loading") }}
        tr(v-if="total === 0 && !loadingData")
          td.tac(colspan="6")
            .tips-null
              span {{ $t("common.no_records") }}
    pager(v-if="!loadingData", :total="total", :current.sync="currentPage", :page-count="pageCount", @page-update="getUsers")
</template>

<script>
  import SearchBox from '../../components/search-box.vue';
  import Modal from '../../components/modal.vue';
  import api from '../../api';
  import Pager from '../../components/pager.vue';

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
          filter: ['id', 'account', 'nickname', 'create_date', 'source', 'status'],
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: {'create_date': 'desc'},
          query: {}
        };

        if (this.query.length > 0) {
          condition.query['account'] = { $like: this.query };
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
