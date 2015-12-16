<template lang="jade">
  section.main-wrap
    .main
      .breadcrumb
        a(v-link="{path: '/data/tables' }")
          i.fa.fa-arrow-circle-left
          | 数据管理
      .row
        .col-20
          .panel
            .panel-hd
              h2 数据表详情
            .panel-bd
              //- 操作栏
              //-
              .action-bar
                //-
                  search-box(:key.sync="query", :active="searching", :placeholder="'请输入 mac 地址'", @cancel="getRecords", @search-activate="toggleSearching", @search-deactivate="toggleSearching", @search="handleSearch")
                    button.btn.btn-primary(slot="search-button", @click="getRecords") 搜索
                .action-group
                  button.btn.btn-success(@click="showAddModal = true")
                    i.fa.fa-plus
                    | 添加数据
              //- 数据
              table.table.table-stripe.table-bordered
                thead
                  tr
                    th ID
                    th 数据
                tbody
                  tr(v-for="record in records")
                    td {{record.id}}
                    td {{record.value}}
                  tr(v-if="records.length === 0")
                    td.tac(colspan="4")
                      i.fa.fa-refresh.fa-spin(v-if="$loadingRouteData")
                      .tips-null(v-else) 暂无数据记录
              //pager(:total="records.length", :current.sync="currentPage", :page-count="pageCount")

    // 添加数据浮层
    modal(:show.sync="showAddModal")
      h3(slot="header") 添加数据
      .form(slot="body")
        form(v-form, name="addValidation", @submit.prevent="onAddSubmit")
          .form-row(v-for="(key, val) in tableInfo.field")
            label.form-control {{key}}：
            .controls
              .input-text-wrap(v-if="val === 'string'")
                input.input-text(v-model="addModel[key]", type="text")

</template>

<script>
  var api = require('../../api');
  var Pager = require('../../components/pager.vue');
  var Pager = require('../../components/pager.vue');
  var Modal = require('../../components/modal.vue');
  var SearchBox = require('../../components/search-box.vue');

  module.exports = {
    components: {
      'modal': Modal,
      'search-box': SearchBox,
      'pager': Pager
    },

    data: function () {
      return {
        query: '',
        searching: false,
        tableInfo: {},
        records: [],
        currentPage: 1,
        pageCount: 10,
        showAddModal: false,
        addModel: {},
        addValidation: {}
      };
    },

    route: {
      data: function () {
        return {
          // records: this.getRecords()
          records: [],
          tableInfo: this.getTableInfo()
        }
      }
    },

    methods: {
      handleSearch: function () {
        if (this.query.length === 0) {
          this.queryData();
        }
      },

      toggleSearching: function () {
        this.searching = !this.searching;
      },

      cancelSearching: function () {
        var self = this;
        this.getAllData().then(function (data) {
          self.records = data;
        });
      },

      getRecords: function (params) {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.dataTable.queryData(self.$route.params.name, params);
        })
      },

      getTableInfo: function () {
        var self = this;
        return api.corp.refreshToken().then(function () {
          return api.dataTable.getTable(self.$route.params.name);
        })
      },

      queryData: function () {

      },

      onAddSubmit: function () {

      }

    }
  };
</script>
